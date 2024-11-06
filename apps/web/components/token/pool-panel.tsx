import { convertSmallNumberToPercent, formatLargeNumber, formatNumber, formatPersion } from "@/lib/utils";
import { Table } from "../table/table";
import Image from "next/image";
import styles from '../css/table.module.css'
import { Balances } from "../pool/v2/list-pool";
import { EMPTY_DATA } from "@/constants";
import { useMemo } from "react";
import { useAggregatorStore, usePollPools } from "@/lib/stores/aggregator";
import BigNumber from "bignumber.js";
import { removePrecision } from "@/lib/utils";
import { precision } from "../ui/balance";
import { useRouter } from "next/navigation";
import { PoolKey, TokenPair } from "chain";
import { TokenId } from "@proto-kit/library";

export interface PoolPanelProps {
  balances?: Balances;
  valueSearch?: string;
}

function formatNumberPrecisionVol(value: string) {
  return formatNumber(BigNumber(removePrecision(value, precision)).toNumber())
}

let columTablePool = [
  {
    id: 1,
    title: "#",
    key: "numberic-pool",
    width: 67,
    render: (data: any) => {
      return <span>{data?.id}</span>;
    },
  },
  {
    id: 2,
    title: "Pool",
    key: "token-name",
    width: 230,
    render: (data: any) => {
      return (
        <div className={styles["token-info"]}>
          <div className={styles["token-info-logo"]}>
            <div className="relative h-6 w-6 overflow-hidden">
              <Image
                className="absolute left-1/2"
                src={data?.tokenselected?.first?.logo}
                alt={data?.tokenselected?.first?.name}
                width={24}
                height={24}
              />
            </div>
            <div className="relative h-6 w-6 overflow-hidden">
              <Image
                className="absolute right-1/2"
                src={data?.tokenselected?.second?.logo}
                alt={data?.tokenselected?.second?.name}
                width={24}
                height={24}
              />
            </div>
          </div>
          <span className={styles["token-name-text"]}>
            {`${data?.tokenselected?.first?.ticker}/${data?.tokenselected?.second?.ticker}`}
          </span>
          <div className={styles["fee-tier-text-table"]}>
            {data?.feeTier || EMPTY_DATA}%
          </div>
        </div>
      );
    },
  },
  {
    id: 3,
    title: "TVL",
    key: "tvl",
    width: 163,
    render: (data: any) => {
      return <span className={styles["price-text"]}>{formatNumberPrecisionVol(data?.tvl)}</span>;
    },
  },
  {
    id: 4,
    title: "APR",
    key: "apr",
    width: 163,
    render: (data: any) => {
      return <span>{convertSmallNumberToPercent(data?.apr)}</span>;
    },
  },
  {
    id: 5,
    title: "1D vol",
    key: "volume1d",
    width: 163,
    render: (data: any) => {
      return (
        <span className={styles["price-text"]}>${formatNumberPrecisionVol(data?.volume1d)}</span>
      );
    },
  },
  {
    id: 6,
    title: "7D vol",
    key: "volume7d",
    width: 163,
    render: (data: any) => {
      return (
        <span className={styles["price-text"]}>{formatNumberPrecisionVol(data?.volume7d)}</span>
      );
    },
  },
  {
    id: 7,
    title: "1D vol/TVL",
    key: "volume1d-tvl",
    width: 163,
    render: (data: any) => {
      return <span className={styles["price-text"]}>{formatNumberPrecisionVol(BigNumber(data?.volume1d || 0).dividedBy(data?.tvl).toString())}</span>;
    },
  },
];

export function PoolPanel({ balances, valueSearch }: PoolPanelProps) {
  const router = useRouter();
  const { pools: poolBalances = [], loading } = useAggregatorStore()
  usePollPools()

  const filterDataPool = useMemo(() => {
    if (!valueSearch) return poolBalances;

    const lowerValueSearch = valueSearch.toLowerCase();
    return poolBalances.filter((item: any) => {
      const tokenFirstSymbol = item?.tokenselected?.first?.ticker?.toLowerCase();
      const tokenSecondSymbol = item?.tokenselected?.second?.ticker?.toLowerCase();
      return (
        tokenFirstSymbol?.includes(lowerValueSearch) ||
        tokenSecondSymbol?.includes(lowerValueSearch)
      );
    });
  }, [poolBalances, valueSearch]);
  return (
    <>
      <Table
        data={filterDataPool || []}
        column={columTablePool}
        onClickTr={(dataPool) => {
          console.log('dataPool', dataPool)
          const poolKey = PoolKey.fromTokenPair(
            TokenPair.from(TokenId.from(dataPool?.tokenAId), TokenId.from(dataPool?.tokenBId)),
          ).toBase58();
          console.log('poolKey', poolKey)
          router.push(`/info/pools/${poolKey}`);
        }}
        loading={loading}
      />
    </>
  );
}
