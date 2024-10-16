"use client";

import { TokenId } from "@proto-kit/library";
import { LPTokenId, TokenPair } from "chain";

export type Token = {
  ticker: string;
  name: string;
  logo: string;
};

export type Tokens = Record<string, Token | undefined>;

const LIST_TOKENS: Tokens = {
  "0": {
    ticker: "MINA",
    name: "Mina Protocol",
    logo: "/tokens/mina.svg",
  },
  "1": {
    ticker: "DAI",
    name: "DAI Stablecoin",
    logo: "/tokens/dai.svg",
  },
  "2": {
    ticker: "BTC",
    name: "Bitcoin",
    logo: "/tokens/btc.svg",
  },
  "3": {
    ticker: "USDC",
    name: "USD Coin",
    logo: "/tokens/usdc.svg",
  },
  "4": {
    ticker: "USDT",
    name: "Tether USD",
    logo: "/tokens/usdt.svg",
  },
  "5": {
    ticker: "ETH",
    name: "Ethereum",
    logo: "/tokens/eth.svg",
  },
  "6": {
    ticker: "WBTC",
    name: "Wrapped BTC",
    logo: "/tokens/wbtc.svg",
  },
  "7": {
    ticker: "BNB",
    name: "BNB",
    logo: "/tokens/bnb.svg",
  },
}

function createLPToken(tokenAId: TokenId, tokenBId: TokenId): [string, Token] {
  const tokenPair = TokenPair.from(TokenId.from(tokenAId), TokenId.from(tokenBId))
  const lptokenId = LPTokenId.fromTokenPair(
    tokenPair,
  ).toString();

  return [
    lptokenId,
    {
      ticker: `${LIST_TOKENS[tokenPair.tokenBId.toString()]?.ticker}/${LIST_TOKENS[tokenPair.tokenAId.toString()]?.ticker}`,
      name: "LP Token",
      logo: "/tokens/lp.svg",
    }]
}

function createDictLptoken(tokens: Tokens): Tokens {
  const result: Tokens = {}
  const listTokens = Object.entries(tokens)
  for (var i = 0; i < listTokens.length - 1; i++) {
    const [tokenAId] = listTokens[i]
    for (var j = i + 1; j < listTokens.length; j++) {
      const [tokenBId] = listTokens[j]
      const [lpTokenId, valueInfoTokens] = createLPToken(TokenId.from(tokenAId), TokenId.from(tokenBId))
      result[lpTokenId] = valueInfoTokens
    }
  }

  return result
}


export const tokens: Record<
  string,
  | {
    ticker: string;
    name: string;
    logo: string;
  }
  | undefined
> = {
  ...LIST_TOKENS,
  ...createDictLptoken(LIST_TOKENS)
};

console.log("==> tokens", tokens)

export const pools: [string, string][] = [
  ["0", "1"],
  ["1", "2"],
];
