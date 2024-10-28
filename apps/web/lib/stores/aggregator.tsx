import { client, PoolKey, TokenPair } from "chain";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Token, tokens } from "@/tokens";
import { TokenId } from "@proto-kit/library";
import { useObserveBalance } from "./balances";
import BigNumber from "bignumber.js";

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

export interface TransactionQueryResponse {
  data: ComputedTransactionJSON;
  error: boolean;
}

export interface PoolsDataJSON {
  tokenselected?: {
    first: Token,
    second: Token,
  };
  id?: string | number,
  type?: string;
  feeTier?: any,
  tvl?: any,
  apr?: any,
  volume1d?: any,
  volume7d?: any,
}

export interface ComputedPoolsJSON {
  tokenAId: string | number;
  tokenBId: string | number
}

export interface PoolsQueryResponse {
  data: Array<ComputedPoolsJSON>;
  error: boolean;
}

export interface AggregatorState {
  loading: boolean;
  transactions: any;
  pools: Array<PoolsDataJSON>;
  error: boolean;
  loadPools: () => Promise<void>;
  loadTransactions: () => Promise<void>;
}

export const useAggregatorStore = create<AggregatorState, [["zustand/immer", never]]>(
  immer((set) => ({
    loading: Boolean(false),
    pools: [],
    transactions: [],
    error: false,
    async loadPools() {
      set((state) => {
        state.loading = true;
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_HOST}/pools`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await response.json()) as PoolsQueryResponse;
      const newData: Array<PoolsDataJSON> = data.data.map((pool: any, index) => {
        const tokenPair = TokenPair.from(TokenId.from(pool.tokenAId), TokenId.from(pool.tokenBId))
        // const poolKey = PoolKey.fromTokenPair(tokenPair).toBase58()
        const firstToken = tokens[tokenPair.tokenBId.toString()]
        const secondToken = tokens[tokenPair.tokenAId.toString()]
        return {
          id: index + 1, // TODO update id token
          tokenselected: {
            first: {
              ticker: firstToken?.ticker || '',
              name: firstToken?.name || '',
              logo: firstToken?.logo || '',
            },
            second: {
              ticker: secondToken?.ticker || '',
              name: secondToken?.name || '',
              logo: secondToken?.logo || '',
            },
          },
          type: "LPtoken",
          feeTier: null,
          tvl: null,
          apr: null,
          volume1d: null,
          volume7d: null,
        }
      })
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_HOST}/transactions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

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
  const aggregator = useAggregatorStore()
  useEffect(() => {
    aggregator.loadPools();
  }, [])
}

export const usePollTransactions = () => {
  const aggregator = useAggregatorStore();
  useEffect(() => {
    aggregator.loadTransactions();
  }, []);
};

export const useSwapRoutes = () => {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const getRoutes = async (tokenAId: string, tokenBId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_HOST}/routers/?${new URLSearchParams({
        tokenAId,
        tokenBId
      })}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await response.json());
      setLoading(false)
      setRoutes(data?.data?.vector || [])
      setError(data?.error)
    } catch {
      setRoutes([])
    }
  }
  return { routes, loading, error, getRoutes }
};