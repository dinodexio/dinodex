import dynamic from "next/dynamic";

export default dynamic(() => import("./async-pool-join-page"), {
  ssr: false,
});
