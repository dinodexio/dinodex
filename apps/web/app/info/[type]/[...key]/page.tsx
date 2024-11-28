"use client";
import AsyncInfoTokenDetailPageDynamic from "@/containers/async-info-token-detail-page-dynamic";
import AsyncInfoPoolDetailPageDynamic from "@/containers/async-info-pool-detail-page-dynamic";
import "reflect-metadata";

export default function Page({
  params,
}: {
  params: { key: string; type: string };
}) {
  return (
    <>
      {params?.type === "tokens" && (
        <AsyncInfoTokenDetailPageDynamic params={params} />
      )}
      {params?.type === "pools" && (
        <AsyncInfoPoolDetailPageDynamic params={params} />
      )}
    </>
  );
}
