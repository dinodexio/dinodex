"use client";
import { useRouter, usePathname } from "next/navigation";
import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";

export interface PoolProps {
  listPool: JSX.Element;
  optionPool: JSX.Element;
  walletElement?: JSX.Element;
}

export function Pool({
  listPool,
  optionPool,
  walletElement,
}: PoolProps) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="flex flex-col w-full px-[16px] pt-8 xl:px-[41px] xl:pt-8 lg:px-[32px] sm:px-[16px]">
      <Toaster />
      <div className="flex basis-11/12 flex-col 2xl:basis-10/12">
        <Header />

        <div className="w-full max-w-[605px] mt-[25px] mx-auto mb-[59px] xl:mt-[90px] lg:mt-[90px] sm:mt-[25px] text-black">
          {listPool}
          {/* {optionPool} */}
        </div>
      </div>
      {walletElement}
    </div>
  );
}
