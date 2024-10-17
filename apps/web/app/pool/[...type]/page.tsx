"use client";
import "reflect-metadata";
import AsyncPoolAddPageDynamic from "@/containers/async-pool-add-page-dynamic";
import AsyncPoolJoinPageDynamic from "@/containers/async-pool-join-page-dynamic";

export default function Pool({ params }: { params: { type: string } }) {
  return (
    <>
      {params.type[0] === "create" ? (
        <AsyncPoolAddPageDynamic params={params} />
      ) : params.type[0] === "join" ? (
        <AsyncPoolJoinPageDynamic />
      ) : null}
    </>
  );
}
