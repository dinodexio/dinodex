import Image from "next/image";
import styleInstruction from "./instruction.module.css";
export interface InstructionProps {}
export function Instruction({}: InstructionProps) {
  return (
    <div className={styleInstruction["instruction-content-campaign"]}>
      <span className={styleInstruction["title-instruction-campaign"]}>
        Instruction
      </span>
      <div className={styleInstruction["check-quest-campaign"]}>
        <span className={styleInstruction["title-quest-campaign"]}>
          DinoDex Tranding Competition
        </span>
        <span className={styleInstruction["desc-quest-campaign"]}>
          Follow this step-by-step instruction to start your tranding
          competititon, climb the leaderboard, and earn rewards
        </span>
        <div className={styleInstruction["progress-container"]}>
          <span className={styleInstruction["title-progress-campaign"]}>
            1/3
          </span>
          <div className={styleInstruction["progress-bar"]}>
            <div className={styleInstruction["active-progress-bar"]}></div>
          </div>
        </div>
      </div>
      <div className={styleInstruction["list-quest-campaign"]}>
        <div className={styleInstruction["quest-campaign"]}>
          <div className={styleInstruction["index-quest-campaign"]}>1</div>
          <div className={styleInstruction["lock-quest"]}>
            <img
              src="/images/campaign/lock-icon.svg"
              alt="lock-icon"
              loading="lazy"
            />
            <span>Lock</span>
          </div>
          <div className={styleInstruction["content-quest"]}>
            <span className={styleInstruction["title-quest"]}>
              Wallet needs at least 1 $MINA{" "}
            </span>
            <span className={styleInstruction["desc-quest"]}>
              Your Auro Wallet needs to have at least 1 $MINA (main net) to
              create DinoDex Wallet (this is just a condition; your account will
              not be charged any fees to create a DinoDex Wallet)
            </span>
          </div>
          <div className={styleInstruction["btn-quest-campaign"]}>
            <img
              src="/images/campaign/check-icon.svg"
              alt="check-icon"
              loading="lazy"
            />
            <span>Check</span>
          </div>
        </div>
        <img
          src="/images/campaign/arrow-icon.svg"
          alt="arrow-campaign"
          width="16"
          height="16"
          className={styleInstruction["arrow-icon"]}
          loading="lazy"
        />
        <div
          className={`${styleInstruction["quest-campaign"]} ${styleInstruction["lock-quest-campaign"]}`}
        >
          <div className={styleInstruction["index-quest-campaign"]}>2</div>
          <div className={styleInstruction["lock-quest"]}>
            <img
              src="/images/campaign/lock-icon.svg"
              alt="lock-icon"
              loading="lazy"
            />
            <span>Lock</span>
          </div>
          <div className={styleInstruction["content-quest"]}>
            <span className={styleInstruction["title-quest"]}>
              Faucet Tokens{" "}
            </span>
            <span className={styleInstruction["desc-quest"]}>
              Get test tokens instantly in your DinoDex wallet to start trading.
            </span>
          </div>
          <img
            src="/images/campaign/lock-or-icon.svg"
            className={styleInstruction["lock-or-icon"]}
            alt="lock-or-icon"
            loading="lazy"
          />
          <div className={styleInstruction["btn-quest-campaign"]}>
            <span>DinoDex Wallet</span>
          </div>
        </div>
        <img
          src="/images/campaign/arrow-icon.svg"
          alt="arrow-campaign"
          width="16"
          height="16"
          className={styleInstruction["arrow-icon"]}
          loading="lazy"
        />
        <div
          className={`${styleInstruction["quest-campaign"]} ${styleInstruction["lock-quest-campaign"]}`}
        >
          <div className={styleInstruction["index-quest-campaign"]}>3</div>
          <div className={styleInstruction["lock-quest"]}>
            <img
              src="/images/campaign/lock-icon.svg"
              alt="lock-icon"
              loading="lazy"
            />
            <span>Lock</span>
          </div>
          <div className={styleInstruction["content-quest"]}>
            <span className={styleInstruction["title-quest"]}>
              Start your trading!
            </span>
            <span className={styleInstruction["desc-quest"]}>
              Start trading instantly with DinoDex tokens and get rewarded.
            </span>
          </div>
          <img
            src="/images/campaign/lock-or-icon.svg"
            className={styleInstruction["lock-or-icon"]}
            alt="lock-or-icon"
            loading="lazy"
          />
          <div className={styleInstruction["btn-quest-campaign"]}>
            <span>Launch App</span>
          </div>
        </div>
        <div className={styleInstruction["check-quest-campaign-note"]}>
          <span className={styleInstruction["title-quest-campaign"] + " flex items-center gap-1"}>
            <Image
              src="/images/swap/warning.svg"
              alt="swap-icon"
              width={18}
              height={18}
            />{" "}
            Note
          </span>
          <span className={styleInstruction["desc-quest-campaign"]}>
            All transactions in the Trading Competition take place on DinoDex's
            Local net, using test tokens that cannot be converted to Mainnet or
            Devnet
          </span>
        </div>
      </div>
    </div>
  );
}
