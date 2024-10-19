"use client";
import { cn } from "@/lib/utils";
import { tokens } from "@/tokens";
import { UInt64 } from "o1js";
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

    const { quotient, rest } = UInt64.from(balance).divMod(10 ** precision);
    const trimmedRest = removeTrailingZeroes(rest.toString());

    // If the type is 'number', return the value as a number
    if (type === "number") {
      return parseFloat(`${quotient}.${trimmedRest || "0"}`);
    }

    // Otherwise, return formatted JSX
    return (
      <>
        {quotient.toString()}
        {trimmedRest ? (
          <>
            <span>.</span>
            {trimmedRest}
          </>
        ) : (
          <></>
        )}
      </>
    );
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
