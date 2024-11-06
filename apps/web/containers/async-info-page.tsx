"use client";

import { Token as TokenComponent } from "@/components/token";
import React, { useEffect } from "react";

export default function Info({ param }: { param: string }) {
  return (
    <>
      <TokenComponent param={param} />
    </>
  );
}
