import Link from "next/link";
import "./style.css";
import Image from "next/image";
import { useState } from "react";
import useClickOutside from "@/hook/useClickOutside";
import { useClientStore } from "@/lib/stores/client";
import { useWalletStore } from "@/lib/stores/wallet";
import { truncateAddress } from "@/lib/utils";
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
      label: "Tokens",
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
        <div className="header-content flex items-center gap-6">
          {dataHeader.map((item, index) => {
            return (
              <Link
                href={item.path}
                key={index}
                className={`button-header ${
                  item.value !== "tokens"
                    ? path === item.value
                      ? "button-header-active"
                      : ""
                    : path === "pools" ||
                        path === "tokens" ||
                        path === "transactions"
                      ? "button-header-active"
                      : ""
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="header-menu-mobile">
          <div
            className="menu button-menu"
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
            className={`popup-menu-mobile ${
              showMenuMobile ? "popup-menu-mobile-show" : ""
            }`}
            ref={refMenuMobile}
          >
            <div className="popup-menu-content">
              {dataHeader.map((item, index) => {
                return (
                  <Link
                    href={item.path}
                    key={index}
                    className={`menu-item ${
                      path.includes(item.value) ? "menu-item-active" : ""
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="content-social-menu-mobile">
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
          className="button-connect-wallet"
          onClick={async () => !wallet ? (await connectWallet()) : setIsWalletOpen(true)}
        >
          <span className="button-connected-wallet-text">
            {wallet ? truncateAddress(wallet) : "Connect wallet"}
          </span>
        </div>
      </div>
    </div>
  );
}
