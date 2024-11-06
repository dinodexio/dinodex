"use client";

import { PoolRemove as PoolRemoveComponent } from "@/components/v2/remove";
import { useBalancesStore } from "@/lib/stores/balances";
import { useWalletStore } from "@/lib/stores/wallet";
import { findTokenByParams } from "@/tokens";
import { notFound } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function RemovePool({ params }: { params?: any }) {
  const { wallet } = useWalletStore();
  const { balances } = useBalancesStore();
  const token = params?.token;

  const tokenA = token && findTokenByParams(token[0]);
  const tokenB = token && findTokenByParams(token[1]);

  const ownBalances = wallet ? balances[wallet] : {};

  const tokenParams = useMemo(
    () => ({
      tokenA,
      tokenB,
    }),
    [params],
  );

  useEffect(() => {
    if (!tokenA || !tokenB) {
      notFound();
    }
  }, [tokenA, tokenB]);

  return (
    <>
      <PoolRemoveComponent tokenParams={tokenParams} balances={ownBalances} />
    </>
  );
}
