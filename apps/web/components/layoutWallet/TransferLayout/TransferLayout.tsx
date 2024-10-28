import React, { useEffect, useRef, useState } from "react";
import BigNumber from "bignumber.js";
import {
  addPrecision,
  removePrecision,
} from "@/containers/xyk/add-liquidity-form";
import { PublicKey } from "o1js";
import { useObserveBalance, useTransfer } from "@/lib/stores/balances";
import { useWalletStore } from "@/lib/stores/wallet";
import { TransferForm } from "./transfer-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { TransferConfirm } from "./transfer-confirm";
import { TransferWaiting } from "./transfer-waiting";
import { ModalListToken } from "@/components/modalListToken/modalListToken";

export interface transferLayoutProps {
  onClose: () => void;
}

export function TransferLayout({ onClose }: transferLayoutProps) {
  const [loading, setLoading] = useState(false);
  const [openModalToken, setOpenModalToken] = useState(false);
  const walletBalance = useRef("0");
  const [statusLayout, setStatusLayout] = useState({
    transfer: true,
    confirm: false,
    waiting: false,
  });

  const formSchema = z.object({
    toRecipientAddress: z
      .string({
        required_error: "Recipient address is required",
        invalid_type_error: "Recipient address is required",
      })
      .min(1, { message: "Recipient address is required" })
      .refine(
        (data) => {
          try {
            PublicKey.fromBase58(data);
            return true;
          } catch (e) {
            return false;
          }
        },
        {
          message: "Invalid address",
        },
      ),
    amount_token: z
      .string({
        required_error: "Token is required",
        invalid_type_error: "Token is required",
      })
      .min(1, { message: "Token is required" }),
    amountValue: z
      .string({
        required_error: "Amount is required",
        invalid_type_error: "Amount is required",
      })
      .min(1, { message: "Amount is required" })
      .refine(
        (data) => {
          return new BigNumber(data).lte(
            removePrecision(walletBalance.current),
          );
        },
        {
          message: "Insufficient balance",
        },
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const transfer = useTransfer();
  const fields = form.getValues();
  const wallet = useWalletStore();
  const balance = useObserveBalance(fields.amount_token, wallet.wallet);

  const handleChangeStatusLayout = (newStatusLayout: typeof statusLayout) => {
    if (
      Object.keys(newStatusLayout).every((key) =>
        ["transfer", "confirm", "waiting"].includes(key),
      )
    ) {
      setStatusLayout(newStatusLayout);
    }
  };

  const handleOpenSelectToken = () => {
    setOpenModalToken(true);
  };

  const handleSetTokenSelected = (newToken: any) => {
    const inputName = "amount_token";
    form.setValue(inputName, newToken?.value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    form.trigger(inputName);
  };

  useEffect(() => {
    form.trigger();
  }, []);

  useEffect(() => {
    walletBalance.current = balance ?? "0";
    form.formState.isDirty && form.trigger("amountValue");
  }, [balance, form.formState.isDirty]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await transfer(
        values.amount_token,
        values.toRecipientAddress,
        addPrecision(values?.amountValue),
      );
    } catch (e) {
    } finally {
      setLoading(false);
      setStatusLayout({
        ...statusLayout,
        confirm: false,
        waiting: true,
      });
      setTimeout(() => {
        onClose();
      }, 5000);
    }
  };

  return (
    <>
      <div
        className={`absolute top-[50%] flex translate-y-[-50%] flex-col 
            gap-[12px] rounded-[16px] border-[2px] bg-bgWhiteColor p-3 `}
        style={{
          zIndex: 102,
          width: statusLayout.transfer ? 310 : statusLayout.confirm ? 325 : 298,
          borderColor: statusLayout.waiting ? "transparent" : undefined,
          padding: statusLayout.transfer
            ? "12px"
            : statusLayout.confirm
              ? "18.2px 15.6px 10.4px 15.6px"
              : "18.964px 16.255px",
          right: statusLayout.transfer ? 18 : statusLayout.confirm ? 11 : 16,
        }}
      >
        <Form {...form}>
          {statusLayout.transfer && (
            <TransferForm
              onClose={onClose}
              handleChangeStatusLayout={handleChangeStatusLayout}
              handleSetTokenSelected={handleSetTokenSelected}
              handleOpenSelectToken={handleOpenSelectToken}
            />
          )}
          {statusLayout.confirm && (
            <>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <TransferConfirm onClose={onClose} loading={loading} />
              </form>
            </>
          )}
          {statusLayout.waiting && (
            <>
              <TransferWaiting
                onClose={onClose}
                loading={loading}
                statusLayout={statusLayout}
              />
            </>
          )}
        </Form>
      </div>

      {openModalToken && (
        <>
          <div
            className="absolute bottom-0 right-0 top-0 w-[350px] rounded-[18px] bg-[rgba(0,0,0,0.4)]"
            style={{ zIndex: 103 }}
            onClick={() => setOpenModalToken(false)}
          />
          <div
            className="absolute right-[3px] top-[50%] w-[344px] translate-y-[-50%] rounded-[12px] bg-bgWhiteColor p-4"
            style={{ zIndex: 104 }}
          >
            <ModalListToken
              {...form.register("amount_token")}
              tokenSelected={null}
              onClickToken={(token) => {
                handleSetTokenSelected?.(token);
                setOpenModalToken(false);
              }}
              dialogClose={false}
            />
          </div>
        </>
      )}
    </>
  );
}
