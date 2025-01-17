"use client";
import { useState } from "react";
import Image from "next/image";
import useClickOutside from "@/hook/useClickOutside";
import styles from "../css/tokens.module.css";
export interface FilterSortProps {
  onChangeTime?: (value: string) => void;
  handleUpdateFilterChart?: (value: string) => void;
  dataFiltersChart?: string;
}
let dataFilterTime = [
  {
    value: "1h",
    label: "1H",
  },
  {
    value: "1d",
    label: "1D",
  },
  {
    value: "1w",
    label: "1W",
  },
  {
    value: "1m",
    label: "1M",
  },
  {
    value: "1y",
    label: "1Y",
  },
];

interface ChartFilter {
  value: string;
  label: string;
}

const FilterChart: ChartFilter[] = [
  {
    value: "volume",
    label: "Volume",
  },
  {
    value: "price",
    label: "Price",
  },
  {
    value: "tvl",
    label: "TVL",
  },
];
export function FilterSort({
  onChangeTime,
  dataFiltersChart = "volume",
  handleUpdateFilterChart,
}: FilterSortProps) {
  const [openFiltersChart, setOpenFiltersChart] = useState<boolean>(false);
  const [dataTime, setDataTime] = useState<any>("1d");
  const refFiltersChart = useClickOutside<HTMLDivElement>(() => {
    setOpenFiltersChart(false);
  });
  const dataFilter = FilterChart.filter((item) => item.value === dataFiltersChart);
  return (
    <div className={styles["filter-container"]}>
      <div className={styles["filter-time-container"]}>
        {dataFilterTime.map((item, index) => (
          <div
            onClick={() => {
              setDataTime(item.value);
              onChangeTime && onChangeTime(item.value);
            }}
            className={`${styles["filter-time-item"]} ${item.value === dataTime ? styles["filter-time-item-active"] : ""}`}
            key={index}
          >
            <span className={styles["filter-time-item-text"]}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <div className={styles["filter-sort-container"]}>
        {/* <div className={styles["network-content"]} onClick={() => {
                    setOpenNetWork(!openNetWork)
                }} ref={refNetWork}>
                    <Image width={20} height={20} src={dataNetWork ? dataNetWork.logo : "/icon/network-icon.svg"} alt="network" />
                    <Image width={20} height={20} src="/icon/drop-down-icon.svg" alt="network" />
                    <div className={`${styles["network-content-menu"]} ${openNetWork ? styles['network-content-menu-show'] : ''}`}>
                        {FILTER_NETWORK.map((item, index) => (
                            <div className={styles["network-content-menu-item"]} key={index}
                                onClick={() => handleClickNetwork(item)}
                                data-network={item.key}
                            >
                                <Image width={20} height={20} src={item.logo} alt="network" />
                                <span className={styles["network-content-menu-item-text"]}>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div> */}
        <div
          className={styles["network-content"]}
          onClick={() => {
            setOpenFiltersChart(!openFiltersChart);
          }}
          ref={refFiltersChart}
        >
          <span
            className={styles["network-content-menu-item-text"]}
            style={{ textTransform: "capitalize" }}
          >
            {dataFiltersChart || "Volume"}
          </span>
          <Image
            width={20}
            height={20}
            src="/icon/drop-down-icon.svg"
            alt="network"
          />
          <div
            className={`${styles["network-content-menu"]} ${openFiltersChart ? styles["network-content-menu-show"] : ""}`}
          >
            {dataFilter && dataFilter?.map((item, index) => (
              <div
                className={styles["network-content-menu-item"]}
                key={index}
                onClick={() => {
                  handleUpdateFilterChart &&
                    handleUpdateFilterChart(item.value);
                  setOpenFiltersChart(false);
                }}
                data-network={item.value}
              >
                <span className={styles["network-content-menu-item-text"]}>
                  {item.label}
                </span>
                <img
                  src="/icon/tick-icon.svg"
                  alt="network"
                  style={{
                    opacity: item.value === dataFiltersChart ? "1" : "0",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
