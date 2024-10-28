import { PassDataResult } from "@/components/token/transaction-panel";
import {
  ADDLIQUIDITY,
  CREATEPOOL,
  DRIPBUNDLE,
  EMPTY_DATA,
  REMOVELIQUIDITY,
  SELLPATH,
  TOKEN_PRICES,
  TRANSFER,
} from "@/constants";
import { Token, Tokens } from "@/tokens";
import BigNumber from "bignumber.js";
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

export function formatNumber(num: number | string): string {
  // Convert the input to a number if it's a string
  const value = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(value)) {
    return EMPTY_DATA;
  }

  if (value >= 1e9) {
    return (value / 1e9).toFixed(2) + "B";
  } else if (value >= 1e6) {
    return (value / 1e6).toFixed(2) + "M";
  } else if (value >= 1e3) {
    return (value / 1e3).toFixed(2) + "K";
  } else {
    return value.toString();
  }
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
      type = "Drip";
      break;
    case CREATEPOOL:
      type = "Create";
      break;
    case SELLPATH:
      type = "Swap";
      break;
    case ADDLIQUIDITY:
      type = "Add";
      break;
    case TRANSFER:
      type = "Transfer";
      break;
    case REMOVELIQUIDITY:
      type = "Remove";
      break;
    default:
      type = "Swap";
      break;
  }

  return type;
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
    logo: token.logo || "",
    name: token.name || "Empty",
    symbol: token.ticker,
    amount: BigNumber(amount)
      .dividedBy(10 ** 2)
      .toNumber(), // Convert amount to a number
  };
};
// Step 3: Main function to pass new data
export const passDataTokenByFields = (
  argsFields: string[], // Array of token IDs and amounts
  tokens: Tokens,
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

export function formatPriceUSD(amount: number | string, ticket: string) {
  switch (ticket) {
    case "BTC":
      return typeof amount === "number"
        ? amount * TOKEN_PRICES.BTC
        : parseFloat(amount) * TOKEN_PRICES.BTC;
    case "ETH":
      return typeof amount === "number"
        ? amount * TOKEN_PRICES.ETH
        : parseFloat(amount) * TOKEN_PRICES.ETH;
    case "USDC":
      return typeof amount === "number"
        ? amount * TOKEN_PRICES.USDC
        : parseFloat(amount) * TOKEN_PRICES.USDC;
    case "USDT":
      return typeof amount === "number"
        ? amount * TOKEN_PRICES.USDT
        : parseFloat(amount) * TOKEN_PRICES.USDT;
    case "DAI":
      return typeof amount === "number"
        ? amount * TOKEN_PRICES.DAI
        : parseFloat(amount) * TOKEN_PRICES.DAI;
    case "MINA":
      return typeof amount === "number"
        ? amount * TOKEN_PRICES.MINA
        : parseFloat(amount) * TOKEN_PRICES.MINA;
    case "BNB":
      return typeof amount === "number"
        ? amount * TOKEN_PRICES.BNB
        : parseFloat(amount) * TOKEN_PRICES.BNB;
    default:
      return typeof amount === "number" ? amount * 1 : parseFloat(amount) * 1;
  }
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  } else {
    return str;
  }
}
