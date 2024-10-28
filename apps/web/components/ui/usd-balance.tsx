export interface USDBalanceProps {
  balance?: string;
  className?: string;
  type?: "default" | "USD";
}

export function USDBalance({
  balance,
  className,
  type = "default",
}: USDBalanceProps) {
  return (
    <span className={className}>
      {type === "USD" && "~$"}
      {balance ?? "~"}
      {type === "USD" ? null : "$"}
    </span>
  );
}
