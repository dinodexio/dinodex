"use client";
import "reflect-metadata";
import AsyncTokenPageDynamic from '@/containers/async-tokens-page-dynamic';
import { useRouter } from "next/navigation";

export default function Pools() {
  const router = useRouter();
    return <AsyncTokenPageDynamic />;
  }