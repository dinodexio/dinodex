"use client";
import Header from "./header";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import { useState } from "react";
import styles from "./css/modal.module.css";
import { LIST_FEE_TIER } from "@/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModalListToken } from "./modalListToken/modalListToken";
import { ModalPreviewPool } from "./modalPreviewPool/modalPreviewPool";
import { Footer } from "./footer";
export interface PoolJoinProps {}

export function PoolJoin({}: PoolJoinProps) {
  // state dummy join pool
  const [dataPoolCreate, setDataPoolCreate] = useState<any>({
    tokenPool: {
      first: {
        id: 1,
        logo: "images/swap/logo-token-default.svg",
        name: "ethereum",
        slug: "ethereum",
        symbol: "ETH",
        price: 1000,
        change1h: "0.1",
        fdv: 7100000000,
        volume: 300000000,
      },
      second: null,
    },
    feeTier: 1,
    valueMinPrice: {
      first: 0,
      second: 0,
    },
    deposit_amount: {
      first: 1,
      second: 1,
    },
  });

  const [typeOpenModal, setTypeOpenModal] = useState<string>("first");

  const [showFeeTier, setShowFeeTier] = useState<boolean>(false);

  const [approve, setApprove] = useState<any>({
    active: false,
    loading: false,
  });

  // func change value input deposit amounts
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

  // func change value input deposit amounts
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

  return (
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
                    leading-none text-black hover:bg-[#EBEBEB] ${dataPoolCreate.tokenPool.first ? "content-left-select-token-item-have-token" : ""}
                    `}
                    style={{ transition: "all 0.3s ease" }}
                    onClick={() => setTypeOpenModal("first")}
                  >
                    {dataPoolCreate.tokenPool.first ? (
                      <div className="flex items-center gap-[8px]">
                        <img
                          src={"/" + dataPoolCreate.tokenPool.first.logo}
                          alt="logo"
                          width={24}
                          height={24}
                        />
                        <span>{dataPoolCreate?.tokenPool?.first?.symbol}</span>
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
                    ${dataPoolCreate.tokenPool.second ? "content-left-select-token-item-have-token" : ""}
                    `}
                    style={{ transition: "all 0.3s ease" }}
                    onClick={() => setTypeOpenModal("second")}
                  >
                    {dataPoolCreate.tokenPool.second ? (
                      <div className="flex items-center gap-[8px]">
                        <Image
                          src={"/" + dataPoolCreate.tokenPool.second.logo}
                          alt="logo"
                          width={24}
                          height={24}
                        />
                        <span>{dataPoolCreate?.tokenPool?.second?.symbol}</span>
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
                <DialogContent
                  className={`bg-white px-[19.83px] pb-[33.88px] pt-[21.49px] ${styles["modal-container"]}`}
                >
                  <DialogHeader>
                    <DialogTitle />
                    <DialogDescription />
                  </DialogHeader>
                  <ModalListToken
                    tokenSelected={dataPoolCreate.tokenPool[typeOpenModal]}
                    onClickToken={(token) =>
                      setDataPoolCreate({
                        ...dataPoolCreate,
                        tokenPool: {
                          ...dataPoolCreate.tokenPool,
                          [typeOpenModal]: token,
                        },
                      })
                    }
                    dialogClose={true}
                  />
                </DialogContent>
              </Dialog>
              <div
                className={`mt-[15px] flex h-[92px] w-full items-center justify-between rounded-[21px] border-[1px] border-black bg-white py-[12px] pl-[20px] pr-[10px] ${!dataPoolCreate.tokenPool.first || !dataPoolCreate.tokenPool.second ? "content-pool-hide" : ""}`}
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
              className={`choose-fee-tier-content ${showFeeTier ? "choose-fee-tier-content-show" : ""}`}
            >
              {LIST_FEE_TIER.map((item, index) => (
                <div
                  className={`choose-fee-tier-item ${Number(dataPoolCreate.feeTier) === item.value ? "choose-fee-tier-active" : ""}`}
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
              className={`${!dataPoolCreate.tokenPool.first || !dataPoolCreate.tokenPool.second ? "content-pool-hide" : ""}`}
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
                    <span className="value-price-desc">$1,823.80</span>
                  </div>
                  <div className="deposit-amounts-item-right">
                    <div
                      className="token-select-deposit-amount"
                      data-type="first"
                    >
                      <Image
                        src={"/" + dataPoolCreate.tokenPool.first.logo}
                        width={24}
                        height={24}
                        alt="circle"
                      />
                      <span className="token-symbol-deposit-amount">
                        {dataPoolCreate?.tokenPool?.first?.symbol}
                      </span>
                    </div>
                    <div className="deposit-amount-balance">
                      <span className="balance-deposit-amount">Balance: 0</span>
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
                      onChange={(e) => handleChangeDepositAmount("second", e)}
                    />
                    <span className="value-price-desc">$1,823.80</span>
                  </div>
                  <div className="deposit-amounts-item-right">
                    <div
                      className="token-select-deposit-amount"
                      data-type="second"
                    >
                      <Image
                        src={"/" + dataPoolCreate?.tokenPool?.second?.logo}
                        width={24}
                        height={24}
                        alt="circle"
                      />
                      <span className="token-symbol-deposit-amount">
                        {dataPoolCreate?.tokenPool?.second?.symbol}
                      </span>
                    </div>
                    <div className="deposit-amount-balance">
                      <span className="balance-deposit-amount">Balance: 0</span>
                      <div className="btn-max-deposit-amount">Max</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`content-right ${!dataPoolCreate.tokenPool.first || !dataPoolCreate.tokenPool.second ? "content-pool-hide" : ""}`}
          >
            <div className="header-content-right">
              <span className="content-left-header">Set Starting Price</span>
            </div>
            <div className="h-[325px] w-full text-textBlack">Chart</div>
            <div className="content-min-price-join-pool">
              <div className="min-price-join-pool-item">
                <span className="min-price-join-pool-item-title">
                  Min Price
                </span>
                <div className="min-price-join-pool-item-content">
                  <div
                    className="btn-min-price-join-pool-item"
                    data-type="remove-first"
                    onClick={() =>
                      handleChangeValueMinPrice(
                        "first",
                        Number(dataPoolCreate?.valueMinPrice?.first) - 0.0001,
                      )
                    }
                  >
                    <Image
                      src="/icon/btn-remove.svg"
                      width={26}
                      height={26}
                      alt="btn-add"
                    />
                  </div>
                  <input
                    className="input-min-join-pool-item"
                    data-type-input="first"
                    value={dataPoolCreate?.valueMinPrice?.first}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                      handleChangeValueMinPrice("first", e.target.value);
                    }}
                  />
                  <div
                    className="btn-min-price-join-pool-item"
                    data-type="add-first"
                    onClick={() =>
                      handleChangeValueMinPrice(
                        "first",
                        Number(dataPoolCreate?.valueMinPrice?.first) + 0.0001,
                      )
                    }
                  >
                    <Image
                      src="/icon/btn-add.svg"
                      width={26}
                      height={26}
                      alt="btn-add"
                    />
                  </div>
                </div>
                <span className="min-price-join-pool-item-text">
                  {dataPoolCreate?.tokenPool?.first?.symbol} per{" "}
                  {dataPoolCreate?.tokenPool?.second?.symbol}
                </span>
              </div>
              <div className="min-price-join-pool-item">
                <span className="min-price-join-pool-item-text">Min Price</span>
                <div className="min-price-join-pool-item-content">
                  <div
                    className="btn-min-price-join-pool-item"
                    data-type="remove-second"
                    onClick={() =>
                      handleChangeValueMinPrice(
                        "second",
                        Number(dataPoolCreate?.valueMinPrice?.second) - 0.0001,
                      )
                    }
                  >
                    <Image
                      src="/icon/btn-remove.svg"
                      width={26}
                      height={26}
                      alt="btn-add"
                    />
                  </div>
                  <input
                    className="input-min-join-pool-item"
                    data-type-input="second"
                    value={dataPoolCreate?.valueMinPrice?.second}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                      handleChangeValueMinPrice("second", e.target.value);
                    }}
                  />
                  <div
                    className="btn-min-price-join-pool-item"
                    data-type="add-second"
                    onClick={() =>
                      handleChangeValueMinPrice(
                        "second",
                        Number(dataPoolCreate?.valueMinPrice?.second) + 0.0001,
                      )
                    }
                  >
                    <Image
                      src="/icon/btn-add.svg"
                      width={26}
                      height={26}
                      alt="btn-add"
                    />
                  </div>
                </div>
                <span className="min-price-join-pool-item-text">
                  {dataPoolCreate?.tokenPool?.second?.symbol} per{" "}
                  {dataPoolCreate?.tokenPool?.first?.symbol}
                </span>
              </div>
            </div>
            <div
              className={`btn-approve ${approve.active ? "btn-approve-active" : ""}`}
              onClick={() => ClickApprove()}
            >
              {approve.active ? "Approved" : "Approve"}{" "}
              {dataPoolCreate?.tokenPool?.second?.symbol}{" "}
              {approve.loading ? <div className="loader"></div> : null}
            </div>
            <Dialog>
              {!approve.active ? (
                <div
                  className={`button-swap btn-prview ${approve.active ? "" : "button-swap-disabled"}`}
                >
                  <span>Preview</span>
                </div>
              ) : (
                <DialogTrigger asChild>
                  <div
                    className={`button-swap btn-prview ${approve.active ? "" : "button-swap-disabled"}`}
                  >
                    <span>Preview</span>
                  </div>
                </DialogTrigger>
              )}
              <DialogOverlay className="overlayPreview" />
              <DialogContent className="modal-container w-[95%] max-w-[533px] rounded-[27px] bg-white px-[24px] pb-[36px] pt-[28px]">
                <ModalPreviewPool
                  dataPool={dataPoolCreate}
                  onClickAddPool={() => {}}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Footer />
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
  );
}
