import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { USDBalance } from "@/components/ui/usd-balance";
import { tokens } from "@/tokens";
import { useWalletStore } from "@/lib/stores/wallet";
import { useBalance } from "@/lib/stores/balances";
import BigNumber from "bignumber.js";
import { Balance, precision } from "@/components/ui/balance";
import { amout, PRICE_MINA, PRICE_USD } from "@/constants";
import { TokenSelector } from "@/components/ui/token-selector";
import styles from '../../css/wallet.module.css'

export interface WithdrawFormProps {
  onClose?: () => void;
  handleChangeStatusLayout?: (value: any) => void;
  handleOpenSelectToken?: () => void;
}

export function WithdrawForm({
  onClose,
  handleChangeStatusLayout,
  // handleOpenSelectToken,
}: WithdrawFormProps) {
  const wallet = useWalletStore();
  const [inputValue, setInputValue] = useState<any>(500);
  const [amountPercent, setAmoutPercent] = useState(null);
  const form = useFormContext();
  const error = Object.values(form.formState.errors)[0]?.message?.toString();
  const fields = form.getValues();
  const balance = useBalance(fields?.amount_token, wallet.wallet);
  const tokenName = tokens[fields?.amount_token]?.ticker || "";
  return (
    <>
      <div className="flex items-center justify-between pb-[11px] pl-[6px] pr-[8px] pt-[7px]">
        <span className="text-[23.556px] font-[500] text-textBlack">Send</span>
        <Image
          src="/icon/Close-icon.svg"
          width={24}
          height={24}
          alt=""
          className="cursor-pointer"
          onClick={() => onClose && onClose()}
        />
      </div>
      <div className="flex flex-col gap-[8px]">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-[500] text-textBlack">Assets</span>
          {tokenName && (
            <span className="text-[12px] font-[500] text-[#42D1D5]">
              <Balance balance={balance} /> {tokenName} Available
            </span>
          )}
        </div>
        <div className="flex flex-col gap-[10px]">
          <div className={`flex items-center justify-between rounded-[8px] p-2 shadow-content`}>
            <div className="flex flex-col gap-[4px]">
              <span className="text-[12px] font-[400] text-textBlack opacity-60">
                Amount
              </span>
              <div className="flex flex-col items-start gap-[2px]">
                <Input
                  {...form.register("amountValue")}
                  placeholder="0"
                  autoFocus
                  className={cn([
                    "h-auto border-0 w-[80px] bg-bgWhiteColor p-0 text-[16.774px] font-[400] text-textBlack outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                  ])}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9.]/g, "");
                    const parts = value.split(".");
                    if (parts.length > 2) {
                      value = parts[0] + "." + parts.slice(1).join("");
                    }
                    setInputValue(value);
                  }}
                />
                <span className="text-[9.202px] font-[500] italic text-textBlack opacity-50">
                  <USDBalance
                    balance={
                      (fields?.amountValue * PRICE_USD).toString() || "0"
                    }
                    type="USD"
                  />
                </span>
              </div>
            </div>
            <TokenSelector name={"amount"} />
          </div>
          <div className="flex items-center gap-[7.74px]">
            {amout?.map((item: any, index) => {
              return (
                <div
                  className={`flex w-[39px] cursor-pointer items-center justify-center rounded-[4.553px] px-[9.53px] py-[2.73px] transition-all shadow-content duration-300 ease-in-out ${amountPercent === item.value ? "bg-textBlack hover:bg-textBlack" : "bg-white hover:bg-[#EBEBEB]"}`}
                  key={index}
                  //   onClick={() => setAmoutActive(item.value)}
                  onClick={() => {
                    if (fields?.amount_token) {
                      setAmoutPercent(item.value);
                      const result = BigNumber(balance || "")
                        .div(10 ** precision)
                        .toFixed(2);
                      const amount = BigNumber(result)
                        .times(item.value)
                        .div(100)
                        .toNumber();
                      form.setValue("amountValue", amount.toString(), {
                        shouldDirty: true,
                        shouldValidate: true,
                        shouldTouch: true,
                      });
                      // Trigger validate sau khi set value
                      form.trigger("amountValue");
                    }
                  }}
                >
                  <span
                    className={`text-[9.106px] font-[400] ${amountPercent === item.value ? "text-bgWhiteColor" : "text-textBlack"}`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-[2px] flex flex-col gap-[8px]">
          <span className="text-[12px] font-[500] text-textBlack">
            Recipient
          </span>
          <Input
            {...form.register("toRecipientAddress")}
            placeholder={"0x1351617..."}
            className={cn([
              "rounded-[8px] border-none bg-bgWhiteColor h-[40px] px-[10px] py-[8px] text-[12px] font-[400] text-textBlack focus-visible:ring-0 focus-visible:ring-offset-0 shadow-content",
            ])}
          />
        </div>
        {fields?.amount_token && fields?.amountValue && (
          <div className="mt-[2px] flex justify-between rounded-[8px] bg-[#CACACA] p-2 ">
            <span className="text-[12px] font-[400] text-textBlack">Fee</span>
            <div className="flex items-center gap-[2px]">
              <span className="text-[12px] font-[500] text-textBlack">
                <Balance balance={(0.01 * fields.amountValue).toString()} />{" "}
                MINA
              </span>
              <span className="text-[12px] font-[500] text-textBlack opacity-60">
                <USDBalance
                  balance={(0.01 * fields.amountValue * PRICE_MINA)
                    .toFixed(2)
                    .toString()}
                  type="USD"
                />
              </span>
            </div>
          </div>
        )}

        <div
          className="mt-[6px] flex cursor-pointer items-center justify-center rounded-[8px] shadow-content bg-white px-4 py-2 transition-all duration-300 ease-in-out hover:bg-[#EBEBEB]"
          onClick={() => {
            if (!error) {
              handleChangeStatusLayout?.({
                withdraw: false,
                confirm: true,
                waiting: false,
              });
            }
          }}
        >
          <span className="text-[14px] font-[500] text-textBlack">
            {error ?? "Next"}
          </span>
        </div>
      </div>
    </>
  );
}
