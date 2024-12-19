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
import moment from "moment";
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

export function formatNumber(num: number | string): string {
  const EMPTY_DATA = "--"; // Define EMPTY_DATA if not already defined
  const value = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(value)) {
    return EMPTY_DATA;
  }

  const thresholds = [
    { limit: 1e12, suffix: "T" },
    { limit: 1e9, suffix: "B" },
    { limit: 1e6, suffix: "M" },
    { limit: 1e3, suffix: "K" },
  ];

  for (const { limit, suffix } of thresholds) {
    if (value >= limit) {
      return (value / limit).toFixed(2) + suffix;
    }
  }

  if (value > 0 && value < 0.01) {
    return "<0.01";
  }

  return value.toFixed(2).toString();
}

export function formatBigNumber(value: BigNumber): string {
  // Check if the BigNumber value is 0 or NaN
  if (value.isZero() || value.isNaN()) {
    return "0";
  }

  // Check if the value is less than 1 and greater than 0
  if (value.isGreaterThan(0) && value.isLessThan(1)) {
    return value.toFixed(5); // Apply toFixed(5) for small decimal values
  }

  // For values greater than or equal to 1, apply toFixed(5)
  return value.toFixed(5);
}

export function formatPersion(num: number | string) {
  // Convert the input to a number if it's a string
  const value = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(value)) {
    return EMPTY_DATA;
  }

  return value * 1e9 + "%";
}

export function formatFullValue(value: string): string {
  if (!value.includes("e") && !value.includes("E")) {
    return value;
  }

  let [base, exponent] = value.split(/[eE]/);
  let exp = parseInt(exponent, 10);

  if (exp < 0) {
    value = "0." + "0".repeat(Math.abs(exp) - 1) + base.replace(".", "");
  } else {
    const [integerPart, decimalPart = ""] = base.split(".");
    value = integerPart + decimalPart.padEnd(exp, "0");
  }

  return value;
}

export function validateValue(value: string | number | null | undefined): any {
  if (
    value === null ||
    value === undefined ||
    isNaN(Number(value)) ||
    !isFinite(Number(value))
  ) {
    return 0;
  }
  return value;
}

export const capitalizeFirstLetter = (string: string) => {
  if (!string) return EMPTY_DATA;
  return string.charAt(0).toUpperCase() + string.slice(1);
};

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

export function formatPriceUSD(
  amount: number | string,
  ticker: string,
  tokenPrice?: number | string
): string {
  // Convert the amount to a number
  const parsedAmount = typeof amount === "number" ? amount : Number(amount);

  // Ensure parsedAmount is a valid number
  if (isNaN(parsedAmount) || !ticker) {
    return "~";
  }

  // Calculate the price in USD
  const priceInUSD = parsedAmount * Number(tokenPrice || 0);

  // Format the price for large numbers
  return formatNumber(priceInUSD);
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
  value: string | number,
  precision: number,
  decimalPlaces: number = 5,
) {
  return decimalPlaces
    ? new BigNumber(value).div(10 ** precision).toFixed(decimalPlaces)
    : new BigNumber(value).div(10 ** precision);
}

export function formatNumberWithPrice(
  value: string | number,
  isPrice: boolean = false,
  precision: number = 0,
) {
  if (!value || value === Infinity || value === -Infinity) {
    return isPrice ? `$0` : 0;
  }
  const numericValue = new BigNumber(value);
  const priceResult = formatNumber(
    removePrecision(numericValue.toNumber(), precision).toString(),
  );

  // Check if priceResult is less than 0.01
  const threshold = new BigNumber(0.01);
  const isLessThanThreshold = numericValue.isLessThan(threshold);

  // Format output based on isPrice and threshold comparison
  if (isLessThanThreshold) {
    return isPrice ? "<$0.01" : "<0.01";
  }

  return isPrice ? `$${priceResult}` : priceResult;
}

export const formatTimeAgo = (
  timestamp: string | number | Date | null | undefined,
): string => {
  if (!timestamp) return EMPTY_DATA; // Handle cases where timestamp is not provided

  const timeAgo = moment(timestamp)
    .startOf("minute")
    .fromNow(true)
    .replace(" minutes", "m")
    .replace(" hours", "h")
    .replace(" days", "d")
    .replace(" months", "mo")
    .replace(" years", "y")
    .replace("a minute", "1m")
    .replace("an hour", "1h")
    .replace("a day", "1d")
    .replace("a month", "1mo")
    .replace("a year", "1y")
  return /\d/.test(timeAgo) ? `${timeAgo} ago` : "a few sec";
};

export const generatePriceData = (basePrice: number) => {
  const days = 30;
  const today = new Date();

  const priceData = Array.from({ length: days }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - i - 1));
    return {
      date: date.toISOString(),
      price: basePrice + (Math.random() - 1) * basePrice,
    };
  });

  return priceData;
};

export function formatNumberWithCommas(number: string | number, decimals = 2) {
  let formattedNumber = Number(number).toLocaleString('en-US',{
    minimumFractionDigits: 0, 
    maximumFractionDigits: decimals, 
  });

  return formattedNumber;
}