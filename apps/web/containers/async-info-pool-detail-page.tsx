"use client";

import { InfoPoolLayout as InfoPoolLayoutComponent } from "@/components/detail/info-pool-layout";
import { usePathname } from "next/navigation";

export default function InfoPoolDetail({ params }: { params?: any }) {
  const pathname = usePathname();
  return (
    <>
      <InfoPoolLayoutComponent key={pathname} params={params} />
    </>
  );
}
