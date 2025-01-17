import { BlockHandler } from "@proto-kit/processor";
import { PrismaClient } from "@prisma/client-processor";
import { appChain } from "../../utils/app-chain";
import { MethodParameterEncoder } from "@proto-kit/module";
import { Block, TransactionExecutionResult } from "@proto-kit/sequencer";
import { Balance, TokenId } from "@proto-kit/library";
import { Provable, PublicKey } from "o1js";

export const handleBalancesAddBalance = async (
  client: Parameters<BlockHandler<PrismaClient>>[0],
  block: Block,
  tx: TransactionExecutionResult
) => {
  // 
};
