"use client";
import "reflect-metadata";
import AsyncInfoPageDynamic from '@/containers/async-info-page-dynamic';

export default function Tokens({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  return <AsyncInfoPageDynamic param={params}/>;
}