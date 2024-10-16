import Image from "next/image";
import React from "react";
import '../style.css'
import { DialogClose } from "../ui/dialog";

export interface modalPreviewPoolProps {
    dataPool: any,
    onClickAddPool: () => void
}


export function ModalPreviewPool({ dataPool,onClickAddPool }: modalPreviewPoolProps) {
    return (
        <div className="h-max w-full">
            <div className="flex items-center justify-center relative ">
                <span className="text-black text-[24px] font-[600]">Add Liquidity</span>
                <DialogClose className="absolute top-[-4px] right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd"
                            d="M9.01502 10.7131L15.9288 17.6269C16.1593 17.8495 16.468 17.9727 16.7885 17.9699C17.1089 17.9671 17.4154 17.8386 17.642 17.612C17.8686 17.3854 17.9972 17.0789 18 16.7584C18.0027 16.438 17.8796 16.1293 17.6569 15.8988L10.7432 8.98498L17.6569 2.07121C17.8796 1.84071 18.0027 1.53199 18 1.21154C17.9972 0.891095 17.8686 0.584562 17.642 0.357963C17.4154 0.131365 17.1089 0.0028308 16.7885 4.62009e-05C16.468 -0.0027384 16.1593 0.120449 15.9288 0.343075L9.01502 7.25685L2.10125 0.343075C1.86971 0.125952 1.56278 0.00742745 1.24541 0.012581C0.928031 0.0177346 0.625112 0.146162 0.400744 0.370689C0.176376 0.595215 0.0481627 0.898225 0.0432336 1.2156C0.0383046 1.53298 0.157046 1.83983 0.374333 2.07121L7.28688 8.98498L0.373111 15.8988C0.256382 16.0115 0.163276 16.1464 0.0992235 16.2955C0.0351712 16.4446 0.0014563 16.6049 4.61452e-05 16.7672C-0.00136401 16.9295 0.0295585 17.0904 0.0910099 17.2406C0.152461 17.3908 0.243211 17.5273 0.357963 17.642C0.472715 17.7568 0.609172 17.8475 0.759371 17.909C0.90957 17.9704 1.0705 18.0014 1.23278 18C1.39506 17.9985 1.55543 17.9648 1.70454 17.9008C1.85365 17.8367 1.98851 17.7436 2.10125 17.6269L9.01502 10.7131Z"
                            fill="black" />
                    </svg>
                </DialogClose>
            </div>
            <div className="flex flex-col gap-[15px] mt-[26px] mb-[15px]">
                <div className="content-modal-preview-header">
                    <div className="content-modal-preview-header-token">
                        <div className="content-modal-preview-header-token" style={{ gap: 0 }}>
                            <Image src={'/' + dataPool?.tokenPool?.first?.logo} width={26} height={26} alt="" />
                            <Image src={'/' + dataPool?.tokenPool?.second?.logo} width={26} height={26} alt="" style={{ marginLeft: '-11px' }} />
                        </div>
                        <span className="preview-header-text">{dataPool?.tokenPool?.first?.symbol}/{dataPool?.tokenPool?.second?.symbol}</span>
                    </div>
                    <div className="content-modal-preview-header-status">
                        <span className="preview-header-text">In Range</span>
                        <div className="preview-header-status-info status-in-range"></div>
                    </div>
                </div>
                <div className="content-preview-pool-token">
                    <div className="preview-pool-token-item">
                        <div className="preview-pool-token-item-info">
                            <Image src={'/' + dataPool?.tokenPool?.first?.logo} width={26} height={26} alt="" />
                            <span className="preview-header-text">{dataPool?.tokenPool?.first?.symbol}</span>
                        </div>
                        <span className="preview-header-text">{dataPool?.deposit_amount?.first}</span>
                    </div>
                    <div className="preview-pool-token-item">
                        <div className="preview-pool-token-item-info">
                            <Image src={'/' + dataPool?.tokenPool?.second?.logo} width={26} height={26} alt="" />
                            <span className="preview-header-text">{dataPool?.tokenPool?.second?.symbol}</span>
                        </div>
                        <span className="preview-header-text">{dataPool?.deposit_amount?.second}</span>
                    </div>
                    <div className="preview-pool-token-item">
                        <span className="preview-header-fee-tier-text">Fee Tier</span>
                        <span className="preview-header-fee-tier-text">{dataPool?.feeTier}%</span>
                    </div>
                </div>
                <div className="selected-range-content">
                    <span className="selected-range-content-header">
                        Selected Range
                    </span>
                    <div className="switch-select-range">
                        <div className="switch-select-range-item switch-select-range-item-active">{dataPool?.tokenPool?.first?.symbol}</div>
                        <div className="switch-select-range-item">{dataPool?.tokenPool?.second?.symbol}</div>
                    </div>
                </div>
                <div className="content-min-price">
                    <div className="content-min-price-item">
                        <span className="content-min-price-item-title">Min Price</span>
                        <span className="header-preview-pool-text">{dataPool?.valueMinPrice?.first < 0.001 ? `< 0.001` : dataPool?.valueMinPrice?.first}</span>
                        <span className="content-min-price-item-title">{dataPool?.tokenPool?.first?.symbol} per {dataPool?.tokenPool?.second?.symbol}</span>
                        <span className="content-min-price-item-desc">Your position will be 100% composed of ETH at this
                            price</span>
                    </div>
                    <div className="content-min-price-item">
                        <span className="content-min-price-item-title">Min Price</span>
                        <span className="header-preview-pool-text">{dataPool?.valueMinPrice?.second < 0.001 ? `< 0.001` : dataPool?.valueMinPrice?.second}</span>
                        <span className="content-min-price-item-title">{dataPool?.tokenPool?.first?.symbol} per {dataPool?.tokenPool?.second?.symbol}</span>
                        <span className="content-min-price-item-desc">Your position will be 100% composed of ETH at this
                            price</span>
                    </div>
                </div>
                <div className="flex py-[12px] px-[10px] flex-col items-center justify-center gap-[10px] border border-black w-full rounded-[21px]">
                    <span className="content-min-price-item-title">Current Price</span>
                    <span className="header-preview-pool-text">1.002</span>
                    <span className="content-min-price-item-title">ETH per WBTC</span>
                </div>
                <div className="button-swap btn-modal-preview-pool" onClick={() => onClickAddPool && onClickAddPool()}>
                    <span>Add</span>
                </div>
            </div>
        </div>
    );
}
