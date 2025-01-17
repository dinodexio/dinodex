// src/types/components.ts

import { ComputedTransactionJSON } from "./containers";

export interface HeaderProps {
  title: string;
  subtitle?: string;
}

export interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface ChartDouAreaProps {
  onHover?: (dataHover: any) => void
}

export interface ChartPriceTokenProps {
  data: { createAt: string; price: number, id: number }[];
  onHover?: (dataHover: any) => void;
  filterTimeValue?: string;
  priceToken?: number
}

export interface ChartPoolBarProps {
  data?: any
  onHover?: (dataHover: any) => void
}

export interface ChartDouBarProps {
  data?: any
  onHover?: (dataHover: any) => void
}

export interface InfoPoolLayoutProps {
  type?: string;
  params: any;
}

export interface InfoTokenLayoutProps {
  type?: string;
  params: any;
}

export interface DataTransactionPanel {
  action?: string;
  typeText?: string;
  timestamp?: number | string;
  price?: number | string;
  tokenAAmount?: number | string;
  tokenBAmount?: number | string;
  tokenAPrice?: number | string;
  tokenBPrice?: number | string;
  creator?: string;
  priceusd?: number | string | any;
}

export interface TransactionPanelProps {
  data?: Array<DataTransactionPanel>;
  titleA: string;
  titleB: string;
  logoA: string;
  logoB: string;
  loading?: boolean
}



export interface DataTokenTransactionPanel {
  action?: string;
  timestamp?: number | string;
  price?: number | string;
  tokenAmount?: number | string;
  tokenCounterpartAmount?: number | string;
  logoCounterpart?: string;
  nameCounterpart?: string;
  tickerCounterpart?: string;
  creator?: string;
}

export interface TokenTransactionPanelProps {
  data?: Array<DataTokenTransactionPanel>;
  titleToken: string;
  loading?: boolean
}

export interface DataPoolsPanel {
  blockHeight: number;
  createAt: string;
  path: string[];
  poolKey: string;
  tokenAAmount: string;
  tokenAId: string;
  tokenBAmount: string;
  tokenBId: string;
  updateBlockHeight: number;
  updatedAt: string;
  id: number;
  tokenselected: Tokenselected;

  //before update
  feeTier?: any;
  tvl?: any;
  volume1d?: any;
  volume7d?: any;
  apr?: any;
}

export interface Tokenselected {
  first: TokenSelectedInfo;
  second: TokenSelectedInfo;
}

export interface TokenSelectedInfo {
  ticker: string;
  name: string;
  logo: string;
  address: string;
  website: string;
  explorer: string;
  amount?: string | number;
}

export interface tokenModal {
  label: string;
  ticker: string;
  value: string | number;
  price: string | number;
  balance: string | number
}

export interface TransactionPanelProcessed extends ComputedTransactionJSON {
  token: {
    first: TokenSelectedInfo;
    second: TokenSelectedInfo;
  },
  address: string,
  priceusd: string | number
}

export interface PoolInfoDetail {
  poolKey: string;
  tokenselected: Tokenselected;

  //before update
  tvl?: any;
  volume_1d?: any;
}

export interface LeaderboardData {
  walletAddress: string;
  totalVolume: string | number;
  totalVolumeChange: number;
  blockHeightRank: number;
  preRank?: number;
  rank: number;
  index: number | string;
  pnl:number | string;
  pnlChange: number
}