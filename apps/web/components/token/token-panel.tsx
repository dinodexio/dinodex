import React, { useEffect, useMemo } from "react";
import { Table } from "../table/table";
import Image from "next/image";
import { formatNumber, formatterInteger } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { EMPTY_DATA } from "@/constants";
import styles from "../css/table.module.css";
import { useAggregatorStore } from "@/lib/stores/aggregator";
import BigNumber from "bignumber.js";
import ChartLine from "../chartComponents/LineChart";

export interface TokenPanelProps {
  valueSearch?: string;
}

function formatNumberPrecisionVol(value: string | number, isPrice: boolean = false) {
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
      return <span>{data?.index}</span>;
    },
  },
  {
    id: 2,
    title: "Token Name",
    key: "token-name",
    width: 230,
    render: (data: any) => {
      return (
        <div className={styles["token-info"]}>
          <Image
            src={data?.logo || ""}
            alt={data?.name || ""}
            width={24}
            height={24}
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
    width: 150,
    render: (data: any) => {
      return (
        <span className={styles["price-text"]}>
          $
          {Number(data?.price) > 1000000
            ? formatNumberPrecisionVol(Number(Number(data?.price).toFixed(4)), true)
            : formatterInteger(Number(Number(data?.price).toFixed(4)))}
        </span>
      );
    },
  },
  {
    id: 4,
    title: "1 hour",
    key: "change1h",
    width: 150,
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
    width: 150,
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
    width: 150,
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
    width: 150,
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
          <ChartLine tokenData={data?.prices} width={100} height={40} id={`chart-${data.index}`} />
        </span>
      );
    },
  },
];

const TokenPanelComponent = ({ valueSearch }: TokenPanelProps) => {
  const router = useRouter();
  const { tokens,loading,loadTokens } = useAggregatorStore();


  const filterDataToken = useMemo(() => {
    let tokensFilter = tokens;
    if (valueSearch) {
      const lowerValueSearch = valueSearch.toLowerCase();
      tokensFilter = tokens.filter(
        (item: any) =>
          item?.ticker?.toLowerCase()?.includes(lowerValueSearch) ||
          item?.name?.toLowerCase()?.includes(lowerValueSearch),
      );
    }
    return tokensFilter;
  }, [tokens, valueSearch]);

  useEffect(() => {
    loadTokens();
  }, []);

  return (
    <>
      <Table
        data={filterDataToken}
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
