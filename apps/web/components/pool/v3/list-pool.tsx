import { useState } from "react";
import "../../style.css";
import Image from "next/image";
import Link from "next/link";
import { LIST_STATUS } from "@/constants";
import { Balance } from "../../ui/balance";
import { USDBalance } from "../../ui/usd-balance";
import { useTokenStore } from "@/lib/stores/token";

export interface Balances {
  [tokenId: string]: string | undefined;
}
export interface ListPoolProps {
  balances?: Balances;
}

let dataFakeListPool = [
  {
    tokenSelectedPool: {
      first: {
        name: "Ethereum",
        logo: "images/swap/logo-token-default.svg",
        symbol: "ETH",
      },
      second: {
        name: "Wrapped Bitcoin",
        logo: "images/swap/logo-token-dummy.svg",
        symbol: "WBTC",
      },
    },
    feeTierValue: 1,
    valueMinPrice: {
      first: 0.01,
      second: 0,
    },
    status_pool: 1,
  },
  {
    tokenSelectedPool: {
      first: {
        name: "Toncoin",
        logo: "images/swap/logo-token-default.svg",
        symbol: "TON",
      },
      second: {
        name: "Wrapped Bitcoin",
        logo: "images/swap/logo-token-dummy.svg",
        symbol: "WBTC",
      },
    },
    feeTierValue: 1,
    valueMinPrice: {
      first: 0.01,
      second: 0,
    },
    status_pool: 1,
  },
  {
    tokenSelectedPool: {
      first: {
        name: "Solana",
        logo: "images/swap/logo-token-default.svg",
        symbol: "SOL",
      },
      second: {
        name: "Tether",
        logo: "images/swap/logo-token-dummy.svg",
        symbol: "USDT",
      },
    },
    feeTierValue: 0.05,
    valueMinPrice: {
      first: 0.0001,
      second: 0.015,
    },
    status_pool: 1,
  },
];

export function ListPool({ balances }: ListPoolProps) {
  const { data: tokens } = useTokenStore();
  const [showFullListPool, setShowFullListPool] = useState(true);
  const poolBalances = Object.entries(balances ?? {}).map(
    ([tokenId, balance]) => {
      const token = tokens[tokenId];
      if (!token || (BigInt(tokenId) > BigInt(3) && balance == "0"))
        return null;
      if (token?.name === "LP Token")
        return {
          ...token,
          balance: balance ?? "0",
          type: "LPtoken",
          tokenSelectedPool: {
            first: {
              name: token.name,
              logo: token.logo,
              symbol: token.ticker,
            },
            second: {
              name: token.name,
              logo: token.logo,
              symbol: token.ticker,
            },
          },
          feeTierValue: 1,
          valueMinPrice: {
            first: 0.01,
            second: 0,
          },
          status_pool: 0,
        };
      else return null;
    },
  );
  let dataPool: any =
    balances || poolBalances !== null
      ? [...poolBalances.filter((el) => el !== null), ...dataFakeListPool]
      : dataFakeListPool;

  return (
    <>
      <div className="flex items-center justify-between pr-0 lg:pr-4 xl:pr-4">
        <span className="swap-text">Pool</span>
        <div className="relative">
          <div className="button-open-popup flex h-[37px] w-max cursor-pointer items-center justify-center rounded-[10px] bg-white px-[21px] py-[6px] text-[20px] font-[400] leading-none text-black">
            + New Position
          </div>
          <div className="popup-container absolute right-0 flex h-[120px] w-[280px] flex-col items-start justify-center gap-[7px] rounded-[10px] border-[1px] border-black bg-white px-[9px] pb-[11px] pt-[10px]">
            <Link
              href={"/pool/join"}
              className="flex h-[46px] w-full cursor-pointer items-center justify-center rounded-[10px] border-[1px] border-black text-[20px] font-[400] leading-none text-black"
            >
              Join Pool
            </Link>
            <Link
              href={"/pool/create"}
              className="flex h-[46px] w-full cursor-pointer items-center justify-center rounded-[10px] border-[1px] border-black text-[20px] font-[400] leading-none text-black"
            >
              Create Pool
            </Link>
          </div>
        </div>
      </div>
      <div className="relative mt-[29px] pb-[12px] pl-0 pr-0 pt-[23px] lg:pl-[26px] lg:pr-[26px] xl:pl-[26px] xl:pr-[26px]">
        {dataPool && dataPool?.length <= 0 ? null : (
          <span
            className="absolute right-0 top-[-21px] cursor-pointer text-[20px] font-[400] leading-none text-black underline lg:right-[29px] xl:right-[29px]"
            onClick={() => setShowFullListPool(!showFullListPool)}
          >
            {showFullListPool ? "Hide" : "Show"} closed positions
          </span>
        )}
        <div className="h-max w-full rounded-[10px] border-[2px] border-black bg-white px-[12px] py-[11px]">
          {dataPool && dataPool?.length <= 0 ? (
            <div className="flex h-[193px] items-center justify-center">
              <span className="text-[20px] font-[100] italic leading-none text-black opacity-[0.3]">
                Your active liquidity positions will appear here.
              </span>
            </div>
          ) : (
            <div
              className="active-pool-info flex max-h-[266px] flex-col gap-[8px] overflow-y-scroll"
              style={{ height: showFullListPool ? "" : "max-content" }}
            >
              {showFullListPool
                ? dataPool?.map((item: any, index: string) => (
                    <div
                      className={`flex h-[101px] w-full items-center justify-center rounded-[9.712px] border-[1.942px] border-black bg-white px-[12px] py-[18px] ${
                        "item-status-" + LIST_STATUS[item?.status_pool]?.value
                      }`}
                      key={index}
                    >
                      <div className="flex flex-1 flex-col gap-[5px]">
                        <div className="flex items-center gap-[7px]">
                          <div className="flex items-center">
                            <Image
                              src={
                                item?.type === "LPtoken"
                                  ? item?.tokenSelectedPool?.first?.logo
                                  : "/" + item?.tokenSelectedPool?.first?.logo
                              }
                              width={21}
                              height={21}
                              alt=""
                            />
                            {item?.type !== "LPtoken" && (
                              <Image
                                src={
                                  "/" + item?.tokenSelectedPool?.second?.logo
                                }
                                width={21}
                                height={21}
                                alt=""
                                style={{ marginLeft: "-11px" }}
                              />
                            )}
                          </div>
                          <span className="text-[20px] font-[500] leading-none text-black opacity-75">
                            {item?.tokenSelectedPool.first.symbol}
                            {item?.type !== "LPtoken" && "/"}
                            {item?.type !== "LPtoken" &&
                              item?.tokenSelectedPool.second.symbol}
                          </span>
                          <div className="text-[15px] font-[400] italic leading-none text-black opacity-30">
                            {item?.type !== "LPtoken" ? (
                              "1%"
                            ) : (
                              <>
                                <Balance balance={item?.balance} />
                                <USDBalance balance={undefined} />
                              </>
                            )}
                          </div>
                        </div>
                        <span className="text-[15px] font-[400] italic leading-none text-black opacity-30">
                          {item?.type === "LPtoken" ? (
                            <strong>
                              {item?.tokenSelectedPool?.first?.name}
                            </strong>
                          ) : (
                            <>
                              Min:{" "}
                              <strong>
                                {item?.valueMinPrice.first > 0.001
                                  ? item?.valueMinPrice.first
                                  : "< 0.001"}{" "}
                                {item?.tokenSelectedPool.first.symbol} per{" "}
                                {item?.tokenSelectedPool.second.symbol}
                              </strong>{" "}
                              - Max:{" "}
                              <strong>
                                {item?.valueMinPrice.second > 0.001
                                  ? item?.valueMinPrice.second
                                  : "< 0.001"}{" "}
                                {item?.tokenSelectedPool.first.symbol} per{" "}
                                {item?.tokenSelectedPool.second.symbol}
                              </strong>
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-[7px]">
                        <span className="text-[20px] font-[500] leading-none text-black opacity-75">
                          {LIST_STATUS[item?.status_pool]?.label}
                        </span>
                        <div
                          className={`h-[21.572px] w-[21.572px] rounded-[842.639px] border-[0.59px] border-black ${
                            "status-" + LIST_STATUS[item?.status_pool]?.value
                          }`}
                        ></div>
                      </div>
                    </div>
                  ))
                : dataPool.slice(0, 1).map((item: any, index: string) => (
                    <div
                      className={`flex h-[101px] w-full items-center justify-center rounded-[9.712px] border-[1.942px] border-black bg-white px-[12px] py-[18px] ${
                        "item-status-" + LIST_STATUS[item?.status_pool]?.value
                      }`}
                      key={index}
                    >
                      <div className="flex flex-1 flex-col gap-[5px]">
                        <div className="flex items-center gap-[7px]">
                          <div className="flex items-center">
                            <Image
                              src={
                                item?.type === "LPtoken"
                                  ? item?.tokenSelectedPool.first.logo
                                  : "/" + item?.tokenSelectedPool.first.logo
                              }
                              width={21}
                              height={21}
                              alt=""
                            />
                            {item?.type !== "LPtoken" && (
                              <Image
                                src={"/" + item?.tokenSelectedPool.second.logo}
                                width={21}
                                height={21}
                                alt=""
                                style={{ marginLeft: "-11px" }}
                              />
                            )}
                          </div>
                          <span className="text-[20px] font-[500] leading-none text-black opacity-75">
                            {item?.tokenSelectedPool.first.symbol}{" "}
                            {item?.type !== "LPtoken" ? "/" : ""}
                            {item?.type !== "LPtoken" &&
                              item?.tokenSelectedPool.second.symbol}
                          </span>
                          <div className="text-[15px] font-[400] italic leading-none text-black opacity-30">
                            {item?.type !== "LPtoken" ? (
                              "1%"
                            ) : (
                              <>
                                <Balance balance={item?.balance} />
                                <USDBalance balance={undefined} />
                              </>
                            )}
                          </div>
                        </div>
                        <span className="text-[15px] font-[400] italic leading-none text-black opacity-30">
                          {item?.type === "LPtoken" ? (
                            <strong>
                              {item?.tokenSelectedPool?.first?.name}
                            </strong>
                          ) : (
                            <>
                              {" "}
                              Min:{" "}
                              <strong>
                                {item?.valueMinPrice.first > 0.001
                                  ? item?.valueMinPrice.first
                                  : "< 0.001"}{" "}
                                {item?.tokenSelectedPool.first.symbol} per{" "}
                                {item?.tokenSelectedPool.second.symbol}
                              </strong>{" "}
                              - Max:{" "}
                              <strong>
                                {item?.valueMinPrice.second > 0.001
                                  ? item?.valueMinPrice.second
                                  : "< 0.001"}{" "}
                                {item?.tokenSelectedPool.first.symbol} per{" "}
                                {item?.tokenSelectedPool.second.symbol}
                              </strong>
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-[7px]">
                        <span className="text-[20px] font-[500] leading-none text-black opacity-75">
                          {LIST_STATUS[item?.status_pool]?.label}
                        </span>
                        <div
                          className={`h-[21.572px] w-[21.572px] rounded-[842.639px] border-[0.59px] border-black ${
                            "status-" + LIST_STATUS[item?.status_pool]?.value
                          }`}
                        ></div>{" "}
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
