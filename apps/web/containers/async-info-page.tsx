"use client";

import { Token as TokenComponent } from "@/components/token";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Info({ param }: { param: string }) {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    router.prefetch(pathname);
  }, [pathname, router]);
  return (
    <>
      <TokenComponent key={pathname} param={param} />
    </>
  );
}
