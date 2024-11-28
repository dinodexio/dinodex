import Image from "next/image";
import { FilterSort } from "./filter-sort";
import "../style.css";
import { useEffect, useMemo, useState } from "react";
import { TransactionPanel } from "./transaction-panel";
import { PoolPanel } from "./pool-panel";
// import { Swap } from "../swap/swap";
import stylesTokens from "../css/tokens.module.css";
import stylesDetails from "../css/detailToken.module.css";
import { CopyContainer } from "./copy-container";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  // DrawerDescription,
  // DrawerFooter,
  // DrawerHeader,
  DrawerOverlay,
  // DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
// import useCopy from "@/hook/useCopy";
import {
  useAggregatorStore,
  useTokenInfo,
  useTokenTxs,
} from "@/lib/stores/aggregator";
// import { Loader } from "../ui/Loader";
import { Token, tokens } from "@/tokens";
import { formatNumberWithPrice, truncateAddress } from "@/lib/utils";
import { InfoTokenLayoutProps, DataTokenTransactionPanel } from "@/types";
import { Toaster } from "../ui/toaster";
const Header = dynamic(() => import("@/components/header"), {
  ssr: false,
});
import { Footer } from "../footer";
import { ScrollToTopButton } from "../scrollToTopButton/scrollToTopButton";
import dynamic from "next/dynamic";
import Swap from "@/containers/async-swap-page";
import { SkeletonLoading } from "./SkeletonLoading";
import Link from "next/link";

interface TokenPage extends Token {
  id: string;
}

let SWITCH_MENU = [
  {
    value: "transaction",
    label: "Transaction",
  },
  {
    value: "pools",
    label: "Pools",
  },
];

export function InfoTokenLayout({ params }: InfoTokenLayoutProps) {
  const token: TokenPage = useMemo(() => {
    let result = {
      id: "",
      name: "",
      ticker: "",
      logo: "",
      address: "",
      website: "",
      explorer: "",
    };
    for (const tokenId in tokens) {
      if (tokens[tokenId]?.ticker === params.key[0]) {
        result = {
          ...result,
          id: tokenId,
          ...tokens[tokenId],
        };
        break;
      }
    }
    return result;
  }, [params.key]);
  const [tab, setTab] = useState("transaction");
  const [dataHover, setDataHover] = useState<any>({});
  const {
    data: tokenInfo,
    loading,
    error,
    getTokenInfo,
  } = useTokenInfo(token?.id || "");
  const {
    data: tokenTxs,
    loading: loadingTxs,
    error: erroTxs,
    getTokenTxs,
  } = useTokenTxs(token?.id || "");

  const dataInfoDisplay = useMemo(() => {
    const { tvl, price, volume_1d, fdv } = tokenInfo;
    return {
      id: token.id,
      name: token.name,
      ticker: token.ticker,
      logo: token.logo,
      tvl: tvl?.usd,
      volume_1d: volume_1d?.usd,
      fdv: fdv?.usd,
      price: price?.usd,
    };
  }, [JSON.stringify(tokenInfo)]);

  const dataTxsDisplay: DataTokenTransactionPanel[] = useMemo(() => {
    return tokenTxs.map((tx) => {
      const isTokenCurrentIsA = token.id === tx.tokenAId;
      const tokenIdCounterpart = isTokenCurrentIsA ? tx.tokenBId : tx.tokenAId;
      const tokenTxInfo = {
        tokenAmount: isTokenCurrentIsA ? tx.tokenAAmount : tx.tokenBAmount,
        tokenCounterpartAmount: isTokenCurrentIsA
          ? tx.tokenBAmount
          : tx.tokenAAmount,
        logoCounterpart: tokens[tokenIdCounterpart]?.logo,
        nameCounterpart: tokens[tokenIdCounterpart]?.name,
        tickerCounterpart: tokens[tokenIdCounterpart]?.ticker,
      };
      function xor(a: boolean, b: boolean) {
        return (a || b) && !(a && b);
      }
      return {
        action: !xor(isTokenCurrentIsA, Boolean(tx.directionAB))
          ? "sell"
          : "buy", //TODO constains text buy sell
        timestamp: tx.timestamp,
        price: tx?.price?.usd,
        creator: tx?.creator,
        ...tokenTxInfo,
      };
    });
  }, [JSON.stringify(tokenTxs)]);

  useEffect(() => {
    getTokenInfo();
    getTokenTxs();
  }, []);
  return (
    <>
      <div className="flex w-full flex-col px-[16px] pb-[8px] pt-8 sm:px-[16px] lg:px-[32px] xl:px-[41px]">
        <Toaster />
        <div className="flex basis-11/12 flex-col 2xl:basis-10/12">
          <Header />
          <div className="mx-auto mt-[40px] flex w-full flex-col items-center gap-[20px] lg:items-start lg:gap-[32px] xl:mt-[63px] xl:flex-row xl:items-start xl:justify-center xl:gap-[46px]">
            <div className="w-full max-w-[734px]">
              <div className={stylesDetails["token-info-container"]}>
                {loading ? (
                  <>
                    <SkeletonLoading loading={true} className="h-[34px] w-[34px] rounded-full" />
                    <SkeletonLoading loading={true} className="h-[34px] w-full max-w-[300px]" />
                  </>
                ) : (
                  <>
                    <div className={stylesTokens["token-detail-info-logo"]}>
                      <Image
                        src={dataInfoDisplay?.logo || ""}
                        alt={dataInfoDisplay?.name || ""}
                        width={24}
                        height={24}
                      />
                    </div>
                    <span className={stylesDetails["token-info-name-text"]}>
                      {dataInfoDisplay?.name}
                    </span>
                    <span className={stylesDetails["token-info-symbol-text"]}>
                      {dataInfoDisplay?.ticker}
                    </span>
                  </>
                )}
              </div>
              <div className={stylesDetails["token-chart-container"]}>
                <div className={stylesDetails["token-chart-price"]}>
                  {loading ? (
                    <>
                      <SkeletonLoading loading={true} className="h-[40px] w-[200px] mb-[8px] z-[1000]" />
                      <SkeletonLoading loading={true} className="h-[34px] w-[200px] z-[1000]" />
                    </>
                  ) : (
                    <>
                      <span className={stylesDetails["token-chart-price-text"]}>
                        $
                        {dataHover.value
                          ? dataHover.value.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                          : formatNumberWithPrice(dataInfoDisplay.price)}
                      </span>
                      <span
                        className={`${stylesDetails["token-chart-change-text"]} ${stylesDetails["text-red"]}`}
                      >
                        <img src="/images/token/change-down.svg" alt="token-1" />
                        -0.01%
                      </span>
                    </>
                  )}
                </div>
                <div className={stylesDetails["token-chart-img"]} />
                <div className="relative h-[400px] w-full">
                  {/* <ChartToken type="priceToken" onHover={(dataHover) => {
                      setDataHover(dataHover)
                    }}/> */}
                </div>
              </div>
              <FilterSort />
              {loading ? (
                <div className={stylesDetails["stats-token-container"]}>
                  <span className={stylesDetails["stats-token-title"]}>
                    Stats
                  </span>
                  <div className={stylesDetails["stats-token-info"]}>
                    <div className={stylesDetails["stats-token-info-item"]}>
                      <SkeletonLoading loading={true} className="h-[24px] w-[80px] " />
                      <SkeletonLoading loading={true} className="h-[34px] w-[120px]" />
                    </div>
                    <div className={stylesDetails["stats-token-info-item"]}>
                      <SkeletonLoading loading={true} className="h-[24px] w-[80px] " />
                      <SkeletonLoading loading={true} className="h-[34px] w-[120px]" />
                    </div>
                    <div className={stylesDetails["stats-token-info-item"]}>
                      <SkeletonLoading loading={true} className="h-[24px] w-[80px] " />
                      <SkeletonLoading loading={true} className="h-[34px] w-[120px]" />
                    </div>
                    <div className={stylesDetails["stats-token-info-item"]}>
                      <SkeletonLoading loading={true} className="h-[24px] w-[80px] " />
                      <SkeletonLoading loading={true} className="h-[34px] w-[120px]" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className={stylesDetails["stats-token-container"]}>
                  <span className={stylesDetails["stats-token-title"]}>
                    Stats
                  </span>
                  <div className={stylesDetails["stats-token-info"]}>
                    <div className={stylesDetails["stats-token-info-item"]}>
                      <span
                        className={stylesDetails["stats-token-info-item-title"]}
                      >
                        TVL
                      </span>
                      <span
                        className={stylesDetails["stats-token-info-item-value"]}
                      >
                        {formatNumberWithPrice(dataInfoDisplay.tvl, true)}
                      </span>
                    </div>
                    <div className={stylesDetails["stats-token-info-item"]}>
                      <span
                        className={stylesDetails["stats-token-info-item-title"]}
                      >
                        Market Cap
                      </span>
                      <span
                        className={stylesDetails["stats-token-info-item-value"]}
                      >
                        --
                      </span>
                    </div>
                    <div className={stylesDetails["stats-token-info-item"]}>
                      <span
                        className={stylesDetails["stats-token-info-item-title"]}
                      >
                        FDV
                      </span>
                      <span
                        className={stylesDetails["stats-token-info-item-value"]}
                      >
                        {formatNumberWithPrice(dataInfoDisplay.fdv, true)}
                      </span>
                    </div>
                    <div className={stylesDetails["stats-token-info-item"]}>
                      <span
                        className={stylesDetails["stats-token-info-item-title"]}
                      >
                        1 Day volume
                      </span>
                      <span
                        className={stylesDetails["stats-token-info-item-value"]}
                      >
                        {formatNumberWithPrice(dataInfoDisplay.volume_1d, true)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div className="my-[25px] flex items-center gap-[20px]">
                {SWITCH_MENU?.map((item, index) => {
                  return (
                    <span
                      key={index}
                      onClick={() => {
                        setTab(item.value);
                      }}
                      className={`${stylesTokens["menu-token-item"]} ${tab === item.value ? stylesTokens["menu-token-item-active"] : ""} flex items-center gap-[4px]`}
                    >
                      <div
                        className={`h-[8px] w-[8px] rounded-full transition-all duration-300 ease-linear ${tab === item.value ? "bg-borderOrColor" : "bg-transparent"}`}
                      />
                      {item.label}
                    </span>
                  );
                })}
              </div>
              {tab === "transaction" && (
                <TransactionPanel
                  data={dataTxsDisplay}
                  titleToken={dataInfoDisplay.ticker}
                  loading={loading}
                />
              )}
              {tab === "pools" && <PoolPanel loading={loading} />}
            </div>
            <div className="mt-[-7px] w-full max-w-[734px] sm:max-w-[734px] lg:max-w-[426px] xl:max-w-[426px]">
              <div className="hidden w-full sm:hidden lg:block xl:block">
                {/* <Swap token={token} type="tokenDetail" /> */}
                <Swap isDetail />
              </div>
              <div className={stylesDetails["swap-container-info"]}>
                <span className={stylesDetails["swap-text"]}>Info</span>
                {loading ? (
                  <div className={stylesDetails["swap-info-content"]}>
                    <SkeletonLoading loading={true} className="h-[40px] w-[300px]" />
                    <div className="flex items-center gap-[5px]">
                      <SkeletonLoading loading={true} className="h-[40px] w-[150px]" />
                      <SkeletonLoading loading={true} className="h-[40px] w-[150px]" />
                    </div>
                  </div>
                ) : (
                  <div className={stylesDetails["swap-info-content"]}>
                    {token?.address && <CopyContainer
                      value={token?.address}
                      content={truncateAddress(token?.address)}
                    />}
                    <div className={stylesDetails["swap-info-item"]}>
                      <Image
                        src="/icon/icon-explorer.svg"
                        alt="info"
                        width={24}
                        height={24}
                      />
                      <Link
                        href={token?.explorer}
                        target="_blank"
                        className="swap-info-item-text"
                      >
                        Explorer
                      </Link>
                    </div>
                    <div className={stylesDetails["swap-info-item"]}>
                      <Image
                        src="/icon/web-icon.svg"
                        alt="info"
                        width={24}
                        height={24}
                      />
                      <Link
                        href={token?.website}
                        target="_blank"
                        className="swap-info-item-text"
                      >
                        Website
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="block sm:block lg:hidden xl:hidden">
              <Drawer>
                <DrawerTrigger>
                  <div
                    className="fixed bottom-[60px] left-[50%] flex items-center gap-1 rounded-[12px] border border-borderOrColor bg-bgButtonFixed px-[25px] py-2 text-[20px] text-textBlack"
                    style={{ transform: "translateX(-50%)" }}
                  >
                    Swap
                  </div>
                </DrawerTrigger>
                <DrawerOverlay className="bg-[rgba(0,0,0,.5)]" />
                <DrawerContent
                  className="flex flex-col items-center gap-3 border-[0.826px] border-textBlack bg-bgWhiteColor px-5 pb-[73px] pt-[27px]"
                  style={{ borderRadius: "12px 12px 0 0" }}
                >
                  <div className="relative mb-[-50px] flex w-full items-center justify-center">
                    <span className="text-[20px] font-[600] text-textBlack">
                      Swap
                    </span>
                    <DrawerClose className="absolute bottom-[22px] right-0">
                      <Image
                        width={24}
                        height={24}
                        alt=""
                        src="/images/swap/close-icon-modal.svg"
                      />
                    </DrawerClose>
                  </div>
                  {/* <Swap token={token} type="tokenDetail" /> */}
                  <Swap isDetail />
                </DrawerContent>
              </Drawer>
            </div>
          </div>
          <Footer />
        </div>
      </div >
      <ScrollToTopButton />
    </>
  );
}
