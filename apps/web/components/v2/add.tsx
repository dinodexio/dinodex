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

export function PoolAdd({ walletElement, tokenParams }: PoolAddProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { wallet } = useWalletStore();
  const createPool = useCreatePool();
  const addLiquidity = useAddLiquidity();
  const balanceARef = useRef("0");
  const balanceBRef = useRef("0");
  // state dummy create pool
  const [dataPoolCreate, setDataPoolCreate] = useState<any>(initDataPoolCreate);
  const [typeOpenModal, setTypeOpenModal] = useState<string>("first");

  const [approve, setApprove] = useState<any>({
    active: false,
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
    }
    setDataPoolCreate(newDataPoolCreate);
    let url = `/add/${newDataPoolCreate.tokenPool.first?.label}/${newDataPoolCreate.tokenPool.second?.label || ''}`;
    window.history.replaceState(null, '' , url)
    // if (typeOpenModal === "first") {
    //   url += token?.label;
    //   url = token?.first?.label
    //     ? url + "/" + token?.first?.label
    //     : url;
    //   // router.push(url);
    //   window.history.replaceState({}, '' , url)
    // }
    // if (typeOpenModal === "second") {
    //   url = tokenParams?.tokenA?.label ? url + tokenParams?.tokenA?.label : url;
    //   url += "/" + token?.label;
    //   // router.push(url);
    //   window.history.replaceState({}, '' , url)
    // }
  };
  useEffect(() => {
    // Kiểm tra nếu đã có giá trị cho tokenPool.first hoặc tokenPool.second
    if (dataPoolCreate?.tokenPool?.first || dataPoolCreate?.tokenPool?.second)
      return;
    setDataPoolCreate({
      ...dataPoolCreate,
      tokenPool: {
        ...dataPoolCreate.tokenPool,
        first: tokenParams?.tokenA,
        second: tokenParams?.tokenB,
      },
      deposit_amount: {
        ...dataPoolCreate.deposit_amount,
        first_token: tokenParams?.tokenA?.value,
        second_token: tokenParams?.tokenB?.value,
      },
    });
  }, [
    tokenParams,
    dataPoolCreate?.tokenPool?.first,
    dataPoolCreate?.tokenPool?.second,
  ]);

  useEffect(() => {
    if (!userTokenABalance || !userTokenBBalance) return;
    balanceARef.current = userTokenABalance;
    balanceBRef.current = userTokenBBalance;
  }, [userTokenABalance, userTokenBBalance]);

  const lpTotalSupply = useObserveTotalSupply(
    LPTokenId.fromTokenPair(tokenPair).toString(),
  );

  const spotPrice = useSpotPrice(tokenAReserve, tokenBReserve);

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
    setDataPoolCreate({
      ...dataPoolCreate,
      deposit_amount: {
        ...dataPoolCreate.deposit_amount,
        [type]: type === "first" ? balanceARef.current : balanceBRef.current,
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

  const renderButtonPreview = useMemo(() => {
    let text = null;

    if (!dataPoolCreate.tokenPool?.first || !dataPoolCreate.tokenPool?.second) {
      text = "Invalid pair";
      return text;
    }

    // Check if either deposit amount is null
    if (
      dataPoolCreate.deposit_amount.first === null ||
      dataPoolCreate.deposit_amount.second === null
    ) {
      text = "Enter an amount";
      return text; // Early return to avoid further checks
    }

    // Check if both tokens are the same
    if (
      dataPoolCreate.tokenPool.first?.label ===
      dataPoolCreate.tokenPool.second?.label
    ) {
      text = "Tokens must be different";
      return text; // Early return to avoid further checks
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
      return text; // Early return after checking balances
    }

    return text; // No issues found, return null or swap text
  }, [
    dataPoolCreate.deposit_amount.first,
    dataPoolCreate.deposit_amount.second,
    dataPoolCreate.tokenPool.first,
    dataPoolCreate.tokenPool.second,
    balanceARef.current,
    balanceBRef.current,
  ]);

  const isCheckPoolRequired = useMemo(() => {
    let isRequired = true;

    // Check if any required values are null
    if (
      dataPoolCreate.deposit_amount.first === null ||
      dataPoolCreate.deposit_amount.second === null ||
      dataPoolCreate.tokenPool.first === null ||
      dataPoolCreate.tokenPool.second === null
    ) {
      return isRequired; // Remain true if any values are null
    }

    // Check if both tokens are the same
    if (
      dataPoolCreate.tokenPool.first?.label ===
      dataPoolCreate.tokenPool.second?.label
    ) {
      return isRequired;
    }

    // Check if the deposit amounts exceed the wallet balances
    if (
      new BigNumber(dataPoolCreate.deposit_amount.first).gt(
        removePrecision(balanceARef.current),
      ) ||
      new BigNumber(dataPoolCreate.deposit_amount.second).gt(
        removePrecision(balanceBRef.current),
      )
    ) {
      return isRequired; // Remain true if balance is insufficient
    }

    // If all checks pass, no pool check is required
    isRequired = false;
    return isRequired;
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

  const ClickApprove = () => {
    if (approve.loading || approve.active) return;
    setApprove({
      ...approve,
      loading: true,
    });
    setTimeout(() => {
      setApprove({
        ...approve,
        active: true,
        loading: false,
      });
    }, 1000);
  };

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

  return (
    <>
      {/* <div className="flex w-full flex-col px-[16px] pb-[8px] pt-8 sm:px-[16px] lg:px-[32px] xl:px-[41px]">
        <Toaster />
        <div className="flex basis-11/12 flex-col 2xl:basis-10/12">
          <Header />
          <div className="xl:mt-[113.74px] mx-auto mt-[40px] flex w-full max-w-[1065px] items-center justify-center gap-[25px] sm:mt-[40px] lg:mt-[100px]">
            <div className="flex w-full max-w-[520px] flex-col gap-[20px]">
              <div>
                <Dialog>
                  <div className="mt-[20px] flex gap-[20px]">
                    <DialogTrigger
                      className={`flex w-[48%] max-w-[250px] cursor-pointer items-center justify-between 
                    rounded-[18.118px] border-[1px] border-black bg-white px-[12px] py-[15px] text-[20px] font-[400] 
                    leading-none text-black hover:bg-[#EBEBEB] ${
                      dataPoolCreate.tokenPool.first
                        ? "content-left-select-token-item-have-token"
                        : ""
                    }
                    `}
                      style={{ transition: "all 0.3s ease" }}
                      onClick={() => setTypeOpenModal("first")}
                    >
                      {dataPoolCreate.tokenPool?.first ? (
                        <div className="flex items-center gap-[8px]">
                          <Image
                            src={
                              tokens[dataPoolCreate.tokenPool.first.value]?.logo
                            }
                            alt="logo"
                            width={24}
                            height={24}
                          />
                          <span>{dataPoolCreate?.tokenPool?.first?.label}</span>
                        </div>
                      ) : (
                        <span>Select Token</span>
                      )}
                      <Image
                        src={"/icon/drop-down-icon.svg"}
                        alt="drop-down-icon"
                        width={20}
                        height={20}
                      />
                    </DialogTrigger>
                    <DialogTrigger
                      className={`flex w-[48%] max-w-[250px] cursor-pointer items-center justify-between 
                    rounded-[18.118px] border-[1px] border-black bg-white px-[12px] py-[15px] text-[20px] font-[400] 
                    leading-none text-black hover:bg-[#EBEBEB]
                    ${
                      dataPoolCreate.tokenPool.second
                        ? "content-left-select-token-item-have-token"
                        : ""
                    }
                    `}
                      style={{ transition: "all 0.3s ease" }}
                      onClick={() => setTypeOpenModal("second")}
                    >
                      {dataPoolCreate.tokenPool.second ? (
                        <div className="flex items-center gap-[8px]">
                          <Image
                            src={
                              tokens[dataPoolCreate.tokenPool.second.value]
                                ?.logo
                            }
                            alt="logo"
                            width={24}
                            height={24}
                          />
                          <span>
                            {dataPoolCreate?.tokenPool?.second?.label}
                          </span>
                        </div>
                      ) : (
                        <span>Select Token</span>
                      )}
                      <Image
                        src={"/icon/drop-down-icon.svg"}
                        alt="drop-down-icon"
                        width={20}
                        height={20}
                      />
                    </DialogTrigger>
                  </div>
                  <DialogOverlay className="bg-overlay" />
                  <DialogContent className="modal-container bg-white px-[19.83px] pb-[33.88px] pt-[21.49px]">
                    <ModalListToken
                      tokenSelected={dataPoolCreate.tokenPool[typeOpenModal]}
                      onClickToken={(token) =>
                        setDataPoolCreate({
                          ...dataPoolCreate,
                          tokenPool: {
                            ...dataPoolCreate.tokenPool,
                            [typeOpenModal]: token,
                          },
                          deposit_amount: {
                            ...dataPoolCreate.deposit_amount,
                            [`${typeOpenModal}_token`]: token.value,
                          },
                        })
                      }
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <Card
                className={cn(["rounded-2xl   bg-white px-4 py-4 pb-4", ""])}
              >
                <div className="container-join-create">
                  <div className="join-create-text">
                    This pool must be initialized before you can add liquidity.
                    To initialize, select a starting price for the pool. Then,
                    enter your liquidity price range and deposit amount. Gas
                    fees will be higher than usual due to the initialization
                    transaction.
                  </div>
                </div>
                <div className="content-deposit-amounts">
                  <div className="deposit-amounts-item">
                    <div className="deposit-amounts-item-left">
                      <input
                        className="input-price-deposit-amount"
                        data-type-deposit="first"
                        value={dataPoolCreate.deposit_amount.first}
                        onChange={(e) => handleChangeDepositAmount("first", e)}
                      />
                      <span className="value-price-desc">-$</span>
                    </div>
                    <div className="deposit-amounts-item-right">
                      <div
                        className="token-select-deposit-amount"
                        data-type="first"
                      >
                        <Image
                          src={
                            tokens[dataPoolCreate.tokenPool.first?.value]?.logo
                          }
                          width={24}
                          height={24}
                          alt="circle"
                        />
                        <span className="token-symbol-deposit-amount">
                          {dataPoolCreate?.tokenPool?.first?.label}
                        </span>
                      </div>
                      <div className="deposit-amount-balance">
                        <span className="balance-deposit-amount">
                          Balance: 0
                        </span>
                        <div className="btn-max-deposit-amount">Max</div>
                      </div>
                    </div>
                  </div>
                  <div className="deposit-amounts-item">
                    <div className="deposit-amounts-item-left">
                      <input
                        className="input-price-deposit-amount"
                        data-type-deposit="second"
                        value={dataPoolCreate.deposit_amount.second}
                        disabled={poolExists}
                        onChange={(e) => handleChangeDepositAmount("second", e)}
                      />
                      <span className="value-price-desc">-$</span>
                    </div>
                    <div className="deposit-amounts-item-right">
                      <div
                        className="token-select-deposit-amount"
                        data-type="second"
                      >
                        <Image
                          src={
                            tokens[dataPoolCreate?.tokenPool?.second?.value]
                              ?.logo || ""
                          }
                          width={24}
                          height={24}
                          alt="circle"
                        />
                        <span className="token-symbol-deposit-amount">
                          {dataPoolCreate?.tokenPool?.second?.label}
                        </span>
                      </div>
                      <div className="deposit-amount-balance">
                        <span className="balance-deposit-amount">
                          Balance: 0
                        </span>
                        <div className="btn-max-deposit-amount">Max</div>
                      </div>
                    </div>
                  </div>
                  <div className="deposit-amounts-item" style={{display:'none'}}>
                    <div className="deposit-amounts-item-left">
                      <span className="value-price-desc">LP Token</span>
                      <input
                        className="input-price-deposit-amount"
                        data-type-deposit="tokenLP"
                        value={dataPoolCreate.tokenLP_amount}
                        disabled
                      />
                      <span className="value-price-desc">-$</span>
                    </div>
                  </div>
                </div>
                <Dialog>
                  <Button
                    loading={loading}
                    type={"submit"}
                    disabled={isCheckPoolRequired}
                    className="button-swap btn-prview mt-5"
                    onClick={() => handleCreatePool()}
                  >
                    <span>
                      {renderButtonPreview ??
                        (poolExists ? "Add liquidity" : "Create pool")}
                    </span>
                  </Button>
                </Dialog>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {walletElement} */}
      <div className="flex w-full flex-col px-[16px] pb-[8px] pt-8 sm:px-[16px] lg:px-[32px] xl:px-[41px]">
        <Toaster />
        <div className="flex basis-11/12 flex-col 2xl:basis-10/12">
          <Header />
          <div className="mx-auto mt-[40px] flex flex-col w-full max-w-[1065px] items-center justify-center gap-[25px] sm:mt-[40px] lg:mt-[100px] xl:mt-[113.74px]">
            <Card className="w-full max-w-[605px] mx-auto rounded-[24px] bg-transparent border-none xl:border-solid lg:border-solid sm:border-none border-textBlack px-0 xl:px-[15px] lg:px-[15px] sm:px-0 py-[0] xl:py-[25px] lg:py-[25px] sm:py-0 flex flex-col gap-[15px]">
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
                <Dialog>
                  <div className="flex flex-col items-center justify-center gap-[15px] xl:gap-5 lg:gap-5 sm:gap-[15px]">
                    <div
                      className="flex flex-col gap-[10px] w-full rounded-[20px] border border-textBlack bg-white"
                      style={{ padding: "21px 10px 21px 20px" }}
                    >
                      <div className="flex items-center justify-between">
                        <input
                          className="border-none outline-none bg-transparent text-[32px] text-textBlack font-[400] placeholder:opacity-[0.4] w-[50%]"
                          data-type-deposit="first"
                          value={dataPoolCreate.deposit_amount.first}
                          onChange={(e) =>
                            handleChangeDepositAmount("first", e)
                          }
                          placeholder="0"
                        />
                        <DialogTrigger className={`py-[6px] px-[18px] flex items-center gap-[4px] border border-textBlack rounded-[18px] hover:bg-[#EBEBEB] ${dataPoolCreate.tokenPool.first
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
                                  tokens[dataPoolCreate.tokenPool.first.value]?.logo
                                }
                                alt="logo"
                                width={24}
                                height={24}
                                className="w-[18px] xl:w-6 lg:w-6 sm:w-[18px] h-[18px] xl:h-6 lg:h-6 sm:h-[18px]"
                              />
                              <span className="text-textBlack text-[14px] xl:text-[20px] lg:text-[20px] sm:text-[14px] font-[400]">{dataPoolCreate?.tokenPool?.first?.label}</span>
                            </div>
                          ) : (
                            <span className="text-textBlack text-[14px] xl:text-[20px] lg:text-[20px] sm:text-[14px] font-[600]">Select a token</span>
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
                          <span className="text-textBlack text-[14px] xl:text-[20px] lg:text-[20px] sm:text-[14px] font-[400]">Balance: <Balance balance={userTokenABalance} /></span>
                          <div className="py-1 px-2 rounded-[6px] border border-textBlack cursor-pointer flex items-center justify-center hover:bg-[#EBEBEB] text-textBlack text-[14px] xl:text-[16px] lg:text-[16px] sm:text-[14px] font-[400]"
                            style={{ transition: "all 0.3s ease" }}
                            onClick={() => handleMax("first")}
                          >MAX</div>
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
                          className="border-none outline-none bg-transparent text-[32px] text-textBlack font-[400] placeholder:opacity-[0.4] w-[50%]"
                          data-type-deposit="second"
                          value={dataPoolCreate.deposit_amount.second}
                          onChange={(e) =>
                            handleChangeDepositAmount("second", e)
                          }
                          placeholder="0"
                        />
                        <DialogTrigger className={`py-[6px] px-[18px] flex items-center gap-[4px] border border-textBlack rounded-[18px] hover:bg-[#EBEBEB] ${dataPoolCreate.tokenPool.second
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
                                  tokens[dataPoolCreate.tokenPool.second.value]?.logo
                                }
                                alt="logo"
                                width={24}
                                height={24}
                                className="w-[18px] xl:w-6 lg:w-6 sm:w-[18px] h-[18px] xl:h-6 lg:h-6 sm:h-[18px]"
                              />
                              <span className="text-textBlack text-[14px] xl:text-[20px] lg:text-[20px] sm:text-[14px] font-[400]">{dataPoolCreate?.tokenPool?.second?.label}</span>
                            </div>
                          ) : (
                            <span className="text-textBlack text-[14px] xl:text-[20px] lg:text-[20px] sm:text-[14px] font-[600]">Select a token</span>
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
                          <span className="text-textBlack text-[14px] xl:text-[20px] lg:text-[20px] sm:text-[14px] font-[400]">Balance: <Balance balance={userTokenBBalance} /></span>
                          <div className="py-1 px-2 rounded-[6px] border border-textBlack cursor-pointer flex items-center justify-center hover:bg-[#EBEBEB] text-textBlack text-[14px] xl:text-[16px] lg:text-[16px] sm:text-[14px] font-[400]" style={{ transition: "all 0.3s ease" }}>MAX</div>
                        </div>

                      )}
                    </div>
                    {dataPoolCreate.tokenPool?.first &&
                      dataPoolCreate.tokenPool?.second && (
                        <div className="pt-[15px] xl:pt-[25px] lg:pt-[25px] sm:pt-[15px] rounded-[20px] border border-textBlack w-full flex flex-col gap-[10px]">
                          <span className="px-5 text-textBlack text-[16px] xl:text-[20px] lg:text-[20px] sm:text-[16px] font-[600]">
                            Deposit Amounts
                          </span>
                          <div
                            className="px-[20px] xl:px-[25px] lg:px-[25px] sm:px-[20px] py-[25px] rounded-[20px] w-full flex items-center justify-between"
                            style={{ borderTop: "1px solid black" }}
                          >
                            <div className="flex w-[30%] max-w-[150px] flex-col items-center gap-[10px]">
                              <span className="text-[15px] xl:text-[18px] lg:text-[18px] sm:text-[15px] font-[500] text-textBlack">
                                {valuePer?.perB}
                              </span>
                              <span className="text-[15px] xl:text-[18px] lg:text-[18px] sm:text-[15px] font-[600] text-textBlack opacity-[0.6]">
                                {dataPoolCreate?.tokenPool?.second?.label} per{" "}
                                {dataPoolCreate?.tokenPool?.first?.label}
                              </span>
                            </div>
                            <div className="flex w-[30%] max-w-[150px] flex-col items-center gap-[10px]">
                              <span className="text-[15px] xl:text-[18px] lg:text-[18px] sm:text-[15px] font-[500] text-textBlack">
                                {valuePer?.perA}
                              </span>
                              <span className="text-[15px] xl:text-[18px] lg:text-[18px] sm:text-[15px] font-[600] text-textBlack opacity-[0.6]">
                                {dataPoolCreate?.tokenPool?.first?.label} per{" "}
                                {dataPoolCreate?.tokenPool?.second?.label}
                              </span>
                            </div>
                            <div className="flex w-[30%] max-w-[150px] flex-col items-center gap-[10px]">
                              <span className="text-[15px] xl:text-[18px] lg:text-[18px] sm:text-[15px] font-[500] text-textBlack">
                                0%
                              </span>
                              <span className="text-[15px] xl:text-[18px] lg:text-[18px] sm:text-[15px] font-[600] text-textBlack opacity-[0.6]">
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
                        disabled={isCheckPoolRequired}
                        className={
                          dataPoolCreate.deposit_amount.first === null ||
                            dataPoolCreate.deposit_amount.second === null
                            ? "border border-textBlack h-max rounded-[20px] flex justify-center items-center py-5 px-[10px] bg-white cursor-no-drop text-[20px] xl:text-[26px] lg:text-[26px] sm:text-[20px] font-[600]"
                            : "button-swap btn-prview btn-approve-new"
                        }
                      >
                        <span>Supply</span>
                      </Button>
                    </DialogTrigger>
                    <DialogOverlay className="bg-[rgba(0,0,0,0.5)]" />
                    <DialogContent
                      className="modal-container modal-pool bg-white px-[20px] xl:px-[30px] lg:px-[30px] sm:px-[20px] pt-[27px] xl:pt-[35px] lg:pt-[35px] sm:pt-[27px] pb-[20px] w-[99%] max-w-[625px] border-none"
                    >
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
                    disabled={isCheckPoolRequired}
                    className={
                      dataPoolCreate.deposit_amount.first === null ||
                        dataPoolCreate.deposit_amount.second === null
                        ? "border border-textBlack h-max rounded-[20px] flex justify-center items-center py-5 px-[10px] bg-white cursor-no-drop text-[20px] xl:text-[26px] lg:text-[26px] sm:text-[20px] font-[600]"
                        : "button-swap btn-prview btn-approve-new"
                    }
                    onClick={() => ClickApprove()}
                  >
                    <span>
                      {renderButtonPreview ??
                        (poolExists ? "Approve" : "Approve")}
                    </span>
                  </Button>
                )}
              </CardContent>
            </Card>
            <PoolPosition />
          </div>
        </div>
      </div>
      {walletElement}
    </>
  );
}
