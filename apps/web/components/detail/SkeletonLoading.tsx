import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
export interface SkeletonLoadingProps {
    width?: number;
    height?: number;
    className?: string;
    loading: boolean;
}

export function SkeletonLoading({ width, height, className,loading }: SkeletonLoadingProps) {
    
    return (
        <Skeleton loading={loading} className={cn("bg-[rgba(0,0,0,0.25)] rounded-[12px]", className)} style={{width: width, height: height}}/>
    );
}
