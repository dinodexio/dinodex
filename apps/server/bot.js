
import cors from 'cors'
import express from 'express'
import { clientBot as clientBotAppChain } from "chain";
import { PublicKey } from 'o1js';
import { bot_user_faucet, setup as setupBotDB } from './db-bot';
import { MemoLeaderboard } from './components/MemoLeaderboard';
import ClientMinaSigner from "mina-signer"
import pg from "pg"
import { BalancesKey, TokenId } from '@proto-kit/library';

const SORT_TYPE_LEADERBOARD = Object.freeze({
  TOTAL_VOL: "total_vol",
  PNL: "pnl"
});

const app = express();
const { Client: ClientPg } = pg
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const PORT = process.env.NEXT_PUBLIC_SERVER_APP_PORT || 3333
const HOST = process.env.SERVER_APP_HOST || "http://localhost"

await clientBotAppChain.start()

await setupBotDB()

const _pgClient = new ClientPg({
  host: process.env.PROCESSOR_POSTGRES_HOST,
  port: process.env.PROCESSOR_POSTGRES_PORT,
  user: process.env.PROCESSOR_POSTGRES_USER,
  password: process.env.PROCESSOR_POSTGRES_PASSWORD,
  database: process.env.PROCESSOR_POSTGRES_DB,
  schema: "public"
});

await _pgClient.connect();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class BotError extends Error {
  constructor(message, code) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.code = code
  }
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

async function mainLoopUpdateBalances() {
  do {
    const dataWaitForUpdate = await _pgClient.query(
      `SELECT address, "tokenId" FROM "Balance" WHERE "waitForUpdate" = TRUE;`,
      []
    )
    const listUpdate = []
    for (let i = 0; i < dataWaitForUpdate.rows.length; i++) {
      const { address, tokenId } = dataWaitForUpdate.rows[i]
      const balanceKey = BalancesKey.from(TokenId.from(tokenId), PublicKey.fromBase58(address))
      const amount = await clientBotAppChain.query.runtime.Balances.balances.get(balanceKey)
      listUpdate.push({
        amount: amount.toString(),
        address,
        tokenId
      })
    }

    const frameSize = 50
    for (let startIndex = 0; startIndex < listUpdate.length; startIndex = startIndex + frameSize) {
      const endIndex = (startIndex + frameSize) >= listUpdate.length
        ? startIndex + frameSize
        : listUpdate.length - 1
      const processUpdate = listUpdate.slice(startIndex, endIndex)
      let listAddressUpdate = [...new Set(processUpdate.map(data => data.address))]
      let listIdUpdate = [...new Set(processUpdate.map(data => data.tokenId))]
      let setCaseAmountStatement = processUpdate.reduce((resultState, { address, amount, tokenId }) => {
        return `${resultState} WHEN "tokenId" = '${tokenId}' AND address = '${address}' THEN '${amount}'`
      }, '')

      const updateStatement = `UPDATE "Balance"
        SET 
          "waitForUpdate" = FALSE,
          amount = CASE 
                 ${setCaseAmountStatement}
              END
        WHERE
          address IN (${listAddressUpdate.map(address => `'${address}'`).join(', ')})
          AND "tokenId" IN (${listIdUpdate.map(tokenId => `'${tokenId}'`).join(', ')})
          ;
        `
      await _pgClient.query(updateStatement)
    }

    await sleep(5 * 1000)
  } while (true);

}

mainLoop()
mainLoopUpdateBalances()

app.post('/dripBundle', async (req, res) => {
  const { address = '', signature = {} } = req.body
  try {
    if (!address) {
      throw new BotError("Address invalid!", "E_ADDRESS_INVALID")
    }

    const isAddressDrip = await bot_user_faucet.checkAddressDrip(address)
    if (isAddressDrip) {
      throw new BotError("You have been drip!", "E_ADDRESS_HAS_BEEN_DRIP")
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
        throw new BotError("You need a minimum balance of 1 MINA on the mainnet.", "E_OWN_MINA_TOKEN")
      }
    }

    {
      var signerClient = new ClientMinaSigner({ network: "testnet" });
      const verifyBody = {
        data: "Hello, Dinodex!",
        publicKey: address,
        signature: signature,
      }
      const verifyResult = signerClient.verifyMessage(verifyBody);
      if (!verifyResult) {
        throw new BotError("Looks like you're not from Dinodex!", "E_ACCESS_DINODEX")
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
  } catch ({ message, code }) {
    res.json({ error: true, message, error_code: code })
  }
})

app.get('/leaderboard', async (req, res) => {
  const { sortType = SORT_TYPE_LEADERBOARD.VOLUME } = req.query
  switch (sortType) {
    case SORT_TYPE_LEADERBOARD.TOTAL_VOL:
      res.json(MemoLeaderboard.convertAndSort('totalVolume', 'desc', MemoLeaderboard.data).slice(0, 12))
      break;
    case SORT_TYPE_LEADERBOARD.PNL:
      res.json(MemoLeaderboard.convertAndSort('pnl', 'desc', MemoLeaderboard.data).slice(0, 12))
      break;

    default:
      res.json(MemoLeaderboard.sortTotalVolume.slice(0, 12))
      break;
  }

})

app.listen(PORT, () => {
  console.log(`Server is running at ${HOST}:${PORT}`);
})