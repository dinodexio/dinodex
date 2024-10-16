"use client";

import { SwapForm as SwapFormComponenet } from "@/components/swap";
import { Swap as SwapComponent } from "@/components/swap/swap";
import { Wallet } from "@/components/wallet/wallet";
import {
  useBalancesStore,
  useFaucet,
  useObserveBalance,
} from "@/lib/stores/balances";
import { useChainStore, usePollBlockHeight } from "@/lib/stores/chain";
import { useClientStore } from "@/lib/stores/client";
import { useNotifyTransactions, useWalletStore } from "@/lib/stores/wallet";
import { tokens } from "@/tokens";
import { useEffect } from "react";

export default function Swap() {
  const { connectWallet, wallet, observeWalletChange, initializeWallet, isWalletOpen, setIsWalletOpen } =
    useWalletStore();
  const client = useClientStore();

  const {
    balances,
    loading: balancesLoading,
    clearBalances,
  } = useBalancesStore();
  usePollBlockHeight();
  const { block } = useChainStore();
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
  console.log("ownBalances", ownBalances);

  const loading =
    balancesLoading && !!(wallet && balances[wallet]?.["0"] === undefined);

  const faucet = useFaucet();

  return (
    <>
      <SwapFormComponenet
        swapForm={<SwapComponent type="tokenIn" token="" />}
        wallet={
          <Wallet
            loading={loading}
            blockHeight={block?.height}
            address={wallet}
            balances={ownBalances}
            onConnectWallet={async () => {
              await connectWallet();
            }}
            open={isWalletOpen}
            setIsWalletOpen={setIsWalletOpen}
            forceIsWalletOpen={!!wallet}
            onFaucetDrip={() => client.client && wallet && faucet()}
          />
        }
      />
    </>
  );
}
