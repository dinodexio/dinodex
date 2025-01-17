import { Loader } from "@/components/ui/Loader";
import dynamic from "next/dynamic";

export default dynamic(() => import("./async-transaction-detail"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Loader />
    </div>
  ),
});
