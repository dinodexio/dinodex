"use client";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog";
import { tokens } from "@/tokens";
import { Button } from "../ui/button";
import { useObservePool, useRemoveLiquidity } from "@/lib/stores/xyk";
import { usePoolKey } from "@/lib/xyk/usePoolKey";
import { useObserveBalancePool, useObservePooled } from "@/lib/stores/balances";
import { LPTokenId, TokenPair } from "chain";
import { useSpotPrice } from "@/lib/xyk/useSpotPrice";
import BigNumber from "bignumber.js";
import { Balance, precision, removeTrailingZeroes } from "../ui/balance";
import { notFound, useRouter } from "next/navigation";
import { Card, CardHeader } from "../ui/card";
import Link from "next/link";
import { ModalRemovePool } from "../modalRemovePool/modalRemovePool";
import { PoolPosition } from "./position";
import { Balances } from "../wallet/wallet";
import { TokenId } from "@proto-kit/library";
import stylesButton from "../css/button.module.css";
import styles from "../css/pool.module.css";
import stylesModal from "../css/modal.module.css";
import { Footer } from "../footer";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("@/components/header"), {
  ssr: false,
});

export interface PoolRemoveProps {
  walletElement?: JSX.Element;
  tokenParams?: any;
  balances?: Balances;
}

const valueDeposit = [
  { value: 25, label: "25%" },
  { value: 50, label: "50%" },
  { value: 75, label: "75%" },
  { value: 100, label: "Max" },
];

export function PoolRemove({ tokenParams, balances }: PoolRemoveProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const removeLiquidity = useRemoveLiquidity();

  const [valueRange, setValueRange] = useState(0);

  const { poolKey } = usePoolKey(
    tokenParams?.tokenA?.value,
    tokenParams?.tokenB?.value,
  );

  const pool = useObservePool(poolKey);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueRange(Number(e.target.value));
  };

  const tokenAReserve = useObserveBalancePool(
    tokenParams?.tokenA?.value,
    poolKey,
  );
  const tokenBReserve = useObserveBalancePool(
    tokenParams?.tokenB?.value,
    poolKey,
  );

  const tokenB_amount = new BigNumber("1").dividedBy(
    useSpotPrice(tokenAReserve, tokenBReserve),
  );

  const tokenA_amount = new BigNumber("1").dividedBy(
    useSpotPrice(tokenBReserve, tokenAReserve),
  );

  const valuePer = {
    perA: removeTrailingZeroes(tokenA_amount.toFixed(precision)),
    perB: removeTrailingZeroes(tokenB_amount.toFixed(precision)),
  };

  // Extract token data
  const firstTokenValue = tokenParams?.tokenA?.value || 0;
  const secondTokenValue = tokenParams?.tokenB?.value || 0;
  const firstTokenLabel = tokenParams?.tokenA?.label || "";
  const secondTokenLabel = tokenParams?.tokenB?.label || "";

  // Get the LP Token ID
  const lpToken = LPTokenId.fromTokenPair(
    TokenPair.from(
      TokenId.from(firstTokenValue),
      TokenId.from(secondTokenValue),
    ),
  ).toString();

  // Observe pooled data
  const dataPooled = useObservePooled(
    firstTokenLabel,
    secondTokenLabel,
    balances?.[lpToken]?.toString(),
  );

  const valueTokenPool = useMemo(() => {
    const tokenA_amount = dataPooled?.first
      ? parseFloat(String(dataPooled.first)) * (valueRange / 100)
      : 0;
    const tokenB_amount = dataPooled?.second
      ? parseFloat(String(dataPooled.second)) * (valueRange / 100)
      : 0;

    return {
      tokenA_amount,
      tokenB_amount,
    };
  }, [valueRange, dataPooled]);

  const handleCloseRemovePool = () => {
    setValueRange(0);
  };

  const handleRemoveLiquidity = async () => {
    setLoading(true);
    try {
      if (pool?.exists) {
        const tokenLP_amount = balances?.[lpToken]
          ? (Number(balances?.[lpToken]) * Number(valueRange)) / 100
          : 0;
        const tokenA_amount = Number(valueTokenPool?.tokenA_amount);
        const tokenB_amount = Number(valueTokenPool?.tokenB_amount);
        await removeLiquidity(
          tokenParams?.tokenA?.value,
          tokenParams?.tokenB?.value,
          Math.floor(Number(tokenLP_amount.toString())).toString(),
          // TODO: actually add a limit here based on allowed slippage
          new BigNumber(tokenParams?.tokenA?.value).lt(
            tokenParams?.tokenB?.value,
          )
            ? Math.floor(Number(tokenB_amount.toString())).toString()
            : Math.floor(Number(tokenA_amount.toString())).toString(),
          new BigNumber(tokenParams?.tokenA?.value).lt(
            tokenParams?.tokenB?.value,
          )
            ? Math.floor(Number(tokenA_amount.toString())).toString()
            : Math.floor(Number(tokenB_amount.toString())).toString(),
        );
        return true;
      }
    } catch (error: any) {
      console.log("error", error);
      return error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pool && !pool?.loading && !pool?.exists) {
      notFound();
    }
  }, [pool]);

  return (
    <>
      <Dialog>
        <div className="flex w-full flex-col px-[16px] pb-[8px] pt-8 sm:px-[16px] lg:px-[32px] xl:px-[41px]">
          <Toaster />
          <div className="flex basis-11/12 flex-col 2xl:basis-10/12">
            <Header />
            <div className="mx-auto mt-[40px] flex w-full max-w-[1065px] flex-col items-center justify-center gap-[25px] sm:mt-[40px] lg:mt-[100px] xl:mt-[113.74px]">
              <Card
                className={`mx-auto flex w-full bg-bgWhiteColor max-w-[605px] flex-col gap-[10px] rounded-[24px] border-none px-[8px] py-[8px] sm:gap-[10px] sm:px-[8px] sm:py-[8px] lg:gap-[15px] lg:px-[15px] lg:py-[25px] xl:gap-[15px] xl:px-[15px] xl:py-[25px] ${styles["pool-container"]}`}
                style={{boxShadow: "0px 2px 8px 0px rgba(0, 0, 0, 0.25)"}}
              >
                <CardHeader className="mb-[10px] flex-row items-center justify-between p-0 px-[10px]">
                  <Link href="/pool">
                    {" "}
                    <Image
                      src="/icon/Arrow-2.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                  </Link>
                  <span className="text-[24px] font-[600] text-textBlack">
                    Remove liquidity
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
                    className="rounded-[12px] border-none px-5 py-6 shadow-content"
                    style={{ background: "rgba(255, 96, 59, 0.25)" }}
                  >
                    <span
                      className="text-[16px] font-[400] text-textBlack sm:text-[16px] lg:text-[24px] xl:text-[24px]"
                      style={{ lineHeight: "normal" }}
                    >
                      <strong className="font-[600]">Tip:</strong>Removing pool
                      tokens converts your position back into underlying tokens
                      at the current rate, proportional to your share of the
                      pool. Accrued fees are included in the amounts you
                      receive.
                    </span>
                  </div>
                </div>
                <div className="flex w-full flex-col items-start gap-[30px] rounded-[20px] border-none shadow-content px-[20px] pb-[20px] pt-[30px]">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[18px] font-[600] text-textBlack sm:text-[18px] lg:text-[20px] xl:text-[20px]">
                      Withdraw Amounts
                    </span>
                    {/* <span className="text-[18px] font-[600] text-borderOrColor sm:text-[18px] lg:text-[20px] xl:text-[20px]">
                      Detailed
                    </span> */}
                  </div>
                  <span className="text-[64px] font-[400] text-textBlack sm:text-[64px] lg:text-[96px] xl:text-[96px]">
                    {valueRange}%
                  </span>
                  <div className="h-[31px] w-full">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={valueRange}
                      onChange={handleChange}
                      className={styles["slider"]}
                    />
                  </div>
                  <div className="mt-[-10px] flex w-full items-center justify-between sm:mt-[-10px] lg:mt-0 xl:mt-0">
                    {valueDeposit?.map((item: any) => {
                      return (
                        <div
                          className="w-max cursor-pointer rounded-[8px] border-none shadow-content px-[19px] py-[10px] text-[20px] font-[600] text-textBlack hover:bg-[#E8E8E8] sm:w-max sm:px-[19px] sm:py-[10px] sm:text-[20px] lg:w-[105px] lg:px-[28px] lg:py-[18px] lg:text-[24px] xl:w-[105px] xl:px-[28px] xl:py-[18px] xl:text-[24px]"
                          style={{ transition: "all 0.3s ease" }}
                          onClick={() => setValueRange(item?.value)}
                          key={item.value}
                        >
                          {item?.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="my-[5px] flex w-full items-center justify-center">
                  <Image
                    src={"/icon/Arrow-2.svg"}
                    alt=""
                    width={15}
                    height={15}
                    style={{ transform: "rotate(-90deg)" }}
                  />
                </div>
                <div className="flex w-full flex-col items-start gap-[15px] rounded-[20px] border-none shadow-content px-[20px] py-[20px]">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[16px] font-[600] text-textBlack sm:text-[16px] lg:text-[20px] xl:text-[20px]">
                      {BigNumber(valueTokenPool?.tokenA_amount || 0)
                        .dividedBy(10 ** precision)
                        .toString()}
                    </span>
                    <div className="flex items-center gap-[5px]">
                      <Image
                        src={tokens[tokenParams?.tokenA?.value]?.logo || ""}
                        width={28}
                        height={28}
                        alt=""
                        className="h-5 w-5 sm:h-5 sm:w-5 lg:h-[28px] lg:w-[28px] xl:h-[28px] xl:w-[28px]"
                      />
                      <span className="text-[16px] font-[500] text-textBlack sm:text-[16px] lg:text-[20px] xl:text-[20px]">
                        {tokenParams?.tokenA?.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[16px] font-[600] text-textBlack sm:text-[16px] lg:text-[20px] xl:text-[20px]">
                      {BigNumber(valueTokenPool?.tokenB_amount || 0)
                        .dividedBy(10 ** precision)
                        .toString()}
                    </span>
                    <div className="flex items-center gap-[5px]">
                      <Image
                        src={tokens[tokenParams?.tokenB?.value]?.logo || ""}
                        width={28}
                        height={28}
                        alt=""
                        className="h-5 w-5 sm:h-5 sm:w-5 lg:h-[28px] lg:w-[28px] xl:h-[28px] xl:w-[28px]"
                      />
                      <span className="text-[16px] font-[500] text-textBlack sm:text-[16px] lg:text-[20px] xl:text-[20px]">
                        {tokenParams?.tokenB?.label}
                      </span>
                    </div>
                  </div>
                  {/* <div className="flex w-full items-center justify-end">
                    <div className="py-[8px] px-[18px] flex items-center justify-center rounded-full bg-white border border-textBlack">
                      <span className="text-[14px] xl:text-[20px] lg:text-[20px] sm:text-[14px] text-borderOrColor font-[600]">Receive ETH</span>
                    </div>
                  </div> */}
                </div>
                <div className="flex w-full items-start justify-between rounded-[20px] px-[20px] py-[20px]">
                  <span className="text-[16px] font-[500] text-textBlack sm:text-[16px] lg:text-[20px] xl:text-[20px]">
                    Rates
                  </span>
                  <div className="flex flex-col items-end gap-[20px]">
                    <span className="text-[16px] font-[500] text-textBlack sm:text-[16px] lg:text-[20px] xl:text-[20px]">
                      1 {tokenParams?.tokenA?.label} ={" "}
                      {isFinite(parseFloat(valuePer?.perB))
                        ? valuePer?.perB
                        : "~"}{" "}
                      {tokenParams?.tokenB?.label}
                    </span>
                    <span className="text-[16px] font-[500] text-textBlack sm:text-[16px] lg:text-[20px] xl:text-[20px]">
                      1 {tokenParams?.tokenB?.label} ={" "}
                      {isFinite(parseFloat(valuePer?.perA))
                        ? valuePer?.perA
                        : "~"}{" "}
                      {tokenParams?.tokenA?.label}
                    </span>
                  </div>
                </div>
                <div className="w-full">
                  {/* <Button
                    loading={approve.loading}
                    type={"submit"}
                    className={`${approve.approve ? "btn-disable" : "button-swap btn-supply-remove"}`}
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
                  ) : ( */}

                  <DialogTrigger
                    asChild
                    disabled={
                      Number(valueTokenPool?.tokenA_amount) / 100 === 0 &&
                      Number(valueTokenPool?.tokenB_amount) / 100 === 0
                    }
                  >
                    <Button
                      loading={false}
                      type={"submit"}
                      disabled={
                        Number(valueTokenPool?.tokenA_amount) / 100 === 0 &&
                        Number(valueTokenPool?.tokenB_amount) / 100 === 0
                      }
                      className={`${stylesButton["button-swap"]} ${stylesButton["btn-supply-remove"]} w-full`}
                      // onClick={handleRemoveLiquidity}
                    >
                      <span>Remove</span>
                    </Button>
                  </DialogTrigger>
                  {/* )} */}
                </div>
                <PoolPosition
                  paramPooled={dataPooled}
                  paramLPToken={lpToken}
                  tokenParams={tokenParams}
                  balances={balances}
                />
              </Card>
            </div>
            <Footer />
          </div>
        </div>
        <DialogOverlay className="bg-[rgba(0,0,0,0.5)]" />
        <DialogContent
          className={`${stylesModal["modal-container"]} ${stylesModal["modal-pool"]} w-[99%] max-w-[625px] border-none bg-white px-[20px] pb-[20px] pt-[27px] sm:px-[20px] sm:pt-[27px] lg:px-[30px] lg:pt-[35px] xl:px-[30px] xl:pt-[35px]`}
        >
          <ModalRemovePool
            onConfirm={handleRemoveLiquidity}
            valueTokenPool={valueTokenPool}
            valuePer={valuePer}
            tokenParams={tokenParams}
            loading={loading}
            onCloseRemovePool={handleCloseRemovePool}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
