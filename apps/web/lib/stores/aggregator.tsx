import { useEffect, useState } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Token, tokens } from "@/tokens";
import { generatePriceData } from "../utils";

export interface ComputedTransactionJSON {
  argsFields: string[];
  auxiliaryData?: any[];
  hash?: string;
  isMessage?: boolean;
  argsJSON: string[];
  methodId: string;
  moduleName?: string;
  methodName?: string;
  type?: string;
  token?: {
    first: {
      logo: string;
      name: string;
      symbol: string;
      amount: string;
    };
    second: {
      logo: string;
      name: string;
      symbol: string;
      amount: string;
    };
  };
  address?: string;
  price?: number | string;
  nonce: string;
  sender: string;
  timeStamp?: string;
  signature: {
    r: string;
    s: string;
  };
}

export interface ComputedPoolTransactionJSON {
  hash?: string | number;
  creator?: string;
  eventIndex?: string | number;
  tokenAId: string;
  tokenBId: string;
  tokenAAmount?: string | number;
  tokenBAmount?: string | number;
  directionAB?: boolean;
  type?: string;
  blockHeight?: string | number;
  timestamp?: string | number;
  price?: {
    usd?: string | number;
  };
}

export interface PoolTransactionQueryResponse {
  data: Array<ComputedPoolTransactionJSON>;
  error: boolean;
}

export interface ComputedBlockJSON {
  txs?: {
    status: boolean;
    statusMessage?: string;
    tx: ComputedTransactionJSON;
  }[];
}

export interface ChainState {
  loading: boolean;
  block?: {
    height: string;
  } & ComputedBlockJSON;
  // transactions?: ComputedTransactionJSON[];
  data: any;
  transactions: any;
  error: boolean;
  loadBlock: () => Promise<void>;
  loadTransactions: () => Promise<void>;
}

export interface BlockQueryResponse {
  data: {
    network: {
      unproven?: {
        block: {
          height: string;
        };
      };
    };
    block: ComputedBlockJSON;
  };
}

export interface TokensQueryResponse {
  data: Array<ComputedTokenJSON>;
  error: boolean;
}

export interface TransactionQueryResponse {
  data: ComputedTransactionJSON;
  error: boolean;
}

export interface TokenDataJSON {
  index?: string | number;
  id?: string | number;
  ticker?: string | number;
  logo?: string;
  name?: string;
  price?: string | number;
  volume?: string | number;
  tvl?: string | number;
  fdv?: string | number;
  prices?: any[];
}

export interface ComputedTokenJSON {
  id?: string | number;
  ticker?: string | number;
  name?: string;
  price?: { usd?: string };
  volume?: { usd?: string };
  tvl?: { usd?: string };
  fdv?: { usd?: string };
}

export interface PoolsDataJSON extends ComputedPoolsJSON {
  tokenselected?: {
    first: Token;
    second: Token;
  };
  id?: string | number;
  type?: string;
  feeTier?: any;
  tvl?: any;
  apr?: any;
  volume1d?: any;
  volume7d?: any;
}

export interface ComputedPoolsJSON {
  tokenAId: string;
  tokenBId: string;
  balancesA?: string | number;
  balancesB?: string | number;
  tvl?: string | number;
  apr?: string | number;
  volume_1d?: string | number;
  volume_7d?: string | number;
}

export interface PoolsQueryResponse {
  data: Array<ComputedPoolsJSON>;
  error: boolean;
}

export interface AggregatorState {
  loading: boolean;
  transactions: any;
  pools: Array<PoolsDataJSON>;
  tokens: Array<TokenDataJSON>;
  totalTVL: number | string;
  totalVOL: number | string;
  error: boolean;
  loadTokens: () => Promise<void>;
  loadPools: () => Promise<void>;
  loadTransactions: () => Promise<void>;
}

export const useAggregatorStore = create<
  AggregatorState,
  [["zustand/immer", never]]
>(
  immer((set) => ({
    loading: Boolean(false),
    pools: [],
    transactions: [],
    tokens: [],
    totalTVL: 0,
    totalVOL: 0,
    error: false,
    async loadTokens() {
      set((state) => {
        state.loading = true;
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_APP_HOST}/tokens`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = (await response.json()) as TokensQueryResponse;
      const newData: any = data.data.map(
        (token: ComputedTokenJSON, index): TokenDataJSON => {
          const basePrice = Number(token.price?.usd) || 100;

          const priceData = generatePriceData(basePrice);
          return {
            index: index + 1,
            id: token.id,
            ticker: token.ticker,
            name: token.name,
            price: token.price?.usd,
            volume: token.volume?.usd,
            fdv: token.fdv?.usd,
            tvl: token.tvl?.usd,
            logo: token.id ? tokens[token.id]?.logo : "",
            prices: priceData,
          };
        },
      );
      const result = newData.reduce(
        (
          acc: { totalTVL: any; totalVOL: any },
          item: { tvl: any; volume: any },
        ) => {
          acc.totalTVL += item.tvl || 0;
          acc.totalVOL += item.volume || 0;
          return acc;
        },
        { totalTVL: 0, totalVOL: 0 },
      );
      set((state) => {
        state.loading = false;
        state.tokens = newData;
        state.totalTVL = result.totalTVL;
        state.totalVOL = result.totalVOL;
        state.error = data?.error;
      });
    },
    async loadPools() {
      set((state) => {
        state.loading = true;
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_APP_HOST}/pools`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = (await response.json()) as PoolsQueryResponse;
      const newData: any = data.data.map((pool: any, index) => {
        const firstToken = tokens[pool.tokenAId];
        const secondToken = tokens[pool.tokenBId];
        return {
          ...pool,
          id: index + 1, // TODO update id token
          tokenselected: {
            first: firstToken,
            second: secondToken,
          },
          feeTier: pool?.feeTier || null,
          tvl: pool?.tvl?.usd || null,
          volume1d: pool?.volume_1d?.usd || null,
          volume7d: pool?.volume_7d?.usd || null,
        };
      });
      set((state) => {
        state.loading = false;
        state.pools = newData;
        state.error = data?.error;
      });
    },
    async loadTransactions() {
      set((state) => {
        state.loading = true;
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_APP_HOST}/txs`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = (await response.json()) as TransactionQueryResponse;

      set((state) => {
        state.loading = false;
        state.transactions = data?.data;
        state.error = data?.error;
      });
    },
  })),
);

export const usePollPools = () => {
  const aggregator = useAggregatorStore();
  useEffect(() => {
    aggregator.loadPools();
  }, []);
};

export const usePollTransactions = () => {
  const aggregator = useAggregatorStore();
  useEffect(() => {
    aggregator.loadTransactions();
  }, []);
};

export const useSwapRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const getRoutes = async (tokenAId: string, tokenBId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_APP_HOST}/routers/?${new URLSearchParams(
          {
            tokenAId,
            tokenBId,
          },
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      setLoading(false);
      setRoutes(data?.data?.vector || []);
      setError(data?.error);
    } catch {
      setRoutes([]);
    }
  };
  return { routes, loading, error, getRoutes };
};

export const usePoolInfo = (poolKey: string) => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const getPoolInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_APP_HOST}/pool/info/${poolKey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      setLoading(false);
      setData(data?.data || {});
      setError(data?.error);
    } catch {
      setData({});
    }
  };
  return { data, loading, error, getPoolInfo };
};

export const usePoolTxs = (poolKey: string) => {
  const [data, setData] = useState<Array<ComputedPoolTransactionJSON>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const getPoolTxs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_APP_HOST}/pool/txs/${poolKey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const dataRes = (await response.json()) as PoolTransactionQueryResponse;
      setLoading(false);
      setData(dataRes?.data || []);
      setError(dataRes?.error);
    } catch {
      setData([]);
    }
  };
  return { data, loading, error, getPoolTxs };
};

export const useTokenInfo = (tokenId: string) => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const getTokenInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_APP_HOST}/token/info/${tokenId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      setLoading(false);
      setData(data?.data || {});
      setError(data?.error);
    } catch {
      setData({});
    }
  };
  return { data, loading, error, getTokenInfo };
};

export const useTokenTxs = (tokenId: string) => {
  const [data, setData] = useState<Array<ComputedPoolTransactionJSON>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const getTokenTxs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_APP_HOST}/token/txs/${tokenId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const dataRes = (await response.json()) as PoolTransactionQueryResponse;
      setLoading(false);
      setData(dataRes?.data || []);
      setError(dataRes?.error);
    } catch {
      setData([]);
    }
  };
  return { data, loading, error, getTokenTxs };
};
