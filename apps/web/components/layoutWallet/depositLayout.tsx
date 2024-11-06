import Image from "next/image";
import React from "react";
import { useWalletStore } from "@/lib/stores/wallet";
import { QRCodeSVG } from "qrcode.react";
import styles from '../css/wallet.module.css'

export interface depositLayoutProps {
  onClose: () => void;
}

export function DepositLayout({ onClose }: depositLayoutProps) {
  const { wallet } = useWalletStore();
  const walletAddress = `mina://testnet/${wallet}`;
  return (
    <div
      className={`absolute right-[15px] top-[50%] flex w-[310px] translate-y-[-50%] flex-col rounded-[20px] bg-bgWhiteColor p-3 ${styles['box-shadow-popup-wallet']}`}
      style={{ zIndex: 102 }}
    >
      <div className="flex items-center justify-between pb-[11px] pl-[6px] pr-[8px] pt-[7px]">
        <span className="text-[23.556px] font-[500] text-textBlack">
          Deposit
        </span>
        <span className="cursor-pointer" onClick={() => onClose()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
          >
            <path
              d="M7.75689 6.83295C7.464 6.54006 6.98913 6.54006 6.69623 6.83295C6.40334 7.12584 6.40334 7.60072 6.69623 7.89361L10.9389 12.1363L6.69629 16.3789C6.4034 16.6718 6.4034 17.1467 6.69629 17.4396C6.98918 17.7324 7.46406 17.7324 7.75695 17.4396L11.9996 13.1969L16.2422 17.4396C16.5351 17.7324 17.0099 17.7324 17.3028 17.4396C17.5957 17.1467 17.5957 16.6718 17.3028 16.3789L13.0602 12.1363L17.3029 7.89361C17.5958 7.60072 17.5958 7.12585 17.3029 6.83295C17.01 6.54006 16.5351 6.54006 16.2422 6.83295L11.9996 11.0756L7.75689 6.83295Z"
              fill="#000000"
            />
          </svg>
        </span>
      </div>
      <div className="flex flex-col items-center gap-[15px]">
        <div className={`p-[10px] bg-bgWhiteColor rounded-[12px] shadow-content`}>
          <QRCodeSVG
            value={wallet ? walletAddress : ""}
            size={180}
            level={"H"}
          />
        </div>
        <span className="text-[16px] font-[500] text-textBlack">
          QR code
        </span>
        <div className="flex items-center gap-[6px] w-full">
          <span className={`p-3 h-[38px] rounded-[8px] flex-1 text-[12px] font-[400] text-textBlack bg-bgWhiteColor shadow-content`}>
            {wallet?.slice(0, 6) + "..." + wallet?.slice(-6)}
          </span>
          <div className={`cursor-pointer h-[38px] p-[9px] shadow-content rounded-[8px] bg-bgWhiteColor`} onClick={() => {
            navigator.clipboard.writeText(wallet || "");
            alert("copied!");
          }}>
            <Image
              src="/icon/Copy-icon.svg"
              width={20}
              height={20}
              alt="copy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
