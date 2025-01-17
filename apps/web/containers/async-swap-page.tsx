"use client";

import { SwapForm as SwapComponent } from "@/components/swap";
// import { Swap as SwapForm } from "@/components/swap/swap-form";
import { SwapFormUpdate as SwapForm } from "@/components/swap/swap-form-update";
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
  // useObserveBalancePool,
} from "@/lib/stores/balances";
import { dijkstra, PoolKey, prepareGraph, TokenPair } from "chain";
import { BalancesKey, TokenId } from "@proto-kit/library";
import { Form } from "@/components/ui/form";
import { useAggregatorStore, usePollPools } from "@/lib/stores/aggregator";
import { useClientStore } from "@/lib/stores/client";
import { PublicKey } from "o1js";
import { debounce } from "lodash";
import { dataSubmitProps } from "@/types";
import { formatFullValue, getTokenId } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useTokenStore } from "@/lib/stores/token";

const INIT_SLIPPAGE = 0.2;
// const MIN_THRESHOLD = new BigNumber("0.00000000000000001");

export interface tokenSelectInfoProps {
  id: string;
  price: number;
}

export interface SwapProps {
  isDetail: boolean;
  tokenSelectInfo?: tokenSelectInfoProps;
}

BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
export default function Swap({ isDetail, tokenSelectInfo }: SwapProps) {
  const { data: tokens } = useTokenStore();
  const { tokens: listTokens, loadTokens } = useAggregatorStore();
  const { setLoadBalances } = useBalancesStore();
  const [loading, setLoading] = useState(false);
  const walletBalance = useRef("0");
  const tokenA = useSearchParams().get("tokenA");
  const tokenB = useSearchParams().get("tokenB");
  const router = useRouter();
  const formSchema = z
    .object({
      tokenIn_token: z
        .string({
          required_error: "Select tokens",
          invalid_type_error: "Select tokens",
        })
        .min(1, { message: "Select tokens" }),
      tokenOut_token: z
        .string({
          required_error: "Select tokens",
          invalid_type_error: "Select tokens",
        })
        .min(1, { message: "Select tokens" }),
      tokenIn_amount: z
        .string({
          required_error: "Enter an amount",
          invalid_type_error: "Enter an amount",
        })
        .min(1, { message: "Enter an amount" })
        .refine((data) => new BigNumber(data).gt(0), {
          message: "Amount must be greater than 0",
        })
        .refine(
          (data) =>
            new BigNumber(data).lte(removePrecision(walletBalance.current)),
          {
            message: "Insufficient balance",
          },
        ),
      tokenOut_amount: z
        .string({
          required_error: "Enter an amount",
          invalid_type_error: "Enter an amount",
        })
        .min(1, { message: "Enter an amount" })
        .refine((data) => new BigNumber(data).gt(0), {
          message: "No Liquidity",
        }),
      slippage: z.any().optional(),
      tokenIn_price: z.any().optional(),
      tokenOut_price: z.any().optional(),
      slippage_custom: z.any().optional(),
      transactionDeadline: z.any().optional(),
      route: z.array(z.string()).min(2, { message: "No route found" }),
    })
    .refine((data) => data.tokenIn_token !== data.tokenOut_token, {
      message: "Tokens must be different",
      path: ["tokenIn_token"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      route: [],
      slippage: INIT_SLIPPAGE,
      slippage_custom: "",
      transactionDeadline: 30,
      tokenIn_token: "",
      tokenOut_token: "",
    },
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const balances = useBalancesStore();
  const fields = form.getValues();
  const wallet = useWalletStore();
  const balance = useBalance(fields.tokenIn_token, wallet.wallet);
  const balanceOut = useBalance(fields.tokenOut_token, wallet.wallet);
  const { pools } = useAggregatorStore();
  usePollPools();
  const { client } = useClientStore();

  const getBalanceByTokenId = async (tokenId: string, address: string) => {
    if (!client || !address || !tokenId) return "0";
    const key = BalancesKey.from(
      TokenId.from(tokenId),
      PublicKey.fromBase58(address),
    );
    const balance = await client.query.runtime.Balances.balances.get(key);
    return balance?.toString() || "0";
  };

  useEffect(() => {
    if (!listTokens || listTokens.length === 0) return;
    if (tokenA && tokenB) {
      const tokenAId = getTokenId(tokens, tokenA);
      const tokenBId = getTokenId(tokens, tokenB);
      const priceA = listTokens.find((item) => item.id === tokenAId)?.price;
      const priceB = listTokens.find((item) => item.id === tokenBId)?.price;
      form.setValue("tokenIn_token", tokenAId || "", { shouldValidate: true });
      form.setValue("tokenOut_token", tokenBId || "", { shouldValidate: true });
      form.setValue("tokenIn_price", priceA, { shouldValidate: true });
      form.setValue("tokenOut_price", priceB, { shouldValidate: true });
      form.trigger("tokenIn_token");
      form.trigger("tokenOut_token");
      const currentPath = window.location.pathname;
      router.replace(currentPath, { scroll: false });
    }
  }, [tokenA, tokenB, form, JSON.stringify(listTokens)]);

  // Monitor changes and automatically handle errors where necessary
  useEffect(() => {
    const subscription = form.watch((value) => {
      const { tokenIn_token, tokenOut_token, route } = value;

      // Inline validation logic for watch
      if (!tokenIn_token) {
        form.setError("tokenIn_token", { message: "Select tokens" });
      } else {
        form.clearErrors("tokenIn_token");
      }

      if (!tokenOut_token) {
        form.setError("tokenOut_token", { message: "Select tokens" });
      } else {
        form.clearErrors("tokenOut_token");
      }

      if (!route || route.length < 2) {
        form.setError("route", { message: "No route found" });
      } else {
        form.clearErrors("route");
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const routerPools: {
    [key: string]: {
      path: [string, string];
      balance: { [key: string]: string | number };
    };
  } = useMemo(() => {
    return (
      pools &&
      pools?.reduce((preResultPools, poolTx) => {
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
      }, {})
    );
  }, [JSON.stringify(pools), balances.balances, fields.tokenIn_amount]);

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
      const currentRouterPools: [string, string][] = routerPools
        ? Object.values(routerPools).map(({ path }) => path)
        : [];

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

        // console.log("route", route, distance?.path);
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

  const updateTokenOutAmount = async () => {
    if (
      !fields.route.length ||
      fields.tokenIn_amount === "0" ||
      fields.tokenIn_amount === "" ||
      !fields.tokenIn_amount
    ) {
      return form.setValue("tokenOut_amount", "", {
        shouldValidate: true,
      });
    }
    let amountIn = addPrecision(fields.tokenIn_amount);
    let amountOut = "0";

    for (var i = 0; i < fields.route.length; i++) {
      const token = fields.route[i];
      const tokenIn = token;
      const tokenOut = fields.route[i + 1] ?? 99999; // MAX_TOKEN_ID
      const poolKey = PoolKey.fromTokenPair(
        TokenPair.from(TokenId.from(tokenIn), TokenId.from(tokenOut)),
      ).toBase58();
      // const tokenInReserve = routerPools[poolKey]?.balance
      //   ? routerPools[poolKey]?.balance[tokenIn]
      //   : "0";
      // const tokenOutReserve = routerPools[poolKey]?.balance
      //   ? routerPools[poolKey]?.balance[tokenOut]
      //   : "0";

      const tokenInReserve = await getBalanceByTokenId(tokenIn, poolKey);
      const tokenOutReserve = await getBalanceByTokenId(tokenOut, poolKey);

      if (
        !tokenOutReserve ||
        !tokenInReserve ||
        tokenOutReserve === "0" ||
        tokenInReserve === "0"
      ) {
        break;
      }

      const intermediateAmountOut = new BigNumber(amountIn)
        .multipliedBy(tokenOutReserve)
        .div(new BigNumber(tokenInReserve).plus(amountIn));

      const amountOutWithoutFee = intermediateAmountOut.minus(
        intermediateAmountOut.multipliedBy(3).dividedBy(1000),
      );

      amountOut = amountOutWithoutFee.toString();
      amountIn = amountOut;
    }
    // const valueIn = new BigNumber(fields.tokenIn_amount);
    if (new BigNumber(amountOut).isNaN()) return;
    if (amountOut !== "0") {
      form.setValue(
        "tokenOut_amount",
        formatFullValue(removePrecision(amountOut)),
        {
          shouldValidate: true,
        },
      );
    } else {
      form.setValue("tokenOut_amount", "0", {
        shouldValidate: true,
      });
    }
  };

  const debouncedUpdateTokenOutAmount = debounce(updateTokenOutAmount, 300);

  useEffect(() => {
    debouncedUpdateTokenOutAmount();
    return () => debouncedUpdateTokenOutAmount.cancel();
  }, [
    JSON.stringify(fields.route),
    fields.tokenIn_amount,
    fields.tokenIn_token,
    JSON.stringify(balances.balances),
  ]);

  // const unitPrice = useMemo(() => {
  //   if (
  //     !fields.tokenIn_amount ||
  //     !fields.tokenOut_amount ||
  //     fields.tokenIn_amount === "0" ||
  //     fields.tokenOut_amount === "0"
  //   )
  //     return;
  //   return new BigNumber(fields.tokenOut_amount)
  //     .dividedBy(fields.tokenIn_amount)
  //     .toFixed(2);
  // }, [fields.tokenIn_amount, fields.tokenOut_amount]);

  const sellPath = useSellPath();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const data: dataSubmitProps = {
      logoA: tokens[values.tokenIn_token]?.logo,
      logoB: tokens[values.tokenOut_token]?.logo,
      tickerA: tokens[values.tokenIn_token]?.ticker,
      tickerB: tokens[values.tokenOut_token]?.ticker,
      amountA: values.tokenIn_amount,
      amountB: values.tokenOut_amount,
    };
    try {
      await sellPath(
        values.route,
        addPrecision(values.tokenIn_amount),
        // TODO add slippage
        addPrecision(
          `${(Number(values.tokenOut_amount) * (100 - Number(values.slippage_custom ? values.slippage_custom : values.slippage))) / 100}`,
        ),
        data,
      );
    } finally {
      setLoading(false);
    }
  };

  const changeSwap = useCallback(async () => {
    const tempTokenIn = fields.tokenOut_token;
    const tempTokenOut = fields.tokenIn_token;
    const tempAmountIn = fields.tokenOut_amount;
    const priceTokenIn = fields.tokenOut_price;
    const priceTokenOut = fields.tokenIn_price;

    form.setValue("tokenIn_token", tempTokenIn);
    form.setValue("tokenOut_token", tempTokenOut);
    form.setValue("tokenIn_amount", tempAmountIn);
    form.setValue("tokenIn_price", priceTokenIn);
    form.setValue("tokenOut_price", priceTokenOut);
  }, [fields]);

  useEffect(() => {
    if (!tokenSelectInfo || !tokenSelectInfo?.id || !tokenSelectInfo?.price)
      return;
    if (fields.tokenIn_token === tokenSelectInfo?.id) {
      form.setValue("tokenOut_token", "");
      form.setValue("tokenOut_price", "");
    } else {
      form.setValue("tokenOut_token", String(tokenSelectInfo?.id));
      form.setValue("tokenOut_price", Number(tokenSelectInfo?.price));
    }
  }, [JSON.stringify(tokenSelectInfo)]);

  useEffect(() => {
    if (!form.formState.isValid) {
      setLoadBalances(false);
    }
    else{
      setLoadBalances(true);
    }
  }, [form.formState.isValid]);

  useEffect(() => {
    loadTokens()
  },[])

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <SwapComponent
            swapForm={
              <SwapForm
                // unitPrice={unitPrice}
                loading={loading}
                changeSwap={changeSwap}
                balance={balance}
                balances={balances}
                balanceOut={balanceOut}
                isDetail={isDetail}
              />
            }
            isDetail={isDetail}
          />
        </form>
      </Form>
    </>
  );
}
