import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import stylesButton from "../../css/button.module.css";
import { truncateAddress } from "@/lib/utils";
import { USDBalance } from "@/components/ui/usd-balance";
import { tokens } from "@/tokens";
import { Balance } from "@/components/ui/balance";
import { PRICE_MINA } from "@/constants";

export interface TransferConfirmProps {
  loading: boolean;
  onClose?: () => void;
}

export function WithdrawConfirm({ loading, onClose }: TransferConfirmProps) {
  const form = useFormContext();
  const fields = form.getValues();
  return (
    <>
      <div className="relative">
        <div className="flex items-center justify-center">
          <span className="text-[12.48px] font-[400] text-textBlack">
            You will withdraw
          </span>
        </div>
        <Image
          src="/icon/Close-icon.svg"
          width={24}
          height={24}
          alt=""
          className="absolute right-[-10px] top-[-12px] cursor-pointer"
          onClick={() => onClose && onClose()}
        />
      </div>
      <div className="mt-[17.16px] flex flex-col gap-[15.6px]">
        <div className="flex flex-col gap-[7.8px]">
          <div className="flex flex-col gap-[1px]">
            <div className="flex items-center justify-between">
              <span className="text-[16.774px] font-[400] text-textBlack">
                {fields?.amountValue}
              </span>
              <div className="flex items-center gap-[5.2px]">
                <Image
                  src={tokens[fields.amount_token]?.logo || ""}
                  width={18}
                  height={18}
                  alt=""
                />
                <span className="mt-[2px] text-[14.56px] font-[600] uppercase text-textBlack">
                  {tokens[fields.amount_token]?.ticker || ""}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[14.56px] font-[600] text-textBlack">
              Receipent
            </span>
            <span className="text-[12.581px] font-[400] text-textBlack">
              {truncateAddress(fields?.toRecipientAddress) || ""}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-[10.4px]">
          <span className="text-[7.8px] font-[400] italic text-textBlack opacity-[0.5]">
            Output is estimated. If the price changes by more than 0.5% your
            transaction will revert.
          </span>
          <div className="flex flex-col gap-[9.501px]">
            <div className="flex items-center justify-between">
              <span className="text-[10.484px] font-[500] text-textBlack opacity-50">
                Price
              </span>
              <span className="text-[10.484px] font-[500] text-textBlack">
                1 {tokens[fields.amount_token]?.ticker} ={" "}
                <Balance balance={undefined} /> USDC
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10.484px] font-[500] text-textBlack opacity-50">
                Fee
              </span>
              <div className="flex items-center gap-[2px]">
                <span className="text-[10.484px] font-[500] text-textBlack">
                  <Balance balance={(0.01 * fields.amountValue).toString()} />{" "}
                  MINA
                </span>
                <span className="text-[10.484px] font-[500] text-textBlack opacity-60">
                  <USDBalance
                    balance={(0.01 * fields.amountValue * PRICE_MINA)
                      .toFixed(2)
                      .toString()}
                    type="USD"
                  />
                </span>
              </div>
            </div>
          </div>
          <Button
            className={`${stylesButton["button-swap"]} ${stylesButton["button-withdraw"]} *:w-full`}
            loading={loading}
            type={"submit"}
          >
            <span>Confirm</span>
          </Button>
        </div>
      </div>
    </>
  );
}
