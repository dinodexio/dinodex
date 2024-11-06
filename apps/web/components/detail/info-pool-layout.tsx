import { DATA_TOKENS } from "@/constants";
import { ChartToken } from "../token/chart-token";
import Image from "next/image";
import { FilterSort } from "./filter-sort";
import '../style.css'
import { Table } from "../table/table";
import { useEffect, useMemo, useState } from "react";
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
import useCopy from "@/hook/useCopy";
import { useAggregatorStore } from "@/lib/stores/aggregator";
import { Loader } from "../ui/Loader";
import Link from "next/link";

export interface InfoPoolLayoutProps {
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

export function InfoPoolLayout({ type, params }: InfoPoolLayoutProps) {
  const [dataHover, setDataHover] = useState<any>({})
  let token = {}
  let dataPool = {
    "balancesA": "10000000000",
    "balancesB": "100000000000",
    "tokenAId": 2,
    "tokenBId": 0,
    "tvl": "710921140000000",
    "apr": null,
    "volume_1d": null,
    "volume_7d": null,
    "id": 1,
    "tokenselected": {
      "first": {
        "ticker": "BTC",
        "name": "Bitcoin",
        "logo": "/tokens/btc.svg"
      },
      "second": {
        "ticker": "MINA",
        "name": "Mina Protocol",
        "logo": "/tokens/mina.svg"
      }
    },
    "feeTier": null,
    "volume1d": null,
    "volume7d": null
  }

  const handleClickCopy = (value: string) => {
    navigator.clipboard.writeText(value)
    alert('Copied !')
  }
  return (
    <>
      {/* {loading ? <div className="h-[100vh] flex items-center justify-center text-textBlack">
        <Loader />
      </div> : (
      )} */}
      <div className="mt-[40px] w-full mx-auto flex flex-col items-center gap-[20px] xl:mt-[63px] xl:gap-[46px] xl:flex-row xl:items-start xl:justify-center lg:gap-[32px] lg:items-center">
        <div className="w-full max-w-[734px]">
          <div className={stylesDetails["token-info-container"]}>
            <div className={stylesTokens["token-detail-info-logo"]}>
              <div className={stylesDetails["token-info-logo"]}>
                <div className="relative h-[30px] w-[30px] overflow-hidden">
                  <Image
                    className="absolute left-1/2 border border-textBlack rounded-full"
                    src={dataPool?.tokenselected?.first?.logo}
                    alt={dataPool?.tokenselected?.first?.name}
                    width={30}
                    height={30}
                  />
                </div>
                <div className="relative h-[30px] w-[30px] overflow-hidden">
                  <Image
                    className="absolute right-1/2  border border-textBlack rounded-full"
                    src={dataPool?.tokenselected?.second?.logo}
                    alt={dataPool?.tokenselected?.second?.name}
                    width={30}
                    height={30}
                  />
                </div>
              </div>
            </div>
            <span className={`text-[20px] xl:text-[24px] lg:text-[24px] sm:text-[20px] font-[400] text-textBlack`}>{dataPool?.tokenselected?.first?.ticker + '/' + dataPool?.tokenselected?.second?.ticker}</span>
            <span className={`text-[14px] xl:text-[15px] lg:text-[15px] sm:text-[14px] font-[400] text-textBlack py-[5px] px-[10px] rounded-[7px] bg-bgWhiteColor shadow-content`}>0.3%</span>
            <div className="cursor-pointer mt-[4px] ml-[-8px]">
              <Image src={'/images/token/change-pool.svg'} alt="change-pool" width={45} height={45} />
            </div>
          </div>
          <div className={stylesDetails["token-chart-container"]}>
            <div className={stylesDetails["token-chart-price"]}>
              <span className={stylesDetails["token-chart-price-text"]}>
                $6.02M
              </span>
              <span className={`text-[16px] xl:text-[20px] lg:text-[20px] sm:text-[16px] font-[500] text-textBlack`}>
                Past day
              </span>
            </div>
            <div className="relative w-full h-[400px]" style={{ zIndex: 100 }}>
              {/* <ChartToken type="priceToken" onHover={(dataHover) => {
                setDataHover(dataHover)
              }} /> */}
            </div>
          </div>
          <FilterSort />
          <div className="flex xl:hidden lg:hidden sm:flex flex-col gap-[12px] items-start">
            <span className="text-[20px] xl:text-[24px] lg:text-[24px] sm:text-[20px] font-[400] text-textBlack">Stats</span>
            <span className="text-[14px] font-[400] text-textBlack opacity-60">Pool balances</span>
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center gap-[4px]">
                <span className="text-[14px] xl:text-[18.813px] lg:text-[18.813px] sm:text-[14px] font-[400] text-textBlack pr-[4px]">161.40</span>
                <Image src={dataPool?.tokenselected?.first?.logo} width={15} height={15} alt={dataPool?.tokenselected?.first?.ticker} />
                <span className="text-[14px] xl:text-[18.813px] lg:text-[18.813px] sm:text-[14px] font-[400] text-textBlack">{dataPool?.tokenselected?.first?.ticker}</span>
              </div>
              <div className="flex items-center gap-[4px]">
                <span className="text-[14px] xl:text-[18.813px] lg:text-[18.813px] sm:text-[14px] font-[400] text-textBlack pr-[4px]">161.40</span>
                <Image src={dataPool?.tokenselected?.second?.logo} width={15} height={15} alt={dataPool?.tokenselected?.second?.ticker} />
                <span className="text-[14px] xl:text-[18.813px] lg:text-[18.813px] sm:text-[14px] font-[400] text-textBlack">{dataPool?.tokenselected?.second?.ticker}</span>
              </div>
            </div>
            <div className="flex items-center gap-[2px] xl:gap-[8px] lg:gap-[8px] sm:gap-[2px] w-full">
              <div className="h-[18px] w-[35%] rounded-tl-full rounded-bl-full bg-borderOrColor" />
              <div className="h-[18px] flex-1 rounded-tr-full rounded-br-full bg-[#6A16FF]" />
            </div>
            <div className="flex items-center w-full justify-between">
              <div className="flex flex-col items-start w-[50%]">
                <span className="text-[14px] font-[400] text-textBlack opacity-60">TVL</span>
                <div className="flex items-center gap-[10px]">
                  <span className="text-[24px] xl:text-[54px] lg:text-[45px] sm:text-[24px] font-[400] text-textBlack">$190.5M</span>
                  <div className="flex items-center gap-[4px]">
                    <Image src='/images/token/change-down.svg' alt="" width={12} height={18} />
                    <span className="text-[14px] xl:text-[20px] lg:text-[20px] sm:text-[14px] font-[500] text-[#F83B28]">0.01%</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start w-[45%]">
                <span className="text-[14px] font-[400] text-textBlack opacity-60">24h Fees</span>
                <div className="flex items-center gap-[10px]">
                  <span className="text-[24px] xl:text-[54px] lg:text-[45px] sm:text-[24px] font-[400] text-textBlack">$3.4K</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[14px] font-[400] text-textBlack opacity-60">24h Volume</span>
              <div className="flex items-center gap-[10px]">
                <span className="text-[24px] xl:text-[54px] lg:text-[45px] sm:text-[24px] font-[400] text-textBlack">$1.5M</span>
                <div className="flex items-center gap-[4px]">
                  <Image src='/images/token/change-up.svg' alt="" width={12} height={18} />
                  <span className="text-[14px] xl:text-[20px] lg:text-[20px] sm:text-[14px] font-[500] text-[#45B272]">0.01%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[20px] my-[25px]">
            <span
              className={`${stylesTokens["menu-token-item"]} ${stylesTokens["menu-token-item-active"]} flex items-center gap-[4px]`}
            >
              <div className={`h-[8px] w-[8px] rounded-full transition-all duration-300 ease-linear bg-borderOrColor`} />
              Transactions
            </span>
          </div>
          <TransactionPanel token={token} />
        </div>
        <div className="w-full max-w-[734px] xl:max-w-[426px] lg:max-w-[426px] sm:max-w-[734px] mt-[-7px]">
          <div className="hidden xl:flex lg:flex sm:hidden items-center justify-between">
            <Link href="/swap" className="flex items-center gap-[15px] w-[155px] h-[46px] px-[30px] py-[9px] rounded-[12px] shadow-content cursor-pointer" style={{ background: 'rgba(255, 96, 59, 0.25)' }}>
              <span className="text-[24px] font-[400] text-borderOrColor">Swap</span>
              <Image src={'/images/token/icon-pool-details.svg'} alt="icon-pool-details" width={24} height={24} />
            </Link>
            <div className="flex items-center gap-[15px] w-max h-[46px] px-[40px] py-[9px] rounded-[12px] shadow-content cursor-pointer" style={{ background: 'rgba(255, 96, 59, 0.25)' }}>
              <span className="text-[24px] font-[400] text-borderOrColor">Add liquidity</span>
              <Image src={'/images/token/icon-pool-details.svg'} alt="icon-pool-details" width={24} height={24} />
            </div>
          </div>
          <div className="mt-[40px] rounded-[7px] bg-bgWhiteColor shadow-popup pt-[26px] pr-[27px] pb-[23px] pl-[28px] hidden xl:flex lg:flex sm:hidden flex-col gap-[12px] xl:gap-[18px] lg:gap-[18px] sm:gap-[12px] ">
            <span className="text-[20px] xl:text-[24px] lg:text-[24px] sm:text-[20px] font-[400] text-textBlack">Stats</span>
            <span className="text-[14px] font-[400] text-textBlack opacity-60">Pool balances</span>
            <div className="flex w-full flex-col items-start gap-[8px]">
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center gap-[4px]">
                  <span className="text-[14px] xl:text-[18.813px] lg:text-[18.813px] sm:text-[14px] font-[400] text-textBlack pr-[4px]">161.40</span>
                  <Image src={dataPool?.tokenselected?.first?.logo} width={15} height={15} alt={dataPool?.tokenselected?.first?.ticker} />
                  <span className="text-[14px] xl:text-[18.813px] lg:text-[18.813px] sm:text-[14px] font-[400] text-textBlack">{dataPool?.tokenselected?.first?.ticker}</span>
                </div>
                <div className="flex items-center gap-[4px]">
                  <span className="text-[14px] xl:text-[18.813px] lg:text-[18.813px] sm:text-[14px] font-[400] text-textBlack pr-[4px]">161.40</span>
                  <Image src={dataPool?.tokenselected?.second?.logo} width={15} height={15} alt={dataPool?.tokenselected?.second?.ticker} />
                  <span className="text-[14px] xl:text-[18.813px] lg:text-[18.813px] sm:text-[14px] font-[400] text-textBlack">{dataPool?.tokenselected?.second?.ticker}</span>
                </div>
              </div>
              <div className="flex items-center gap-[2px] xl:gap-[8px] lg:gap-[8px] sm:gap-[2px] w-full">
                <div className="h-[18px] w-[35%] rounded-tl-full rounded-bl-full bg-borderOrColor" />
                <div className="h-[18px] flex-1 rounded-tr-full rounded-br-full bg-[#6A16FF]" />
              </div>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[14px] font-[400] text-textBlack opacity-60">TVL</span>
              <div className="flex items-center gap-[10px]">
                <span className="text-[24px] xl:text-[54px] lg:text-[45px] sm:text-[24px] font-[400] text-textBlack">$190.5M</span>
                <div className="flex items-center gap-[4px]">
                  <Image src='/images/token/change-down.svg' alt="" width={12} height={18} />
                  <span className="text-[14px] xl:text-[20px] lg:text-[20px] sm:text-[14px] font-[500] text-[#F83B28]">0.01%</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[14px] font-[400] text-textBlack opacity-60">24h Volume</span>
              <div className="flex items-center gap-[10px]">
                <span className="text-[24px] xl:text-[54px] lg:text-[45px] sm:text-[24px] font-[400] text-textBlack">$1.5M</span>
                <div className="flex items-center gap-[4px]">
                  <Image src='/images/token/change-up.svg' alt="" width={12} height={18} />
                  <span className="text-[14px] xl:text-[20px] lg:text-[20px] sm:text-[14px] font-[500] text-[#45B272]">0.01%</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[14px] font-[400] text-textBlack opacity-60">24h Fees</span>
              <div className="flex items-center gap-[10px]">
                <span className="text-[24px] xl:text-[54px] lg:text-[45px] sm:text-[24px] font-[400] text-textBlack">$3.4K</span>
              </div>
            </div>
          </div>
          <div className="mt-0 xl:mt-[24px] lg:mt-[24px] sm:mt-0 flex flex-col gap-[7px]">
            <span className="text-[20px] font-[400] text-textBlack">Links</span>
            <div className="flex flex-col gap-[20px]">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <div className={stylesDetails["token-info-logo"]}>
                    <div className="relative h-[30px] w-[30px] overflow-hidden">
                      <Image
                        className="absolute left-1/2 border border-textBlack rounded-full"
                        src={dataPool?.tokenselected?.first?.logo}
                        alt={dataPool?.tokenselected?.first?.name}
                        width={30}
                        height={30}
                      />
                    </div>
                    <div className="relative h-[30px] w-[30px] overflow-hidden">
                      <Image
                        className="absolute right-1/2  border border-textBlack rounded-full"
                        src={dataPool?.tokenselected?.second?.logo}
                        alt={dataPool?.tokenselected?.second?.name}
                        width={30}
                        height={30}
                      />
                    </div>
                  </div>
                  <span className="text-[18px] xl:text-[24px] lg:text-[24px] sm:text-[18px] font-[400] text-textBlack">{dataPool?.tokenselected?.first?.ticker + '/' + dataPool?.tokenselected?.second?.ticker}</span>
                </div>
                <div className="flex items-center gap-[8px] py-[6px] px-[18px] shadow-content rounded-[9px] bg-bgWhiteColor hover:bg-[#E8E8E8] transition-all duration-300 ease-linear cursor-pointer"
                  onClick={() => {
                    handleClickCopy('B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog')
                  }}
                >
                  <Image
                    src={'/icon/icon-copy.svg'}
                    width={20}
                    height={20}
                    alt=''
                  />
                  <span className="text-[16px] xl:text-[18px] lg:text-[18px] sm:text-[16px] font-[400] text-textBlack">B62qk...PBYog</span>
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <Image
                    src={dataPool?.tokenselected?.first?.logo}
                    alt={dataPool?.tokenselected?.first?.name}
                    width={30}
                    height={30}
                  />
                  <span className="text-[18px] xl:text-[24px] lg:text-[24px] sm:text-[18px] font-[400] text-textBlack">{dataPool?.tokenselected?.first?.ticker}</span>
                  <div className="ml-[25px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="17" viewBox="0 0 14 17" fill="none">
                      <path d="M2 1.85791L12 8.70002L2 15.279" stroke="black" stroke-width="2.10526" stroke-linecap="round" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-[8px] py-[6px] px-[18px] shadow-content rounded-[9px] bg-bgWhiteColor hover:bg-[#E8E8E8] transition-all duration-300 ease-linear cursor-pointer"
                  onClick={() => {
                    handleClickCopy('B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog')
                  }}
                >
                  <Image
                    src={'/icon/icon-copy.svg'}
                    width={20}
                    height={20}
                    alt=''
                  />
                  <span className="text-[16px] xl:text-[18px] lg:text-[18px] sm:text-[16px] font-[400] text-textBlack">B62qk...PBYog</span>
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <Image
                    src={dataPool?.tokenselected?.second?.logo}
                    alt={dataPool?.tokenselected?.second?.name}
                    width={30}
                    height={30}
                  />
                  <span className="text-[18px] xl:text-[24px] lg:text-[24px] sm:text-[18px] font-[400] text-textBlack">{dataPool?.tokenselected?.second?.ticker}</span>
                  <div className="ml-[25px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="17" viewBox="0 0 14 17" fill="none">
                      <path d="M2 1.85791L12 8.70002L2 15.279" stroke="black" stroke-width="2.10526" stroke-linecap="round" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-[8px] py-[6px] px-[18px] shadow-content rounded-[9px] bg-bgWhiteColor hover:bg-[#E8E8E8] transition-all duration-300 ease-linear cursor-pointer"
                  onClick={() => {
                    handleClickCopy('B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog')
                  }}
                >
                  <Image
                    src={'/icon/icon-copy.svg'}
                    width={20}
                    height={20}
                    alt=''
                  />
                  <span className="text-[16px] xl:text-[18px] lg:text-[18px] sm:text-[16px] font-[400] text-textBlack">B62qk...PBYog</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
