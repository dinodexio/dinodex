"use client";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "./footer";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("./headerv2"), {
  ssr: false,
});

export interface SwapProps {
  swapForm: JSX.Element;
  wallet?: JSX.Element;
  isDetail?: boolean;
}

export function SwapForm({ swapForm, isDetail = false }: SwapProps) {
  if (isDetail) {
    return swapForm;
  }
  return (
    <div className="flex items-center justify-center flex-col">
      <Toaster />
      <Header type="swap" />
      <div className="flex w-full flex-col px-[16px] pt-8 sm:px-[16px] lg:px-[32px] xl:px-[41px] xl:pt-8">
        {swapForm}
        <Footer />
      </div>
    </div>
  );
}
