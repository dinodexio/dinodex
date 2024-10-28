"use client";

import { Pool as PoolComponent } from "@/components/pool";
import { ListPool } from "@/components/pool/v2/list-pool";
import { OptionPool } from "@/components/pool/v2/option-pool";
import { useBalancesStore } from "@/lib/stores/balances";
import { useWalletStore } from "@/lib/stores/wallet";

export default function Pool() {
  const { wallet } = useWalletStore();
  const { balances, loading: balancesLoading } = useBalancesStore();
  const ownBalances = wallet ? balances[wallet] : {};
  const loading =
    balancesLoading && !!(wallet && balances[wallet]?.["0"] === undefined);

  return (
    <>
      <PoolComponent
        listPool={
          <ListPool
            balances={ownBalances}
            loading={loading}
            wallet={wallet?.toString()}
          />
        }
        optionPool={<OptionPool />}
      />
    </>
  );
}
