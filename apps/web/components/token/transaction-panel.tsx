import {
  convertMethodname,
  formatNumber,
  truncateAddress,
  truncateString,
} from "@/lib/utils";
import styles from "../css/table.module.css";
import { Table } from "../table/table";
import { ComputedTransactionJSON, useChainStore } from "@/lib/stores/chain";
import React, { useMemo } from "react";
import {
  ADDLIQUIDITY,
  BLOCK_TIME,
  CREATEPOOL,
  EMPTY_DATA,
  REMOVELIQUIDITY,
  SELLPATH
} from "@/constants";
import { tokens } from "@/tokens";
import Link from "next/link";
import {
  useAggregatorStore,
  usePollTransactions,
} from "@/lib/stores/aggregator";
import Image from "next/image";
import BigNumber from "bignumber.js";
import { formatBigNumber, precision } from "../ui/balance";

export interface TransactionPanelProps {
  valueSearch: string;
  client?: any;
  loading?: boolean;
}

export type PassDataResult = {
  logo: string;
  name: string;
  ticker: string;
  amount: number | string | BigNumber;
};

export type PassData = {
  first: PassDataResult;
  second: PassDataResult;
};

export type Transaction = {
  id: number;
  timeStamp: string;
  token: PassData;
  price: number;
  address: string;
};

// Helper function for rendering time link
const generateTimeLink = (linkScan: string, value: number, unit: string) => {
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={linkScan}
      className={styles["text-time"]}
    >
      <span
        className={styles["text-time"]}
      >{`${Math.floor(value)}${unit} ago`}</span>
    </Link>
  );
};

let columTableTransaction = [
  {
    id: 1,
    title: "Time",
    key: "time",
    width: 118,
    render: (data: any) => {
      const time = new Date(data?.timeStamp).getTime();
      const now = new Date().getTime();
      const diff = now - time; // difference in milliseconds

      // const convertUtil = (value: number, unit: string) => {
      //   return `${Math.floor(value)}${unit} ago`;
      // };

      const linkScan = `https://minascan.io/mainnet/account/${data?.hash}/txs}`;

      if (diff < 60 * 1000) {
        // Less than 60 seconds
        return generateTimeLink(linkScan, diff / 1000, "s");
      } else if (diff < 60 * 60 * 1000) {
        // Less than 60 minutes
        return generateTimeLink(linkScan, diff / (60 * 1000), "m");
      } else if (diff < 24 * 60 * 60 * 1000) {
        // Less than 24 hours
        return generateTimeLink(linkScan, diff / (60 * 60 * 1000), "h");
      } else if (diff < 7 * 24 * 60 * 60 * 1000) {
        // Less than 7 days
        return generateTimeLink(linkScan, diff / (24 * 60 * 60 * 1000), "d");
      } else if (diff < 30 * 24 * 60 * 60 * 1000) {
        // Less than 30 days
        return generateTimeLink(
          linkScan,
          diff / (7 * 24 * 60 * 60 * 1000),
          "w",
        );
      } else if (diff < 365 * 24 * 60 * 60 * 1000) {
        // Less than 1 year
        return generateTimeLink(
          linkScan,
          diff / (30 * 24 * 60 * 60 * 1000),
          "M",
        );
      } else {
        return generateTimeLink(
          linkScan,
          diff / (365 * 24 * 60 * 60 * 1000),
          "Y",
        );
      }
    },
  },

  {
    id: 2,
    title: <span>Type</span>,
    key: "type",
    width: 273,
    render: (data: any) => (
      <div className={styles["type-transaction"]}>
        <span className={styles["type-text"]}>
          {convertMethodname(data?.type)}
        </span>
        <div className={styles["transaction-item"]}>
          <Image
            src={data?.token?.first?.logo || "/icon/empty-token.svg"}
            alt="token"
            width="20"
            height="20"
          />
          <span>{truncateString(data?.token?.first?.ticker, 4)}</span>
        </div>
        for
        <div className={styles["transaction-item"]}>
          <Image
            src={data?.token?.second?.logo || "/icon/empty-token.svg"}
            alt="token"
            width="20"
            height="20"
          />
          <span>
            {truncateString(data?.token?.second?.ticker, 4) || EMPTY_DATA}
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: <span>USD</span>,
    key: "usd",
    width: 143,
    render: (data: any) => {
      return <span>${data?.priceusd}</span>;
    },
  },
  {
    id: 4,
    title: <span>Token amount</span>,
    key: "token-amount",
    width: 218,
    render: (data: any) => {
      return (
        <div className={styles["token-item"]}>
          <span>{formatNumber(data?.token?.first?.amount)}</span>
          <Image
            src={data?.token?.first?.logo || "/icon/empty-token.svg"}
            alt="token"
            width="20"
            height="20"
          />
          <span>{truncateString(data?.token?.first?.ticker, 4)}</span>
        </div>
      );
    },
  },
  {
    id: 5,
    title: <span>Token amount</span>,
    key: "token-amount",
    width: 218,
    render: (data: any) => {
      return (
        <div className={styles["token-item"]}>
          <span>{formatNumber(data?.token?.second?.amount)}</span>
          <Image
            src={data?.token?.second?.logo || "/icon/empty-token.svg"}
            alt="token"
            width="20"
            height="20"
          />
          <span>{truncateString(data?.token?.second?.ticker, 4)}</span>
        </div>
      );
    },
  },
  {
    id: 6,
    title: <span>Wallet</span>,
    key: "wallet",
    width: 168,
    render: (data: any) => {
      return <span>{data?.address}</span>;
    },
  },
];

const TransactionPanelComponent = ({ valueSearch }: TransactionPanelProps) => {
  const { transactions, loading } = useAggregatorStore();
  usePollTransactions();
  // Memoize the transaction processing to avoid re-computation on every render
  const processedTransactions = useMemo(() => {
    if (!transactions) return [];

    return transactions?.filter?.((el: any) => el?.data !== null)?.map((item: any) => {
      let tokenData: any = {};
      if (
        item.type === ADDLIQUIDITY ||
        item.type === CREATEPOOL ||
        item.type === REMOVELIQUIDITY
      ) {
        tokenData = {
          first: {
            ...tokens[item.data.tokenA.id],
            amount: formatBigNumber(item?.data?.tokenA?.amount),
          },
          second: {
            ...tokens[item.data.tokenB.id],
            amount: formatBigNumber(item?.data?.tokenB?.amount),
          },
        };
      } else if (item.type === SELLPATH) {
        tokenData = {
          first: {
            ...tokens[item.data.from.tokenId],
            amount: formatBigNumber(item?.data?.from?.amount),
          },
          second: {
            ...tokens[item.data.to.tokenId],
            amount: formatBigNumber(item?.data?.to?.amount),
          },
        };
      }
      return {
        ...item,
        token: tokenData,
        address: truncateAddress(item?.sender),
        priceusd: formatNumber(tokenData?.second?.amount?.toString()),
      };
    });
  }, [transactions]);
  // Filter the transactions based on search value
  const filteredTransactions = useMemo(() => {
    if (!valueSearch) return processedTransactions;

    const lowerValueSearch = valueSearch.toLowerCase();
    return processedTransactions.filter((item: any) => {
      const tokenFirstSymbol = item?.token?.first?.ticker?.toLowerCase();
      const tokenSecondSymbol = item?.token?.second?.ticker?.toLowerCase();
      return (
        tokenFirstSymbol?.includes(lowerValueSearch) ||
        tokenSecondSymbol?.includes(lowerValueSearch)
      );
    });
  }, [processedTransactions, valueSearch]);
  return (
    <>
      <Table
        loading={loading}
        data={filteredTransactions}
        column={useMemo(() => columTableTransaction, [filteredTransactions])}
        onClickTr={() => { }}
        classTable={""}
      />
    </>
  );
}

export const TransactionPanel = React.memo(TransactionPanelComponent);