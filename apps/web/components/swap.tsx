"use client";
import { useRouter, usePathname } from "next/navigation";
// import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "./footer";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("./header"), {
  ssr: false,
});

export interface SwapProps {
  swapForm: JSX.Element;
  wallet?: JSX.Element;
}

export function SwapForm({ swapForm }: SwapProps) {
  return (
    <div className="flex items-center justify-center">
      <Toaster />
      <div className="flex w-full flex-col px-[16px] pt-8 sm:px-[16px] lg:px-[32px] xl:px-[41px] xl:pt-8">
        <Header type="swap" />
        {swapForm}
        <Footer />
      </div>
    </div>
  );
}
