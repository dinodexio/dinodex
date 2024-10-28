import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { USDBalance } from "@/components/ui/usd-balance";
import { ModalListToken } from "@/components/modalListToken/modalListToken";
import { tokens } from "@/tokens";
import { useWalletStore } from "@/lib/stores/wallet";
import { useObserveBalance } from "@/lib/stores/balances";
import BigNumber from "bignumber.js";
import { precision } from "@/components/ui/balance";
import { amout } from "@/constants";

export interface TransferFormProps {
  onClose?: () => void;
  disabled?: boolean;
  handleChangeStatusLayout?: (value: any) => void;
  handleSetTokenSelected?: (value: any) => void;
  handleOpenSelectToken?: () => void;
}

export function TransferForm({
  onClose,
  handleChangeStatusLayout,
  disabled,
  handleSetTokenSelected,
  handleOpenSelectToken,
}: TransferFormProps) {
  const wallet = useWalletStore();
  const [amountPercent, setAmoutPercent] = useState(null);
  const [openModalToken, setOpenModalToken] = useState(false);
  const form = useFormContext();
  const error = Object.values(form.formState.errors)[0]?.message?.toString();
  const fields = form.getValues();
  const balance = useObserveBalance(fields?.amount_token, wallet.wallet);
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
      <div className="flex flex-col gap-[8px] rounded-[12px] border border-textBlack p-2">
        <div className="flex flex-col gap-[10px]">
          <div className="rounded-[8px] border border-textBlack p-2">
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
                    "h-auto w-full border-0 bg-bgWhiteColor p-0  text-[16.774px] font-[400] focus-visible:ring-0 focus-visible:ring-offset-0",
                  ])}
                />

                <span className="text-[9.202px] font-[500] italic text-textBlack opacity-60">
                  Dinodex only supports Mina's B62 addresses
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-[8px] border border-textBlack p-2">
            <div className="flex flex-col gap-[4px]">
              <span className="text-[12px] font-[400] text-textBlack opacity-60">
                Amount
              </span>
              <Input
                {...form.register("amountValue")}
                placeholder="0"
                className={cn([
                  "h-auto w-[100px] border-0  bg-bgWhiteColor p-0 text-[16.774px] font-[400] text-textBlack outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                ])}
                onChange={(e) => {
                  setAmoutPercent(null);
                  form.setValue("amountValue", e.target.value);
                  form.trigger("amountValue");
                }}
              />
              <span className="text-[9.202px] font-[500] italic text-textBlack opacity-50">
                <USDBalance />
              </span>
            </div>
            <div
              className="flex cursor-pointer items-center gap-[8px] rounded-[8px] border border-textBlack p-2 transition-all duration-300 ease-in-out hover:bg-[#EBEBEB]"
              onClick={() => handleOpenSelectToken?.()}
            >
              {form && !fields.amount_token ? (
                <>
                  <span className="text-[14px] font-[500] text-textBlack">
                    Select Token
                  </span>
                  <Image
                    src={`/icon/drop-down-icon.svg`}
                    alt="logo"
                    width={20}
                    height={20}
                  />
                </>
              ) : (
                <>
                  <Image
                    src={tokens[fields.amount_token]?.logo || ""}
                    width={20}
                    height={20}
                    alt=""
                  />
                  <span className="mt-[2px] text-[14px] font-[500] text-textBlack">
                    {tokens[fields.amount_token]?.ticker}
                  </span>
                  <Image
                    src={`/icon/drop-down-icon.svg`}
                    alt="logo"
                    width={20}
                    height={20}
                  />
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-[7.74px]">
            {amout?.map((item: any, index) => {
              return (
                <div
                  className={`flex w-[39px] cursor-pointer items-center justify-center rounded-[4.553px] border border-textBlack px-[9px] py-[3px] transition-all duration-300 ease-in-out ${amountPercent === item.value ? "bg-textBlack hover:bg-textBlack" : "bg-white hover:bg-[#EBEBEB]"}`}
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
                      console.log("amount", amount);
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
          className="mt-[6px] flex cursor-pointer items-center justify-center rounded-[8px] border border-textBlack bg-white px-4 py-2 transition-all duration-300 ease-in-out hover:bg-[#EBEBEB]"
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
      {openModalToken && (
        <>
          <div
            className="fixed bottom-0 left-0 right-0 top-0 h-[100vh] w-[350px] bg-[rgba(0,0,0,0.4)]"
            style={{ zIndex: 103 }}
            onClick={() => setOpenModalToken(false)}
          />
          <div
            className="fixed right-0 top-[50%] w-[344px] translate-y-[-50%] rounded-[12px] bg-bgWhiteColor p-4"
            style={{ zIndex: 104 }}
          >
            <ModalListToken
              {...form.register("amount_token")}
              tokenSelected={null}
              onClickToken={(token) => {
                handleSetTokenSelected?.(token);
                setOpenModalToken(false);
              }}
              dialogClose={false}
            />
          </div>
        </>
      )}
    </>
  );
}
