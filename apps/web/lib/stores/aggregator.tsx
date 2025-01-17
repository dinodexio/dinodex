import { useEffect, useState } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Token } from "@/tokens";
import { generatePriceData, removePrecision } from "../utils";
import { ComputedTransactionJSON, LeaderboardData } from "@/types";
import BigNumber from "bignumber.js";
import { precision } from "@/components/ui/balance";
import { set } from "lodash";

export interface ComputedPoolTransactionJSON {
  hash?: string | number;
  creator?: string;
  eventIndex?: string | number;
  tokenAId: string;
  tokenBId: string;
  tokenAAmount?: string | number;
  tokenAPrice?: string | number;
  tokenBAmount?: string | number;
  tokenBPrice?: string | number;
  directionAB?: boolean;
  type?: string;
  blockHeight?: string | number;
  timestamp?: string | number;
  price?: {
    usd?: string | number;
  };
  createAt?: string;
}

export interface PoolTransactionQueryResponse {
  data: Array<ComputedPoolTransactionJSON>;
  error: boolean;
}

export interface PoolTransactionInfoQueryResponse {
  data: {
    poolActions?: Array<PoolsInfoJSON>;
  };
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
  data?: {
    poolActions?: ComputedTransactionJSON;
  };
  error: boolean;
}

export interface TokenDataJSON {
  index?: string | number;
  id?: string | number;
  ticker?: string | number;
  logo?: string;
  name?: string;
  price?: string | number;
  prices?: any[];
}

export interface ComputedTokenJSON {
  id?: string | number;
  ticker?: string | number;
  name?: string;
  logo?: string;
  price?: { usd?: string };
  volume?: { usd?: string };
  tvl?: { usd?: string };
  fdv?: { usd?: string };
}

export interface ComputedTokenInfoJSON {
  tokenId?: string | number;
  price?: string | number;
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

export interface BalanceDataJSON {
  address?: string;
  amount?: string | number;
  tokenId?: string | number;
  waitForUpdate?: boolean;
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
  blockHeight?: number;
  createAt?: string;
  path?: string[];
  poolKey?: string;
  tokenAAmount?: string;
  tokenBAmount?: string;
  updateBlockHeight?: number;
  updatedAt?: string;
}

export interface PoolsInfoJSON {
  blockHeight: number;
  createAt: string;
  creator: string;
  directionAB: boolean;
  eventIndex: number;
  hash: string;
  poolKey: string;
  tokenAAmount: string;
  tokenAId: string;
  tokenBAmount: string;
  tokenBId: string;
  type: string;

  //before update
  tokenAPrice?: string | number;
  tokenBPrice?: string | number;
  tvl?: string | number;
  apr?: string | number;
  volume_1d?: string | number;
  volume_7d?: string | number;
  price?: string | number;
}

export interface PoolsQueryResponse {
  data: Array<ComputedPoolsJSON>;
  error: boolean;
}

export interface PoolsInfoQueryResponse {
  data: {
    pools: Array<PoolsInfoJSON>;
  };
  error: boolean;
}

export interface tokensQueryResponse {
  data: {
    tokens: Array<ComputedTokenInfoJSON>;
  };
  error: boolean;
}

export interface PoolsInfoDetailQueryResponse {
  data: {
    pool: Array<PoolsInfoJSON>;
  };
  error: boolean;
}

export interface GetTvlResponse {
  data: {
    tokens?: Array<ComputedTokenInfoJSON>;
    pools?: Array<{
      tokenAAmount: number | string;
      tokenAId: number | string;
      tokenBAmount: number | string;
      tokenBId: number | string;
    }>;
  };
  error?: string;
}

export interface AggregatorState {
  loading: boolean;
  transactions: any;
  balances: Array<BalanceDataJSON>;
  pools: Array<PoolsDataJSON>;
  tokens: Array<TokenDataJSON>;
  totalTVL: number | string;
  totalVOL: number | string;
  error: boolean;
  loadBalances: (address: string) => Promise<void>;
  loadTokens: () => Promise<void>;
  loadPools: () => Promise<void>;
  loadTransactions: () => Promise<void>;
  getTVL: () => Promise<void>;
}

export const useAggregatorStore = create<
  AggregatorState,
  [["zustand/immer", never]]
>(
  immer((set) => ({
    loading: Boolean(false),
    balances: [],
    pools: [],
    transactions: [],
    tokens: [],
    totalTVL: 0,
    totalVOL: 0,
    error: false,
    async loadBalances(address: string) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROTOKIT_PROCESSOR_GRAPHQL_URL}`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
           query loadBalances {
             balances(
                  where: {address: {equals: "${address}"}},
                  take: 50
                ) {
                  address
                  amount
                  tokenId
                  waitForUpdate
                }
           }
            `,
          }),
        },
      );
      const data: { data: { balances: BalanceDataJSON[] } } =
        await response.json();
      set((state) => {
        state.balances = data.data.balances;
      });
    },
    async loadTokens() {
      set((state) => {
        state.loading = true;
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROTOKIT_PROCESSOR_GRAPHQL_URL}`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query loadTokensInfo {
                tokens(skip: 0, take: 50) {
                  price
                  tokenId
                }
              }
            `,
          }),
        },
      );

      const data = (await response.json()) as tokensQueryResponse;

      const newData: any = data.data.tokens
        .map((token: ComputedTokenInfoJSON, index): TokenDataJSON => {
          const basePrice = Number(token.price) || 100;

          const priceData = generatePriceData(basePrice);
          return {
            index: index + 1,
            id: token.tokenId,
            // ticker: tokens[token.tokenId || 0]?.ticker,
            // name: tokens[token.tokenId || 0]?.name,
            // logo: token.tokenId ? tokens[token.tokenId]?.logo : "",
            price: token.price,
            prices: priceData,
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
        `${process.env.NEXT_PUBLIC_PROTOKIT_PROCESSOR_GRAPHQL_URL}`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query loadPools {
                pools(skip: 0, take: 50, orderBy: {blockHeight: desc}) {
                  createAt
                  poolKey
                  tokenAAmount
                  tokenAId
                  tokenBAmount
                  tokenBId
                  updatedAt
                }
              }
            `,
          }),
        },
      );

      const data = (await response.json()) as PoolsInfoQueryResponse;
      const newData: any = data?.data?.pools?.map?.((pool: any, index) => {
        // const firstToken = tokens[pool.tokenAId];
        // const secondToken = tokens[pool.tokenBId];
        return {
          ...pool,
          id: index + 1, // TODO update id token
          // tokenselected: {
          //   first: firstToken,
          //   second: secondToken,
          // },
          feeTier: null,
          tvl: null,
          volume1d: null,
          volume7d: null,
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
        `${process.env.NEXT_PUBLIC_PROTOKIT_PROCESSOR_GRAPHQL_URL}`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query loadTransactions {
                poolActions(
                where: {status: {equals: true}}
                orderBy: {blockHeight: desc}, skip: 0, take: 50) {
                  blockHeight
                  createAt
                  creator
                  directionAB
                  eventIndex
                  hash
                  poolKey
                  tokenAAmount
                  tokenAId
                  tokenBAmount
                  tokenBId
                  tokenAPrice
                  tokenBPrice
                  type
                }
              }
            `,
          }),
        },
      );

      const data = (await response.json()) as TransactionQueryResponse;

      set((state) => {
        state.loading = false;
        state.transactions = data?.data?.poolActions;
        state.error = data?.error;
      });
    },

    async getTVL() {
      set((state) => {
        state.loading = true;
      });
      const responseTokens = await fetch(
        `${process.env.NEXT_PUBLIC_PROTOKIT_PROCESSOR_GRAPHQL_URL}`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query loadCalculationTVL {
                tokens {
                  price
                  tokenId
                }
                pools(orderBy: {blockHeight: desc}) {
                  tokenAAmount
                  tokenAId
                  tokenBAmount
                  tokenBId
                }
              }
            `,
          }),
        },
      );
      const dataResponse = (await responseTokens.json()) as GetTvlResponse;

      let dataTokens = dataResponse.data?.tokens || [];
      let dataPools = dataResponse.data?.pools || [];

      const result = dataPools.reduce((acc, pool) => {
        let priceTokenA =
          dataTokens.find((token) => token.tokenId === pool?.tokenAId)?.price ||
          0;
        let priceTokenB =
          dataTokens.find((token) => token.tokenId === pool?.tokenBId)?.price ||
          0;
        let TvlTokenA = BigNumber(pool?.tokenAAmount || 0)
          .times(priceTokenA)
          .div(10 ** precision)
          .toNumber();
        let TvlTokenB = BigNumber(pool?.tokenBAmount || 0)
          .times(priceTokenB)
          .div(10 ** precision)
          .toNumber();
        return acc + (TvlTokenA + TvlTokenB);
      }, 0);

      set((state) => {
        state.loading = false;
        state.totalTVL = result;
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
        `${process.env.NEXT_PUBLIC_PROTOKIT_PROCESSOR_GRAPHQL_URL}`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query loadPoolInfo {
                pool(where: {poolKey: "${poolKey}"}) {
                  blockHeight
                  createAt
                  path
                  poolKey
                  tokenAId
                  tokenBId
                  tokenAAmount
                  tokenBAmount
                  updateBlockHeight
                  updatedAt
                }
              }
            `,
          }),
        },
      );

      const data = (await response.json()) as PoolsInfoDetailQueryResponse;
      setLoading(false);
      setData(data?.data?.pool || {});
      setError(data?.error);
    } catch {
      setData({});
    }
  };
  return { data, loading, error, getPoolInfo };
};

export const usePoolTxs = (poolKey: string) => {
  const [data, setData] = useState<Array<PoolsInfoJSON>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const getPoolTxs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROTOKIT_PROCESSOR_GRAPHQL_URL}`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query usePoolTxs {
                poolActions(
                  where: {
                    poolKey: {contains: "${poolKey}"}, 
                    status: {equals: true}
                  }
                  orderBy: {blockHeight: desc}
                  skip: 0
                  take: 50
                ) {
                  blockHeight
                  createAt
                  creator
                  directionAB
                  eventIndex
                  hash
                  poolKey
                  tokenAAmount
                  tokenAId
                  tokenBAmount
                  tokenBId
                  tokenAPrice
                  tokenBPrice
                  type
                }
              }
            `,
          }),
        },
      );

      const dataRes =
        (await response.json()) as PoolTransactionInfoQueryResponse;
      setLoading(false);
      setData(dataRes?.data?.poolActions || []);
      setError(dataRes?.error);
    } catch {
      setData([]);
    }
  };
  return { data, loading, error, getPoolTxs };
};

export const useTokenInfo = (tokenId: string) => {
  const [data, setData] = useState<any>({});
  const [dataHistoryToken, setDataHistoryToken] = useState<
    Array<{
      createAt: string;
      price: string | number;
      id: string | number;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const getTokenInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROTOKIT_PROCESSOR_GRAPHQL_URL}`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query loadTokenInfo {
                token(where: {tokenId: "${tokenId}"}) {
                  price
                  tokenId
                }
              }

            `,
          }),
        },
      );

      const data = await response.json();
      let dataRes = data.data.token;
      const basePrice = Number(dataRes.price) || 100;
      const priceData = generatePriceData(basePrice);
      const newData: any = {
        id: dataRes.tokenId,
        // ticker: tokens[dataRes.tokenId || 0]?.ticker,
        // name: tokens[dataRes.tokenId || 0]?.name,
        // logo: dataRes.tokenId ? tokens[dataRes.tokenId]?.logo : "",
        price: dataRes.price,
        volume: dataRes.volume || 0,
        fdv: dataRes.fdv || 0,
        tvl: dataRes.tvl || 0,
        prices: priceData,
      };
      setLoading(false);
      setData(newData || {});
      setDataHistoryToken(data?.data?.historyTokens || []);
      setError(data?.error);
    } catch {
      setData({});
    }
  };
  return { data, dataHistoryToken, loading, error, getTokenInfo };
};

export const useTokenTxs = (tokenId: string) => {
  const [data, setData] = useState<Array<PoolsInfoJSON>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const getTokenTxs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROTOKIT_PROCESSOR_GRAPHQL_URL}`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query loadTokenTxs {
                poolActions(where: 
                  {OR: 
                    [
                      {tokenBId: {contains: "${tokenId}"}}, 
                      {tokenAId: {contains: "${tokenId}"}}
                    ],
                    status: {equals: true}
                  }
                  orderBy: {blockHeight: desc}
                  skip: 0
                  take: 50
                  )
                {
                  blockHeight
                  createAt
                  creator
                  directionAB
                  eventIndex
                  hash
                  poolKey
                  tokenAAmount
                  tokenAId
                  tokenBAmount
                  tokenBId
                  tokenAPrice
                  tokenBPrice
                  type
                }
              }
            `,
          }),
        },
      );

      const dataRes =
        (await response.json()) as PoolTransactionInfoQueryResponse;
      setLoading(false);
      setData(dataRes?.data?.poolActions || []);
      setError(dataRes?.error);
    } catch {
      setData([]);
    }
  };
  return { data, loading, error, getTokenTxs };
};

export const useTokenPools = (tokenId: string) => {
  const [data, setData] = useState<Array<PoolsInfoJSON>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getTokenPools = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROTOKIT_PROCESSOR_GRAPHQL_URL}`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query loadTokenPools {
                pools(
                  where: {
                    OR: [
                      {tokenAId: {contains: "${tokenId}"}}, 
                      {tokenBId: {contains: "${tokenId}"}}
                    ]
                  }
                  orderBy: {blockHeight: desc}
                  skip: 0
                  take: 50
                ) {
                  blockHeight
                  createAt
                  path
                  poolKey
                  tokenAAmount
                  tokenAId
                  tokenBAmount
                  tokenBId
                  updateBlockHeight
                  updatedAt
                }
              }
            `,
          }),
        },
      );

      const dataRes = (await response.json()) as PoolsInfoQueryResponse;
      const newData: any = dataRes.data.pools.map((pool: any, index) => {
        // const firstToken = tokens[pool.tokenAId];
        // const secondToken = tokens[pool.tokenBId];
        return {
          ...pool,
          id: index + 1, // TODO update id token
          // tokenselected: {
          //   first: firstToken,
          //   second: secondToken,
          // },
          feeTier: pool?.feeTier || null,
          tvl: pool?.tvl?.usd || null,
          apr: pool?.apr || null,
          volume1d: pool?.volume_1d?.usd || null,
          volume7d: pool?.volume_7d?.usd || null,
        };
      });
      setLoading(false);
      setData(newData || []);
      setError(dataRes?.error);
    } catch {
      setData([]);
    }
  };
  return { data, loading, error, getTokenPools };
};

export const useHistoryToken = (
  tokenId: string,
  filterTime: string | null,
  skip?: number,
  take?: number,
) => {
  const [data, setData] = useState<
    Array<{
      createAt: string;
      price: string | number;
      id: string | number;
      type?: string;
    }>
  >([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState(false);

  const getHistoryToken = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROTOKIT_PROCESSOR_GRAPHQL_URL}`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query loadHistoryToken {
                historyTokens(where: {
                tokenId: {contains: "${tokenId}"}, 
                createAt: ${filterTime ? `{gt: "${filterTime}"}` : `{}`}},
                orderBy: {createAt: asc}
                ${skip ? `skip: ${skip}` : ``}
                take: ${take || 1}
                ) {
                  createAt
                  price
                  id
                }
              }
            `,
          }),
        },
      );
      const data = await response.json();

      setLoading(false);
      setData(data?.data?.historyTokens || []);
      setError(data?.error);
    } catch {
      setData([]);
    }
  };
  return { data, loading, error, getHistoryToken };
};

export const useLeaderBoard = () => {
  const [data, setData] = useState<Array<LeaderboardData>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(false);

  const asyncLeaderBoard = async (sortType: "total_vol" | "pnl") => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_APP_HOST}/leaderboard/?${new URLSearchParams({ sortType })}`,
    );
    const dataRes = await response.json();
    return dataRes;
  };
  const getLeaderBoard = async (
    sortType: "total_vol" | "pnl" = "total_vol",
  ) => {
    try {
      setLoading(true);
      const data = await asyncLeaderBoard(sortType);
      setLoading(false);
      setData(data);
    } catch {
      setData([]);
    }
  };
  return { data, loading, error, getLeaderBoard };
};

export const useHistoryPools = (poolKey: string, filterTime?: string) => {
  const [data, setData] = useState<
    Array<{
      createAt: string;
      tokenAPrice: string | number;
      tokenBPrice: string | number;
      tokenAAmount: string | number;
      tokenBAmount: string | number;
    }>
  >([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState(false);

  const getHistoryPools = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROTOKIT_PROCESSOR_GRAPHQL_URL}`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query loadHistoryPools {
                historyPools(
                  orderBy: {createAt: desc}
                  where: {
                    poolKey: {contains: "${poolKey}"},
                    createAt: ${filterTime ? `{gt: "${filterTime}"}` : `{}`}
                  }
                ) {
                  createAt
                  tokenAPrice
                  tokenBAmount
                  tokenBPrice
                  tokenAAmount
                }
              }
            `,
          }),
        },
      );
      const data = await response.json();

      setLoading(false);
      setData(data?.data?.historyPools || []);
      setError(data?.error);
    } catch {
      setData([]);
    }
  };
  return { data, loading, error, getHistoryPools };
};

export const useGetTvlVolPool = (poolKey: string) => {
  const [data, setData] = useState<{
    tvl: number;
    changeTvl: number | null;
    vol: number;
    changeVol: number | null;
    fees: number | null;
  }>({
    tvl: 0,
    changeTvl: null,
    vol: 0,
    changeVol: null,
    fees: null,
  });
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState(false);

  const getTVLandVolPools = async () => {
    let currentTime = new Date();

    let filterTime = new Date(
      currentTime.getTime() - 60 * 60 * 24 * 1000,
    ).toISOString();
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROTOKIT_PROCESSOR_GRAPHQL_URL}`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query loadGetTvlVolPool {
                pool(
                  where: {poolKey: "${poolKey}"}
                ) {
                  tokenAAmount
                  tokenAId
                  tokenBAmount
                  tokenBId
                }
                tokens {
                  tokenId
                  price
                }
              }
            `,
          }),
        },
      );
      // historyPools(
      //   orderBy: {createAt: desc}
      //   where: {
      //     poolKey: {contains: "${poolKey}"},
      //     createAt: {gt: "${filterTime}"}
      //   }
      // ) {
      //   tokenAPrice
      //   tokenBAmount
      //   tokenBPrice
      //   tokenAAmount
      // }
      const dataRes = await response.json();
      let dataTokens = dataRes?.data?.tokens || [];
      let dataPool = dataRes?.data?.pool || {};
      // let dataHistoryPools = dataRes?.data?.historyPools || [];
      let tvl = 0;
      let vol = 0;
      let tokenAPrice =
        dataTokens.filter((item: any) => item.tokenId === dataPool.tokenAId)[0]
          ?.price || 0;
      let tokenBPrice =
        dataTokens.filter((item: any) => item.tokenId === dataPool.tokenBId)[0]
          ?.price || 0;
      tvl = BigNumber(dataPool.tokenAAmount || 0)
        .times(tokenAPrice)
        .plus(BigNumber(dataPool.tokenBAmount || 0).times(tokenBPrice))
        .div(10 ** precision)
        .toNumber();
      // vol = dataHistoryPools.reduce((acc: number, item: any) => {
      //   const tokenAPriceVolume =
      //     item?.tokenAPrice * parseFloat(item?.tokenAAmount);
      //   const tokenBPriceVolume =
      //     item?.tokenBPrice * parseFloat(item?.tokenBAmount);
      //   return acc + tokenAPriceVolume + tokenBPriceVolume;
      // }, 0)
      setLoading(false);
      setData({
        ...data,
        tvl: tvl,
        vol: vol,
      });
      setError(dataRes?.error);
    } catch {
      setData({
        tvl: 0,
        changeTvl: null,
        vol: 0,
        changeVol: null,
        fees: null,
      });
    }
  };
  return { data, loading, error, getTVLandVolPools };
};
