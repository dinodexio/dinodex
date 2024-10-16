"use client";
import Image from "next/image";
import "../style.css";
export interface PoolPositionProps {
}

export function PoolPosition({}: PoolPositionProps) {

    return (
        <div className="flex w-full max-w-[605px] flex-col items-start justify-center gap-[10px] rounded-[20px] border border-textBlack p-5 sm:gap-[10px] lg:gap-[15px] xl:gap-[15px]">
            <span className="text-[18px] font-[600] text-textBlack sm:text-[18px] lg:text-[22px] xl:text-[22px]">
                Your position
            </span>
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-[6px]">
                    <div className="flex items-center">
                        <Image
                            src={"/tokens/btc.svg"}
                            width={28}
                            height={28}
                            alt=""
                            className="h-5 w-5 sm:h-5 sm:w-5 lg:h-[28px] lg:w-[28px] xl:h-[28px] xl:w-[28px]"
                        />
                        <Image
                            src={"/tokens/mina.svg"}
                            width={28}
                            height={28}
                            alt=""
                            className="h-5 w-5 sm:h-5 sm:w-5 lg:h-[28px] lg:w-[28px] xl:h-[28px] xl:w-[28px]"
                            style={{ marginLeft: "-11px" }}
                        />
                    </div>
                    <span className="text-[18px] font-[400] text-textBlack sm:text-[18px] sm:font-[400] lg:text-[20px] lg:font-[600] xl:text-[20px] xl:font-[600]">
                        BTC/MINA
                    </span>
                </div>
                <span className="text-[18px] font-[600] text-textBlack sm:text-[18px] lg:text-[22px] xl:text-[22px]">
                    0.00925
                </span>
            </div>
            <div className="flex w-full items-center justify-between">
                <span className="text-[14px] font-[500] text-textBlack sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                    Your pool share
                </span>
                <span className="text-[14px] font-[500] text-textBlack sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                    0.000084%
                </span>
            </div>
            <div className="flex w-full items-center justify-between">
                <span className="text-[14px] font-[500] text-textBlack sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                    BTC:
                </span>
                <span className="text-[14px] font-[500] text-textBlack sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                    0.4
                </span>
            </div>
            <div className="flex w-full items-center justify-between">
                <span className="text-[14px] font-[500] text-textBlack sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                    MINA:
                </span>
                <span className="text-[14px] font-[500] text-textBlack sm:text-[14px] lg:text-[20px] xl:text-[20px]">
                    1
                </span>
            </div>
        </div>
    );
}
