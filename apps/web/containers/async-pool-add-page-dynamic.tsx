import dynamic from "next/dynamic";

export default dynamic(() => import("./async-pool-add-page"), {
  ssr: false,
});
