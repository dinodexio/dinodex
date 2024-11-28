"use client";
import { InfoTokenLayout as InfoTokenLayoutComponent } from "@/components/detail/info-token-layout";

export default function InfoTokenDetail({ params }: { params?: any }) {
  return (
    <>
      <InfoTokenLayoutComponent params={params} />
    </>
  );
}
