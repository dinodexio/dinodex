"use client";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import { useState } from "react";
import styles from "../css/pool.module.css";
import stylesModal from "../css/modal.module.css";
import stylesButton from "../css/button.module.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModalListToken } from "../modalListToken/modalListToken";
import { tokens } from "@/tokens";
import { Button } from "../ui/button";
import { Balance, precision, removeTrailingZeroes } from "../ui/balance";
import { Card, CardContent, CardHeader } from "../ui/card";
import Link from "next/link";
import { ModalSupplyComfirm } from "../modalSupplyConfirm/modalSupplyConfirm";
import { PoolPosition } from "./position";
import { Balances } from "../wallet/wallet";
import { Footer } from "../footer";
import dynamic from "next/dynamic";
import { formatPercentage, truncateString } from "@/lib/utils";
import { EMPTY_DATA } from "@/constants";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { initCheckForm } from "@/containers/async-pool-add-page";
import useClickOutside from "@/hook/useClickOutside";
const Header = dynamic(() => import("@/components/header"), {
  ssr: false,
});

export interface PoolAddProps {
  walletElement?: JSX.Element;
  tokenParams?: any;
  balances?: Balances;
  loading?: boolean;
  poolExists?: boolean;
  handleMax?: (type: string) => void;
  tokenA_One_amount?: number;
  tokenB_One_amount?: number;
  tokenABalance?: any;
  tokenBBalance?: any;
  onSubmit: any;
}

export function PoolAdd({
  tokenParams,
  balances,
  loading,
  handleMax,
  poolExists,
  tokenA_One_amount,
  tokenB_One_amount,
  tokenABalance,
  tokenBBalance,
  onSubmit,
}: PoolAddProps) {
  const form = useFormContext();
  const error = Object.values(form.formState.errors)[0]?.message?.toString();
  const fields = form.getValues();
  // state dummy create pool
  const [typeOpenModal, setTypeOpenModal] = useState<string>("");

  const [isOpen, setIsOpen] = useState(false);

  const [openSetting, setOpenSetting] = useState(false);

  const settingRef = useClickOutside<HTMLDivElement>(() => {
    setOpenSetting(false);
  });

  const handleOpenChange = (open: boolean) => {
    // Only allow closing the dialog if triggered programmatically
    if (!open) return;
    setIsOpen(open);
  };
  const nameToken = `${typeOpenModal}_token`;

  const handleSelectToken = (token: any) => {
    form.setValue(nameToken, token?.value);
    form.trigger(nameToken);

    // Get the current values of the selected tokens
    const currentTokenA = form.getValues("tokenA_token") || "";
    const currentTokenB = form.getValues("tokenB_token") || "";

    // Determine the token label based on the modal type
    const tokenA =
      typeOpenModal === "tokenA" ? token?.label : tokens[currentTokenA]?.ticker;
    const tokenB =
      typeOpenModal === "tokenB" ? token?.label : tokens[currentTokenB]?.ticker;

    // Update the URL with the selected tokens
    window.history.replaceState(null, "", `/add/${tokenA}/${tokenB}`);
  };

  const handleClosePool = (isClear: boolean = false) => {
    if (isClear) {
      form.reset({
        ...fields,
        ...initCheckForm,
        tokenA_amount: "",
        tokenB_amount: "",
      });
    }
    form.clearErrors();
    form.trigger();
  };

  const valuePer = {
    perA: tokenA_One_amount
      ? removeTrailingZeroes(tokenA_One_amount.toFixed(precision))
      : null,
    perB: tokenB_One_amount
      ? removeTrailingZeroes(tokenB_One_amount.toFixed(precision))
      : null,
  };

  // console.log('tokenB_amount', form.getValues('tokenB_amount'))

  return (
    <>
      <div className="flex w-full flex-col px-[16px] pb-[8px] pt-8 sm:px-[16px] lg:px-[32px] xl:px-[41px]">
        <Toaster />
        <div className="flex basis-11/12 flex-col 2xl:basis-10/12">
          <Header />
          <div className="mx-auto mt-[40px] flex w-full max-w-[1065px] flex-col items-center justify-center gap-[25px] sm:mt-[40px] lg:mt-[100px] xl:mt-[113.74px]">
            <Card
              className={`mx-auto flex w-full max-w-[605px] flex-col gap-[15px] rounded-[24px] border-none bg-bgWhiteColor px-[8px] py-[8px] shadow-popup sm:px-[8px] sm:py-[8px] lg:px-[15px] lg:pb-[20px] lg:pt-[25px] xl:px-[15px] xl:pb-[20px] xl:pt-[25px]`}
            >
              <CardHeader className="flex-row items-center justify-between p-0 px-[10px]">
                <Link href="/pool">
                  <Image
                    src="/icon/Arrow-2.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                </Link>
                <span className="text-[20px] font-[600] text-textBlack">
                  Add liquidity
                </span>
                <div
                  className="relative flex h-[42px] items-center gap-1 p-[6px]"
                  ref={settingRef}
                >
                  <span className="text-[20px] font-[400] text-textBlack opacity-60">
                    {fields.slippage_custom
                      ? `${truncateString(fields.slippage_custom, precision)}%`
                      : null}
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
                       shadow-content transition duration-300 ease-in-out hover:bg-[#EBEBEB] sm:text-[16px] lg:text-[18px] xl:text-[18px]
                      ${fields.slippage_custom ? "text-textBlack" : "text-borderOrColor"}
                      `}
                          onClick={() => {
                            if (form.getValues("slippage_custom")) {
                              form.setValue("slippage_custom", "");
                            }
                            form.setValue("slippage", "0.5");
                          }}
                        >
                          Auto
                        </div>
                        <div className="flex items-center gap-[2px]">
                          <Input
                            {...form.register("slippage_custom", {
                              onChange: (e) => {
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
                                  form.setValue("slippage_custom", ""); // Reset if more than one '.'
                                  return;
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
                                  form.setValue("slippage_custom", ""); // Reset if input is out of range
                                  return;
                                }

                                // Step 8: Update form value if valid
                                form.setValue("slippage_custom", input);
                              },
                            })}
                            className="= mr-[2px] h-full w-[50px] border-0 border-none bg-transparent p-0 text-right text-[18px] font-[400] text-textBlack opacity-50 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-[18px] lg:text-[18px] xl:text-[18px]"
                            placeholder="0.5"
                            type="text"
                            inputMode="decimal"
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
                          {...form.register("transactionDeadline", {
                            onChange: (e) => {
                              const value = parseFloat(e.target.value) || 0;
                              if (value > 4320) {
                                form.setValue("transactionDeadline", "4320");
                              }
                            },
                          })}
                          type="number"
                          min={0}
                          max={4320}
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
              <CardContent className="flex flex-col gap-[15px] p-0">
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
                    <strong className="font-[600]">Tip:</strong>When you add
                    liquidity, you will receive pool tokens representing your
                    position. These tokens automatically earn fees proportional
                    to your share of the pool, and can be redeemed at any time.
                  </span>
                </div>
                <Dialog>
                  <div className="flex flex-col items-center justify-center gap-[15px]">
                    <div
                      className="flex w-full flex-col gap-[10px] rounded-[12px] border-none bg-white shadow-content"
                      style={{ padding: "18px 8px 18px 18px" }}
                    >
                      <div className="flex items-center justify-between">
                        <Input
                          {...form.register("tokenA_amount", {
                            onChange: (e) => {
                              let value = e.target.value;

                              // Step 1: Remove invalid characters (e/E)
                              value = value.replace(/[eE]/g, "");

                              // Step 2: Replace ',' with '.' for decimal formatting
                              value = value.replace(/,/g, ".");

                              // Step 3: Remove all invalid characters except digits and '.'
                              value = value.replace(/[^0-9.]/g, "");

                              // Step 4: Ensure only one '.'
                              const parts = value.split(".");
                              if (parts.length > 2) {
                                value = parts[0] + "." + parts[1]; // Keep the first two parts
                              }

                              // Step 5: Add '0' before '.' if it starts with '.'
                              if (value.startsWith(".")) {
                                value = `0${value}`;
                              }

                              // Step 6: Update the form value
                              form.setValue("tokenA_amount", value);
                            },
                          })}
                          className="w-[50%] border-none bg-transparent p-0 text-[30px] font-[400] text-textBlack outline-none placeholder:opacity-[0.4] focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="0"
                          maxLength={70}
                          inputMode="decimal"
                          type="text"
                        />
                        <DialogTrigger
                          className={`flex h-[36px] items-center gap-[4px] rounded-[18px] px-[18px]  py-[6px] ${
                            fields?.tokenA_token
                              ? "bg-[#C5B4E3] hover:bg-[#C5B4E3]"
                              : "hover:bg-[#EBEBEB]"
                          }`}
                          style={{
                            transition: "all 0.3s ease" ,
                            boxShadow:
                              "0px 1px 4px 0px rgba(26, 26, 26, 0.30) inset",
                          }}
                          onClick={() => setTypeOpenModal("tokenA")}
                        >
                          {fields.tokenA_token ? (
                            <div className="flex items-center gap-[8px]">
                              <Image
                                src={tokens[fields?.tokenA_token]?.logo ?? ""}
                                alt="logo"
                                width={24}
                                height={24}
                                className="h-[18px] w-[18px] sm:h-[18px] sm:w-[18px] lg:h-6 lg:w-6 xl:h-6 xl:w-6"
                              />
                              <span className="text-[14px] font-[400] text-textBlack sm:text-[14px] lg:text-[18px] xl:text-[18px]">
                                {tokens[fields?.tokenA_token]?.ticker ??
                                  EMPTY_DATA}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[14px] font-[600] text-textBlack sm:text-[14px] lg:text-[18px] xl:text-[18px]">
                              Select a token
                            </span>
                          )}
                          <Image
                            src={"/icon/drop-down-icon.svg"}
                            alt="drop-down-icon"
                            width={24}
                            height={24}
                          />
                        </DialogTrigger>
                      </div>
                      {fields.tokenA_token && (
                        <div className="flex items-center justify-end gap-[10px]">
                          <span className="text-[14px] font-[400] text-textBlack sm:text-[14px] lg:text-[18px] xl:text-[18px]">
                            Balance: <Balance balance={tokenABalance ?? "0"} />
                          </span>
                          <div
                            className="flex h-[25px] cursor-pointer items-center justify-center rounded-[6px] border-none px-2 py-1 text-[14px] font-[400] text-textBlack hover:bg-[#EBEBEB] sm:text-[14px] lg:text-[16px] xl:text-[16px]"
                            style={{
                              transition: "all 0.3s ease",
                              boxShadow: "0px 2px 8px 0px rgba(0, 0, 0, 0.25)",
                            }}
                            onClick={() => handleMax?.("tokenA")}
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
                      className="flex w-full flex-col gap-[10px] rounded-[12px] border-none bg-white shadow-content"
                      style={{ padding: "18px 8px 18px 18px" }}
                    >
                      <div className="flex items-center justify-between">
                        <Input
                          {...form.register("tokenB_amount", {
                            onChange: (e) => {
                              let value = e.target.value;

                              // Step 1: Remove invalid characters (e/E)
                              value = value.replace(/[eE]/g, "");

                              // Step 2: Replace ',' with '.' for decimal formatting
                              value = value.replace(/,/g, ".");

                              // Step 3: Remove all invalid characters except digits and '.'
                              value = value.replace(/[^0-9.]/g, "");

                              // Step 4: Ensure only one '.'
                              const parts = value.split(".");
                              if (parts.length > 2) {
                                value = parts[0] + "." + parts[1]; // Keep the first two parts
                              }

                              // Step 5: Add '0' before '.' if it starts with '.'
                              if (value.startsWith(".")) {
                                value = `0${value}`;
                              }

                              // Step 6: Update the form value
                              form.setValue("tokenB_amount", value);
                            },
                          })}
                          className="w-[50%] border-none bg-transparent p-0 text-[30px] font-[400] text-textBlack outline-none placeholder:opacity-[0.4] focus-visible:ring-0 focus-visible:ring-offset-0"
                          disabled={poolExists}
                          placeholder="0"
                          maxLength={70}
                          type="text"
                        />
                        <DialogTrigger
                          className={`flex h-[36px] items-center gap-[4px] rounded-[18px] border-none px-[18px] py-[6px] ${
                            fields.tokenB_token
                              ? "bg-[#9FE4C9] hover:bg-[#9FE4C9]"
                              : "hover:bg-[#EBEBEB] "
                          }`}
                          style={{
                            transition: "all 0.3s ease",
                            boxShadow:
                              "0px 1px 4px 0px rgba(26, 26, 26, 0.30) inset",
                          }}
                          onClick={() => setTypeOpenModal("tokenB")}
                        >
                          {fields.tokenB_token ? (
                            <div className="flex items-center gap-[8px]">
                              <Image
                                src={tokens[fields.tokenB_token]?.logo ?? ""}
                                alt="logo"
                                width={24}
                                height={24}
                                className="h-[18px] w-[18px] sm:h-[18px] sm:w-[18px] lg:h-6 lg:w-6 xl:h-6 xl:w-6"
                              />
                              <span className="text-[14px] font-[400] text-textBlack sm:text-[14px] lg:text-[18px] xl:text-[18px]">
                                {tokens[fields.tokenB_token]?.ticker}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[14px] font-[600] text-textBlack sm:text-[14px] lg:text-[18px] xl:text-[18px]">
                              Select a token
                            </span>
                          )}
                          <Image
                            src={"/icon/drop-down-icon.svg"}
                            alt="drop-down-icon"
                            width={24}
                            height={24}
                          />
                        </DialogTrigger>
                      </div>
                      {fields.tokenB_token && (
                        <div className="flex items-center justify-end gap-[10px]">
                          <span className="text-[14px] font-[400] text-textBlack sm:text-[14px] lg:text-[18px] xl:text-[18px]">
                            Balance: <Balance balance={tokenBBalance ?? "0"} />
                          </span>
                          {!poolExists && (
                            <div
                              className="flex h-[25px] cursor-pointer items-center justify-center rounded-[6px] border-none px-2 py-1 text-[14px] font-[400] text-textBlack hover:bg-[#EBEBEB] sm:text-[14px] lg:text-[16px] xl:text-[16px]"
                              style={{
                                transition: "all 0.3s ease",
                                boxShadow:
                                  "0px 2px 8px 0px rgba(0, 0, 0, 0.25)",
                              }}
                              onClick={() => handleMax?.("tokenB")}
                            >
                              MAX
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {fields.tokenA_token && fields.tokenB_token && (
                      <div className="flex w-full flex-col gap-[15px] rounded-[12px] border-none pt-[15px] shadow-content sm:pt-[15px] lg:pt-[20px] xl:pt-[20px]">
                        <span className="px-5 text-[16px] font-[600] text-textBlack sm:text-[16px] lg:text-[20px] xl:text-[20px]">
                          Prices and pool share
                        </span>
                        <div className="flex w-full items-center justify-between rounded-[12px] px-[20px] py-[20px] shadow-content sm:px-[20px] lg:px-[20px] xl:px-[20px]">
                          <div className="flex w-[30%] max-w-[150px] flex-col items-center gap-[10px]">
                            <span className="text-[15px] font-[500] text-textBlack sm:text-[15px] lg:text-[18px] xl:text-[18px]">
                              {isFinite(parseFloat(valuePer?.perB ?? ""))
                                ? valuePer?.perB
                                : "~"}
                            </span>
                            <span className="text-[15px] font-[600] text-textBlack opacity-[0.6] sm:text-[15px] lg:text-[18px] xl:text-[18px]">
                              {tokens[fields?.tokenB_token]?.ticker ||
                                EMPTY_DATA}{" "}
                              per{" "}
                              {tokens[fields?.tokenA_token]?.ticker ||
                                EMPTY_DATA}
                            </span>
                          </div>
                          <div className="flex w-[30%] max-w-[150px] flex-col items-center gap-[10px]">
                            <span className="text-[15px] font-[500] text-textBlack sm:text-[15px] lg:text-[18px] xl:text-[18px]">
                              {isFinite(parseFloat(valuePer?.perA ?? ""))
                                ? valuePer?.perA
                                : "~"}
                            </span>
                            <span className="text-[15px] font-[600] text-textBlack opacity-[0.6] sm:text-[15px] lg:text-[18px] xl:text-[18px]">
                              {tokens[fields?.tokenA_token]?.ticker ||
                                EMPTY_DATA}{" "}
                              per{" "}
                              {tokens[fields?.tokenB_token]?.ticker ||
                                EMPTY_DATA}
                            </span>
                          </div>
                          <div className="flex w-[30%] max-w-[150px] flex-col items-center gap-[10px]">
                            <span className="text-[15px] font-[500] text-textBlack sm:text-[15px] lg:text-[18px] xl:text-[18px]">
                              {formatPercentage(fields.shareOfPool ?? "") ??
                                "~"}
                              %
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
                  <DialogContent
                    className={`${stylesModal["modal-container"]} bg-white px-[19.83px] pb-[33.88px] pt-[21.49px]`}
                  >
                    <DialogHeader>
                      <DialogTitle />
                      <DialogDescription />
                    </DialogHeader>
                    <ModalListToken
                      tokenSelected={
                        fields[nameToken] && tokens[fields[nameToken]]
                      }
                      onClickToken={(token) => handleSelectToken(token)}
                      dialogClose={true}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                  <DialogTrigger
                    asChild
                    disabled={!form.formState.isValid}
                    onClick={() => {
                      setIsOpen(true);
                      form.setValue("isComfirmed", true);
                    }}
                  >
                    <Button
                      loading={loading}
                      disabled={!form.formState.isValid}
                      className={`${stylesButton["button-swap"]} ${stylesButton["btn-approve-new"]}  ${stylesButton["btn-preview"]}`}
                      // onClick={(event) => {
                      //   event.preventDefault();
                      // }}
                    >
                      <span>
                        {error ??
                          (poolExists ? "Add liquidity" : "Create pool")}
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogOverlay
                    className="bg-[rgba(0,0,0,0.5)]"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <DialogOverlay
                    className="bg-[rgba(0,0,0,0.5)]"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <DialogContent
                    className={`${stylesModal["modal-container"]} ${stylesModal["modal-pool"]} w-[99%] max-w-[625px] border-none bg-white px-[20px] pb-[20px] pt-[27px] sm:px-[20px] sm:pt-[27px] lg:px-[30px] lg:pt-[35px] xl:px-[30px] xl:pt-[35px]`}
                  >
                    <DialogHeader>
                      <DialogTitle />
                      <DialogDescription />
                    </DialogHeader>
                    <ModalSupplyComfirm
                      lpAmount={
                        <span
                          className="lg:texst-[52px] h-[45px] text-[34px] font-[600] text-black sm:text-[34px] xl:text-[52px]"
                          style={{
                            lineHeight: "52px",
                            letterSpacing: "-1px",
                          }}
                        >
                          {fields.tokenLP_amount || EMPTY_DATA}
                        </span>
                      }
                      shareOfPool={
                        <span className="flex items-center gap-1 text-[16px] font-[500] text-black sm:text-[16px] lg:text-[20px] xl:text-[20px]">
                          {formatPercentage(fields.shareOfPool ?? "0")} %
                        </span>
                      }
                      tokenIn={
                        tokenParams?.tokenA?.label ||
                        tokens[fields.tokenA_token]?.ticker ||
                        EMPTY_DATA
                      }
                      tokenOut={
                        tokenParams?.tokenB?.label ||
                        tokens[fields.tokenB_token]?.ticker ||
                        EMPTY_DATA
                      }
                      tokenIn_token={
                        tokenParams?.tokenA?.value ||
                        fields.tokenA_token ||
                        EMPTY_DATA
                      }
                      tokenOut_token={
                        tokenParams?.tokenB?.value ||
                        fields.tokenB_token ||
                        EMPTY_DATA
                      }
                      tokenInAmount={fields.tokenA_amount || EMPTY_DATA}
                      tokenOutAmount={fields.tokenB_amount || EMPTY_DATA}
                      poolExists={poolExists}
                      valuePer={valuePer}
                      loading={loading}
                      onClosePool={(isClear: boolean = false) => {
                        handleClosePool(isClear);
                        setIsOpen(false); // Close programmatically
                      }}
                      onClickAddPool={onSubmit}
                    />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            {poolExists && fields.tokenA_token && fields.tokenB_token && (
              <PoolPosition dataPool={null} balances={balances} />
            )}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
