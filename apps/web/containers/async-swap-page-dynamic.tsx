'use client'
import dynamic from "next/dynamic";

export default dynamic(() => import("./async-swap-page"), {
  ssr: false,
});
