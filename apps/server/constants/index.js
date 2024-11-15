import { MethodIdResolver } from "@proto-kit/module";

export const DUMMY_PRICE_TOKENS = {
  "0": {
    ticker: "MINA",
    name: "Mina Protocol",
    logo: "/tokens/mina.svg",
    usd: 0.5404

  },
  "1": {
    ticker: "DAI",
    name: "DAI Stablecoin",
    logo: "/tokens/dai.svg",
    usd: 1
  },
  "2": {
    ticker: "BTC",
    name: "Bitcoin",
    logo: "/tokens/btc.svg",
    usd: 71086.71
  },
  "3": {
    ticker: "USDC",
    name: "USD Coin",
    logo: "/tokens/usdc.svg",
    usd: 0.999
  },
  "4": {
    ticker: "USDT",
    name: "Tether USD",
    logo: "/tokens/usdt.svg",
    usd: 0.999
  },
  "5": {
    ticker: "ETH",
    name: "Ethereum",
    logo: "/tokens/eth.svg",
    usd: 2607.48
  },
  "6": {
    ticker: "WBTC",
    name: "Wrapped BTC",
    logo: "/tokens/wbtc.svg",
    usd: 70917.50
  },
  "7": {
    ticker: "BNB",
    name: "BNB",
    logo: "/tokens/bnb.svg",
    usd: 605.62
  },

}

export const PRICE_TOKENS = DUMMY_PRICE_TOKENS;

// export const STORAGE_FILES = {
//     system_status: {
//         blockHeight: 0,
//         totalPool: 0,
//         totalToken: 0
//     },
//     poolList: {
//         poolPath_stringify: [
//             block1: [volA, volB],
//             block2: [volA, VolB]
//         ] 
//     },
//     tokenList: {}
// }

export const NULL_TX = { hash: null };
export const BLOCK_TIME = 5
export const RuntimeMethod = {
  SWAP: {
    moduleName: "XYK",
    methodName: "sellPathSigned"
  },
  CREATE_POOL: {
    moduleName: "XYK",
    methodName: "createPoolSigned"
  },
  ADD_LIQUIDITY: {
    moduleName: "XYK",
    methodName: "addLiquiditySigned"
  },
  REMOVE_LIQUIDITY: {
    moduleName: "XYK",
    methodName: "removeLiquiditySigned"
  },
  getMethodId: function ({ moduleName, methodName }, clientAppchain) {
    const methodIdResolverModule = clientAppchain.resolveOrFail("MethodIdResolver", MethodIdResolver)
    return methodIdResolverModule.getMethodId(moduleName, methodName).toString()
  },
  getMethodNameFromId: function (methodId, clientAppchain) {
    const methodIdResolverModule = clientAppchain.resolveOrFail("MethodIdResolver", MethodIdResolver)
    return methodIdResolverModule.getMethodNameFromId(BigInt(methodId))
  },
  isMethodWithId: function (methodId, methodCheck, clientAppchain) {
    const [moduleNameTarget, methodNameTarget] = this.getMethodNameFromId(methodId, clientAppchain)
    return methodCheck.moduleName === moduleNameTarget && methodCheck.methodName === methodNameTarget
  }
}

export const EXPIRED_TIME = 5 * 1000;

export const getPriceTokens = function (tokenId) {
  const { [tokenId]: { usd = null } = {} } = PRICE_TOKENS
  return usd
}