import { Loader } from "@/components/ui/Loader";
import dynamic from "next/dynamic";

export default dynamic(() => import("./async-info-pool-detail-page"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Loader />
    </div>
  ),
});
