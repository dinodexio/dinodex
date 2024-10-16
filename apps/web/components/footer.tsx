import Link from "next/link";
import './style.css'
import Image from "next/image";
export function Footer() {

  return (
    <div className="fixed bottom-[41px] left-[50px] hidden xl:block lg:block sm:hidden">
        <Image src={'/images/home/dex.svg'} width={84} height={84} alt="dex" />
    </div>
  );
}
 