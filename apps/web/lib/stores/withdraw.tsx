import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Client, useClientStore } from "./client";
import { PublicKey } from "o1js";
import { Balance, TokenId } from "@proto-kit/library";
import { isPendingTransaction, useBalancesStore } from "./balances";
import { PendingTransaction } from "@proto-kit/sequencer";
import { useWalletStore } from "./wallet";
import { useCallback } from "react";

export interface WithdrawalState {
  withdraw: (
    client: Client,
    sender: string,
    tokenId: string,
    amount: string,
    recipient: string,
  ) => Promise<PendingTransaction>;
}

export const useWithdrawalStore = create<
  WithdrawalState,
  [["zustand/immer", never]]
>(
  immer((set) => ({
    withdraw: async (
      client: Client,
      sender: string,
      tokenId: string,
      amount: string,
      recipient: string = "",
    ) => {
      const withdrawalsModule = client.runtime.resolve("Withdrawals");
      const senderPublicKey = PublicKey.fromBase58(sender);
      const tx = await client.transaction(senderPublicKey, async () => {
        await withdrawalsModule.withdrawSigned(
          TokenId.from(tokenId),
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

export const useWithdraw = () => {
  const client = useClientStore();
  const withdrawal = useWithdrawalStore();
  const wallet = useWalletStore();

  return useCallback(
    async (tokenId: string, recipient: string, amount: string) => {
      if (!client.client || !wallet.wallet) return;

      const pendingTransaction = await withdrawal.withdraw(
        client.client,
        wallet.wallet,
        tokenId,
        amount,
        recipient,
      );

      wallet.addPendingTransaction(pendingTransaction, "Withdraw");
    },
    [client.client, wallet.wallet],
  );
};
