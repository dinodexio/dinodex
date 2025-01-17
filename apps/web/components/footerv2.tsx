import Link from "next/link";
import styleFooter from './css/footerV2.module.css'
import Image from "next/image";
import { MENU_FOOTER,MENU_SOCIAL } from "@/constants";
export function Footer() {
    return (
        <>
            <footer className={styleFooter["containerFooter"]}>
                <div className={styleFooter["contentFooterTop"]}>
                    <div className={styleFooter["boxTitleFooter"]}>
                        <img
                           className={styleFooter["imageDino"]}
                            src="/images/navbar_footer/dino_image.svg"
                            alt=""
                        />
                        <span className={styleFooter["titleFooter"]} style={{ fontFamily: 'PPMondwest', color: 'var(--black-text-color)' }}> DinoDex</span>
                    </div>
                    <div className={styleFooter["containerTagFooter"]}>
                        {MENU_FOOTER.map((item, index) => (
                            <div className={styleFooter["boxTag"]} key={index}>
                                <span className={styleFooter["titleBoxTag"]}>{item.label}</span>
                                {item.children.map((itemChild, indexChild) => (
                                    <Link href={itemChild.link} key={indexChild}>
                                        <span className={styleFooter["tag"]}>{itemChild.label}</span>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styleFooter["contentFooterBot"]}>
                    <Image
                        width={35}
                        height={35}
                        src="/images/navbar_footer/line_footer.svg"
                        alt=""
                        className="w-full"
                    />
                    <div className={styleFooter["boxContact"]}>
                        <span className={`${styleFooter["textBoxContact"]} ${styleFooter["poppins-regular"]}`}>© 2024, All Rights Reserved</span>
                        <div className={styleFooter["boxInfoContact"]}>
                            {MENU_SOCIAL.map((item, index) => (
                                <Link href={item.link} key={index} target="_blank">
                                    <Image
                                        width={18}
                                        height={18}
                                        src={item.icon}
                                        alt=""
                                        className="w-full pointer"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
