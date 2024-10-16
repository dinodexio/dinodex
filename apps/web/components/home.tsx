"use client";
import { useRouter, usePathname } from "next/navigation";
import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";

export interface HomeProps {
}

export function Home({  }: HomeProps) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="flex items-center justify-center">
      <Toaster />
      <div className="flex flex-col w-full px-[16px] pt-8 xl:px-[41px] xl:pt-8 lg:px-[32px] sm:px-[16px]">
        <Header />
      </div>
    </div>
  );
}
