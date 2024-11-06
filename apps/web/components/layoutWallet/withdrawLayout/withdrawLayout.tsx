import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { WithdrawForm } from "./withdraw-form";
import BigNumber from "bignumber.js";
import {
  addPrecision,
  removePrecision,
} from "@/containers/xyk/add-liquidity-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PublicKey } from "o1js";
import { Form } from "@/components/ui/form";
import { useWithdraw } from "@/lib/stores/withdraw";
import { useWalletStore } from "@/lib/stores/wallet";
import { useBalance } from "@/lib/stores/balances";
import { WithdrawConfirm } from "./withdraw-confirm";
import { TransferWaiting } from "../TransferLayout/transfer-waiting";
import styles from "../../css/wallet.module.css";

export interface withdrawLayoutProps {
  onClose: () => void;
}

export function WithdrawLayout({ onClose }: withdrawLayoutProps) {
  const [loading, setLoading] = useState(false);
  const walletBalance = useRef("0");
  const [statusLayout, setStatusLayout] = useState({
    withdraw: true,
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

  const withdraw = useWithdraw();
  const fields = form.getValues();
  const wallet = useWalletStore();
  const balance = useBalance(fields.amount_token, wallet.wallet);

  const handleClose = () => {
    form.reset();
    form.clearErrors();
    form.trigger();
    setLoading(false);
    setStatusLayout({
      withdraw: true,
      confirm: false,
      waiting: false,
    });
    onClose();
  };

  const handleChangeStatusLayout = (newStatusLayout: typeof statusLayout) => {
    if (
      Object.keys(newStatusLayout).every((key) =>
        ["withdraw", "confirm", "waiting"].includes(key),
      )
    ) {
      setStatusLayout(newStatusLayout);
    }
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
      await withdraw(
        values.amount_token,
        values.toRecipientAddress,
        addPrecision(values?.amountValue),
      );
    } catch (e) {
      console.log("error withdraw", e);
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
        className={`absolute top-[50%] flex translate-y-[-50%] flex-col rounded-[20px] bg-bgWhiteColor p-3 shadow-popup`}
        style={{
          zIndex: 102,
          width: statusLayout.withdraw ? 310 : statusLayout.confirm ? 325 : 298,
          borderColor: statusLayout.waiting ? "transparent" : undefined,
          padding: statusLayout.withdraw
            ? "12px"
            : statusLayout.confirm
              ? "18.2px 15.6px 10.4px 15.6px"
              : "18.964px 16.255px",
          right: statusLayout.withdraw ? 15 : statusLayout.confirm ? 7 : 21,
        }}
      >
        <Form {...form}>
          {statusLayout.withdraw && (
            <>
              <WithdrawForm
                onClose={handleClose}
                handleChangeStatusLayout={handleChangeStatusLayout}
              />
            </>
          )}
          {statusLayout.confirm && (
            <>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <WithdrawConfirm onClose={handleClose} loading={loading} onSubmit={onSubmit} />
              </form>
            </>
          )}
          {statusLayout.waiting && (
            <>
              <TransferWaiting
                onClose={handleClose}
                loading={loading}
                statusLayout={statusLayout}
              />
            </>
          )}
        </Form>
      </div>
    </>
  );
}
