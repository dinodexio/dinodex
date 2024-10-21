import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useEffect, useState } from "react";

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
export const useChainStore = create<ChainState, [["zustand/immer", never]]>(
  immer((set) => ({
    loading: Boolean(false),
    data: null,
    error: Boolean(true),
    transactions: [],
    async loadBlock() {
      set((state) => {
        state.loading = true;
      });
      // https://graphql.dinodex.io/graphql
      const response = await fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query GetBlock {
              block {
                txs {
                  tx {
                    argsFields
                    auxiliaryData
                    methodId
                    nonce
                    sender
                    signature {
                      r
                      s
                    }
                  }
                  status
                  statusMessage
                }
              }
              network {
                unproven {
                  block {
                    height
                  }
                }
              }
            }
          `,
        }),
      });

      const { data } = (await response.json()) as BlockQueryResponse;
      set((state) => {
        state.loading = false;
        state.data = data;
        state.block = data.network.unproven
          ? {
              height: data.network.unproven.block.height,
              ...data.block,
            }
          : undefined;
      });
    },
    async loadTransactions() {
      set((state) => {
        state.loading = true;
      });

      const response = await fetch("http://localhost:3333/transactions", {
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

export const tickInterval = 1000;
export const usePollBlockHeight = () => {
  const [tick, setTick] = useState(0);
  const chain = useChainStore();

  useEffect(() => {
    chain.loadBlock();
  }, [tick]);

  useEffect(() => {
    const intervalId = setInterval(
      () => setTick((tick) => tick + 1),
      tickInterval,
    );

    setTick((tick) => tick + 1);

    return () => clearInterval(intervalId);
  }, []);
};

export const usePollTransactions = () => {
  const [tick, setTick] = useState(0);
  const chain = useChainStore();
  useEffect(() => {
    chain.loadTransactions();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(
      () => setTick((tick) => tick + 10),
      tickInterval,
    );

    setTick((tick) => tick + 10);

    return () => clearInterval(intervalId);
  }, []);
};
