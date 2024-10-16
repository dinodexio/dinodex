import { PassDataResult } from "@/components/token/transaction-panel";
import {
  ADDLIQUIDITY,
  CREATEPOOL,
  DRIPBUNDLE,
  EMPTY_DATA,
  SELLPATH,
} from "@/constants";
import { Token, tokens, Tokens } from "@/tokens";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLargeNumber(number: number) {
  if (!number) return EMPTY_DATA;
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1) + "B";
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  } else {
    return number.toString();
  }
}

export function formatterInteger(number: number) {
  // Chuyển số thành chuỗi
  let numberString = number.toString();

  // Tách phần nguyên và phần thập phân (nếu có)
  let parts = numberString.split(".");

  // Định dạng phần nguyên với dấu phẩy
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Kết hợp lại phần nguyên và phần thập phân (nếu có)
  return parts.join(".");
}

export function truncateAddress(
  address: string | any[],
  frontChars = 6,
  endChars = 4,
) {
  if (!address) return "";
  const len = address.length;

  // Return the full address if it's shorter than the truncated form
  if (len <= frontChars + endChars) return address;

  // Truncate the address and add ellipsis in the middle
  return `${address.slice(0, frontChars)}...${address.slice(len - endChars)}`;
}

export const convertMethodname = (name: string) => {
  let type = "";
  switch (name) {
    case DRIPBUNDLE:
      name = "Drip";
      break;

    case CREATEPOOL:
      name = "Add";
      break;
    case SELLPATH:
      name = "Swap";
      break;
    case ADDLIQUIDITY:
      name = "Add Liquidity";
      break;
    default:
      name = "Swap";
      break;
  }

  return name;
};

export const dataTokenDefault = {
  logo: "",
  name: "",
  symbol: "",
  amount: 0,
};

// Step 1: Create a function to retrieve token data by ID
export const getTokenData = (
  tokenId: string,
  tokens: Tokens,
): Token | undefined => {
  return tokens[tokenId];
};

// Step 2: Create a function to construct token details with amount
export const createTokenDetails = (
  tokenId: string,
  amount: string,
  tokens: Tokens,
): PassDataResult | null => {
  const token = getTokenData(tokenId, tokens);

  if (!token) return dataTokenDefault;

  return {
    logo: token.logo,
    name: token.name,
    symbol: token.ticker,
    amount: parseFloat(amount), // Convert amount to a number
  };
};
// Step 3: Main function to pass new data
export const passDataTokenByFields = (
  argsFields: string[], // Array of token IDs and amounts
  tokens: Tokens, // Token mapping object
): { first: PassDataResult | null; second: PassDataResult | null } => {
  if (argsFields.length === 0)
    return { first: dataTokenDefault, second: dataTokenDefault };
  const firstToken = createTokenDetails(argsFields[0], argsFields[2], tokens);
  const secondToken = createTokenDetails(argsFields[1], argsFields[3], tokens);

  return {
    first: firstToken,
    second: secondToken,
  };
};

export const getTokenByTicker = (tickerSymbol: string) => {
  return Object.values(tokens).find((token) => token?.ticker === tickerSymbol);
};

export const getTokenID = (
  key: keyof (typeof tokens)[string] | string,
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
    if (tokenInfo && tokenInfo?.ticker?.toLowerCase() === paramsToken.toLowerCase()) {
      return {
        label: tokenInfo.ticker, // Label là ticker của token (ví dụ: "MINA", "DAI", "BTC", ...)
        value: tokenId, // Value là mã token (ví dụ: "0", "1", "2")
      };
    }
  }
  return undefined; // Nếu không tìm thấy
}