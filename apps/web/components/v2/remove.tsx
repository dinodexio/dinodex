"use client";
import { Header } from "../header";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import "../style.css";
import { LIST_FEE_TIER } from "@/constants";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModalListToken } from "../modalListToken/modalListToken";
import { ModalPreviewPool } from "../modalPreviewPool/modalPreviewPool";
import { tokens } from "@/tokens";
import { Button } from "../ui/button";
import {
  useAddLiquidity,
  useCreatePool,
  useObservePool,
} from "@/lib/stores/xyk";
import { usePoolKey } from "@/lib/xyk/usePoolKey";
import {
  useObserveBalance,
  useObserveTotalSupply,
} from "@/lib/stores/balances";
import { useWalletStore } from "@/lib/stores/wallet";
import { LPTokenId } from "chain";
import { useSpotPrice } from "@/lib/xyk/useSpotPrice";
import BigNumber from "bignumber.js";
import {
  addPrecision,
  removePrecision,
} from "@/containers/xyk/add-liquidity-form";
import { Balance, precision, removeTrailingZeroes } from "../ui/balance";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "../ui/card";
import Link from "next/link";
import { ModalSupplyComfirm } from "../modalSupplyConfirm/modalSupplyConfirm";
import { ModalRemovePool } from "../modalRemovePool/modalRemovePool";
import { PoolPosition } from "./position";
export interface PoolAddProps {
  walletElement?: JSX.Element;
  tokenParams?: any;
}

const initDataPoolCreate = {
  tokenPool: {
    first: null,
    second: null,
  },
  tokenLP_amount: null,
  feeTier: 1,
  valueMinPrice: {
    first: 0,
    second: 0,
  },
  deposit_amount: {
    first: null,
    second: null,
    first_token: undefined,
    second_token: undefined,
  },
};

const valueDeposit = [
  { value: 25, label: '25%' },
  { value: 50, label: '50%' },
  { value: 75, label: '75%' },
  { value: 100, label: 'Max' },
]

export function PoolRemove({ walletElement, tokenParams }: PoolAddProps) {

  const [valueRange, setValueRange] = useState(0);

  const [approve, setApprove] = useState({
    approve: false,
    loading: false,
  });

  const clickApprove = () => {
    if (approve.approve) return
    setApprove({
      ...approve,
      loading: true,
    })

    setTimeout(() => {
      setApprove({
        ...approve,
        approve: true,
        loading: false,
      })
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueRange(Number(e.target.value));
  };

  return (
    <>
      <Dialog>
        <div className="flex w-full flex-col px-[16px] pb-[8px] pt-8 sm:px-[16px] lg:px-[32px] xl:px-[41px]">
          <Toaster />
          <div className="flex basis-11/12 flex-col 2xl:basis-10/12">
            <Header />
            <div className="mx-auto mt-[40px] flex flex-col w-full max-w-[1065px] items-center justify-center gap-[25px] sm:mt-[40px] lg:mt-[100px] xl:mt-[113.74px]">
              <Card className="w-full max-w-[605px] mx-auto rounded-[24px] bg-transparent border-none xl:border-solid lg:border-solid sm:border-none border-textBlack px-0 xl:px-[15px] lg:px-[15px] sm:px-0 py-[0] xl:py-[25px] lg:py-[25px] sm:py-0 flex flex-col gap-[10px] xl:gap-[15px] lg:gap-[15px] sm:gap-[10px]">
                <CardHeader className="mb-[10px] flex-row items-center justify-between p-0 px-[10px]">
                  <Link href="/pool"> <Image src="/icon/Arrow-2.svg" alt="" width={20} height={20} /></Link>
                  <span className="text-[24px] font-[600] text-textBlack">
                    Add liquidity
                  </span>
                  <Image
                    src="/icon/icon-setting.svg"
                    alt=""
                    width={30}
                    height={30}
                  />
                </CardHeader>
                <div className="flex flex-col gap-[15px] p-0">
                  <div
                    className="px-5 py-6 rounded-[12px] border border-textBlack"
                    style={{ background: "rgba(255, 96, 59, 0.25)" }}
                  >
                    <span
                      className="text-[16px] xl:text-[24px] lg:text-[24px] sm:text-[16px] font-[400] text-textBlack"
                      style={{ lineHeight: "normal" }}
                    >
                      <strong className="font-[600]">Tip:</strong>When you add
                      liquidity, you will receive pool tokens representing your
                      position. These tokens automatically earn fees proportional
                      to your share of the pool, and can be redeemed at any time.
                    </span>
                  </div>
                </div>
                <div className="px-[20px] pt-[30px] pb-[20px] rounded-[20px] border border-textBlack flex flex-col items-start gap-[30px] w-full">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[18px] xl:text-[20px] lg:text-[20px] sm:text-[18px] text-textBlack font-[600]">Deposit Amounts</span>
                    <span className="text-[18px] xl:text-[20px] lg:text-[20px] sm:text-[18px] text-borderOrColor font-[600]">Detailed</span>
                  </div>
                  <span className="text-[64px] xl:text-[96px] lg:text-[96px] sm:text-[64px] text-textBlack font-[400]">{valueRange}%</span>
                  <div className="w-full h-[31px]">
                    <input type="range" min={0} max={100} value={valueRange} onChange={handleChange} className="slider" />
                  </div>
                  <div className="flex w-full items-center justify-between mt-[-10px] xl:mt-0 lg:mt-0 sm:mt-[-10px]">
                    {valueDeposit?.map((item: any) => {
                      return (
                        <div className="w-max xl:w-[105px] lg:w-[105px] sm:w-max px-[19px] xl:px-[28px] lg:px-[28px] sm:px-[19px] py-[10px] xl:py-[18px] lg:py-[18px] sm:py-[10px] border border-textBlack rounded-[8px] text-[20px] xl:text-[24px] lg:text-[24px] sm:text-[20px] font-[600] text-textBlack cursor-pointer hover:bg-[#E8E8E8]" style={{ transition: 'all 0.3s ease' }} onClick={() => setValueRange(item?.value)} key={item.value}>{item?.label}</div>
                      )
                    })}
                  </div>
                </div>
                <div className="w-full flex items-center justify-center my-[5px]">
                  <Image src={"/icon/Arrow-2.svg"} alt="" width={15} height={15} style={{ transform: 'rotate(-90deg)' }} />
                </div>
                <div className="px-[20px] py-[20px] rounded-[20px] border border-textBlack flex flex-col items-start gap-[15px] w-full">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[16px] xl:text-[20px] lg:text-[20px] sm:text-[16px] text-textBlack font-[600]">-</span>
                    <div className="flex items-center gap-[5px]">
                      <Image src={"/tokens/btc.svg"} width={28} height={28} alt="" className="h-5 w-5 sm:h-5 sm:w-5 lg:h-[28px] lg:w-[28px] xl:h-[28px] xl:w-[28px]" />
                      <span className="text-[16px] xl:text-[20px] lg:text-[20px] sm:text-[16px] text-textBlack font-[500]">USDC</span>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[16px] xl:text-[20px] lg:text-[20px] sm:text-[16px] text-textBlack font-[600]">-</span>
                    <div className="flex items-center gap-[5px]">
                      <Image src={"/tokens/btc.svg"} width={28} height={28} alt="" className="h-5 w-5 sm:h-5 sm:w-5 lg:h-[28px] lg:w-[28px] xl:h-[28px] xl:w-[28px]" />
                      <span className="text-[16px] xl:text-[20px] lg:text-[20px] sm:text-[16px] text-textBlack font-[500]">ETH</span>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-end">
                    <div className="py-[8px] px-[18px] flex items-center justify-center rounded-full bg-white border border-textBlack">
                      <span className="text-[14px] xl:text-[20px] lg:text-[20px] sm:text-[14px] text-borderOrColor font-[600]">Receive ETH</span>
                    </div>
                  </div>
                </div>
                <div className="px-[20px] py-[20px] rounded-[20px] flex items-start justify-between w-full">
                  <span className="text-[16px] xl:text-[20px] lg:text-[20px] sm:text-[16px] text-textBlack font-[500]">Rates</span>
                  <div className="flex flex-col items-end gap-[20px]">
                    <span className="text-[16px] xl:text-[20px] lg:text-[20px] sm:text-[16px] text-textBlack font-[500]">1 ETH = 1772.43 USDC</span>
                    <span className="text-[16px] xl:text-[20px] lg:text-[20px] sm:text-[16px] text-textBlack font-[500]">1 USDC = 0.000564252 ETH</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    loading={approve.loading}
                    type={"submit"}
                    className={`${approve.approve ? 'btn-disable' : 'button-swap btn-supply-remove'}`}
                    onClick={() => clickApprove()}
                  >
                    <span>Approve</span>
                  </Button>
                  {!approve.approve ? (
                    <Button
                      loading={false}
                      type={"submit"}
                      className={`btn-disable`}
                    >
                      <span>Remove</span>
                    </Button>
                  ) : (
                    <DialogTrigger>
                      <Button
                        loading={false}
                        type={"submit"}
                        className={`button-swap btn-supply-remove`}
                      >
                        <span>Remove</span>
                      </Button>
                    </DialogTrigger>
                  )}
                </div>
                <PoolPosition />
              </Card>
            </div>
          </div>
        </div>
        <DialogOverlay className="bg-[rgba(0,0,0,0.5)]" />
        <DialogContent
          className="modal-container modal-pool bg-white px-[20px] xl:px-[30px] lg:px-[30px] sm:px-[20px] pt-[27px] xl:pt-[35px] lg:pt-[35px] sm:pt-[27px] pb-[20px] w-[99%] max-w-[625px] border-none"
        >
          <ModalRemovePool />
        </DialogContent>
      </Dialog>
      {walletElement}
    </>
  );
}
