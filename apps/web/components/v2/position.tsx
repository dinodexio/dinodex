"use client";
import Image from "next/image";
import styles from "../css/pool.module.css";
import { tokens } from "@/tokens";
import { useObservePooled } from "@/lib/stores/balances";
import { LPTokenId, TokenPair } from "chain";
import { TokenId } from "@proto-kit/library";
import { Balances } from "../wallet/wallet";
import { Balance } from "../ui/balance";
import { useFormContext } from "react-hook-form";
import { validateValue } from "@/lib/utils";

export interface PoolPositionProps {
  dataPool?: any;
  balances?: Balances;
  tokenParams?: any;
  paramPooled?: any;
  paramLPToken?: any;
}

export function PoolPosition({
  dataPool,
  tokenParams,
  balances,
}: PoolPositionProps) {
  const form = useFormContext();
  const fields = form?.getValues();
  // Extract token data
  const firstTokenValue =
    fields?.tokenA_token ||
    dataPool?.tokenPool?.first?.value ||
    tokenParams?.tokenA?.value ||
    0;
  const secondTokenValue =
    fields?.tokenB_token ||
    dataPool?.tokenPool?.second?.value ||
    tokenParams?.tokenB?.value ||
    0;
  const firstTokenLabel =
    tokens[firstTokenValue]?.ticker ||
    dataPool?.tokenPool?.first?.label ||
    tokenParams?.tokenA?.label ||
    "";
  const secondTokenLabel =
    tokens[secondTokenValue]?.ticker ||
    dataPool?.tokenPool?.second?.label ||
    tokenParams?.tokenB?.label ||
    "";

  // Get the LP Token ID
  const lpToken = LPTokenId.fromTokenPair(
    TokenPair.from(
      TokenId.from(firstTokenValue),
      TokenId.from(secondTokenValue),
    ),
  ).toString();

  // Observe pooled data
  const dataPooled = useObservePooled(
    firstTokenLabel,
    secondTokenLabel,
    balances?.[lpToken]?.toString(),
  );

  return (
    <div
      className={`flex w-full max-w-[605px] flex-col items-start justify-center gap-[10px] rounded-[12px] border-none shadow-content px-[25px] py-[15px] sm:gap-[10px] lg:gap-[12px] xl:gap-[12px] ${styles["pool-container"]}`}
    >
      <span className="text-[18px] font-[600] text-textBlack sm:text-[18px] lg:text-[22px] xl:text-[22px]">
        Your position
      </span>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-[6px]">
          <div className="flex items-center">
            <Image
              src={tokens[firstTokenValue]?.logo || ""}
              width={28}
              height={28}
              alt={firstTokenLabel}
              className="h-5 w-5 sm:h-5 sm:w-5 lg:h-[28px] lg:w-[28px] xl:h-[28px] xl:w-[28px]"
            />
            <Image
              src={tokens[secondTokenValue]?.logo || ""}
              width={28}
              height={28}
              alt={secondTokenLabel}
              className="h-5 w-5 sm:h-5 sm:w-5 lg:h-[28px] lg:w-[28px] xl:h-[28px] xl:w-[28px]"
              style={{ marginLeft: "-11px" }}
            />
          </div>
          <span className="text-[18px] font-[400] text-textBlack sm:text-[18px] sm:font-[400] lg:text-[20px] lg:font-[600] xl:text-[20px] xl:font-[600]">
            {firstTokenLabel} / {secondTokenLabel}
          </span>
        </div>
        <span className="text-[18px] font-[600] text-textBlack sm:text-[18px] lg:text-[22px] xl:text-[22px]">
          <Balance balance={balances?.[lpToken]?.toString()} />
        </span>
      </div>
      <div className="flex w-full items-center justify-between">
        <span className="text-[14px] font-[500] text-textBlack sm:text-[14px] lg:text-[18px] xl:text-[18px]">
          Your pool share
        </span>
        <span className="text-[14px] font-[500] text-textBlack sm:text-[14px] lg:text-[18px] xl:text-[18px]">
          {validateValue(dataPooled?.poolOfShare) ?? "0"} %
        </span>
      </div>
      <div className="flex w-full items-center justify-between">
        <span className="text-[14px] font-[500] text-textBlack sm:text-[14px] lg:text-[18px] xl:text-[18px]">
          {firstTokenLabel}:
        </span>
        <span className="text-[14px] font-[500] text-textBlack sm:text-[14px] lg:text-[18px] xl:text-[18px]">
        <Balance balance={(dataPooled?.first ?? "0").toString()} />
        </span>
      </div>
      <div className="flex w-full items-center justify-between">
        <span className="text-[14px] font-[500] text-textBlack sm:text-[14px] lg:text-[18px] xl:text-[18px]">
          {secondTokenLabel}:
        </span>
        <span className="text-[14px] font-[500] text-textBlack sm:text-[14px] lg:text-[18px] xl:text-[18px]">
          <Balance balance={(dataPooled?.second ?? "0").toString()} />
        </span>
      </div>
    </div>
  );
}
