import Image from "next/image";
import { useEffect, useState } from "react";

export interface CopyContainerProps {
    value: string;
    content?: any;
    className?: string;
    stylePopUp?: object;
    showIcon?: boolean
}

export function CopyContainer({ value, content, className, showIcon,stylePopUp }: CopyContainerProps) {
    const [copied, setCopied] = useState<Boolean>(false)
    // const handleClickCopy = (value: string) => {
    //     if (copied) return;
    //     navigator.clipboard.writeText(value);
    //     setCopied(true)
    // };

    const handleClickCopy = async (value: string) => {
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(value);
          } else {
            const textArea = document.createElement("textarea");
            textArea.value = value;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
          }

          setCopied(true);
        } catch (err) {}
    };

    useEffect(() => {
        if (!copied) return;
        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }, [copied])
    return (
        <>
            <div
                className={`relative flex cursor-pointer items-center gap-[8px] rounded-[9px] bg-bgWhiteColor px-[18px] py-[6px] shadow-content transition-all duration-300 ease-linear hover:bg-[#E8E8E8] ${className}`}
                onClick={() => handleClickCopy(value)}
            >
                {showIcon && (
                    <Image
                        src={"/icon/icon-copy.svg"}
                        width={20}
                        height={20}
                        alt=""
                    />
                )}
                <span className="text-[16px] font-[400] text-textBlack sm:text-[16px] lg:text-[18px] xl:text-[18px]">
                    {content ? content : value}
                </span>
                <div className={`w-[100px] h-[30px] absolute z-20 top-[45px] bg-bgWhiteColor rounded-[12px] left-1/2 translate-x-[-50%]
                    flex items-center justify-center text-[16px] text-textBlack shadow-content 
                    ${copied ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                    style={{...stylePopUp,transition: 'all 0.3s ease' }}
                >
                    Copied!
                </div>
            </div>
        </>
    );
}
