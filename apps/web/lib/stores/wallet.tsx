import { useToast } from "@/components/ui/use-toast";
import { PendingTransaction, UnsignedTransaction } from "@proto-kit/sequencer";
import { MethodIdResolver } from "@proto-kit/module";
import { useCallback, useEffect, useMemo } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
// @ts-ignore
import truncateMiddle from "truncate-middle";
import { usePrevious } from "@uidotdev/usehooks";
import { useClientStore } from "./client";
import { useChainStore } from "./chain";
import { Bool, Field, PublicKey, Signature, UInt64 } from "o1js";
import { tokens } from "@/tokens";
import Image from "next/image";

export interface WalletState {
  wallet?: string;
  isWalletOpen: boolean;
  type?: string;
  dataTransaction?: any;
  setIsWalletOpen: (isWalletOpen: boolean) => void;
  initializeWallet: () => Promise<void>;
  connectWallet: () => Promise<void>;
  observeWalletChange: () => void;
  pendingTransactions: PendingTransaction[];
  addPendingTransaction: (
    pendingTransaction: PendingTransaction,
    type?: string,
    data?: any,
  ) => void;
  removePendingTransaction: (pendingTransaction: PendingTransaction) => void;
}

export const useWalletStore = create<WalletState, [["zustand/immer", never]]>(
  immer((set) => ({
    type: "Transaction",
    async initializeWallet() {
      if (typeof mina === "undefined") {
        throw new Error("Auro wallet not installed");
      }

      try {
        // Get the list of accounts
        const accounts = await mina.getAccounts();
        console.log("accountInfo", accounts);

        if (accounts.length > 0) {
          const [wallet] = accounts;

          // Update the state with the retrieved wallet
          set((state) => {
            state.wallet = wallet;
            // state.isWalletOpen = true;
          });

          // Optionally, add an event listener for account changes
          mina.on("accountsChanged", (newAccounts) => {
            console.log("accountsChanged", newAccounts);
            if (newAccounts.length > 0) {
              set((state) => {
                state.wallet = newAccounts[0];
              });
            } else {
              set((state) => {
                state.wallet = "";
                state.isWalletOpen = false;
              });
            }
          });
        }
      } catch (error) {
        console.error("Error initializing wallet:", error);
        throw new Error("Failed to retrieve accounts from Auro wallet");
      }
    },
    async connectWallet() {
      if (typeof mina === "undefined") {
        throw new Error("Auro wallet not installed");
      }

      const [wallet] = await mina.requestAccounts();

      set((state) => {
        state.wallet = wallet;
      });
    },

    isWalletOpen: false,

    setIsWalletOpen(isWalletOpen) {
      set((state) => {
        state.isWalletOpen = isWalletOpen;
      });
    },

    observeWalletChange() {
      if (typeof mina === "undefined") {
        throw new Error("Auro wallet not installed");
      }

      mina.on("accountsChanged", ([wallet]) => {
        set((state) => {
          state.wallet = wallet;
        });
      });
    },

    pendingTransactions: [] as PendingTransaction[],
    addPendingTransaction(pendingTransaction, type = "Transaction", data) {
      set((state) => {
        // @ts-expect-error
        state.pendingTransactions.push(pendingTransaction);
        state.type = type;
        state.dataTransaction = data;
      });
    },
    removePendingTransaction(pendingTransaction) {
      set((state) => {
        state.pendingTransactions = state.pendingTransactions.filter((tx) => {
          return tx.hash().toString() !== pendingTransaction.hash().toString();
        });
      });
    },
  })),
);

export const useNotifyTransactions = () => {
  const wallet = useWalletStore();
  const chain = useChainStore();
  const { toast } = useToast();
  const client = useClientStore();
  const previousPendingTransactions = usePrevious(wallet.pendingTransactions);
  const newPendingTransactions = useMemo(() => {
    return wallet.pendingTransactions.filter(
      (pendingTransaction) =>
        !(previousPendingTransactions ?? []).includes(pendingTransaction),
    );
  }, [wallet.pendingTransactions, previousPendingTransactions]);

  const notifyTransaction = useCallback(
    (
      status: "PENDING" | "SUCCESS" | "FAILURE",
      transaction: UnsignedTransaction | PendingTransaction,
      type = wallet.type,
    ) => {
      if (!client.client) return;

      const methodIdResolver = client.client.resolveOrFail(
        "MethodIdResolver",
        MethodIdResolver,
      );

      const resolvedMethodDetails = methodIdResolver.getMethodNameFromId(
        transaction.methodId.toBigInt(),
      );

      if (!resolvedMethodDetails)
        throw new Error("Unable to resolve method details");

      const [moduleName, methodName] = resolvedMethodDetails;

      const hash = truncateMiddle(transaction.hash().toString(), 15, 15, "...");
      // : ${moduleName}.${methodName}
      // function title() {
      //   switch (status) {
      //     case "PENDING":
      //       // return `⏳ ${type} sent`;
      //       return (
      //         <span className="flex items-center gap-[4px] text-[26px] font-[500] text-textBlack sm:text-[18px] lg:text-[26px] xl:text-[26px]">
      //           <img
      //             src="/icon/pending-icon.svg"
      //             width={30}
      //             height={30}
      //             alt=""
      //             style={{ marginLeft: "-36px" }}
      //           />
      //           {type} sent
      //         </span>
      //       );
      //     case "SUCCESS":
      //       // return ` ${type} Successful`;
      //       return (
      //         <span className="flex items-center gap-[4px] text-[26px] font-[500] text-textBlack sm:text-[18px] lg:text-[26px] xl:text-[26px]">
      //           <img
      //             src="/icon/success-icon.svg"
      //             width={30}
      //             height={30}
      //             alt=""
      //             style={{ marginLeft: "-36px" }}
      //           />
      //           {type} Successful
      //         </span>
      //       );
      //     case "FAILURE":
      //       // return `❌ ${type} Failed`;
      //       return (
      //         <span className="flex items-center gap-[4px] text-[26px] font-[500] text-textBlack sm:text-[18px] lg:text-[26px] xl:text-[26px]">
      //           <img
      //             src="/icon/failed-ico.svg"
      //             width={30}
      //             height={30}
      //             alt=""
      //             style={{ marginLeft: "-36px" }}
      //           />
      //           {type} Failed
      //         </span>
      //       );
      //   }
      // }

      function description() {
        const { dataTransaction } = wallet;
        console.log("dataTransaction", dataTransaction);
        const tokensTicker = dataTransaction?.route
          ?.map((id: string | number) => tokens[id]?.ticker)
          ?.filter((ticker: undefined) => ticker !== undefined) as string[];

        const urlTransaction = `https://minascan.io/mainnet/tx/${transaction.sender.toBase58()}`;

        switch (status) {
          case "PENDING":
            return (
              <div className="flex flex-col items-start gap-[10px]">
                <span className="flex items-center gap-[4px] text-[26px] font-[500] text-textBlack sm:text-[18px] lg:text-[26px] xl:text-[26px]">
                  <img
                    src="/icon/pending-icon.svg"
                    width={30}
                    height={30}
                    alt=""
                    style={{ marginLeft: "-36px" }}
                  />
                  {type} sent
                </span>
                {type !== "Swap" && (
                  <p className="text-[20px] text-textBlack opacity-50 sm:text-[12px] lg:text-[20px] xl:text-[20px]">
                    Hash: {hash}
                  </p>
                )}
                {type === "Swap" && (
                  <p className="text-[20px] text-textBlack opacity-50 sm:text-[12px] lg:text-[20px] xl:text-[20px]">
                    {type} {dataTransaction?.tokenIn} {tokensTicker[0] || ""}{" "}
                    for {dataTransaction?.tokenOut} {tokensTicker[1] || ""}
                  </p>
                )}
                <div className="flex items-center gap-[4px]">
                  <a
                    href={urlTransaction}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-[20px] font-[600] text-textBlack hover:underline sm:text-[12px] lg:text-[20px] xl:text-[20px]"
                  >
                    View transaction details
                  </a>
                  <Image
                    src="/icon/icon-link.svg"
                    width={24}
                    height={24}
                    alt=""
                  />
                </div>
                <Image
                  src="/icon/Close-icon.svg"
                  width={30}
                  height={30}
                  alt=""
                  className="absolute cursor-pointer"
                  style={{ top: 9, right: 13 }}
                />
              </div>
            );
          case "SUCCESS":
            return (
              <div className="flex flex-col items-start gap-[10px]">
                <span className="flex items-center gap-[4px] text-[26px] font-[500] text-textBlack sm:text-[18px] lg:text-[26px] xl:text-[26px]">
                  <img
                    src="/icon/success-icon.svg"
                    width={30}
                    height={30}
                    alt=""
                    style={{ marginLeft: "-36px" }}
                  />
                  {type} Successful
                </span>
                {type !== "Swap" && (
                  <p className="text-[20px] font-[400] text-textBlack opacity-50 sm:text-[12px] lg:text-[20px] xl:text-[20px]">
                    Hash: {hash}
                  </p>
                )}
                {type === "Swap" && (
                  <p className="text-[20px] font-[400] text-textBlack opacity-50 sm:text-[12px] lg:text-[20px] xl:text-[20px]">
                    {type} {dataTransaction?.tokenIn} {tokensTicker[0] || ""}{" "}
                    for {dataTransaction?.tokenOut} {tokensTicker[1] || ""}
                  </p>
                )}
                <div className="flex items-center gap-[4px]">
                  <a
                    href={urlTransaction}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-[20px] font-[600] text-textBlack hover:underline sm:text-[12px] lg:text-[20px] xl:text-[20px]"
                  >
                    View transaction details
                  </a>
                  <Image
                    src="/icon/icon-link.svg"
                    width={24}
                    height={24}
                    alt=""
                  />
                </div>
                <Image
                  src="/icon/Close-icon.svg"
                  width={30}
                  height={30}
                  alt=""
                  className="absolute cursor-pointer"
                  style={{ top: 9, right: 13 }}
                />
              </div>
            );
          case "FAILURE":
            return (
              <div className="flex flex-col items-start gap-[10px]">
                <span className="flex items-center gap-[4px] text-[26px] font-[500] text-textBlack sm:text-[18px] lg:text-[26px] xl:text-[26px]">
                  <img
                    src="/icon/failed-ico.svg"
                    width={30}
                    height={30}
                    alt=""
                    style={{ marginLeft: "-36px" }}
                  />
                  {type} Failed
                </span>
                {type !== "Swap" && (
                  <p className="text-[20px] font-[400] text-textBlack opacity-50 sm:text-[12px] lg:text-[20px] xl:text-[20px]">
                    Hash: {hash}
                  </p>
                )}
                {type === "Swap" && (
                  <p className="text-[20px] font-[400] text-textBlack opacity-50 sm:text-[12px] lg:text-[20px] xl:text-[20px]">
                    {type} {dataTransaction?.tokenIn} {tokensTicker[0] || ""}{" "}
                    for {dataTransaction?.tokenOut} {tokensTicker[1] || ""}
                  </p>
                )}
                <div className="flex items-center gap-[4px]">
                  <a
                    href={urlTransaction}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-[20px] font-[600] text-textBlack hover:underline sm:text-[12px] lg:text-[20px] xl:text-[20px]"
                  >
                    View transaction details
                  </a>
                  <Image
                    src="/icon/icon-link.svg"
                    width={24}
                    height={24}
                    alt=""
                  />
                </div>
                <Image
                  src="/icon/Close-icon.svg"
                  width={30}
                  height={30}
                  alt=""
                  className="absolute cursor-pointer"
                  style={{ top: 9, right: 13 }}
                />
              </div>
            );
        }
      }

      toast({
        title: "",
        description: description(),
        className:
          "bg-bgWhiteColor text-textBlack border-[2px] rounded-[20px] border-borderOrColor w-full pt-[20px] pr-[24px] pb-[12px]",
      });
    },
    [client.client, wallet.type, wallet.dataTransaction],
  );

  // notify about new pending transactions
  useEffect(() => {
    newPendingTransactions.forEach((pendingTransaction) => {
      notifyTransaction("PENDING", pendingTransaction);
    });
  }, [newPendingTransactions, notifyTransaction]);

  // notify about transaction success or failure
  useEffect(() => {
    const confirmedTransactions = chain.block?.txs?.map(
      ({ tx, status, statusMessage }) => {
        return {
          tx: new PendingTransaction({
            methodId: Field(tx.methodId),
            nonce: UInt64.from(tx.nonce),
            isMessage: false,
            sender: PublicKey.fromBase58(tx.sender),
            argsFields: tx.argsFields.map((arg) => Field(arg)),
            auxiliaryData: [],
            signature: Signature.fromJSON({
              r: tx.signature.r,
              s: tx.signature.s,
            }),
          }),
          status,
          statusMessage,
        };
      },
    );

    const confirmedPendingTransactions = confirmedTransactions?.filter(
      ({ tx }) => {
        return wallet.pendingTransactions?.find((pendingTransaction) => {
          return pendingTransaction.hash().toString() === tx.hash().toString();
        });
      },
    );

    confirmedPendingTransactions?.forEach(({ tx, status }) => {
      wallet.removePendingTransaction(tx);
      notifyTransaction(status ? "SUCCESS" : "FAILURE", tx);
    });
  }, [
    chain.block,
    wallet.pendingTransactions,
    client.client,
    notifyTransaction,
  ]);
};
