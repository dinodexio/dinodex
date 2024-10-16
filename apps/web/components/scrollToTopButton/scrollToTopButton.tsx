import Image from "next/image";
import { useEffect, useState } from "react";

export function ScrollToTopButton() {
    const [showButton, setShowButton] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!showButton) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-[60px] left-[50%] items-center hidden gap-1 text-textBlack text-[20px] rounded-[12px] border border-borderOrColor bg-bgButtonFixed py-2 px-[25px] xl:flex lg:flex sm:hidden"
            style={{transform: 'translateX(-50%)'}}
        >
            <Image src="/icon/return-to-top-icon.svg" alt="return-to-top" width={24} height={24} />Return to top
        </button>
    );
}