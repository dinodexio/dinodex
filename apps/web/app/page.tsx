// "use client";
// import "reflect-metadata";
// import AsyncPageDynamic from "@/containers/async-page-dynamic";

// export default function Home() {
//   return <AsyncPageDynamic />;
// }

"use client";
import AsyncSwapPageDynamic from "@/containers/async-swap-page-dynamic";
import "reflect-metadata";

export default function Swap() {
  return <AsyncSwapPageDynamic isDetail={false} />;
}
