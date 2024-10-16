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
import { BlockHeight } from "chain/dist/runtime/locks";
import { tokens } from "@/tokens";
import { Skeleton } from "@/components/ui/skeleton";
import useClickOutside from "@/hook/useClickOutside";

export interface Balances {
  [tokenId: string]: string | undefined;
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

  console.log('balances',balances)

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
          "fixed -right-[360px] top-0 z-50 flex h-full w-[360px] flex-col  rounded-2xl  border-l-2 transition-all duration-300 ease-in-out",
          {
            "right-[0px] border-l-neutral-50 bg-neutral-50": open,
          },
        ])}
      >
        <div
          className={cn(
            "absolute right-0 flex h-full w-[360px] flex-col items-center justify-center border-l-2 border-l-black bg-neutral-50 opacity-90",
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
          <div className="rounded-xl border border-neutral-500 p-6">
            <div className="w-full rounded-2xl ">
              <p className="text-xs text-textBlack">Connected wallet</p>
              <p className="pt-1 text-sm text-black">
                {address ? truncateMiddle(address, 15, 15, "...") : "—"}
              </p>
            </div>
            <div className="flex flex-col pt-4">
              <p className="text-xs text-textBlack">Current balance</p>
              <p className={cn("pt-1 text-2xl text-black")}>
                <Balance balance={balances?.["0"] ?? "0"} tokenId="0" />
              </p>
              <p className={cn("max-w-32 text-sm text-textBlack")}>
                <USDBalance balance={undefined} />
              </p>
            </div>
          </div>

          <div className="flex flex-grow flex-col justify-between">
            <div className="p-6">
              <p className="text-md mb-5  text-textBlack">Tokens</p>

              <div className="grid gap-2">
                {Object.entries(balances ?? {}).map(([tokenId, balance]) => {
                  const token = tokens[tokenId];
                  if (!token || (BigInt(tokenId) > 3n && balance == "0"))
                    return null;
                  return (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img className="mr-3 h-8 w-8" src={token.logo} />
                        <div>
                          <p className="text-sm text-black">{token.ticker}</p>
                          <p className="text-xs text-textBlack">{token.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn("text-md pt-0.5 text-black")}>
                          <Balance balance={balance} />
                        </p>
                        <p className={cn("text-sm text-textBlack")}>
                          <USDBalance balance={undefined} />
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-between p-6">
              <Button
                size="sm"
                className="button-swap mb-4 w-full"
                variant={"outline"}
                onClick={onFaucetDrip}
              >
                <span>
                  <PiggyBank className="mr-2 h-4 w-4" />
                </span>

                <span>Get test tokens</span>
              </Button>
              <div className="flex w-full justify-between">
                <div>
                  <p className="text-xs text-muted">Network</p>
                  <p className="text-sm text-black">Localnet</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Current block</p>
                  <p className="text-sm text-black">
                    {blockHeight ? `#${blockHeight}` : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
