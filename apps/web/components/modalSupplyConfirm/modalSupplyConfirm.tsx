import Image from "next/image";
import React, { useEffect } from "react";
import "../style.css";
import { DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";
import { tokens } from "@/tokens";
import { Balance } from "../ui/balance";
import { LayoutWaitingAndSuccess } from "../modalRemovePool/layoutModal/layoutWaitingAndSuccess";

export interface modalSupplyComfirmProps {
  dataPool?: any;
  valuePer?: any;
  loading?: boolean;
  onClickAddPool?: () => void;
  onClosePool?: () => void;
  tokenParams?: any;
}

export function ModalSupplyComfirm({
  dataPool,
  valuePer,
  loading,
  onClickAddPool,
  onClosePool,
  tokenParams,
}: modalSupplyComfirmProps) {
  const [layoutModalRemovePool, setLayoutModalRemovePool] = React.useState({
    confirm: true,
    waiting: false,
    success: false,
  });

  const clickConfirm = () => {
    setLayoutModalRemovePool({
      ...layoutModalRemovePool,
      confirm: false,
      waiting: true,
    });
    onClickAddPool && onClickAddPool();
  };

  const handleClosePool = () => {
    onClosePool && onClosePool();
  };

  useEffect(() => {
    if (layoutModalRemovePool.waiting) {
      setLayoutModalRemovePool({
        ...layoutModalRemovePool,
        waiting: loading ? true : false,
        success: loading ? false : true,
      });
    }
  }, [loading]);

  const dataTokenPool = {
    tokenA_amount: dataPool?.deposit_amount?.first,
    tokenB_amount: dataPool?.deposit_amount?.second,
  };

  return (
    <>
      {layoutModalRemovePool.confirm ? (
        <div className="h-max w-full">
          <div className="relative flex items-center justify-center ">
            <span className="text-[20px] font-[400] text-black sm:text-[20px] lg:text-[24px] xl:text-[24px]">
              You will revieve
            </span>
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
          </div>
          <div className="mt-[33px] flex w-full flex-col items-center justify-center gap-[30px]">
            <div className="flex items-center justify-center sm:items-center lg:items-end xl:items-end">
              <span
                className="text-[34px] font-[600] text-black sm:text-[34px] lg:text-[52px] xl:text-[52px]"
                style={{ lineHeight: "52px", letterSpacing: "-1px" }}
              >
                {dataPool?.tokenLP_amount}
              </span>
              <div
                className="content-modal-preview-header-token"
                style={{ gap: 0 }}
              >
                <Image
                  src={
                    tokens[dataPool?.tokenPool?.first?.value]?.logo as string
                  }
                  width={28}
                  height={28}
                  className="h-5 w-5 sm:h-5 sm:w-5 lg:h-[28px] lg:w-[28px] xl:h-[28px] xl:w-[28px]"
                  alt=""
                />
                <Image
                  src={
                    tokens[dataPool?.tokenPool?.second?.value]?.logo as string
                  }
                  width={28}
                  height={28}
                  className="h-5 w-5 sm:h-5 sm:w-5 lg:h-[28px] lg:w-[28px] xl:h-[28px] xl:w-[28px]"
                  alt=""
                  style={{ marginLeft: "-11px" }}
                />
              </div>
            </div>
            <div className="flex w-full flex-col items-start justify-center gap-[15px] sm:gap-[15px] lg:gap-[45px] xl:gap-[45px]">
              <span className="text-[18px] font-[600] text-black sm:text-[18px] lg:text-[28px] xl:text-[28px]">
                {dataPool?.tokenPool?.first?.label}/
                {dataPool?.tokenPool?.second?.label} Pool Tokens
              </span>
              <span className="text-[12px] font-[400] italic text-black opacity-[0.5] sm:text-[12px] lg:text-[15px] xl:text-[15px]">
                Output is estimated. If the price changes by more than 0.5% your
                transaction will revert.
              </span>
              <div className="mt-0 flex w-full flex-col items-start justify-center gap-[20px] sm:mt-0 sm:gap-[20px] lg:mt-[-25px] lg:gap-[30px] xl:mt-[-25px] xl:gap-[30px]">
                <div className="flex w-full items-center justify-between">
                  <span className="text-[16px] font-[500] text-black sm:text-[16px] lg:text-[20px] xl:text-[20px]">
                    {dataPool?.tokenPool?.first?.label} Deposited
                  </span>
                  <span className="flex items-center gap-1 text-[16px] font-[500] text-black sm:text-[16px] lg:text-[20px] xl:text-[20px]">
                    <Image
                      src={
                        tokens[dataPool?.tokenPool?.first?.value]
                          ?.logo as string
                      }
                      width={28}
                      height={28}
                      alt=""
                    />
                    {dataPool?.deposit_amount?.first}
                  </span>
                </div>
                <div className="flex w-full items-center justify-between">
                  <span className="text-[16px] font-[500] text-black sm:text-[16px] lg:text-[20px] xl:text-[20px]">
                    {dataPool?.tokenPool?.second?.label} Deposited
                  </span>
                  <span className="flex items-center gap-1 text-[16px] font-[500] text-black sm:text-[16px] lg:text-[20px] xl:text-[20px]">
                    <Image
                      src={
                        tokens[dataPool?.tokenPool?.second?.value]
                          ?.logo as string
                      }
                      width={28}
                      height={28}
                      alt=""
                    />
                    {dataPool?.deposit_amount?.second}
                  </span>
                </div>
                <div className="flex w-full items-center justify-between">
                  <span className="text-[16px] font-[500] text-black sm:text-[16px] lg:text-[20px] xl:text-[20px]">
                    Rate
                  </span>
                  <div className="flex flex-col items-end gap-5  text-[16px] font-[500] text-black sm:text-[16px] lg:text-[20px] xl:text-[20px]">
                    <span>
                      1 {dataPool?.tokenPool?.first?.label} = {valuePer?.perB}{" "}
                      {dataPool?.tokenPool?.second?.label}
                    </span>
                    <span>
                      1 {dataPool?.tokenPool?.second?.label} = {valuePer?.perA}{" "}
                      {dataPool?.tokenPool?.first?.label}
                    </span>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between">
                  <span className="text-[16px] font-[500] text-black sm:text-[16px] lg:text-[20px] xl:text-[20px]">
                    Share of Pool
                  </span>
                  <span className="flex items-center gap-1 text-[16px] font-[500] text-black sm:text-[16px] lg:text-[20px] xl:text-[20px]">
                    0.00002051%
                  </span>
                </div>
              </div>
              <Button
                loading={loading}
                className={`button-swap btn-prview btn-approve-new mt-0 sm:mt-0 lg:mt-[-25px] xl:mt-[-25px]`}
                onClick={() => clickConfirm()}
              >
                <span>Confirm</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <LayoutWaitingAndSuccess
          type="add"
          statusLayout={layoutModalRemovePool}
          tokenParams={tokenParams}
          valueTokenPool={dataTokenPool}
          handleClosePool={handleClosePool}
        />
      )}
    </>
  );
}
