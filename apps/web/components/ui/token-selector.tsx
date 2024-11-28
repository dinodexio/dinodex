"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import styles from "../css/wallet.module.css";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { tokens } from "@/tokens";
import { FormField } from "./form";
import { useFormContext } from "react-hook-form";

const tokenOptions = Object.entries(tokens).map(([tokenId, token]) => ({
  label: token?.ticker,
  value: tokenId,
}));

export interface TokenSelectorProps {
  disabled?: boolean;
  name: string;
}

export function TokenSelector({ disabled, name }: TokenSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const form = useFormContext();
  const inputName = `${name}_token`;
  return (
    <FormField
      control={form.control}
      name={inputName}
      render={({ field }) => {
        return(
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                disabled={disabled}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={`flex h-[38px] flex-row items-center justify-between gap-[8px] 
                  rounded-[8px] py-[8px] pl-[12px] border-none pr-[8px] text-textBlack hover:text-textBlack hover:bg-[#D1D1D1] 
                  ${field.value ? "bg-bgWhiteColor" : "bg-[#D1D1D1] hover:opacity-70"} ${styles['select-token']}`}
                style={{ width: "max-content" }}
              >
                <div className="flex items-center justify-start">
                  {field.value ? (
                    <>
                      <img
                        className="mr-[8px] h-5 w-5"
                        src={tokens[field.value]?.logo}
                      />
                      <span className="mr-[8px]">
                        {
                          tokenOptions.find(
                            (token) => token.value === field.value,
                          )?.label
                        }
                      </span>
                    </>
                  ) : (
                    <span className="text-[14px] font-[500] text-textBlack">
                      Select token
                    </span>
                  )}
                </div>
                <ChevronDown className="h-5 w-5 shrink-0 text-textBlack" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={`w-[225px] border-none bg-white p-0 ${styles["popover-content"]} ${styles['box-shadow-content-wallet']}`}
            >
              <Command
                className="bg-white"
                filter={(value, search) => {
                  if (
                    tokenOptions
                      .find((option) => option.value === value)
                      ?.label?.toLowerCase()
                      .includes(search.toLowerCase())
                  )
                    return 1;
                  return 0;
                }}
              >
                <CommandInput
                  placeholder="Search tokens"
                  className="p-0 text-[12px] font-[500] text-textBlack"
                />
                <CommandEmpty>No token found.</CommandEmpty>
                <CommandGroup className="bg-white">
                  <CommandList className={styles["command-list"]}>
                    {tokenOptions.map((token) => (
                      <CommandItem
                        key={token.value}
                        value={token.value}
                        onSelect={(currentValue) => {
                          form.setValue(inputName, currentValue, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                          form.trigger(inputName);
                          setOpen(false);
                        }}
                        className={`flex items-center justify-between rounded-[3px] ${field.value === token.value ? styles["command-item-active"] : ''} ${styles["command-item"]}`}
                      >
                        <div className="flex items-center">
                          <img
                            className="mr-1.5 h-[18px] w-[18px]"
                            src={tokens[token.value]?.logo}
                          />

                          <span className="text-[12px] font-[500] text-textBlack">
                            {token.label}
                          </span>
                        </div>
                        {/* <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === token.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        /> */}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        )
      }}
    ></FormField>
  );
}
