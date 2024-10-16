import { formatLargeNumber } from "@/lib/utils";
import { Table } from "../table/table";
import Image from "next/image";
import { tokens } from "@/tokens";
import { Balances } from "../pool/v2/list-pool";
import { EMPTY_DATA } from "@/constants";
import { useMemo } from "react";

export interface PoolPanelProps {
  balances?: Balances;
  valueSearch: string;
}

let dataPoolToken = [
  {
    id: 1,
    tokenselected: {
      first: {
        logo: "images/swap/logo-token-default.svg",
        name: "ethereum",
        symbol: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        symbol: "WBTC",
      },
    },
    feeTier: 0.03,
    tvl: 193000000,
    apr: 1.23,
    volume1d: 123456,
    volume7d: 500000000,
  },
  {
    id: 2,
    tokenselected: {
      first: {
        logo: "images/swap/logo-token-default.svg",
        name: "ethereum",
        symbol: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        symbol: "WBTC",
      },
    },
    feeTier: 0.03,
    tvl: 193000000,
    apr: 1.23,
    volume1d: 123456,
    volume7d: 500000000,
  },
  {
    id: 3,
    tokenselected: {
      first: {
        logo: "images/swap/logo-token-default.svg",
        name: "ethereum",
        symbol: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        symbol: "WBTC",
      },
    },
    feeTier: 0.03,
    tvl: 193000000,
    apr: 1.23,
    volume1d: 123456,
    volume7d: 500000000,
  },
  {
    id: 4,
    tokenselected: {
      first: {
        logo: "images/swap/logo-token-default.svg",
        name: "ethereum",
        symbol: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        symbol: "WBTC",
      },
    },
    feeTier: 0.03,
    tvl: 193000000,
    apr: 1.23,
    volume1d: 123456,
    volume7d: 500000000,
  },
  {
    id: 5,
    tokenselected: {
      first: {
        logo: "images/swap/logo-token-default.svg",
        name: "ethereum",
        symbol: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        symbol: "WBTC",
      },
    },
    feeTier: 0.03,
    tvl: 193000000,
    apr: 1.23,
    volume1d: 123456,
    volume7d: 500000000,
  },
  {
    id: 6,
    tokenselected: {
      first: {
        logo: "images/swap/logo-token-default.svg",
        name: "ethereum",
        symbol: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        symbol: "WBTC",
      },
    },
    feeTier: 0.03,
    tvl: 193000000,
    apr: 1.23,
    volume1d: 123456,
    volume7d: 500000000,
  },
  {
    id: 7,
    tokenselected: {
      first: {
        logo: "images/swap/logo-token-default.svg",
        name: "ethereum",
        symbol: "ETH",
      },
      second: {
        logo: "images/swap/logo-token-dummy.svg",
        name: "Wrapped Bitcoin",
        symbol: "WBTC",
      },
    },
    feeTier: 0.03,
    tvl: 193000000,
    apr: 1.23,
    volume1d: 123456,
    volume7d: 500000000,
  },
];

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
    title: "Token Names",
    key: "token-name",
    width: 230,
    render: (data: any) => {
      return (
        <div className="token-info">
          <div className="token-info-logo">
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
          <span className="token-name-text">
            {data?.tokenselected?.first?.symbol}
            {/* {data?.tokenselected?.second?.symbol} */}
          </span>
          <div className="fee-tier-text-table">
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
      return <span className="price-text">{formatLargeNumber(data?.tvl)}</span>;
    },
  },
  {
    id: 4,
    title: "APR",
    key: "apr",
    width: 163,
    render: (data: any) => {
      return <span>{data?.apr || EMPTY_DATA}%</span>;
    },
  },
  {
    id: 5,
    title: "1D vol",
    key: "volume1d",
    width: 163,
    render: (data: any) => {
      return (
        <span className="price-text">${formatLargeNumber(data?.volume1d)}</span>
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
        <span className="price-text">{formatLargeNumber(data?.volume7d)}</span>
      );
    },
  },
  {
    id: 7,
    title: "1D vol/TVL",
    key: "volume1d-tvl",
    width: 163,
    render: (data: any) => {
      return <span className="price-text">{EMPTY_DATA}</span>;
    },
  },
];

export function PoolPanel({ balances, valueSearch }: PoolPanelProps) {
  const poolBalances = Object.entries(balances ?? {}).map(
    ([tokenId, balance], index) => {
      const token = tokens[tokenId];
      if (!token || (BigInt(tokenId) > 3n && balance == "0")) return null;
      if (token?.name === "LP Token")
        return {
          id: index,
          type: "LPtoken",
          tokenselected: {
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
          feeTier: null,
          tvl: null,
          apr: null,
          volume1d: null,
          volume7d: null,
        };
      else return null;
    },
  );
  let dataPool: any =
    balances || poolBalances !== null
      ? [...poolBalances.filter((el) => el !== null)]
      : [];

  const filterDataPool = useMemo(() => {
    if (valueSearch) {
      return dataPool.filter((el: any) =>
        el?.tokenselected?.first?.symbol
          ?.toLocaleLowerCase()
          .includes(valueSearch.toLocaleLowerCase()),
      );
    } else {
      return dataPool;
    }
  }, [valueSearch, dataPool]);
  return (
    <>
      <Table
        data={filterDataPool || []}
        column={columTablePool}
        onClickTr={() => {}}
        loading={false}
      />
    </>
  );
}
