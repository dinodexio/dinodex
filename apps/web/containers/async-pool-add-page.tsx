"use client";

import { PoolAdd as PoolAddComponent } from "@/components/v2/add";
import { useBalancesStore } from "@/lib/stores/balances";
import { useWalletStore } from "@/lib/stores/wallet";
import { findTokenByParams } from "@/tokens";
import { useMemo } from "react";

export default function Pool({ params }: { params?: any }) {
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

  return (
    <>
      <PoolAddComponent tokenParams={tokenParams} balances={ownBalances} />
    </>
  );
}
