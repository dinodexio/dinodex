import Image from "next/image";
import { FilterSort } from "./filter-sort";
import "../style.css";
import { useEffect, useMemo, useState } from "react";
import { PoolTransactionPanel } from "./pool-transaction-panel";
import stylesTokens from "../css/tokens.module.css";
import stylesDetails from "../css/detailToken.module.css";
import Link from "next/link";
import {
  useAggregatorStore,
  useGetTvlVolPool,
  useHistoryPools,
  usePoolInfo,
  usePoolTxs,
} from "@/lib/stores/aggregator";
import {
  ADDLIQUIDITY,
  CREATEPOOL,
  EMPTY_DATA,
  REMOVELIQUIDITY,
  SELLPATH,
} from "@/constants";
import {
  formatNumber,
  formatNumberWithPrice,
  removePrecision,
} from "@/lib/utils";
import { precision } from "../ui/balance";
import { InfoPoolLayoutProps, DataTransactionPanel } from "@/types";
import { CopyContainer } from "./copy-container";
import { Toaster } from "../ui/toaster";
const Header = dynamic(() => import("@/components/headerv2"), {
  ssr: false,
});
import { Footer } from "../footer";
import { ScrollToTopButton } from "../scrollToTopButton/scrollToTopButton";
import dynamic from "next/dynamic";
import { SkeletonLoading } from "./SkeletonLoading";
import BigNumber from "bignumber.js";
import { ImageCommon } from "../common/ImageCommon";
import { useTokenStore } from "@/lib/stores/token";
import { ChartPoolBar } from "../chartComponents/ChartPoolBar";
import BaseTokenTag from "../common/BaseTokenTag";

const displaySortAddress = (address = "") => {
  return `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;
};

export function InfoPoolLayout({ params }: InfoPoolLayoutProps) {
  let poolKey = params?.key[0];
  const { data: poolInfo, loading, error, getPoolInfo } = usePoolInfo(poolKey);
  const {
    data: poolTxs,
    loading: loadingTxs,
    getPoolTxs,
  } = usePoolTxs(poolKey);

  const { data: tokens } = useTokenStore();
  const { tokens: listTokens, loadTokens } = useAggregatorStore();

  const [dataFiltersChart, setDataFiltersChart] = useState<string>("volume");
  const [time, setTime] = useState<string>("1d");
  const [filterTime, setFilterTime] = useState<string>(
    new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString(),
  );

  const { data: dataHistoryPool, getHistoryPools } = useHistoryPools(
    poolKey,
    filterTime,
  );

  const {
    data: dataTVLandVol,
    loading: loadingTVLandVol,
    getTVLandVolPools,
  } = useGetTvlVolPool(poolKey);

  const [changePool, setChangePool] = useState<Boolean>(false);

  const dataInfoDisplay = useMemo(() => {
    const { tokenAId, tokenBId, tokenAAmount, tokenBAmount } = poolInfo;
    return {
      poolKey: poolKey,
      tvl: null,
      volume_1d: null,
      tokenselected: {
        first: changePool
          ? {
              ...tokens[tokenBId],
              amount: tokenBAmount,
              tokenId: tokenBId,
            }
          : {
              ...tokens[tokenAId],
              amount: tokenAAmount,
              tokenId: tokenAId,
            },
        second: changePool
          ? {
              ...tokens[tokenAId],
              amount: tokenAAmount,
              tokenId: tokenAId,
            }
          : {
              ...tokens[tokenBId],
              amount: tokenBAmount,
              tokenId: tokenBId,
            },
      },
    };
  }, [JSON.stringify(poolInfo), changePool]);

  const dataTxsDisplay: DataTransactionPanel[] = useMemo(() => {
    return poolTxs.map((tx) => {
      //TODO constains text buy sell
      let type = [REMOVELIQUIDITY].includes(tx.type || "")
        ? "remove"
        : [CREATEPOOL, ADDLIQUIDITY].includes(tx.type || "")
          ? "add"
          : "";

      let typeText = type;
      let priceTransaction = removePrecision(
        BigNumber(tx?.tokenAAmount || 0)
          .times(tx?.tokenAPrice || 0)
          .toString(),
        precision,
      );

      if (tx.type === SELLPATH) {
        type = tx.directionAB ? "sell" : "buy";
        typeText = type + " " + dataInfoDisplay?.tokenselected?.first?.ticker;
      }
      return {
        action: type,
        typeText: typeText,
        timestamp: tx.createAt,
        tokenAAmount: changePool ? tx?.tokenBAmount : tx?.tokenAAmount,
        tokenBAmount: changePool ? tx?.tokenAAmount : tx?.tokenBAmount,
        creator: tx?.creator,
        priceusd: priceTransaction,
      };
    });
  }, [JSON.stringify(poolTxs), JSON.stringify(dataInfoDisplay)]);

  const widthPoolBalances = useMemo(() => {
    let priceA =
      listTokens.find(
        (item: any) =>
          item.id === dataInfoDisplay?.tokenselected?.first?.tokenId,
      )?.price || 0;
    let priceB =
      listTokens.find(
        (item: any) =>
          item.id === dataInfoDisplay?.tokenselected?.second?.tokenId,
      )?.price || 0;
    let valueA = BigNumber(dataInfoDisplay?.tokenselected?.first?.amount)
      .times(BigNumber(priceA))
      .div(10 ** precision)
      .toNumber();
    let valueB = BigNumber(dataInfoDisplay?.tokenselected?.second?.amount)
      .times(BigNumber(priceB))
      .div(10 ** precision)
      .toNumber();
    let widthA = (valueA / (valueA + valueB)) * 100;
    let widthB = (valueB / (valueA + valueB)) * 100;
    return {
      widthA: widthA > widthB ? widthA - 1 : widthA,
      widthB: widthB > widthA ? widthB - 1 : widthB,
    };
  }, [JSON.stringify(dataInfoDisplay)]);

  const handleUpdateFilterChart = (value: string) => {
    setDataFiltersChart(value);
  };

  const handleFilterTime = (value: string) => {
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

    const currentTime = new Date();

    const oneHourAgo = countTime
      ? new Date(currentTime.getTime() - 60 * countTime * 1000).toISOString()
      : "";

    setFilterTime(oneHourAgo);
    setTime(value);
  };

  useEffect(() => {
    getPoolInfo();
    getPoolTxs();
    loadTokens();
  }, []);

  useEffect(() => {
    getHistoryPools();
    getTVLandVolPools();
  }, [filterTime]);

  const formaterTextTime = (time: string) => {
    let textTime = "";
    switch (time) {
      case "1h":
        textTime = "Past hour";
        break;
      case "1d":
        textTime = "Past day";
        break;
      case "1w":
        textTime = "Past week";
        break;
      case "1m":
        textTime = "Past month";
        break;
      case "1y":
        textTime = "Past year";
        break;
      default:
        break;
    }
    return textTime;
  };

  const renderInfoChart = (type: string = "volume") => {
    let html = null;
    const data = {
      value: "",
      time: "",
    };
    if (type === "volume") {
      const totalVolume = dataHistoryPool.reduce((acc, item: any) => {
        const tokenAPriceVolume =
          item?.tokenAPrice * parseFloat(item?.tokenAAmount);
        const tokenBPriceVolume =
          item?.tokenBPrice * parseFloat(item?.tokenBAmount);
        return acc + tokenAPriceVolume + tokenBPriceVolume;
      }, 0);
      html = (
        <>
          <span className={stylesDetails["token-chart-price-text"]}>
            {`  ${formatNumber(
              BigNumber(totalVolume)
                .dividedBy(10 ** precision)
                .toNumber(),
            )} `}
            <BaseTokenTag />
          </span>
          <span
            className={`text-[16px] font-[500] text-textBlack sm:text-[16px] lg:text-[20px] xl:text-[20px]`}
          >
            Past day
          </span>
        </>
      );
      data.value = formatNumber(
        BigNumber(totalVolume)
          .dividedBy(10 ** precision)
          .toNumber(),
      );
      data.time = formaterTextTime(time);
    }
    if (type === "price") {
      const per =
        dataInfoDisplay?.tokenselected?.first?.amount === undefined ||
        dataInfoDisplay?.tokenselected?.first?.amount === null ||
        isNaN(dataInfoDisplay?.tokenselected?.first?.amount) ||
        dataInfoDisplay?.tokenselected?.second?.amount === undefined ||
        dataInfoDisplay?.tokenselected?.second?.amount === null ||
        isNaN(dataInfoDisplay?.tokenselected?.second?.amount)
          ? EMPTY_DATA
          : Number(
              dataInfoDisplay?.tokenselected?.first?.amount /
                dataInfoDisplay?.tokenselected?.second?.amount,
            ).toFixed(2);
      html = (
        <>
          <span className={stylesDetails["token-chart-volume-text"]}>
            1 {dataInfoDisplay?.tokenselected?.first?.ticker || ""} = {per}{" "}
            {dataInfoDisplay?.tokenselected?.second?.ticker || ""}
          </span>
        </>
      );
    }
    return data;
  };

  return (
    <>
      <div className="flex w-full flex-col ">
        <Toaster />
        <Header />
        <div className="flex basis-11/12 flex-col px-[16px] pb-[8px] pt-8 sm:px-[16px] lg:px-[32px] xl:px-[41px] 2xl:basis-10/12">
          <div
            className="mx-auto mt-0 sm:mt-0 lg:mt-[20px] xl:mt-[40px] flex w-full flex-col items-center gap-[20px] lg:items-center lg:gap-[32px] xl:flex-row xl:items-start xl:justify-center xl:gap-[46px]"
            style={{ zIndex: 50 }}
          >
            <div className="w-full max-w-[734px]" style={{ zIndex: 102 }}>
              <div className={stylesDetails["token-info-container"]}>
                {loading ? (
                  <>
                    <SkeletonLoading
                      loading={loading}
                      className="h-[30px] w-[30px] rounded-full"
                    />
                    <SkeletonLoading
                      loading={loading}
                      className="h-[30px] w-full max-w-[300px]"
                    />
                  </>
                ) : (
                  <>
                    <div className={stylesTokens["token-detail-info-logo"]}>
                      <div className={stylesDetails["token-info-logo"]}>
                        <div className="relative h-[30px] w-[30px] overflow-hidden">
                          <ImageCommon
                            className="absolute left-1/2 rounded-full border border-textBlack"
                            src={
                              dataInfoDisplay?.tokenselected?.first?.logo ||
                              "/images/swap/logo-token-default.svg"
                            }
                            alt={
                              dataInfoDisplay?.tokenselected?.first?.name || ""
                            }
                            width={30}
                            height={30}
                          />
                        </div>
                        <div className="relative h-[30px] w-[30px] overflow-hidden">
                          <ImageCommon
                            className="absolute right-1/2  rounded-full border border-textBlack"
                            src={
                              dataInfoDisplay?.tokenselected?.second?.logo ||
                              "/images/swap/logo-token-default.svg"
                            }
                            alt={
                              dataInfoDisplay?.tokenselected?.second?.name || ""
                            }
                            width={30}
                            height={30}
                          />
                        </div>
                      </div>
                    </div>
                    <span className="text-[20px] font-[400] text-textBlack sm:text-[20px] lg:text-[24px] xl:text-[24px]">
                      {`${dataInfoDisplay?.tokenselected?.first?.ticker || EMPTY_DATA}/${dataInfoDisplay?.tokenselected?.second?.ticker || EMPTY_DATA}`}
                    </span>
                    <span
                      className={`rounded-[7px] bg-bgWhiteColor px-[10px] py-[5px] text-[14px] font-[400] text-textBlack shadow-content sm:text-[14px] lg:text-[15px] xl:text-[15px]`}
                    >
                      0.2 %
                    </span>
                    <div
                      className="ml-[-8px] mt-[4px] cursor-pointer opacity-100 hover:opacity-70"
                      style={{ transition: "opacity 0.3s ease" }}
                      onClick={() => setChangePool(!changePool)}
                    >
                      <Image
                        src={"/images/token/change-pool.svg"}
                        alt="change-pool"
                        width={45}
                        height={45}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className={stylesDetails["token-chart-container"]}>
                {/* <div className={stylesDetails["token-chart-price"]}>
                  {loading ? (
                    <>
                      <SkeletonLoading
                        loading={loading}
                        className="mb-[4px] h-[40px] w-[300px]"
                      />
                      <SkeletonLoading
                        loading={loading}
                        className="h-[20px] w-[300px]"
                      />
                    </>
                  ) : (
                    renderInfoChart(dataFiltersChart)
                  )}
                </div> */}
                <div
                  className="relative h-[400px] w-full"
                  style={{ zIndex: 100 }}
                >
                  <ChartPoolBar
                    params={renderInfoChart(dataFiltersChart)}
                    data={dataHistoryPool}
                    time={time}
                  />
                </div>
              </div>
              <FilterSort
                onChangeTime={handleFilterTime}
                handleUpdateFilterChart={handleUpdateFilterChart}
                dataFiltersChart={dataFiltersChart}
              />
              {loading || loadingTVLandVol ? (
                <div className="flex flex-col items-start gap-[12px] sm:flex lg:hidden xl:hidden">
                  <span className="text-[20px] font-[400] text-textBlack sm:text-[20px] lg:text-[24px] xl:text-[24px]">
                    Stats
                  </span>
                  <SkeletonLoading
                    loading={loading}
                    className="mb-[12px] h-[21px] w-[100px]"
                  />
                  <SkeletonLoading
                    loading={loading}
                    className="h-[40px] w-full"
                  />
                  <div className="flex w-full items-center justify-between">
                    <div className="flex w-[50%] flex-col items-start">
                      <SkeletonLoading
                        loading={loading}
                        className="mb-[12px] h-[21px] w-[100px]"
                      />
                      <SkeletonLoading
                        loading={loading}
                        className="h-[40px] w-full"
                      />
                    </div>
                    <div className="flex w-[45%] flex-col items-start">
                      <SkeletonLoading
                        loading={loading}
                        className="mb-[12px] h-[21px] w-[100px]"
                      />
                      <SkeletonLoading
                        loading={loading}
                        className="h-[40px] w-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <SkeletonLoading
                      loading={loading}
                      className="mb-[12px] h-[21px] w-[100px]"
                    />
                    <SkeletonLoading
                      loading={loading}
                      className="h-[40px] w-[200px]"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-start gap-[12px] sm:flex lg:hidden xl:hidden">
                    <span className="text-[20px] font-[400] text-textBlack sm:text-[20px] lg:text-[24px] xl:text-[24px]">
                      Stats
                    </span>
                    <span className="text-[14px] font-[400] text-textBlack opacity-60">
                      Pool balances
                    </span>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-[4px]">
                        <span className="pr-[4px] text-[14px] font-[400] text-textBlack sm:text-[14px] lg:text-[18.813px] xl:text-[18.813px]">
                          {formatNumberWithPrice(
                            dataInfoDisplay?.tokenselected?.first?.amount,
                            false,
                            precision,
                          )}
                        </span>
                        <ImageCommon
                          src={
                            dataInfoDisplay?.tokenselected?.first?.logo ||
                            "/images/swap/logo-token-default.svg"
                          }
                          width={15}
                          height={15}
                          alt={
                            dataInfoDisplay?.tokenselected?.first?.ticker || ""
                          }
                          className="rounded-full"
                        />
                        <span className="text-[14px] font-[400] text-textBlack sm:text-[14px] lg:text-[18.813px] xl:text-[18.813px]">
                          {dataInfoDisplay?.tokenselected?.first?.ticker}
                        </span>
                      </div>
                      <div className="flex items-center gap-[4px]">
                        <span className="pr-[4px] text-[14px] font-[400] text-textBlack sm:text-[14px] lg:text-[18.813px] xl:text-[18.813px]">
                          {formatNumberWithPrice(
                            dataInfoDisplay?.tokenselected?.second?.amount,
                            false,
                            precision,
                          )}
                        </span>
                        <ImageCommon
                          src={
                            dataInfoDisplay?.tokenselected?.second?.logo ||
                            "/images/swap/logo-token-default.svg"
                          }
                          width={15}
                          height={15}
                          alt={
                            dataInfoDisplay?.tokenselected?.second?.ticker || ""
                          }
                          className="rounded-full"
                        />
                        <span className="text-[14px] font-[400] text-textBlack sm:text-[14px] lg:text-[18.813px] xl:text-[18.813px]">
                          {dataInfoDisplay?.tokenselected?.second?.ticker}
                        </span>
                      </div>
                    </div>
                    <div className="flex w-full items-center gap-[2px] sm:gap-[2px] lg:gap-[8px] xl:gap-[8px]">
                      <div
                        className="h-[18px] rounded-bl-full rounded-tl-full bg-borderOrColor"
                        style={{ width: `${widthPoolBalances.widthA}%` }}
                      />
                      <div
                        className="h-[18px] rounded-br-full rounded-tr-full bg-[#6A16FF]"
                        style={{ width: `${widthPoolBalances.widthB}%` }}
                      />
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex w-[50%] flex-col items-start">
                        <span className="text-[14px] font-[400] text-textBlack opacity-60">
                          TVL
                        </span>
                        <div className="flex items-center gap-[10px]">
                          <span className="text-[24px] font-[400] text-textBlack sm:text-[24px] lg:text-[45px] xl:text-[50px]">
                            {formatNumberWithPrice(
                              dataTVLandVol?.tvl || "",
                              true,
                              0,
                              true
                            )}
                            <BaseTokenTag fontSize="0.6em" />
                          </span>
                          <div className="flex items-center gap-[4px]">
                            <Image
                              src="/images/token/change-down.svg"
                              alt=""
                              width={12}
                              height={18}
                            />
                            <span className="text-[14px] font-[500] text-[#F83B28] sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                              {EMPTY_DATA}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-[45%] flex-col items-start">
                        <span className="text-[14px] font-[400] text-textBlack opacity-60">
                          24h Fees
                        </span>
                        <div className="flex items-center gap-[10px]">
                          <span className="text-[24px] font-[400] text-textBlack sm:text-[24px] lg:text-[45px] xl:text-[54px]">
                            {EMPTY_DATA}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[14px] font-[400] text-textBlack opacity-60">
                        24h Volume
                      </span>
                      <div className="flex items-center gap-[10px]">
                        <span className="text-[24px] font-[400] text-textBlack sm:text-[24px] lg:text-[45px] xl:text-[54px]">
                          {/* {formatNumberWithPrice(
                            BigNumber(dataTVLandVol?.vol).dividedBy(10 ** precision).toString() || "",
                            true,
                          )} */}
                          {`${EMPTY_DATA}`} <BaseTokenTag fontSize="0.8em" />
                        </span>
                        <div className="flex items-center gap-[4px]">
                          <Image
                            src="/images/token/change-up.svg"
                            alt=""
                            width={12}
                            height={18}
                          />
                          <span className="text-[14px] font-[500] text-[#45B272] sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                            {EMPTY_DATA +
                              "%"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="my-[25px] flex items-center gap-[20px]">
                <span
                  className={`${stylesTokens["menu-token-item"]} ${stylesTokens["menu-token-item-active"]} flex items-center gap-[4px]`}
                >
                  <div
                    className={`h-[8px] w-[8px] rounded-full bg-borderOrColor transition-all duration-300 ease-linear`}
                  />
                  Transactions
                </span>
              </div>
              <PoolTransactionPanel
                data={dataTxsDisplay}
                titleA={dataInfoDisplay.tokenselected.first.ticker || ""}
                titleB={dataInfoDisplay.tokenselected.second.ticker || ""}
                logoA={dataInfoDisplay.tokenselected.first.logo || ""}
                logoB={dataInfoDisplay.tokenselected.second.logo || ""}
                loading={loadingTxs || loading}
              />
            </div>
            <div
              className="mt-[-7px] w-full max-w-[734px] sm:max-w-[734px] lg:max-w-[426px] xl:max-w-[426px]"
              style={{ zIndex: 102 }}
            >
              <div className="hidden items-center justify-between sm:hidden lg:flex xl:flex">
                <Link
                  href={{
                    pathname: "/swap",
                    query: {
                      tokenA: dataInfoDisplay.tokenselected?.first?.ticker,
                      tokenB: dataInfoDisplay.tokenselected?.second?.ticker,
                    },
                  }}
                  className="flex h-[46px] w-max cursor-pointer items-center gap-[15px] rounded-[12px] px-[30px] py-[9px] opacity-100 shadow-content hover:opacity-70"
                  style={{
                    background: "rgba(255, 96, 59, 0.25)",
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <span className="text-[24px] font-[400] text-borderOrColor">
                    Swap
                  </span>
                  <Image
                    src={"/images/token/icon-pool-details.svg"}
                    alt="icon-pool-details"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link
                  href={`/add/${dataInfoDisplay.tokenselected?.first?.ticker}/${dataInfoDisplay.tokenselected?.second?.ticker}`}
                  className="flex h-[46px] w-max cursor-pointer items-center gap-[15px] rounded-[12px] px-[40px] py-[9px] opacity-100 shadow-content hover:opacity-70"
                  style={{
                    background: "rgba(255, 96, 59, 0.25)",
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <span className="text-[24px] font-[400] text-borderOrColor">
                    Add liquidity
                  </span>
                  <Image
                    src={"/images/token/icon-pool-details.svg"}
                    alt="icon-pool-details"
                    width={24}
                    height={24}
                  />
                </Link>
              </div>
              {loading ? (
                <div className="mt-[40px] hidden flex-col gap-[12px] rounded-[7px] bg-bgWhiteColor pb-[23px] pl-[28px] pr-[27px] pt-[26px] shadow-popup sm:hidden sm:gap-[12px] lg:flex lg:gap-[18px] xl:flex xl:gap-[18px] ">
                  <span className="text-[20px] font-[400] text-textBlack sm:text-[20px] lg:text-[24px] xl:text-[24px]">
                    Stats
                  </span>
                  <SkeletonLoading
                    loading={loading}
                    className="h-[21px] w-[100px]"
                  />
                  <SkeletonLoading
                    loading={loading}
                    className="h-[64px] w-full"
                  />
                  <div className="flex flex-col items-start">
                    <SkeletonLoading
                      loading={loading}
                      className="mb-[12px] h-[21px] w-[100px]"
                    />
                    <SkeletonLoading
                      loading={loading}
                      className="h-[70px] w-full"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <SkeletonLoading
                      loading={loading}
                      className="mb-[12px] h-[21px] w-[100px]"
                    />
                    <SkeletonLoading
                      loading={loading}
                      className="h-[70px] w-full"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <SkeletonLoading
                      loading={loading}
                      className="mb-[12px] h-[21px] w-[100px]"
                    />
                    <SkeletonLoading
                      loading={loading}
                      className="h-[70px] w-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-[40px] hidden flex-col gap-[12px] rounded-[7px] bg-bgWhiteColor pb-[23px] pl-[28px] pr-[27px] pt-[26px] shadow-popup sm:hidden sm:gap-[12px] lg:flex lg:gap-[18px] xl:flex xl:gap-[18px] ">
                  <span className="text-[20px] font-[400] text-textBlack sm:text-[20px] lg:text-[24px] xl:text-[24px]">
                    Stats
                  </span>
                  <span className="text-[14px] font-[400] text-textBlack opacity-60">
                    Pool balances
                  </span>
                  <div className="flex w-full flex-col items-start gap-[8px]">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-[4px]">
                        <span className="pr-[4px] text-[14px] font-[400] text-textBlack sm:text-[14px] lg:text-[18.813px] xl:text-[18.813px]">
                          {formatNumberWithPrice(
                            dataInfoDisplay?.tokenselected?.first?.amount,
                            false,
                            precision,
                          )}
                        </span>
                        <ImageCommon
                          src={
                            dataInfoDisplay?.tokenselected?.first?.logo ||
                            "/images/swap/logo-token-default.svg"
                          }
                          width={15}
                          height={15}
                          alt={
                            dataInfoDisplay?.tokenselected?.first?.ticker || ""
                          }
                          className="rounded-full"
                        />
                        <span className="text-[14px] font-[400] text-textBlack sm:text-[14px] lg:text-[18.813px] xl:text-[18.813px]">
                          {dataInfoDisplay?.tokenselected?.first?.ticker}
                        </span>
                      </div>
                      <div className="flex items-center gap-[4px]">
                        <span className="pr-[4px] text-[14px] font-[400] text-textBlack sm:text-[14px] lg:text-[18.813px] xl:text-[18.813px]">
                          {formatNumberWithPrice(
                            dataInfoDisplay?.tokenselected?.second?.amount,
                            false,
                            precision,
                          )}
                        </span>
                        <ImageCommon
                          src={
                            dataInfoDisplay?.tokenselected?.second?.logo ||
                            "/images/swap/logo-token-default.svg"
                          }
                          width={15}
                          height={15}
                          alt={
                            dataInfoDisplay?.tokenselected?.second?.ticker || ""
                          }
                          className="rounded-full"
                        />
                        <span className="text-[14px] font-[400] text-textBlack sm:text-[14px] lg:text-[18.813px] xl:text-[18.813px]">
                          {dataInfoDisplay?.tokenselected?.second?.ticker ||
                            EMPTY_DATA}
                        </span>
                      </div>
                    </div>
                    <div className="flex w-full items-center gap-[2px] sm:gap-[2px] lg:gap-[8px] xl:gap-[8px]">
                      <div
                        className="h-[18px] rounded-bl-full rounded-tl-full bg-borderOrColor"
                        style={{ width: `${widthPoolBalances.widthA}%` }}
                      />
                      <div
                        className="h-[18px] rounded-br-full rounded-tr-full bg-[#6A16FF]"
                        style={{ width: `${widthPoolBalances.widthB}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[14px] font-[400] text-textBlack opacity-60">
                      TVL
                    </span>
                    <div className="flex items-center gap-[10px]">
                      <span className="text-[24px] font-[400] text-textBlack sm:text-[24px] lg:text-[45px] xl:text-[54px]">
                        {formatNumberWithPrice(
                          dataTVLandVol?.tvl || "",
                          true,
                          0,
                          true,
                        )}{" "}
                        <BaseTokenTag fontSize="0.8em" />
                      </span>
                      <div className="flex items-center gap-[4px]">
                        <Image
                          src="/images/token/change-down.svg"
                          alt=""
                          width={12}
                          height={18}
                        />
                        <span className="text-[14px] font-[500] text-[#F83B28] sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                          {EMPTY_DATA}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[14px] font-[400] text-textBlack opacity-60">
                      24h Volume
                    </span>
                    <div className="flex items-center gap-[10px]">
                      <span className="text-[24px] font-[400] text-textBlack sm:text-[24px] lg:text-[45px] xl:text-[54px]">
                        {/* {formatNumberWithPrice(
                          BigNumber(dataTVLandVol?.vol).dividedBy(10 ** precision).toString() || "",
                          true,
                        )} */}
                        {`${EMPTY_DATA}`} <BaseTokenTag fontSize="0.8em" />
                      </span>
                      <div className="flex items-center gap-[4px]">
                        <Image
                          src="/images/token/change-up.svg"
                          alt=""
                          width={12}
                          height={18}
                        />
                        <span className="text-[14px] font-[500] text-[#45B272] sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                          {EMPTY_DATA}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[14px] font-[400] text-textBlack opacity-60">
                      24h Fees
                    </span>
                    <div className="flex items-center gap-[10px]">
                      <span className="text-[24px] font-[400] text-textBlack sm:text-[24px] lg:text-[45px] xl:text-[54px]">
                        {EMPTY_DATA}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-0 flex flex-col gap-[7px] sm:mt-0 lg:mt-[24px] lg:mb-[0px] xl:mt-[24px] sm:mb-[60px] mb-[60px]">
                <span className="text-[20px] font-[400] text-textBlack">
                  Links
                </span>
                {loading ? (
                  <div className="flex flex-col gap-[20px]">
                    <div className="flex items-center gap-[8px]">
                      <SkeletonLoading
                        loading={loading}
                        className="h-[30px] w-[30px] rounded-full"
                      />
                      <SkeletonLoading
                        loading={loading}
                        className="h-[30px] w-full max-w-[300px]"
                      />
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <SkeletonLoading
                        loading={loading}
                        className="h-[30px] w-[30px] rounded-full"
                      />
                      <SkeletonLoading
                        loading={loading}
                        className="h-[30px] w-full max-w-[300px]"
                      />
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <SkeletonLoading
                        loading={loading}
                        className="h-[30px] w-[30px] rounded-full"
                      />
                      <SkeletonLoading
                        loading={loading}
                        className="h-[30px] w-full max-w-[300px]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-[20px]">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-[8px]">
                        <div className={stylesDetails["token-info-logo"]}>
                          <div className="relative h-[30px] w-[30px] overflow-hidden">
                            <ImageCommon
                              className="absolute left-1/2 rounded-full border border-textBlack"
                              src={
                                dataInfoDisplay?.tokenselected?.first?.logo ||
                                "/images/swap/logo-token-default.svg"
                              }
                              alt={
                                dataInfoDisplay?.tokenselected?.first?.name ||
                                ""
                              }
                              width={30}
                              height={30}
                            />
                          </div>
                          <div className="relative h-[30px] w-[30px] overflow-hidden">
                            <ImageCommon
                              className="absolute right-1/2 rounded-full border border-textBlack"
                              src={
                                dataInfoDisplay?.tokenselected?.second?.logo ||
                                "/images/swap/logo-token-default.svg"
                              }
                              alt={
                                dataInfoDisplay?.tokenselected?.second?.name ||
                                ""
                              }
                              width={30}
                              height={30}
                            />
                          </div>
                        </div>
                        <span className="text-[18px] font-[400] text-textBlack sm:text-[18px] lg:text-[24px] xl:text-[24px]">
                          {(dataInfoDisplay?.tokenselected?.first?.ticker ||
                            EMPTY_DATA) +
                            "/" +
                            (dataInfoDisplay?.tokenselected?.second?.ticker ||
                              EMPTY_DATA)}
                        </span>
                      </div>
                      <CopyContainer
                        value={dataInfoDisplay.poolKey}
                        content={displaySortAddress(dataInfoDisplay.poolKey)}
                      />
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <Link
                        href={`/info/tokens/${dataInfoDisplay?.tokenselected?.first?.ticker}`}
                        passHref
                        className="transition-duration-300 ease flex items-center gap-[8px] opacity-100 transition-all hover:opacity-70 "
                      >
                        <ImageCommon
                          src={
                            dataInfoDisplay?.tokenselected?.first?.logo ||
                            "/images/swap/logo-token-default.svg"
                          }
                          alt={
                            dataInfoDisplay?.tokenselected?.first?.name || ""
                          }
                          width={30}
                          height={30}
                          className="rounded-full"
                        />
                        <span className="text-[18px] font-[400] text-textBlack sm:text-[18px] lg:text-[24px] xl:text-[24px]">
                          {dataInfoDisplay?.tokenselected?.first?.ticker}
                        </span>
                        <div className="ml-[25px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="17"
                            viewBox="0 0 14 17"
                            fill="none"
                          >
                            <path
                              d="M2 1.85791L12 8.70002L2 15.279"
                              stroke="black"
                              strokeWidth="2.10526"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </Link>
                      {/* <CopyContainer
                        value="0xFd08as123u8asy348123FCbb9"
                        content={<>0xFd08...FCbb9b</>}
                      /> */}
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <Link
                        href={`/info/tokens/${dataInfoDisplay?.tokenselected?.second?.ticker}`}
                        passHref
                        className="flex items-center gap-[8px] opacity-100 transition hover:opacity-70 "
                      >
                        <ImageCommon
                          src={
                            dataInfoDisplay?.tokenselected?.second?.logo ||
                            "/images/swap/logo-token-default.svg"
                          }
                          alt={
                            dataInfoDisplay?.tokenselected?.second?.name || ""
                          }
                          width={30}
                          height={30}
                          className="rounded-full"
                        />
                        <span className="text-[18px] font-[400] text-textBlack sm:text-[18px] lg:text-[24px] xl:text-[24px]">
                          {dataInfoDisplay?.tokenselected?.second?.ticker}
                        </span>
                        <div className="ml-[25px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="17"
                            viewBox="0 0 14 17"
                            fill="none"
                          >
                            <path
                              d="M2 1.85791L12 8.70002L2 15.279"
                              stroke="black"
                              strokeWidth="2.10526"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </Link>
                      {/* <CopyContainer
                        value="0xFd08as123u8asy348123FCbb9"
                        content={<>0xFd08...FCbb9b</>}
                      /> */}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="fixed bottom-0 p-2 z-[105] flex w-full items-center bg-transparent justify-between sm:flex lg:hidden xl:hidden">
              <Link
                href={{
                  pathname: "/swap",
                  query: {
                    tokenA: dataInfoDisplay.tokenselected?.first?.ticker,
                    tokenB: dataInfoDisplay.tokenselected?.second?.ticker,
                  },
                }}
                className="flex h-[46px] w-[47.5%] cursor-pointer justify-center items-center gap-[8px] rounded-[8px] px-[24px] py-[9px] opacity-100 shadow-content "
                style={{
                  background: "rgb(255 212 200)",
                  transition: "opacity 0.3s ease",
                }}
              >
                <span className="text-[16px] font-[400] text-borderOrColor">
                  Swap
                </span>
                <Image
                  src={"/images/token/icon-pool-details.svg"}
                  alt="icon-pool-details"
                  width={16}
                  height={16}
                />
              </Link>
              <Link
                href={`/add/${dataInfoDisplay.tokenselected?.first?.ticker}/${dataInfoDisplay.tokenselected?.second?.ticker}`}
                className="flex h-[46px] w-[47.5%] cursor-pointer justify-center items-center gap-[8px] rounded-[8px] px-[24px] py-[9px] opacity-100 shadow-content"
                style={{
                  background: "rgb(255 212 200)",
                  transition: "opacity 0.3s ease",
                }}
              >
                <span className="text-[16px] font-[400] text-borderOrColor">
                  Add liquidity
                </span>
                <Image
                  src={"/images/token/icon-pool-details.svg"}
                  alt="icon-pool-details"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </div>
          <Footer />
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}
