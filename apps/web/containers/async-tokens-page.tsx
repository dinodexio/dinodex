"use client";

import { Token as TokenComponent } from "@/components/token";
// import { ChartToken as ChartTokenComponent } from "@/components/token/chart-token";
// import { FilterSort } from "@/components/token/filter-sort";
// import { PoolPanel } from "@/components/token/pool-panel";
// import { TokenPanel } from "@/components/token/token-panel";
// import { TransactionPanel } from "@/components/token/transaction-panel";
import { useBalancesStore } from "@/lib/stores/balances";
import { useClientStore } from "@/lib/stores/client";
import { useWalletStore } from "@/lib/stores/wallet";
import React, { useEffect } from "react";

import dynamic from "next/dynamic";
import { Loader } from "@/components/ui/Loader";
import { useRouter } from "next/navigation";

// Import the component using the actual named export
// const TokenPanel = dynamic(
//   () => import("@/components/token/token-panel").then((mod) => mod.TokenPanel),
//   {
//     ssr: false,
//     loading: () => {
//       return (
//         <div className="flex items-center justify-center py-10">
//           <Loader />
//         </div>
//       );
//     },
//   },
// );
// const PoolPanel = dynamic(
//   () => import("@/components/token/pool-panel").then((mod) => mod.PoolPanel),
//   {
//     ssr: false,
//     loading: () => {
//       return (
//         <div className="flex items-center justify-center py-10">
//           <Loader />
//         </div>
//       );
//     },
//   },
// );
// const TransactionPanel = dynamic(
//   () =>
//     import("@/components/token/transaction-panel").then(
//       (mod) => mod.TransactionPanel,
//     ),
//   {
//     ssr: false,
//     loading: () => {
//       return (
//         <div className="flex items-center justify-center py-10">
//           <Loader />
//         </div>
//       );
//     },
//   },
// );
// const FilterSort = dynamic(
//   () => import("@/components/token/filter-sort").then((mod) => mod.FilterSort),
//   { ssr: false },
// );
// const ChartTokenComponent = dynamic(
//   () => import("@/components/token/chart-token").then((mod) => mod.ChartToken),
//   {
//     ssr: false,
//     loading: () => {
//       return (
//         <div className="flex items-center justify-center py-10">
//           <Loader />
//         </div>
//       );
//     },
//   },
// );

export default function Token() {
  return (
    <>
      {/* <TokenComponent /> */}
    </>
  );
}