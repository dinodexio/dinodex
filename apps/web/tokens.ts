"use client";

export type Token = {
  ticker: string;
  name: string;
  logo: string;
  [key: string]: string;
};

export type Tokens = Record<string, Token | undefined>;

export const pools: [string, string][] = [
  ["0", "1"],
  ["1", "2"],
];