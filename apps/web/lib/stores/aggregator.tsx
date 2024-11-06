import { useEffect, useState } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Token, tokens } from "@/tokens";

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
  fdv?: string | number;
}

export interface ComputedTokenJSON {
  id?: string | number;
  ticker?: string | number;
  name?: string;
  price?: { usd?: string }
  volume?: string | number;
  fdv?: string | number;
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
  tokens: Array<TokenDataJSON>
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
      const newData: any = data.data.map((token: ComputedTokenJSON, index): TokenDataJSON => {
        return {
          index: index + 1,
          id: token.id,
          ticker: token.ticker,
          name: token.name,
          price: token.price?.usd,
          volume: token.volume,
          fdv: token.fdv,
          logo: token.id ? tokens[token.id]?.logo : ''
        };
      });
      set((state) => {
        state.loading = false;
        state.tokens = newData;
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
          volume1d: pool?.volume_1d || null,
          volume7d: pool?.volume_7d || null
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
        `http://localhost:3333/routers/?${new URLSearchParams({
          tokenAId,
          tokenBId,
        })}`,
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
