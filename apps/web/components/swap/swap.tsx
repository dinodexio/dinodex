import { useEffect, useMemo, useRef, useState } from "react";
import "../style.css";
import styles from "../css/swap.module.css";
import stylesButton from "../css/button.module.css";
import { SLIPPAGE } from "@/constants";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModalListToken } from "../modalListToken/modalListToken";
import BigNumber from "bignumber.js";
import {
  addPrecision,
  removePrecision,
} from "@/containers/xyk/add-liquidity-form";
import { Button } from "../ui/button";
import { generatePools, pools, tokens } from "@/tokens";
import { useWalletStore } from "@/lib/stores/wallet";
import { useBalancesStore, useObserveBalance } from "@/lib/stores/balances";
import { dijkstra, PoolKey, prepareGraph, TokenPair } from "chain";
import { TokenId } from "@proto-kit/library";
import { useObservePool, useSellPath, } from "@/lib/stores/xyk";
import { Balance } from "../ui/balance";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";

export interface SwapProps {
  token: any;
  type: string;
}

const INIT_SLIPPPAGE = 0.5;

// const pools = generatePools();

export function Swap({ token, type }: SwapProps) {
  const [loading, setLoading] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const walletBalance = useRef("0");
  const [tokenSwap, setTokenSwap] = useState<any>({
    tokenIn: {
      name: null,
      symbol: null,
      logo: null,
      value: undefined,
    },
    tokenOut: {
      name: null,
      symbol: null,
      logo: null,
      value: undefined,
    },
    route: [],
  });

  // const {pools} = useXYKStore();

  const [valueInputSwap, setValueInputSwap] = useState<any>({
    tokenIn: null,
    tokenOut: null,
  });

  const [slippage, setSlippage] = useState<number>(INIT_SLIPPPAGE);

  const [typeOpenModal, setTypeOpenModal] = useState<string>("tokenIn");

  const renderButtonSwap = useMemo(() => {
    // console.log(
    //   "walletBalance",
    //   walletBalance.current,
    //   valueInputSwap.tokenIn,
    //   new BigNumber(valueInputSwap.tokenIn).lte(
    //     removePrecision(walletBalance.current),
    //   ),
    // );
    let text = "Swap";
    let isDisabled = false;

    // Check if token names are null
    if (tokenSwap.tokenIn?.name === null || tokenSwap.tokenOut?.name === null) {
      text = "Tokens are required";
      isDisabled = true;
      return { text, isDisabled }; // Early return to avoid further checks
    }

    // Check if tokenIn or tokenOut input is null
    if (valueInputSwap.tokenIn === null || valueInputSwap.tokenOut === null) {
      text = "Amount is required";
      isDisabled = true;
      return { text, isDisabled }; // Early return to avoid further checks
    }

    // Check for insufficient balance
    if (
      new BigNumber(valueInputSwap.tokenIn).gt(
        removePrecision(walletBalance.current),
      )
    ) {
      text = "Insufficient balance";
      isDisabled = true;
      return { text, isDisabled }; // Early return to avoid further checks
    }

    // Only check the route if the previous values are valid
    if (!Array.isArray(tokenSwap.route) || tokenSwap.route.length < 2) {
      text = "No route found";
      isDisabled = true;
    }

    return { text, isDisabled };
  }, [
    valueInputSwap.tokenIn,
    valueInputSwap.tokenOut,
    tokenSwap.tokenIn?.name,
    tokenSwap.tokenOut?.name,
    walletBalance.current,
    tokenSwap.route,
  ]);

  const wallet = useWalletStore();
  const balance = useObserveBalance(tokenSwap.tokenIn?.value, wallet.wallet);
  const balanceOut = useObserveBalance(
    tokenSwap.tokenOut?.value,
    wallet.wallet,
  );
  const handleChangeSlippage = (valueSlippage: number) => {
    setSlippage(valueSlippage);
  };

  const handleChangeInput = (type: string, event: any) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setValueInputSwap({
        ...valueInputSwap,
        [type]: value,
      });
    }
  };

  const routerPools = pools.map(([tokenA, tokenB]) => {
    const poolKey = PoolKey.fromTokenPair(
      TokenPair.from(TokenId.from(tokenA), TokenId.from(tokenB)),
    ).toBase58();

    const pool = useObservePool(poolKey);
    const balanceA = useObserveBalance(tokenA, poolKey);
    const balanceB = useObserveBalance(tokenB, poolKey);

    return {
      tokenA,
      tokenB,
      pool,
      balanceA,
      balanceB,
    };
  });

  const poolKey = useMemo(() => {
    if (!tokenSwap.tokenIn?.value || !tokenSwap.tokenOut?.value) return;
    return PoolKey.fromTokenPair(
      TokenPair.from(
        TokenId.from(tokenSwap.tokenIn.value),
        TokenId.from(tokenSwap.tokenOut.value),
      ),
    ).toBase58();
  }, [tokenSwap.tokenIn, tokenSwap.tokenOut]);

  const pool = useObservePool(poolKey ?? "0");
  const tokenAReserve = useObserveBalance(tokenSwap.tokenIn.value, poolKey);
  const tokenBReserve = useObserveBalance(tokenSwap.tokenOut.value, poolKey);

  useEffect(() => {
    if (!tokenSwap.tokenIn.value || !tokenSwap.tokenOut.value || pool?.loading)
      return;

    if (pool?.exists) {
      setTokenSwap({
        ...tokenSwap,
        route: [tokenSwap.tokenIn.value, tokenSwap.tokenOut.value],
      });
    } else {
      const currentRouterPools: [string, string][] = routerPools
        .filter((pool) => pool.pool?.exists)
        .map(({ tokenA, tokenB }) => [tokenA, tokenB]);

      try {
        const graph = prepareGraph(currentRouterPools);
        const distance = dijkstra(
          graph,
          tokenSwap.tokenIn.value,
          tokenSwap.tokenOut.value,
        );
        const route = distance?.path
          ? [tokenSwap.tokenIn.value, ...(distance?.path ?? [])]
          : [];

        console.log("route", route, distance?.path);
        setTokenSwap({
          ...tokenSwap,
          route: route,
        });
      } catch (e) {
        setTokenSwap({
          ...tokenSwap,
          route: [],
        });
      }
    }
  }, [tokenSwap.tokenIn.value, tokenSwap.tokenOut.value, pool]);

  useEffect(() => {
    walletBalance.current = balance ?? "0";
  }, [balance]);

  const balances = useBalancesStore();

  useEffect(() => {
    if (
      !tokenSwap.route.length ||
      valueInputSwap.tokenIn === "0" ||
      !valueInputSwap.tokenIn
    ) {
      setValueInputSwap({
        ...valueInputSwap,
        tokenOut: "0",
      });
    }

    let amountIn = valueInputSwap.tokenIn;
    let amountOut = "0";

    tokenSwap.route.forEach((token: any, index: number) => {
      const tokenIn = token;
      const tokenOut = tokenSwap.route[index + 1] ?? 99999; // MAX_TOKEN_ID
      const poolKey = PoolKey.fromTokenPair(
        TokenPair.from(TokenId.from(tokenIn), TokenId.from(tokenOut)),
      ).toBase58();
      const tokenInReserve = balances.balances[poolKey]?.[tokenIn];
      const tokenOutReserve = balances.balances[poolKey]?.[tokenOut];

      if (
        !tokenOutReserve ||
        !tokenInReserve ||
        tokenOutReserve === "0" ||
        tokenInReserve === "0"
      )
        return;

      // calculateAmountOut

      const intermediateAmountOut = new BigNumber(addPrecision(amountIn))
        .multipliedBy(tokenOutReserve)
        .div(new BigNumber(tokenInReserve).plus(addPrecision(amountIn)));

      // console.log(
      //   "intermediateAmountOut",
      //   removePrecision(intermediateAmountOut.toFixed(2)),
      // );

      const amountOutWithoutFee = intermediateAmountOut.minus(
        intermediateAmountOut.multipliedBy(3).dividedBy(100000),
      );

      amountOut = amountOutWithoutFee.toFixed(2);
      amountIn = removePrecision(amountOut);
    });

    if (new BigNumber(amountOut).isNaN()) return;
    setValueInputSwap({
      ...valueInputSwap,
      tokenOut: removePrecision(
        `${Number(amountOut)}`,
      ),
    });
  }, [
    tokenSwap.route,
    valueInputSwap.tokenIn,
    // valueInputSwap.tokenOut,
    balances.balances,
  ]);

  const unitPrice = useMemo(() => {
    if (
      !valueInputSwap.tokenIn ||
      !valueInputSwap.tokenOut ||
      valueInputSwap.tokenIn === "0" ||
      valueInputSwap.tokenOut === "0"
    )
      return;
    return new BigNumber(valueInputSwap.tokenOut)
      .dividedBy(valueInputSwap.tokenIn)
      .toFixed(2);
  }, [valueInputSwap.tokenIn, valueInputSwap.tokenOut]);

  const unitPriceWrapped = useMemo(() => {
    if (!unitPrice || !tokenSwap.tokenIn.value || !tokenSwap.tokenOut.value)
      return;
    return {
      tokenIn: tokens[tokenSwap.tokenIn.value]?.ticker,
      tokenOut: tokens[tokenSwap.tokenOut.value]?.ticker,
      unitPrice,
    };
  }, [unitPrice]);

  const sellPath = useSellPath();

  const handleSwap = async () => {
    setLoading(true);
    try {
      await sellPath(
        tokenSwap.route,
        addPrecision(valueInputSwap.tokenIn),
        // TODO add slippage
        addPrecision(`${Number(valueInputSwap.tokenOut) * (100 - slippage) / 100}`),
        { ...tokenSwap, ...valueInputSwap }
      );
    } finally {
      setLoading(false);
    }
  };

  const changeSwap = () => {
    // setTokenSwap({
    //   tokenIn: tokenSwap.tokenOut,
    //   tokenOut: tokenSwap.tokenIn,
    // });
  };
  return (
    <Dialog>
      <div
        className={`${styles["swap-container"]} ${type === "tokenDetail"
          ? `${styles["token-swap-container"]} ${styles["pc-swap-token"]}`
          : ""
          }`}
      >
        <span className={styles["swap-text"]}>Swap</span>
        <div
          className={`${styles["swap-content"]} ${type === "tokenDetail" ? styles["token-swap-content"] : ""
            }`}
        >
          <div
            className={`${styles["swap-container-form"]} ${type === "tokenDetail" ? styles["token-swap-form"] : ""
              }`}
          >
            <div
              className={`${styles["swap-content-item"]} ${styles["swap-item-first"]}`}
            >
              <span className={styles["swap-item-header"]}>You pay</span>
              <div className={styles["line-swap-item"]}></div>
              <div className={styles["swap-item-content"]}>
                <input
                  className={styles["swap-item-input"]}
                  type="text"
                  autoComplete="false"
                  placeholder="0"
                  id="input-first"
                  value={valueInputSwap.tokenIn}
                  onChange={(e) => handleChangeInput("tokenIn", e)}
                />
                <DialogTrigger>
                  <div
                    className={`${styles["swap-item-select"]} ${tokenSwap.tokenIn.name &&
                      styles["swap-item-select-have-token"]
                      }`}
                    onClick={() => setTypeOpenModal("tokenIn")}
                  >
                    {tokenSwap.tokenIn.name ? (
                      <>
                        <Image
                          src={tokenSwap.tokenIn.logo}
                          alt="logo"
                          width={24}
                          height={24}
                        />
                        <span>{tokenSwap.tokenIn.symbol}</span>
                      </>
                    ) : (
                      <span>Select</span>
                    )}
                    <Image
                      src={`/icon/drop-down-icon.svg`}
                      alt="logo"
                      width={20}
                      height={20}
                    />
                  </div>
                </DialogTrigger>
                {/* <USDBalance className="value-price" balance="" /> */}
                {/* {valueInputSwap.tokenIn && (
                  <span className="value-price">$932.85</span>
                )} */}
              </div>
              <div className={styles["swap-item-footer"]}>
                <span className={styles["swap-item-footer-text"]}>
                  Balance: <Balance balance={balance} />
                </span>
              </div>
            </div>
            <div className={styles["swap-button"]} onClick={() => changeSwap()}>
              <img src="/images/swap/swap-button-icon.svg" alt="swap-button" />
            </div>
            <div
              className={`${styles["swap-content-item"]} ${styles["swap-item-second"]}}`}
            >
              <span className={styles["swap-item-header"]}>You get</span>
              <div className={styles["line-swap-item"]}></div>
              <div className={styles["swap-item-content"]}>
                <input
                  className={styles["swap-item-input"]}
                  type="text"
                  autoComplete="false"
                  placeholder="0"
                  id="input-second"
                  value={valueInputSwap.tokenOut}
                  disabled
                //   onChange={(e) => handleChangeInput("tokenOut", e)}
                />
                <DialogTrigger>
                  <div
                    className={`${styles["swap-item-select"]} ${tokenSwap?.tokenOut?.name &&
                      styles["swap-item-select-have-token"]
                      }`}
                    onClick={() => setTypeOpenModal("tokenOut")}
                  >
                    {tokenSwap.tokenOut.name ? (
                      <>
                        <Image
                          src={tokenSwap.tokenOut.logo}
                          alt="logo"
                          width={24}
                          height={24}
                        />
                        <span>{tokenSwap.tokenOut.symbol}</span>
                      </>
                    ) : (
                      <span>Select</span>
                    )}
                    <Image
                      src={`/icon/drop-down-icon.svg`}
                      alt="logo"
                      width={20}
                      height={20}
                    />
                  </div>
                </DialogTrigger>
                {/* <USDBalance className={styles["value-price"]} balance="" /> */}
                {/* {valueInputSwap.tokenOut && (
                  <span className="value-price">$932.98</span>
                )} */}
              </div>
              <div className={styles["swap-item-footer"]}>
                <span className={styles["swap-item-footer-text"]}>
                  Balance: <Balance balance={balanceOut} />
                </span>
              </div>
            </div>
          </div>
          <Button
            loading={loading}
            disabled={renderButtonSwap.isDisabled}
            className={stylesButton["button-swap"]}
            style={{ marginTop: "-12px" }}
            onClick={() => handleSwap()}
          >
            <span>{renderButtonSwap.text}</span>
          </Button>
        </div>

        <div className={styles["slippage-container"]}>
          <div className={styles["slippage-head"]}>Slippage</div>
          {SLIPPAGE?.map((item, index) => (
            <div
              className={`${styles["slippage-item"]} ${item?.value === slippage ? styles["slippage-item-active"] : ""
                }`}
              onClick={() => handleChangeSlippage(item?.value)}
              data-slippage={item?.value}
              key={index}
            >
              {item?.label}
            </div>
          ))}
        </div>
        <Collapsible onOpenChange={setDetailsOpen}>
          {/* <div className="mt-4 flex justify-between">
              <div className="flex items-center">
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
              </div>
              <CollapsibleTrigger className="group flex flex-grow items-center text-right text-muted-foreground">
                <div className="flex flex-grow items-center justify-end">
                  <p className="text-lg text-textBlack">Show details</p>
                  {detailsOpen ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </CollapsibleTrigger>
            </div> */}
          <CollapsibleContent className="mt-3 grid gap-2">
            {/* <div className="flex justify-between text-sm">
                <p className="text-textBlack">Route</p>
                <div>
                  {tokenSwap.route && tokenSwap.route.length ? (
                    <>
                      {tokenSwap.route.map(
                        (token: string | number, i: number) => (
                          <span className="text-textBlack">
                            {tokens[token]?.ticker}
                            {tokenSwap.route.length - 1 !== i && (
                              <span className="mx-1 text-textBlack">
                                {"->"}
                              </span>
                            )}
                          </span>
                        ),
                      )}
                    </>
                  ) : (
                    <span className="text-textBlack">—</span>
                  )}
                </div>
              </div> */}
            {/* <div className="flex justify-between text-sm">
            <p className="text-muted-foreground">Spot price</p>
            <div className="flex">
              <p className={cn(GeistMono.className)}>1 MINA = 0.8 DAI</p>
              <p
                className={
                  (cn(GeistMono.className), "pl-1.5 text-muted-foreground")
                }
              >
                (<USDBalance />)
              </p>
            </div>
          </div> */}
            {/* <div className="flex justify-between text-sm">
            <p className="text-muted-foreground">Network cost</p>
            <div>🎉 Free</div>
          </div> */}
          </CollapsibleContent>
        </Collapsible>
        <DialogOverlay className={styles["bg-overlay"]} />
        <DialogContent className="modal-container bg-white px-[19.83px] pb-[33.88px] pt-[21.49px]">
          <ModalListToken
            tokenSelected={tokenSwap[typeOpenModal]}
            onClickToken={(token) => {
              const tmpToken = {
                ...token,
                name: token?.label,
                symbol: token?.label,
                logo: tokens[token?.value]?.logo,
              };
              setTokenSwap({ ...tokenSwap, [typeOpenModal]: tmpToken });
            }}
            dialogClose={true}
          />
        </DialogContent>
      </div>
    </Dialog>
  );
}
