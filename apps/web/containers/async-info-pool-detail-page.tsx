"use client";

import { InfoPoolLayout as InfoPoolLayoutComponent } from "@/components/detail/info-pool-layout";

export default function InfoPoolDetail({ params }: { params?: any }) {
  return (
    <>
      <InfoPoolLayoutComponent params={params} />
    </>
  );
}
