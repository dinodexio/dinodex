export interface USDBalanceProps {
  balance?: string | number;
  className?: string;
  type?: "default" | "USD";
}

export function USDBalance({
  balance,
  className,
  type = "default",
}: USDBalanceProps) {
  if (!balance || balance === "~") return <span className={className}>~$</span>;
  return (
    <span className={className}>
      {type === "default" ? `$${balance}` : `${balance}$`}
    </span>
  );
}
