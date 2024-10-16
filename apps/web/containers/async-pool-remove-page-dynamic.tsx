import dynamic from "next/dynamic";

export default dynamic(() => import("./async-pool-remove-page"), {
  ssr: false,
});
