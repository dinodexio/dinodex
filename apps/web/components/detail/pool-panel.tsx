import { formatLargeNumber, truncateString } from "@/lib/utils";
import { Table } from "../table/table";
import Image from "next/image";
import { DATA_POOL, EMPTY_DATA } from "@/constants";
import styles from "../css/table.module.css";
import { useRouter } from "next/navigation";
import { DataPoolsPanel } from "@/types";
import { ImageCommon } from "../common/ImageCommon";
import BaseTokenTag from "../common/BaseTokenTag";

export interface PoolPanelProps {
  data?: any
  loading?: boolean
}

export function PoolPanel({data,loading}: PoolPanelProps) {
  const router = useRouter();
  let columnTablePoolTokenInfo = [
    {
      id: 1,
      title: "#",
      key: "time-transaction",
      width: 45,
      render: (data: DataPoolsPanel) => {
        return <span>{data?.id}</span>;
      },
    },
    {
      id: 2,
      title: "Pool",
      key: "pool",
      render: (data: DataPoolsPanel) => {
        return (
          <div className={styles["token-info"]}>
          <div className={styles["token-info-logo"]}>
            <div className="relative h-6 w-6 overflow-hidden">
              <ImageCommon
                className="absolute left-1/2 rounded-full"
                src={data?.tokenselected?.first?.logo}
                alt={data?.tokenselected?.first?.name}
                width={24}
                height={24}
              />
            </div>
            <div className="relative h-6 w-6 overflow-hidden">
              <ImageCommon
                className="absolute right-1/2"
                src={data?.tokenselected?.second?.logo}
                alt={data?.tokenselected?.second?.name}
                width={24}
                height={24}
              />
            </div>
          </div>
          <span className={styles["token-name-text"]}>
            {`${truncateString(data?.tokenselected?.first?.ticker,4)}/${truncateString(data?.tokenselected?.second?.ticker,4)}`}
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
      key: "tvl-pool",
      width: 123,
      render: (data: DataPoolsPanel) => {
        return (
          <span className={styles["price-text"]}>{formatLargeNumber(data?.tvl)} {' '} <BaseTokenTag fontSize="0.8em" /></span>
        );
      },
    },
    {
      id: 4,
      title: "APR",
      key: "apr-pool",
      width: 123,
      render: (data: DataPoolsPanel) => {
        return <span>{data?.apr}%</span>;
      },
    },
    {
      id: 5,
      title: "1d vol",
      key: "1d-vol-pool",
      width: 120,
      render: (data: DataPoolsPanel) => {
        return (
          <span className={styles["price-text"]}>
            {formatLargeNumber(data?.volume1d)} {' '} <BaseTokenTag fontSize="0.8em" />
          </span>
        );
      },
    },
    {
      id: 6,
      title: "7d vol",
      key: "wallet-transaction",
      width: 150,
      render: (data: DataPoolsPanel) => {
        return (
          <span className={styles["price-text"]}>
            {formatLargeNumber(data?.volume7d)} {' '} <BaseTokenTag fontSize="0.8em" />
          </span>
        );
      },
    },
  ];
  return (
    <>
      <Table
        data={data}
        column={columnTablePoolTokenInfo}
        onClickTr={(dataPool) => {
          router.push(`/info/pools/${dataPool.poolKey}`);
        }}
        classTable="table-layout"
        loading={loading}
        isHeightFull={false}
      />
    </>
  );
}
