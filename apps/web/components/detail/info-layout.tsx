import { DATA_TOKENS } from "@/constants";
import { ChartToken } from "../token/chart-token";
import Image from "next/image";
import { FilterSort } from "./filter-sort";
import '../style.css'
import { Table } from "../table/table";
import { useState } from "react";
import { TransactionPanel } from "./transaction-panel";
import { PoolPanel } from "./pool-panel";
import { Swap } from "../swap/swap";
import stylesTokens from "../css/tokens.module.css";
import stylesDetails from "../css/detailToken.module.css";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { SwapForm } from "../swap";

export interface InfoLayoutProps {
  type: string;
  params: any;
}

let SWITCH_MENU = [
  {
    value: 'transaction',
    label: 'Transaction'
  },
  {
    value: 'pools',
    label: 'Pools'
  }
]

export function InfoLayout({ type, params }: InfoLayoutProps) {
  const token = DATA_TOKENS.find(token => token.slug === params.name[0])
  const [tab, setTab] = useState('transaction')
  return (
    <>
      <div className="mt-[40px] w-full mx-auto flex flex-col items-center gap-[20px] xl:mt-[63px] xl:gap-[46px] xl:flex-row xl:items-start xl:justify-center lg:gap-[32px] lg:items-start">
        <div className="w-full max-w-[734px]">
          <div className={stylesDetails["token-info-container"]}>
            <div className={stylesTokens["token-detail-info-logo"]}>
              <Image src={`/${token?.logo}` || ""} alt="token-1" width={40} height={40} />
            </div>
            <span className={stylesDetails["token-info-name-text"]}>{token?.name}</span>
            <span className={stylesDetails["token-info-symbol-text"]}>{token?.symbol}</span>
          </div>
          <div className={stylesDetails["token-chart-container"]}>
            <div className={stylesDetails["token-chart-price"]}>
              <span className={stylesDetails["token-chart-price-text"]}>${token?.price}</span>
              <span className={`${stylesDetails["token-chart-change-text"]} ${stylesDetails["text-red"]}`}>
                <img src="/images/token/change-down.svg" alt="token-1" />
                -0.01%
              </span>
            </div>
            <ChartToken type="token" />
          </div>
          <FilterSort />
          <div className={stylesDetails["stats-token-container"]}>
            <span className={stylesDetails["stats-token-title"]}>Stats</span>
            <div className={stylesDetails["stats-token-info"]}>
              <div className={stylesDetails["stats-token-info-item"]}>
                <span className={stylesDetails["stats-token-info-item-title"]}>TVL</span>
                <span className={stylesDetails["stats-token-info-item-value"]}>$165.3M</span>
              </div>
              <div className={stylesDetails["stats-token-info-item"]}>
                <span className={stylesDetails["stats-token-info-item-title"]}>Market Cap</span>
                <span className={stylesDetails["stats-token-info-item-value"]}>$118.8B</span>
              </div>
              <div className={stylesDetails["stats-token-info-item"]}>
                <span className={stylesDetails["stats-token-info-item-title"]}>FDV</span>
                <span className={stylesDetails["stats-token-info-item-value"]}>$118.8B</span>
              </div>
              <div className={stylesDetails["stats-token-info-item"]}>
                <span className={stylesDetails["stats-token-info-item-title"]}>1 day volume</span>
                <span className={stylesDetails["stats-token-info-item-value"]}>$99.9M</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[30px] my-[25px]">
            {SWITCH_MENU?.map((item, index) => {
              return (
                <span
                  key={index}
                  onClick={() => {
                    setTab(item.value);
                  }}
                  className={`${stylesTokens["menu-token-item"]} ${tab === item.value ? stylesTokens["menu-token-item-active"] : ""}`}
                >
                  {item.label}
                </span>
              );
            })}
          </div>
          {tab === 'transaction' && <TransactionPanel token={token} />}
          {tab === 'pools' && <PoolPanel token={token} />}
        </div>
        <div className="w-full max-w-[734px] xl:max-w-[426px] lg:max-w-[426px] sm:max-w-[734px] mt-[-7px]">
          <div className="w-full hidden xl:block lg:block sm:hidden">
            <Swap token={token} type="tokenDetail" />
          </div>
          <div className={stylesDetails["swap-container-info"]}>
            <span className={stylesDetails["swap-text"]}>Info</span>
            <div className={stylesDetails["swap-info-content"]}>
              <div className={stylesDetails["swap-info-item"]} data-address="0xFd08as123u8asy348123FCbb9">
                <Image src="/icon/icon-copy.svg" alt="info" width={18} height={18} />
                <span className="swap-info-item-text">0xFd08...FCbb9</span>
              </div>
              <div className={stylesDetails["swap-info-item"]}>
                <Image src="/icon/icon-explorer.svg" alt="info" width={24} height={24} />
                <span className="swap-info-item-text">Explorer</span>
              </div>
              <div className={stylesDetails["swap-info-item"]}>
                <Image src="/icon/web-icon.svg" alt="info" width={24} height={24} />
                <span className="swap-info-item-text">Website</span>
              </div>
            </div>
          </div>
        </div>
        <div className="block xl:hidden lg:hidden sm:block">
          <Drawer>
            <DrawerTrigger>
              <div className="fixed bottom-[60px] left-[50%] flex items-center gap-1 text-textBlack text-[20px] rounded-[12px] border border-borderOrColor bg-bgButtonFixed py-2 px-[25px]"
                style={{ transform: 'translateX(-50%)' }}>Swap</div>
            </DrawerTrigger>
            <DrawerOverlay className="bg-[rgba(0,0,0,.5)]" />
            <DrawerContent className="bg-bgWhiteColor border-[0.826px] border-textBlack pt-[27px] pb-[73px] px-5 flex flex-col gap-3 items-center" style={{ borderRadius: '12px 12px 0 0' }}>
              <div className="flex items-center justify-center mb-[-50px] w-full relative">
                <span className="text-[20px] font-[600] text-textBlack">Swap</span>
                <DrawerClose className="absolute bottom-0 right-0">
                  <Image width={24} height={24} alt='' src="/images/swap/close-icon-modal.svg" />
                </DrawerClose>
              </div>
              <Swap token={token} type="tokenDetail" />
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </>
  );
}
