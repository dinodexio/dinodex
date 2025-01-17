import Image from "next/image";
import { FilterSort } from "./filter-sort";
import "../style.css";
import { useEffect, useMemo, useState } from "react";
import { TransactionPanel } from "./transaction-panel";
import { PoolPanel } from "./pool-panel";
import stylesTokens from "../css/tokens.module.css";
import stylesDetails from "../css/detailToken.module.css";
import { CopyContainer } from "./copy-container";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  useHistoryToken,
  useTokenInfo,
  useTokenPools,
  useTokenTxs,
} from "@/lib/stores/aggregator";
import { Token } from "@/tokens";
import {
  formatNumberWithCommas,
  formatNumberWithPrice,
  removePrecision,
  truncateAddress,
} from "@/lib/utils";
import { InfoTokenLayoutProps, DataTokenTransactionPanel } from "@/types";
import { Toaster } from "../ui/toaster";
const Header = dynamic(() => import("@/components/headerv2"), {
  ssr: false,
});
import { Footer } from "../footer";
import { ScrollToTopButton } from "../scrollToTopButton/scrollToTopButton";
import dynamic from "next/dynamic";
import Swap from "@/containers/async-swap-page";
import { SkeletonLoading } from "./SkeletonLoading";
import Link from "next/link";
import { ChartToken } from "../token/chart-token";
import BigNumber from "bignumber.js";
import { precision } from "../ui/balance";
import { useObserveTotalSupply } from "@/lib/stores/balances";
import { EMPTY_DATA } from "@/constants";
import { ImageCommon } from "../common/ImageCommon";
import { useTokenStore } from "@/lib/stores/token";
import BaseTokenTag from "../common/BaseTokenTag";
import moment from "moment";

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
  const { data: tokens } = useTokenStore();
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
  const [filterTimeValue, setFilterTimeValue] = useState<string | null>("1d");
  const [filterTime, setFilterTime] = useState<string | null>(
    new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString(),
  );
  const [dataHover, setDataHover] = useState<any>({});
  const {
    data: tokenInfo,
    loading,
    error,
    getTokenInfo,
  } = useTokenInfo(token?.id || "");
  const { data: dataHistoryToken, getHistoryToken } = useHistoryToken(
    token?.id || "",
    filterTime,
    0,
    1000,
  );
  const {
    data: tokenTxs,
    loading: loadingTxs,
    getTokenTxs,
  } = useTokenTxs(token?.id || "");
  const {
    data: tokenPools,
    loading: loadingPools,
    getTokenPools,
  } = useTokenPools(token?.id || "");
  const lpTotalSupply = useObserveTotalSupply(token?.id);

  const dataInfoDisplay = useMemo(() => {
    const { tvl, price, volume_1d, fdv } = tokenInfo;
    return {
      id: token.id,
      ticker: tokens[token.id || 0]?.ticker,
      name: tokens[token.id || 0]?.name,
      logo: token.id ? tokens[token.id]?.logo : "",
      tvl: tvl?.usd,
      volume_1d: volume_1d?.usd,
      fdv: fdv?.usd,
      price: price,
      prices: tokenInfo.prices,
    };
  }, [JSON.stringify(tokenInfo), tokens]);

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
        timestamp: tx.createAt,
        price: removePrecision(
          BigNumber(tx?.tokenAAmount || 0)
            .times(tx?.tokenAPrice || 0)
            .toString(),
          precision,
        ).toString(),
        creator: tx?.creator,
        ...tokenTxInfo,
      };
    });
  }, [JSON.stringify(tokenTxs)]);

  const TvlToken = useMemo(() => {
    const result = tokenPools.reduce((acc, pool) => {
      let tvlPoolToken =
        pool?.tokenAId === tokenInfo.id
          ? BigNumber(pool?.tokenAAmount || 0)
            .times(tokenInfo.price)
            .div(10 ** precision)
            .toNumber()
          : BigNumber(pool?.tokenBAmount || 0)
            .times(tokenInfo.price)
            .div(10 ** precision)
            .toNumber();
      return acc + tvlPoolToken;
    }, 0);
    return result;
  }, [JSON.stringify(tokenPools)]);
  
  const changePrice = useMemo(() => {
    if (!dataHistoryToken || dataHistoryToken.length === 0) return 0;
    let priceHistory = dataHistoryToken[0]?.price || 0;
    let priceHover = dataHover?.value || priceHistory;
    let differencePrice = BigNumber(BigNumber(dataHover ? priceHover : dataInfoDisplay.price).minus(BigNumber(priceHistory))).div(BigNumber(priceHistory)).times(100).toNumber();
    return differencePrice;
  }, [JSON.stringify(dataHistoryToken), dataHover]);

  const handleFilterTime = (value: string) => {
    setFilterTimeValue(value);
    let countTime =
      value === "1h"
        ? 60
        : value === "1d"
          ? 60 * 24
          : value === "1w"
            ? 60 * 24 * 7
            : value === "1m"
              ? 60 * 24 * 30
              : value === "1y"
                ? 60 * 24 * 365
                : null;

    const currentTime = new Date(); // Thời gian hiện tại

    const oneHourAgo = countTime
      ? new Date(currentTime.getTime() - 60 * countTime * 1000).toISOString()
      : null;

    setFilterTime(oneHourAgo);
  };

  useEffect(() => {
    getTokenInfo();
    getTokenTxs();
    getTokenPools();
  }, []);

  useEffect(() => {
    getHistoryToken();
  }, [filterTime]);

  const dataPools =
    tokenPools &&
    tokenPools.map((pool) => {
      return {
        ...pool,
        tokenselected: {
          first: tokens[pool.tokenAId],
          second: tokens[pool.tokenBId],
        },
      };
    });

  return (
    <>
      <div className="flex w-full flex-col ">
        <Toaster />
        <Header />
        <div className="flex basis-11/12 flex-col px-[16px] pb-[8px] pt-8 sm:px-[16px] lg:px-[32px] xl:px-[41px] 2xl:basis-10/12">
          <div className="mx-auto mt-[0] flex w-full flex-col items-center gap-[20px] sm:mt-[0] lg:mt-[20px] lg:items-start lg:gap-[32px] xl:mt-[40px] xl:mt-[63px] xl:flex-row xl:items-start xl:justify-center xl:gap-[46px]">
            <div className="w-full max-w-[734px]" style={{ zIndex: 102 }}>
              <div className={stylesDetails["token-info-container"]}>
                {loading ? (
                  <>
                    <SkeletonLoading
                      loading={true}
                      className="h-[34px] w-[34px] rounded-full"
                    />
                    <SkeletonLoading
                      loading={true}
                      className="h-[34px] w-full max-w-[300px]"
                    />
                  </>
                ) : (
                  <>
                    <div className={stylesTokens["token-detail-info-logo"]}>
                      <ImageCommon
                        style={{ borderRadius: "50%" }}
                        src={dataInfoDisplay?.logo || ""}
                        alt={dataInfoDisplay?.name || ""}
                        width={24}
                        height={24}
                        className="rounded-full"
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
                      <SkeletonLoading
                        loading={true}
                        className="z-[1000] mb-[8px] h-[40px] w-[200px]"
                      />
                      <SkeletonLoading
                        loading={true}
                        className="z-[1000] h-[34px] w-[200px]"
                      />
                    </>
                  ) : (
                    <>
                      <span className={stylesDetails["token-chart-price-text"]}>
                        {`${dataHover?.value
                          ? dataHover?.value.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 4,
                          })
                          : dataInfoDisplay.price ? formatNumberWithCommas(
                            dataInfoDisplay.price,
                            4
                          ): EMPTY_DATA
                          }`}{" "}
                        <BaseTokenTag />
                      </span>
                      <div className={"flex items-center gap-[4px]"}>
                        <span
                          className={`${stylesDetails["token-chart-change-text"]} ${changePrice >= 0 ? stylesDetails["text-green"] : stylesDetails["text-red"]}`}
                        >
                          <img
                            src={
                              changePrice >= 0
                                ? "/images/token/change-up.svg"
                                : "/images/token/change-down.svg"
                            }
                            alt="token-1"
                          />
                          {BigNumber(Math.abs(changePrice)).toFixed(2)}%
                        </span>
                        {dataHover?.createAt && <span className={`${stylesDetails["token-chart-date-text"]}`}>{moment(dataHover.createAt).format("MMM DD, YYYY, HH:mm A")}</span>}
                      </div>
                    </>
                  )}
                </div>
                <div className={stylesDetails["token-chart-img"]} />
                <div className="relative h-[400px] w-full">
                  <ChartToken
                    type="priceToken"
                    data={dataHistoryToken}
                    onHover={(dataHover) => {
                      if (!dataHover) return setDataHover(null);
                      setDataHover({
                        ...dataHover,
                        value: dataHover.price,
                        createAt: dataHover.createAt,
                      });
                    }}
                    filterTimeValue={filterTimeValue}
                  />
                </div>
              </div>
              <FilterSort
                onChangeTime={handleFilterTime}
                dataFiltersChart="price"
              />
              {loading ? (
                <div className={stylesDetails["stats-token-container"]}>
                  <span className={stylesDetails["stats-token-title"]}>
                    Stats
                  </span>
                  <div className={stylesDetails["stats-token-info"]}>
                    <div className={stylesDetails["stats-token-info-item"]}>
                      <SkeletonLoading
                        loading={true}
                        className="h-[24px] w-[80px] "
                      />
                      <SkeletonLoading
                        loading={true}
                        className="h-[34px] w-[120px]"
                      />
                    </div>
                    <div className={stylesDetails["stats-token-info-item"]}>
                      <SkeletonLoading
                        loading={true}
                        className="h-[24px] w-[80px] "
                      />
                      <SkeletonLoading
                        loading={true}
                        className="h-[34px] w-[120px]"
                      />
                    </div>
                    <div className={stylesDetails["stats-token-info-item"]}>
                      <SkeletonLoading
                        loading={true}
                        className="h-[24px] w-[80px] "
                      />
                      <SkeletonLoading
                        loading={true}
                        className="h-[34px] w-[120px]"
                      />
                    </div>
                    <div className={stylesDetails["stats-token-info-item"]}>
                      <SkeletonLoading
                        loading={true}
                        className="h-[24px] w-[80px] "
                      />
                      <SkeletonLoading
                        loading={true}
                        className="h-[34px] w-[120px]"
                      />
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
                        {formatNumberWithPrice(TvlToken, true, 0, true)}{" "}
                        <BaseTokenTag fontSize="0.8em" />
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
                        {lpTotalSupply ? (
                          <>
                            {formatNumberWithPrice(
                              BigNumber(dataInfoDisplay.price)
                                .times(BigNumber(lpTotalSupply))
                                .div(10 ** precision)
                                .toString(),
                              true,
                              0,
                              true,
                            )}{" "}
                            <BaseTokenTag fontSize="0.8em" />
                          </>
                        ) : (
                          `$${EMPTY_DATA}`
                        )}
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
                        {dataInfoDisplay.fdv
                          ? formatNumberWithPrice(dataInfoDisplay.fdv, true)
                          : `${EMPTY_DATA}`}{" "}
                        <BaseTokenTag fontSize="0.8em" />
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
                        {dataInfoDisplay.volume_1d
                          ? formatNumberWithPrice(
                            dataInfoDisplay.volume_1d,
                            true,
                          )
                          : `${EMPTY_DATA} `}{" "}
                        <BaseTokenTag fontSize="0.8em" />
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
                  titleToken={dataInfoDisplay?.ticker || ""}
                  loading={loadingTxs}
                />
              )}
              {tab === "pools" && (
                <PoolPanel data={dataPools} loading={loadingPools} />
              )}
            </div>
            <div
              className="mt-[-7px] w-full max-w-[734px] sm:max-w-[734px] lg:max-w-[426px] xl:max-w-[426px]"
              style={{ zIndex: 102 }}
            >
              <div className="hidden w-full sm:hidden lg:block xl:block">
                <Swap
                  isDetail
                  tokenSelectInfo={{
                    id: token?.id,
                    price: Number(dataInfoDisplay.price),
                  }}
                />
              </div>
              <div className={stylesDetails["swap-container-info"]}>
                <span className={stylesDetails["swap-text"]}>Info</span>
                {loading ? (
                  <div className={stylesDetails["swap-info-content"]}>
                    <SkeletonLoading
                      loading={true}
                      className="h-[40px] w-[300px]"
                    />
                    <div className="flex items-center gap-[5px]">
                      <SkeletonLoading
                        loading={true}
                        className="h-[40px] w-[150px]"
                      />
                      <SkeletonLoading
                        loading={true}
                        className="h-[40px] w-[150px]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className={stylesDetails["swap-info-content"]}>
                    {token?.address && (
                      <CopyContainer
                        value={token?.address}
                        content={truncateAddress(token?.address)}
                      />
                    )}
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
                <div
                  className="fixed bottom-[0] left-[0] flex h-max w-full items-center justify-center p-2"
                  style={{ zIndex: 102, backdropFilter: "blur(10px)" }}
                >
                  <DrawerTrigger>
                    <div className="flex items-center gap-1 rounded-[12px] border border-borderOrColor bg-bgButtonFixed px-[25px] py-2 text-[20px] text-textBlack">
                      Swap
                    </div>
                  </DrawerTrigger>
                </div>
                <DrawerOverlay className="z-[102] bg-[rgba(0,0,0,.5)]" />
                <DrawerContent
                  className="flex flex-col items-center gap-3 border-[0.826px] border-textBlack bg-bgWhiteColor px-5 pb-[73px] pt-[27px]"
                  style={{ borderRadius: "12px 12px 0 0", zIndex: 102 }}
                >
                  <div className="relative mb-[-60px] flex w-full items-center justify-center">
                    <span className="text-[18px] font-[600] text-[#fff]">
                      swap
                    </span>
                    <DrawerClose className="absolute bottom-[18px] right-0">
                      <Image
                        width={24}
                        height={24}
                        alt=""
                        src="/images/swap/close-icon-modal.svg"
                      />
                    </DrawerClose>
                  </div>
                  {/* <Swap token={token} type="tokenDetail" /> */}
                  <Swap
                    isDetail
                    tokenSelectInfo={{
                      id: token?.id,
                      price: Number(dataInfoDisplay.price),
                    }}
                  />
                </DrawerContent>
              </Drawer>
            </div>
          </div>
          <Footer />
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}
