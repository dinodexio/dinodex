export interface OptionPoolProps {
}

export function OptionPool({ }: OptionPoolProps) {
    return (
        <>
            <div className="pl-0 pr-0 xl:pl-[26px] xl:pr-[26px] lg:pl-[26px] lg:pr-[26px] flex items-center gap-[11px]">
                <div className="flex flex-col gap-[5px] w-[276px] h-[101px] rounded-[9.712px] border-[1.942px] border-black px-[12px] py-[18px] cursor-pointer">
                    <span className="text-[20px] font-[500] text-black leading-none">{`Learn More >`}</span>
                    <span className="text-[15px] italic font-[500] text-black h-[36px] leading-none opacity-[0.3]">Check out our MINA LP walkthrough and documentations.</span>
                </div>
                <div className="flex flex-col gap-[5px] w-[276px] h-[101px] rounded-[9.712px] border-[1.942px] border-black px-[12px] py-[18px] cursor-pointer">
                    <span className="text-[20px] font-[500] text-black leading-none">{`Top Pools >`}</span>
                    <span className="text-[15px] italic font-[500] text-black h-[36px] leading-none opacity-[0.3]">Explore MiDEX Analytics.</span>
                </div>
            </div>
        </>
    );
}
