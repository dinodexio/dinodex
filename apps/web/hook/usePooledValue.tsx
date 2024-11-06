import { useObserveBalancePool } from "@/lib/stores/balances";
import { getTokenID } from "@/tokens";
import { TokenId } from "@proto-kit/library";
import { PoolKey, TokenPair } from "chain";
import { useMemo } from "react";

export function usePooledValue(item: any) {
  const tokenA = getTokenID("ticker", item.tokenSelectedPool.first.symbol) as string;
  const tokenB = getTokenID("ticker", item.tokenSelectedPool.second.symbol) as string;
  
  const poolKey = PoolKey.fromTokenPair(
    TokenPair.from(TokenId.from(tokenA), TokenId.from(tokenB)),
  ).toBase58();

  const balance = useMemo(() => ({
    first: useObserveBalancePool(tokenA, poolKey),
    second: useObserveBalancePool(tokenB, poolKey),
  }), [tokenA, tokenB, poolKey]);

  return balance;
}