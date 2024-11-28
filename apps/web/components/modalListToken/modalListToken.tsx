import Image from "next/image";
import React, { forwardRef, useMemo } from "react";
import "../style.css";
import { DialogClose } from "../ui/dialog";
import { LIST_TOKENS } from "@/tokens";
import styles from "../css/modalListToken.module.css";
import { formatNumber, formatterInteger } from "@/lib/utils";
import { EMPTY_DATA } from "@/constants";
import BigNumber from "bignumber.js";
import { useWalletStore } from "@/lib/stores/wallet";
import { useBalancesStore } from "@/lib/stores/balances";
import { Balance } from "../ui/balance";
// import { cn } from "@/lib/utils";
// import { Input } from "../ui/input";

export interface modalListTokenProps {
  tokenSelected?: any;
  onClickToken: (token: any) => void;
  dialogClose: boolean;
}

function formatNumberPrecisionVol(value: any, isPrice: boolean = false) {
  if (!value) return EMPTY_DATA;

  const priceResult = formatNumber(BigNumber(value).toNumber());
  return `${
    priceResult == "<0.01"
      ? isPrice
        ? "< $0.01"
        : priceResult
      : isPrice
        ? `$${priceResult}`
        : priceResult
  }`;
}

export const ModalListToken = ({ tokenSelected, onClickToken, dialogClose }: modalListTokenProps) => {
  const {
    wallet,
  } = useWalletStore();
  const {
    balances
  } = useBalancesStore();
  const ownBalances = wallet ? balances[wallet] : {};

  const tokenOptions = useMemo(() => {
    let list_token = Object.entries(LIST_TOKENS).map(([tokenId, token]) => ({
      label: token?.name,
      ticker: token?.ticker,
      value: tokenId,
      price:1000000,
      balance: ownBalances[tokenId] || 0,
    })) 
    console.log('list_token',list_token)
    return list_token
  },[LIST_TOKENS,ownBalances])
  const [valueSearch, setValueSearch] = React.useState<string>("");
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
          className={`${styles["search-input"]} text-textBlack border-none outline-none`}
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
                      className={`${styles["list-token-item"]} ${tokenSelected?.symbol === token.label ||
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
                          <Image
                            src={LIST_TOKENS[token.value]?.logo || ""}
                            alt="token-1"
                            width={50}
                            height={50}
                          />
                          <Image src="/icon/logo-dino.svg" alt="check" width={18} height={18} className="absolute bottom-0 right-0"/>
                        </div>
                        <div className={styles["list-token-item-text"]}>
                          <span className={styles["list-token-item-name"]}>
                            {token.label}
                          </span>
                          <span className={styles["list-token-item-symbol"]}>{token.ticker}</span>
                        </div>
                      </div>
                      <div className={styles["list-token-item-text"]} style={{ alignItems: "end" }}>
                        <span className={styles["list-token-item-name"]}>
                          {Number(token.price) > 9999999
                            ? formatNumberPrecisionVol(token.price, false)
                            : formatterInteger(token.price)}$
                        </span>
                        <span className={styles["list-token-item-symbol"]}><Balance balance={String(token?.balance)} /></span>
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
                        <Image
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
                        <span className={styles["list-token-item-symbol"]}>{token.ticker}</span>
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
}