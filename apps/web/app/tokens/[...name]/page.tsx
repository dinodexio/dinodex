"use client";

// import { SwapForm } from "@/containers/xyk/swap-form";
import { InfoLayout } from "@/components/detail/info-layout";
import { Header } from "@/components/header";
import { ChartToken } from "@/components/token/chart-token";
import { Toaster } from "@/components/ui/toaster";
import { DATA_TOKENS } from "@/constants";
import Image from "next/image";
import { ScrollToTopButton } from "@/components/scrollToTopButton/scrollToTopButton";
import { Footer } from "@/components/footer";
import { Wallet } from "@/components/wallet/wallet";
import { useChainStore } from "@/lib/stores/chain";
import { useWalletStore } from "@/lib/stores/wallet";
import { useBalancesStore, useFaucet } from "@/lib/stores/balances";
import { useClientStore } from "@/lib/stores/client";

export default function Page({ params }: { params: { name: string } }) {
  const { block } = useChainStore();
  const token = DATA_TOKENS.find(token => token.slug === params.name[0])
  const {
    wallet,
    isWalletOpen,
    setIsWalletOpen,
  } = useWalletStore();
  const {
    balances,
    loading: balancesLoading,
  } = useBalancesStore();
  const client = useClientStore();
  const faucet = useFaucet();
  const ownBalances = wallet ? balances[wallet] : {};
  const loading =
    balancesLoading && !!(wallet && balances[wallet]?.["0"] === undefined);
  return (
    // <div>
    //   <div className="flex items-center justify-center">
    //     <span>Token Detail</span>
    //     {/* <SwapForm /> */}
    //     <ChartToken type="token" />
    //     <InfoLayout type="token" params={params} />
    //   </div>

    // </div>
    <>
      <div className="flex items-center justify-center">
        <Toaster />
        <div className="flex flex-col w-full px-[16px] pt-[20px] mb-3 xl:px-[41px] xl:pt-8 lg:px-[32px] sm:px-[16px]">
          <Header />
          <InfoLayout type="token" params={params} />
          <Footer />
        </div>
        <ScrollToTopButton />
      </div>
      <Wallet
        loading={loading}
        blockHeight={block?.height}
        address={wallet}
        balances={ownBalances}
        open={isWalletOpen}
        setIsWalletOpen={setIsWalletOpen}
        onFaucetDrip={() => client.client && wallet && faucet()}
      />
    </>
  )
}

