import Image from "next/image";
import React from "react";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import styles from '../../css/pool.module.css'
import stylesButton from '../../css/button.module.css'

export interface layoutWaitingAndSuccessProps {
  statusLayout: any;
  tokenParams?: any;
  valueTokenPool?: any;
  handleClosePool?: () => void;
  type: string;
}

export function LayoutWaitingAndSuccess({
  statusLayout,
  tokenParams,
  valueTokenPool,
  handleClosePool,
  type,
}: layoutWaitingAndSuccessProps) {
  const tokenA_amount =
    type === "remove"
      ? Number(valueTokenPool?.tokenA_amount) / 100
      : valueTokenPool?.tokenA_amount;
  const tokenB_amount =
    type === "remove"
      ? Number(valueTokenPool?.tokenB_amount) / 100
      : valueTokenPool?.tokenB_amount;
  const textType = type === "remove" ? "Removing" : "Deposited";
  return (
    <div className={`${styles["modal-waiting"]} h-max w-full`}>
      <div className="relative mb-[15px] flex flex-col items-center justify-center gap-[50px]">
        <DialogClose className="absolute right-[-6px] top-[-10px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.01502 10.7131L15.9288 17.6269C16.1593 17.8495 16.468 17.9727 16.7885 17.9699C17.1089 17.9671 17.4154 17.8386 17.642 17.612C17.8686 17.3854 17.9972 17.0789 18 16.7584C18.0027 16.438 17.8796 16.1293 17.6569 15.8988L10.7432 8.98498L17.6569 2.07121C17.8796 1.84071 18.0027 1.53199 18 1.21154C17.9972 0.891095 17.8686 0.584562 17.642 0.357963C17.4154 0.131365 17.1089 0.0028308 16.7885 4.62009e-05C16.468 -0.0027384 16.1593 0.120449 15.9288 0.343075L9.01502 7.25685L2.10125 0.343075C1.86971 0.125952 1.56278 0.00742745 1.24541 0.012581C0.928031 0.0177346 0.625112 0.146162 0.400744 0.370689C0.176376 0.595215 0.0481627 0.898225 0.0432336 1.2156C0.0383046 1.53298 0.157046 1.83983 0.374333 2.07121L7.28688 8.98498L0.373111 15.8988C0.256382 16.0115 0.163276 16.1464 0.0992235 16.2955C0.0351712 16.4446 0.0014563 16.6049 4.61452e-05 16.7672C-0.00136401 16.9295 0.0295585 17.0904 0.0910099 17.2406C0.152461 17.3908 0.243211 17.5273 0.357963 17.642C0.472715 17.7568 0.609172 17.8475 0.759371 17.909C0.90957 17.9704 1.0705 18.0014 1.23278 18C1.39506 17.9985 1.55543 17.9648 1.70454 17.9008C1.85365 17.8367 1.98851 17.7436 2.10125 17.6269L9.01502 10.7131Z"
              fill="black"
            />
          </svg>
        </DialogClose>
        <div className="relative">
          <div
            className={`${styles["loading-waiting"]} ${statusLayout.waiting ? "opacity-100" : "opacity-0"}`}
            style={{ transition: "opacity 0.3s ease" }}
          >
            <Image
              src={"/icon/loading-waiting.svg"}
              alt="logo"
              width={200}
              height={200}
              className="h-[150px] w-[150px] sm:h-[150px] sm:w-[150px] lg:h-[200px] lg:w-[200px] xl:h-[200px] xl:w-[200px]"
            />
          </div>
          <div
            className={`absolute top-0 ${statusLayout.success ? "opacity-100" : "opacity-0"}`}
            style={{ transition: "opacity 0.3s ease" }}
          >
            <Image
              src={"/icon/submitted-icon.svg"}
              alt="logo"
              width={200}
              height={200}
              className="h-[150px] w-[150px] sm:h-[150px] sm:w-[150px] lg:h-[200px] lg:w-[200px] xl:h-[200px] xl:w-[200px]"
            />
          </div>
        </div>
        {statusLayout.waiting && (
          <div
            className={`flex flex-col items-center justify-center gap-[12px] sm:gap-[12px] lg:gap-[15px] xl:gap-[15px] ${statusLayout.waiting ? "visible opacity-100" : "invisible opacity-0"}`}
            style={{ transition: "all 0.3s ease" }}
          >
            <span className="text-[22px] font-[600] text-textBlack sm:text-[22px] lg:text-[28px] xl:text-[28px]">
              Waiting for confirmation
            </span>
            <span className="text-[16px] font-[500] text-textBlack sm:text-[16px] lg:text-[20px] xl:text-[20px]">
              {textType} {tokenA_amount} {tokenParams?.tokenA?.label} and{" "}
              {tokenB_amount} {tokenParams?.tokenB?.label}
            </span>
            <span className="text-[14px] font-[400] text-textBlack opacity-50 sm:text-[14px] lg:text-[15px] xl:text-[15px]">
              Confirm this transaction in your wallet
            </span>
          </div>
        )}
        {statusLayout.success && (
          <div
            className={`flex w-full flex-col items-center justify-center gap-[10px] sm:gap-[10px] lg:gap-[15px] xl:gap-[15px] ${statusLayout.success ? "visible opacity-100" : "invisible opacity-0"}`}
            style={{ transition: "all 0.3s ease" }}
          >
            <span className="text-[22px] font-[600] text-textBlack sm:text-[22px] lg:text-[28px] xl:text-[28px]">
              Transaction submitted
            </span>
            <DialogClose className="w-full">
              <Button
                loading={false}
                type={"submit"}
                className={`${stylesButton["button-swap"]} ${stylesButton["btn-supply-remove"]}`}
                style={{ width: "100%" }}
                onClick={() => handleClosePool && handleClosePool()}
              >
                <span>Close</span>
              </Button>
            </DialogClose>
            <span className="text-[14px] font-[400] text-borderOrColor sm:text-[14px] lg:text-[15px] xl:text-[15px]">
              View on Etherscan
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
