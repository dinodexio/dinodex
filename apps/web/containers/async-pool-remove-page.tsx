"use client";

import { PoolRemove as PoolRemoveComponent } from "@/components/v2/remove";
import { Wallet } from "@/components/wallet/wallet";
import {
  useBalancesStore,
  useFaucet,
  useObserveBalance,
} from "@/lib/stores/balances";
import { useChainStore, usePollBlockHeight } from "@/lib/stores/chain";
import { useClientStore } from "@/lib/stores/client";
import { useNotifyTransactions, useWalletStore } from "@/lib/stores/wallet";
import { tokens, findTokenByParams } from "@/tokens";
import { useEffect, useMemo } from "react";

export default function RemovePool({ params }: { params?: any }) {
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
  } = useBalancesStore();
  usePollBlockHeight();
  const { block } = useChainStore();
  useNotifyTransactions();
  const  token  = params?.token;

  const tokenA = token && findTokenByParams(token[0]);
  const tokenB = token && findTokenByParams(token[1]);

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

  const tokenParams = useMemo(
    () => ({
      tokenA,
      tokenB,
    }),
    [params],
  );

  return (
    <>
      <PoolRemoveComponent
        tokenParams={tokenParams}
        balances={ownBalances}
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
