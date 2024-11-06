import Image from "next/image";
import React, { use, useEffect, useMemo } from "react";
import styles from "../css/wallet.module.css";
import stylesButton from "../css/button.module.css";
import { useWalletStore } from "@/lib/stores/wallet";
import { useBalance, useBalancesStore } from "@/lib/stores/balances";
import { useClientStore } from "@/lib/stores/client";
import BigNumber from "bignumber.js";
import { precision } from "../ui/balance";
import { PRICE_MINA, PRICE_USD } from "@/constants";
import { formatNumber } from "@/lib/utils";

export interface changeWalletLayoutProps {
  onClose: () => void;
  address: string;
}

let LIST_DUMMY_WALLET = [
  {
    id: 1,
    address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBYog",
    name: "Wallet 1",
    value_price: 0,
    mina_coin: 0,
  },
  {
    id: 2,
    address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBY07",
    name: "Wallet 2",
    value_price: 0,
    mina_coin: 0,
  },
  {
    id: 3,
    address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBY05",
    name: "Wallet 3",
    value_price: 0,
    mina_coin: 0,
  },
  {
    id: 4,
    address: "B62qkwMJEQSTKdJUjtgZxwC2BzPRYR8BH9VryMQa9hX7nmWYqLPBY02",
    name: "Wallet 4",
    value_price: 0,
    mina_coin: 0,
  },
];

export function ChangeWalletLayout({
  onClose,
  address,
}: changeWalletLayoutProps) {
  const { wallet, disconnectWallet } = useWalletStore();
  const balance = useBalance("0", wallet);
  // Memoize balance result and dataWallet
  const result = useMemo(
    () =>
      balance
        ? BigNumber(balance).dividedBy(10 ** precision).toNumber()
        : 0,
    [balance],
  );
  const dataWallet = useMemo(
    () => ({
      address: wallet,
      name: "Account 1",
      value_price: formatNumber(result * PRICE_MINA),
      mina_coin: formatNumber(result),
    }),
    [wallet, result],
  );
  const listAddresss = useMemo(
    () => [dataWallet, ...LIST_DUMMY_WALLET],
    [dataWallet],
  );

  return (
    <div
      className={`absolute top-[50%] flex w-[95%] max-w-[310px] 
            translate-y-[-50%] flex-col gap-[12px] rounded-[20px] bg-bgWhiteColor p-3 shadow-popup`}
      style={{ zIndex: 102 }}
    >
      <div className="flex items-center justify-between px-[6px] py-[7px]">
        <span className="text-textBlack text-[20px] font-[500]">
          Select an account
        </span>
        <Image
          src="/icon/Close-icon.svg"
          width={24}
          height={24}
          alt=""
          className="cursor-pointer"
          onClick={() => onClose && onClose()}
        />
      </div>
      <div className="mt-[4px] flex w-full flex-col gap-[4px] rounded-[12px] border border-textBlack pb-2 pt-[4px]">
        <div className={`flex w-full flex-col ${styles["list-wallet"]}`}>
          {listAddresss.map((item) => (
            <div
              className={`flex w-full cursor-pointer items-center justify-between p-2 transition-all duration-300 ease-in-out ${styles["wallet-item"]}`}
              key={item.address}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-[35px] w-[2px] rounded-[8px] ${address === item.address ? "bg-borderOrColor" : "bg-transparent"}`}
                />
                <div className="flex flex-col gap-1">
                  <span className="text-textBlack text-[14px] font-[500]">
                    {item.name}
                  </span>
                  <span className="text-textBlack text-[12px] font-[400] opacity-50">
                    {item.address
                      ? item.address.slice(0, 5) +
                        "..." +
                        item.address.slice(-5)
                      : "—"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-textBlack text-[12px] font-[500] opacity-60">
                  ${BigNumber(item?.value_price || 0)?.toFixed(2)} USD
                </span>
                <div className="flex items-center gap-[3px]">
                  <Image src="/tokens/mina.svg" width={15} height={15} alt="" />
                  <span className="text-textBlack text-[14px] font-[400]">
                    {item?.mina_coin} MINA
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          className={`${stylesButton["button-disconnect-wallet"]} mx-2`}
          onClick={() => disconnectWallet()}
        >
          Disconnect
        </div>
      </div>
    </div>
  );
}
