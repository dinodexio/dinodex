export interface USDBalanceProps {
  balance?: string;
  className?: string;
}

export function USDBalance({ balance, className }: USDBalanceProps) {
  return <span className={className}>{balance ?? "—"}$</span>;
}
