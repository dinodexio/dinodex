"use client";
import Image from "next/image";
import "../style.css";
import { tokens } from "@/tokens";
import { useObservePooled } from "@/lib/stores/balances";
import { LPTokenId, TokenPair } from "chain";
import { TokenId } from "@proto-kit/library";
import { Balances } from "../wallet/wallet";
import { Balance } from "../ui/balance";

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
  paramPooled,
  paramLPToken,
}: PoolPositionProps) {
  // Extract token data
  const firstTokenValue =
    dataPool?.tokenPool?.first?.value || tokenParams?.tokenA?.value || 0;
  const secondTokenValue =
    dataPool?.tokenPool?.second?.value || tokenParams?.tokenB?.value || 0;
  const firstTokenLabel =
    dataPool?.tokenPool?.first?.label || tokenParams?.tokenA?.label || "";
  const secondTokenLabel =
    dataPool?.tokenPool?.second?.label || tokenParams?.tokenB?.label || "";

  // Get the LP Token ID
  const lpToken =
    paramLPToken ??
    LPTokenId.fromTokenPair(
      TokenPair.from(
        TokenId.from(firstTokenValue),
        TokenId.from(secondTokenValue),
      ),
    ).toString();

  // Observe pooled data
  const dataPooled =
    paramPooled ??
    useObservePooled(
      firstTokenLabel,
      secondTokenLabel,
      balances?.[lpToken]?.toString(),
    );

  return (
    <div className="flex w-full max-w-[605px] flex-col items-start justify-center gap-[10px] rounded-[20px] border border-textBlack p-5 sm:gap-[10px] lg:gap-[15px] xl:gap-[15px]">
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
        <span className="text-[14px] font-[500] text-textBlack sm:text-[14px] lg:text-[20px] xl:text-[20px]">
          Your pool share
        </span>
        <span className="text-[14px] font-[500] text-textBlack sm:text-[14px] lg:text-[20px] xl:text-[20px]">
          {dataPooled?.poolOfShare ?? "0"} %
        </span>
      </div>
      <div className="flex w-full items-center justify-between">
        <span className="text-[14px] font-[500] text-textBlack sm:text-[14px] lg:text-[20px] xl:text-[20px]">
          {firstTokenLabel}:
        </span>
        <span className="text-[14px] font-[500] text-textBlack sm:text-[14px] lg:text-[20px] xl:text-[20px]">
          <Balance balance={dataPooled?.first ?? "0"} />
        </span>
      </div>
      <div className="flex w-full items-center justify-between">
        <span className="text-[14px] font-[500] text-textBlack sm:text-[14px] lg:text-[20px] xl:text-[20px]">
          {secondTokenLabel}:
        </span>
        <span className="text-[14px] font-[500] text-textBlack sm:text-[14px] lg:text-[20px] xl:text-[20px]">
          <Balance balance={dataPooled?.second ?? "0"} />
        </span>
      </div>
    </div>
  );
}
