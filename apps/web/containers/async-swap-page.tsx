"use client";

import { SwapForm as SwapComponent } from "@/components/swap";
import { Swap as SwapForm } from "@/components/swap/swap-form";
// import { Swap as SwapForm } from "@/components/swap/swap";
import { useWalletStore } from "@/lib/stores/wallet";
import { useObservePool, useSellPath } from "@/lib/stores/xyk";
import { zodResolver } from "@hookform/resolvers/zod";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addPrecision, removePrecision } from "./xyk/add-liquidity-form";
import {
  useBalance,
  useBalancesStore,
  useObserveBalancePool,
} from "@/lib/stores/balances";
import { pools } from "@/tokens";
import { dijkstra, PoolKey, prepareGraph, TokenPair } from "chain";
import { TokenId } from "@proto-kit/library";
import { Form } from "@/components/ui/form";
import { useAggregatorStore, usePollPools } from "@/lib/stores/aggregator";

const INIT_SLIPPAGE = 0.5;

BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
export default function Swap() {
  const [loading, setLoading] = useState(false);
  const walletBalance = useRef("0");

  const formSchema = z.object({
    tokenIn_token: z
      .string({
        required_error: "Token in is required",
        invalid_type_error: "Token in is required",
      })
      .min(1, { message: "Token in is required" }),
    tokenIn_amount: z
      .string({
        required_error: "Token in amount is required",
        invalid_type_error: "Token in amount is required",
      })
      .min(1, { message: "Token in amount is required" })
      .refine(
        (data) => {
          return new BigNumber(data).lte(
            removePrecision(walletBalance.current),
          );
        },
        {
          message: "Insufficient balance",
        },
      ),
    tokenOut_token: z
      .string({
        required_error: "Token out is required",
        invalid_type_error: "Token out is required",
      })
      .min(1, { message: "Token out is required" }),
    tokenOut_amount: z
      .string({
        required_error: "Token out amount is required",
        invalid_type_error: "Token out amount is required",
      })
      .min(1, { message: "Token out amount is required" }),
    slippage: z.any().optional(),
    slippage_custom: z.any().optional(),
    transactionDeadline: z.any().optional(),
    route: z.array(z.string()).min(2, { message: "No route found" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      route: [],
      slippage: INIT_SLIPPAGE,
      slippage_custom: null,
      transactionDeadline: 30,
    },
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const fields = form.getValues();
  const wallet = useWalletStore();
  const balance = useBalance(fields.tokenIn_token, wallet.wallet);
  const balanceOut = useBalance(fields.tokenOut_token, wallet.wallet);

  const { pools } = useAggregatorStore();
  usePollPools();

  const routerPools: {
    [key: string]: {
      path: [string, string];
      balance: { [key: string]: string | number };
    };
  } = useMemo(() => {
    return pools.reduce((preResultPools, poolTx) => {
      const poolKey = PoolKey.fromTokenPair(
        TokenPair.from(
          TokenId.from(poolTx.tokenAId),
          TokenId.from(poolTx.tokenBId),
        ),
      ).toBase58();
      return {
        ...preResultPools,
        [poolKey]: {
          // tokenA: poolTx.tokenAId,
          // tokenB: poolTx.tokenBId,
          // balanceA: poolTx.balancesA,
          // balanceB: poolTx.balancesB,
          path: [poolTx.tokenAId, poolTx.tokenBId],
          balance: {
            [poolTx.tokenAId]: poolTx.balancesA,
            [poolTx.tokenBId]: poolTx.balancesB,
          },
        },
      };
    }, {});
  }, [JSON.stringify(pools)]);

  const poolKey = useMemo(() => {
    if (!fields.tokenIn_token || !fields.tokenOut_token) return;
    return PoolKey.fromTokenPair(
      TokenPair.from(
        TokenId.from(fields.tokenIn_token),
        TokenId.from(fields.tokenOut_token),
      ),
    ).toBase58();
  }, [fields.tokenIn_token, fields.tokenOut_token]);

  const pool = useObservePool(poolKey ?? "0");

  useEffect(() => {
    if (!fields.tokenIn_token || !fields.tokenOut_token || pool?.loading)
      return;

    if (pool?.exists) {
      form.setValue("route", [fields.tokenIn_token, fields.tokenOut_token], {
        shouldValidate: true,
      });
    } else {
      const currentRouterPools: [string, string][] = Object.values(routerPools)
        // .filter((pool) => pool.pool?.exists)
        .map(({ path }) => path);

      try {
        const graph = prepareGraph(currentRouterPools);
        const distance = dijkstra(
          graph,
          fields.tokenIn_token,
          fields.tokenOut_token,
        );
        const route = distance?.path
          ? [fields.tokenIn_token, ...(distance?.path ?? [])]
          : [];

        console.log("route", route, distance?.path);
        form.setValue("route", route, {
          shouldValidate: true,
        });
      } catch (e) {
        form.setValue("route", [], {
          shouldValidate: true,
        });
      }
    }
  }, [fields.tokenIn_token, fields.tokenOut_token, pool]);

  useEffect(() => {
    walletBalance.current = balance ?? "0";
    form.formState.isDirty && form.trigger("tokenIn_amount");
  }, [balance, form.formState.isDirty]);

  const balances = useBalancesStore();

  const updateTokenOutAmount = useCallback(() => {
    if (
      !fields.route.length ||
      fields.tokenIn_amount === "0" ||
      !fields.tokenIn_amount
    ) {
      form.setValue("tokenOut_amount", "0", { shouldValidate: true });
      return;
    }
    let amountIn = addPrecision(fields.tokenIn_amount);
    let amountOut = "0";

    console.log("fields.route", fields.route);
    fields.route.forEach((token, index) => {
      const tokenIn = token;
      const tokenOut = fields.route[index + 1] ?? 99999; // MAX_TOKEN_ID
      const poolKey = PoolKey.fromTokenPair(
        TokenPair.from(TokenId.from(tokenIn), TokenId.from(tokenOut)),
      ).toBase58();
      const tokenInReserve = routerPools[poolKey]?.balance
        ? routerPools[poolKey]?.balance[tokenIn]
        : "0";
      const tokenOutReserve = routerPools[poolKey]?.balance
        ? routerPools[poolKey]?.balance[tokenOut]
        : "0";

      if (
        !tokenOutReserve ||
        !tokenInReserve ||
        tokenOutReserve === "0" ||
        tokenInReserve === "0"
      )
        return;

      const intermediateAmountOut = new BigNumber(amountIn)
        .multipliedBy(tokenOutReserve)
        .div(new BigNumber(tokenInReserve).plus(amountIn));

      const amountOutWithoutFee = intermediateAmountOut.minus(
        intermediateAmountOut.multipliedBy(3).dividedBy(1000),
      );

      amountOut = amountOutWithoutFee.toString();
      amountIn = amountOut;
    });

    if (new BigNumber(amountOut).isNaN()) return;
    form.setValue("tokenOut_amount", removePrecision(amountOut), {
      shouldValidate: true,
    });
  }, [fields.tokenIn_amount, fields.route, balances.balances]);

  useEffect(updateTokenOutAmount, [
    JSON.stringify(fields.route),
    fields.tokenIn_amount,
    fields.tokenIn_token,
    JSON.stringify(balances.balances),
  ]);

  const unitPrice = useMemo(() => {
    if (
      !fields.tokenIn_amount ||
      !fields.tokenOut_amount ||
      fields.tokenIn_amount === "0" ||
      fields.tokenOut_amount === "0"
    )
      return;
    return new BigNumber(fields.tokenOut_amount)
      .dividedBy(fields.tokenIn_amount)
      .toFixed(2);
  }, [fields.tokenIn_amount, fields.tokenOut_amount]);

  const sellPath = useSellPath();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await sellPath(
        values.route,
        addPrecision(values.tokenIn_amount),
        // TODO add slippage
        addPrecision(
          `${(Number(values.tokenOut_amount) * (100 - Number(values.slippage_custom ?? values.slippage))) / 100}`,
        ),
        values,
      );
    } finally {
      setLoading(false);
    }
  };

  const changeSwap = useCallback(() => {
    const currentTokenIn = form.getValues("tokenIn_token");
    const currentTokenOut = form.getValues("tokenOut_token");
    const currentAmountIn = form.getValues("tokenIn_amount");
    const currentAmountOut = form.getValues("tokenOut_amount");

    form.setValue("tokenIn_token", currentTokenOut);
    form.setValue("tokenOut_token", currentTokenIn);
    form.setValue("tokenIn_amount", currentAmountOut);
    form.setValue("tokenOut_amount", currentAmountIn);

    form.trigger();
  }, [form]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <SwapComponent
            swapForm={
              <SwapForm
                unitPrice={unitPrice}
                loading={loading}
                changeSwap={changeSwap}
                balance={balance}
                balances={balances}
                balanceOut={balanceOut}
              />
            }
          />
        </form>
      </Form>
      {/* <SwapComponent
        swapForm={<SwapForm type="tokenIn" token="" />}
      /> */}
    </>
  );
}
