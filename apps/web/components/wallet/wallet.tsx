"use client";
import { cn, formatPriceUSD } from "@/lib/utils";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Balance, precision } from "../ui/balance";
import { USDBalance } from "../ui/usd-balance";
// @ts-ignore
import truncateMiddle from "truncate-middle";
import { tokens } from "@/tokens";
import Image from "next/image";
import stylesButton from "../css/button.module.css";
import {
  MENU_WALLET,
  LIST_HISTORY,
  WALLET_NEMU_ACTIVE,
  PRICE_USD,
  PRICE_MINA,
} from "@/constants";
import styles from "../css/wallet.module.css";
import { DepositLayout } from "../layoutWallet/depositLayout";
import { WithdrawLayout } from "../layoutWallet/withdrawLayout/withdrawLayout";
import { TransferLayout } from "../layoutWallet/TransferLayout/TransferLayout";
import BigNumber from "bignumber.js";
import { ChangeWalletLayout } from "../layoutWallet/changeWalletLayout";
import { useClientStore } from "@/lib/stores/client";
import { useFaucet } from "@/lib/stores/balances";
import Link from "next/link";
import { usePollTransactions } from "@/lib/stores/aggregator";

export interface Balances {
  [tokenId: string]: string | any;
}

export interface WalletProps {
  address?: string;
  blockHeight?: string;
  balances?: Balances;
  loadingBalances?: boolean;
  open: boolean;
  setIsWalletOpen?: (open: boolean) => void;
  onConnectWallet?: () => void;
  forceIsWalletOpen?: boolean;
}

let logo_image = {
  [WALLET_NEMU_ACTIVE.transfer]: "/images/wallet/transfer_list.svg",
  [WALLET_NEMU_ACTIVE.deposit]: "/images/wallet/deposit_list.svg",
  [WALLET_NEMU_ACTIVE.withdraw]: "/images/wallet/withdraw_list.svg",
};

export function Wallet({
  address,
  blockHeight,
  balances,
  open,
  setIsWalletOpen,
}: WalletProps) {
  usePollTransactions();
  const { client } = useClientStore();
  const [menuItemActive, setMenuItemActive] = useState("");
  const [listDataWallet, setListDataWallet] = useState("token");
  // const route = useRouter()
  const [showInfoWallet, setShowInfoWallet] = useState(false);
  // const [isWalletDoneTransitioning, setIsWalletDoneTransitioning] =
  //   useState(true);
  // const [shouldDelayChevrons, setShouldDelayChevrons] = useState(false);

  // const refDrawer = useClickOutside<HTMLDivElement>(() => {
  //   setIsWalletOpen && setIsWalletOpen(false);
  // });

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

  // Object.keys(tokens).forEach((tokenId) => {
  //   useObserveBalance(tokenId, address);
  // });

  useEffect(() => {
    if (!open) {
      setMenuItemActive("");
    }
  }, [open]);

  const faucet = useFaucet();

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
        className={`fixed bottom-0 left-[0] right-0 top-[100px] ${open ? "visible opacity-100" : "invisible opacity-0"}`}
        style={{ zIndex: 100 }}
        onClick={() => setIsWalletOpen && setIsWalletOpen(false)}
      />
      <div
        className={`fixed right-0 top-0 h-[100vh] w-[95%] max-w-[400px] transition-all duration-300 ease-in-out ${open ? "visible opacity-100" : "invisible opacity-0"}`}
        style={{
          background:
            "linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, #898989 100%)",
          zIndex: 101,
        }}
      />

      <div
        // ref={refDrawer}
        // onMouseLeave={() => setShouldDelayChevrons(false)}
        // onMouseEnter={() => setShouldDelayChevrons(true)}
        className={cn([
          `fixed -right-[350px] top-[15px] z-50 flex w-[350px] flex-col rounded-[18px] pb-[18px] pl-[20px] pr-[20px] pt-[30px] transition-all duration-300 ease-in-out sm:top-[15px] lg:top-[30px] xl:top-[30px] ${styles["wallet-container"]}`,
          {
            "right-[15px] z-[1000] bg-bgWhiteColor sm:right-[15px] lg:right-[30px] xl:right-[30px]":
              open,
          },
        ])}
        style={{ zIndex: 102 }}
      >
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-full flex-col items-center justify-center rounded-[18px] bg-bgWhiteColor opacity-90",
            {
              hidden: true,
            },
          )}
          style={{ zIndex: 1000 }}
        >
          <Loader2Icon className="h-12 w-12 animate-spin text-textBlack" />
        </div>
        <div
          className={cn(
            "list-token-wallet flex h-full flex-col overflow-y-scroll transition-all duration-100",
            {
              "blur-md": false,
            },
          )}
        >
          <div
            className={`flex items-center justify-between ${styles["wallet-header"]}`}
          >
            <div className="flex items-center gap-[10px]">
              <Image
                src="/images/home/dex.svg"
                alt="logo"
                width={30}
                height={30}
              />
              <span className="text-[20px] font-[500] text-textBlack">
                MINA
              </span>
            </div>
            <Image
              src="/icon/Close-icon.svg"
              alt="logo"
              width={30}
              height={30}
              className="mt-[-15px] cursor-pointer"
              onClick={() => setIsWalletOpen && setIsWalletOpen(false)}
            />
          </div>
          <div className="mt-[15px] flex flex-col gap-[20px]">
            <div className="flex flex-col items-start gap-[8px]">
              <div className="flex items-center gap-[4px]">
                <span className="text-[18px] font-[300] tracking-[1px] text-textBlack">
                  Connected
                </span>
                <div className="mt-[2px] h-[12px] w-[12px] rounded-[12px] bg-[#0A6]" />
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => setMenuItemActive(WALLET_NEMU_ACTIVE.change)}
                >
                  <Image
                    src={"/icon/change-wallet-icon.svg"}
                    alt="logo"
                    width={15}
                    height={15}
                  />
                </div>
              </div>
              <div className="flex items-center gap-[4px]">
                <p className="text-[20px] font-[500] text-textBlack">
                  {address ? truncateMiddle(address, 5, 5, "...") : "—"}
                </p>
                <Image
                  src="/icon/copy-or-icon.svg"
                  alt="logo"
                  width={16}
                  height={16}
                  className="cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(address || "");
                    alert("copied!");
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center gap-[4px]">
                <span className="text-[18px] font-[300] tracking-[1px] text-textBlack">
                  Current balance
                </span>
                <Image
                  src={
                    showInfoWallet
                      ? "/icon/show-balance-icon.svg"
                      : "/icon/hide-balance-icon.svg"
                  }
                  alt="logo"
                  width={16}
                  height={16}
                  className="cursor-pointer"
                  onClick={() => setShowInfoWallet(!showInfoWallet)}
                />
              </div>
              <div className="h-[43px]">
                <span className="text-[32px] font-[500] text-textBlack">
                  {showInfoWallet ? (
                    <Balance balance={balances?.["0"] ?? "0"} tokenId="0" />
                  ) : (
                    "*****"
                  )}
                </span>
              </div>
              <span className="text-[18px] font-[300] tracking-[1px] text-textBlack">
                {showInfoWallet ? (
                  <USDBalance
                    balance={formatPriceUSD(
                      BigNumber(balances?.["0"])
                        .div(10 ** precision)
                        .toNumber(),
                      "MINA",
                    )}
                    type="USD"
                  />
                ) : (
                  "~$*****"
                )}
              </span>
            </div>
          </div>
          <div className="mt-[15px] flex items-center justify-between">
            {MENU_WALLET?.map((item) => {
              return (
                <div
                  className={`flex w-[89px] cursor-pointer flex-col items-center ${styles["menu-item"]}`}
                  key={item.value}
                  onClick={() => setMenuItemActive(item.value)}
                >
                  <div className="relative">
                    <Image
                      src={item.icon_default}
                      width={48}
                      height={48}
                      alt={item.value}
                      className={`opacity-100 transition-all duration-300 ease-in-out ${styles["image-default"]}`}
                    />
                    <Image
                      src={item.icon_hover}
                      width={48}
                      height={48}
                      alt={item.value}
                      className={`absolute top-0 opacity-0 transition-all duration-300 ease-in-out ${styles["image-hover"]}`}
                    />
                    <Image
                      src={item.icon_active}
                      width={48}
                      height={48}
                      alt={item.value}
                      className={`absolute top-0 transition-all duration-300 ease-in-out ${menuItemActive === item.value ? "opacity-100" : "opacity-0"}`}
                    />
                  </div>
                  <span className="p-[10px] text-center text-[16px] font-[400] text-textBlack">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-[15px] flex flex-grow flex-col gap-[11px]">
            <div className="h-[1px] w-full bg-textBlack" />
            <div className="flex items-center gap-[25px]">
              <span
                className={`cursor-pointer text-[18px] font-[300] transition-all duration-300 ease-in-out ${listDataWallet === "token" ? "font-[500] text-borderOrColor" : "text-textBlack opacity-[0.29] hover:opacity-[1]"}`}
                style={{ letterSpacing: 1 }}
                onClick={() => {
                  if (listDataWallet !== "token") {
                    setListDataWallet("token");
                  }
                }}
              >
                Token
              </span>
              <span
                className={`cursor-pointer text-[18px] font-[300] transition-all duration-300 ease-in-out ${listDataWallet === "history" ? "font-[500] text-borderOrColor" : "text-textBlack opacity-[0.29] hover:opacity-[1]"}`}
                style={{ letterSpacing: 1 }}
                onClick={() => {
                  if (listDataWallet !== "history") {
                    setListDataWallet("history");
                  }
                }}
              >
                History
              </span>
            </div>
            <div className="list-token-wallet mb-[20px] mt-[18px] grid max-h-[210px] gap-[15px] overflow-y-scroll">
              {listDataWallet === "token" && (
                <>
                  {Object.entries(balances ?? {}).map(([tokenId, balance]) => {
                    const token = tokens[tokenId];
                    if (
                      !token ||
                      (BigInt(tokenId) > BigInt(3) && balance == "0")
                    )
                      return null;
                    return (
                      <div
                        className="flex items-center justify-between"
                        key={tokenId}
                      >
                        <div className="flex items-center">
                          <img
                            className="mr-[10px] h-8 w-8"
                            src={token?.logo}
                          />
                          <div>
                            <p className="text-[16px] font-[500] text-textBlack">
                              {token?.ticker}
                            </p>
                            <p className="text-[12px] font-[300] tracking-[1px] text-textBlack">
                              {token?.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={cn(
                              "text-[16px] font-[500] text-textBlack",
                            )}
                          >
                            <Balance balance={balance} />
                          </p>
                          <p
                            className={cn(
                              "text-[12px] font-[300] tracking-[1px] text-textBlack",
                            )}
                          >
                            <USDBalance balance={undefined} />
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              {listDataWallet === "history" && (
                <>
                  {LIST_HISTORY?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-[10px]">
                        <Image
                          src={logo_image[item.type]}
                          width={40}
                          height={40}
                          alt=""
                        />
                        <div className="flex flex-col gap-[2px]">
                          <span
                            className={`text-[16px] font-[500] capitalize text-textBlack ${styles[item.type + `-text`]}`}
                          >
                            {item.type === WALLET_NEMU_ACTIVE.withdraw
                              ? "Withdrawal"
                              : item.type}
                          </span>
                          <span className="text-[12px] font-[300] text-textBlack">
                            {item.type === WALLET_NEMU_ACTIVE.transfer
                              ? "Mina Protocol"
                              : item.type === WALLET_NEMU_ACTIVE.deposit
                                ? `From: ${truncateMiddle(item.address, 7, 5, "...")}`
                                : `To: ${truncateMiddle(item.address, 7, 5, "...")}`}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-[2px]">
                        <span
                          className={`flex items-center justify-end text-[16px] font-[500] capitalize text-textBlack`}
                        >
                          {Number(item.price).toFixed(2)} {item.token.label}
                        </span>
                        <span
                          className="cursor-pointer text-[12px] font-[300] italic text-borderOrColor"
                          style={{ textDecoration: "underline" }}
                          // onClick={() => {
                          //   window.open(
                          //     `https://minascan.io/mainnet/account/${item.address}/txs`,
                          //     "_blank",
                          //   );
                          // }}
                        >
                          View on Minascan
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            {listDataWallet === "token" && (
              <span className="flex w-full cursor-pointer items-center justify-center text-[16px] font-[500] text-borderOrColor hover:underline">
                + Import token
              </span>
            )}
          </div>
          <div className="flex flex-col gap-[15px]">
            <Button
              className={`${stylesButton["button-swap"]} ${stylesButton["button-wallet"]} *:w-full`}
              onClick={() => client && address && faucet()}
            >
              {/* <span>
                <PiggyBank className="mr-2 h-4 w-4" />
              </span> */}
              <span className="text-white">Get test tokens</span>
            </Button>
            <div className="flex w-full items-center justify-between">
              <div className="w-[60px]">
                <p className="text-[12px] font-[300] tracking-[1px] text-textBlack">
                  Network
                </p>
                <p className="text-[16px] font-[500] text-textBlack">
                  Localnet
                </p>
              </div>
              <div className="mr-[-12px] flex items-center justify-center gap-[8.8px]">
                <Link href="https://github.com/dinodexio" target="_blank">
                  <Image
                    src={"/images/social/git.svg"}
                    alt="logo"
                    width={22}
                    height={22}
                    style={{ cursor: "pointer" }}
                  />
                </Link>
                <Link href="https://x.com/realDinoDex" target="_blank">
                  {" "}
                  <Image
                    src={"/images/social/x.svg"}
                    alt="logo"
                    width={22}
                    height={22}
                    style={{ cursor: "pointer" }}
                  />
                </Link>

                <Image
                  src={"/images/social/discord.svg"}
                  alt="logo"
                  width={22}
                  height={22}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div className="flex flex-col items-end gap-[2px]">
                <p
                  className="text-[12px] font-[300] tracking-[1px] text-textBlack"
                  style={{ letterSpacing: "0.3px" }}
                >
                  Current block
                </p>
                <p className="text-[16px] font-[500] text-textBlack">
                  {blockHeight ? `#${blockHeight}` : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div
            className={`absolute bottom-0 right-0 top-0 h-full w-full rounded-[18px]
                        ${styles["overlay-wallet"]} ${menuItemActive !== "" && open ? styles["show-overlay-wallet"] : ""}`}
            style={{ zIndex: 101 }}
            onClick={() => setMenuItemActive("")}
          ></div>
          {menuItemActive === WALLET_NEMU_ACTIVE.deposit && open && (
            <DepositLayout onClose={() => setMenuItemActive("")} />
          )}
          {menuItemActive === WALLET_NEMU_ACTIVE.withdraw && open && (
            <WithdrawLayout onClose={() => setMenuItemActive("")} />
          )}
          {menuItemActive === WALLET_NEMU_ACTIVE.transfer && open && (
            <TransferLayout onClose={() => setMenuItemActive("")} />
          )}
          {menuItemActive === WALLET_NEMU_ACTIVE.change && open && (
            <ChangeWalletLayout
              onClose={() => setMenuItemActive("")}
              address={address || ""}
            />
          )}
        </div>
      </div>
    </div>
  );
}
