
import cors from 'cors'
import express from 'express'
import { clientBot as clientBotAppChain } from "chain";
import { PublicKey } from 'o1js';
import { bot_user_faucet, clear, setup as setupBotDB } from './db-bot';
import { MemoLeaderboard } from './components/MemoLeaderboard';

const app = express();
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const PORT = process.env.NEXT_PUBLIC_SERVER_APP_PORT || 3333
const HOST = process.env.SERVER_APP_HOST || "http://localhost"

await clientBotAppChain.start()

await setupBotDB()

function sleep(ms) {
  return new Promise(resolve=>setTimeout(resolve, ms))
}

async function mainLoop() {
  MemoLeaderboard.init(clientBotAppChain)
  do {
    const unproven = await clientBotAppChain.query.network.unproven
    const maxBlockHeight = Number(unproven.block.height)
    if (maxBlockHeight > MemoLeaderboard.blockHeight) {
      for (var blockHeight = MemoLeaderboard.blockHeight; blockHeight <= maxBlockHeight; blockHeight++) {
        await MemoLeaderboard.loadLeaderboard()
      }
    }
    await sleep(MemoLeaderboard.space_time)
  } while (true);
  
}
mainLoop()

app.post('/dripBundle', async (req, res) => {
  const { address = '' } = req.body
  try {
    if (!address) {
      throw Error("Address invalid!")
    }

    const isAddressDrip = await bot_user_faucet.checkAddressDrip(address)
    if (isAddressDrip) {
      throw Error("Address has been drip!")
    }

    {
      const balanceMinaRes = await fetch(
        `https://api.minaexplorer.com/accounts/${address}`
      )
      const balanceMina = await balanceMinaRes.json()
      const { account: {
        balance: {
          total: totalMinaOfAddress = "0"
        } = {}
      } = {} } = balanceMina

      if (Number(totalMinaOfAddress) < 1) {
        throw Error("Address do not own 1 Mina Token!")
      }
    }

    const unproven = await clientBotAppChain.query.network.unproven
    const blockHeight = Number(unproven.block.height)
    const faucetModule = clientBotAppChain.runtime.resolve("Faucet");
    const addressPublicKey = PublicKey.fromBase58(address)
    const publicKey = faucetModule.config.factory
    const tx = await clientBotAppChain.transaction(publicKey, async () => {
      await faucetModule.dripBundleTo(addressPublicKey)
    })

    await tx.sign()
    await tx.send();

    await bot_user_faucet.insert({
      blockHeight: blockHeight,
      isDrip: true,
      wallet: address
    })

    res.json({
      error: false, message: {
        ...tx.transaction,
        hash: tx.transaction.hash()
      }
    })
  } catch (error) {
    res.json({ error: true, message: String(error) })
  }
})

app.get('/leaderboard', async (req, res) => {
  res.json(MemoLeaderboard.sortTotalVolume.slice(0, 12))
})

app.listen(PORT, () => {
  console.log(`Server is running at ${HOST}:${PORT}`);
})