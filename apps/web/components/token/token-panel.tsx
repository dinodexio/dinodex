import React, { useEffect, useMemo } from "react";
import { Table } from "../table/table";
import Image from "next/image";
import { formatNumber, formatterInteger } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { BASE_TOKEN, EMPTY_DATA } from "@/constants";
import styles from "../css/table.module.css";
import { ComputedTokenJSON, useAggregatorStore } from "@/lib/stores/aggregator";
import BigNumber from "bignumber.js";
import ChartLine from "../chartComponents/LineChart";
import { ImageCommon } from "../common/ImageCommon";
import { useTokenStore } from "@/lib/stores/token";

export interface TokenPanelProps {
  valueSearch?: string;
}

function formatNumberPrecisionVol(
  value: string | number,
  isPrice: boolean = false,
) {
  if (!value) return EMPTY_DATA;

  const priceResult = formatNumber(BigNumber(value).toNumber());
  return `${
    priceResult == "<0.01"
      ? isPrice
        ? "< $0.01"
        : priceResult
      : isPrice
        ? `$${priceResult}`
        : priceResult
  }`;
}

let columTableToken = [
  {
    id: 1,
    title: "#",
    key: "numberic",
    width: 57,
    render: (data: any) => {
      return <span>{Number(data?.index) - 1}</span>;
    },
  },
  {
    id: 2,
    title: "Token Name",
    key: "token-name",
    width: 220,
    render: (data: any) => {
      return (
        <div className={styles["token-info"]}>
          <ImageCommon
            src={data?.logo || ""}
            alt={data?.name || ""}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className={styles["token-name-text"]}>
            {data.name
              ? data.name?.length > 8
                ? data?.name?.slice(0, 8) + "..."
                : data?.name
              : ""}
          </span>
          <span className={styles["token-symbol-text"]}>{data?.ticker}</span>
        </div>
      );
    },
  },
  {
    id: 3,
    title: "Price",
    key: "price",
    width: 200,
    render: (data: any) => {
      return (
        <span className={styles["price-text"]}>
          {`${
            Number(data?.price) > 1000000
              ? formatNumberPrecisionVol(
                  Number(Number(data?.price).toFixed(4)),
                  true,
                )
              : formatterInteger(Number(Number(data?.price).toFixed(4)))
          }
                ${BASE_TOKEN}`}
        </span>
      );
    },
  },
  {
    id: 4,
    title: "1 hour",
    key: "change1h",
    width: 140,
    render: (data: any) => {
      return !data?.change1h ? (
        <span>-</span>
      ) : Number(data?.change1h) > 0 ? (
        <span className={`${styles["text-change"]} ${styles["text-green"]}`}>
          <Image
            src="/images/token/change-up.svg"
            alt="arrow-up"
            width={12}
            height={12}
          />
          {data?.change1h}%
        </span>
      ) : (
        <span className={`${styles["text-change"]} ${styles["text-red"]}`}>
          <Image
            src="/images/token/change-down.svg"
            alt="arrow-down"
            width={12}
            height={12}
          />
          {data?.change1h}%
        </span>
      );
    },
  },
  {
    id: 5,
    title: "1 day",
    key: "change1d",
    width: 140,
    render: (data: any) => {
      return !data?.change1d ? (
        <span>-</span>
      ) : Number(data?.change1d) > 0 ? (
        <span className={`${styles["text-change"]} ${styles["text-green"]}`}>
          <Image
            src="/images/token/change-up.svg"
            alt="arrow-up"
            width={12}
            height={12}
          />
          {data?.change1d}%
        </span>
      ) : (
        <span className={`${styles["text-change"]} ${styles["text-red"]}`}>
          <Image
            src="/images/token/change-down.svg"
            alt="arrow-down"
            width={12}
            height={12}
          />
          {data?.change1d}%
        </span>
      );
    },
  },
  {
    id: 6,
    title: "FDV",
    key: "fdv",
    width: 140,
    render: (data: any) => {
      return <span>{formatNumberPrecisionVol(data?.fdv, true)}</span>;
    },
  },
  {
    id: 7,
    title: (
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "end" }}
      >
        <Image
          src="/icon/header-time-transaction-icon.svg"
          alt=""
          width={24}
          height={24}
        />
        Volume
      </div>
    ),
    key: "volume",
    width: 140,
    render: (data: any) => {
      return <span>{formatNumberPrecisionVol(data?.volume, true)}</span>;
    },
  },
  {
    id: 8,
    title: "",
    key: "chart",
    width: 100,
    render: (data: any) => {
      return (
        <span style={{ display: "block", width: 100, height: 24 }}>
          <ChartLine
            tokenData={data?.prices}
            width={100}
            height={40}
            id={`chart-${Number(data?.index)}`}
          />
        </span>
      );
    },
  },
];

const TokenPanelComponent = ({ valueSearch }: TokenPanelProps) => {
  const { data: listTokens } = useTokenStore();
  const router = useRouter();
  const { tokens, loading, loadTokens } = useAggregatorStore();

  const filterDataToken = useMemo(() => {
    let tokensFilter = listTokens
      ? Object.values(listTokens).length > 0 &&
        tokens.map((token: any) => {
          return {
            ...token,
            ticker: listTokens[token.id || 0]?.ticker,
            name: listTokens[token.id || 0]?.name,
            logo: token.id ? listTokens[token.id]?.logo : "",
          };
        })
      : [];
    if (valueSearch) {
      const lowerValueSearch = valueSearch.toLowerCase();
      if (Array.isArray(tokensFilter)) {
        tokensFilter = tokensFilter.filter(
          (item: any) =>
            item?.ticker?.toLowerCase()?.includes(lowerValueSearch) ||
            item?.name?.toLowerCase()?.includes(lowerValueSearch),
        );
      }
    }
    return tokensFilter;
  }, [tokens, valueSearch, listTokens]);

  useEffect(() => {
    loadTokens();
  }, []);

  return (
    <>
      <Table
        data={
          (filterDataToken &&
            filterDataToken?.filter(
              (item: ComputedTokenJSON) => item?.id !== "0",
            )) ||
          []
        }
        column={columTableToken}
        onClickTr={(dataToken) => {
          router.push(`/info/tokens/${dataToken?.ticker}`);
        }}
        loading={loading}
      />
    </>
  );
};

export const TokenPanel = React.memo(TokenPanelComponent);
