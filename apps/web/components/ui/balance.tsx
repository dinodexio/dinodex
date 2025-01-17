"use client";
import { EMPTY_DATA } from "@/constants";
import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { formatNumberWithPrice } from "@/lib/utils";
import { useTokenStore } from "@/lib/stores/token";

export const precision = 9;

export interface BalanceProps {
  balance?: string;
  tokenId?: string;
  type?: "number" | "default"; // Added 'type' parameter to the interface
  loading?: boolean;
  decimals?: number;
  formatInteger?: boolean;
}

export function removeTrailingZeroes(balance: string) {
  const leftovers = `0.${balance}`
    .replace(/^0+(?!\.)|(?:\.|(\..*?))0+$/gm, "$1")
    .replace("0.", "");

  if (leftovers.endsWith(".")) return leftovers.replace(".", "");

  if (leftovers === "0") return "0";

  return leftovers;
}

export function formatBigNumber(num: number | string) {
  // Convert the input to a number if it's a string
  const value = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(value)) {
    return EMPTY_DATA;
  }
  return BigNumber(num).dividedBy(10 ** precision);
}

export function Balance({
  balance,
  tokenId,
  type = "default",
  decimals = 2,
  formatInteger,
}: BalanceProps) {
  const { data: tokens } = useTokenStore();
  const formattedBalance = useMemo(() => {
    if (!balance) return "~";

    const result = BigNumber(balance)
      .div(10 ** precision)
      .toFixed(decimals);
    // Check if result is NaN
    if (isNaN(Number(result))) {
      return "~";
    }
    const resultTrimmed = formatInteger
      ? formatNumberWithPrice(BigNumber(result).toNumber(), true, 0, true)
      : BigNumber(result).toString();
    return <>{resultTrimmed}</>;
  }, [balance, type]);

  // If the type is 'number', only return the formatted number
  if (type === "number") {
    return <>{formattedBalance ?? "—"}</>;
  }

  // Default JSX rendering
  return (
    <span>
      {formattedBalance ?? "—"} {tokenId ? tokens[tokenId]?.ticker : <></>}
    </span>
  );
}
