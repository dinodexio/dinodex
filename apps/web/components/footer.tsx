import Link from "next/link";
import './style.css'
import Image from "next/image";
export function Footer() {

  return (
    <>
      <div className="fixed bottom-[41px] left-[50px] hidden xl:block lg:block sm:hidden" style={{ zIndex: 30 }}>
        <Image src={'/images/home/dex.svg'} width={84} height={84} alt="dex" />
      </div>
      <div className="fixed bottom-[41px] right-[50px] hidden xl:block lg:block sm:hidden" style={{ zIndex: 30 }}>
        <div className="flex items-center gap-[17px]">
          <Link href="https://github.com/dinodexio" target="_blank">
            <Image
              src={"/images/social/git.svg"}
              width={35}
              alt={""}
              height={35}
            />
          </Link>
          <Link href="https://x.com/realDinoDex" target="_blank">
            <Image
              src={"/images/social/x.svg"}
              width={35}
              alt={""}
              height={35}
            />
          </Link>
          {/* <Link href="/" target="_blank">
                <Image
                  src={"/images/social/discord.svg"}
                  width={35}
                  height={35}
                  alt={""}
                />
              </Link> */}
        </div>
      </div>
    </>
  );
}
