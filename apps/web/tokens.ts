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
    ticker: "tMINA",
    name: "tMina Protocol",
    logo: "/tokens/mina.svg",
    address: "0xD5745a490f14CdA24bed11156d91Eb7A77c8CB1B",
    website: "https://minaprotocol.com/",
    explorer:
      "https://etherscan.io/token/0xd5745a490f14cda24bed11156d91eb7a77c8cb1b",
  },
  "1": {
    ticker: "TREX",
    name: "Trex",
    logo: "/tokens/trex.png",
    address: "",
    website: "",
    explorer: "",
  },
  "2": {
    ticker: "RAPTOR",
    name: "Raptor",
    logo: "/tokens/raptor.png",
    address: "",
    website: "",
    explorer: "",
  },
  // "1": {
  //   ticker: "DAI",
  //   name: "DAI Stablecoin",
  //   logo: "/tokens/dai.svg",
  //   address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  //   website: "https://makerdao.com/",
  //   explorer:
  //     "https://etherscan.io/token/0x6B175474E89094C44Da98b954EedeAC495271d0F",
  // },
  // "2": {
  //   ticker: "BTC",
  //   name: "Bitcoin",
  //   logo: "/tokens/btc.svg",
  // },
  // "3": {
  //   ticker: "USDC",
  //   name: "USD Coin",
  //   logo: "/tokens/usdc.svg",
  //   address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  //   website: "https://www.circle.com/usdc",
  //   explorer:
  //     "https://polygonscan.com/token/0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  // },
  // "4": {
  //   ticker: "USDT",
  //   name: "Tether USD",
  //   logo: "/tokens/usdt.svg",
  //   address: "0x55d398326f99059fF775485246999027B3197955",
  //   website:
  //     "https://bscscan.com/token/0x55d398326f99059ff775485246999027b3197955",
  //   explorer:
  //     "https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955",
  // },
  // "5": {
  //   ticker: "ETH",
  //   name: "Ethereum",
  //   logo: "/tokens/eth.svg",
  //   address: "0x202A57ad5FF7c40aA132377C104E03682436eA9C",
  //   website: "https://ethereum.org/en/",
  //   explorer: "https://etherscan.io/",
  // },
  // "6": {
  //   ticker: "WBTC",
  //   name: "Wrapped BTC",
  //   logo: "/tokens/wbtc.svg",
  //   address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
  //   website: "https://arbitrum.io/",
  //   explorer:
  //     "https://arbiscan.io/token/0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
  // },
  // "7": {
  //   ticker: "BNB",
  //   name: "BNB",
  //   logo: "/tokens/bnb.svg",
  //   website: "https://www.binance.com/",
  //   explorer: "https://bscscan.com/",
  // },
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

export function findTokenByParams(paramsToken: string) {
  if (!paramsToken) return undefined;
  for (const tokenId in tokens) {
    const tokenInfo = tokens[tokenId];
    if (
      tokenInfo &&
      tokenInfo?.ticker?.toLowerCase() === paramsToken.toLowerCase()
    ) {
      return {
        label: tokenInfo.ticker,
        value: tokenId,
      };
    }
  }
  return undefined;
}
