import dynamic from "next/dynamic";

export default dynamic(() => import("./async-pool-page"), {
  ssr: false,
});
