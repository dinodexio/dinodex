import HeaderV2 from "../headerv2";
import Header from "../header";
import { Footer } from "../footerv2";
import styleCampaign from '../css/campaign.module.css'
import CountDown from "./components/CountDown";
import { Instruction } from "./components/Instruction";
import Image from "next/image";
import { Leaderboard } from "./components/Leaderboard";
import { Toaster } from "../ui/toaster";
export interface CampaignComponentProps { }
export function CampaignComponent({ }: CampaignComponentProps) {
    return (
        <div className="flex justify-between flex-col min-h-[100dvh]">
            <Toaster />
            <HeaderV2 />
            <main className={styleCampaign["container-campaign"]}>
                <div className={styleCampaign["first-container-campaign"]}>
                    <div className={styleCampaign["first-content-campaign"]}>
                        <Image src="/images/campaign/dinodex-logo.svg" width={462} height={95} alt="bg-campaign" loading="lazy" />
                        <span className={styleCampaign["title-campaign"]}>TRADE COMPETITION</span>
                        <CountDown targetDate={"2025-01-18T20:00:00+07:00"} />
                    </div>
                </div>
                <div className={styleCampaign["second-container-campaign"]}>
                    <Instruction />
                    <Leaderboard />
                </div>
            </main>
            <Footer />
        </div>
    );
}
