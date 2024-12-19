import {
  clientBot as clientBotAppChain,
  clientBotTrade0,
  clientBotTrade1,
  clientBotTrade2,
  clientBotTrade3,
  clientBotTrade4,
  clientBotTrade5,
  clientBotTrade6,
  clientBotTrade7,
  createConfigForAppChainPrivateKeySigner,
  TokenIdPath
} from "chain";
import { PublicKey } from 'o1js';
import ClientMinaSigner from "mina-signer"
import { BalancesKey, TokenId, Balance } from '@proto-kit/library';
import { BOT_STORES } from "./wallet";
import { Mutex, Semaphore, withTimeout } from 'async-mutex';

const mutex = new Mutex();

clientBotTrade0.configurePartial(createConfigForAppChainPrivateKeySigner(BOT_STORES[0].privateKey));
clientBotTrade1.configurePartial(createConfigForAppChainPrivateKeySigner(BOT_STORES[1].privateKey));
clientBotTrade2.configurePartial(createConfigForAppChainPrivateKeySigner(BOT_STORES[2].privateKey));
clientBotTrade3.configurePartial(createConfigForAppChainPrivateKeySigner(BOT_STORES[3].privateKey));
clientBotTrade4.configurePartial(createConfigForAppChainPrivateKeySigner(BOT_STORES[4].privateKey));
clientBotTrade5.configurePartial(createConfigForAppChainPrivateKeySigner(BOT_STORES[5].privateKey));
clientBotTrade6.configurePartial(createConfigForAppChainPrivateKeySigner(BOT_STORES[6].privateKey));
clientBotTrade7.configurePartial(createConfigForAppChainPrivateKeySigner(BOT_STORES[7].privateKey));

const clientBotTrade = [
  clientBotTrade0, clientBotTrade1, clientBotTrade2, clientBotTrade3, clientBotTrade4, clientBotTrade5, clientBotTrade6, clientBotTrade7
];

const renderClientBotTrade = async (clientBotTradeSelected, privateKey) => {
  clientBotTradeSelected.configurePartial(createConfigForAppChainPrivateKeySigner(privateKey));
  await clientBotTradeSelected.start();
  return clientBotTradeSelected;
}

// await clientBotAppChain.start();

// await clientBotTrade0.start();
// await clientBotTrade1.start();
// await clientBotTrade2.start();
// await clientBotTrade3.start();
// await clientBotTrade4.start();
// await clientBotTrade5.start();
// await clientBotTrade6.start();
// await clientBotTrade7.start();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const faucetToken = async (address, tokenId, amount) => {
  await clientBotAppChain.start();
  const faucetModule = clientBotAppChain.runtime.resolve("Faucet");
  const addressPublicKey = PublicKey.fromBase58(address);
  const publicKey = faucetModule.config.factory;
  const tx = await clientBotAppChain.transaction(publicKey, async () => {
    await faucetModule.dripSignedTo(TokenId.from(tokenId), addressPublicKey, Balance.from(amount));
  })

  await tx.sign()
  await tx.send();
}

const checkBalance = async (clientBot, address, tokenId) => {
  // const timeTemp = Date.now();
  // console.log(timeTemp/1000);
  await clientBot.start();
  // console.log((Date.now() - timeTemp)/1000);
  const key = BalancesKey.from(
    TokenId.from(tokenId),
    PublicKey.fromBase58(address),
  );
  const balance = await clientBot.query.runtime.Balances.balances.get(key);
  // console.log(address, JSON.stringify(balance), balance, balance?.value?.value[1][1]);
  // console.log((Date.now() - timeTemp)/1000);
  return {
    tokenId: tokenId,
    balance: balance?.value?.value[1][1] ?? 0
  }

}

const swapToken = async (clientBot, botSelectedAddress, tokenIdPath, amountIn) => {
  // await clientBot.start();
  const xykModule = clientBot.runtime.resolve("XYK");
  const tx = await clientBot.transaction(PublicKey.fromBase58(botSelectedAddress), async () => {
    await xykModule.sellPathSigned(
      tokenIdPath,
      Balance.from(amountIn),
      Balance.from(0),
    );
  });
  await tx.sign();
  await tx.send();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // Includes both min and max
}

const periodicBot = async () => {
  var start = 0;
  do {
    const release = await mutex.acquire();
    try {
      // const botSelectedIndex = start % BOT_STORES.length;
      const botSelectedIndex = start % 5;
      start++;
      const botSelected = await renderClientBotTrade(clientBotTrade0, BOT_STORES[botSelectedIndex].privateKey);
      const mode = getRandomInt(0, 1);
      const tokenIdSelected = getRandomInt(1, 2);
      const tokenBalance = await checkBalance(botSelected, BOT_STORES[botSelectedIndex].publicKey, tokenIdSelected);
      if (mode == 1 && tokenBalance.balance > 0) {
        const sellPercent = getRandomInt(1, 5);
        const swapBalance = tokenBalance.balance / BigInt(sellPercent);
        const tokenIdPath = TokenIdPath.from([TokenId.from(tokenIdSelected), TokenId.from(0), TokenId.from("99999")]);
        await swapToken(botSelected, BOT_STORES[botSelectedIndex].publicKey, tokenIdPath, swapBalance);
      } else {
        const tokenIdPath = TokenIdPath.from([TokenId.from(0), TokenId.from(tokenIdSelected), TokenId.from("99999")]);
        await swapToken(botSelected, BOT_STORES[botSelectedIndex].publicKey, tokenIdPath, BigInt(getRandomInt(1, 50)) * 10n ** 9n);
      }
      release();
      await sleep(getRandomInt(1, 20) * 1000);
    } catch (error) {

    } finally {
      release();
    }
  } while (true);
}
const waveBot = async () => {
  var start = 0;
  do {
    const release = await mutex.acquire();
    try {
      // const botSelectedIndex = start % BOT_STORES.length;
      const botSelectedIndex = 5 + start % 5;
      start++;
      const botSelected = await renderClientBotTrade(clientBotTrade1, BOT_STORES[botSelectedIndex].privateKey);
      const mode = getRandomInt(0, 1);
      const tokenIdSelected = getRandomInt(1, 2);
      const tokenBalance = await checkBalance(botSelected, BOT_STORES[botSelectedIndex].publicKey, tokenIdSelected);
      if (mode == 1 && tokenBalance.balance > 0) {
        const sellPercent = getRandomInt(1, 5);
        const swapBalance = tokenBalance.balance / BigInt(sellPercent);
        const tokenIdPath = TokenIdPath.from([TokenId.from(tokenIdSelected), TokenId.from(0), TokenId.from("99999")]);
        await swapToken(botSelected, BOT_STORES[botSelectedIndex].publicKey, tokenIdPath, swapBalance);
      } else {
        const tokenIdPath = TokenIdPath.from([TokenId.from(0), TokenId.from(tokenIdSelected), TokenId.from("99999")]);
        await swapToken(botSelected, BOT_STORES[botSelectedIndex].publicKey, tokenIdPath, BigInt(getRandomInt(100, 2500)) * 10n ** 9n);
      }
      release();
      await sleep(getRandomInt(60, 12000) * 1000);
    } catch (error) {

    } finally {
      release();
    }
  } while (true);
}
periodicBot();
waveBot();


// await faucetToken("B62qkUJswYahoVKyswQMAsr1EMGjzcAw4dpNXZnWDQuWpdTydqGD4e9", 0, 11n * 10n ** 9n);
// for (let index = 0; index < 3; index++) {
//   await faucetToken( "B62qkUJswYahoVKyswQMAsr1EMGjzcAw4dpNXZnWDQuWpdTydqGD4e9", index, 5000000n * 10n ** 9n);
//   await sleep(6000);
//   // await checkBalance(clientBotTrade0, BOT_STORES[index].publicKey, 0);
// }
// for (let index = 0; index < 20; index++) {
//   await faucetToken( BOT_STORES[index].publicKey, 0, 200000n * 10n ** 9n);
//   await sleep(6000);
//   await checkBalance(clientBotTrade0, BOT_STORES[index].publicKey, 0);
// }