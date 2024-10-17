'use client'
import dynamic from "next/dynamic";

export default dynamic(() => import("./async-tokens-page"), {
  ssr: false,
});
