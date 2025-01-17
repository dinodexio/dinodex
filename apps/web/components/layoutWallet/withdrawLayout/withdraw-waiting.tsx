import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { truncateAddress } from "@/lib/utils";
import styles from "../../css/wallet.module.css";
import { useTokenStore } from "@/lib/stores/token";

export interface WithdrawWaitingProps {
  loading: boolean;
  onClose?: () => void;
  statusLayout?: any;
}

export function WithdrawWaiting({
  onClose,
  statusLayout,
}: WithdrawWaitingProps) {
  const { data: tokens } = useTokenStore();
  const form = useFormContext();
  const fields = form.getValues();
  return (
    <>
      <div className="relative">
        <Image
          src="/icon/Close-icon.svg"
          width={24}
          height={24}
          alt=""
          className="absolute right-[-10px] top-[-12px] cursor-pointer"
          onClick={() => onClose && onClose()}
        />
      </div>
      <div className="flex items-center justify-center">
        <div className="relative">
          <Image
            src={"/icon/loading-waiting.svg"}
            alt="logo"
            width={108}
            height={108}
            className={`${styles["loading-waiting"]} h-[108px] w-[108px] ${statusLayout.waiting ? "opacity-100" : "opacity-0"}`}
            style={{ transition: "opacity 0.3s ease" }}
          />
          <img
            src={tokens[fields.amount_token]?.logo || ""}
            alt="logo"
            width={50}
            height={50}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>
      <div className="mt-[27px] flex flex-col items-center justify-between gap-[8.13px]">
        <span className="text-[15.171px] font-[600] text-textBlack">
          Waiting for confirmation
        </span>
        <span className="text-[10.836px] font-[500] text-textBlack">
          Withdrawing {fields?.amountValue}{" "}
          {tokens[fields.amount_token]?.ticker} to{" "}
          {truncateAddress(fields?.toRecipientAddress)}{" "}
        </span>
        <span className="text-[8.127px] font-[400] text-textBlack opacity-50">
          Confirm this transaction in your wallet
        </span>
      </div>
    </>
  );
}
