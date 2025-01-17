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
import { Field, PublicKey, Signature, UInt64 } from "o1js";
import Image from "next/image";
import { FAUCET_SUCCESS, TRANSACTION_TYPES } from "@/constants";
import { dataSubmitProps } from "@/types";
import stylesWallet from "../../components/css/wallet.module.css";
import { formatFullValue, truncateAddress } from "../utils";
import { ImageCommon } from "@/components/common/ImageCommon";

export interface WalletState {
  wallet?: string;
  isWalletOpen: boolean;
  type?: string;
  dataTransaction?: dataSubmitProps;
  setIsWalletOpen: (isWalletOpen: boolean) => void;
  initializeWallet: () => Promise<void>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
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
        // Kiểm tra xem có lưu trạng thái ngắt kết nối trong localStorage không
        const isDisconnected = localStorage.getItem("isWalletDisconnected");
        if (isDisconnected === "true") {
          console.log("Wallet is disconnected, skipping event listeners");
          return;
        }
        // Get the list of accounts
        const accounts = await mina.getAccounts();
        // console.log("accountInfo", accounts);

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
      localStorage.setItem("isWalletDisconnected", "false");

      const [wallet] = await mina.requestAccounts();

      set((state) => {
        state.wallet = wallet;
      });
    },

    async disconnectWallet() {
      set((state) => {
        state.wallet = "";
        state.isWalletOpen = false;
      });
      // Lưu trạng thái ngắt kết nối trong localStorage
      localStorage.setItem("isWalletDisconnected", "true");

      // Gọi removeEventListeners để gỡ bỏ các sự kiện đã thêm
      removeEventListeners();
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
    addPendingTransaction(pendingTransaction, type = "Transaction", data = {}) {
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

function removeEventListeners() {
  if (typeof mina !== "undefined") {
    mina.on("accountsChanged", () => {}); 
  }
}

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

      // const [moduleName, methodName] = resolvedMethodDetails;

      const hash = truncateMiddle(transaction.hash().toString(), 8, 8, "...");
      function description() {
        const { dataTransaction } = wallet;

        const renderTransactionDetails = () => (
          <div className="flex items-center gap-[4px]">
            <a
              // href={urlTransaction}
              // target="_blank"
              // rel="noopener noreferrer"
              className="cursor-pointer text-[10px] font-[600] text-textBlack hover:underline"
            >
              View transaction details
            </a>
            <img
              src="/icon/icon-link.svg"
              alt=""
              className={stylesWallet["icon-details"]}
            />
          </div>
        );

        const renderAmountDetails = () => {
          switch (type) {
            case TRANSACTION_TYPES.SWAP:
              return (
                <p className="h-[14px] text-[12px] text-textBlack opacity-50">
                  {type} {Number(dataTransaction?.amountA).toFixed(5)}{" "}
                  {dataTransaction?.tickerA || ""} for{" "}
                  {formatFullValue(Number(dataTransaction?.amountB).toFixed(5) || "0")}{" "}
                  {dataTransaction?.tickerB || ""}
                </p>
              );
            case TRANSACTION_TYPES.ADD:
            case TRANSACTION_TYPES.REMOVE:
            case TRANSACTION_TYPES.CREATE:
              return (
                <p className="h-[14px] text-[12px] text-textBlack opacity-50">
                  {dataTransaction?.amountA} {dataTransaction?.tickerA || ""}{" "}
                  and {Number(dataTransaction?.amountB).toFixed(5)}{" "}
                  {dataTransaction?.tickerB || ""}
                </p>
              );
            case TRANSACTION_TYPES.TRANSFER:
              return (
                <p className="h-[14px] text-[12px] text-textBlack opacity-50">
                  Transferred {dataTransaction?.amountValue}{" "}
                  {dataTransaction?.ticker || ""} to{" "}
                  {truncateAddress(dataTransaction?.toRecipientAddress || "")}
                </p>
              );
            default:
              return (
                <p className="h-[14px] text-[12px] text-textBlack opacity-50">
                  Hash: {hash}
                </p>
              );
          }
        };

        const renderIcon = (
          src: string | undefined,
          alt: string | undefined,
          className?: string,
          width?: number | undefined,
          height?: number | undefined,
        ) => (
          <ImageCommon
            src={src || ''}
            width={width ? width : 18}
            height={height ? height : 18}
            alt={alt}
            className={className}
            // style={{ marginLeft: "-36px" }}
          />
        );

        const renderCloseIcon = () => (
          <Image
            src="/icon/Close-icon.svg"
            width={18}
            height={18}
            alt=""
            className="absolute cursor-pointer"
            style={{ top: 9, right: 13 }}
          />
        );

        const getStatusContent = () => {
          switch (status) {
            case "PENDING":
              return {
                iconSrc: "/icon/pending-icon.svg",
                message: `${type} sent`,
              };
            case "SUCCESS":
              return {
                iconSrc:
                  type === TRANSACTION_TYPES.ADD ||
                  type === TRANSACTION_TYPES.REMOVE ||
                  type === TRANSACTION_TYPES.CREATE
                    ? [dataTransaction?.logoA, dataTransaction?.logoB]
                    : "/icon/success-icon.svg",
                message:
                  type !== TRANSACTION_TYPES.ADD &&
                  type !== TRANSACTION_TYPES.REMOVE &&
                  type !== TRANSACTION_TYPES.CREATE
                    ? `${type} Successful`
                    : type,
              };
            case "FAILURE":
              return {
                iconSrc:
                  type === TRANSACTION_TYPES.ADD ||
                  type === TRANSACTION_TYPES.REMOVE ||
                  type === TRANSACTION_TYPES.CREATE
                    ? [dataTransaction?.logoA, dataTransaction?.logoB]
                    : "/icon/failed-ico.svg",
                message: `${type} Failed`,
              };
            default:
              return {};
          }
        };

        const { iconSrc, message } = getStatusContent();

        return (
          <>
            {type !== TRANSACTION_TYPES.ADD &&
            type !== TRANSACTION_TYPES.REMOVE &&
            type !== TRANSACTION_TYPES.CREATE ? (
              <div
                className={`flex flex-col items-start ${stylesWallet["content-toast"]}`}
              >
                <span className="flex h-[12px] items-center gap-[4px] text-[12px] font-[500] text-textBlack">
                  {Array.isArray(iconSrc) ? (
                    <div className={`ml-[-12px] mr-[-12px] flex items-center`}>
                      <div className="relative h-[25px] w-[25px] overflow-hidden">
                        {renderIcon(
                          iconSrc[0],
                          "",
                          "absolute h-[25px] w-[25px] left-1/2",
                        )}
                      </div>
                      <div className="relative h-[25px] w-[25px] overflow-hidden">
                        {renderIcon(
                          iconSrc[1],
                          "",
                          "absolute h-[25px] w-[25px] right-1/2",
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginLeft: "-24px" }}>
                      {renderIcon(iconSrc, "", stylesWallet["img-toast"])}
                    </div>
                  )}
                  {message}
                </span>
                {renderAmountDetails()}
                {type !== TRANSACTION_TYPES.ADD &&
                  type !== TRANSACTION_TYPES.REMOVE &&
                  type !== TRANSACTION_TYPES.CREATE &&
                  renderTransactionDetails()}
                {renderCloseIcon()}
              </div>
            ) : (
              <div
                className="flex items-center gap-[8px]"
                style={{ marginLeft: "-20px" }}
              >
                {Array.isArray(iconSrc) ? (
                  <div className={stylesWallet["token-pool-logo"]}>
                    <div className={stylesWallet["token-pool-logo-item-first"]}>
                      {renderIcon(
                        iconSrc[0],
                        "",
                        stylesWallet["pool-logo-item"],
                      )}
                    </div>
                    <div
                      className={stylesWallet["token-pool-logo-item-second"]}
                    >
                      {renderIcon(
                        iconSrc[1],
                        "",
                        stylesWallet["pool-logo-item"],
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: "-24px" }}>
                    {renderIcon(iconSrc, "", stylesWallet["img-toast"], 18, 18)}
                  </div>
                )}
                <div className="flex flex-col items-start gap-[5px] sm:gap-[5px] lg:gap-[6px] xl:gap-[10px]">
                  <span className="flex h-[12px] items-center gap-[4px] text-[12px] font-[500] text-textBlack">
                    {message}
                  </span>
                  {renderAmountDetails()}
                  {type !== TRANSACTION_TYPES.ADD &&
                    type !== TRANSACTION_TYPES.REMOVE &&
                    type !== TRANSACTION_TYPES.CREATE &&
                    renderTransactionDetails()}
                  {renderCloseIcon()}
                </div>
              </div>
            )}
          </>
        );
      }

      toast({
        title: "",
        description: description(),
        className: `bg-bgWhiteColor text-textBlack border-none shadow-content rounded-[12px] w-full ${stylesWallet["toast-container"]}`,
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

export const useNotifications = () => {
  const { toast } = useToast();

  return useCallback(({ message, type }: { message: string; type: string }) => {
    function description({
      message = "",
      type = "",
    }: {
      message: string;
      type: string;
    }) {
      return (
        <>
          <div
            className={`flex flex-col items-start ${stylesWallet["content-toast"]}`}
          >
            <span className="flex h-[12px] items-center gap-[4px] text-[20px] font-medium text-textBlack">
              <div style={{ marginLeft: "-24px" }}>
                <img
                  src={
                    type === FAUCET_SUCCESS
                      ? "/icon/success-icon.svg"
                      : "/icon/failed-ico.svg"
                  }
                  width={18}
                  height={18}
                  alt={"dinodex-transaction"}
                  className={stylesWallet["img-toast"]}
                  // style={{ marginLeft: "-36px" }}
                />
              </div>
              {type === FAUCET_SUCCESS ? "Faucet Success" : "Faucet Failed"}
            </span>
            {message}
            <Image
              src="/icon/Close-icon.svg"
              width={18}
              height={18}
              alt=""
              className="absolute cursor-pointer"
              style={{ top: 9, right: 13 }}
            />
          </div>
        </>
      );
    }
    toast({
      title: "",
      description: description({ message, type }),
      className: `bg-bgWhiteColor text-textBlack border-none shadow-content rounded-[12px] w-full ${stylesWallet["toast-container"]}`,
    });
  }, []);
};
