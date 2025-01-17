import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import stylesButton from "../../css/button.module.css";
import { formatPriceUSD, truncateAddress, truncateString } from "@/lib/utils";
import { USDBalance } from "@/components/ui/usd-balance";
import { precision } from "@/components/ui/balance";
import { EMPTY_DATA } from "@/constants";
import { useTokenStore } from "@/lib/stores/token";

export interface TransferConfirmProps {
  loading: boolean;
  onClose?: () => void;
  onSubmit?: any;
  isConfirm?: boolean;
}

export function TransferConfirm({
  loading,
  onClose,
  onSubmit,
  isConfirm,
}: TransferConfirmProps) {
  const { data: tokens } = useTokenStore();
  const form = useFormContext();
  const fields = form.getValues();
  return (
    <>
      <div className="relative">
        <div className="flex items-center justify-center">
          <span className="text-[12.48px] font-[400] text-textBlack">
            You will transfer
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
      <div className="mt-[17.16px] flex flex-col gap-[8px]">
        <div className="flex flex-col gap-[7.8px]">
          <div className="flex flex-col gap-[1px]">
            <div className="flex items-center justify-between">
              <span className="text-[16.774px] font-[400] text-textBlack">
                {fields?.amountValue}
              </span>
              <div className="flex items-center gap-[5.2px]">
                <img
                  src={tokens[fields.amount_token]?.logo || ""}
                  width={18}
                  height={18}
                  alt=""
                />
                <span className="mt-[2px] text-[14.56px] font-[600] uppercase text-textBlack">
                  {tokens[fields.amount_token]?.ticker}
                </span>
              </div>
            </div>
          </div>
          <span className="mt-[-8px] text-[9.202px] font-[500] italic text-textBlack opacity-[0.5]">
            <USDBalance
              balance={formatPriceUSD(
                fields.amountValue,
                tokens[fields.amount_token]?.ticker ?? "",
              )}
              type="USD"
            />
          </span>
          <div className="flex items-center justify-between">
            <span className="text-[14.56px] font-[600] text-textBlack">
              Receipent
            </span>
            <span className="text-[12.581px] font-[400] text-textBlack">
              {truncateAddress(fields?.toRecipientAddress || "")}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-[10.4px]">
          <span className="text-center text-[9.202px] font-[500] italic text-textBlack opacity-[0.5]">
            DinoDex only supports Mina's B62 addresses
          </span>
          <div className="flex flex-col gap-[9.501px]">
            <div className="flex items-center justify-between">
              <span className="text-[10.484px] font-[500] text-textBlack opacity-50">
                Price
              </span>
              <span className="text-[10.484px] font-[500] text-textBlack">
                1 MINA = <USDBalance balance={formatPriceUSD(1, "MINA")} /> USDC
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10.484px] font-[500] text-textBlack opacity-50">
                Fee
              </span>
              <div className="flex items-center gap-[2px]">
                <span className="text-[10.484px] font-[500] text-textBlack">
                  {truncateString(
                    Number(0.01 * fields.amountValue).toString(),
                    precision,
                  ) || EMPTY_DATA}{" "}
                  MINA
                </span>
                <span className="text-[10.484px] font-[500] text-textBlack opacity-60">
                  <USDBalance
                    balance={formatPriceUSD(0.01 * fields.amountValue, "MINA")}
                    type="USD"
                  />
                </span>
              </div>
            </div>
          </div>
          <Button
            className={`${stylesButton["button-swap"]} ${stylesButton["button-withdraw"]} *:w-full`}
            loading={loading}
            disabled={!isConfirm}
            onClick={form.handleSubmit(onSubmit)}
          >
            <span>Confirm</span>
          </Button>
        </div>
      </div>
    </>
  );
}
