import { create } from "zustand";
import { Client, useClientStore } from "./client";
import { immer } from "zustand/middleware/immer";
import { PendingTransaction, UnsignedTransaction } from "@proto-kit/sequencer";
import { Balance, BalancesKey, TokenId } from "@proto-kit/library";
import { PublicKey } from "o1js";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useChainStore } from "./chain";
import { useWalletStore } from "./wallet";
import { getTokenID } from '@/tokens';
import { usePoolKey } from "../xyk/usePoolKey";
import { LPTokenId, TokenPair } from "chain";
import BigNumber from "bignumber.js";

export interface BalancesState {
  loading: boolean;
  balances: {
    // address
    [key: string]:
    | {
      // tokenId
      [key: string]: string | undefined;
    }
    | undefined;
  };
  totalSupply: {
    [key: string]: string | undefined;
  };
  loadBalance: (
    client: Client,
    tokenId: string,
    address: string,
  ) => Promise<void>;
  clearBalances: (address?: string) => void;
  faucet: (client: Client, address: string) => Promise<PendingTransaction>;
  loadTotalSupply: (client: Client, tokenId: string) => Promise<void>;
  transfer: (
    client: Client,
    sender: string,
    tokenId: string,
    address: string,
    amount: string,
  ) => Promise<PendingTransaction>;
}

export function isPendingTransaction(
  transaction: PendingTransaction | UnsignedTransaction | undefined,
): asserts transaction is PendingTransaction {
  if (!(transaction instanceof PendingTransaction))
    throw new Error("Transaction is not a PendingTransaction");
}

export const tokenId = TokenId.from(0);

export const useBalancesStore = create<
  BalancesState,
  [["zustand/immer", never]]
>(
  immer((set) => ({
    loading: Boolean(false),
    balances: {},
    totalSupply: {},
    async loadTotalSupply(client: Client, tokenId: string) {
      set((state) => {
        state.loading = true;
      });

      const totalSupply =
        await client.query.runtime.Balances.circulatingSupply.get(
          TokenId.from(tokenId),
        );

      set((state) => {
        state.loading = false;
        state.totalSupply = {
          ...state.totalSupply,
          [tokenId]: totalSupply?.toString() ?? "0",
        };
      });
    },
    clearBalances(address) {
      set((state) => {
        if (address) {
          delete state.balances[address];
        } else {
          state.balances = {};
        }
      });
    },
    async loadBalance(client: Client, tokenId: string, address: string) {
      set((state) => {
        state.loading = true;
      });

      const key = BalancesKey.from(
        TokenId.from(tokenId),
        PublicKey.fromBase58(address),
      );

      const balance = await client.query.runtime.Balances.balances.get(key);
      set((state) => {
        state.loading = false;
        state.balances = {
          ...state.balances,
          [address]: {
            ...state.balances[address],
            [tokenId]: balance?.toString() ?? "0",
          },
        };
      });
    },
    async faucet(client: Client, address: string) {
      const faucet = client.runtime.resolve("Faucet");
      const sender = PublicKey.fromBase58(address);

      const tx = await client.transaction(sender, async () => {
        await faucet.dripBundle();
      });

      await tx.sign();
      await tx.send();

      isPendingTransaction(tx.transaction);
      return tx.transaction;
    },
    async transfer(
      client: Client,
      address: string,
      tokenId: string,
      recipient: string,
      amount: string,
    ) {
      const balances = client.runtime.resolve("Balances");
      const sender = PublicKey.fromBase58(address);

      const tx = await client.transaction(sender, async () => {
        await balances.transferSigned(
          TokenId.from(tokenId),
          sender,
          PublicKey.fromBase58(recipient),
          Balance.from(amount),
        );
      });

      await tx.sign();
      await tx.send();

      isPendingTransaction(tx.transaction);
      return tx.transaction;
    },
  })),
);

export const useBalance = (address?: string, tokenId?: string) => {
  const balances = useBalancesStore();

  return useMemo(() => {
    if (!address || !tokenId) return;

    return balances.balances[address]?.[tokenId];
  }, [balances.balances, address, tokenId]);
};

export const useObserveBalance = (tokenId?: string, address?: string) => {
  const client = useClientStore();
  const chain = useChainStore();
  const balances = useBalancesStore();
  const balance = useBalance(address, tokenId);

  useEffect(() => {
    if (!client.client || !address || !tokenId) return;

    balances.loadBalance(client.client, tokenId, address);
  }, [client.client, chain.block?.height, address]);

  return balance;
};

export const useObservePooled = (
  tickerA?: string,
  tickerB?: string,
  balance?: number | string,
) => {
  // Memoize tokenA and tokenB based on ticker inputs
  const tokenA = useMemo(
    () => getTokenID("ticker", tickerA as string) as string,
    [tickerA],
  );
  const tokenB = useMemo(
    () => getTokenID("ticker", tickerB as string) as string,
    [tickerB],
  );

  const calculatePooledToken = (lpBalance: BigNumber.Value, lpTotalSupply: BigNumber.Value, tokenTotalOfPool: BigNumber.Value) => {
    if ([lpTotalSupply, tokenTotalOfPool].includes(0)) return 0
    return BigNumber(tokenTotalOfPool).multipliedBy(lpBalance).div(lpTotalSupply).toString()
  }

  // Memoize the pool key and token pair to avoid recalculating when tokenA or tokenB change
  const { tokenPair, poolKey } = usePoolKey(tokenA, tokenB);
  // const {
  //   wallet,
  // } = useWalletStore();

  // Observe balances for both tokens and the total supply of the liquidity pool token
  const totalTokenALp = useObserveBalance(tokenA, poolKey);
  const totalTokenBLp = useObserveBalance(tokenB, poolKey);
  const lpTotalSupply = useObserveTotalSupply(
    LPTokenId.fromTokenPair(tokenPair).toString(),
  );
  // Calculate the pool share, memoized based on the user's balance and total supply
  const poolOfShare = useMemo(() => {
    if (!balance || !lpTotalSupply) return 0;
    return ((Number(balance) / Number(lpTotalSupply)) * 100).toFixed(2);
  }, [balance, lpTotalSupply]);
  return {
    first: calculatePooledToken(balance || 0, lpTotalSupply || 0, totalTokenALp || 0),
    second: calculatePooledToken(balance || 0, lpTotalSupply || 0, totalTokenBLp || 0),
    poolOfShare
  };
};

export const useFaucet = () => {
  const client = useClientStore();
  const balances = useBalancesStore();
  const wallet = useWalletStore();

  return useCallback(async () => {
    if (!client.client || !wallet.wallet) return;

    const pendingTransaction = await balances.faucet(
      client.client,
      wallet.wallet,
    );

    wallet.addPendingTransaction(pendingTransaction);
  }, [client.client, wallet.wallet]);
};

export const useTransfer = () => {
  const client = useClientStore();
  const balances = useBalancesStore();
  const wallet = useWalletStore();

  return useCallback(
    async (tokenId: string, recipient: string, amount: string) => {
      if (!client.client || !wallet.wallet) return;

      const pendingTransaction = await balances.transfer(
        client.client,
        wallet.wallet,
        tokenId,
        recipient,
        amount,
      );

      wallet.addPendingTransaction(pendingTransaction);
    },
    [client.client, wallet.wallet],
  );
};

export const useTotalSupply = (tokenId?: string) => {
  const balances = useBalancesStore();

  return useMemo(() => {
    if (!tokenId) return "0";
    return balances.totalSupply[tokenId];
  }, [tokenId, balances]);
};

export const useObserveTotalSupply = (tokenId?: string) => {
  const client = useClientStore();
  const balances = useBalancesStore();
  const totalSupply = useTotalSupply(tokenId);
  const chain = useChainStore();

  useEffect(() => {
    if (!client.client || !tokenId) return;

    balances.loadTotalSupply(client.client, tokenId);
  }, [client.client, tokenId, chain.block?.height]);

  return totalSupply;
};

export const useObservePoolOfShare = (
  address: string,
  tokenAId: string,
  tokenBId: string,
) => {
  const balances = useBalancesStore();

  const { tokenPair } = usePoolKey(tokenAId, tokenBId);

  const lpTotalSupply = useObserveTotalSupply(
    LPTokenId.fromTokenPair(tokenPair).toString(),
  );

  const userLqTokenBalance = balances.balances[address];

  return (Number(userLqTokenBalance) / Number(lpTotalSupply)) * 100;
};
