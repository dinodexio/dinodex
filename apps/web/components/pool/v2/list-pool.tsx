import { useState } from "react";
import styles from "../../css/pool.module.css";
import stylesButton from "../../css/button.module.css";
import Image from "next/image";
import Link from "next/link";
import { EMPTY_DATA } from "@/constants";
import { Balance } from "../../ui/balance";
import { Card, CardHeader } from "@/components/ui/card";
import { Loader } from "@/components/ui/Loader";
import { useObservePooled } from "@/lib/stores/balances";
import { useRouter } from "next/navigation";
import { ImageCommon } from "@/components/common/ImageCommon";
import { useTokenStore } from "@/lib/stores/token";

export interface Balances {
  [tokenId: string]: string | undefined;
}
export interface ListPoolProps {
  balances?: Balances;
  loading: boolean;
  wallet?: string;
}

type PoolBalance = {
  [key: string]: any; // Define the structure of your pool balance if known
};

export function ListPool({ balances, loading, wallet }: ListPoolProps) {
  const { data: tokens, getTokenByTicker } = useTokenStore();
  const router = useRouter();
  const [activeItems, setActiveItems] = useState<any>([]);
  const [valueTicker, setValueTicker] = useState<any>(null);


  const toggleActiveItem = (item: any) => {
    if (activeItems.includes(item?.id)) {
      setActiveItems((prev: any) => prev.filter((i: any) => i !== item?.id));
      return;
    }
    setActiveItems([item?.id]);
    setValueTicker({
      first: item?.tokenSelectedPool?.first?.symbol,
      second: item?.tokenSelectedPool?.second?.symbol,
      balance: item?.balance,
    });
  };

  const handleActionPool = (type: string, isPooled: boolean = false) => {
    if (!valueTicker?.first || !valueTicker?.second || isPooled) {
      return router.push(`/${type}/${tokens["0"]?.ticker}`);
    }
    router.push(`/${type}/${valueTicker?.first}/${valueTicker?.second}`);
  };

  const dataPooled = useObservePooled(
    valueTicker?.first,
    valueTicker?.second,
    valueTicker?.balance,
    // wallet,
  );

  const poolBalances = Object.entries(balances ?? {}).map(
    ([tokenId, balance]) => {
      const token = tokens[tokenId];
      if (!token || (BigInt(tokenId) > BigInt(3) && balance === "0"))
        return null;

      if (token?.name === "LP Token") {
        // Split the ticker to get the symbols of the tokens in the pool
        const [firstTicker, secondTicker] = token.ticker.split("/");

        // Get the first and second tokens dynamically
        const firstToken = getTokenByTicker(firstTicker);
        const secondToken = getTokenByTicker(secondTicker);
        // const dataPooled = useObservePooled(firstTicker, secondTicker);
        // const poolOfShare = useObservePoolOfShare(wallet,)
        return {
          ...token,
          balance: balance ?? "0",
          type: "LPtoken",
          poolOfShare: "100",
          tokenSelectedPool: {
            first: {
              name: firstToken?.name,
              logo: firstToken?.logo,
              symbol: firstToken?.ticker,
              // balance: useObserveBalance(tokenA, poolKey),
            },
            second: {
              name: secondToken?.name,
              logo: secondToken?.logo,
              symbol: secondToken?.ticker,
              // balance: useObserveBalance(tokenB, poolKey),
            },
          },
          // feeTierValue: 1,
          // valueMinPrice: {
          //   first: 0.01,
          //   second: 0,
          // },
          // status_pool: 0,
        };
      } else {
        return null;
      }
    },
  );

  let dataPool: PoolBalance[] =
    poolBalances && poolBalances.length > 0
      ? poolBalances
        .filter((el: PoolBalance | null) => el !== null)
        ?.map((el: PoolBalance | null, index: number) => ({
          ...el,
          id: index + 1,
        }))
      : [];

  return (
    <>
      <Card className="border-transparent bg-transparent shadow-none">
        <Card
          className="relative h-max w-full rounded-[12px] border-none bg-transparent px-[18px] pb-5 pt-[18px] shadow-content sm:h-max lg:h-[139px] xl:h-[139px]"
          style={{
            marginBottom: 25,
            boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Image
            src={"/images/pool/bg-pool.svg"}
            alt="bg-pool"
            width={100}
            height={100}
            className="absolute bottom-0 left-0 right-0 top-0 rounded-[12px]"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="flex flex-col items-start justify-center gap-[4px] sm:gap-[4px] lg:gap-[12px] xl:gap-[15px]">
            <span
              className="z-10 text-[17px] font-[600] text-textBlack"
              style={{ fontSize: 17 }}
            >
              Liquidity provider rewards
            </span>
            <span
              className="z-10 text-[14px] font-[500] text-textBlack"
              style={{ lineHeight: 1, fontSize: 14 }}
            >
              Liquidity providers earn a 0.3% fee on all trades proportional to
              their share of the pool. Fees are added to the pool, accrue in
              real time and can be claimed by withdrawing your liquidity.
            </span>
            <Link
              href="/liquidity"
              className="z-10 text-[14px] font-[600] text-textBlack"
              style={{ textDecoration: "underline", fontSize: 14 }}
            >
              Read more about providing liquidity
            </Link>
          </div>
        </Card>
        <div
          className="flex flex-col items-center justify-between gap-[10px] sm:mt-[-10px] sm:flex-col sm:gap-[10px] lg:mt-0 lg:flex-row lg:gap-0 xl:mt-0 xl:flex-row xl:gap-0"
          style={{ marginBottom: 12 }}
        >
          <span className="text-[24px] font-[600] text-textBlack">
            Your Liquidity
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center rounded-[12px] disabled:cursor-not-allowed ${stylesButton["btn-pool"]}`}
              onClick={() => handleActionPool("add", true)}
            >
              <span>Create a Pair</span>
            </div>
            {/* <div
              className={`flex items-center justify-center rounded-[12px] border border-textBlack ${stylesButton["button-swap"]} ${stylesButton["btn-pool-active"]}`}
              onClick={() => handleActionPool("find")}
            >
              <span>Import Pool</span>
            </div> */}
            <div
              className={`flex items-center justify-center rounded-[12px] ${stylesButton["button-swap"]} ${stylesButton["btn-pool-active"]}`}
              onClick={() => handleActionPool("add", true)}
            >
              <span>Add liquidity</span>
            </div>
          </div>
        </div>
        {loading && dataPool?.length > 0 ? (
          <div className="flex items-center justify-center rounded-[12px] border border-textBlack pb-[15px] pt-[15px] text-[20px] font-[400] text-textBlack">
            <Loader w={6} h={6} />
          </div>
        ) : dataPool?.length === 0 ? (
          <div className="flex items-center justify-center rounded-[12px] border-none pb-[12px] pt-[12px] text-[16px] font-[400] text-textBlack shadow-content sm:pb-[12px] sm:pt-[12px] sm:text-[16px] lg:pb-[15px] lg:pt-[15px] lg:text-[20px] xl:pb-[15px] xl:pt-[15px] xl:text-[20px]">
            No liquidity found
          </div>
        ) : (
          <div style={{ height: "calc(50vh - 50px)", overflow: "auto", scrollbarWidth: "none",padding: "0 1px" }}>
            {dataPool?.map((item: any, index: number) => {
              const isActive = activeItems.includes(item.id);
              const toggleIconRotation = isActive
                ? "rotate(180deg)"
                : "rotate(0deg)";
              const poolFirstSymbol = item?.tokenSelectedPool?.first?.symbol;
              const poolSecondSymbol = item?.tokenSelectedPool?.second?.symbol;
              return (
                <Card
                  className={`${styles["pool-item"]} ${isActive ? styles["pool-item-active"] : ""} border-none`}
                  key={index}
                >
                  <CardHeader
                    className="flex w-full flex-row items-center justify-between p-0"
                    onClick={() => {
                      toggleActiveItem(item);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        <ImageCommon
                          src={item?.tokenSelectedPool?.first?.logo || ""}
                          className="h-[21px] w-[21px] sm:h-[21px] sm:w-[21px] lg:h-[25px] lg:w-[25px] xl:h-[25px] xl:w-[25px] rounded-[50%]"
                        />
                        <ImageCommon
                          src={item?.tokenSelectedPool?.second?.logo || ""}
                          style={{ marginLeft: "-11px" }}
                          className="h-[21px] w-[21px] rounded-[50%] sm:h-[21px] sm:w-[21px] lg:h-[25px] lg:w-[25px] xl:h-[25px] xl:w-[25px]"
                        />
                      </div>
                      <span className="lg:[20px] sm:[18px] text-[18px] font-[400] leading-none text-black opacity-75 xl:text-[20px]">
                        {item?.ticker}
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-1"
                      style={{ cursor: "pointer", margin: 0 }}
                    >
                      <span
                        className="lg:[16px] sm:[15px] text-[15px] font-[600] leading-none opacity-75 xl:text-[16px]"
                        style={{ color: "#FF603B" }}
                      >
                        Manage
                      </span>
                      <Image
                        src="/icon/icon-pool.svg"
                        width={18}
                        height={18}
                        alt="pool icon"
                        style={{
                          transform: toggleIconRotation,
                          transition: "transform 0.3s ease-in-out",
                        }}
                      />
                    </div>
                  </CardHeader>
                  <div
                    className={`${styles["content-pool-item"]} ${isActive ? styles["content-pool-item-show"] : ""}`}
                  >
                    <div className={styles["info-item"]}>
                      <div className={styles["info-content"]}>
                        <span className={styles["info-content-title"]}>
                          Your total pool tokens
                        </span>
                        <span className={styles["info-content-value"]}>
                          {" "}
                          <Balance balance={item?.balance} />
                        </span>
                      </div>
                      <div className={styles["info-content"]}>
                        <span className={styles["info-content-title"]}>
                          Pooled {poolFirstSymbol}
                        </span>
                        <span className={styles["info-content-value"]}>
                          <Balance
                            balance={
                              isActive ? String(dataPooled?.first) : undefined
                            }
                          />
                          <ImageCommon
                            src={item?.tokenSelectedPool?.first?.logo || ""}
                            width={18}
                            height={18}
                            alt="first pooled token logo"
                          />
                        </span>
                      </div>
                      <div className={styles["info-content"]}>
                        <span className={styles["info-content-title"]}>
                          Pooled {poolSecondSymbol}
                        </span>
                        <span className={styles["info-content-value"]}>
                          <Balance
                            balance={
                              isActive ? String(dataPooled?.second) : undefined
                            }
                          />
                          <ImageCommon
                            src={item?.tokenSelectedPool?.second?.logo || ''}
                            width={18}
                            height={18}
                            alt="second pooled token logo"
                          />
                        </span>
                      </div>
                      <div className={styles["info-content"]}>
                        <span className={styles["info-content-title"]}>
                          Your pool share
                        </span>
                        <span className={styles["info-content-value"]}>
                          {dataPooled?.poolOfShare || EMPTY_DATA} %
                        </span>
                      </div>
                      <div className={styles["info-content"]}>
                        <span className={styles["info-content-title"]}>
                          Accrued fees
                        </span>
                        <span className={styles["info-content-value"]}>
                          {"<0.1%"}
                        </span>
                      </div>
                    </div>
                    <div className={styles["content-item-button"]}>
                      <div
                        className={`${stylesButton["button-swap"]} ${stylesButton["btn-pool-info"]}`}
                        onClick={() => handleActionPool("add")}
                      >
                        <span>Add</span>
                      </div>
                      <div
                        className={`${stylesButton["button-swap"]} ${stylesButton["btn-pool-info"]}`}
                        onClick={() => handleActionPool("remove")}
                      >
                        <span>Remove</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>
    </>
  );
}
