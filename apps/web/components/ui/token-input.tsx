import { ArrowDown } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import { Input } from "./input";
import { TokenSelector } from "./token-selector";
import { cn } from "@/lib/utils";
import { USDBalance } from "./usd-balance";
import { useFormContext } from "react-hook-form";

export interface TokenInputProps {
  label: string;
  name?: string;
  tokenInputDisabled?: boolean;
  amountInputDisabled?: boolean;
  tokenInputHidden?: boolean;
  className?: string;
}

export function TokenInput({
  label = '',
  name = '',
  tokenInputDisabled,
  amountInputDisabled,
  tokenInputHidden,
  className,
}: TokenInputProps) {
  const form = useFormContext();

  return (
    <Card className={cn(["rounded-2xl   px-4 py-4 pb-4", className])}>
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <div className="mt-1.5 flex flex-row items-center justify-center">
        <Input
          {...form.register(`${name}_amount`)}
          disabled={amountInputDisabled}
          placeholder="0"
          className={cn([
            "mr-4 h-auto border-0  p-0 text-3xl focus-visible:ring-0 focus-visible:ring-offset-0"
          ])}
        />
        {!tokenInputHidden && (
          <TokenSelector disabled={tokenInputDisabled} name={name} />
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        <USDBalance />
      </p>
    </Card>
  );
}
