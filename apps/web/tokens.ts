"use client";

import { TokenId } from "@proto-kit/library";
import { LPTokenId, TokenPair } from "chain";

export type Token = {
  ticker: string;
  name: string;
  logo: string;
  [key: string]: string;
};

export type Tokens = Record<string, Token | undefined>;

export const LIST_TOKENS: Tokens = {
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
};

function createLPToken(tokenAId: TokenId, tokenBId: TokenId): [string, Token] {
  const tokenPair = TokenPair.from(
    TokenId.from(tokenAId),
    TokenId.from(tokenBId),
  );
  const lptokenId = LPTokenId.fromTokenPair(tokenPair).toString();

  return [
    lptokenId,
    {
      ticker: `${LIST_TOKENS[tokenPair.tokenBId.toString()]?.ticker}/${LIST_TOKENS[tokenPair.tokenAId.toString()]?.ticker}`,
      name: "LP Token",
      logo: "/tokens/lp.svg",
    },
  ];
}

function createDictLptoken(tokens: Tokens): Tokens {
  const result: Tokens = {};
  const listTokens = Object.entries(tokens);
  for (var i = 0; i < listTokens.length - 1; i++) {
    const [tokenAId] = listTokens[i];
    for (var j = i + 1; j < listTokens.length; j++) {
      const [tokenBId] = listTokens[j];
      const [lpTokenId, valueInfoTokens] = createLPToken(
        TokenId.from(tokenAId),
        TokenId.from(tokenBId),
      );
      result[lpTokenId] = valueInfoTokens;
    }
  }

  return result;
}

export const tokens: Record<
  string,
  | {
      ticker: string;
      name: string;
      logo: string;
      [key: string]: string;
    }
  | undefined
> = {
  ...LIST_TOKENS,
  ...createDictLptoken(LIST_TOKENS),
};

// Hàm tạo ra các cặp token từ danh sách LIST_TOKENS
export const generatePools = (): [string, string][] => {
  const pools: [string, string][] = [];

  const keys = Object.keys(LIST_TOKENS);
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      // const token1 = LIST_TOKENS[keys[i]];
      // const token2 = LIST_TOKENS[keys[j]];

      // Kiểm tra token1 và token2 tồn tại và đảm bảo giá trị của chúng là number
      // Tính giá trị pool là tổng giá trị của hai token
      // const poolValue = token1.value + token2.value;

      // Đẩy cặp token vào mảng pools
      pools.push([keys[i], keys[j]]);
    }
  }

  return pools;
};

// export const pools = generatePools();

export const pools: [string, string][] = [
  ["0", "1"],
  ["1", "2"],
];

export const getTokenByTicker = (tickerSymbol: string) => {
  return Object.values(tokens).find((token) => token?.ticker === tickerSymbol);
};

export const getTokenID = (
  key: keyof typeof tokens,
  value: string,
): string | undefined => {
  for (const [id, token] of Object.entries(tokens)) {
    if (token && token[key] === value) {
      return id;
    }
  }
  return undefined; // Return undefined if no match found
};

// Hàm tìm token dựa vào params
export function findTokenByParams(paramsToken: string) {
  // Lặp qua tất cả các token trong object tokens
  if (!paramsToken) return undefined;
  for (const tokenId in tokens) {
    const tokenInfo = tokens[tokenId];
    if (
      tokenInfo &&
      tokenInfo?.ticker?.toLowerCase() === paramsToken.toLowerCase()
    ) {
      return {
        label: tokenInfo.ticker, // Label là ticker của token (ví dụ: "MINA", "DAI", "BTC", ...)
        value: tokenId, // Value là mã token (ví dụ: "0", "1", "2")
      };
    }
  }
  return undefined; // Nếu không tìm thấy
}
