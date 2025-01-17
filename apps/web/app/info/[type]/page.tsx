"use client";
import "reflect-metadata";
import AsyncInfoPageDynamic from "@/containers/async-info-page-dynamic";
import { usePathname } from "next/navigation";

export default function Info({ params }: { params: any }) {
  const pathname = usePathname();
  return <AsyncInfoPageDynamic key={pathname} param={params} />;
}
