"use client";
import "reflect-metadata";
import AsyncInfoPageDynamic from "@/containers/async-info-page-dynamic";

export default function Info({ params }: { params: any }) {
  return <AsyncInfoPageDynamic param={params} />;
}
