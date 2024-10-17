import { DATA_TOKENS } from "@/constants";
import Image from "next/image";
import React from "react";
import '../style.css'
import { DialogClose } from "../ui/dialog";
import { tokens } from "@/tokens";

const tokenOptions = Object.entries(tokens).map(([tokenId, token]) => ({
    label: token?.ticker,
    value: tokenId,
  }));

export interface modalListTokenProps {
    tokenSelected: any,
    onClickToken: (token: any) => void
}


export function ModalListToken({ tokenSelected, onClickToken }: modalListTokenProps) {
    const [valueSearch, setValueSearch] = React.useState<string>("")
    return (
        <div className="h-max">
            <div className="header-content-modal">
                <span className="header-text">
                    Select a token
                </span>
                <div className="close">
                    <Image src="/images/swap/close-icon-modal.svg" alt="close" width={24} height={24} />
                </div>
            </div>
            <div className="search-container">
                <input className="search-input" type="text" placeholder="Search tokens" onChange={(e) => setValueSearch(e.target.value)} />
            </div>
            <div className="list-token-content">
                <span className="list-token-head">Top Tokens</span>
                <div className="line-list-token"></div>
                <div className="list-token">
                    {tokenOptions.filter((token) => token?.label?.toLowerCase().includes(valueSearch.toLowerCase())).map((token, index) => (
                        <DialogClose>
                            <div
                                key={token.value}
                                className={`list-token-item ${tokenSelected?.symbol === token.label ? "list-token-item-active" : ""}`}
                                onClick={() => onClickToken(token)}
                            >
                                <div className="list-token-item-content">
                                    <div className="list-token-item-logo">
                                        <Image src={tokens[token.value]?.logo || ""} alt="token-1" width={40} height={40} />
                                    </div>
                                    <div className="list-token-item-text">
                                        <span className="list-token-item-name">{token.label}</span>
                                        {/* <span className="list-token-item-symbol">{token.symbol}</span> */}
                                    </div>
                                </div>
                            </div>
                        </DialogClose>
                    ))}
                </div>
            </div>
        </div>
    );
}
