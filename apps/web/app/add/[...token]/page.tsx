"use client";
import AsyncPoolAddPageDynamic from "@/containers/async-pool-add-page-dynamic";
import "reflect-metadata";

export default function Page({ params }: { params: any }) {
    return <AsyncPoolAddPageDynamic params={params} />;
  }