'use client';
import Link from "next/link";
import "./style.css";
import Image from "next/image";
import {  useState } from "react";
import useClickOutside from "@/hook/useClickOutside";
// import { useNotifyTransactions, useWalletStore } from "@/lib/stores/wallet";
// import { truncateAddress } from "@/lib/utils";
import stylesButton from "./css/button.module.css";
import stylesHeader from "./css/header.module.css";
// import { Wallet } from "./wallet/wallet";
// import { useBalancesStore, useObserveBalances } from "@/lib/stores/balances";
// import { useChainStore, usePollBlockHeight } from "@/lib/stores/chain";
// import { tokens } from "@/tokens";
// import { useClientStore } from "@/lib/stores/client";
export default function Header({ type }: { type?: string }) {
  // const {
  //   connectWallet,
  //   wallet,
  //   observeWalletChange,
  //   initializeWallet,
  //   isWalletOpen,
  //   setIsWalletOpen,
  // } = useWalletStore();
  // const { start, client } = useClientStore();
  // const {
  //   balances,
  //   loading: balancesLoading,
  //   clearBalances,
  // } = useBalancesStore();
  // usePollBlockHeight();
  // const { block } = useChainStore();
  // useNotifyTransactions();

  // useEffect(() => {
  //   wallet && clearBalances(wallet);
  // }, [wallet]);
  // useObserveBalances(tokens, wallet, type);

  // useEffect(() => {
  //   !client && start();
  //   observeWalletChange();
  //   initializeWallet();
  // }, []);

  // const ownBalances = wallet ? balances[wallet] : {};

  // const loading =
  //   balancesLoading && !!(wallet && balances[wallet]?.["0"] === undefined);

  const [showMenuMobile, setShowMenuMobile] = useState<boolean>(false);
  let dataHeader = [
    {
      value: "home",
      label: "Home",
      path: "/",
    },
    {
      value: "swap",
      label: "Trade",
      path: "/swap",
    },
    {
      value: "pool",
      label: "Pool",
      path: "/pool",
    },
    {
      value: "tokens",
      label: "Info",
      path: "/info/tokens",
    },
  ];

  const refMenuMobile = useClickOutside<HTMLDivElement>(() => {
    setShowMenuMobile(false);
  });

  let path = window && window?.location?.pathname.slice(1);

  return (
    <>
      <div className="flex justify-center">
        <div className="flex w-full items-center justify-between">
          <div
            className={`${stylesHeader["header-content"]} flex items-center gap-6`}
            style={{zIndex:121}}
          >
            {dataHeader.map((item, index) => {
              return (
                <Link
                  href={item?.path}
                  key={index}
                  className={`${stylesButton["button-header"]} ${item?.value !== "tokens"
                      ? item?.value === "pool" &&
                        (path === "pool" ||
                          path.includes("add") ||
                          path.includes("remove"))
                        ? stylesButton["button-header-active"]
                        : path === item?.value
                          ? stylesButton["button-header-active"]
                          : ""
                      : path === "pools" ||
                        path === "tokens" ||
                        path === "transactions" ||
                        path.includes("info")
                        ? stylesButton["button-header-active"]
                        : ""
                    }`}
                  prefetch={true}
                >
                  <span>{item?.label}</span>
                </Link>
              );
            })}
          </div>
          <div className={stylesHeader["header-menu-mobile"]}>
            <div
              className={`${stylesHeader["menu"]} ${stylesButton["button-menu"]}`}
              onClick={() => setShowMenuMobile(true)}
            >
              <span></span>
            </div>
            <Image
              src={"/images/home/dex.svg"}
              alt="dex"
              width={30}
              height={30}
              className="ml-[10px]"
            />
            <div
              className={`${stylesHeader["popup-menu-mobile"]} ${showMenuMobile ? stylesHeader["popup-menu-mobile-show"] : ""
                }`}
              ref={refMenuMobile}
            >
              <div className={stylesHeader["popup-menu-content"]}>
                {dataHeader.map((item, index) => {
                  return (
                    <Link
                      href={item.path}
                      key={index}
                      className={` ${stylesHeader["menu-item"]} ${item.value !== "tokens"
                          ? item.value === "pool" &&
                            (path === "pool" ||
                              path.includes("add") ||
                              path.includes("remove"))
                            ? stylesHeader["menu-item-active"]
                            : path === item.value
                              ? stylesHeader["menu-item-active"]
                              : ""
                          : path === "pools" ||
                            path === "tokens" ||
                            path === "transactions" ||
                            path.includes("info")
                            ? stylesHeader["menu-item-active"]
                            : ""
                        }`}
                      prefetch={true}
                    >
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <div className={stylesHeader["content-social-menu-mobile"]}>
                  <a href="https://x.com/realDinoDex" target="_blank">
                    <Image
                      src={"/images/social/git.svg"}
                      width={28}
                      alt={""}
                      height={28}
                    />
                  </a>
                  <a href="" target="_blank">
                    <Image
                      src={"/images/social/x.svg"}
                      width={28}
                      alt={""}
                      height={28}
                    />
                  </a>
                  <a href="" target="_blank">
                    <Image
                      src={"/images/social/discord.svg"}
                      width={28}
                      height={28}
                      alt={""}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* <div
            className={`${stylesButton["button-connect-wallet"]} ${wallet ? stylesButton["button-connect-wallet-active"] : ""}`}
            onClick={async () =>
              !wallet ? await connectWallet() : setIsWalletOpen(true)
            }
          >
            {wallet ? (
              <div className="flex items-center gap-[8px]">
                <Image src="/icon/wallet-icon.svg" width={29} height={29} alt='' />
                <span className="text-[18px] font-[500] text-textBlack">{truncateAddress(wallet)}</span>
              </div>
            ) : (
              <span>Connect wallet</span>
            )}
          </div> */}
        </div>
      </div>
      {/* <Wallet
        loadingBalances={loading}
        blockHeight={block?.height}
        address={wallet}
        balances={ownBalances}
        open={isWalletOpen}
        setIsWalletOpen={setIsWalletOpen}
        forceIsWalletOpen={!!wallet}
      /> */}
    </>
  );
}
