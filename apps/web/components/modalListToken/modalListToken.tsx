import Image from "next/image";
import React, { useEffect, useMemo } from "react";
import "../style.css";
import { Dialog, DialogClose } from "../ui/dialog";
import { Tokens } from "@/tokens";
import styles from "../css/modalListToken.module.css";
import { formatPriceUSD } from "@/lib/utils";
import { useWalletStore } from "@/lib/stores/wallet";
import { useBalancesStore } from "@/lib/stores/balances";
import { Balance, precision } from "../ui/balance";
import { USDBalance } from "../ui/usd-balance";
import { useAggregatorStore } from "@/lib/stores/aggregator";
import BigNumber from "bignumber.js";
import { ImageCommon } from "../common/ImageCommon";
import { useTokenStore } from "@/lib/stores/token";
// import { cn } from "@/lib/utils";
// import { Input } from "../ui/input";

export interface modalListTokenProps {
  tokenSelected?: any;
  onClickToken: (token: any) => void;
  dialogClose: boolean;
  listTokens?: Tokens;
}

export const ModalListToken = ({
  tokenSelected,
  onClickToken,
  dialogClose,
  listTokens,
}: modalListTokenProps) => {
  const { base: LIST_TOKENS } = useTokenStore();
  const { wallet } = useWalletStore();
  const { balances } = useBalancesStore();
  const { tokens, loadTokens } = useAggregatorStore();
  const ownBalances = wallet ? balances[wallet] : {};

  const tokenOptions = useMemo(() => {
    let list_token = Object.entries(listTokens ? listTokens : LIST_TOKENS).map(
      ([tokenId, token]) => ({
        label: token?.name,
        ticker: token?.ticker,
        value: tokenId,
        price: tokens ? tokens.find((t) => t.id === tokenId)?.price : "--",
        balance: ownBalances ? ownBalances[tokenId] : 0,
      }),
    );
    return list_token;
  }, [LIST_TOKENS, ownBalances, tokens]);
  const [valueSearch, setValueSearch] = React.useState<string>("");

  useEffect(() => {
    if (!tokens || tokens.length === 0) {
      loadTokens();
    }
  }, [JSON.stringify(tokens)]);
  return (
    <div className="h-max">
      <div className={styles["header-content-modal"]}>
        <span className={styles["header-text"]}>Select a token</span>
        {dialogClose ? (
          <DialogClose className="close">
            <Image
              src="/images/swap/close-icon-modal.svg"
              alt="close"
              width={24}
              height={24}
            />
          </DialogClose>
        ) : (
          <div className="close">
            <Image
              src="/images/swap/close-icon-modal.svg"
              alt="close"
              width={24}
              height={24}
            />
          </div>
        )}
      </div>
      <div>
        <input
          className={`${styles["search-input"]} border-none text-textBlack outline-none`}
          value={valueSearch}
          type="text"
          placeholder="Search tokens"
          onChange={(e) => setValueSearch(e.target.value)}
        />
      </div>
      <div className={styles["list-token-content"]}>
        <span className={styles["list-token-head"]}>Top Tokens</span>
        <div className={styles["line-list-token"]}></div>
        <div className={styles["list-token"]}>
          {tokenOptions
            .filter((token) =>
              token?.label?.toLowerCase().includes(valueSearch.toLowerCase()),
            )
            .map((token, index) => (
              <React.Fragment key={token.value}>
                {dialogClose ? (
                  <DialogClose>
                    <div
                      className={`${styles["list-token-item"]} ${
                        tokenSelected?.symbol === token.label ||
                        tokenSelected?.ticker === token.label ||
                        tokenSelected?.label === token.label ||
                        tokenSelected?.name === token.label
                          ? styles["list-token-item-active"]
                          : ""
                      }`}
                      onClick={() => onClickToken(token)}
                    >
                      <div className={styles["list-token-item-content"]}>
                        <div className="relative">
                          <ImageCommon
                            src={LIST_TOKENS[token.value]?.logo || ""}
                            width={50}
                            height={50}
                            style={{ borderRadius: 50 / 2 }}
                          />
                          <Image
                            src="/icon/logo-dino.svg"
                            alt="check"
                            width={18}
                            height={18}
                            className="absolute bottom-0 right-0"
                          />
                        </div>
                        <div className={styles["list-token-item-text"]}>
                          <span className={styles["list-token-item-name"]}>
                            {token.label}
                          </span>
                          <span className={styles["list-token-item-symbol"]}>
                            {token.ticker}
                          </span>
                        </div>
                      </div>
                      <div
                        className={styles["list-token-item-text"]}
                        style={{ alignItems: "end" }}
                      >
                        <USDBalance
                          className={styles["list-token-item-name"]}
                          balance={formatPriceUSD(
                            BigNumber(token?.balance || "~")
                              .div(10 ** precision)
                              .toFixed(2)
                              .toString(),
                            token?.ticker || "",
                            token?.price || "~",
                          )}
                          type="USD"
                        />
                        <span className={styles["list-token-item-symbol"]}>
                          <Balance balance={String(token?.balance)} formatInteger={true}/>
                        </span>
                      </div>
                    </div>
                  </DialogClose>
                ) : (
                  <div
                    className={`${styles["list-token-item"]} ${tokenSelected?.symbol || tokenSelected.ticker === token.label || tokenSelected?.label || tokenSelected.name === token.label ? styles["list-token-item-active"] : ""}`}
                    onClick={() => onClickToken(token)}
                  >
                    <div className={styles["list-token-item-content"]}>
                      <div>
                        <img
                          src={LIST_TOKENS[token.value]?.logo || ""}
                          alt="token-1"
                          width={50}
                          height={50}
                        />
                      </div>
                      <div className={styles["list-token-item-text"]}>
                        <span className={styles["list-token-item-name"]}>
                          {token.label}
                        </span>
                        <span className={styles["list-token-item-symbol"]}>
                          {token.ticker}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
};
