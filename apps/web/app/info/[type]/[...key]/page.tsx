"use client";

import dynamic from "next/dynamic";
const InfoTokenLayout = dynamic(
  () => import("@/components/detail/info-token-layout").then(({ InfoTokenLayout }) => InfoTokenLayout),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader />
      </div>
    ),
  },
);
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { ScrollToTopButton } from "@/components/scrollToTopButton/scrollToTopButton";
import { Footer } from "@/components/footer";
import { Wallet } from "@/components/wallet/wallet";
import { useChainStore } from "@/lib/stores/chain";
import { useWalletStore } from "@/lib/stores/wallet";
import { useBalancesStore, useFaucet } from "@/lib/stores/balances";
import { InfoPoolLayout } from "@/components/detail/info-pool-layout";
import { Loader } from "@/components/ui/Loader";

export default function Page({
  params,
}: {
  params: { name: string; type: string };
}) {
  const { block } = useChainStore();
  // const token = DATA_TOKENS.find(token => token.slug === params.name[0])
  const { wallet, isWalletOpen, setIsWalletOpen } = useWalletStore();
  const { balances } = useBalancesStore();
  const ownBalances = wallet ? balances[wallet] : {};

  return (
    <>
      <div className="flex items-center justify-center">
        <Toaster />
        <div className="mb-3 flex w-full flex-col px-[16px] pt-[20px] sm:px-[16px] lg:px-[32px] xl:px-[41px] xl:pt-8">
          <Header />
          {params?.type === "tokens" && (
            <InfoTokenLayout type="token" params={params} />
          )}
          {params?.type === "pools" && (
            <InfoPoolLayout type="pool" params={params} />
          )}
          <Footer />
        </div>
        <ScrollToTopButton />
      </div>
      <Wallet
        // loading={loading}
        blockHeight={block?.height}
        address={wallet}
        balances={ownBalances}
        open={isWalletOpen}
        setIsWalletOpen={setIsWalletOpen}
        // onFaucetDrip={() => client.client && wallet && faucet()}
      />
    </>
  );
}
