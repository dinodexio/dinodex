"use client";

import { Token as TokenComponent } from "@/components/token";
import { ChartToken as ChartTokenComponent } from "@/components/token/chart-token";
import { FilterSort } from "@/components/token/filter-sort";
import { PoolPanel } from "@/components/token/pool-panel";
import { TokenPanel } from "@/components/token/token-panel";
import { TransactionPanel } from "@/components/token/transaction-panel";
import { useBalancesStore, useObserveBalance } from "@/lib/stores/balances";
import { useChainStore, usePollTransactions } from "@/lib/stores/chain";
import { useClientStore } from "@/lib/stores/client";
import { useWalletStore } from "@/lib/stores/wallet";
import { tokens } from "@/tokens";
import React, { useEffect } from "react";

export default function Token() {
  const { wallet, observeWalletChange, initializeWallet } = useWalletStore();
  const client = useClientStore();
  const { balances, clearBalances } = useBalancesStore();
  usePollTransactions();
  const { transactions, loading } = useChainStore();
  useEffect(() => {
    client.start();
  }, []);

  const [valueSearch, setValueSearch] = React.useState<string>("");
  const handleSearch = (value: string) => {
    setValueSearch(value);
  };

  useEffect(() => {
    wallet && clearBalances(wallet);
  }, [wallet]);

  Object.keys(tokens).forEach((tokenId) => {
    useObserveBalance(tokenId, wallet);
  });

  useEffect(() => {
    client.start();
    observeWalletChange();
    initializeWallet();
  }, []);

  const ownBalances = wallet ? balances[wallet] : {};
  return (
    <>
      <TokenComponent
        tokensTable={<TokenPanel />}
        poolsTable={
          <PoolPanel balances={ownBalances} valueSearch={valueSearch} />
        }
        transactionTable={
          <TransactionPanel
            valueSearch={valueSearch}
            client={client?.client}
            transactions={transactions}
            loading={loading}
          />
        }
        filterSort={<FilterSort handleSearch={handleSearch} />}
        chart={<ChartTokenComponent type="token" />}
      />
    </>
  );
}
