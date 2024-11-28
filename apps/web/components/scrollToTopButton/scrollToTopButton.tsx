import Image from "next/image";
import { useEffect, useState } from "react";

export function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!showButton) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-[60px] left-[50%] hidden items-center gap-1 rounded-[12px] border border-borderOrColor bg-bgButtonFixed px-[25px] py-2 text-[20px] text-textBlack sm:hidden lg:flex xl:flex"
      style={{ transform: "translateX(-50%)", zIndex: 100 }}
    >
      <Image
        src="/icon/return-to-top-icon.svg"
        alt="return-to-top"
        width={24}
        height={24}
      />
      Return to top
    </button>
  );
}
