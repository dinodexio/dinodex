import {
  capitalizeFirstLetter,
  formatNumberWithPrice,
  formatTimeAgo,
  truncateString,
} from "@/lib/utils";
import { Table } from "../table/table";
import styles from "../css/table.module.css";
import { precision } from "../ui/balance";
import { DataTransactionPanel, TransactionPanelProps } from "@/types";
import { SkeletonLoading } from "./SkeletonLoading";

export function PoolTransactionPanel({
  data = [],
  titleA = "TokenA",
  titleB = "TokenB",
  loading
}: TransactionPanelProps) {
  let columnTableTransactionTokenInfo = [
    {
      id: 1,
      title: "Time",
      key: "time-transaction",
      width: 120,
      render: (data: DataTransactionPanel) => {
        return (
          <span className="text-[18px]">
            {formatTimeAgo(data?.timestamp)}
          </span>
        );
      },
    },
    {
      id: 2,
      title: "Type",
      key: "Type-transaction",
      width: 120,
      render: (data: DataTransactionPanel) => {
        return (
          <span
            className={`${data?.action === "sell" ? styles["text-red"] : styles["text-green"]} ${styles["text-action"]} text-[18px]`}
          >
            {capitalizeFirstLetter(data?.action || "")}{" "}
            {truncateString(titleA, 5)}
          </span>
        );
      },
    },
    {
      id: 3,
      title: "$USDT",
      key: "usdt-transaction",
      width: 100,
      render: (data: DataTransactionPanel) => {
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
      id: 4,
      title: loading ? <SkeletonLoading loading={loading} className="w-[98%] h-[20px]" /> : <>{titleA || 'titleA'}</>,
      key: "for-transaction",
      width: 100,
      render: (data: DataTransactionPanel) => {
        return (
          <div className={styles["token-item"]}>
            <span>
              {truncateString(
                formatNumberWithPrice(
                  data.tokenAAmount || 0,
                  false,
                  precision,
                )?.toString(),
                6,
              )}
            </span>
            {/* <Image src={logoA} alt="token" width={20} height={20} />
                        <span>{titleA}</span> */}
          </div>
        );
      },
    },
    {
      id: 5,
      title: loading ? <SkeletonLoading loading={loading} className="w-[98%] h-[20px]" /> : <>{titleB || 'titleB'}</>,
      key: "usd-transaction",
      width: 100,
      render: (data: DataTransactionPanel) => {
        return (
          <div className={styles["token-item"]}>
            <span>
              {truncateString(
                formatNumberWithPrice(
                  data.tokenBAmount || 0,
                  false,
                  precision,
                )?.toString(),
                6,
              )}
            </span>
            {/* <Image src={logoB} alt="token" width={20} height={20} />
                        <span>{titleB}</span> */}
          </div>
        );
      },
    },
    {
      id: 6,
      title: "Wallet",
      key: "wallet-transaction",
      width: 150,
      render: (data: DataTransactionPanel) => {
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
