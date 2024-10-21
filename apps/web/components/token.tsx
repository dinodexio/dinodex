"use client";
import { useRouter, usePathname } from "next/navigation";
import { Header } from "./header";
import { useEffect, useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ScrollToTopButton } from "./scrollToTopButton/scrollToTopButton";
import styles from './css/tokens.module.css'

export interface HomeProps {
  tokensTable: JSX.Element;
  chart: JSX.Element;
  poolsTable: JSX.Element;
  transactionTable: JSX.Element;
  filterSort: JSX.Element;
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

export function Token({
  tokensTable,
  chart,
  poolsTable,
  transactionTable,
  filterSort,
}: HomeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [tab, setTab] = useState("");

  // Memoize the tab switch handler to prevent re-creation on every render
  const handleTabClick = useCallback((value: string) => {
    // setTab(value);
    router.push(`/${value}`);
  }, [router]);

  // Optimize tab switching by using `useEffect` to detect pathname change
  useEffect(() => {
    if (pathname.includes("/tokens")) {
      setTab("tokens");
    } else if (pathname.includes("/pools")) {
      setTab("pools");
    } else if (pathname.includes("/transactions")) {
      setTab("transactions");
    }
  }, [pathname]);

  return (
    <div className="flex items-center justify-center">
      <Toaster />
      <div className="flex flex-col w-full px-[16px] pt-8 xl:px-[41px] lg:px-[32px] sm:px-[16px] pb-[8px]">
        <Header />
        <div className="mt-[63px] max-w-[1146px] w-full mx-auto flex flex-col gap-[22px] xl:gap-[30px] lg:gap-[30px] sm:gap-[22px]">
          {/* Conditionally render the chart */}
          <div className="w-full hidden xl:block lg:block sm:hidden">
            {chart}
          </div>
          {/* Displaying statistics for smaller screens */}
          <div className="flex items-center justify-between w-full xl:hidden lg:hidden sm:flex">
            <div className={styles["stats-card"]}>
              <span className={styles["stats-title"]}>DinoDEX TVL</span>
              <span className={styles["stats-value"]}>$3.22B</span>
            </div>
            <div className={styles["stats-card"]}>
              <span className={styles["stats-title"]}>DinoDEX TVL</span>
              <span className={styles["stats-value"]}>$3.22B</span>
              <span className={styles["stats-subtext"]}>Past month</span>
            </div>
          </div>
          {/* Tab navigation and filter */}
          <div className="w-full flex flex-col items-start gap-[12px] xl:flex-row lg:flex-row sm:flex-col justify-between">
            <div className="flex items-center gap-[20px] xl:gap-[30px] lg:gap-[30px] sm:gap-[20px]">
              {SWITCH_MENU.map((item, index) => (
                <span
                  key={index}
                  onClick={() => handleTabClick(item.value)}
                  className={`${styles["menu-token-item"]} ${tab === item.value ? styles["menu-token-item-active"] : ""}`}
                >
                  {item.label}
                </span>
              ))}
            </div>
            <div>{filterSort}</div>
          </div>
          {/* Conditionally render only the active table */}
          <div className="w-full">
            {tab === "tokens" && <>{tokensTable}</>}
            {tab === "pools" && <>{poolsTable}</>}
            {tab === "transactions" && <>{transactionTable}</>}
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}
