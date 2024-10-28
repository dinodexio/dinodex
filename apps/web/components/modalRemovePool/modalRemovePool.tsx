import React, { use, useEffect } from "react";
import "../style.css";
import { LayoutConfirm } from "./layoutModal/layoutConfirm";
import { LayoutWaitingAndSuccess } from "./layoutModal/layoutWaitingAndSuccess";

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
  });

  const clickConfirm = () => {
    setLayoutModalRemovePool({
      ...layoutModalRemovePool,
      confirm: false,
      waiting: true,
    });
    onConfirm();
  };

  const handleCloseRmovePool = () => {
    onCloseRemovePool && onCloseRemovePool();
  };

  let dataPool = {
    tokenPool:{
      first:{
        value: tokenParams?.tokenA?.value 
      },
      second:{
        value: tokenParams?.tokenB?.value
      },
    }
  }

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
        />
      ) : (
        <LayoutWaitingAndSuccess
          type="remove"
          statusLayout={layoutModalRemovePool}
          tokenParams={tokenParams}
          valueTokenPool={valueTokenPool}
          handleClosePool={handleCloseRmovePool}
          dataPool={dataPool}
        />
      )}
    </>
  );
}
