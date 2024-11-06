import { useState } from "react";
import styles from "../css/swap.module.css";
import stylesModal from "../css/modal.module.css";
import stylesButton from "../css/button.module.css";
import { EMPTY_DATA, SLIPPAGE } from "@/constants";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModalListToken } from "../modalListToken/modalListToken";
import { Button } from "../ui/button";
import { tokens } from "@/tokens";
import { client, PoolKey, TokenPair } from "chain";
import { TokenId } from "@proto-kit/library";
import { Balance } from "../ui/balance";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useBalancesStore } from "@/lib/stores/balances";
import useClickOutside from "@/hook/useClickOutside";

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
}

export function Swap({
  type,
  loading,
  unitPrice,
  changeSwap,
  balance,
  balanceOut,
  balances,
}: SwapProps) {
  const { setLoadBalances } = useBalancesStore();
  const form = useFormContext();
  const error = Object.values(form.formState.errors)[0]?.message?.toString();
  const [openSetting, setOpenSetting] = useState(false);
  const fields = form.getValues();

  const settingRef = useClickOutside<HTMLDivElement>(() => {
    setOpenSetting(false);
  });

  // const unitPriceWrapped = useMemo(() => {
  //   const fields = form.getValues();

  //   if (!unitPrice || !fields.tokenIn_token || !fields.tokenOut_token) return;
  //   return {
  //     tokenIn: tokens[fields.tokenIn_token]?.ticker,
  //     tokenOut: tokens[fields.tokenOut_token]?.ticker,
  //     unitPrice,
  //   };
  // }, [unitPrice]);

  const [typeOpenModal, setTypeOpenModal] = useState<string>("tokenIn");

  const typeSelectToken = `${typeOpenModal}_token`;

  const handleSelectedPool = (token: any) => {
    setLoadBalances(true);
    form.setValue(typeSelectToken, token?.value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

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

  return (
    <Dialog>
      <div
        className={`${styles["swap-container"]} ${
          type === "tokenDetail"
            ? `${styles["token-swap-container"]} ${styles["pc-swap-token"]}`
            : ""
        }`}
      >
        <div className="flex w-full items-center justify-between">
          <span className={styles["swap-text"]}>Swap</span>
          <div className="relative flex items-center gap-1 p-[6px]">
            <span className="text-[20px] font-[400] text-textBlack opacity-60">
              {fields.slippage_custom ? `${fields.slippage_custom}%` : null}
            </span>
            <Image
              src="/images/swap/setting-icon.svg"
              width={30}
              height={30}
              alt=""
              className="cursor-pointer"
              onClick={() => setOpenSetting(!openSetting)}
            />
            <div
              ref={settingRef}
              className={`${styles["popup-setting"]} ${openSetting ? styles["popup-setting-open"] : ""}`}
            >
              <span className="text-center text-[22px] font-[500] text-textBlack sm:text-[22px] lg:text-[24px] xl:text-[28px]">
                Swap setting
              </span>
              <div className="flex w-full items-center justify-between">
                <span className="text-[18px] font-[400] text-textBlack sm:text-[18px] lg:text-[20px] xl:text-[24px]">
                  Max Slippage
                </span>
                <div className="shadow-content flex items-center gap-[12px] rounded-[12px] bg-[#EBEBEB] pr-[12px]">
                  <div className="shadow-content flex items-center justify-center rounded-[12px] bg-bgWhiteColor px-3 py-[6px] text-[18px] font-[400] text-textBlack sm:text-[18px] lg:text-[20px] xl:text-[20px]">
                    Auto
                  </div>
                  <div className="flex items-center gap-[2px]">
                    <Input
                      {...form.register("slippage_custom")}
                      className="padding-0 mr-[2px] h-full w-[60px] border-0 border-none bg-transparent text-[18px] font-[400] text-textBlack opacity-50 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-[18px] lg:text-[20px] xl:text-[20px]"
                      placeholder="1.00"
                      type="number"
                    />
                    <span className="text-[20px] font-[400] text-textBlack opacity-50 ">
                      %
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <span className="text-[18px] font-[400] text-textBlack sm:text-[18px] lg:text-[20px] xl:text-[24px]">
                  Transaction deadline
                </span>
                <div
                  className="flex items-center gap-[2px] rounded-[18.118px] bg-bgWhiteColor px-[18px] py-[6px]"
                  style={{
                    boxShadow: "0px 1px 4px 0px rgba(26, 26, 26, 0.30) inset",
                  }}
                >
                  <Input
                    {...form.register("transactionDeadline")}
                    type="number"
                    className="padding-0 h-full w-[60px] border-0 border-none bg-transparent text-[18px] font-[500] text-textBlack outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-[18px] lg:text-[20px] xl:text-[20px]"
                  />
                  <span className="text-[18px] font-[400] text-textBlack opacity-50 sm:text-[18px] lg:text-[20px] xl:text-[20px]">
                    Minutes
                  </span>
                </div>
              </div>
              <div
                className={stylesButton["button-close-setting-swap"]}
                onClick={() => setOpenSetting(false)}
              >
                Close
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${styles["swap-content"]} ${
            type === "tokenDetail" ? styles["token-swap-content"] : ""
          }`}
        >
          <div
            className={`${styles["swap-container-form"]} ${
              type === "tokenDetail" ? styles["token-swap-form"] : ""
            }`}
          >
            <div
              className={`${styles["swap-content-item"]} ${styles["swap-item-first"]}`}
            >
              <span className={styles["swap-item-header"]}>Sell</span>
              <div className={styles["line-swap-item"]}></div>
              <div className={styles["swap-item-content"]}>
                <Input
                  {...form.register("tokenIn_amount")}
                  placeholder="0"
                  className={cn([
                    styles["swap-item-input"],
                    "border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                  ])}
                />
                <DialogTrigger>
                  <div
                    className={`${styles["swap-item-select"]} ${
                      fields.tokenIn_token &&
                      styles["swap-item-select-have-token"]
                    }`}
                    onClick={() => setTypeOpenModal("tokenIn")}
                  >
                    {fields?.tokenIn_token ? (
                      <>
                        <Image
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
                <span className={styles["swap-item-footer-text"]}>
                  Balance: <Balance balance={balance?.toString() || "0"} />
                </span>
              </div>
            </div>
            <div className={styles["swap-button"]} onClick={() => changeSwap()}>
              <Image
                width={90}
                height={90}
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
                  disabled
                  className={cn([
                    styles["swap-item-input"],
                    "border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                  ])}
                />
                <DialogTrigger>
                  <div
                    className={`${styles["swap-item-select"]} ${
                      fields.tokenOut_token &&
                      styles["swap-item-select-have-token"]
                    }`}
                    onClick={() => setTypeOpenModal("tokenOut")}
                  >
                    {fields.tokenOut_token ? (
                      <>
                        <Image
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
                <span className={styles["swap-item-footer-text"]}>
                  Balance: <Balance balance={balanceOut?.toString() || "0"} />
                </span>
              </div>
            </div>
          </div>
          <Button
            loading={loading}
            className={`${stylesButton["button-swap"]} ${type === "tokenDetail" && stylesButton["button-swap-token-detail"]}`}
            disabled={!form.formState.isValid}
            style={{ marginTop: "-12px" }}
          >
            <span>{error ?? "Swap"}</span>
          </Button>
        </div>

        {/* <div className={styles["slippage-container"]}>
          <div className={styles["slippage-head"]}>Slippage</div>
          {SLIPPAGE?.map((item, index) => (
            <div
              className={`${styles["slippage-item"]} ${
                item?.value === fields.slippage && !fields.slippage_custom
                  ? styles["slippage-item-active"]
                  : ""
              }`}
              onClick={() => {
                form.setValue("slippage_custom", null, { shouldDirty: true });
                form.setValue("slippage", item?.value, {
                  shouldDirty: true,
                  shouldTouch: true,
                });
                form.trigger("slippage");
              }}
              data-slippage={item?.value}
              key={index}
            >
              {item?.label}
            </div>
          ))}
          <div className={`${styles["slippage-head"]} flex items-center`}>
            <Input
              {...form.register("slippage_custom")}
              placeholder="0.1"
              type="number"
              className={cn([
                styles["slippage-input-custom"],
                "border-0 bg-transparent outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
              ])}
            />
            <span
              className={`ml-[-10px] ${fields.slippage_custom === null ? "opacity-30" : "opacity-100"}`}
            >
              %
            </span>
          </div>
        </div> */}
        {/* <div className="flex items-center">
              <p className={cn("mr-1.5 text-lg text-textBlack")}>
                {unitPriceWrapped ? (
                  `1 ${unitPriceWrapped.tokenIn} = ${unitPrice} ${unitPriceWrapped.tokenOut}`
                ) : (
                  <></>
                )}
              </p>
              {unitPriceWrapped && (
                <p className={cn("text-lg text-textBlack")}>
                  (<USDBalance />)
                </p>
              )}
            </div> */}
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
