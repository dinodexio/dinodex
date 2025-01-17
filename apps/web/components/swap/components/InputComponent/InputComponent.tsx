import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import styles from "../../../css/swap.module.css";
import stylesModal from "../../../css/modal.module.css";
import { Input } from "@/components/ui/input";
import { cn, formatNumberWithCommas } from "@/lib/utils";
import { USDBalance } from "@/components/ui/usd-balance";
import { Balance, precision } from "@/components/ui/balance";
import Image from "next/image";
import { EMPTY_DATA } from "@/constants";
import { ModalListToken } from "@/components/modalListToken/modalListToken";
import { tokenModal } from "@/types";
import BigNumber from "bignumber.js";
import useClickOutside from "@/hook/useClickOutside";
import { ImageCommon } from "@/components/common/ImageCommon";
import { useTokenStore } from "@/lib/stores/token";
export interface InputComponentProps {
  titleInput: string;
  changeBalance: boolean;
  balance?: string | number | undefined;
  usdBalance?: string | number | undefined;
  disabledInput: boolean;
  isDetail?: boolean;
  token?: string;
  typeToken: string;
  onClickSelected: (token: tokenModal, typeToken: string) => void;
  onChangeAmount?: (valueInput: string, typeToken: string) => void;
}

export const InputComponent = ({
  titleInput,
  changeBalance,
  balance,
  usdBalance,
  disabledInput,
  isDetail,
  token,
  typeToken,
  onClickSelected,
  onChangeAmount,
}: InputComponentProps) => {
  const { data: tokens } = useTokenStore();
  const ListGetBalance = [
    {
      value: 0.25,
      label: "25%",
    },
    {
      value: 0.5,
      label: "50%",
    },
    {
      value: 0.75,
      label: "75%",
    },
    {
      value: 1,
      label: "100%",
    },
  ];
  const [changeAmount, setChangeAmount] = React.useState(0);
  const [showDropDown, setShowDropDown] = React.useState(false);
  const refChangeAmount = useClickOutside<HTMLDivElement>(() =>
    setShowDropDown(false),
  );

  const form = useFormContext();
  function adjustFontSize(input: HTMLInputElement): void {
    const maxFontSize = isDetail ? 38 : 64;
    const minFontSize = isDetail ? 20 : 30;
    const maxLength = isDetail ? 9 : 7;

    const length = input.value.length;

    const fontSize =
      length <= maxLength
        ? maxFontSize
        : Math.max(minFontSize, maxFontSize - (length - maxLength) * 4);

    input.style.fontSize = `${fontSize}px`;
  }

  const handleChangeAmount = (value: number, balance: number | string) => {
    setChangeAmount(value);
    let amount = BigNumber(balance)
      .times(value)
      .dividedBy(10 ** precision)
      .toNumber();
    if (value === 1) {
      let a = amount;
      amount = a - 0.003;
      form.setValue(`${typeToken}_amount`, amount.toString());
    } else {
      form.setValue(`${typeToken}_amount`, amount.toString());
    }

    form.trigger(`${typeToken}_amount`);
  };

  useEffect(() => {
    if (form.getValues(`${typeToken}_amount`) === "") {
      setChangeAmount(0);
    }
  }, [form]);

  const isInsufficientBalance = useMemo(() => {
    return Object.values(form.formState.errors).some(
      (error) => error?.message === "Insufficient balance",
    );
  }, [form]);
  return (
    <Dialog>
      <div
        className={`${styles["swap-content-item"]} ${typeToken === "tokenIn" ? styles["swap-item-first"] : styles["swap-item-second"]}`}
      >
        <div className={styles["swap-item-header"]}>{titleInput}</div>
        <div className={styles["line-swap-item"]}></div>
        <div className={styles["swap-item-content"]}>
          <Input
            {...form.register(`${typeToken}_amount`, {
              onChange: (e) => {
                if (changeAmount) {
                  setChangeAmount(0);
                }
                onChangeAmount && onChangeAmount(e.target.value, typeToken);
              },
            })}
            placeholder="0"
            type="text"
            maxLength={30}
            inputMode="decimal"
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              adjustFontSize(e.currentTarget);
            }}
            disabled={disabledInput}
            className={cn([
              styles["swap-item-input"],
              "w-full border-0",
              titleInput === "Sell" && isInsufficientBalance
                ? "text-red-500"
                : "text-black",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
            ])}
          />

          <DialogTrigger>
            <div
              className={`${styles["swap-item-select"]} ${
                token && styles["swap-item-select-have-token"]
              }`}
            >
              {token ? (
                <>
                  <ImageCommon
                    style={{ borderRadius: "50%" }}
                    src={tokens[token]?.logo || ""}
                    alt="logo"
                    width={24}
                    height={24}
                  />
                  <span>{tokens[token]?.ticker || EMPTY_DATA}</span>
                </>
              ) : (
                <span>Select a token</span>
              )}
              <Image
                src={`/icon/drop-down-icon.svg`}
                alt="logo"
                width={20}
                height={20}
              />
            </div>
          </DialogTrigger>
        </div>
        <div className={styles["swap-item-footer"]}>
          <USDBalance
            className={`${styles["value-price"]} text-[18px] md:text-[15px] xl:text-[18px]`}
            balance={usdBalance}
            type="USD"
          />
          <div className="flex flex-row items-center gap-2">
            {changeBalance && balance ? (
              <>
                <div
                  className={`hidden items-center gap-[5px] sm:hidden ${isDetail ? "lg:hidden xl:hidden" : "lg:flex xl:flex"}`}
                  style={{
                    gap: isDetail ? "4px" : "5px",
                    marginRight: isDetail ? "-5px" : "0",
                  }}
                >
                  {ListGetBalance.map((item, index) => (
                    <div
                      key={index}
                      className={`${styles["button-amount"]} ${changeAmount === item.value && styles["button-amount-active"]}`}
                      onClick={() => handleChangeAmount(item.value, balance)}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
                <div
                  className={`relative flex sm:flex ${isDetail ? "lg:flex xl:flex" : "lg:hidden xl:hidden"}`}
                  ref={refChangeAmount}
                >
                  <div
                    className={styles["button-amount"]}
                    style={{ width: "max-content", padding: "5px 0 5px 5px" }}
                    onClick={() => setShowDropDown(!showDropDown)}
                  >
                    <span>
                      {changeAmount > 0
                        ? ListGetBalance.filter(
                            (item) => item.value === changeAmount,
                          )[0]?.label
                        : "Change Amount"}
                    </span>
                    <Image
                      src={`/icon/drop-down-icon.svg`}
                      alt="logo"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div
                    className={`${styles["dropdown-change-mount"]} ${showDropDown && styles["dropdown-change-mount-open"]}`}
                  >
                    {ListGetBalance.map((item, index) => (
                      <div
                        key={index}
                        className={`${styles["button-amount"]} ${changeAmount === item.value && styles["button-amount-active"]}`}
                        style={{
                          width: "100%",
                          borderRadius: 0,
                          boxShadow: "none",
                        }}
                        onClick={() => {
                          handleChangeAmount(item.value, balance);
                          setShowDropDown(false);
                        }}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
            <span className={`${styles["swap-item-footer-text"]} text-[18px] md:text-[15px] xl:text-[18px]`}>
              <Balance
                balance={balance?.toString() || "~"}
                formatInteger={true}
                tokenId={token}
              />
            </span>
          </div>
        </div>
      </div>
      <DialogOverlay className={styles["bg-overlay"]} />
      <DialogContent
        className={`${stylesModal["modal-container"]} bg-white px-[19.83px] pb-[33.88px] pt-[21.49px]`}
        style={{ zIndex: 103 }}
      >
        <DialogHeader>
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <ModalListToken
          tokenSelected={token && tokens[token]}
          onClickToken={(token) => {
            onClickSelected && onClickSelected(token, typeToken);
          }}
          dialogClose={true}
        />
      </DialogContent>
    </Dialog>
  );
};
