"use client";

import { SwapForm as SwapFormComponenet } from "@/components/swap";
import { Swap as SwapComponent } from "@/components/swap/swap";

export default function Swap() {
  return (
    <>
      <SwapFormComponenet
        swapForm={<SwapComponent type="tokenIn" token="" />}
      />
    </>
  );
}
