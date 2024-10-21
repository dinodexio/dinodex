"use client";
import { tokens } from "@/tokens";
import BigNumber from "bignumber.js";
import { useMemo } from "react";

export const precision = 2;

export interface BalanceProps {
  balance?: string;
  tokenId?: string;
  type?: "number" | "default"; // Added 'type' parameter to the interface
}

export function removeTrailingZeroes(balance: string) {
  const leftovers = `0.${balance}`
    .replace(/^0+(?!\.)|(?:\.|(\..*?))0+$/gm, "$1")
    .replace("0.", "");

  if (leftovers.endsWith(".")) return leftovers.replace(".", "");

  if (leftovers === "0") return "0";

  return leftovers;
}

export function Balance({ balance, tokenId, type = "default" }: BalanceProps) {
  const formattedBalance = useMemo(() => {
    if (!balance) return;

    const result = BigNumber(balance).div(10 ** precision).toFixed(2);
    const resultTrimmed = BigNumber(result).toString()
    return (
      <>
        {resultTrimmed}
      </>
    )

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
