import React, { use, useEffect } from "react";
import "../style.css";
import { LayoutConfirm } from "./layoutModal/layoutConfirm";
import { LayoutWaitingAndSuccess } from "./layoutModal/layoutWaitingAndSuccess";

export interface ModalRemovePoolProps {

}

export function ModalRemovePool({ }: ModalRemovePoolProps) {

    const [layoutModalRemovePool, setLayoutModalRemovePool] = React.useState({
        confirm:true,
        waiting:false,
        success:false
    })

    const clickConfirm = () => {
        setLayoutModalRemovePool({
            ...layoutModalRemovePool,
            confirm:false,
            waiting:true
        })
    }

    useEffect(() => {
        if(layoutModalRemovePool.waiting) {
            setTimeout(() => {
                setLayoutModalRemovePool({
                    ...layoutModalRemovePool,
                    waiting:false,
                    success:true
                })
            }, 5000)
        }
    },[layoutModalRemovePool])

    return (
        <>
            {layoutModalRemovePool.confirm ? <LayoutConfirm onClickConFirm={clickConfirm}/> : (
                <LayoutWaitingAndSuccess statusLayout={layoutModalRemovePool}/>
            )}
        </>
    );
}
