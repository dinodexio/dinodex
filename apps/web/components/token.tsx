"use client";
import { useRouter, usePathname } from "next/navigation";
// import { Header } from "./header";
import { useEffect, useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ScrollToTopButton } from "./scrollToTopButton/scrollToTopButton";
import styles from "./css/tokens.module.css";
import { TokenPanel } from "./token/token-panel";
import { Balances } from "./wallet/wallet";
import { PoolPanel } from "./token/pool-panel";
import { TransactionPanel } from "./token/transaction-panel";
import { ChartToken } from "./token/chart-token";
import { FilterSort } from "./token/filter-sort";
import { useDebounce } from "@/hook/useDebounce";
import moment from "moment";
import dynamic from "next/dynamic";
const Header = dynamic(() => import('./header'), {
  ssr: false,
});

import { extractTabFromPathname } from "@/lib/utils";

export interface HomeProps {
  tokensTable?: JSX.Element;
  chart?: JSX.Element;
  poolsTable?: JSX.Element;
  transactionTable?: JSX.Element;
  filterSort?: JSX.Element;
  walletElement?: JSX.Element;
  balances?: Balances;
  valueSearch?: string;
  param:string
}

// Memoize SWITCH_MENU to avoid re-creation on every render
const SWITCH_MENU = [
  {
    value: "tokens",
    label: "Tokens",
  },
  {
    value: "pools",
    label: "Pools",
  },
  {
    value: "transactions",
    label: "Transactions",
  },
];

export function Token({param}: HomeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [tab, setTab] = useState("");

  const [valueSearch, setValueSearch] = useState<string>("");

  const [dataHoverDouArea, setDataHoverDouArea] = useState<any>({})

  const [dataHoverDouBar, setDataHoverDouBar] = useState<any>({})

  const debouncedSearch = useDebounce(
    (value: string) => setValueSearch(value),
    300,
  );
  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  // Memoize the tab switch handler to prevent re-creation on every render
  const handleTabClick = useCallback(
    (value: string) => {
      setTab(value);
      // router.push(`/${value}`);
      window.history.replaceState(null, "", `/info/${value}`);
    },
    [router],
  );

  const extractTabFromPathname = (path: any) => {
    const parts = path.split("/");
    // Find a matching value for tokens, pools, or transactions
    return (
      parts.find((part: any) =>
        ["tokens", "pools", "transactions"].includes(part),
      ) || "tokens"
    );
  };

  // Optimize tab switching by using `useEffect` to detect pathname change
  useEffect(() => {
    const tabValue = extractTabFromPathname(pathname);
    tab !== tabValue && setTab(tabValue);
  }, [pathname]);

  return (
    <div className="flex items-center justify-center">
      <Toaster />
      <div className="flex w-full flex-col px-[16px] pb-[8px] pt-8 sm:px-[16px] lg:px-[32px] xl:px-[41px]">
        <Header type="info" />
        <div className="mx-auto mt-[63px] flex w-full max-w-[1146px] flex-col gap-[22px] sm:gap-[22px] lg:gap-[30px] xl:gap-[30px]">
          {/* Conditionally render the chart */}
          <div className="hidden w-full sm:hidden lg:flex xl:flex items-center justify-between">
            <div className="w-[50%] max-w-[548px] h-[387px] relative">
              <div className="flex flex-col items-start mb-[-30px]">
                <span className="text-[20px] font-[400] h-[24px] text-textBlack">Minaswap TVL</span>
                <span className="text-[32px] font-[700] h-[38px] text-borderOrColor">${dataHoverDouArea?.value1 && dataHoverDouArea?.value2 ? Number((dataHoverDouArea?.value1 + dataHoverDouArea?.value2) / 100).toFixed(2) : 1.2}B</span>
                <span className="text-[16px] font-[400] text-textBlack opacity-75 mt-[4px]">{moment(dataHoverDouArea?.date).format('MMMDD, YYYY, h:mm A')}</span>
              </div>
              <div className={`${styles['box-info']}`} id="box-chart-dou-area">
                <div className="flex items-center gap-[4px]">
                  <span>v1</span>
                  <div className="w-[12px] h-[12px] rounded-[2px] bg-[#3FC590]" />
                  <span>{Number(dataHoverDouArea?.value1 / 100).toFixed(2)}B</span>
                </div>
                <div className="flex items-center gap-[4px]">
                  <span>v2</span>
                  <div className="w-[12px] h-[12px] rounded-[2px] bg-[#6A16FF]" />
                  <span>{Number(dataHoverDouArea?.value2 / 100).toFixed(2)}B</span>
                </div>
              </div>
              <ChartToken type="tvl" onHover={(dataHover) => {
                setDataHoverDouArea(dataHover)
              }} />
            </div>
            <div className="w-[50%] max-w-[548px] h-[387px] relative">
              <div className="flex flex-col items-start mb-[-30px]">
                <span className="text-[20px] font-[400] h-[24px] text-textBlack">Minaswap VOL</span>
                <span className="text-[32px] font-[700] h-[38px] text-borderOrColor">${dataHoverDouBar?.value1 && dataHoverDouBar?.value2 ? Number((dataHoverDouBar?.value1 + dataHoverDouBar?.value2) * 10).toFixed(2) : 2.56}B</span>
                <span className="text-[16px] font-[400] text-textBlack opacity-75 mt-[4px]">{moment(dataHoverDouBar?.date).format('MMMDD, YYYY, h:mm A')}</span>
              </div>
              <div className={`${styles['box-info-vol']}`} id="box-chart-dou-bar">
                <div className="flex items-center gap-[4px]">
                  <span>v1</span>
                  <div className="w-[12px] h-[12px] rounded-[2px] bg-[#3FC590]" />
                  <span>{Number(dataHoverDouBar?.value1 * 10).toFixed(2)}B</span>
                </div>
                <div className="flex items-center gap-[4px]">
                  <span>v2</span>
                  <div className="w-[12px] h-[12px] rounded-[2px] bg-[#6A16FF]" />
                  <span>{Number(dataHoverDouBar?.value2 * 10).toFixed(2)}B</span>
                </div>
              </div>
              <ChartToken type="vol" onHover={(dataHover) => {
                setDataHoverDouBar(dataHover)
                console.log(dataHover)
              }} />
            </div>
          </div>
          {/* Displaying statistics for smaller screens */}
          <div className="flex w-full items-center justify-between sm:flex lg:hidden xl:hidden">
            <div className={styles["stats-card"]}>
              <span className={styles["stats-title"]}>Minaswap TVL</span>
              <span className={styles["stats-value"]}>${dataHoverDouArea?.value1 && dataHoverDouArea?.value2 ? Number((dataHoverDouArea?.value1 + dataHoverDouArea?.value2) / 100).toFixed(2) : 1.2}B</span>
            </div>
            <div className={styles["stats-card"]}>
              <span className={styles["stats-title"]}>Minaswap VOL</span>
              <span className={styles["stats-value"]}>${dataHoverDouBar?.value1 && dataHoverDouBar?.value2 ? Number((dataHoverDouBar?.value1 + dataHoverDouBar?.value2) * 10).toFixed(2) : 2.56}B</span>
              <span className={styles["stats-subtext"]}>{moment(dataHoverDouBar?.date).format('MMMDD, YYYY, h:mm A')}</span>
            </div>
          </div>
          {/* Tab navigation and filter */}
          <div className="flex w-full flex-col items-start justify-between gap-[12px] sm:flex-col lg:flex-row xl:flex-row">
            <div className="flex items-center gap-[20px]">
              {SWITCH_MENU.map((item, index) => (
                <span
                  key={index}
                  onClick={() => handleTabClick(item.value)}
                  className={`${styles["menu-token-item"]} ${tab === item.value ? styles["menu-token-item-active"] : ""} flex items-center gap-[4px]`}
                >
                  <div className={`h-[8px] w-[8px] rounded-full transition-all duration-300 ease-linear ${tab === item.value ? "bg-borderOrColor" : "bg-transparent"}`} />
                  {item.label}
                </span>
              ))}
            </div>
            <div>
              <FilterSort handleSearch={handleSearch} type={SWITCH_MENU?.filter((item) => item.value === tab)[0]?.label || ''} />
            </div>
          </div>
          {/* Conditionally render only the active table */}
          <div className="w-full">
            {tab === "tokens" && <TokenPanel />}
            {tab === "pools" && <PoolPanel valueSearch={valueSearch || ""} />}
            {tab === "transactions" && (
              <TransactionPanel
                valueSearch={valueSearch || ""}
                transactions={[]}
                loading={false}
              />
            )}
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}
