import React, { use, useEffect } from "react";
import "../style.css";
import { LayoutConfirm } from "./layoutModal/layoutConfirm";
import { LayoutWaitingAndSuccess } from "./layoutModal/layoutWaitingAndSuccess";
import { EMPTY_DATA } from "@/constants";

export interface ModalRemovePoolProps {
  onConfirm: () => void;
  valueTokenPool?: any;
  tokenParams?: any;
  valuePer?: any;
  loading?: boolean;
  onCloseRemovePool?: () => void;
}

export function ModalRemovePool({
  loading,
  onConfirm,
  valuePer,
  tokenParams,
  valueTokenPool,
  onCloseRemovePool,
}: ModalRemovePoolProps) {
  const [layoutModalRemovePool, setLayoutModalRemovePool] = React.useState({
    confirm: true,
    waiting: false,
    success: false,
    error: false,
    message: "",
  });

  const clickConfirm = async () => {
    setLayoutModalRemovePool({
      ...layoutModalRemovePool,
      confirm: false,
      waiting: true,
      success: false,
      error: false,
    });
    const resultConfirm: any = onConfirm && (await onConfirm());
    if (resultConfirm === true) {
      setLayoutModalRemovePool({
        ...layoutModalRemovePool,
        confirm: false,
        success: true,
        error: false,
        waiting: false,
      });
    } else {
      setLayoutModalRemovePool({
        ...layoutModalRemovePool,
        success: false,
        waiting: false,
        confirm: false,
        error: true,
        message:
          resultConfirm?.message || "Something went wrong. Please try again",
      });
    }
  };

  const handleCloseRmovePool = () => {
    onCloseRemovePool && onCloseRemovePool();
  };

  let dataPool = {
    tokenPool: {
      first: {
        value: tokenParams?.tokenA?.value,
      },
      second: {
        value: tokenParams?.tokenB?.value,
      },
    },
  };

  useEffect(() => {
    if (layoutModalRemovePool.waiting) {
      setLayoutModalRemovePool({
        ...layoutModalRemovePool,
        waiting: loading ? true : false,
        success: loading ? false : true,
      });
    }
  }, [loading]);

  return (
    <>
      {layoutModalRemovePool.confirm ? (
        <LayoutConfirm
          onClickConFirm={clickConfirm}
          valuePer={valuePer}
          tokenParams={tokenParams}
          valueTokenPool={valueTokenPool}
          handleClosePool={handleCloseRmovePool}
        />
      ) : (
        <LayoutWaitingAndSuccess
          type="remove"
          statusLayout={layoutModalRemovePool}
          handleClosePool={handleCloseRmovePool}
          tokenIn={tokenParams?.tokenA?.label || EMPTY_DATA}
          tokenOut={tokenParams?.tokenB?.label || EMPTY_DATA}
          tokenIn_token={tokenParams?.tokenA?.value || EMPTY_DATA}
          tokenOut_token={tokenParams?.tokenB?.value || EMPTY_DATA}
          tokenInAmount={valueTokenPool?.tokenA_amount}
          tokenOutAmount={valueTokenPool?.tokenB_amount}
        />
      )}
    </>
  );
}
