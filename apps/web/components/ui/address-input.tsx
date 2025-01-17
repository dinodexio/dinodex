"use client";
import { Card } from "./card";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { Balance } from "./balance";
import { Info } from "lucide-react";

export interface AddressInputProps {
  label: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function AddressInput({
  label,
  disabled,
  placeholder,
  name,
  className,
}: AddressInputProps) {
  const form = useFormContext();
  return (
    <Card
      className={cn(["flex h-32 flex-col rounded-2xl px-4 py-4", className])}
    >
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <div className="flex h-full flex-col ">
        <div className="mt-1.5 flex flex-row items-center justify-center">
          <Input
            {...form.register(name)}
            disabled={disabled}
            placeholder={placeholder ?? "B62.."}
            className={cn([
              "h-auto border-0  p-0 text-3xl focus-visible:ring-0 focus-visible:ring-offset-0",
            ])}
          />
        </div>
        <div className="mt-2.5">
          <p className="text-[9.202px] font-[500] italic text-textBlack opacity-60">
            DinoDex only supports Mina's B62 addresses
          </p>
        </div>
      </div>
    </Card>
  );
}
