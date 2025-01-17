import { BlockHandler } from "@proto-kit/processor";
import { PrismaClient } from "@prisma/client-processor";
import { BalancesKey, TokenId } from "@proto-kit/library";
import { Field, FlexibleProvablePure, PublicKey } from "o1js";
import { Path } from "@proto-kit/protocol";
import { PoolKey } from "../../runtime/modules/dex/pool-key";
import { TokenPair } from "../../runtime/modules/dex/token-pair";
import { UntypedStateTransition } from "@proto-kit/sequencer";

export const upsertBalance = async (
  client: Parameters<BlockHandler<PrismaClient>>[0],
  stateTransitions: UntypedStateTransition[],
  address: PublicKey,
  tokenIds: TokenId[]
) => {
  for (let i = 0; i < tokenIds.length; i++) {
    const tokenId = tokenIds[i]
    const newAmountBalanceTokenId =
      PathProcessor.searchStateTransaction(
        stateTransitions,
        PathProcessor.balancesAddress({
          tokenId: tokenId,
          address: address
        })
      )

    await client.balance.upsert({
      create: {
        address: address.toBase58(),
        tokenId: tokenId.toString(),
        amount: newAmountBalanceTokenId.toString(),
        waitForUpdate: false
      },
      update: {
        amount: newAmountBalanceTokenId.toString(),
        waitForUpdate: false
      },
      where: {
        address_tokenId: {
          address: address.toBase58(),
          tokenId: tokenId.toString()
        }
      }
    })
  }
}

export const PathProcessor = {
  pathStateMap: function (
    className: string,
    propertyKey: string,
    keyType: FlexibleProvablePure<any>,
    key: any
  ) {
    const pathProperty = Path.fromProperty(className, propertyKey)
    return Path.fromKey(
      pathProperty,
      keyType,
      key
    )
  },
  balancesAddressVal: function ({
    tokenId,
    addressBigInt,
    isOdd = 0
  }: {
    tokenId: TokenId,
    addressBigInt: bigint | number | string,
    isOdd: boolean | number
  }) {
    return this.pathStateMap(
      "Balances", "balances",
      BalancesKey, BalancesKey.from(
        tokenId,
        PublicKey.from({
          x: Field.from(addressBigInt),
          isOdd: Boolean(isOdd)
        })
      )
    )
  },
  balancesAddress: function ({
    tokenId,
    address
  }: {
    tokenId: TokenId,
    address: PublicKey
  }) {
    return this.pathStateMap(
      "Balances", "balances",
      BalancesKey, BalancesKey.from(
        tokenId,
        address
      )
    )
  },
  balancesPool: function ({
    tokenIdTarget,
    tokenAId,
    tokenBId
  }: {
    tokenIdTarget: TokenId,
    tokenAId: TokenId,
    tokenBId: TokenId
  }) {
    const poolKeys = PoolKey.fromTokenPair(
      TokenPair.from(
        tokenAId,
        tokenBId
      )
    )
    return this.pathStateMap(
      "Balances", "balances",
      BalancesKey, BalancesKey.from(
        tokenIdTarget,
        poolKeys
      )
    )
  },
  searchStateTransaction: function (
    stateTransitions: UntypedStateTransition[],
    path: string | Field
  ) {
    return stateTransitions
      .find((st) => st.toValue.isSome.toBoolean() && st.path.equals(path).toBoolean())
      ?.toValue.value.reverse().shift() || Field.empty()
  }
}