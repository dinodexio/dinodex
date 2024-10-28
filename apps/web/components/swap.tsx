"use client";
import { useRouter, usePathname } from "next/navigation";
import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";

export interface SwapProps {
  swapForm: JSX.Element;
  wallet?: JSX.Element;
}

export function SwapForm({ swapForm }: SwapProps) {
  return (
    <div className="flex items-center justify-center">
      <Toaster />
      <div className="flex flex-col w-full px-[16px] pt-8 xl:px-[41px] xl:pt-8 lg:px-[32px] sm:px-[16px]">
        <Header />
        {swapForm}
      </div>
    </div>
  );
}
