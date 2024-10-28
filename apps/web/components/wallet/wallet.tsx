"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Loader2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Balance, precision } from "../ui/balance";
import { USDBalance } from "../ui/usd-balance";
// @ts-ignore
import truncateMiddle from "truncate-middle";
import { tokens } from "@/tokens";
import useClickOutside from "@/hook/useClickOutside";
import Image from "next/image";
import "../style.css";
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
import { useRouter } from "next/navigation";

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

let logo_image = {
  [WALLET_NEMU_ACTIVE.transfer]: "/images/wallet/transfer_list.svg",
  [WALLET_NEMU_ACTIVE.deposit]: "/images/wallet/deposit_list.svg",
  [WALLET_NEMU_ACTIVE.withdraw]: "/images/wallet/withdraw_list.svg",
};

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
  const [menuItemActive, setMenuItemActive] = useState("");
  const [listDataWallet, setListDataWallet] = useState("token");
  const route = useRouter()
  const [showInfoWallet, setShowInfoWallet] = useState(false)
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

  useEffect(() => {
    if (!open) {
      setMenuItemActive("");
    }
  }, [open]);

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
      <div className={`fixed right-0 top-0 w-[400px] h-[100vh] transition-all duration-300 ease-in-out ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
        style={{ background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, #898989 100%)', zIndex: 99 }} />

      <div
        ref={refDrawer}
        // onMouseLeave={() => setShouldDelayChevrons(false)}
        // onMouseEnter={() => setShouldDelayChevrons(true)}
        className={cn([
          "fixed -right-[350px] top-[30px] z-50 flex w-[350px] flex-col rounded-[18px] pb-[18px] pl-[20px] pr-[20px] pt-[30px] transition-all duration-300 ease-in-out",
          {
            "right-[30px] z-[1000] bg-bgWhiteColor": open,
          },
        ])}
        style={{ height: "calc(100vh - (60px))", zIndex: 100 }}
      >
        <div
          className={cn(
            "absolute right-0 flex top-0 h-full w-full flex-col rounded-[18px] items-center justify-center bg-bgWhiteColor opacity-90",
            {
              hidden: !loading,
            },
          )}
          style={{ zIndex: 1000 }}
        >
          <Loader2Icon className="h-12 w-12 animate-spin text-textBlack" />
        </div>
        <div
          className={cn("flex h-full flex-col transition-all duration-100", {
            "blur-md": loading,
          })}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <Image
                src="/images/home/dex.svg"
                alt="logo"
                width={30}
                height={30}
              />
              <span className="text-[20px] font-[500] text-textBlack">MINA</span>
            </div>
            <Image
              src="/icon/Close-icon.svg"
              alt="logo"
              width={30}
              height={30}
              className="cursor-pointer mt-[-15px]"
              onClick={() => setIsWalletOpen(false)}
            />
          </div>
          <div className="mt-[15px] flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[8px] items-start">
              <div className="flex items-center gap-[4px]">
                <span className="text-[18px] font-[300] tracking-[1px] text-textBlack">
                  Connected
                </span>
                <div className="w-[12px] h-[12px] rounded-[12px] bg-[#0A6] mt-[2px]" />
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
                  src={showInfoWallet ? "/icon/show-balance-icon.svg" : "/icon/hide-balance-icon.svg"}
                  alt="logo"
                  width={16}
                  height={16}
                  className="cursor-pointer"
                  onClick={() => setShowInfoWallet(!showInfoWallet)}
                />
              </div>
              <div className="h-[43px]">
                <span className="text-[36px] font-[500] text-textBlack">
                  {showInfoWallet ? <Balance balance={balances?.["0"] ?? "0"} tokenId="0" /> : "*****"}
                </span>
              </div>
              <span className="text-[18px] font-[300] tracking-[1px] text-textBlack">
                {showInfoWallet ? <USDBalance
                  balance={BigNumber(balances?.["0"] * PRICE_MINA * PRICE_USD)
                    .div(10 ** precision)
                    .toFixed(2)
                    .toString()}
                  type="USD"
                /> : "~$*****"}
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
            <div
              className="list-token-wallet mb-[20px] mt-[18px] grid gap-[15px] overflow-y-scroll"
              style={{
                maxHeight:
                  "calc(100vh - (60px + 80px + 174px + 25px + 30px + 21px + 200px + 87px))",
              }}
            >
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
                          <img className="mr-[10px] h-8 w-8" src={token.logo} />
                          <div>
                            <p className="text-[16px] font-[500] text-textBlack">
                              {token.ticker}
                            </p>
                            <p className="text-[12px] font-[300] tracking-[1px] text-textBlack">
                              {token.name}
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
                            className={`text-[16px] font-[500] capitalize ${styles[item.type + `-text`]}`}
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
                          className={`flex items-center justify-end text-[16px] font-[500] capitalize`}
                        >
                          {Number(item.price).toFixed(2)} {item.token.label}
                        </span>
                        <span
                          className="cursor-pointer text-[12px] font-[300] italic text-borderOrColor"
                          style={{ textDecoration: "underline" }}
                          onClick={() => {
                            window.open(`https://minascan.io/mainnet/account/${item.address}/txs`, "_blank");
                          }}
                        >
                          View on Minascan
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            {listDataWallet === 'token' && (
              <span className="text-borderOrColor text-[16px] font-[500] hover:underline cursor-pointer w-full flex items-center justify-center">
                + Import token
              </span>
            )}
          </div>
          <div className="flex flex-col gap-[15px]">
            <Button
              className={`${stylesButton["button-swap"]} ${stylesButton["button-wallet"]} *:w-full`}
              onClick={onFaucetDrip}
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
              <div className="flex items-center justify-center gap-[8.8px] mr-[-12px]">
                <Image
                  src={"/images/social/git.svg"}
                  alt="logo"
                  width={22}
                  height={22}
                  style={{ cursor: "pointer" }}
                />
                <Image
                  src={"/images/social/x.svg"}
                  alt="logo"
                  width={22}
                  height={22}
                  style={{ cursor: "pointer" }}
                />
                <Image
                  src={"/images/social/discord.svg"}
                  alt="logo"
                  width={22}
                  height={22}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div className="flex flex-col gap-[2px] items-end">
                <p className="text-[12px] font-[300] tracking-[1px] text-textBlack" style={{ letterSpacing: "0.3px" }}>
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
            className={`absolute bottom-0 right-0 top-0 w-full h-full rounded-[18px]
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
        </div>
      </div>
    </div>
  );
}
