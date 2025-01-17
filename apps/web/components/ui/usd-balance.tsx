import { BASE_TOKEN } from "@/constants";

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
  if (!balance || balance === "~") return <span className={className}>~{BASE_TOKEN}</span>;
  return (
    <span className={className}>
      {type === "default" ? `${BASE_TOKEN} ${balance}` : `${balance} ${BASE_TOKEN}`}
    </span>
  );
}
