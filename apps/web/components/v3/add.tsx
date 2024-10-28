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
import { precision, removeTrailingZeroes } from "../ui/balance";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "../ui/card";
import Link from "next/link";
import { ModalSupplyComfirm } from "../modalSupplyConfirm/modalSupplyConfirm";
export interface PoolAddProps {
  walletElement?: JSX.Element;
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

export function PoolAdd({ walletElement }: PoolAddProps) {
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

  const [showFeeTier, setShowFeeTier] = useState<boolean>(false);

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

    // console.log("calculated lp tokens", removePrecision(lpTokensToMint));

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
      text = 'Invalid pair'
      return text
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
  return (
    <>
      <div className="flex w-full flex-col px-[16px] pb-[8px] pt-8 sm:px-[16px] lg:px-[32px] xl:px-[41px]">
        <Toaster />
        <div className="flex basis-11/12 flex-col 2xl:basis-10/12">
          <Header />
          <div className="xl:mt[113.74px] mx-auto mt-[40px] flex w-full max-w-[1065px] flex-col items-center gap-[25px] sm:mt-[40px] lg:mt-[100px] lg:flex-row lg:items-start xl:flex-row xl:items-start">
            <div className="flex w-full max-w-[520px] flex-col gap-[20px]">
              <div>
                <span className="text-[20px] font-[600] leading-none text-black">
                  Select Pair
                </span>
                <Dialog>
                  <div className="mt-[20px] flex gap-[20px]">
                    <DialogTrigger
                      className={`flex w-[48%] max-w-[250px] cursor-pointer items-center justify-between 
                    rounded-[18.118px] border-[1px] border-black bg-white px-[12px] py-[15px] text-[20px] font-[400] 
                    leading-none text-black hover:bg-[#EBEBEB] ${dataPoolCreate.tokenPool.first
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
                              tokens[dataPoolCreate.tokenPool.first.value]?.logo || ''
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
                    ${dataPoolCreate.tokenPool.second
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
                              tokens[dataPoolCreate.tokenPool.second.value]?.logo || ''
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
                      dialogClose={true}
                    />
                  </DialogContent>
                </Dialog>
                <div
                  className={`mt-[15px] flex h-[92px] w-full items-center justify-between rounded-[21px] border-[1px] border-black bg-white py-[12px] pl-[20px] pr-[10px] ${!dataPoolCreate.tokenPool.first ||
                      !dataPoolCreate.tokenPool.second
                      ? "content-pool-hide"
                      : ""
                    }`}
                >
                  <div className="flex flex-col gap-[10px]">
                    <span className="text-[24px] font-[400] leading-none text-black">
                      {dataPoolCreate.feeTier}% fee Tier
                    </span>
                    <span
                      className="fee-tier-desc"
                      style={{ width: "max-content" }}
                    >
                      Not created
                    </span>
                  </div>
                  <span
                    className="btn-edit-fee-tier"
                    onClick={() => {
                      if (
                        dataPoolCreate.tokenPool.first &&
                        dataPoolCreate.tokenPool.second
                      ) {
                        setShowFeeTier(!showFeeTier);
                      }
                    }}
                  >
                    {showFeeTier ? "Hide" : "Edit"}
                  </span>
                </div>
              </div>
              <div
                className={`choose-fee-tier-content ${showFeeTier ? "choose-fee-tier-content-show" : ""
                  }`}
              >
                {LIST_FEE_TIER.map((item, index) => (
                  <div
                    className={`choose-fee-tier-item ${Number(dataPoolCreate.feeTier) === item.value
                        ? "choose-fee-tier-active"
                        : ""
                      }`}
                    key={index}
                    onClick={() => {
                      setDataPoolCreate({
                        ...dataPoolCreate,
                        feeTier: item.value,
                      });
                    }}
                    data-fee-tier={item.value}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <span className="choose-fee-tier-item-text">
                        {item.label}
                      </span>
                      <Image
                        src="/icon/icon-tick-white.svg"
                        width={18}
                        height={18}
                        style={{
                          display:
                            dataPoolCreate.feeTier === item.value
                              ? "block"
                              : "none",
                        }}
                        alt="circle"
                      />
                    </div>
                    <span className="choose-fee-tier-item-desc">
                      Best for stable pairs
                    </span>
                    <span className="fee-tier-desc">Not created</span>
                  </div>
                ))}
              </div>
              <div
                className={`${!dataPoolCreate.tokenPool.first ||
                    !dataPoolCreate.tokenPool.second
                    ? "content-pool-hide"
                    : ""
                  }`}
              >
                <span className="content-left-header">Deposit Amounts</span>
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
                            tokens[dataPoolCreate.tokenPool.first?.value]?.logo || ''
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
                  <div className="deposit-amounts-item">
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
              </div>
            </div>
            <div
              className={`content-right ${!dataPoolCreate.tokenPool.first ||
                  !dataPoolCreate.tokenPool.second
                  ? "content-pool-hide"
                  : ""
                }`}
            >
              <div className="header-content-right">
                <span className="content-left-header">Set Starting Price</span>
              </div>
              <div className="container-join-create">
                <div className="join-create-text">
                  This pool must be initialized before you can add liquidity. To
                  initialize, select a starting price for the pool. Then, enter
                  your liquidity price range and deposit amount. Gas fees will
                  be higher than usual due to the initialization transaction.
                </div>
                <input className="input-value-current" value="100" data-type-input="current" />
                <div className="content-current-price">
                  <span className="content-current-price-text">Current ETH Price:</span>
                  <span className="content-current-price-text">100 DRM</span>
                </div>
              </div>
              <span className="content-left-header">
                Set Price Range
              </span>
              <div className="content-min-price-join-pool">
                <div className="min-price-join-pool-item">
                  <span className="min-price-join-pool-item-title">Min Price</span>
                  <div className="min-price-join-pool-item-content">
                    <div className="btn-min-price-join-pool-item" data-type="remove-first" onClick={() => handleChangeValueMinPrice('first', Number(dataPoolCreate?.valueMinPrice?.first) - 0.0001)}>
                      <Image src="/icon/btn-remove.svg" width={26} height={26} alt="btn-add" />
                    </div>
                    <input className="input-min-join-pool-item" data-type-input="first" value={dataPoolCreate?.valueMinPrice?.first} onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                      handleChangeValueMinPrice('first', e.target.value)
                    }} />
                    <div className="btn-min-price-join-pool-item" data-type="add-first" onClick={() => handleChangeValueMinPrice('first', Number(dataPoolCreate?.valueMinPrice?.first) + 0.0001)}>
                      <Image src="/icon/btn-add.svg" width={26} height={26} alt="btn-add" />
                    </div>
                  </div>
                  <span className="min-price-join-pool-item-text">{dataPoolCreate?.tokenPool?.first?.symbol} per {dataPoolCreate?.tokenPool?.second?.symbol}</span>
                </div>
                <div className="min-price-join-pool-item">
                  <span className="min-price-join-pool-item-text">Min Price</span>
                  <div className="min-price-join-pool-item-content">
                    <div className="btn-min-price-join-pool-item" data-type="remove-second" onClick={() => handleChangeValueMinPrice('second', Number(dataPoolCreate?.valueMinPrice?.second) - 0.0001)}>
                      <Image src="/icon/btn-remove.svg" width={26} height={26} alt="btn-add" />
                    </div>
                    <input className="input-min-join-pool-item" data-type-input="second" value={dataPoolCreate?.valueMinPrice?.second} onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                      handleChangeValueMinPrice('second', e.target.value)
                    }} />
                    <div className="btn-min-price-join-pool-item" data-type="add-second" onClick={() => handleChangeValueMinPrice('second', Number(dataPoolCreate?.valueMinPrice?.second) + 0.0001)}>
                      <Image src="/icon/btn-add.svg" width={26} height={26} alt="btn-add" />
                    </div>
                  </div>
                  <span className="min-price-join-pool-item-text">{dataPoolCreate?.tokenPool?.second?.symbol} per {dataPoolCreate?.tokenPool?.first?.symbol}</span>
                </div>
              </div>
              <div className={`btn-approve ${approve.active ? 'btn-approve-active' : ''}`} onClick={() => ClickApprove()}>
                {approve.active ? 'Approved' : 'Approve'} {dataPoolCreate?.tokenPool?.second?.symbol} {approve.loading ? <div className="loader"></div> : null}
              </div>
              <Dialog>
                {!approve.active ? (
                  <div
                    className={`button-swap btn-prview ${approve.active ? "" : "button-swap-disabled"
                      }`}
                  >
                    <span>Preview</span>
                  </div>
                ) : (
                  <DialogTrigger asChild>
                    <div
                      className={`button-swap btn-prview ${approve.active ? "" : "button-swap-disabled"
                        }`}
                    >
                      <span>Preview</span>
                    </div>
                  </DialogTrigger>
                )}
                <DialogOverlay className="overlayPreview" />
                <DialogContent className="modal-container w-[95%] max-w-[533px] rounded-[27px] bg-white px-[24px] pb-[36px] pt-[28px]">
                  <ModalPreviewPool
                    dataPool={dataPoolCreate}
                    onClickAddPool={() => { }}
                  />
                </DialogContent>

                <Button
                  loading={loading}
                  type={"submit"}
                  disabled={isCheckPoolRequired}
                  className="button-swap btn-prview"
                  onClick={() => handleCreatePool()}
                >
                  <span>
                    {renderButtonPreview ??
                      (poolExists ? "Add liquidity" : "Create pool")}
                  </span>
                </Button>
              </Dialog>
            </div>
          </div>
        </div>
        {!dataPoolCreate.tokenPool.first || !dataPoolCreate.tokenPool.second ? (
          <div className="popup-hide">
            <Image
              src="/icon/icon-hide-pool.svg"
              width={30}
              height={30}
              alt="icon-hide-pool"
            />{" "}
            <span className="text-[16px] text-black">
              Your Position will appear here
            </span>
          </div>
        ) : null}
      </div>
      {walletElement}
    </>

  );
}
