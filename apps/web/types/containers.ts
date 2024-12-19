// src/types/containers.ts

export interface dataSubmitProps {
  logoA?: string | undefined;
  logoB?: string | undefined;
  tickerA?: string | undefined;
  tickerB?: string | undefined;
  amountA?: string;
  amountB?: string;
  toRecipientAddress?: string;
  amountValue?: string;
  ticker?: string;
}

export interface ComputedTransactionJSON {
  blockHeight: number;
  createAt: string;
  creator: string;
  directionAB: boolean;
  poolKey: string;
  tokenAId: string;
  tokenBId: string;
  tokenAAmount: string;
  tokenBAmount: string;
  type: string;
  hash: string;

  //before update
  tokenBPrice?: string | number;
  tokenAPrice?: string | number;
}
