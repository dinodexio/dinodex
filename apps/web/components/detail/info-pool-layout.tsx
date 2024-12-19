// import { ChartToken } from "../token/chart-token";
import Image from "next/image";
import { FilterSort } from "./filter-sort";
import "../style.css";
import { useEffect, useMemo, useState } from "react";
import { PoolTransactionPanel } from "./pool-transaction-panel";
import stylesTokens from "../css/tokens.module.css";
import stylesDetails from "../css/detailToken.module.css";
import Link from "next/link";
import { useAggregatorStore, useHistoryPools, usePoolInfo, usePoolTxs } from "@/lib/stores/aggregator";
// import { Loader } from "../ui/Loader";
import {
  ADDLIQUIDITY,
  CREATEPOOL,
  EMPTY_DATA,
  REMOVELIQUIDITY,
  SELLPATH,
} from "@/constants";
import { tokens } from "@/tokens";
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
import ChartPoolBar from "../chartComponents/ChartPoolBar";

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

  const { tokens: listTokens, loadTokens } = useAggregatorStore();

  const { data: dataHistoryPool, loading: loadingHistoryPool, getHistoryPools } = useHistoryPools(poolKey)

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
          }
          : {
            ...tokens[tokenAId],
            amount: tokenAAmount,
          },
        second: changePool
          ? {
            ...tokens[tokenAId],
            amount: tokenAAmount,
          }
          : {
            ...tokens[tokenBId],
            amount: tokenBAmount,
          },
      },
    };
  }, [JSON.stringify(poolInfo), changePool]);

  const TvlPool = useMemo(() => {
    if (!listTokens || listTokens.length === 0) return 0;
    const { tokenAId, tokenBId, tokenAAmount, tokenBAmount } = poolInfo;
    let priceTokenA = listTokens[tokenAId]?.price || 0;
    let priceTokenB = listTokens[tokenBId]?.price || 0;
    return BigNumber(tokenAAmount || 0)
      .times(priceTokenA)
      .plus(BigNumber(tokenBAmount || 0).times(priceTokenB)).div(10 ** precision).toNumber();
  }, [JSON.stringify(listTokens)]);

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
        tokenAAmount: tx?.tokenAAmount,
        tokenBAmount: tx?.tokenBAmount,
        creator: tx?.creator,
        priceusd: formatNumber(priceTransaction.toString()),
      };
    });
  }, [JSON.stringify(poolTxs), JSON.stringify(dataInfoDisplay)]);

  const widthPoolBalances = useMemo(() => {
    let amountA = BigNumber(dataInfoDisplay?.tokenselected?.first?.amount).div(10 ** precision).toNumber();
    let amountB = BigNumber(dataInfoDisplay?.tokenselected?.second?.amount).div(10 ** precision).toNumber();
    let widthA = (amountA / (amountA + amountB)) * 100;
    let widthB = (amountB / (amountA + amountB)) * 100;
    return {
      widthA: widthA > widthB ? widthA - 1 : widthA,
      widthB: widthB > widthA ? widthB - 1 : widthB,
    };
  }, [JSON.stringify(dataInfoDisplay)]);

  useEffect(() => {
    console.log('dataHistoryPool::',dataHistoryPool)
  },[dataHistoryPool])

  useEffect(() => {
    getPoolInfo();
    getPoolTxs();
    loadTokens();
    getHistoryPools();
  }, []);

  return (
    <>
      <div className="flex w-full flex-col ">
        <Toaster />
        <Header />
        <div className="flex basis-11/12 flex-col px-[16px] pb-[8px] pt-8 sm:px-[16px] lg:px-[32px] xl:px-[41px] 2xl:basis-10/12">
          <div
            className="mx-auto mt-[40px] flex w-full flex-col items-center gap-[20px] lg:items-center lg:gap-[32px] xl:mt-[63px] xl:flex-row xl:items-start xl:justify-center xl:gap-[46px]"
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
                          <Image
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
                          <Image
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
                      0.3%
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
                <div className={stylesDetails["token-chart-price"]}>
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
                    <>
                      <span className={stylesDetails["token-chart-price-text"]}>
                        $6.02M
                      </span>
                      <span
                        className={`text-[16px] font-[500] text-textBlack sm:text-[16px] lg:text-[20px] xl:text-[20px]`}
                      >
                        Past day
                      </span>
                    </>
                  )}
                </div>
                <div
                  className="relative h-[400px] w-full"
                  style={{ zIndex: 100 }}
                >
                  {/* <ChartToken type="priceToken" onHover={(dataHover) => {
                setDataHover(dataHover)
              }} /> */}
                  <ChartPoolBar data={dataHistoryPool.reverse()}/>
                </div>
              </div>
              <FilterSort />
              {loading ? (
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
                      <Image
                        src={
                          dataInfoDisplay?.tokenselected?.first?.logo ||
                          "/images/swap/logo-token-default.svg"
                        }
                        width={15}
                        height={15}
                        alt={
                          dataInfoDisplay?.tokenselected?.first?.ticker || ""
                        }
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
                      <Image
                        src={
                          dataInfoDisplay?.tokenselected?.second?.logo ||
                          "/images/swap/logo-token-default.svg"
                        }
                        width={15}
                        height={15}
                        alt={
                          dataInfoDisplay?.tokenselected?.second?.ticker || ""
                        }
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
                        <span className="text-[24px] font-[400] text-textBlack sm:text-[24px] lg:text-[45px] xl:text-[54px]">
                          {formatNumberWithPrice(
                            TvlPool || "",
                            true,
                          )}
                        </span>
                        <div className="flex items-center gap-[4px]">
                          <Image
                            src="/images/token/change-down.svg"
                            alt=""
                            width={12}
                            height={18}
                          />
                          <span className="text-[14px] font-[500] text-[#F83B28] sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                            0.01%
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
                          $3.4K
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
                        $1.5M
                      </span>
                      <div className="flex items-center gap-[4px]">
                        <Image
                          src="/images/token/change-up.svg"
                          alt=""
                          width={12}
                          height={18}
                        />
                        <span className="text-[14px] font-[500] text-[#45B272] sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                          0.01%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
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
                  href="/swap"
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
                  href="/add"
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
                        <Image
                          src={
                            dataInfoDisplay?.tokenselected?.first?.logo ||
                            "/images/swap/logo-token-default.svg"
                          }
                          width={15}
                          height={15}
                          alt={
                            dataInfoDisplay?.tokenselected?.first?.ticker || ""
                          }
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
                        <Image
                          src={
                            dataInfoDisplay?.tokenselected?.second?.logo ||
                            "/images/swap/logo-token-default.svg"
                          }
                          width={15}
                          height={15}
                          alt={
                            dataInfoDisplay?.tokenselected?.second?.ticker || ""
                          }
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
                          TvlPool || "",
                          true,
                        )}
                      </span>
                      <div className="flex items-center gap-[4px]">
                        <Image
                          src="/images/token/change-down.svg"
                          alt=""
                          width={12}
                          height={18}
                        />
                        <span className="text-[14px] font-[500] text-[#F83B28] sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                          0.01%
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
                        {formatNumberWithPrice(
                          dataInfoDisplay.volume_1d || "",
                          true,
                        )}
                      </span>
                      <div className="flex items-center gap-[4px]">
                        <Image
                          src="/images/token/change-up.svg"
                          alt=""
                          width={12}
                          height={18}
                        />
                        <span className="text-[14px] font-[500] text-[#45B272] sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                          0.01%
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
              <div className="mt-0 flex flex-col gap-[7px] sm:mt-0 lg:mt-[24px] xl:mt-[24px]">
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
                            <Image
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
                            <Image
                              className="absolute right-1/2  rounded-full border border-textBlack"
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
                        <Image
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
                        className="flex items-center gap-[8px] opacity-100 transition transition-all hover:opacity-70 "
                      >
                        <Image
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
          </div>
          <Footer />
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}
