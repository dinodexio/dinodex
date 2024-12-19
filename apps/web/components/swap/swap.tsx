import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../css/swap.module.css";
import stylesModal from "../css/modal.module.css";
import stylesButton from "../css/button.module.css";
import { SLIPPAGE } from "@/constants";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
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
import {
  useBalance,
  useBalancesStore,
  useObserveBalancePool,
} from "@/lib/stores/balances";
import { client, dijkstra, PoolKey, prepareGraph, TokenPair } from "chain";
import { TokenId } from "@proto-kit/library";
import { useObservePool, useSellPath } from "@/lib/stores/xyk";
import { Balance } from "../ui/balance";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { USDBalance } from "../ui/usd-balance";
import { cn } from "@/lib/utils";
import useClickOutside from "@/hook/useClickOutside";
import { dataSubmitProps } from "@/types";

export interface SwapProps {
  token: any;
  type: string;
}

// Define interfaces for the structures used in state
interface TokenDetails {
  name: string | null;
  symbol: string | null;
  logo: string | null;
  value: string | undefined;
}

interface TokenSwapState {
  tokenIn: TokenDetails;
  tokenOut: TokenDetails;
  route: string[];
}

interface ValueInputSwapState {
  tokenIn: string | null;
  tokenOut: string | null;
}

const INIT_SLIPPAGE = 0.2;

// const pools = generatePools();

export function Swap({ token, type }: SwapProps) {
  const [loading, setLoading] = useState(false);
  const walletBalance = useRef("0");
  const [tokenSwap, setTokenSwap] = useState<TokenSwapState>({
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

  const [valueInputSwap, setValueInputSwap] = useState<ValueInputSwapState>({
    tokenIn: null,
    tokenOut: null,
  });

  const [slippage, setSlippage] = useState<number>(INIT_SLIPPAGE);

  const [inputSlippage, setInputSlippage] = useState<string>("");

  const [typeOpenModal, setTypeOpenModal] = useState<string>("tokenIn");

  const [openSetting, setOpenSetting] = useState(false);
  const [valueSlippage, setValueSlippage] = useState<any>(1.01);
  const [valueTD, setValueTD] = useState<any>(30);

  const settingRef = useClickOutside<HTMLDivElement>(() => {
    setOpenSetting(false);
  });

  const renderButtonSwap = useMemo(() => {
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
  const balance = useBalance(tokenSwap.tokenIn?.value, wallet.wallet);
  const balanceOut = useBalance(tokenSwap.tokenOut?.value, wallet.wallet);

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
    const balanceA = useObserveBalancePool(tokenA, poolKey);
    const balanceB = useObserveBalancePool(tokenB, poolKey);

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
  // const tokenAReserve = useObserveBalance(tokenSwap.tokenIn.value, poolKey);
  // const tokenBReserve = useObserveBalance(tokenSwap.tokenOut.value, poolKey);

  const handleSelectedPool = (token: any) => {
    const tmpToken = {
      ...token,
      name: token?.label,
      symbol: token?.label,
      logo: tokens[token?.value]?.logo,
    };
    const newTokenSwap = { ...tokenSwap, [typeOpenModal]: tmpToken };
    setTokenSwap(newTokenSwap);

    // TODO after api pools then remove code
    if (newTokenSwap.tokenIn.value && newTokenSwap.tokenOut.value) {
      const poolKey = PoolKey.fromTokenPair(
        TokenPair.from(
          TokenId.from(newTokenSwap.tokenIn.value),
          TokenId.from(newTokenSwap.tokenOut.value),
        ),
      ).toBase58();
      balances.loadBalance(client, newTokenSwap.tokenIn.value, poolKey);
      balances.loadBalance(client, newTokenSwap.tokenOut.value, poolKey);
    }
  };

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

      const intermediateAmountOut = new BigNumber(addPrecision(amountIn || "0"))
        .multipliedBy(tokenOutReserve)
        .div(new BigNumber(tokenInReserve).plus(addPrecision(amountIn || "0")));
      const amountOutWithoutFee = intermediateAmountOut.minus(
        intermediateAmountOut.multipliedBy(3).dividedBy(100000),
      );

      amountOut = amountOutWithoutFee.toFixed(2);
      amountIn = removePrecision(amountOut);
    });
    if (new BigNumber(amountOut).isNaN()) return;
    setValueInputSwap({
      ...valueInputSwap,
      tokenOut: removePrecision(`${Number(amountOut)}`),
    });
  }, [
    JSON.stringify(tokenSwap.route),
    valueInputSwap.tokenIn,
    // valueInputSwap.tokenOut,
    JSON.stringify(balances.balances),
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
    const data: dataSubmitProps = {
      logoA: tokenSwap.tokenIn?.logo || "",
      logoB: tokenSwap.tokenOut?.logo || "",
      tickerA: tokenSwap.tokenIn?.symbol || "",
      tickerB: tokenSwap.tokenOut?.symbol || "",
      amountA: valueInputSwap.tokenIn || "0",
      amountB: `${(Number(valueInputSwap.tokenOut) * (100 - slippage)) / 100}`,
    };
    try {
      await sellPath(
        tokenSwap.route,
        addPrecision(valueInputSwap.tokenIn || "0"),
        // TODO add slippage
        addPrecision(
          `${(Number(valueInputSwap.tokenOut) * (100 - slippage)) / 100}`,
        ),
        data,
      ).then(() => {
        setValueInputSwap({
          ...valueInputSwap,
          tokenIn: "0",
        });
      });
    } finally {
      setLoading(false);
    }
  };

  const changeSwap = () => {
    setTokenSwap((prevTokenSwap) => ({
      ...prevTokenSwap,
      tokenIn: prevTokenSwap.tokenOut,
      tokenOut: prevTokenSwap.tokenIn,
    }));

    setValueInputSwap((prevValueInputSwap) => ({
      tokenIn: prevValueInputSwap.tokenOut,
      tokenOut: prevValueInputSwap.tokenIn,
    }));
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
            <span className="text-[18px] font-[400] text-textBlack opacity-60">
              0.5%
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
              className={`${type === "tokenDetail" ? styles["popup-setting-token"] : ""} ${styles["popup-setting"]} ${openSetting ? styles["popup-setting-open"] : ""}`}
            >
              <span className="text-center text-[28px] font-[500] text-textBlack">
                Swap setting
              </span>
              <div className="flex w-full items-center justify-between">
                <span className="text-[24px] font-[400] text-textBlack">
                  Max Slippage
                </span>
                <div className="flex items-center gap-[12px] rounded-[12px] bg-[#EBEBEB] pr-[12px] shadow-content">
                  <div
                    className="flex items-center justify-center rounded-[12px] bg-bgWhiteColor px-3 py-[6px] text-[20px] font-[400] text-textBlack shadow-content"
                    onClick={() => setValueSlippage("0.5")}
                  >
                    Auto
                  </div>
                  <div className="flex items-center gap-[2px]">
                    <input
                      className="padding-0 mr-[2px] h-full border-none bg-transparent text-[20px] font-[400] text-textBlack opacity-50 outline-none"
                      value={valueSlippage}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value) || value === "") {
                          setValueSlippage(value);
                        }
                      }}
                      style={{
                        width: `${valueSlippage.toString().length * 10 + 2}px`,
                        maxWidth: "40px",
                      }}
                    />
                    <span className="text-[20px] font-[400] text-textBlack opacity-50 ">
                      %
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <span className="text-[24px] font-[400] text-textBlack">
                  Transaction deadline
                </span>
                <div
                  className="flex items-center gap-[2px] rounded-[18.118px] bg-bgWhiteColor px-[18px] py-[6px]"
                  style={{
                    boxShadow: "0px 1px 4px 0px rgba(26, 26, 26, 0.30) inset",
                  }}
                >
                  <input
                    className="padding-0 h-full border-none bg-transparent text-[20px] font-[500] text-textBlack outline-none"
                    value={valueTD}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value) || value === "") {
                        setValueTD(value);
                      }
                    }}
                    style={{
                      width: `${valueTD.toString().length * 10 + 5}px`,
                      maxWidth: "50px",
                    }}
                  />
                  <span className="text-[20px] font-[400] text-textBlack opacity-50">
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
                <input
                  className={styles["swap-item-input"]}
                  type="text"
                  autoComplete="false"
                  placeholder="0"
                  id="input-first"
                  value={valueInputSwap.tokenIn || ""}
                  onChange={(e) => handleChangeInput("tokenIn", e)}
                />
                <DialogTrigger>
                  <div
                    className={`${styles["swap-item-select"]} ${
                      tokenSwap.tokenIn.name &&
                      styles["swap-item-select-have-token"]
                    }`}
                    onClick={() => setTypeOpenModal("tokenIn")}
                  >
                    {tokenSwap.tokenIn.name ? (
                      <>
                        <Image
                          src={tokenSwap.tokenIn.logo || ""}
                          alt="logo"
                          width={24}
                          height={24}
                        />
                        <span style={{ fontWeight: 400 }}>
                          {tokenSwap.tokenIn.symbol}
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
                  Balance: <Balance balance={balance} />
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
                <input
                  className={styles["swap-item-input"]}
                  type="text"
                  autoComplete="false"
                  placeholder="0"
                  id="input-second"
                  value={valueInputSwap.tokenOut || ""}
                  disabled
                  //   onChange={(e) => handleChangeInput("tokenOut", e)}
                />
                <DialogTrigger>
                  <div
                    className={`${styles["swap-item-select"]} ${
                      tokenSwap?.tokenOut?.name &&
                      styles["swap-item-select-have-token"]
                    }`}
                    onClick={() => setTypeOpenModal("tokenOut")}
                  >
                    {tokenSwap.tokenOut.name ? (
                      <>
                        <Image
                          src={tokenSwap.tokenOut.logo || ""}
                          alt="logo"
                          width={24}
                          height={24}
                        />
                        <span style={{ fontWeight: 400 }}>
                          {tokenSwap.tokenOut.symbol}
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
            className={`${stylesButton["button-swap"]} ${type === "tokenDetail" && stylesButton["button-swap-token-detail"]}`}
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
              className={`${styles["slippage-item"]} ${
                item?.value === slippage ? styles["slippage-item-active"] : ""
              }`}
              onClick={() => handleChangeSlippage(item?.value)}
              data-slippage={item?.value}
              key={index}
            >
              {item?.label}
            </div>
          ))}
          <div className={`${styles["slippage-head"]} flex items-center`}>
            <input
              className={`${styles["slippage-input-custom"]} outline-none`}
              placeholder="0.1"
              value={inputSlippage}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value) || value === "") {
                  setInputSlippage(value);
                  setSlippage(Number(value));
                }
              }}
            />
            <span
              className={`ml-[-10px] ${inputSlippage === "" ? "opacity-30" : "opacity-100"}`}
            >
              %
            </span>
          </div>
        </div>
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
          className={`${stylesModal["modal-container"]} bg-white px-[20px] pb-[15px] pt-[20px]`}
        >
          <DialogHeader>
            <DialogTitle />
            <DialogDescription />
          </DialogHeader>
          <ModalListToken
            tokenSelected={tokenSwap[typeOpenModal as keyof TokenSwapState]}
            onClickToken={handleSelectedPool}
            dialogClose={true}
          />
        </DialogContent>
      </div>
    </Dialog>
  );
}
