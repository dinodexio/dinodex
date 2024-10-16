import {
  convertMethodname,
  formatterInteger,
  passDataTokenByFields,
  truncateAddress,
} from "@/lib/utils";
import { Table } from "../table/table";
import { ComputedTransactionJSON, useChainStore } from "@/lib/stores/chain";
import { MethodIdResolver } from "@proto-kit/module";
import { useEffect, useMemo } from "react";
import { ADDLIQUIDITY, CREATEPOOL, DRIPBUNDLE, SELLPATH } from "@/constants";
import { tokens } from "@/tokens";
import Link from "next/link";

export interface TransactionPanelProps {
  valueSearch: string;
  client: any;
  transactions: ComputedTransactionJSON[];
  loading: boolean;
}

export type PassDataResult = {
  logo: string;
  name: string;
  symbol: string;
  amount: number;
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
      className="text-time"
    >
      <span className="text-time">{`${Math.floor(value)}${unit} ago`}</span>
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
      <div className="type-transaction">
        <span className="type-text">{data?.type}</span>
        <div className="transaction-item">
          <img
            src={data?.token?.first?.logo}
            alt="token"
            width="20"
            height="20"
          />
          <span>{data?.token?.first?.symbol}</span>
        </div>
        for
        <div className="transaction-item">
          <img
            src={data?.token?.second?.logo}
            alt="token"
            width="20"
            height="20"
          />
          <span>{data?.token?.second?.symbol}</span>
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
      return <span>{data?.price || "--"}</span>;
    },
  },
  {
    id: 4,
    title: <span>Token amount</span>,
    key: "token-amount",
    width: 218,
    render: (data: any) => {
      return (
        <div className="token-item">
          <span>{formatterInteger(data?.token?.first?.amount)}</span>
          <img
            src={data?.token?.first?.logo}
            alt="token"
            width="20"
            height="20"
          />
          <span>{data?.token?.first?.symbol}</span>
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
        <div className="token-item">
          <span>${formatterInteger(data?.token?.second?.amount)}</span>
          <img
            src={data?.token?.second?.logo}
            alt="token"
            width="20"
            height="20"
          />
          <span>{data?.token?.second?.symbol}</span>
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

export function TransactionPanel({
  valueSearch,
  client,
  transactions,
  loading,
}: TransactionPanelProps) {
  // Memoize the transaction processing to avoid re-computation on every render
  const processedTransactions = useMemo(() => {
    if (!transactions) return [];

    return transactions
      .filter(
        (item: ComputedTransactionJSON) => item?.methodName !== DRIPBUNDLE,
      )
      .map((item: ComputedTransactionJSON) => {
        if (!client) return;

        const methodIdResolver = client?.resolveOrFail(
          "MethodIdResolver",
          MethodIdResolver,
        );

        const resolvedMethodDetails = methodIdResolver.getMethodNameFromId(
          typeof item?.methodId === "string"
            ? BigInt(item?.methodId)
            : item?.methodId,
        );

        if (!resolvedMethodDetails) {
          console.error("Unable to resolve method details");
          return {
            ...item,
            error: "Unable to resolve method details",
          };
        } else {
          const [moduleName, methodName] = resolvedMethodDetails;
          let passFields = item?.argsFields;
          if (methodName === SELLPATH) {
            passFields = item?.argsFields.filter((field) => field !== "99999");
          }
          const tmpData = passDataTokenByFields(passFields, tokens);
          return {
            ...item,
            moduleName,
            methodName,
            token: tmpData || {},
            address: truncateAddress(item?.sender),
            type: convertMethodname(methodName),
            price: null,
            timeStamp: new Date().toLocaleString(),
          };
        }
      });
  }, [transactions, client]);
  // Filter the transactions based on search value
  const filteredTransactions = useMemo(() => {
    if (!valueSearch) return processedTransactions;

    const lowerValueSearch = valueSearch.toLowerCase();
    return processedTransactions.filter((item: ComputedTransactionJSON) => {
      const tokenFirstSymbol = item?.token?.first?.symbol?.toLowerCase();
      const tokenSecondSymbol = item?.token?.second?.symbol?.toLowerCase();
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
        data={
          filteredTransactions?.filter?.(
            (item: ComputedTransactionJSON) => item?.methodName !== DRIPBUNDLE,
          ) || []
        }
        column={columTableTransaction}
        onClickTr={() => {}}
        classTable={""}
      />
    </>
  );
}
