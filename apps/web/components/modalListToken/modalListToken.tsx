import Image from "next/image";
import React, { useState } from "react";
import '../style.css'
import { DialogClose } from "../ui/dialog";
import { LIST_TOKENS } from "@/tokens";
import styles from '../css/modalListToken.module.css'

const tokenOptions = Object.entries(LIST_TOKENS).map(([tokenId, token]) => ({
    label: token?.ticker,
    value: tokenId,
}));

export interface modalListTokenProps {
    tokenSelected: any,
    onClickToken: (token: any) => void,
    dialogClose: boolean
}


export function ModalListToken({ tokenSelected, onClickToken, dialogClose }: modalListTokenProps) {
    const [valueSearch, setValueSearch] = React.useState<string>("")
    return (
        <div className="h-max">
            <div className={styles["header-content-modal"]}>
                <span className={styles["header-text"]}>
                    Select a token
                </span>
                {dialogClose ? (
                    <DialogClose className="close">
                        <Image src="/images/swap/close-icon-modal.svg" alt="close" width={24} height={24} />
                    </DialogClose>
                ) : (
                    <div className="close">
                        <Image src="/images/swap/close-icon-modal.svg" alt="close" width={24} height={24} />
                    </div>
                )}
            </div>
            <div>
                <input className={styles["search-input"]} value={valueSearch} type="text" placeholder="Search tokens" onChange={(e) => setValueSearch(e.target.value)} />
            </div>
            <div className={styles["list-token-content"]}>
                <span className={styles["list-token-head"]}>Top Tokens</span>
                <div className={styles["line-list-token"]}></div>
                <div className={styles["list-token"]}>
                    {tokenOptions.filter((token) => token?.label?.toLowerCase().includes(valueSearch.toLowerCase())).map((token, index) => (
                        <>
                            {dialogClose ? (
                                <DialogClose>
                                    <div
                                        key={token.value}
                                        className={`${styles["list-token-item"]} ${(tokenSelected?.symbol === token.label || tokenSelected?.label === token.label) ? styles["list-token-item-active"] : ""}`}
                                        onClick={() => onClickToken(token)}
                                    >
                                        <div className={styles["list-token-item-content"]}>
                                            <div>
                                                <Image src={LIST_TOKENS[token.value]?.logo || ""} alt="token-1" width={40} height={40} />
                                            </div>
                                            <div className={styles["list-token-item-text"]}>
                                                <span className={styles["list-token-item-name"]}>{token.label}</span>
                                                {/* <span className="list-token-item-symbol">{token.symbol}</span> */}
                                            </div>
                                        </div>
                                    </div>
                                </DialogClose>
                            ) : (
                                <div
                                    key={token.value}
                                    className={`${styles["list-token-item"]} ${(tokenSelected?.symbol === token.label || tokenSelected?.label === token.label) ? styles["list-token-item-active"] : ""}`}
                                    onClick={() => onClickToken(token)}
                                >
                                    <div className={styles["list-token-item-content"]}>
                                        <div>
                                            <Image src={LIST_TOKENS[token.value]?.logo || ""} alt="token-1" width={40} height={40} />
                                        </div>
                                        <div className={styles["list-token-item-text"]}>
                                            <span className={styles["list-token-item-name"]}>{token.label}</span>
                                            {/* <span className="list-token-item-symbol">{token.symbol}</span> */}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ))}
                </div>
            </div>
        </div>
    );
}
