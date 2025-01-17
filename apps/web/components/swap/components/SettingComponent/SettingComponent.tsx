import { Input } from "@/components/ui/input";
import { truncateString } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import styles from "../../../css/swap.module.css";
import stylesButton from "../../../css/button.module.css";
import useClickOutside from "@/hook/useClickOutside";

export interface SettingComponentProps {
    isDetail?: boolean
}

export const SettingComponent = ({
    isDetail
}: SettingComponentProps) => {
    const form = useFormContext();
    const [openSetting, setOpenSetting] = useState(false);
    const fields = form.getValues();
    const settingRef = useClickOutside<HTMLDivElement>(() => {
        setOpenSetting(false);
    });

    const handleChangeValueSlippage = (valueInput:string) => {
        let input = valueInput;

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
        if (value > 20 || value < 0.1) {
            form.setValue("slippage_custom", ""); // Reset if input is out of range
            return;
        }

        // Step 8: Update form value if valid
        form.setValue("slippage_custom", input);
    }
    
    return (
        <div className="relative flex h-[42px] items-center gap-1 p-[6px]" ref={settingRef}>
            <span className="text-[20px] font-[400] text-textBlack opacity-60">
                {fields.slippage_custom
                    ? `${truncateString(fields.slippage_custom, 6)}%`
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
                <span
                    className={`text-center text-[22px] font-[500] text-textBlack sm:text-[22px] lg:text-[24px] xl:text-[28px] ${styles["popup-setting-title"]}`}
                >
                    Swap setting
                </span>
                <div className="flex w-full items-center justify-between">
                    <span
                        className={`text-[18px] font-[400] text-textBlack sm:text-[16px] lg:text-[20px] xl:text-[24px] ${styles["popup-setting-label"]}`}
                    >
                        Max Slippage
                    </span>
                    <div className="flex items-center gap-[12px] rounded-[12px] bg-[#EBEBEB] pr-[12px] shadow-content">
                        <div
                            className={`flex cursor-pointer items-center justify-center rounded-[12px] bg-bgWhiteColor px-3 py-[6px] text-[16px] font-[400]
                       shadow-content transition duration-300 ease-in-out hover:bg-[#EBEBEB] sm:text-[16px] lg:text-[20px] xl:text-[20px]
                      ${fields.slippage_custom ? "text-textBlack" : "text-borderOrColor"}
                      `}
                            onClick={() => {
                                if (form.getValues("slippage_custom")) {
                                    form.setValue("slippage_custom", "");
                                }
                                form.setValue("slippage", "0.2");
                            }}
                        >
                            Auto
                        </div>
                        <div className="flex items-center gap-[2px]">
                            <Input
                                {...form.register("slippage_custom", {
                                    onChange: (e) => {handleChangeValueSlippage(e.target.value)},
                                })}
                                className="mr-[2px] h-full w-[50px] border-0 border-none bg-transparent p-0 text-right text-[16px] font-[400] text-textBlack opacity-50 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-[16px] lg:text-[20px] xl:text-[20px]"
                                placeholder="0.2"
                                type="text"
                                inputMode="decimal"
                            />
                            <span className="text-[20px] font-[400] text-textBlack opacity-50 ">%</span>
                        </div>
                    </div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <span
                        className={`text-[18px] font-[400] text-textBlack sm:text-[16px] lg:text-[20px] xl:text-[24px] ${styles["popup-setting-label"]}`}
                    >
                        Transaction deadline
                    </span>
                    <div
                        className="flex items-center gap-[2px] rounded-[18.118px] bg-bgWhiteColor px-[18px] py-[6px]"
                        style={{
                            boxShadow: "0px 1px 4px 0px rgba(26, 26, 26, 0.30) inset",
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
                            className="padding-0 h-full w-[70px] border-0 border-none bg-transparent text-[18px] font-[500] text-textBlack outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-[18px]"
                        />
                        <span className="text-[18px] font-[400] text-textBlack opacity-50 sm:text-[18px] lg:text-[20px] xl:text-[20px]">
                            Minutes
                        </span>
                    </div>
                </div>
                <div
                    className={stylesButton["button-close-setting-swap"]}
                    onClick={() => setOpenSetting(false)}
                    style={isDetail ? { height: 50, fontSize: 20 } : {}}
                >
                    Close
                </div>
            </div>
        </div>
    )
};