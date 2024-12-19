"use client";
import styleHeader from "./css/headerV2.module.css";
import { useEffect, useState, } from "react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import useClickOutside from "@/hook/useClickOutside";
import { useNotifyTransactions, useWalletStore } from "@/lib/stores/wallet";
import { useClientStore } from "@/lib/stores/client";
import { useBalancesStore, useObserveBalances } from "@/lib/stores/balances";
import { useChainStore, usePollBlockHeight } from "@/lib/stores/chain";
import { Wallet } from "./wallet/wallet";
import { cn, truncateAddress } from "@/lib/utils";
import Image from "next/image";
import { useToast } from "./ui/use-toast";

const listNav = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "Trade",
    link: "/swap",
  },
  {
    label: "Pool",
    link: "/pool",
  },
  {
    label: "Info",
    link: "/info/tokens",
  },
  {
    label: "Competition",
    link: "/campaign",
  },
];
export default function HeaderV2({ type }: { type?: string }) {
  const [isShowMenu, setIsShowMenu] = useState(false);
  const refNetWork = useClickOutside<HTMLDivElement>(() => {
    setIsShowMenu(false);
  });
  const {
    connectWallet,
    wallet,
    observeWalletChange,
    initializeWallet,
    isWalletOpen,
    setIsWalletOpen,
  } = useWalletStore();
  const { start, client } = useClientStore();
  const {
    balances,
    loading: balancesLoading,
    clearBalances,
  } = useBalancesStore();

  usePollBlockHeight();
  const { block } = useChainStore();
  useNotifyTransactions();

  useEffect(() => {
    wallet && clearBalances(wallet);
  }, [wallet]);
  useObserveBalances(wallet, type);

  useEffect(() => {
    !client && start();
    try {
      observeWalletChange();
      initializeWallet();
    } catch (error: any) {
      console.log(error?.message || '')
    }

  }, []);

  const ownBalances = wallet ? balances[wallet] : {};

  const loading =
    balancesLoading && !!(wallet && balances[wallet]?.["0"] === undefined);

  const pathName = usePathname()
  const {toast} = useToast()

  return (
    <>
      <header className={styleHeader["containerNavbar"]}>
        <div className={styleHeader["contentLeftNavbar"]}>
          <div className={styleHeader["containerTitleNavbar"]}>
            <div className={styleHeader["boxTitleNavbar"]}>
              <img src="/images/navbar_footer/dino_image.svg" alt="DinoDEX" />
              <Link
                href="/"
                className={styleHeader["titleNavbar"]}
                style={{ fontFamily: "PPMondwest" }}
              >
                DinoDEX
              </Link>
            </div>
            <img
              id="btnMenu"
              className={styleHeader["iconDropDownHeader"]}
              src="/images/navbar_footer/icon_drop_down.svg"
              alt="icon drop down"
              onClick={() => setIsShowMenu(true)}
            />
          </div>
          <div
            id="popupMenu"
            className={`${styleHeader["containerMenuNav_mobile"]} ${isShowMenu ? styleHeader["showMenu"] : ""}`}
            ref={refNetWork}
          >
            <div className={styleHeader["boxMenuNav_mobile"]}>
              {listNav.map((item, index) => (
                <Link
                  href={item.link}
                  key={index}
                  className={styleHeader["tabNavbar"]}
                  prefetch
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className={styleHeader["boxMenuNav"]}>
            {listNav.map((item, index) => (
              <Link
                href={item.link}
                key={index}
                className={cn(styleHeader["tabNavbar"],
                  pathName === item.link || item.label==='Info' && pathName.includes(`/info`)  ? styleHeader["tabNavbarActive"] : "")}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div
          className={
            wallet ? styleHeader["btnWalletAcount"] : styleHeader["btnConnect"]
          }
          onClick={async () =>
            !wallet ? await connectWallet().catch((error) => {
              if(error?.message === "Auro wallet not installed"){
                toast({
                  title: "Auro wallet not installed",
                  description: "Please install auro wallet to use this feature",
                  variant: "destructive",
                  className: "text-textBlack bg-white box-shadow border-0 p-4",
                })
              }
            }) : setIsWalletOpen(true)
          }
        >
          <span className={styleHeader["textBtnConnect"]}>
            {wallet ? (
              <div className="flex items-center gap-[6px]">
                <div className="flex items-center gap-[5px]">
                  <Image
                    src="/icon/wallet-icon.svg"
                    width={29}
                    height={29}
                    alt=""
                  />
                  <span className="text-black text-[19px]">{truncateAddress(wallet)}</span>
                </div>

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.292893 8.70711C-0.097631 8.31658 -0.097631 7.68342 0.292893 7.29289L6.65685 0.928932C7.04738 0.538408 7.68054 0.538408 8.07107 0.928932C8.46159 1.31946 8.46159 1.95262 8.07107 2.34315L2.41421 8L8.07107 13.6569C8.46159 14.0474 8.46159 14.6805 8.07107 15.0711C7.68054 15.4616 7.04738 15.4616 6.65685 15.0711L0.292893 8.70711ZM2 9H1V7H2V9Z"
                    fill="#FF603B"
                  />
                  <path
                    d="M7.29289 8.70711C6.90237 8.31658 6.90237 7.68342 7.29289 7.29289L13.6569 0.928932C14.0474 0.538408 14.6805 0.538408 15.0711 0.928932C15.4616 1.31946 15.4616 1.95262 15.0711 2.34315L9.41421 8L15.0711 13.6569C15.4616 14.0474 15.4616 14.6805 15.0711 15.0711C14.6805 15.4616 14.0474 15.4616 13.6569 15.0711L7.29289 8.70711ZM9 9H8V7H9V9Z"
                    fill="#FF603B"
                  />
                </svg>
              </div>
            ) : (
              "Connect Wallet"
            )}
          </span>
        </div>
      </header>
      <Wallet
        loadingBalances={loading}
        blockHeight={block?.height}
        address={wallet}
        balances={ownBalances}
        open={isWalletOpen}
        setIsWalletOpen={setIsWalletOpen}
        forceIsWalletOpen={!!wallet}
      />
    </>
  );
}
