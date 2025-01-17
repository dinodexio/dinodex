import { useMemo, useState } from "react";
import styles from "../css/swap.module.css";
import stylesModal from "../css/modal.module.css";
import stylesButton from "../css/button.module.css";
import { EMPTY_DATA } from "@/constants";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModalListToken } from "../modalListToken/modalListToken";
import { Button } from "../ui/button";
import { client, PoolKey, TokenPair } from "chain";
import { TokenId } from "@proto-kit/library";
import { Balance, precision } from "../ui/balance";
import { cn, formatPriceUSD, truncateString } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import useClickOutside from "@/hook/useClickOutside";
import { USDBalance } from "../ui/usd-balance";
import BigNumber from "bignumber.js";
import { useTokenStore } from "@/lib/stores/token";

export interface SwapProps {
  token?: any;
  type?: string;
  loading: boolean;
  route?: string[];
  unitPrice?: string;
  changeSwap: () => void;
  balance?: string | number;
  balanceOut?: string | number;
  balances?: any;
  isDetail?: boolean;
}

export function Swap({
  loading,
  changeSwap,
  balance,
  balanceOut,
  balances,
  isDetail,
}: SwapProps) {
  const { data: tokens } = useTokenStore();
  const form = useFormContext();
  const error = Object.values(form.formState.errors)[0]?.message?.toString();
  const [openSetting, setOpenSetting] = useState(false);
  const fields = form.getValues();

  const settingRef = useClickOutside<HTMLDivElement>(() => {
    setOpenSetting(false);
  });

  const [typeOpenModal, setTypeOpenModal] = useState<string>("tokenIn");

  const typeSelectToken = `${typeOpenModal}_token`;

  const handleSelectedPool = (token: any) => {
    form.setValue(typeSelectToken, token?.value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    form.setValue(`${typeOpenModal}_price`, token?.price);

    // TODO after api pools then remove code
    if (fields.tokenIn_token && fields.tokenOut_token) {
      const poolKey = PoolKey.fromTokenPair(
        TokenPair.from(
          TokenId.from(fields.tokenIn_token),
          TokenId.from(fields.tokenOut_token),
        ),
      ).toBase58();
      balances?.loadBalance(client, fields.tokenIn_token, poolKey);
      balances?.loadBalance(client, fields.tokenOut_token, poolKey);
    }
  };

  function adjustFontSize(input: HTMLInputElement): void {
    const maxFontSize = isDetail ? 38 : 64; // Maximum font size in px
    const minFontSize = isDetail ? 20 : 30; // Minimum font size in px
    const maxLength = isDetail ? 9 : 7; // Length at which to start reducing the font size

    const length = input.value.length;

    // Adjust font size based on input length
    const fontSize =
      length <= maxLength
        ? maxFontSize
        : Math.max(minFontSize, maxFontSize - (length - maxLength) * 4);

    // Set font size and ensure text is centered within the input
    input.style.fontSize = `${fontSize}px`;
  }

  const USDBalances = useMemo(() => {
    return {
      tokenIn: formatPriceUSD(
        fields.tokenIn_amount,
        tokens[fields.tokenIn_token]?.ticker ?? "",
        fields.tokenIn_price,
      ),
      tokenOut: formatPriceUSD(
        fields.tokenOut_amount,
        tokens[fields.tokenOut_token]?.ticker ?? "",
        fields.tokenOut_price,
      ),
    };
  }, [
    fields.tokenIn_amount,
    fields.tokenOut_amount,
    fields.tokenIn_token,
    fields.tokenOut_token,
  ]);

  return (
    <Dialog>
      <div
        className={`${styles["swap-container"]} ${isDetail
          ? `${styles["token-swap-container"]} ${styles["pc-swap-token"]}`
          : ""
          }`}
      >
        <div
          className={`flex w-full items-center justify-between ${styles["swap-header"]}`}
        >
          <span className={styles["swap-text"]}>Swap</span>
          <div className="relative flex h-[42px] items-center gap-1 p-[6px]">
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
              ref={settingRef}
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
                        onChange: (e) => {
                          let input = e.target.value;

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
                        },
                      })}
                      className="mr-[2px] h-full w-[50px] border-0 border-none bg-transparent p-0 text-right text-[18px] font-[400] text-textBlack opacity-50 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-[18px] lg:text-[20px] xl:text-[20px]"
                      placeholder="0.2"
                      type="text"
                      inputMode="decimal"
                    />

                    <span className="text-[20px] font-[400] text-textBlack opacity-50 ">
                      %
                    </span>
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
        </div>
        <div
          className={`${styles["swap-content"]} ${isDetail ? styles["token-swap-content"] : ""
            }`}
        >
          <div
            className={`${styles["swap-container-form"]} ${isDetail ? styles["token-swap-form"] : ""
              }`}
          >
            <div
              className={`${styles["swap-content-item"]} ${styles["swap-item-first"]}`}
            >
              <span className={styles["swap-item-header"]}>Sell</span>
              <div className={styles["line-swap-item"]}></div>
              <div className={styles["swap-item-content"]}>
                <Input
                  {...form.register("tokenIn_amount", {
                    onChange: (e) => {
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
                      form.setValue("tokenIn_amount", value);
                    },
                  })}
                  placeholder="0"
                  type="text"
                  maxLength={30}
                  inputMode="decimal"
                  onInput={(e: React.FormEvent<HTMLInputElement>) =>
                    adjustFontSize(e.currentTarget)
                  }
                  className={cn([
                    styles["swap-item-input"],
                    "w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                  ])}
                />

                <DialogTrigger>
                  <div
                    className={`${styles["swap-item-select"]} ${fields.tokenIn_token &&
                      styles["swap-item-select-have-token"]
                      }`}
                    onClick={() => {
                      setTypeOpenModal("tokenIn");
                    }}
                  >
                    {fields?.tokenIn_token ? (
                      <>
                        <img
                          src={tokens[fields.tokenIn_token]?.logo || ""}
                          alt="logo"
                          width={24}
                          height={24}
                        />
                        <span>
                          {tokens[fields.tokenIn_token]?.ticker || EMPTY_DATA}
                        </span>
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
                  className={styles["value-price"]}
                  balance={USDBalances.tokenIn}
                  type="USD"
                />
                <div className="flex flex-row items-center gap-2">
                  <span className={styles["swap-item-footer-text"]}>
                    Balance: <Balance balance={balance?.toString() || "~"} />
                  </span>
                  {balance && BigNumber(balance).toNumber() > 0 ? (
                    <div
                      className="flex h-[25px] cursor-pointer items-center justify-center rounded-[6px] border-none px-2 py-1 text-[14px] font-[400] text-textBlack hover:bg-[#EBEBEB] sm:text-[14px] lg:text-[16px] xl:text-[16px]"
                      style={{
                        transition: "all 0.3s ease",
                        boxShadow: "0px 2px 8px 0px rgba(0, 0, 0, 0.25)",
                      }}
                      onClick={() => {
                        let maxBalance = BigNumber(balance).dividedBy(10 ** precision).toNumber();
                        form.setValue("tokenIn_amount", maxBalance.toString());
                      }}
                    >
                      MAX
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className={styles["swap-button"]} onClick={() => changeSwap()}>
              <Image
                width={65}
                height={65}
                src="/images/swap/swap-button-icon.svg"
                alt="swap-button"
              />
            </div>
            <div
              className={`${styles["swap-content-item"]} ${styles["swap-item-second"]}`}
            >
              <span className={styles["swap-item-header"]}>Buy</span>
              <div className={styles["line-swap-item"]}></div>
              <div className={styles["swap-item-content"]}>
                <Input
                  {...form.register("tokenOut_amount")}
                  placeholder="0"
                  type="number"
                  disabled
                  className={cn([
                    styles["swap-item-input"],
                    "border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                  ])}
                />
                <DialogTrigger>
                  <div
                    className={`${styles["swap-item-select"]} ${fields.tokenOut_token &&
                      styles["swap-item-select-have-token"]
                      }`}
                    onClick={() => {
                      setTypeOpenModal("tokenOut");
                    }}
                  >
                    {fields.tokenOut_token ? (
                      <>
                        <img
                          src={tokens[fields.tokenOut_token]?.logo || ""}
                          alt="logo"
                          width={24}
                          height={24}
                        />
                        <span>
                          {tokens[fields.tokenOut_token]?.ticker || EMPTY_DATA}
                        </span>
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
                  className={styles["swap-item-footer-text"]}
                  balance={USDBalances.tokenOut}
                  type="USD"
                />
                <span className={styles["swap-item-footer-text"]}>
                  Balance: <Balance balance={balanceOut?.toString() || "~"} />
                </span>
              </div>
            </div>
          </div>
          <Button
            loading={loading}
            className={`${stylesButton["button-swap"]} ${isDetail && stylesButton["button-swap-token-detail"]}`}
            disabled={!form.formState.isValid}
          >
            <span>{error ?? "Swap"}</span>
          </Button>

          {!isDetail && (
            <div className={styles["wrapper-warning-swap"] + " flex flex-row items-center gap-5 mb-[20px]"}>
              <Image
                src="/images/swap/warning.svg"
                alt="swap-icon"
                width={24}
                height={24}
              />
              <span className="text-[14px] xl:text-[18px] lg:text-[16px] sm:text-[12px] text-textBlack weight-[400] font-sans">
                Note: All transactions in the Trading Competition take place on
                DinoDex's Local net, using test tokens that cannot be converted to
                Mainnet or Devnet
              </span>
            </div>
          )}
        </div>
        <DialogOverlay className={styles["bg-overlay"]} />
        <DialogContent
          className={`${stylesModal["modal-container"]} bg-white px-[19.83px] pb-[33.88px] pt-[21.49px]`}
        >
          <DialogHeader>
            <DialogTitle />
            <DialogDescription />
          </DialogHeader>
          <ModalListToken
            tokenSelected={
              fields[typeSelectToken] && tokens[fields[typeSelectToken]]
            }
            onClickToken={handleSelectedPool}
            dialogClose={true}
          />
        </DialogContent>
      </div>
    </Dialog>
  );
}
