"use client";
import { useRouter, usePathname } from "next/navigation";
import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";
import styles from './css/home.module.css'
import stylesButton from './css/button.module.css'
import Link from "next/link";
import Image from "next/image";

export interface HomeProps {
}

export function Home({  }: HomeProps) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <>
    <div className = {styles["home-a"]} >
    <div className={styles["header-home"]}>
      <Link href="/swap" className={stylesButton["button-home"]}><span>Launch App</span></Link>
    </div>

    <div className={styles["content-home"]}>
      <div className={styles["cloud-content"]}>
        <Image src="/images/home/cloud-1.svg" alt="cloud" width={267} height={67}/>
        <Image src="/images/home/cloud-2.svg" alt="cloud" width={319} height={82}/>
      </div>
      <div className={styles["logo-content"]}>
        <span style={{ fontFamily: 'PPMondwest', fontSize: '160px', color: 'var(--black-text-color)', height: '175px', display: 'flex', alignItems: 'center' }}>DinoDEX</span>
      </div>
      <div className={styles["game-content"]}>
        <img src="/images/home/land.svg" alt="game" className="land-img" />
        <div className={styles["dex-content"]}>
          
          <Image src="/images/home/dex.svg" alt="dex" width={294} height={294}/>
        </div>
        <div className={styles["cactus-content"]}>
          <Image src="/images/home/cactus-left.svg" alt="cactus" width={199} height={199}/>
          <Image src="/images/home/cactus-center.svg" alt="cactus" width={150} height={150} style={{height: '150px'}}/>
          <Image src="/images/home/cactus-right.svg" alt="cactus" width={199} height={199}/>
        </div>
      </div>
    </div>
  </div>
  </>
  );
}
