"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ScrollToTopButton } from "./scrollToTopButton/scrollToTopButton";
import styles from "./css/tokens.module.css";
import { TokenPanel } from "./token/token-panel";
import { Balances } from "./wallet/wallet";
import { PoolPanel } from "./token/pool-panel";
import { TransactionPanel } from "./token/transaction-panel";
import { FilterSort } from "./token/filter-sort";
import { useDebounce } from "@/hook/useDebounce";
import moment from "moment";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("./headerv2"), {
  ssr: false,
});

import { formatNumber } from "@/lib/utils";
import { useAggregatorStore } from "@/lib/stores/aggregator";
import { SkeletonLoading } from "./detail/SkeletonLoading";

export interface HomeProps {
  tokensTable?: JSX.Element;
  chart?: JSX.Element;
  poolsTable?: JSX.Element;
  transactionTable?: JSX.Element;
  filterSort?: JSX.Element;
  walletElement?: JSX.Element;
  balances?: Balances;
  valueSearch?: string;
  param: string;
}

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

export function Token({ param }: HomeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [tab, setTab] = useState("");
  const { totalTVL, totalVOL, loading, getTVL } = useAggregatorStore();

  const [valueSearch, setValueSearch] = useState<string>("");

  const debouncedSearch = useDebounce(
    (value: string) => setValueSearch(value),
    300,
  );
  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const handleTabClick = useCallback(
    (value: string) => {
      router.push(`/info/${value}`);
    },
    [router],
  );

  const extractTabFromPathname = (path: any) => {
    const parts = path.split("/");
    return (
      parts.find((part: any) =>
        ["tokens", "pools", "transactions"].includes(part),
      ) || "tokens"
    );
  };

  useEffect(() => {
    const tabValue = extractTabFromPathname(pathname);
    tab !== tabValue && setTab(tabValue);
  }, [pathname]);

  useEffect(() => {
    getTVL();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <Toaster />
      <Header type="info" />
      <div className="flex w-full flex-col px-[16px] pb-[8px] pt-8 sm:px-[16px] lg:px-[32px] xl:px-[41px]">
        <div className="mx-auto mt-[0] flex w-full max-w-[1146px] flex-col gap-[22px] sm:mt-0 sm:gap-[22px] lg:mt-[20px] lg:gap-[30px] xl:mt-[63px] xl:gap-[30px]">
          <div className="hidden w-full items-center justify-between sm:hidden lg:flex xl:flex">
            <div className="relative h-[387px] w-[50%] max-w-[548px]">
              <div className="mb-[-30px] flex flex-col items-start">
                <span className="h-[24px] text-[20px] font-[400] text-textBlack">
                  DinoDex TVL
                </span>
                {loading ? (
                  <>
                    <SkeletonLoading
                      loading={true}
                      className="mb-[4px] mt-[8px] h-[30px] w-[200px]"
                    />
                    <SkeletonLoading
                      loading={true}
                      className="h-[30px] w-[200px]"
                    />
                  </>
                ) : (
                  <>
                    <span className="h-[38px] text-[32px] font-[700] text-borderOrColor">
                      {formatNumber(totalTVL)}
                    </span>
                    <span className="mt-[4px] text-[16px] font-[400] text-textBlack opacity-75">
                      {moment().format("MMMDD, YYYY, h:mm A")}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="relative h-[387px] w-[50%] max-w-[548px]">
              <div className="mb-[-30px] flex flex-col items-start">
                <span className="h-[24px] text-[20px] font-[400] text-textBlack">
                  DinoDex VOL
                </span>
                {loading ? (
                  <>
                    <SkeletonLoading
                      loading={true}
                      className="mb-[4px] mt-[8px] h-[30px] w-[200px]"
                    />
                    <SkeletonLoading
                      loading={true}
                      className="h-[30px] w-[200px]"
                    />
                  </>
                ) : (
                  <>
                    <span className="h-[38px] text-[32px] font-[700] text-borderOrColor">
                      TBA
                    </span>
                    <span className="mt-[4px] text-[16px] font-[400] text-textBlack opacity-75">
                      {moment().format("MMMDD, YYYY, h:mm A")}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex w-full items-center justify-between sm:flex lg:hidden xl:hidden">
            <div className={styles["stats-card"]}>
              <span className={styles["stats-title"]}>DinoDex TVL</span>
              <span className={styles["stats-value"]}>
                {formatNumber(totalTVL)}
              </span>
            </div>
            <div className={styles["stats-card"]}>
              <span className={styles["stats-title"]}>DinoDex VOL</span>
              <span className={styles["stats-value"]}>
                TBA
              </span>
              <span className={styles["stats-subtext"]}>
                {moment().format("MMMDD, YYYY, h:mm A")}
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col items-start justify-between gap-[12px] sm:flex-col lg:flex-row xl:flex-row">
            <div className="flex items-center gap-[20px]">
              {SWITCH_MENU.map((item, index) => (
                <span
                  key={index}
                  onClick={() => handleTabClick(item.value)}
                  className={`${styles["menu-token-item"]} ${tab === item.value ? styles["menu-token-item-active"] : ""} flex items-center gap-[4px]`}
                >
                  <div
                    className={`h-[8px] w-[8px] rounded-full transition-all duration-300 ease-linear ${tab === item.value ? "bg-borderOrColor" : "bg-transparent"}`}
                  />
                  {item.label}
                </span>
              ))}
            </div>
            <div>
              <FilterSort
                handleSearch={handleSearch}
                type={
                  SWITCH_MENU?.filter((item) => item.value === tab)[0]?.label ||
                  ""
                }
              />
            </div>
          </div>

          <div className="w-full">
            {tab === "tokens" && <TokenPanel valueSearch={valueSearch || ""} />}
            {tab === "pools" && <PoolPanel valueSearch={valueSearch || ""} />}
            {tab === "transactions" && (
              <TransactionPanel valueSearch={valueSearch || ""} />
            )}
          </div>
        </div>
      </div>
      {window?.scrollY > 100 && <ScrollToTopButton />}
    </div>
  );
}
