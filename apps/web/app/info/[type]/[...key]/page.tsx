"use client";
import AsyncInfoTokenDetailPageDynamic from "@/containers/async-info-token-detail-page-dynamic";
import AsyncInfoPoolDetailPageDynamic from "@/containers/async-info-pool-detail-page-dynamic";
import { usePathname } from "next/navigation";

export default function Page({
  params,
}: {
  params: { key: string; type: "tokens" | "pools" };
}) {
  const pathname = usePathname();

  if (params.type === "tokens") {
    return (
      <div key={pathname}>
        <AsyncInfoTokenDetailPageDynamic params={params} />
      </div>
    );
  }

  if (params.type === "pools") {
    return (
      <div key={pathname}>
        <AsyncInfoPoolDetailPageDynamic params={params} />
      </div>
    );
  }

  return null;
}

