import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Client, useClientStore } from "./client";
import { useCallback, useEffect, useMemo } from "react";
import { useWalletStore } from "./wallet";
import { Bool, Provable, PublicKey } from "o1js";
import { Balance, TokenId } from "@proto-kit/library";
import { isPendingTransaction } from "./balances";
import { PendingTransaction } from "@proto-kit/sequencer";
import { PoolKey, TokenIdPath } from "chain";
import { resolve } from "path";
import { useChainStore } from "./chain";
import { TRANSACTION_TYPES } from "@/constants";
import { dataSubmitProps } from "@/types";

export interface XYKState {
  createPool: (
    client: Client,
    sender: string,
    tokenAId: string,
    tokenBId: string,
    tokenAAmount: string,
    tokenBAmount: string,
  ) => Promise<PendingTransaction>;
  addLiquidity: (
    client: Client,
    sender: string,
    tokenAId: string,
    tokenBId: string,
    tokenAAmount: string,
    tokenBAmountLimit: string,
  ) => Promise<PendingTransaction>;
  removeLiquidity: (
    client: Client,
    sender: string,
    tokenAId: string,
    tokenBId: string,
    lpTokenAmount: string,
    tokenAAmountLimit: string,
    tokenBAmountLimit: string,
  ) => Promise<PendingTransaction>;
  sellPath: (
    client: Client,
    sender: string,
    path: string[],
    amountIn: string,
    amountOutMinLimit: string,
  ) => Promise<PendingTransaction>;
  loadPool: (client: Client, key: string) => Promise<void>;
  pools: {
    [key: string]:
      | {
          loading: boolean;
          exists: boolean;
        }
      | undefined;
  };
}

export const useXYKStore = create<XYKState, [["zustand/immer", never]]>(
  immer((set) => ({
    pools: {},

    loadPool: async (client: Client, key: string) => {
      set((state) => {
        state.pools[key] = {
          loading: true,
          exists: state.pools[key]?.exists ?? false,
        };
      });
      // const pool = (await client.query.runtime.XYK.pools.get(
      //   PoolKey.fromBase58(key),
      // )) as Bool | undefined;

      let pool: Bool | undefined = undefined;
      try {
        const poolKey = PoolKey.fromBase58(key);
        pool = (await client.query.runtime.XYK.pools.get(poolKey)) as
          | Bool
          | undefined;
      } catch (error: any) {
        console.error("Error retrieving pool:", error?.message);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => {
        state.pools[key] = {
          loading: false,
          exists: pool?.toBoolean() ?? false,
        };
      });
    },

    createPool: async (
      client: Client,
      sender: string,
      tokenAId: string,
      tokenBId: string,
      tokenAAmount: string,
      tokenBAmount: string,
    ) => {
      const xyk = client.runtime.resolve("XYK");
      const senderPublicKey = PublicKey.fromBase58(sender);

      const tx = await client.transaction(senderPublicKey, async () => {
        await xyk.createPoolSigned(
          TokenId.from(tokenAId),
          TokenId.from(tokenBId),
          Balance.from(tokenAAmount),
          Balance.from(tokenBAmount),
        );
      });

      await tx.sign();
      await tx.send();

      isPendingTransaction(tx.transaction);
      return tx.transaction;
    },

    addLiquidity: async (
      client: Client,
      sender: string,
      tokenAId: string,
      tokenBId: string,
      tokenAAmount: string,
      tokenBAmountLimit: string,
    ) => {
      const xyk = client.runtime.resolve("XYK");
      const senderPublicKey = PublicKey.fromBase58(sender);

      const tx = await client.transaction(senderPublicKey, async () => {
        await xyk.addLiquiditySigned(
          TokenId.from(tokenAId),
          TokenId.from(tokenBId),
          Balance.from(tokenAAmount),
          Balance.from(tokenBAmountLimit),
        );
      });

      await tx.sign();
      await tx.send();

      isPendingTransaction(tx.transaction);
      return tx.transaction;
    },
    removeLiquidity: async (
      client: Client,
      sender: string,
      tokenAId: string,
      tokenBId: string,
      lpTokenAmount: string,
      tokenAAmountLimit: string,
      tokenBAmountLimit: string,
    ) => {
      const xyk = client.runtime.resolve("XYK");
      const senderPublicKey = PublicKey.fromBase58(sender);

      const tx = await client.transaction(senderPublicKey, async () => {
        await xyk.removeLiquiditySigned(
          TokenId.from(tokenAId),
          TokenId.from(tokenBId),
          Balance.from(lpTokenAmount),
          Balance.from(tokenAAmountLimit),
          Balance.from(tokenBAmountLimit),
        );
      });

      await tx.sign();
      await tx.send();

      isPendingTransaction(tx.transaction);
      return tx.transaction;
    },
    sellPath: async (
      client: Client,
      sender: string,
      path: string[],
      amountIn: string,
      amountOutMinLimit: string,
    ) => {
      const xyk = client.runtime.resolve("XYK");
      const senderPublicKey = PublicKey.fromBase58(sender);

      const basePath = path.length === 3 ? path : [...path, "99999"];
      const tokenIdPath = TokenIdPath.from(
        basePath.map((id) => TokenId.from(id)),
      );
      Provable.log("PATH", basePath, tokenIdPath);

      const tx = await client.transaction(senderPublicKey, async () => {
        await xyk.sellPathSigned(
          tokenIdPath,
          Balance.from(amountIn),
          Balance.from(amountOutMinLimit),
        );
      });

      await tx.sign();
      await tx.send();

      isPendingTransaction(tx.transaction);
      return tx.transaction;
    },
  })),
);

export const useCreatePool = () => {
  const client = useClientStore();
  const wallet = useWalletStore();
  const { createPool } = useXYKStore();

  return useCallback(
    async (
      tokenAId: string,
      tokenBId: string,
      tokenAAmount: string,
      tokenBAmount: string,
      data: dataSubmitProps,
    ) => {
      if (!client.client || !wallet.wallet) return;
      const pendingTransaction = await createPool(
        client.client,
        wallet.wallet,
        tokenAId,
        tokenBId,
        tokenAAmount,
        tokenBAmount,
      );

      wallet.addPendingTransaction(
        pendingTransaction,
        TRANSACTION_TYPES.CREATE,
        data,
      );
    },
    [client.client, wallet.wallet],
  );
};

export const useAddLiquidity = () => {
  const client = useClientStore();
  const wallet = useWalletStore();
  const { addLiquidity } = useXYKStore();

  return useCallback(
    async (
      tokenAId: string,
      tokenBId: string,
      tokenAAmount: string,
      tokenBAmountLimit: string,
      data: dataSubmitProps,
    ) => {
      if (!client.client || !wallet.wallet) return;
      const pendingTransaction = await addLiquidity(
        client.client,
        wallet.wallet,
        tokenAId,
        tokenBId,
        tokenAAmount,
        tokenBAmountLimit,
      );

      wallet.addPendingTransaction(
        pendingTransaction,
        TRANSACTION_TYPES.ADD,
        data,
      );
    },
    [client.client, wallet.wallet],
  );
};

export const useRemoveLiquidity = () => {
  const client = useClientStore();
  const wallet = useWalletStore();
  const { removeLiquidity } = useXYKStore();

  return useCallback(
    async (
      tokenAId: string,
      tokenBId: string,
      lpTokenAmount: string,
      tokenAAmountLimit: string,
      tokenBAmountLimit: string,
      data: dataSubmitProps,
    ) => {
      if (!client.client || !wallet.wallet) return;
      const pendingTransaction = await removeLiquidity(
        client.client,
        wallet.wallet,
        tokenAId,
        tokenBId,
        lpTokenAmount,
        tokenAAmountLimit,
        tokenBAmountLimit,
      );

      wallet.addPendingTransaction(
        pendingTransaction,
        TRANSACTION_TYPES.REMOVE,
        data,
      );
    },
    [client.client, wallet.wallet],
  );
};

export const useSellPath = () => {
  const client = useClientStore();
  const wallet = useWalletStore();
  const { sellPath } = useXYKStore();
  return useCallback(
    async (
      path: string[],
      amountIn: string,
      amountOutMinLimit: string,
      data?: dataSubmitProps,
    ) => {
      if (!client.client || !wallet.wallet) return;
      const pendingTransaction = await sellPath(
        client.client,
        wallet.wallet,
        path,
        amountIn,
        amountOutMinLimit,
      );

      wallet.addPendingTransaction(
        pendingTransaction,
        TRANSACTION_TYPES.SWAP,
        data,
      );
    },
    [client.client, wallet.wallet],
  );
};

export const usePool = (key: string) => {
  const xyk = useXYKStore();
  return useMemo(() => xyk.pools[key], [xyk.pools, key]);
};

export const useObservePool = (key: string) => {
  const client = useClientStore();
  const { loadPool } = useXYKStore();
  const pool = usePool(key);
  const chain = useChainStore();

  useEffect(() => {
    if (!client.client) return;
    loadPool(client.client, key);
  }, [client.client, key, chain.block?.height]);

  return pool;
};
