"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FILTER_NETWORK, FILTER_VOL } from "@/constants";
import useClickOutside from "@/hook/useClickOutside";
export interface FilterSortProps {
  handleSearch: (value: string) => void;
}

export function FilterSort({ handleSearch }: FilterSortProps) {
  const [openNetWork, setOpenNetWork] = useState<boolean>(false);
  const [openVol, setOpenVol] = useState<boolean>(false);
  const [openInputSearch, setOpenSearch] = useState<boolean>(false);
  const [dataNetWork, setDataNetWork] = useState<any>(null);

  const refNetWork = useClickOutside<HTMLDivElement>(() => {
    setOpenNetWork(false);
  });
  const refVol = useClickOutside<HTMLDivElement>(() => {
    setOpenVol(false);
  });
  const refSearch = useClickOutside<HTMLDivElement>(() => {
    setOpenSearch(false);
  });

  const [dataVol, setDataVol] = useState<any>({
    key: "1h",
    label: "1H volume",
  });

  const handleClickNetwork = (item: any) => {
    setDataNetWork(item);
    setOpenNetWork(false);
  };

  const handleClickVol = (item: any) => {
    setOpenVol(false);
    setDataVol(item);
  };

  return (
    <div className="filter-sort-container">
      <div
        className="network-content"
        onClick={() => {
          setOpenNetWork(!openNetWork);
          setOpenVol(false);
        }}
        ref={refNetWork}
      >
        <Image
          width={20}
          height={20}
          src={dataNetWork ? dataNetWork.logo : "/images/token/mina-token.svg"}
          alt="network"
        />
        <Image
          width={19}
          height={20}
          src="/icon/drop-down-icon.svg"
          alt="network"
        />
        <div
          className={`network-content-menu mt-2 ${openNetWork ? "network-content-menu-show" : ""}`}
        >
          {FILTER_NETWORK.map((item, index) => (
            <div
              className="network-content-menu-item"
              key={index}
              onClick={() => handleClickNetwork(item)}
              data-network={item.key}
            >
              <Image width={20} height={20} src={item.logo} alt="network" />
              <span className="network-content-menu-item-text">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        className="network-content"
        ref={refVol}
        onClick={() => {
          setOpenVol(!openVol);
          setOpenNetWork(false);
        }}
      >
        <span className="network-content-menu-item-text">{dataVol.label}</span>
        <Image
          width={19}
          height={20}
          src="/icon/drop-down-icon.svg"
          alt="network"
        />
        <div
          className={`network-content-menu mt-2 ${openVol ? "network-content-menu-show" : ""}`}
        >
          {FILTER_VOL.map((item, index) => (
            <div
              className="network-content-menu-item"
              key={index}
              onClick={() => handleClickVol(item)}
              data-network={item.key}
            >
              <span className="network-content-menu-item-text">
                {item.label}
              </span>
              <img
                src="/icon/tick-icon.svg"
                alt="network"
                style={{ display: item.key === dataVol.key ? "block" : "none" }}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        ref={refSearch}
        className={`search-token-container ${openInputSearch ? "show-input-search" : null}`}
        onClick={() => setOpenSearch(true)}
      >
        <Image width={24} height={24} src="/icon/btn-search.svg" alt="search" />
        <input
          type="text"
          className="input-search-token"
          placeholder="Search Token"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );
}