import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  ChevronsLeft,
  ChevronsRight,
  Construction,
  Loader2Icon,
  LoaderIcon,
  PiggyBank,
  Wallet as WalletIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Balance } from "../ui/balance";
import { USDBalance } from "../ui/usd-balance";
// @ts-ignore
import truncateMiddle from "truncate-middle";
import { tokens } from "@/tokens";
import { Skeleton } from "@/components/ui/skeleton";
import useClickOutside from "@/hook/useClickOutside";
import Image from "next/image";
import '../style.css'
import styles from '../css/swap.module.css'
import Link from "next/link";

export interface Balances {
  [tokenId: string]: string | any;
}

export interface WalletProps {
  address?: string;
  blockHeight?: string;
  balances?: Balances;
  loading: boolean;
  open: boolean;
  setIsWalletOpen: (open: boolean) => void;
  onConnectWallet?: () => void;
  onFaucetDrip: () => void;
  forceIsWalletOpen?: boolean;
}

export function Wallet({
  address,
  blockHeight,
  balances,
  loading,
  open,
  setIsWalletOpen,
  onConnectWallet,
  forceIsWalletOpen,
  onFaucetDrip,
}: WalletProps) {
  // const [isWalletDoneTransitioning, setIsWalletDoneTransitioning] =
  //   useState(true);
  // const [shouldDelayChevrons, setShouldDelayChevrons] = useState(false);

  const refDrawer = useClickOutside<HTMLDivElement>(() => {
    setIsWalletOpen(false);
  });

  // useEffect(() => {
  //   setShouldDelayChevrons(false);
  //   setIsWalletDoneTransitioning(false);
  //   setTimeout(() => {
  //     setIsWalletDoneTransitioning(true);
  //   }, 310);

  //   setTimeout(() => {
  //     setIsWalletOpen(forceIsWalletOpen);
  //   }, 10);
  // }, [forceIsWalletOpen]);

  // console.log('balances', balances)

  return (
    <div className="group">
      {/* <div
        className={cn(
          "fixed -right-[112px] top-7 z-0 transition-all duration-300 ease-in-out",
          {
            "group-hover:right-[246px]": open,
            "delay-1000": open && shouldDelayChevrons,
            "hover:right-0": !open && isWalletDoneTransitioning,
          },
        )}
        onClick={() => {
          setShouldDelayChevrons(false);
          setIsWalletDoneTransitioning(false);
          setTimeout(() => {
            setIsWalletDoneTransitioning(true);
          }, 300);

          !address && !open && onConnectWallet();
          address && setIsWalletOpen(!open);
        }}
      >
        <Button
          variant={"outline"}
          className={cn(
            "group relative flex w-[164px] justify-between rounded-r-none p-4 py-5 text-textBlack ",
          )}
        >
          {open ? (
            <ChevronsRight className="h-5 w-5" />
          ) : (
            <WalletIcon className="h-5 w-5" />
          )}

          <p
            className={cn([
              "opacity-0",
              "transition-all duration-300 ease-in-out",
              {
                "group-hover:ml-3 group-hover:opacity-100": !open,
              },
            ])}
          >
            {address ? "Open wallet" : "Connect wallet"}
          </p>
        </Button>
      </div> */}

      <div
        ref={refDrawer}
        // onMouseLeave={() => setShouldDelayChevrons(false)}
        // onMouseEnter={() => setShouldDelayChevrons(true)}
        className={cn([
          "fixed -right-[360px] top-0 z-50 flex h-full w-[360px] flex-col pt-[40px] pr-[30px] pb-[20px] pl-[20px] rounded-l-[12px] border border-borderOrColor transition-all duration-300 ease-in-out",
          {
            "right-[0px] bg-neutral-50 z-[1000]": open,
          },
        ])}
      >
        <div
          className={cn(
            "absolute right-0 flex h-full w-full flex-col items-center justify-center bg-neutral-50 opacity-90",
            {
              hidden: !loading,
            },
          )}
        >
          <Loader2Icon className="h-12 w-12 animate-spin text-textBlack" />
        </div>
        <div
          className={cn("flex h-full flex-col transition-all duration-100", {
            "blur-md": loading,
          })}
        >
          <div className="flex items-center justify-center mb-[30px]">
            <Image src="/images/home/dex.svg" alt="logo" width={50} height={50} />
          </div>
          <div className="flex flex-col items-start gap-[20px]">
            <div className="w-full flex flex-col gap-[8px] items-start">
              <p className="text-[18px] font-[300] text-textBlack tracking-[1px]">Connected wallet</p>
              <p className="text-[20px] font-[500] text-textBlack">
                {address ? truncateMiddle(address, 10, 10, "...") : "—"}
              </p>
            </div>
            <div className="w-full flex flex-col gap-[8px] items-start">
              <p className="text-[18px] font-[300] text-textBlack tracking-[1px]">Current balance</p>
              <p className={cn("text-[36px] font-[500] text-textBlack")}>
                <Balance balance={balances?.["0"] ?? "0"} tokenId="0" />
              </p>
              <p className={cn("text-[18px] font-[300] text-textBlack tracking-[1px]")}>
                <USDBalance balance={undefined} />
              </p>
            </div>
          </div>
          <div className="flex flex-grow flex-col gap-[25px] mt-[25px]">
            <div className="w-full h-[1px] bg-textBlack" />
            <p className="text-[18px] font-[300] text-textBlack tracking-[1px]">Tokens</p>
            <div className="grid gap-[15px] mb-[20px] overflow-y-scroll list-token-wallet" style={{maxHeight:"calc(100vh - (60px + 80px + 174px + 25px + 30px + 21px + 200px))"}}>
              {Object.entries(balances ?? {}).map(([tokenId, balance]) => {
                const token = tokens[tokenId];
                if (!token || (BigInt(tokenId) > BigInt(3) && balance == "0"))
                  return null;
                return (
                  <div className="flex items-center justify-between" key={tokenId}>
                    <div className="flex items-center">
                      <img className="mr-[10px] h-8 w-8" src={token.logo} />
                      <div>
                        <p className="text-[16px] font-[500] text-textBlack">{token.ticker}</p>
                        <p className="text-[12px] font-[300] text-textBlack tracking-[1px]">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-[16px] font-[500] text-textBlack")}>
                        <Balance balance={balance} />
                      </p>
                      <p className={cn("text-[12px] font-[300] text-textBlack tracking-[1px]")}>
                        <USDBalance balance={undefined} />
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-center gap-[17px] mb-[25px]">
              <Image src={"/images/social/git.svg"} alt="logo" width={35} height={35} style={{cursor:'pointer'}} />
              <Image src={"/images/social/x.svg"} alt="logo" width={35} height={35} style={{cursor:'pointer'}} />
              <Image src={"/images/social/discord.svg"} alt="logo" width={35} height={35} style={{cursor:'pointer'}} />
          </div>
          <div className="flex flex-col gap-[15px]">
            <Button
              size="sm"
              className={`${styles['button-swap']} ${styles['button-wallet']} *:w-full`}
              variant={"outline"}
              onClick={onFaucetDrip}
            >
              {/* <span>
                <PiggyBank className="mr-2 h-4 w-4" />
              </span> */}
              <span>Get test tokens</span>
            </Button>
            <div className="flex w-full justify-between">
              <div>
                <p className="text-[12px] font-[300] text-textBlack tracking-[1px]">Network</p>
                <p className="text-[16px] font-[500] text-textBlack">Localnet</p>
              </div>
              <div>
                <p className="text-[12px] font-[300] text-textBlack tracking-[1px]">Current block</p>
                <p className="text-[16px] font-[500] text-textBlack">
                  {blockHeight ? `#${blockHeight}` : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
