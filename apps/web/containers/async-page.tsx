"use client";

import { Home as HomeComponent } from "@/components/homev3";
import { Balances, Wallet } from "@/components/wallet/wallet";
import { useEffect, useMemo, useState } from "react";
import { useNotifyTransactions, useWalletStore } from "@/lib/stores/wallet";
import {
  useBalancesStore,
  useFaucet,
  useObserveBalance,
} from "@/lib/stores/balances";
import { useChainStore, usePollBlockHeight } from "@/lib/stores/chain";
import { tokens } from "@/tokens";
import { useClientStore } from "@/lib/stores/client";
import { FaucetForm } from "@/components/faucet/faucet-form";
import { AddLiquidityForm } from "./xyk/add-liquidity-form";
import { RemoveLiquidityForm } from "./xyk/remove-liquidity-form";
import { SwapForm } from "./xyk/swap-form";
import { TransferForm } from "./wallet/transfer-form";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  // const { wallet, observeWalletChange, initializeWallet } = useWalletStore();
  // const client = useClientStore();

  // const {
  //   balances,
  //   loading: balancesLoading,
  //   clearBalances,
  // } = useBalancesStore();
  // const { block } = useChainStore();
  // usePollBlockHeight();

  // useNotifyTransactions();

  // useEffect(() => {
  //   wallet && clearBalances(wallet);
  // }, [wallet]);
  // Object.keys(tokens).forEach((tokenId) => {
  //   useObserveBalance(tokenId, wallet);
  // });

  // useEffect(() => {
  //   client.start();
  //   observeWalletChange();
  //   initializeWallet();
  // }, []);

  // const ownBalances = wallet ? balances[wallet] : {};
  // console.log('ownBalances',ownBalances)

  // const loading =
  //   balancesLoading && !!(wallet && balances[wallet]?.["0"] === undefined);

  // const faucet = useFaucet();

  return (
    <>
      {/* <HomeComponent
        swapForm={<SwapForm />}
        transferForm={<TransferForm />}
        addLiquidityForm={<AddLiquidityForm />}
        removeLiquidityForm={<RemoveLiquidityForm />}
        wallet={
          <Wallet
            loading={loading}
            blockHeight={block?.height}
            address={wallet}
            balances={ownBalances}
            onConnectWallet={async () => {
              await connectWallet();
            }}
            forceIsWalletOpen={!!wallet}
            onFaucetDrip={() => client.client && wallet && faucet()}
          />
        }
      /> */}
      <HomeComponent />
      {/* <div className = "home-a" >
      <div className="header-home">
        <Link href="/swap" className="button-home"><span>Launch App</span></Link>
      </div>

      <div className="content-home">
        <div className="cloud-content">
          <Image src="/images/home/cloud-1.svg" alt="cloud" width={267} height={67}/>
          <Image src="/images/home/cloud-2.svg" alt="cloud" width={319} height={82}/>
        </div>
        <div className="logo-content">
          <span style={{ fontFamily: 'PPMondwest', fontSize: '160px', color: 'var(--black-text-color)', height: '175px', display: 'flex', alignItems: 'center' }}>DinoDEX</span>
        </div>
        <div className="game-content">
          <img src="/images/home/land.svg" alt="game" className="land-img" />
          <div className="dex-content">
            
            <Image src="/images/home/dex.svg" alt="dex" width={294} height={294}/>
          </div>
          <div className="cactus-content">
            <Image src="/images/home/cactus-left.svg" alt="cactus" width={199} height={199}/>
            <Image src="/images/home/cactus-center.svg" alt="cactus" width={150} height={150} style={{height: '150px'}}/>
            <Image src="/images/home/cactus-right.svg" alt="cactus" width={199} height={199}/>
          </div>
        </div>
      </div>
    </div> */}
    </>
  );
}
