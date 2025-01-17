import { useMemo } from "react";
import styles from "../css/swap.module.css";
import stylesButton from "../css/button.module.css";
import Image from "next/image";
import { Button } from "../ui/button";
import { client, PoolKey, TokenPair } from "chain";
import { TokenId } from "@proto-kit/library";
import { formatPriceUSD } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { SettingComponent } from "./components/SettingComponent/SettingComponent";
import { InputComponent } from "./components/InputComponent/InputComponent";
import { tokenModal } from "@/types";
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

export function SwapFormUpdate({
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
  const fields = form.getValues();

  const handleSelectedPool = (token: tokenModal, typeToken: string) => {
    const typeSelectToken = `${typeToken}_token`;
    form.setValue(typeSelectToken, token?.value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    form.setValue(`${typeToken}_amount`, "");

    form.setValue(`${typeToken}_price`, token?.price);

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

  const handleChangeAmount = (valueInput: string, typeToken: string) => {
    {
      let value = valueInput;

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
      form.setValue(`${typeToken}_amount`, value);
    }
  };

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
    <div
      className={`${styles["swap-container"]} ${
        isDetail
          ? `${styles["token-swap-container"]} ${styles["pc-swap-token"]}`
          : ""
      }`}
    >
      <div
        className={`flex w-full items-center justify-between ${styles["swap-header"]}`}
      >
        <span className={styles["swap-text"]}>Swap</span>
        <SettingComponent isDetail={isDetail} />
      </div>
      <div
        className={`${styles["swap-content"]} ${isDetail ? styles["token-swap-content"] : ""}`}
      >
        <div
          className={`${styles["swap-container-form"]} ${
            isDetail ? styles["token-swap-form"] : ""
          }`}
        >
          <InputComponent
            titleInput="Sell"
            changeBalance={true}
            balance={balance}
            usdBalance={USDBalances.tokenIn}
            disabledInput={false}
            isDetail={isDetail}
            token={fields.tokenIn_token}
            typeToken="tokenIn"
            onClickSelected={handleSelectedPool}
            onChangeAmount={handleChangeAmount}
          />
          <div className={styles["swap-button"]} onClick={() => changeSwap()}>
            <Image
              width={65}
              height={65}
              src="/images/swap/swap-button-icon.svg"
              alt="swap-button"
            />
          </div>
          <InputComponent
            titleInput="Buy"
            changeBalance={false}
            balance={balanceOut}
            usdBalance={USDBalances.tokenOut}
            disabledInput={true}
            isDetail={isDetail}
            token={fields.tokenOut_token}
            typeToken="tokenOut"
            onClickSelected={handleSelectedPool}
          />
        </div>
        <Button
          loading={loading}
          className={`${stylesButton["button-swap"]} ${isDetail && stylesButton["button-swap-token-detail"]}`}
          disabled={!form.formState.isValid}
        >
          <span>{error ?? "Swap"}</span>
        </Button>
        {!isDetail && (
          <div
            className={
              styles["wrapper-warning-swap"] +
              " mb-[20px] flex flex-row items-center gap-5"
            }
          >
            <Image
              src="/images/swap/warning.svg"
              alt="swap-icon"
              width={24}
              height={24}
            />
            <span className="weight-[400] font-sans text-[12px] text-textBlack sm:text-[12px] lg:text-[14px] xl:text-[16px]">
              Note: All transactions in the Trading Competition take place on
              DinoDex's Local net, using test tokens that cannot be converted to
              Mainnet or Devnet
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
