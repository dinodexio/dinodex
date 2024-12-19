import HeaderV2 from "../headerv2";
import { Footer } from "../footerv2";
import styleCampaign from '../css/campaign.module.css'
import CountDown from "./components/CountDown";
import { Instruction } from "./components/Instruction";
import Image from "next/image";
import { Leaderboard } from "./components/Leaderboard";
export interface CampaignComponentProps { }
export function CampaignComponent({ }: CampaignComponentProps) {
    return (
        <div className="flex justify-between flex-col min-h-[100dvh]">
            <HeaderV2 />
            <main className={styleCampaign["container-campaign"]}>
                <div className={styleCampaign["first-container-campaign"]}>
                    <div className={styleCampaign["first-content-campaign"]}>
                        <Image src="/images/campaign/dinodex-logo.svg" width={462} height={95} alt="bg-campaign" loading="lazy" />
                        <span className={styleCampaign["title-campaign"]}>TRADE COMPETITION</span>
                        <CountDown targetDate={"01/01/2025"} />
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
