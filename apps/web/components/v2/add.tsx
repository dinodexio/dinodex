"use client";
import { Header } from "../header";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import "../style.css";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModalListToken } from "../modalListToken/modalListToken";
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
import { Card, CardContent, CardHeader } from "../ui/card";
import Link from "next/link";
import { ModalSupplyComfirm } from "../modalSupplyConfirm/modalSupplyConfirm";
import { PoolPosition } from "./position";
import { Balances } from "../wallet/wallet";
import { UInt64 } from "o1js";
export interface PoolAddProps {
  walletElement?: JSX.Element;
  tokenParams?: any;
  balances?: Balances;
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

export function PoolAdd({
  walletElement,
  tokenParams,
  balances,
}: PoolAddProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { wallet } = useWalletStore();
  const createPool = useCreatePool();
  const addLiquidity = useAddLiquidity();
  const balanceARef = useRef("0");
  const balanceBRef = useRef("0");
  // state dummy create pool
  const [dataPoolCreate, setDataPoolCreate] = useState<any>(() => ({
    ...initDataPoolCreate,
    tokenPool: {
      first: tokenParams?.tokenA,
      second: tokenParams?.tokenB,
    },
    deposit_amount: {
      first_token: tokenParams?.tokenA?.value,
      second_token: tokenParams?.tokenB?.value,
    },
  }));
  const [typeOpenModal, setTypeOpenModal] = useState<string>("first");

  const [approve, setApprove] = useState<any>({
    active: true,
    loading: false,
  });
  const { poolKey, tokenPair } = usePoolKey(
    dataPoolCreate.deposit_amount.first_token,
    dataPoolCreate.deposit_amount.second_token,
  );

  const pool = useObservePool(poolKey);

  // observe balances of the pool & the connected wallet
  const tokenAReserve = useObserveBalance(
    dataPoolCreate.deposit_amount.first_token,
    poolKey,
  );
  const tokenBReserve = useObserveBalance(
    dataPoolCreate.deposit_amount.second_token,
    poolKey,
  );
  const userTokenABalance = useObserveBalance(
    dataPoolCreate.deposit_amount.first_token,
    wallet,
  );
  const userTokenBBalance = useObserveBalance(
    dataPoolCreate.deposit_amount.second_token,
    wallet,
  );

  const handleSelectToken = (token: any) => {
    const newDataPoolCreate = {
      ...dataPoolCreate,
      tokenPool: {
        ...dataPoolCreate.tokenPool,
        [typeOpenModal]: token,
      },
      deposit_amount: {
        ...dataPoolCreate.deposit_amount,
        [`${typeOpenModal}_token`]: token.value,
      },
    };
    setDataPoolCreate(newDataPoolCreate);
    let url = `/add/${newDataPoolCreate.tokenPool.first?.label}/${newDataPoolCreate.tokenPool.second?.label || ""}`;
    window.history.replaceState(null, "", url);
  };

  const handleChangeDepositAmount = (type: string, event: any) => {
    event.target.value = event.target.value.replace(/[^0-9.]/g, "");
    setDataPoolCreate({
      ...dataPoolCreate,
      deposit_amount: {
        ...dataPoolCreate.deposit_amount,
        [type]: event.target.value,
      },
    });
  };

  const handleMax = (type: string) => {
    const { quotient: quotientA, rest: restA } = UInt64.from(
      balanceARef.current,
    ).divMod(10 ** precision);
    const { quotient: quotientB, rest: restB } = UInt64.from(
      balanceBRef.current,
    ).divMod(10 ** precision);
    setDataPoolCreate({
      ...dataPoolCreate,
      deposit_amount: {
        ...dataPoolCreate.deposit_amount,
        [type]:
          type === "first"
            ? Number(`${quotientA.toString()}.${Number(restA.toString())}`)
            : Number(`${quotientB.toString()}.${Number(restB.toString())}`),
      },
    });
  };

  const handleChangeValueMinPrice = (type: string, value: any) => {
    if (value < 0) return;
    setDataPoolCreate({
      ...dataPoolCreate,
      valueMinPrice: {
        ...dataPoolCreate.valueMinPrice,
        [type]: value,
      },
    });
  };

  const resetDataPoolCreate = () => {
    setDataPoolCreate({ ...initDataPoolCreate });
  };

  const validatePoolCreation = useMemo(() => {
    let text = null;
    let isRequired = true;

    // Check if any required values are null
    if (
      !dataPoolCreate.tokenPool?.first ||
      !dataPoolCreate.tokenPool?.second ||
      dataPoolCreate.deposit_amount.first === null ||
      dataPoolCreate.deposit_amount.second === null ||
      dataPoolCreate.deposit_amount.first === 0 ||
      dataPoolCreate.deposit_amount.second === 0 ||
      dataPoolCreate.deposit_amount.first === "" ||
      dataPoolCreate.deposit_amount.second === ""
    ) {
      text =
        !dataPoolCreate.tokenPool?.first || !dataPoolCreate.tokenPool?.second
          ? "Invalid pair"
          : "Enter an amount";
      return { text, isRequired }; // Early return if any values are null
    }

    // Check if both tokens are the same
    if (
      dataPoolCreate.tokenPool.first?.label ===
      dataPoolCreate.tokenPool.second?.label
    ) {
      text = "Tokens must be different";
      return { text, isRequired }; // Early return if tokens are identical
    }

    // Check for insufficient balance
    if (
      new BigNumber(dataPoolCreate.deposit_amount.first).gt(
        removePrecision(balanceARef.current),
      ) ||
      new BigNumber(dataPoolCreate.deposit_amount.second).gt(
        removePrecision(balanceBRef.current),
      )
    ) {
      text = "Insufficient balance";
      return { text, isRequired }; // Early return if balance is insufficient
    }

    // If all checks pass, no pool check is required and no text is needed
    isRequired = false;
    return { text, isRequired };
  }, [
    dataPoolCreate.deposit_amount.first,
    dataPoolCreate.deposit_amount.second,
    dataPoolCreate.tokenPool.first,
    dataPoolCreate.tokenPool.second,
    balanceARef.current,
    balanceBRef.current,
  ]);

  const handleCreatePool = async () => {
    setLoading(true);
    const { deposit_amount } = dataPoolCreate;
    const { first_token, second_token, first, second } = deposit_amount;
    try {
      if (pool?.exists) {
        await addLiquidity(
          first_token,
          second_token,
          addPrecision(first),
          addPrecision(second),
        );
      } else {
        await createPool(
          first_token,
          second_token,
          addPrecision(first),
          addPrecision(second),
        );
      }
    } finally {
      setLoading(false);
    }
    resetDataPoolCreate();
    router.push("/pool");
  };

  // const ClickApprove = () => {
  //   if (approve.loading || approve.active) return;
  //   setApprove({
  //     ...approve,
  //     loading: true,
  //   });
  //   setTimeout(() => {
  //     setApprove({
  //       ...approve,
  //       active: true,
  //       loading: false,
  //     });
  //   }, 1000);
  // };

  const poolExists = pool?.exists ?? true;

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

  const lpTotalSupply = useObserveTotalSupply(
    LPTokenId.fromTokenPair(tokenPair).toString(),
  );

  const spotPrice = useSpotPrice(tokenAReserve, tokenBReserve);

  useEffect(() => {
    if (!userTokenABalance || !userTokenBBalance) return;
    balanceARef.current = userTokenABalance;
    balanceBRef.current = userTokenBBalance;
  }, [userTokenABalance, userTokenBBalance]);

  useEffect(() => {
    if (
      !pool?.exists ||
      !lpTotalSupply ||
      !dataPoolCreate.deposit_amount.first ||
      !tokenAReserve
    ) {
      return;
    }

    const lpTokensToMint = new BigNumber(lpTotalSupply)
      .multipliedBy(addPrecision(dataPoolCreate.deposit_amount.first))
      .div(tokenAReserve)
      .toString();

    setDataPoolCreate({
      ...dataPoolCreate,
      tokenLP_amount: removePrecision(lpTokensToMint),
    });
  }, [
    pool,
    tokenAReserve,
    dataPoolCreate.deposit_amount.first_token,
    dataPoolCreate.deposit_amount.first,
    tokenBReserve,
    lpTotalSupply,
  ]);

  // calculate amount B
  useEffect(() => {
    if (
      !dataPoolCreate.deposit_amount.first ||
      dataPoolCreate.deposit_amount.first === "0" ||
      dataPoolCreate.deposit_amount.first === ""
    ) {
      setDataPoolCreate({
        ...dataPoolCreate,
        deposit_amount: {
          ...dataPoolCreate.deposit_amount,
          second: "",
        },
      });
      return;
    }
    const tokenB_amount = new BigNumber(
      dataPoolCreate.deposit_amount.first,
    ).dividedBy(spotPrice);

    if (!pool?.loading && pool?.exists && !tokenB_amount.isNaN()) {
      setDataPoolCreate({
        ...dataPoolCreate,
        deposit_amount: {
          ...dataPoolCreate.deposit_amount,
          second: removeTrailingZeroes(tokenB_amount.toFixed(precision)),
        },
      });
    }
  }, [dataPoolCreate.deposit_amount.first, pool, lpTotalSupply, spotPrice]);

  // if create pool, calculate the initial LP amount
  useEffect(() => {
    const { deposit_amount } = dataPoolCreate;
    const { first_token, second_token } = deposit_amount;
    if (pool?.exists) {
      return;
    }
    if (!first_token || !second_token) return;
    if (first_token > second_token) {
      setDataPoolCreate({
        ...dataPoolCreate,
        tokenLP_amount: dataPoolCreate.deposit_amount.first,
      });
    } else {
      setDataPoolCreate({
        ...dataPoolCreate,
        tokenLP_amount: dataPoolCreate.deposit_amount.second,
      });
    }
  }, [
    dataPoolCreate.deposit_amount.first_token,
    dataPoolCreate.deposit_amount.second_token,
    dataPoolCreate.deposit_amount.first,
    dataPoolCreate.deposit_amount.second,
    pool,
  ]);

  return (
    <>
      <div className="flex w-full flex-col px-[16px] pb-[8px] pt-8 sm:px-[16px] lg:px-[32px] xl:px-[41px]">
        <Toaster />
        <div className="flex basis-11/12 flex-col 2xl:basis-10/12">
          <Header />
          <div className="mx-auto mt-[40px] flex w-full max-w-[1065px] flex-col items-center justify-center gap-[25px] sm:mt-[40px] lg:mt-[100px] xl:mt-[113.74px]">
            <Card className="mx-auto flex w-full max-w-[605px] flex-col gap-[15px] rounded-[24px] border-none border-textBlack bg-transparent px-0 py-[0] sm:border-none sm:px-0 sm:py-0 lg:border-solid lg:px-[15px] lg:py-[25px] xl:border-solid xl:px-[15px] xl:py-[25px]">
              <CardHeader className="mb-[10px] flex-row items-center justify-between p-0 px-[10px]">
                <Link href="/pool">
                  <Image
                    src="/icon/Arrow-2.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                </Link>
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
              <CardContent className="flex flex-col gap-[15px] p-0">
                <div
                  className="rounded-[12px] border border-textBlack px-5 py-6"
                  style={{ background: "rgba(255, 96, 59, 0.25)" }}
                >
                  <span
                    className="text-[16px] font-[400] text-textBlack sm:text-[16px] lg:text-[24px] xl:text-[24px]"
                    style={{ lineHeight: "normal" }}
                  >
                    <strong className="font-[600]">Tip:</strong>When you add
                    liquidity, you will receive pool tokens representing your
                    position. These tokens automatically earn fees proportional
                    to your share of the pool, and can be redeemed at any time.
                  </span>
                </div>
                <Dialog>
                  <div className="flex flex-col items-center justify-center gap-[15px] sm:gap-[15px] lg:gap-5 xl:gap-5">
                    <div
                      className="flex w-full flex-col gap-[10px] rounded-[20px] border border-textBlack bg-white"
                      style={{ padding: "21px 10px 21px 20px" }}
                    >
                      <div className="flex items-center justify-between">
                        <input
                          className="w-[50%] border-none bg-transparent text-[32px] font-[400] text-textBlack outline-none placeholder:opacity-[0.4]"
                          data-type-deposit="first"
                          value={dataPoolCreate.deposit_amount.first}
                          onChange={(e) =>
                            handleChangeDepositAmount("first", e)
                          }
                          placeholder="0"
                        />
                        <DialogTrigger
                          className={`flex items-center gap-[4px] rounded-[18px] border border-textBlack px-[18px] py-[6px] hover:bg-[#EBEBEB] ${
                            dataPoolCreate.tokenPool.first
                              ? "bg-[#C5B4E3] hover:bg-[#C5B4E3]"
                              : ""
                          }`}
                          style={{ transition: "all 0.3s ease" }}
                          onClick={() => setTypeOpenModal("first")}
                        >
                          {dataPoolCreate.tokenPool?.first ? (
                            <div className="flex items-center gap-[8px]">
                              <Image
                                src={
                                  tokens[dataPoolCreate.tokenPool.first.value]
                                    ?.logo ?? ""
                                }
                                alt="logo"
                                width={24}
                                height={24}
                                className="h-[18px] w-[18px] sm:h-[18px] sm:w-[18px] lg:h-6 lg:w-6 xl:h-6 xl:w-6"
                              />
                              <span className="text-[14px] font-[400] text-textBlack sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                                {dataPoolCreate?.tokenPool?.first?.label}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[14px] font-[600] text-textBlack sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                              Select a token
                            </span>
                          )}
                          <Image
                            src={"/icon/drop-down-icon.svg"}
                            alt="drop-down-icon"
                            width={20}
                            height={20}
                          />
                        </DialogTrigger>
                      </div>
                      {dataPoolCreate.tokenPool?.first && (
                        <div className="flex items-center justify-end gap-[10px]">
                          <span className="text-[14px] font-[400] text-textBlack sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                            Balance: <Balance balance={userTokenABalance} />
                          </span>
                          <div
                            className="flex cursor-pointer items-center justify-center rounded-[6px] border border-textBlack px-2 py-1 text-[14px] font-[400] text-textBlack hover:bg-[#EBEBEB] sm:text-[14px] lg:text-[16px] xl:text-[16px]"
                            style={{ transition: "all 0.3s ease" }}
                            onClick={() => handleMax("first")}
                          >
                            MAX
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-center">
                      <Image
                        src={"/icon/add-icon.svg"}
                        alt="plus-icon"
                        width={24}
                        height={24}
                      />
                    </div>
                    <div
                      className="flex w-full flex-col gap-[10px] rounded-[20px] border border-textBlack bg-white"
                      style={{ padding: "21px 10px 21px 20px" }}
                    >
                      <div className="flex items-center justify-between">
                        <input
                          className="w-[50%] border-none bg-transparent text-[32px] font-[400] text-textBlack outline-none placeholder:opacity-[0.4]"
                          data-type-deposit="second"
                          value={dataPoolCreate.deposit_amount.second}
                          disabled={poolExists}
                          onChange={(e) =>
                            handleChangeDepositAmount("second", e)
                          }
                          placeholder="0"
                        />
                        <DialogTrigger
                          className={`flex items-center gap-[4px] rounded-[18px] border border-textBlack px-[18px] py-[6px] hover:bg-[#EBEBEB] ${
                            dataPoolCreate.tokenPool.second
                              ? "bg-[#C5B4E3] hover:bg-[#C5B4E3]"
                              : ""
                          }`}
                          style={{ transition: "all 0.3s ease" }}
                          onClick={() => setTypeOpenModal("second")}
                        >
                          {dataPoolCreate.tokenPool?.second ? (
                            <div className="flex items-center gap-[8px]">
                              <Image
                                src={
                                  tokens[dataPoolCreate.tokenPool.second.value]
                                    ?.logo ?? ""
                                }
                                alt="logo"
                                width={24}
                                height={24}
                                className="h-[18px] w-[18px] sm:h-[18px] sm:w-[18px] lg:h-6 lg:w-6 xl:h-6 xl:w-6"
                              />
                              <span className="text-[14px] font-[400] text-textBlack sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                                {dataPoolCreate?.tokenPool?.second?.label}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[14px] font-[600] text-textBlack sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                              Select a token
                            </span>
                          )}
                          <Image
                            src={"/icon/drop-down-icon.svg"}
                            alt="drop-down-icon"
                            width={20}
                            height={20}
                          />
                        </DialogTrigger>
                      </div>
                      {dataPoolCreate.tokenPool?.second && (
                        <div className="flex items-center justify-end gap-[10px]">
                          <span className="text-[14px] font-[400] text-textBlack sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                            Balance: <Balance balance={userTokenBBalance} />
                          </span>
                          {!pool?.exists && (
                            <div
                              className="flex cursor-pointer items-center justify-center rounded-[6px] border border-textBlack px-2 py-1 text-[14px] font-[400] text-textBlack hover:bg-[#EBEBEB] sm:text-[14px] lg:text-[16px] xl:text-[16px]"
                              style={{ transition: "all 0.3s ease" }}
                              onClick={() => handleMax("second")}
                            >
                              MAX
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {dataPoolCreate.tokenPool?.first &&
                      dataPoolCreate.tokenPool?.second && (
                        <div className="flex w-full flex-col gap-[10px] rounded-[20px] border border-textBlack pt-[15px] sm:pt-[15px] lg:pt-[25px] xl:pt-[25px]">
                          <span className="px-5 text-[16px] font-[600] text-textBlack sm:text-[16px] lg:text-[20px] xl:text-[20px]">
                            Deposit Amounts
                          </span>
                          <div
                            className="flex w-full items-center justify-between rounded-[20px] px-[20px] py-[25px] sm:px-[20px] lg:px-[25px] xl:px-[25px]"
                            style={{ borderTop: "1px solid black" }}
                          >
                            <div className="flex w-[30%] max-w-[150px] flex-col items-center gap-[10px]">
                              <span className="text-[15px] font-[500] text-textBlack sm:text-[15px] lg:text-[18px] xl:text-[18px]">
                                {isFinite(parseFloat(valuePer?.perB))
                                  ? valuePer?.perB
                                  : "~"}
                              </span>
                              <span className="text-[15px] font-[600] text-textBlack opacity-[0.6] sm:text-[15px] lg:text-[18px] xl:text-[18px]">
                                {dataPoolCreate?.tokenPool?.second?.label} per{" "}
                                {dataPoolCreate?.tokenPool?.first?.label}
                              </span>
                            </div>
                            <div className="flex w-[30%] max-w-[150px] flex-col items-center gap-[10px]">
                              <span className="text-[15px] font-[500] text-textBlack sm:text-[15px] lg:text-[18px] xl:text-[18px]">
                                {isFinite(parseFloat(valuePer?.perA))
                                  ? valuePer?.perA
                                  : "~"}
                              </span>
                              <span className="text-[15px] font-[600] text-textBlack opacity-[0.6] sm:text-[15px] lg:text-[18px] xl:text-[18px]">
                                {dataPoolCreate?.tokenPool?.first?.label} per{" "}
                                {dataPoolCreate?.tokenPool?.second?.label}
                              </span>
                            </div>
                            <div className="flex w-[30%] max-w-[150px] flex-col items-center gap-[10px]">
                              <span className="text-[15px] font-[500] text-textBlack sm:text-[15px] lg:text-[18px] xl:text-[18px]">
                                0%
                              </span>
                              <span className="text-[15px] font-[600] text-textBlack opacity-[0.6] sm:text-[15px] lg:text-[18px] xl:text-[18px]">
                                Share of pool
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                  <DialogOverlay className="bg-[rgba(0,0,0,0.5)]" />
                  <DialogContent className="modal-container bg-white px-[19.83px] pb-[33.88px] pt-[21.49px]">
                    <ModalListToken
                      tokenSelected={dataPoolCreate.tokenPool[typeOpenModal]}
                      onClickToken={(token) => handleSelectToken(token)}
                    />
                  </DialogContent>
                </Dialog>
                {approve.active ? (
                  <Dialog>
                    <DialogTrigger>
                      <Button
                        loading={loading}
                        type={"submit"}
                        disabled={validatePoolCreation.isRequired}
                        className={
                          dataPoolCreate.deposit_amount.first === null ||
                          dataPoolCreate.deposit_amount.second === null
                            ? "flex h-max cursor-no-drop items-center justify-center rounded-[20px] border border-textBlack bg-white px-[10px] py-5 text-[20px] font-[600] sm:text-[20px] lg:text-[26px] xl:text-[26px]"
                            : "button-swap btn-prview btn-approve-new"
                        }
                      >
                        <span>
                          {poolExists ? "Add Liquidity" : "Create Pool"}
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogOverlay className="bg-[rgba(0,0,0,0.5)]" />
                    <DialogContent className="modal-container modal-pool w-[99%] max-w-[625px] border-none bg-white px-[20px] pb-[20px] pt-[27px] sm:px-[20px] sm:pt-[27px] lg:px-[30px] lg:pt-[35px] xl:px-[30px] xl:pt-[35px]">
                      <ModalSupplyComfirm
                        dataPool={dataPoolCreate}
                        valuePer={valuePer}
                        onClickAddPool={handleCreatePool}
                        loading={loading}
                      />
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button
                    loading={approve.loading}
                    type={"submit"}
                    disabled={validatePoolCreation.isRequired}
                    className={
                      dataPoolCreate.deposit_amount.first === null ||
                      dataPoolCreate.deposit_amount.second === null
                        ? "flex h-max cursor-no-drop items-center justify-center rounded-[20px] border border-textBlack bg-white px-[10px] py-5 text-[20px] font-[600] sm:text-[20px] lg:text-[26px] xl:text-[26px]"
                        : "button-swap btn-prview btn-approve-new"
                    }
                    // onClick={() => ClickApprove()}
                  >
                    <span>
                      {validatePoolCreation.text ??
                        (poolExists ? "Approve" : "Approve")}
                    </span>
                  </Button>
                )}
              </CardContent>
            </Card>
            {dataPoolCreate?.tokenPool?.first &&
              dataPoolCreate?.tokenPool?.second &&
              pool?.exists && (
                <PoolPosition dataPool={dataPoolCreate} balances={balances} />
              )}
          </div>
        </div>
      </div>
      {walletElement}
    </>
  );
}
