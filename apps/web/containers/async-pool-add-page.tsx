"use client";
// import { PoolAdd as PoolAddComponent } from "@/components/v2/add";
import { PoolAdd as PoolAddComponent } from "@/components/v2/add-liquidity-form";
import {
  useBalance,
  useBalancesStore,
  useObserveBalancePool,
  useObserveTotalSupply,
} from "@/lib/stores/balances";
import { useWalletStore } from "@/lib/stores/wallet";
import { findTokenByParams, tokens } from "@/tokens";
import BigNumber from "bignumber.js";
import {  useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePoolKey } from "@/lib/xyk/usePoolKey";
import {
  useAddLiquidity,
  useCreatePool,
  useObservePool,
} from "@/lib/stores/xyk";
import { LPTokenId } from "chain";
import { useSpotPrice } from "@/lib/xyk/useSpotPrice";
import { addPrecision, removePrecision } from "@/lib/utils";
import { precision, removeTrailingZeroes } from "@/components/ui/balance";
import { Form } from "@/components/ui/form";
import { UInt64 } from "o1js";
import { dataSubmitProps } from "@/types";

export const initCheckForm = {
  isComfirmed: false,
  isSuccess: false,
  isWaiting: false,
  isError: false,
  message: "",
};

const INIT_SLIPPAGE = 0.2;

export default function Pool({ params }: { params?: any }) {
  const [loading, setLoading] = useState(false);
  const createPool = useCreatePool();
  const addLiquidity = useAddLiquidity();
  const { wallet } = useWalletStore();
  const { balances } = useBalancesStore();
  const token = params?.token;

  const balanceARef = useRef("0");
  const balanceBRef = useRef("0");

  const tokenA = token && findTokenByParams(token[0]);
  const tokenB = token && findTokenByParams(token[1]);

  const ownBalances = wallet ? balances[wallet] : {};
  const tokenParams = useMemo(
    () => ({
      tokenA,
      tokenB,
    }),
    [params],
  );

  const formSchema = z
    .object({
      tokenA_token: z
        .string({
          required_error: "Invalid pair",
          invalid_type_error: "Invalid pair",
        })
        .min(1, { message: "Invalid pair" }),
      tokenA_amount: z
        .string()
        .min(1, { message: "Enter an amount" })
        .refine((value) => BigNumber(value).gt(0), {
          message: "Amount must be greater than 0",
        }),
      tokenB_token: z
        .string({
          required_error: "Invalid pair",
          invalid_type_error: "Invalid pair",
        })
        .min(1, { message: "Invalid pair" }),
      tokenB_amount: z
        .string()
        .min(1, { message: "Enter an amount" })
        .refine((value) => BigNumber(value).gt(0), {
          message: "Amount must be greater than 0",
        }),
      tokenLP_amount: z.any(),
      shareOfPool: z.any().optional(),
      isComfirmed: z.boolean().default(false),
      isSuccess: z.boolean().default(false),
      isWaiting: z.boolean().default(false),
      isError: z.boolean().default(false),
      messsage: z.string().optional(),
      slippage: z.any().optional(),
      slippage_custom: z.any().optional(),
      transactionDeadline: z.any().optional(),
    })
    .refine((data) => {
      if (data.tokenA_token === "1") {
        return data.tokenB_token !== "2";
      }
      if (data.tokenA_token === "2") {
        return data.tokenB_token !== "1";
      }
      return true;
    }, {
      message: "Invalid token pair",
      path: ["tokenA_token"],
    })
    .refine((data) => data.tokenA_token !== data.tokenB_token, {
      message: "Tokens must be different",
      path: ["tokenA_token"],
    })
    .refine(
      (data) => {
        return new BigNumber(data.tokenA_amount).lte(
          removePrecision(balanceARef.current, precision),
        );
      },
      {
        message: "Insufficient balance",
        path: ["tokenA_amount"],
      },
    )
    .refine(
      (data) =>
        new BigNumber(data.tokenB_amount).lte(
          removePrecision(balanceBRef.current, precision),
        ),
      {
        message: "Insufficient balance",
        path: ["tokenB_amount"],
      },
    );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shareOfPool: "0",
      tokenLP_amount: null,
      slippage: INIT_SLIPPAGE,
      slippage_custom: "",
      transactionDeadline: 30,
    },
    reValidateMode: "onChange",
    mode: "onChange",
  });
  const fields = form.getValues();

  const { poolKey, tokenPair } = usePoolKey(
    fields.tokenA_token,
    fields.tokenB_token,
  );
  const pool = useObservePool(poolKey);

  // observe balances of the pool & the connected wallet
  const tokenAReserve = useObserveBalancePool(fields.tokenA_token, poolKey);
  const tokenBReserve = useObserveBalancePool(fields.tokenB_token, poolKey);
  const userTokenABalance = useBalance(fields.tokenA_token, wallet);
  const userTokenBBalance = useBalance(fields.tokenB_token, wallet);
  const userTokenLpBalance = useBalance(
    LPTokenId.fromTokenPair(tokenPair).toString(),
    wallet,
  );

  useEffect(() => {
    form.setValue("tokenA_token", tokenParams?.tokenA?.value, {
      shouldDirty: true,
    });
    form.setValue("tokenB_token", tokenParams?.tokenB?.value, {
      shouldDirty: true,
    });
    form.trigger();
  }, [params, tokenParams]);

  useEffect(() => {
    if (!userTokenABalance || !userTokenBBalance) return;
    balanceARef.current = userTokenABalance;
    balanceBRef.current = userTokenBBalance;
    form.formState.isDirty && form.trigger();
  }, [userTokenABalance, userTokenBBalance, form.formState.isDirty]);

  const lpTotalSupply = useObserveTotalSupply(
    LPTokenId.fromTokenPair(tokenPair).toString(),
  );

  const spotPrice = useSpotPrice(tokenAReserve, tokenBReserve);

  const tokenB_One_amount = new BigNumber("1").dividedBy(
    useSpotPrice(tokenAReserve, tokenBReserve),
  );

  const tokenA_One_amount = new BigNumber("1").dividedBy(
    useSpotPrice(tokenBReserve, tokenAReserve),
  );

  useEffect(() => {
    if (
      !pool?.exists ||
      !lpTotalSupply ||
      !fields.tokenA_amount ||
      !tokenAReserve
    ) {
      return;
    }

    const lpTokensToMint = new BigNumber(lpTotalSupply)
      .multipliedBy(addPrecision(fields.tokenA_amount, precision))
      .div(tokenAReserve)
      .toString();

    console.log(
      "calculated lp tokens",
      removePrecision(lpTokensToMint, precision),
    );
    if (pool?.exists && tokenAReserve === "0" && tokenBReserve === "0") {
      if (Number(fields.tokenA_token) > Number(fields.tokenB_token)) {
        return form.setValue("tokenLP_amount", fields.tokenA_amount);
      } else {
        return form.setValue("tokenLP_amount", fields.tokenB_amount);
      }
    }
    form.setValue("tokenLP_amount", removePrecision(lpTokensToMint, precision));
  }, [
    pool,
    tokenAReserve,
    tokenBReserve,
    fields.tokenA_token,
    fields.tokenB_token,
    lpTotalSupply,
  ]);

  // calculate amount B
  useEffect(() => {
    if (pool?.exists && tokenAReserve === "0" && tokenBReserve === "0") return;
    if (fields.tokenA_amount === "" || BigNumber(fields.tokenA_amount).lte(0)) {
      form.setValue("tokenB_amount", "");
      return;
    }
    const tokenB_amount = new BigNumber(fields.tokenA_amount).dividedBy(
      spotPrice,
    );
    if (!pool?.loading && pool?.exists && !tokenB_amount.isNaN()) {
      form.setValue(
        "tokenB_amount",
        removeTrailingZeroes(tokenB_amount.toFixed(precision)),
      );
    }
  }, [fields.tokenA_amount, pool, lpTotalSupply, spotPrice]);

  function calculateAmountWithSlippage(
    amount: number | string,
    slippage: number | string,
    customSlippage?: number | string,
  ): number | null | string {
    // Ensure inputs are converted to numbers
    const parsedAmount = Number(amount);
    const parsedSlippage = Number(customSlippage) || Number(slippage) || 0; // Default slippage is 0.5%

    // Validate parsed values
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      console.error("Invalid amount. Amount must be a positive number.");
      return null;
    }
    // Calculate adjusted amount
    const adjustedAmount = (parsedAmount * (100 - parsedSlippage)) / 100;

    return adjustedAmount.toFixed(precision).toString();
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    form.setValue("isWaiting", true);
    form.setValue("isComfirmed", false);
    // Slippage adjustment for amountB
    // const adjustedAmountB = calculateAmountWithSlippage(
    //   values.tokenB_amount,
    //   values.slippage,
    //   values.slippage_custom,
    // )?.toString();
    const data: dataSubmitProps = {
      logoA: tokens[values.tokenA_token]?.logo,
      logoB: tokens[values.tokenB_token]?.logo,
      tickerA: tokens[values.tokenA_token]?.ticker,
      tickerB: tokens[values.tokenB_token]?.ticker,
      amountA: values.tokenA_amount,
      amountB: values.tokenB_amount,
    };
    try {
      if (pool?.exists) {
        await addLiquidity(
          values.tokenA_token,
          values.tokenB_token,
          addPrecision(values.tokenA_amount, precision),
          addPrecision(
            BigNumber(values.tokenB_amount)
              .multipliedBy(
                BigNumber(1).plus(
                  BigNumber(
                    values.slippage_custom || values.slippage,
                  ).dividedBy(100),
                ),
              )
              .toString(),
            precision,
          ),
          data,
        );
      } else {
        await createPool(
          values.tokenA_token,
          values.tokenB_token,
          addPrecision(values.tokenA_amount, precision),
          addPrecision(values.tokenB_amount, precision),
          data,
        );
      }
      form.setValue("isSuccess", true);
      form.setValue("isWaiting", false);
    } catch (error: any) {
      form.setValue("isComfirmed", false);
      form.setValue("isWaiting", false);
      form.setValue("isSuccess", false);
      form.setValue("isError", true);
      form.setValue(
        "messsage",
        error?.message || "Something went wrong. Please try again",
      );
    } finally {
      setLoading(false);
    }
  };

  // if create pool, calculate the initial LP amount
  useEffect(() => {
    form.formState.isDirty && form.trigger();

    if (pool?.exists) {
      return;
    }

    if (!fields.tokenA_token || !fields.tokenB_token) return;
    if (Number(fields.tokenA_token) > Number(fields.tokenB_token)) {
      form.setValue("tokenLP_amount", fields.tokenA_amount);
    } else {
      form.setValue("tokenLP_amount", fields.tokenB_amount);
    }
  }, [
    fields.tokenA_amount,
    fields.tokenB_amount,
    fields.tokenA_token,
    fields.tokenB_token,
    pool,
    form.formState.isDirty,
  ]);

  // calculate shareOfPool
  useEffect(() => {
    const lpTotalSupplyValue = new BigNumber(lpTotalSupply || "");
    if (
      (pool && pool?.exists && lpTotalSupplyValue.isNaN()) ||
      fields.tokenA_amount === "" ||
      fields.tokenB_amount === "" ||
      BigNumber(fields.tokenA_amount).lte(0) ||
      BigNumber(fields.tokenB_amount).lte(0)
    ) {
      form.setValue("shareOfPool", "0");
      return;
    }

    const lpAmountAppend = fields.tokenLP_amount;

    // Get user's total contribution by adding existing and newly minted LP tokens
    const userContribution = new BigNumber(userTokenLpBalance || "0").plus(
      addPrecision(lpAmountAppend, precision),
    );
    const totalSupplyWithContribution = new BigNumber(lpTotalSupplyValue).plus(
      addPrecision(lpAmountAppend, precision),
    );
    // Calculate share of pool
    if (totalSupplyWithContribution.isZero()) {
      form.setValue("shareOfPool", "0");
    } else {
      const shareOfPool = userContribution
        .dividedBy(totalSupplyWithContribution)
        .multipliedBy(100);
      form.setValue("shareOfPool", shareOfPool);
    }

    form.trigger("shareOfPool");
  }, [lpTotalSupply, pool, fields.tokenLP_amount, fields.tokenA_amount]);

  const handleMax = (type: string) => {
    const { quotient: quotientA, rest: restA } = UInt64.from(
      balanceARef.current,
    ).divMod(10 ** precision);
    const { quotient: quotientB, rest: restB } = UInt64.from(
      balanceBRef.current,
    ).divMod(10 ** precision);
    switch (type) {
      case "tokenA":
        form.setValue(
          "tokenA_amount",
          Number(
            `${quotientA.toString()}.${Number(restA.toString())}`,
          ).toString(),
        );
        break;
      case "tokenB":
        form.setValue(
          "tokenB_amount",
          Number(
            `${quotientB.toString()}.${Number(restB.toString())}`,
          ).toString(),
        );
      default:
        break;
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <PoolAddComponent
            tokenParams={tokenParams}
            balances={ownBalances}
            handleMax={handleMax}
            poolExists={
              pool?.exists && tokenAReserve !== "0" && tokenBReserve !== "0"
            }
            loading={loading}
            tokenA_One_amount={tokenA_One_amount.toNumber() || 0}
            tokenB_One_amount={tokenB_One_amount.toNumber() || 0}
            tokenABalance={userTokenABalance}
            tokenBBalance={userTokenBBalance}
            onSubmit={onSubmit}
          />
        </form>
      </Form>

      {/* <PoolAddComponent tokenParams={tokenParams} balances={ownBalances} /> */}
    </>
  );
}
