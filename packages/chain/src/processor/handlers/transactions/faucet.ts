import { BlockHandler } from "@proto-kit/processor";
import { PrismaClient } from "@prisma/client-processor";
import { Block, TransactionExecutionResult } from "@proto-kit/sequencer";
import { TokenId } from "@proto-kit/library";
import { Bool, PublicKey } from "o1js";
import { upsertBalance } from "../../utils/util";

export const handleFaucetDripBundleTo = async (
  client: Parameters<BlockHandler<PrismaClient>>[0],
  block: Block,
  tx: TransactionExecutionResult
) => {
  let addressWallet = PublicKey.empty()
  let tokenIds: TokenId[] = []
  for (let i = 0; i < tx.events.length; i++) {
    const event = tx.events[i]
    if (event.eventName === 'mint') {
      const [
        tokenId,
        address,
        isOddAddress,
        amount
      ] = event.data

      addressWallet = PublicKey.from({
        x: address,
        isOdd: Bool(isOddAddress.value)
      })
      tokenIds.push(TokenId.from(tokenId.toString()))
    }
  }
  tx.status.toBoolean() && await upsertBalance(client, tx.stateTransitions, addressWallet, tokenIds)
};

export const handleFaucetDripSignedTo = async (
  client: Parameters<BlockHandler<PrismaClient>>[0],
  block: Block,
  tx: TransactionExecutionResult
) => {
  let addressWallet = PublicKey.empty()
  let tokenIds: TokenId[] = []
  for (let i = 0; i < tx.events.length; i++) {
    const event = tx.events[i]
    if (event.eventName === 'mint') {
      const [
        tokenId,
        address,
        isOddAddress,
        amount
      ] = event.data

      addressWallet = PublicKey.from({
        x: address,
        isOdd: Bool(isOddAddress.value)
      })
      tokenIds.push(TokenId.from(tokenId.toString()))
    }
  }
  tx.status.toBoolean() && await upsertBalance(client, tx.stateTransitions, addressWallet, tokenIds)
};
