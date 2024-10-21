import Link from "next/link";
import "./style.css";
import Image from "next/image";
import { useState } from "react";
import useClickOutside from "@/hook/useClickOutside";
import { useClientStore } from "@/lib/stores/client";
import { useWalletStore } from "@/lib/stores/wallet";
import { truncateAddress } from "@/lib/utils";
import stylesButton from './css/button.module.css'
import stylesHeader from './css/header.module.css'
export function Header() {
  const { connectWallet, wallet, observeWalletChange, initializeWallet, setIsWalletOpen } =
    useWalletStore();
  // const client = useClientStore();
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
      path: "/tokens",
    },
  ];

  const refMenuMobile = useClickOutside<HTMLDivElement>(() => {
    setShowMenuMobile(false);
  });

  let path = window.location.pathname.slice(1);

  return (
    <div className="flex justify-center">
      <div className="flex w-full items-center justify-between">
        <div className={`${stylesHeader["header-content"]} flex items-center gap-6`}>
          {dataHeader.map((item, index) => {
            return (
              <Link
                href={item.path}
                key={index}
                className={`${stylesButton["button-header"]} ${item.value !== "tokens"
                    ? item.value === "pool" && (path === "pool" || path.includes("add") || path.includes("remove")) ? stylesButton["button-header-active"]
                      : path === item.value
                        ? stylesButton["button-header-active"]
                        : ""
                    : path === "pools" ||
                      path === "tokens" ||
                      path === "transactions" ||
                      path.includes('tokens')
                      ? stylesButton["button-header-active"]
                      : ""
                  }`}
              >
                <span>{item.label}</span>
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
                    className={` ${stylesHeader["menu-item"]} ${path.includes(item.value) ? stylesHeader["menu-item-active"] : ""
                      }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className={stylesHeader["content-social-menu-mobile"]}>
                <a href="https://twitter.com/dinodex" target="_blank">
                  <Image
                    src={"/images/social/git.svg"}
                    width={28}
                    alt={""}
                    height={28}
                  />
                </a>
                <a href="https://t.me/dinodex" target="_blank">
                  <Image
                    src={"/images/social/x.svg"}
                    width={28}
                    alt={""}
                    height={28}
                  />
                </a>
                <a href="https://discord.com/invite/9nXbJX5" target="_blank">
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
        <div
          className={`${stylesButton["button-connect-wallet"]} ${wallet ? stylesButton["button-connect-wallet-active"] : ""}`}
          onClick={async () => !wallet ? (await connectWallet()) : setIsWalletOpen(true)}
        >
          <span>
            {wallet ? truncateAddress(wallet) : "Connect wallet"}
          </span>
        </div>
      </div>
    </div>
  );
}
