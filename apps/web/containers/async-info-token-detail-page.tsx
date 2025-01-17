"use client";
import { InfoTokenLayout as InfoTokenLayoutComponent } from "@/components/detail/info-token-layout";
import { usePathname } from "next/navigation";

export default function InfoTokenDetail({ params }: { params?: any }) {
  const pathname = usePathname()
  return (
    <>
      <InfoTokenLayoutComponent key={pathname} params={params} />
    </>
  );
}
