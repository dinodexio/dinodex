"use client";
import { useRouter, usePathname } from "next/navigation";
// import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";
import styles from "./css/pool.module.css";
import { Footer } from "./footer";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("./headerv2"), {
  ssr: false,
});

export interface PoolProps {
  listPool?: JSX.Element;
  optionPool?: JSX.Element;
  walletElement?: JSX.Element;
}

export function Pool({ listPool, optionPool }: PoolProps) {
  return (
    <div className="flex flex-col items-center justify-center ">
      <Toaster />
      <Header type="pool" />
      <div className="flex basis-11/12 flex-col px-[16px] pt-8 sm:px-[16px] lg:px-[32px] xl:px-[41px] xl:pt-8 2xl:basis-10/12">
        <div
          className={`mx-auto mb-[59px] mt-[0] w-full max-w-[605px] text-black sm:mt-[0] lg:mt-[90px] xl:mt-[90px] ${styles["pool-container"]}`}
        >
          {listPool}
          {/* {optionPool} */}
        </div>
        <Footer />
      </div>
    </div>
  );
}
