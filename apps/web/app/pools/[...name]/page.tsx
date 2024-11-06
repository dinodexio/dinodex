"use client";

// import { SwapForm } from "@/containers/xyk/swap-form";
import { InfoLayout } from "@/components/detail/info-token-layout";
import { ChartToken } from "@/components/token/chart-token";

export default function Page({ params }: { params: { name: string } }) {
  return (
    <div>
      My Pool: {params.name}
      <div className="flex items-center justify-center">
        <span>Pool  Detail</span>
        {/* <SwapForm /> */}
        <ChartToken type="token" />
        <InfoLayout type="token" params={params} />
      </div>

    </div>
  )

}

