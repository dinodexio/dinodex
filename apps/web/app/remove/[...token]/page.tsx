"use client";
import AsyncPoolRemovePageDynamic from "@/containers/async-pool-remove-page-dynamic";
import "reflect-metadata";

export default function Page({ params }: { params: any }) {
    return <AsyncPoolRemovePageDynamic params={params} />;
  }