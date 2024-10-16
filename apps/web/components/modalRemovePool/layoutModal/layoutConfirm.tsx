import Image from "next/image";
import React from "react";
import "../../style.css";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface layoutConfirmProps {
    onClickConFirm: () => void
}

export function LayoutConfirm({onClickConFirm=()=>{}}: layoutConfirmProps) {

    return (
        <div className="h-max w-full">
            <div className="relative flex items-center justify-center ">
                <span className="text-black text-[20px] xl:text-[24px] lg:text-[24px] sm:text-[20px] font-[400]">
                    You will revieve
                </span>
                <DialogClose className="absolute right-[-6px] top-[-10px]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.01502 10.7131L15.9288 17.6269C16.1593 17.8495 16.468 17.9727 16.7885 17.9699C17.1089 17.9671 17.4154 17.8386 17.642 17.612C17.8686 17.3854 17.9972 17.0789 18 16.7584C18.0027 16.438 17.8796 16.1293 17.6569 15.8988L10.7432 8.98498L17.6569 2.07121C17.8796 1.84071 18.0027 1.53199 18 1.21154C17.9972 0.891095 17.8686 0.584562 17.642 0.357963C17.4154 0.131365 17.1089 0.0028308 16.7885 4.62009e-05C16.468 -0.0027384 16.1593 0.120449 15.9288 0.343075L9.01502 7.25685L2.10125 0.343075C1.86971 0.125952 1.56278 0.00742745 1.24541 0.012581C0.928031 0.0177346 0.625112 0.146162 0.400744 0.370689C0.176376 0.595215 0.0481627 0.898225 0.0432336 1.2156C0.0383046 1.53298 0.157046 1.83983 0.374333 2.07121L7.28688 8.98498L0.373111 15.8988C0.256382 16.0115 0.163276 16.1464 0.0992235 16.2955C0.0351712 16.4446 0.0014563 16.6049 4.61452e-05 16.7672C-0.00136401 16.9295 0.0295585 17.0904 0.0910099 17.2406C0.152461 17.3908 0.243211 17.5273 0.357963 17.642C0.472715 17.7568 0.609172 17.8475 0.759371 17.909C0.90957 17.9704 1.0705 18.0014 1.23278 18C1.39506 17.9985 1.55543 17.9648 1.70454 17.9008C1.85365 17.8367 1.98851 17.7436 2.10125 17.6269L9.01502 10.7131Z"
                            fill="black"
                        />
                    </svg>
                </DialogClose>
            </div>
            <div className="mt-[33px] flex flex-col items-center justify-center w-full gap-[20px]">
                <div className="w-full flex flex-col gap-[30px]">
                    <div className="flex flex-col gap-[15px] w-full ">
                        <div className="flex items-center justify-between w-full ">
                            <span className="text-[24px] xl:text-[28px] lg:text-[28px] sm:text-[24px] text-textBlack font-[600]">0.428148</span>
                            <div className="flex items-center gap-[10px]">
                                <Image src={"/tokens/btc.svg"} width={28} height={28} alt="" className="h-[28px] w-[28px] sm:h-[28px] sm:w-[28px] lg:h-9 lg:w-9 xl:h-9 xl:w-9" />
                                <span className="text-[24px] xl:text-[28px] lg:text-[28px] sm:text-[24px] text-textBlack font-[600]">USDC</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-start">
                            <span className="text-[24px] xl:text-[28px] lg:text-[28px] sm:text-[24px] text-textBlack font-[600]">+</span>
                        </div>
                        <div className="flex items-center justify-between w-full ">
                            <span className="text-[24px] xl:text-[28px] lg:text-[28px] sm:text-[24px] text-textBlack font-[600]">0.428148</span>
                            <div className="flex items-center gap-[10px]">
                                <Image src={"/tokens/btc.svg"} width={28} height={28} alt="" className="h-[28px] w-[28px] sm:h-[28px] sm:w-[28px] lg:h-9 lg:w-9 xl:h-9 xl:w-9" />
                                <span className="text-[24px] xl:text-[28px] lg:text-[28px] sm:text-[24px] text-textBlack font-[600]">USDC</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-[15px] xl:gap-[20px] lg:gap-[20px] sm:gap-[15px]">
                    <span className="text-[18px] xl:text-[24px] lg:text-[24px] sm:text-[18px] text-textBlack font-[600]">ETH/USDC Pool Tokens</span>
                        <span className="text-textBlack text-[12px] xl:text-[15px] lg:text-[15px] sm:text-[12px] font-[400] italic opacity-[0.5]">
                            Output is estimated. If the price changes by more than 0.5% your
                            transaction will revert.
                        </span>
                        <div className="flex items-start justify-between w-full ">
                            <span className="text-textBlack text-[16px] xl:text-[20px] lg:text-[20px] sm:text-[16px] font-[500] opacity-100 xl:opacity-[0.5] lg:opacity-[0.5] sm:opacity-100">Price</span>
                            <div className="flex flex-col items-end gap-[12px] xl:gap-[20px] lg:gap-[20px] sm:gap-[12px]">
                                <span className="text-[16px] xl:text-[20px] lg:text-[20px] sm:text-[16px] text-textBlack font-[500]">1 ETH = 1772.43 USDC</span>
                                <span className="text-[16px] xl:text-[20px] lg:text-[20px] sm:text-[16px] text-textBlack font-[500]">1 USDC = 0.000564252 ETH</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    loading={false}
                    type={"submit"}
                    className={`button-swap btn-supply-remove`}
                    style={{ width: '100%' }}
                    onClick={() => onClickConFirm && onClickConFirm()}
                >
                    <span>Confirm</span>
                </Button>
            </div>
        </div>
    );
}
