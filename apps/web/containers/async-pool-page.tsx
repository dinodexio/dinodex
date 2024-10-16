"use client";

import { Pool as PoolComponent } from "@/components/pool";
import { ListPool } from "@/components/pool/v2/list-pool";
import { OptionPool } from "@/components/pool/v2/option-pool";
import { Wallet } from "@/components/wallet/wallet";
import { useBalancesStore, useFaucet, useObserveBalance } from "@/lib/stores/balances";
import { useChainStore, usePollBlockHeight } from "@/lib/stores/chain";
import { useClientStore } from "@/lib/stores/client";
import { useNotifyTransactions, useWalletStore } from "@/lib/stores/wallet";
import { tokens } from "@/tokens";
import { useEffect } from "react";

export default function Pool() {
  const {
    wallet,
    observeWalletChange,
    initializeWallet,
    isWalletOpen,
    setIsWalletOpen,
  } = useWalletStore();
  const client = useClientStore();

  const {
    balances,
    loading: balancesLoading,
    clearBalances,
    totalSupply
  } = useBalancesStore();
  usePollBlockHeight();
  const { block,data } = useChainStore();
  useNotifyTransactions();

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

  const loading =
    balancesLoading && !!(wallet && balances[wallet]?.["0"] === undefined);

  const faucet = useFaucet();

  return (
    <>
      <PoolComponent
        listPool={<ListPool balances={ownBalances} loading={loading} wallet={wallet?.toString()} />}
        optionPool={<OptionPool />}
        
        walletElement={
          <Wallet
            loading={loading}
            blockHeight={block?.height}
            address={wallet}
            balances={ownBalances}
            open={isWalletOpen}
            setIsWalletOpen={setIsWalletOpen}
            onFaucetDrip={() => client.client && wallet && faucet()}
          />
        }
      />
    </>
  );
}
