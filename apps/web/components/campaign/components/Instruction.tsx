import Image from "next/image";
import styleInstruction from "./instruction.module.css";
import { useEffect, useState } from "react";
import { useWalletStore } from "@/lib/stores/wallet";
import { Wallet } from "@/components/wallet/wallet";
import { useBalancesStore } from "@/lib/stores/balances";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useChainStore } from "@/lib/stores/chain";
export interface InstructionProps {}
export function Instruction({}: InstructionProps) {
  const { wallet, isWalletOpen, setIsWalletOpen, connectWallet } =
    useWalletStore();
  const { balances } = useBalancesStore();
    const { block } = useChainStore();
  const ownBalances = wallet ? balances[wallet] : {};
  const router = useRouter();
  const [checkWallet, setCheckWallet] = useState({
    checking: false,
    success: false,
    fail: false,
  });

  const [lockQuest, setLockQuest] = useState({
    faucet_token: true,
    trading_quest: true,
  });

  const { toast } = useToast();

  const handleChekcWallet = async () => {
    if (!wallet) {
      try {
        await connectWallet();
      } catch (error) {
        if (error) {
          toast({
            title: "Auro wallet not installed",
            description: "Please install auro wallet to use this feature",
            variant: "destructive",
            className: "text-textBlack bg-white box-shadow border-0 p-4",
          });
        }
        return;
      }
    }
    setCheckWallet({
      ...checkWallet,
      checking: true,
    });
    const balanceMinaRes = await fetch(
      `https://api.minaexplorer.com/accounts/${wallet}`,
    );
    const balanceMina = await balanceMinaRes.json();
    const {
      account: { balance: { total: totalMinaOfAddress = "0" } = {} } = {},
    } = balanceMina;

    if (Number(totalMinaOfAddress) >= 1) {
      setCheckWallet({
        ...checkWallet,
        checking: false,
        success: true,
        fail: false,
      });
      setLockQuest({
        ...lockQuest,
        faucet_token: false,
      });
    } else {
      setCheckWallet({
        ...checkWallet,
        checking: false,
        success: false,
        fail: true,
      });
      setLockQuest({
        ...lockQuest,
        faucet_token: true,
        trading_quest: true,
      });
    }
  };

  // useEffect with async function
  useEffect(() => {
    const initializeWallet = async () => {
      if (wallet) {
        await handleChekcWallet();
        if (
          !lockQuest.faucet_token &&
          ownBalances &&
          ownBalances["0"] !== undefined &&
          parseInt(ownBalances["0"], 10) > 0
        ) {
          setLockQuest((prev) => ({
            ...prev,
            trading_quest: false,
          }));
        }
      }
    };

    initializeWallet();
  }, [wallet, ownBalances, lockQuest.faucet_token]);
  return (
    <>
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
              {!lockQuest.faucet_token && lockQuest.trading_quest ? "2/3" : ""}
              {!lockQuest.trading_quest && "3/3"}
              {lockQuest.faucet_token && lockQuest.trading_quest && "1/3"}
            </span>
            <div className={styleInstruction["progress-bar"]}>
              <div
                className={styleInstruction["active-progress-bar"]}
                style={{
                  width:
                    !lockQuest.faucet_token && !lockQuest.trading_quest
                      ? "100%"
                      : !lockQuest.faucet_token
                        ? "66%"
                        : "33%",
                }}
              ></div>
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
                create DinoDex Wallet (this is just a condition; your account
                will not be charged any fees to create a DinoDex Wallet)
              </span>
            </div>
            <div
              className={`${styleInstruction["btn-quest-campaign"]} 
            ${checkWallet.checking ? styleInstruction["btn-quest-campaign-checking"] : ""}
            ${checkWallet.success ? styleInstruction["btn-quest-campaign-success"] : ""}
            ${checkWallet.fail ? styleInstruction["btn-quest-campaign-fail"] : ""}
            `}
              style={{ position: "relative" }}
              onClick={handleChekcWallet}
            >
              {checkWallet.checking ||
              checkWallet.success ||
              checkWallet.fail ? (
                <img
                  src="/images/campaign/check-icon.svg"
                  alt="check-icon"
                  loading="lazy"
                  className="opacity-0"
                />
              ) : (
                <img
                  src="/images/campaign/check-icon.svg"
                  alt="check-icon"
                  loading="lazy"
                />
              )}
              {checkWallet.checking && (
                <img
                  src="/images/campaign/checking-icon.svg"
                  alt="check-icon"
                  loading="lazy"
                  className={`absolute left-[20px] top-[11px] ${styleInstruction["checking-quest"]}`}
                />
              )}
              {checkWallet.success && (
                <img
                  src="/images/campaign/dou-check-icon.svg"
                  alt="check-icon"
                  loading="lazy"
                  className="absolute left-[16px] top-[8px]"
                />
              )}
              {checkWallet.fail && (
                <img
                  src="/images/campaign/not-enough-icon.svg"
                  alt="check-icon"
                  loading="lazy"
                  className="absolute left-[20px] top-[11px]"
                />
              )}
              <span>
                {checkWallet.checking
                  ? "Checking"
                  : checkWallet.success
                    ? "Proceed"
                    : checkWallet.fail
                      ? "Not enough"
                      : "Check"}
              </span>
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
            className={`${styleInstruction["quest-campaign"]} ${lockQuest.faucet_token ? styleInstruction["lock-quest-campaign"] : ""}`}
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
                Get test tokens instantly in your DinoDex wallet to start
                trading.
              </span>
            </div>
            {lockQuest.faucet_token && (
              <img
                src="/images/campaign/lock-or-icon.svg"
                className={styleInstruction["lock-or-icon"]}
                alt="lock-or-icon"
                loading="lazy"
              />
            )}
            <div
              className={styleInstruction["btn-quest-campaign"]}
              onClick={() => {
                setIsWalletOpen(true);
                if (
                  ownBalances &&
                  ownBalances["0"] !== undefined &&
                  parseInt(ownBalances["0"], 10) > 0
                ) {
                  setLockQuest({
                    ...lockQuest,
                    trading_quest: false,
                  });
                }
              }}
            >
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
            className={`${styleInstruction["quest-campaign"]} ${lockQuest.trading_quest ? styleInstruction["lock-quest-campaign"] : ""}`}
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
            {lockQuest.trading_quest && (
              <img
                src="/images/campaign/lock-or-icon.svg"
                className={styleInstruction["lock-or-icon"]}
                alt="lock-or-icon"
                loading="lazy"
              />
            )}
            <div
              className={styleInstruction["btn-quest-campaign"]}
              onClick={() => router.push("/swap")}
            >
              <span>Launch App</span>
            </div>
          </div>
          <div className={styleInstruction["check-quest-campaign-note"]}>
            <span
              className={
                styleInstruction["title-quest-campaign"] +
                " flex items-center gap-1"
              }
            >
              <Image
                src="/images/swap/warning.svg"
                alt="swap-icon"
                width={18}
                height={18}
              />{" "}
              Note
            </span>
            <span className={styleInstruction["desc-quest-campaign"]}>
              All transactions in the Trading Competition take place on
              DinoDex's Local net, using test tokens that cannot be converted to
              Mainnet or Devnet
            </span>
          </div>
        </div>
      </div>
      <Wallet
        // loadingBalances={loading}
        blockHeight={block?.height}
        address={wallet}
        balances={ownBalances}
        open={isWalletOpen}
        setIsWalletOpen={setIsWalletOpen}
        forceIsWalletOpen={!!wallet}
      />
    </>
  );
}
