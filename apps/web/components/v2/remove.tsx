"use client";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useObservePool, useRemoveLiquidity } from "@/lib/stores/xyk";
import { usePoolKey } from "@/lib/xyk/usePoolKey";
import { useObserveBalancePool, useObservePooled } from "@/lib/stores/balances";
import { LPTokenId, TokenPair } from "chain";
import { useSpotPrice } from "@/lib/xyk/useSpotPrice";
import BigNumber from "bignumber.js";
import { precision, removeTrailingZeroes } from "../ui/balance";
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
import { formatBigNumber } from "@/lib/utils";
import { dataSubmitProps } from "@/types";
import { Input } from "../ui/input";
import useClickOutside from "@/hook/useClickOutside";
import { useTokenStore } from "@/lib/stores/token";
const Header = dynamic(() => import("@/components/headerv2"), {
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
  const { data: tokens } = useTokenStore();
  // const router = useRouter();
  const [loading, setLoading] = useState(false);
  const removeLiquidity = useRemoveLiquidity();

  const [valueRange, setValueRange] = useState(0);

  const [openSetting, setOpenSetting] = useState(false);

  const [settingSlippage, setSettingSlippage] = useState({
    default: 0.5,
    value: "",
    transactionDeadline: "",
  });
  const settingRef = useClickOutside<HTMLDivElement>(() => {
    setOpenSetting(false);
  });

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
      ? BigNumber(dataPooled.first).multipliedBy(valueRange / 100)
      : 0;
    const tokenB_amount = dataPooled?.second
      ? BigNumber(dataPooled.second).multipliedBy(valueRange / 100)
      : 0;

    return {
      tokenA_amount,
      tokenB_amount,
    };
  }, [valueRange, dataPooled]);

  const handleCloseRemovePool = (isClear?: boolean) => {
    isClear && setValueRange(0);
  };

  const handleRemoveLiquidity = async () => {
    setLoading(true);
    const data: dataSubmitProps = {
      logoA: tokens[firstTokenValue]?.logo,
      logoB: tokens[secondTokenValue]?.logo,
      tickerA: tokens[firstTokenValue]?.ticker,
      tickerB: tokens[secondTokenValue]?.ticker,
      amountA: formatBigNumber(
        BigNumber(valueTokenPool?.tokenA_amount || 0).dividedBy(
          10 ** precision,
        ),
      ),
      amountB: formatBigNumber(
        BigNumber(valueTokenPool?.tokenB_amount || 0).dividedBy(
          10 ** precision,
        ),
      ),
    };
    try {
      if (pool?.exists) {
        const tokenLP_amount = balances?.[lpToken]
          ? (Number(balances?.[lpToken]) * Number(valueRange)) / 100
          : 0;
        const tokenA_amount = Number(valueTokenPool?.tokenA_amount);
        const tokenB_amount = Number(valueTokenPool?.tokenB_amount);

        const tokenPair = TokenPair.from(
          TokenId.from(firstTokenValue),
          TokenId.from(secondTokenValue),
        );

        const isVectorAB = tokenPair.tokenAId.toString() === firstTokenValue;

        const calculateMinAmount = (amount: number) =>
          Math.floor(
            amount *
              (1 -
                (Number(settingSlippage?.value) || settingSlippage.default) /
                  100),
          ).toString();

        const minAmountA = calculateMinAmount(tokenA_amount);
        const minAmountB = calculateMinAmount(tokenB_amount);

        const tokenAmounts = isVectorAB
          ? { minAmountA, minAmountB }
          : { minAmountA: minAmountB, minAmountB: minAmountA };

        await removeLiquidity(
          firstTokenValue,
          secondTokenValue,
          Math.floor(Number(tokenLP_amount.toString())).toString(),
          // TODO: actually add a limit here based on allowed slippage
          tokenAmounts.minAmountA,
          tokenAmounts.minAmountB,
          data,
        );
        return true;
      }
    } catch (error: any) {
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
        <div className="flex w-full flex-col ">
          <Toaster />
          <Header />
          <div className="flex basis-11/12 flex-col px-[16px] pb-[8px] pt-8 sm:px-[16px] lg:px-[32px] xl:px-[41px] 2xl:basis-10/12">
            <div className="mx-auto mt-[40px] flex w-full max-w-[1065px] flex-col items-center justify-center gap-[25px] sm:mt-[40px] lg:mt-[100px] xl:mt-[113.74px]">
              <Card
                className={`mx-auto flex w-full max-w-[605px] flex-col gap-[15px] rounded-[24px] border-none bg-bgWhiteColor px-[8px] py-[8px] shadow-popup sm:px-[8px] sm:py-[8px] lg:px-[15px] lg:pb-[20px] lg:pt-[25px] xl:px-[15px] xl:pb-[20px] xl:pt-[25px]`}
              >
                <CardHeader className="flex-row items-center justify-between p-0 px-[10px]">
                  <Link href="/pool">
                    {" "}
                    <Image
                      src="/icon/Arrow-2.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                  </Link>
                  <span className="text-[20px] font-[600] text-textBlack">
                    Remove liquidity
                  </span>
                  <div
                    className="relative flex h-[42px] items-center gap-1 p-[6px]"
                    ref={settingRef}
                  >
                    <span className="absolute right-[40px] text-[20px] font-[400] text-textBlack opacity-60">
                      {settingSlippage.value ? `${settingSlippage.value}%` : ""}
                    </span>
                    <Image
                      src="/images/swap/setting-icon.svg"
                      width={25}
                      height={25}
                      alt=""
                      className="cursor-pointer"
                      onClick={() => setOpenSetting(!openSetting)}
                    />
                    <div
                      className={`${styles["popup-setting"]} ${openSetting ? styles["popup-setting-open"] : ""}`}
                    >
                      {/* <span className={`text-center text-[20px] font-[500] text-textBlack sm:text-[20px] lg:text-[20px] xl:text-[24px] ${styles["popup-setting-title"]}`}>
                      Swap setting
                    </span> */}
                      <div className="flex w-full items-center justify-between">
                        <span
                          className={`text-[18px] font-[400] text-textBlack sm:text-[18px] lg:text-[20px] xl:text-[20px] ${styles["popup-setting-label"]}`}
                        >
                          Max Slippage
                        </span>
                        <div className="flex items-center gap-[12px] rounded-[12px] bg-[#EBEBEB] pr-[12px] shadow-content">
                          <div
                            className={`flex cursor-pointer items-center justify-center rounded-[12px] bg-bgWhiteColor px-3 py-[6px] text-[16px] font-[400]
                       ${settingSlippage.value ? "text-textBlack" : "text-borderOrColor"} shadow-content transition duration-300 ease-in-out hover:bg-[#EBEBEB] sm:text-[16px] lg:text-[18px] xl:text-[18px]
                      `}
                            onClick={() => {
                              if (settingSlippage.value) {
                                setSettingSlippage((prev) => ({
                                  ...prev,
                                  value: "",
                                }));
                              }
                              setSettingSlippage((prev) => ({
                                ...prev,
                                default: 0.5,
                              }));
                            }}
                          >
                            Auto
                          </div>
                          <div className="flex items-center gap-[2px]">
                            <Input
                              onChange={(e) => {
                                let input = e.target.value;

                                // Step 1: Remove invalid characters (e/E)
                                input = input.replace(/[eE]/g, "");

                                // Step 2: Replace ',' with '.' for decimal formatting
                                input = input.replace(/,/g, ".");

                                // Step 3: Remove all invalid characters except digits and '.'
                                input = input.replace(/[^0-9.]/g, "");

                                // Step 4: Allow only one '.' in the input
                                const parts = input.split(".");
                                if (parts.length > 2) {
                                  return setSettingSlippage((prev) => ({
                                    ...prev,
                                    value: "",
                                  }));
                                }

                                // Step 5: Add '0' before '.' if the input starts with '.'
                                if (input.startsWith(".")) {
                                  input = `0${input}`;
                                }

                                // Step 6: Limit to 2 decimal places if a '.' is present
                                if (parts.length === 2) {
                                  const integerPart = parts[0];
                                  const decimalPart = parts[1].slice(0, 2); // Keep only up to 2 digits after '.'
                                  input = `${integerPart}.${decimalPart}`;
                                }

                                // Step 7: Parse input and validate against range [0.1, 20]
                                const value = parseFloat(input);
                                if (value > 50 || value < 0.1) {
                                  return setSettingSlippage((prev) => ({
                                    ...prev,
                                    value: "",
                                  }));
                                }

                                // Step 8: Update form value if valid
                                setSettingSlippage((prev) => ({
                                  ...prev,
                                  value: input,
                                }));
                              }}
                              className="= mr-[2px] h-full w-[50px] border-0 border-none bg-transparent p-0 text-right text-[18px] font-[400] text-textBlack opacity-50 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-[18px] lg:text-[18px] xl:text-[18px]"
                              placeholder="0.5"
                              type="text"
                              inputMode="decimal"
                              value={settingSlippage.value || ""}
                              name="slippage"
                            />
                            <span className="text-[20px] font-[400] text-textBlack opacity-50 ">
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full items-center justify-between">
                        <span
                          className={`text-[18px] font-[400] text-textBlack sm:text-[18px] lg:text-[20px] xl:text-[20px] ${styles["popup-setting-label"]}`}
                        >
                          Transaction deadline
                        </span>
                        <div
                          className="flex items-center gap-[2px] rounded-[18.118px] bg-bgWhiteColor px-[18px] py-[6px]"
                          style={{
                            boxShadow:
                              "0px 1px 4px 0px rgba(26, 26, 26, 0.30) inset",
                          }}
                        >
                          <Input
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              if (value > 4320) {
                                setSettingSlippage((prev) => ({
                                  ...prev,
                                  transactionDeadline: "4320",
                                }));
                              } else
                                setSettingSlippage((prev) => ({
                                  ...prev,
                                  transactionDeadline: e.target.value,
                                }));
                            }}
                            value={settingSlippage.transactionDeadline || ""}
                            name="transactionDeadline"
                            type="number"
                            min={0}
                            className="padding-0 h-full w-[70px] border-0 border-none bg-transparent text-[18px] font-[500] text-textBlack outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-[18px] lg:text-[18px] xl:text-[18px]"
                          />
                          <span className="text-[18px] font-[400] text-textBlack opacity-50 sm:text-[18px] lg:text-[18px] xl:text-[18px]">
                            Minutes
                          </span>
                        </div>
                      </div>
                      <div
                        className={stylesButton["button-close-setting-swap"]}
                        onClick={() => setOpenSetting(false)}
                      >
                        Close
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <div className="flex flex-col gap-[15px] p-0">
                  <div
                    className="rounded-[12px] px-5 py-[15px]"
                    style={{
                      background: "rgba(255, 96, 59, 0.25)",
                      boxShadow: "0px 2px 8px 0px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <span
                      className={`text-[16px] font-[400] text-textBlack ${styles["tip-text"]}`}
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
                <div className="flex w-full flex-col items-start gap-[30px] rounded-[12px] border-none px-[20px] pb-[15px] pt-[20px] shadow-content">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[16px] font-[600] text-textBlack sm:text-[16px] lg:text-[18px] xl:text-[18px]">
                      Withdraw Amounts
                    </span>
                    {/* <span className="text-[16px] font-[600] text-borderOrColor sm:text-[16px] lg:text-[18px] xl:text-[18px]">
                      Detailed
                    </span> */}
                  </div>
                  <span className="flex h-[74px] items-center text-[50px] font-[400] text-textBlack sm:text-[50px] lg:text-[64px] xl:text-[64px]">
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
                  <div className="mt-[-15px] flex w-full items-center justify-between sm:mt-[-10px] lg:mt-[-15px] xl:mt-[-15px]">
                    {valueDeposit?.map((item: any) => {
                      return (
                        <div
                          className={styles["button-withdraw"]}
                          onClick={() => setValueRange(item?.value)}
                          key={item.value}
                        >
                          {item?.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="my-[3px] flex w-full items-center justify-center">
                  <Image
                    src={"/icon/Arrow-2.svg"}
                    alt=""
                    width={15}
                    height={15}
                    style={{ transform: "rotate(-90deg)" }}
                  />
                </div>
                <div className="flex w-full flex-col items-start gap-[12px] rounded-[12px] border-none px-[20px] py-[15px] shadow-content">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[16px] font-[600] text-textBlack sm:text-[16px] lg:text-[18px] xl:text-[18px]">
                      {formatBigNumber(
                        BigNumber(valueTokenPool?.tokenA_amount || 0).dividedBy(
                          10 ** precision,
                        ),
                      )}
                    </span>
                    <div className="flex items-center gap-[5px]">
                      <img
                        src={tokens[tokenParams?.tokenA?.value]?.logo || ""}
                        width={28}
                        height={28}
                        alt=""
                        className="h-9 w-5 sm:h-5 sm:w-5 lg:h-[28px] lg:w-[28px] xl:h-[28px] xl:w-[28px]"
                      />
                      <span className="text-[16px] font-[500] text-textBlack sm:text-[16px] lg:text-[18px] xl:text-[18px]">
                        {tokenParams?.tokenA?.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[16px] font-[600] text-textBlack sm:text-[16px] lg:text-[18px] xl:text-[18px]">
                      {formatBigNumber(
                        BigNumber(valueTokenPool?.tokenB_amount || 0).dividedBy(
                          10 ** precision,
                        ),
                      )}
                    </span>
                    <div className="flex items-center gap-[5px]">
                      <img
                        src={tokens[tokenParams?.tokenB?.value]?.logo || ""}
                        width={28}
                        height={28}
                        alt=""
                        className="h-5 w-5 rounded-[50%] sm:h-5 sm:w-5 lg:h-[28px] lg:w-[28px] xl:h-[28px] xl:w-[28px]"
                      />
                      <span className="text-[16px] font-[500] text-textBlack sm:text-[16px] lg:text-[18px] xl:text-[18px]">
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
                <div className="flex w-full items-start justify-between rounded-[12px] px-[20px] py-[15px]">
                  <span className="text-[16px] font-[500] text-textBlack sm:text-[16px] lg:text-[18px] xl:text-[18px]">
                    Rates
                  </span>
                  <div className="flex flex-col items-end gap-[20px]">
                    <span className="text-[16px] font-[500] text-textBlack sm:text-[16px] lg:text-[18px] xl:text-[18px]">
                      1 {tokenParams?.tokenA?.label} ={" "}
                      {isFinite(parseFloat(valuePer?.perB))
                        ? valuePer?.perB
                        : "~"}{" "}
                      {tokenParams?.tokenB?.label}
                    </span>
                    <span className="text-[16px] font-[500] text-textBlack sm:text-[16px] lg:text-[18px] xl:text-[18px]">
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
                      formatBigNumber(
                        BigNumber(valueTokenPool?.tokenA_amount || 0).dividedBy(
                          10 ** precision,
                        ),
                      ) === "0" &&
                      formatBigNumber(
                        BigNumber(valueTokenPool?.tokenB_amount || 0).dividedBy(
                          10 ** precision,
                        ),
                      ) === "0"
                    }
                  >
                    <Button
                      loading={false}
                      type={"submit"}
                      disabled={
                        formatBigNumber(
                          BigNumber(
                            valueTokenPool?.tokenA_amount || 0,
                          ).dividedBy(10 ** precision),
                        ) === "0" &&
                        formatBigNumber(
                          BigNumber(
                            valueTokenPool?.tokenB_amount || 0,
                          ).dividedBy(10 ** precision),
                        ) === "0"
                      }
                      className={`${stylesButton["button-swap"]} ${stylesButton["btn-supply-remove"]} w-full`}
                      style={{ fontSize: 22, height: 56 }}
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
          <DialogHeader>
            <DialogTitle />
            <DialogDescription />
          </DialogHeader>
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
