// src/types/components.ts

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

export interface ChartDouBarProps {
  onHover?: (dataHover: any) => void
}

export interface ChartDouBarProps {
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
  timestamp?: number | string;
  price?: number | string;
  tokenAAmount?: number | string;
  tokenBAmount?: number | string;
  creator?: string;
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