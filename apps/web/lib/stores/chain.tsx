import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useEffect, useState } from "react";
import { useWalletStore } from "./wallet";

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
  data: any;
  error: boolean;
  loadBlock: () => Promise<void>;
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
    async loadBlock() {
      set((state) => {
        state.loading = true;
      });
      // https://graphql.dinodex.io/graphql
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROTOKIT_GRAPHQL_URL}/graphql`,
        {
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
        },
      );

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
  })),
);

export const tickInterval = 3000;
export const usePollBlockHeight = (isLoadBlock: boolean = true) => {
  const [tick, setTick] = useState(0);
  const chain = useChainStore();
  const { wallet } = useWalletStore();

  useEffect(() => {
    wallet && chain?.loadBlock();
  }, [tick, wallet]);

  useEffect(() => {
    if (isLoadBlock) {
      const intervalId = setInterval(
        () => setTick((tick) => tick + 1),
        tickInterval,
      );

      setTick((tick) => tick + 1);

      return () => clearInterval(intervalId);
    }
  }, [isLoadBlock]);
};
