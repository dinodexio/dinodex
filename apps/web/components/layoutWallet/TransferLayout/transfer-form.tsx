import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn, formatBigNumber, formatPriceUSD } from "@/lib/utils";
import { USDBalance } from "@/components/ui/usd-balance";
import { useWalletStore } from "@/lib/stores/wallet";
import { useBalance } from "@/lib/stores/balances";
import BigNumber from "bignumber.js";
import { precision } from "@/components/ui/balance";
import { amout, PRICE_MINA } from "@/constants";
import { TokenSelector } from "@/components/ui/token-selector";
import { tokens } from "@/tokens";

export interface TransferFormProps {
  onClose?: () => void;
  disabled?: boolean;
  handleChangeStatusLayout?: (value: any) => void;
}

export function TransferForm({
  onClose,
  handleChangeStatusLayout,
  disabled,
}: TransferFormProps) {
  const wallet = useWalletStore();
  const [amountPercent, setAmoutPercent] = useState(null);
  const form = useFormContext();
  const error = Object.values(form.formState.errors)[0]?.message?.toString();
  const fields = form.getValues();
  const balance = useBalance(fields?.amount_token, wallet.wallet);
  return (
    <>
      <div className="flex items-center justify-between pb-[11px] pl-[6px] pr-[8px] pt-[7px]">
        <span className="text-[23.556px] font-[500] text-textBlack">
          Transfer
        </span>
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
        <div className="flex flex-col gap-[10px]">
          <div className="rounded-[8px] px-[14px] py-2 shadow-content">
            <div className="flex flex-col gap-[4px]">
              <span className="text-[12px] font-[400] text-textBlack opacity-60">
                Recipient
              </span>
              <div className="flex flex-col gap-[4px]">
                <Input
                  {...form.register("toRecipientAddress")}
                  disabled={disabled}
                  placeholder={"B62.."}
                  className={cn([
                    "h-auto w-full border-0 bg-bgWhiteColor p-0 text-[14.8px]  font-[400] text-textBlack focus-visible:ring-0 focus-visible:ring-offset-0",
                  ])}
                />

                <span className="text-[9.202px] font-[500] italic text-textBlack opacity-60">
                  Dinodex only supports Mina's B62 addresses
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-[8px] p-2 shadow-content">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start gap-[4px]">
                <span className="text-[12px] font-[400] text-textBlack opacity-60">
                  Amount
                </span>
                <div className="flex flex-row items-center justify-center">
                  <Input
                    {...form.register("amountValue", {
                      onChange: (e) => {
                        setAmoutPercent(null);
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
                        form.setValue("amountValue", value);
                      },
                    })}
                    placeholder="0"
                    className={cn([
                      "h-auto border-0 bg-bgWhiteColor p-0 text-[16.774px] font-[400] text-textBlack outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                    ])}
                    type="text"
                    maxLength={30} // Enforces maximum input length at the browser level
                    inputMode="decimal" // Suggests a numeric keyboard on mobile devices
                  />
                </div>
                <span className="mt-[-4px] text-[9.202px] font-[500] italic text-textBlack opacity-50">
                  <USDBalance
                    balance={formatPriceUSD(
                      fields.amountValue,
                      tokens[fields.amount_token]?.ticker ?? "",
                    )}
                    type="USD"
                  />
                </span>
              </div>
              <TokenSelector name={"amount"} />
            </div>
          </div>
          <div className="flex items-center gap-[7.74px]">
            {amout?.map((item: any, index) => {
              return (
                <div
                  className={`flex w-[39px] cursor-pointer items-center justify-center rounded-[4.553px] px-[9.53px] py-[2.73px] shadow-content transition-all duration-300 ease-in-out ${amountPercent === item.value ? "bg-textBlack hover:bg-textBlack" : "bg-white hover:bg-[#EBEBEB]"}`}
                  key={index}
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
        <div
          className="mt-[6px] flex cursor-pointer items-center justify-center rounded-[8px] bg-white px-4 py-2 shadow-content transition-all duration-300 ease-in-out hover:bg-[#EBEBEB]"
          onClick={() => {
            if (!error) {
              handleChangeStatusLayout?.({
                transfer: false,
                confirm: true,
                waiting: false,
              });
            }
          }}
        >
          <span className="text-[14px] font-[500] text-textBlack">
            {error ?? "Transfer"}
          </span>
        </div>
      </div>
    </>
  );
}
