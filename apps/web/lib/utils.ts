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
  if (!number) return EMPTY_DATA;
  let numberString = number?.toString();

  // Tách phần nguyên và phần thập phân (nếu có)
  let parts = numberString.split(".");

  // Định dạng phần nguyên với dấu phẩy
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Kết hợp lại phần nguyên và phần thập phân (nếu có)
  return parts.join(".");
}

export function formatNumber(
  num: number | string,
  isPrice: boolean = false,
): string {
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
  } else if (value > 0 && value < 1e-2) {
    return "< 0.01";
  } else {
    return value.toFixed(2).toString();
  }
}

export function formatPersion(num: number | string) {
  // Convert the input to a number if it's a string
  const value = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(value)) {
    return EMPTY_DATA;
  }

  return value * 1e9 + "%";
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

export function truncateString(str: string = "", maxLength: number): string {
  if (str && str?.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  } else {
    return str;
  }
}

export function convertSmallNumberToPercent(num: number | string) {
  // Convert the input to a number if it's a string
  const value = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(value)) {
    return `${EMPTY_DATA} %`;
  }
  // Convert the number to a decimal format with higher precision
  const decimalValue = value * 100;

  // Check if the result is extremely small
  if (decimalValue < 0.01) {
    return "< 0.01 %";
  }
  // Return the formatted result in percentage notation
  return decimalValue.toExponential(5) + " %";
}

export function formatPercentage(input: string | number): string {
  // Convert BigNumber to a number or parse it if input is a string
  let value: number;

  if (BigNumber.isBigNumber(input)) {
    value = input.toNumber();
  } else if (typeof input === "string") {
    value = parseFloat(input);
  } else {
    value = input;
  }

  // Check if the parsed value is a valid non-negative number
  if (isNaN(value) || value === 0) {
    return "0";
  }

  // Format values less than 0.01% as "< 0.01%"
  if (value < 0.01) {
    return "<0.01";
  }
  // Check if the value is an integer
  if (Number.isInteger(value)) {
    return value.toString();
  }
  // Format and return as percentage
  return value.toFixed(2);
}

export const extractTabFromPathname = (path: any) => {
  if (!path) return "";
  const parts = path.split("/");
  // Find a matching value for tokens, pools, or transactions
  return (
    parts.find((part: any) =>
      ["tokens", "pools", "transactions"].includes(part),
    ) || "tokens"
  );
};

export function addPrecision(value: string, precision: number) {
  // return new BigNumber(value).times(10 ** precision).toFixed(0);
  // return Math.floor(Number(value)*10**(precision - 2)).toString() + "00";
  return new BigNumber(value).times(10 ** precision).toFixed(0);
}

export function removePrecision(
  value: string,
  precision: number,
  decimalPlaces: number = 5,
) {
  return decimalPlaces
    ? new BigNumber(value).div(10 ** precision).toFixed(decimalPlaces)
    : new BigNumber(value).div(10 ** precision);
}
