import {
  capitalizeFirstLetter,
  formatNumberWithPrice,
  formatTimeAgo,
  truncateString,
} from "@/lib/utils";
import { Table } from "../table/table";
import Image from "next/image";
import styles from "../css/table.module.css";
import { precision } from "../ui/balance";
import { DataTokenTransactionPanel, TokenTransactionPanelProps } from "@/types";
import { SkeletonLoading } from "./SkeletonLoading";


export function TransactionPanel({
  data = [],
  titleToken = "",
  loading
}: TokenTransactionPanelProps) {
  let columnTableTransactionTokenInfo = [
    {
      id: 1,
      title: "Time",
      key: "time-transaction",
      width: 140,
      render: (data: DataTokenTransactionPanel) => {
        return <span>{formatTimeAgo(data?.timestamp)}</span>;
      },
    },
    {
      id: 2,
      title: "Type",
      key: "Type-transaction",
      width: 90,
      render: (data: DataTokenTransactionPanel) => {
        return (
          <span
            className={`${data?.action === "sell" ? styles["text-red"] : styles["text-green"]} ${styles["text-action"]}`}
          >
            {capitalizeFirstLetter(data?.action || "")}{" "}
          </span>
        );
      },
    },
    {
      id: 3,
      title: loading ? <SkeletonLoading loading={loading} className="w-[98%] h-[20px]" /> : `$${titleToken || "Token"}`,
      key: "usdt-transaction",
      width: 120,
      render: (data: DataTokenTransactionPanel) => {
        return (
          <span>
            {truncateString(
              formatNumberWithPrice(
                data?.tokenAmount || 0,
                false,
                precision,
              )?.toString(),
              6,
            )}
          </span>
        );
      },
    },
    {
      id: 4,
      title: "For",
      key: "for-transaction",
      width: 145,
      render: (data: DataTokenTransactionPanel) => {
        return (
          <div className={styles["token-item"]}>
            <span>
              {formatNumberWithPrice(
                data.tokenCounterpartAmount || 0,
                false,
                precision,
              )}
            </span>
            <Image
              src={data.logoCounterpart || ""}
              alt="token"
              width={20}
              height={20}
            />
            <span>{truncateString(data?.tickerCounterpart, 5)}</span>
          </div>
        );
      },
    },
    {
      id: 5,
      title: "USD",
      key: "usd-transaction",
      width: 120,
      render: (data: DataTokenTransactionPanel) => {
        return (
          <span>
            {truncateString(
              formatNumberWithPrice(data?.price || 0)?.toString(),
              6,
            )}
          </span>
        );
      },
    },
    {
      id: 6,
      title: "Wallet",
      key: "wallet-transaction",
      width: 150,
      render: (data: DataTokenTransactionPanel) => {
        const address = data?.creator || "";
        return (
          <span>
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        );
      },
    },
  ];
  return (
    <>
      <Table
        data={data}
        column={columnTableTransactionTokenInfo}
        onClickTr={() => {}}
        classTable="table-layout"
        loading={loading}
      />
    </>
  );
}
