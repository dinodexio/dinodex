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

export default function Page({ params }: { params: { name: string } }) {
  const token = DATA_TOKENS.find(token => token.slug === params.name[0])
  return (
    // <div>
    //   <div className="flex items-center justify-center">
    //     <span>Token Detail</span>
    //     {/* <SwapForm /> */}
    //     <ChartToken type="token" />
    //     <InfoLayout type="token" params={params} />
    //   </div>

    // </div>
    <div className="flex items-center justify-center">
      <Toaster />
      <div className="flex flex-col w-full px-[16px] pt-[20px] mb-3 xl:px-[41px] xl:pt-8 lg:px-[32px] sm:px-[16px]">
        <Header />
        <InfoLayout type="token" params={params} />
        <Footer />
      </div>
      <ScrollToTopButton />
    </div>
  )
}

