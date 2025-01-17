import { BlockHandler } from "@proto-kit/processor";
import { PrismaClient } from "@prisma/client-processor";
import { appChain } from "../../utils/app-chain";
import { MethodParameterEncoder } from "@proto-kit/module";
import { Block, TransactionExecutionResult } from "@proto-kit/sequencer";
import { Balance, TokenId } from "@proto-kit/library";
import { TokenPair } from "../../../runtime/modules/dex/token-pair";
import { PoolKey } from "../../../runtime/modules/dex/pool-key";
import { TYPE_POOL_ACTIONS } from "../../utils/constants";
import { dijkstra, prepareGraph } from "../../../runtime/modules/dex/router";
import { LPTokenId } from "../../../runtime/modules/dex/lp-token-id"
import BigNumber from "bignumber.js";
import { Bool, Field, PublicKey } from "o1js";
import { PathProcessor, upsertBalance } from "../../utils/util";

type RouterSwapValueType = {
  poolKey: string
  eventIndex: number | null
  from: { id: string, amount: string }
  to: { id: string, amount: string }
}

type PoolType = {
  tokenAId: string,
  tokenBId: string,
  tokenAAmount: string
  tokenBAmount: string
}

const STABLE_COIN_USDT = "0"


const getCreatorAddress = (publicKey: Field, isOddCreator: Field) => {
  const creatorAddress = PublicKey.from({
    x: publicKey,
    isOdd: Bool(isOddCreator.value)
  })

  return creatorAddress.toBase58()
}

export const calculatePriceToken = (pools: PoolType[], vector: string[]) => {
  let rateTokenWithTokenBase = BigNumber(1)
  if (vector.length == 0) return rateTokenWithTokenBase.toNumber()
  for (var i = 0; i < vector.length - 1; i++) {
    const tokenOne = vector[i]
    const tokenTwo = vector[i + 1]
    const pool = pools.find(pool => (
      [pool.tokenAId, pool.tokenBId].includes(tokenOne)
      && [pool.tokenAId, pool.tokenBId].includes(tokenTwo)
    ))
    if (!pool) return false
    const tokenOneAmount = pool.tokenAId == tokenOne ? pool.tokenAAmount : pool.tokenBAmount
    const tokenTwoAmount = pool.tokenAId == tokenOne ? pool.tokenBAmount : pool.tokenAAmount
    rateTokenWithTokenBase = BigNumber(tokenTwoAmount).multipliedBy(rateTokenWithTokenBase).dividedBy(tokenOneAmount)
  }
  return rateTokenWithTokenBase.toNumber()
}

export const handleXYKSwap = async (
  client: Parameters<BlockHandler<PrismaClient>>[0],
  block: Block,
  tx: TransactionExecutionResult
) => {
  const routers: RouterSwapValueType[] = []
  for (var i = 0; i < tx.events.length - 1; i = i + 2) {
    let itemRoute: RouterSwapValueType = {
      poolKey: "",
      eventIndex: null,
      from: {
        id: "",
        amount: ""
      },
      to: {
        id: "",
        amount: ""
      },
    }
    const eventSwap = tx.events[i]
    const eventTransfer = tx.events[i + 1]
    const [
      creator,
      isOddCreator,
      tokenFromId,
      tokenToId,
      tokenFromAmount,
      tokenToAmount
    ] = eventSwap.data

    // TODO if amount swap is Balance Zero then break loop
    if (tokenFromAmount.toBigInt() === BigInt(0) || tokenToAmount.toBigInt() === BigInt(0)) {
      break
    }

    // update Balance waitForUpdate
    const addressWallet = tx.tx.sender
    tx.status.toBoolean() && await upsertBalance(client, tx.stateTransitions, addressWallet, [tokenFromId, tokenToId])

    const tokenPair = TokenPair.from(TokenId.from(tokenFromId), TokenId.from(tokenToId))
    const poolKey = PoolKey.fromTokenPair(tokenPair)

    itemRoute.poolKey = poolKey.toBase58()
    itemRoute.from = {
      id: tokenFromId.toString(),
      amount: tokenFromAmount.toString()
    }
    itemRoute.to = {
      id: tokenToId.toString(),
      amount: tokenToAmount.toString()
    }
    itemRoute.eventIndex = i
    routers.push(itemRoute)
  }


  // Process Price
  let tokenPrices: { [key: string]: number | null } = {}
  {
    const tokenIdsJoinSwap = [...new Set(routers.map(route => [route.from.id, route.to.id]).flat())]
    const vectorPrice = await client.routeStable.findMany({
      select: {
        vector: true,
        tokenId: true,
        tokenStableId: true
      },
      where: {
        tokenId: { in: tokenIdsJoinSwap }
      }
    })
    const poolKeysOfVector: string[] = vectorPrice.reduce((poolKeyResults: string[], curVector) => {
      if (Array.isArray(curVector.vector)) {
        for (let i = 0; i < curVector.vector.length - 1; i++) {
          const tokenAId = curVector.vector[i]
          const tokenBId = curVector.vector[i + 1]
          if (tokenAId && tokenBId) {
            const tokenPair = TokenPair.from(TokenId.from(tokenAId.toString()), TokenId.from(tokenBId.toString()))
            const poolKey = PoolKey.fromTokenPair(tokenPair)
            poolKeyResults.push(poolKey.toBase58())
          }
        }
      }
      return poolKeyResults
    }, [])
    const poolsOfVector: PoolType[] = await client.pool.findMany({
      select: {
        tokenAId: true,
        tokenBId: true,
        tokenAAmount: true,
        tokenBAmount: true,
      },
      where: {
        poolKey: {
          in: poolKeysOfVector
        }
      }
    })

    for (let i = 0; i < vectorPrice.length; i++) {
      const vectorInfo = vectorPrice[i]
      const priceToken = calculatePriceToken(poolsOfVector, vectorInfo.vector as string[])
      priceToken && (tokenPrices[vectorInfo.tokenId] = priceToken)
      tx.status.toBoolean() && priceToken && await client.token.upsert({
        create: {
          tokenId: vectorInfo.tokenId,
          price: priceToken
        },
        update: {
          price: priceToken
        },
        where: {
          tokenId: vectorInfo.tokenId
        }
      })

      tx.status.toBoolean() && priceToken && await client.historyToken.create({
        data: {
          tokenId: vectorInfo.tokenId,
          tokenStableId: vectorInfo.tokenStableId,
          price: priceToken,
          blockHeight: Number(block.height)
        }
      })
    }
  }

  // Process insert to PoolAction
  for (let router of routers) {
    const tokenPair = TokenPair.from(
      TokenId.from(router.from.id),
      TokenId.from(router.to.id)
    )

    const isAFrom = tokenPair.tokenAId.toString() === router.from.id

    const newAmountTokenFromId =
      PathProcessor.searchStateTransaction(
        tx.stateTransitions,
        PathProcessor.balancesPool({
          tokenIdTarget: TokenId.from(router.from.id),
          tokenAId: TokenId.from(router.from.id),
          tokenBId: TokenId.from(router.to.id)
        })
      )

    const newAmountTokenToId =
      PathProcessor.searchStateTransaction(
        tx.stateTransitions,
        PathProcessor.balancesPool({
          tokenIdTarget: TokenId.from(router.to.id),
          tokenAId: TokenId.from(router.from.id),
          tokenBId: TokenId.from(router.to.id)
        })
      )

    const newTokenAAmount = isAFrom
      ? newAmountTokenFromId
      : newAmountTokenToId

    const newTokenBAmount = !isAFrom
      ? newAmountTokenFromId
      : newAmountTokenToId


    tx.status.toBoolean() && await client.pool.update({
      data: {
        tokenAAmount: newTokenAAmount.toString(),
        tokenBAmount: newTokenBAmount.toString(),
        updateBlockHeight: Number(block.height.toString())
      },
      where: {
        poolKey: router.poolKey
      }
    });

    await client.poolAction.create({
      data: {
        hash: tx.tx.hash().toString(),
        blockHeight: Number(block.height),
        creator: tx.tx.sender.toBase58(),
        status: tx.status.toBoolean(),
        eventIndex: router.eventIndex || 0,
        poolKey: router.poolKey,
        directionAB: isAFrom,
        type: TYPE_POOL_ACTIONS.SWAP,
        tokenAId: tokenPair.tokenAId.toString(),
        tokenBId: tokenPair.tokenBId.toString(),
        tokenAAmount: isAFrom ? router.from.amount.toString() : router.to.amount.toString(),
        tokenBAmount: !isAFrom ? router.from.amount.toString() : router.to.amount.toString(),
        tokenAPrice: tokenPrices[tokenPair.tokenAId.toString()] || 0,
        tokenBPrice: tokenPrices[tokenPair.tokenBId.toString()] || 0
      }
    });

    tx.status.toBoolean() && await client.historyPool.create({
      data: {
        hash: tx.tx.hash().toString(),
        blockHeight: Number(block.height),
        poolKey: router.poolKey,
        tokenAId: tokenPair.tokenAId.toString(),
        tokenAAmount: newTokenAAmount.toString(),
        tokenAPrice: tokenPrices[tokenPair.tokenAId.toString()] || 0,
        tokenBId: tokenPair.tokenBId.toString(),
        tokenBAmount: newTokenBAmount.toString(),
        tokenBPrice: tokenPrices[tokenPair.tokenBId.toString()] || 0,
      }
    })
  }
}

export const handleXYKCreatePool = async (
  client: Parameters<BlockHandler<PrismaClient>>[0],
  block: Block,
  tx: TransactionExecutionResult
) => {

  // Init price StableCoin
  {
    tx.status.toBoolean() && await client.token.upsert({
      create: {
        tokenId: STABLE_COIN_USDT,
        price: 1
      },
      update: {
        price: 1
      },
      where: {
        tokenId: STABLE_COIN_USDT
      }
    })

    tx.status.toBoolean() && await client.routeStable.upsert({
      create: {
        tokenId: STABLE_COIN_USDT,
        tokenStableId: STABLE_COIN_USDT,
        vector: []
      },
      update: {
        vector: []
      },
      where: {
        tokenId_tokenStableId: {
          tokenId: STABLE_COIN_USDT,
          tokenStableId: STABLE_COIN_USDT
        }
      }
    })
  }
  const module = appChain.runtime.resolve("XYK");
  const parameterDecoder = MethodParameterEncoder.fromMethod(
    module,
    "createPoolSigned"
  );

  // @ts-expect-error
  const [tokenAId, tokenBId, tokenAAmount, tokenBAmount]: [TokenId, TokenId, Balance, Balance] =
    await parameterDecoder.decode(tx.tx.argsFields, tx.tx.auxiliaryData);

  const tokenPair = TokenPair.from(TokenId.from(tokenAId), TokenId.from(tokenBId))
  const poolKey = PoolKey.fromTokenPair(tokenPair)
  const isVectorAB = tokenPair.tokenAId.toString() === tokenAId.toString()

  tx.status.toBoolean() && await client.pool.create({
    data: {
      poolKey: poolKey.toBase58(),
      tokenAId: tokenPair.tokenAId.toString(),
      tokenBId: tokenPair.tokenBId.toString(),
      tokenAAmount: isVectorAB ? tokenAAmount.toString() : tokenBAmount.toString(),
      tokenBAmount: !isVectorAB ? tokenAAmount.toString() : tokenBAmount.toString(),
      path: [tokenPair.tokenAId.toString(), tokenPair.tokenBId.toString()],
      blockHeight: Number(block.height.toString()),
      updateBlockHeight: Number(block.height.toString())
    },
  });

  // update Balance waitForUpdate
  const lpTokenId = LPTokenId.fromTokenPair(tokenPair)
  const addressWallet = tx.tx.sender
  tx.status.toBoolean() && await upsertBalance(client, tx.stateTransitions, addressWallet, [tokenAId, tokenBId, lpTokenId])

  // Process Price
  let tokenPrices: { [key: string]: number | null } = {}
  {
    const allPool = await client.pool.findMany({
      select: {
        path: true,
        tokenAId: true,
        tokenBId: true,
        tokenAAmount: true,
        tokenBAmount: true
      }
    })
    const allPath: [string, string][] = allPool.reduce((resultPath: [string, string][], curPool) => {
      if (curPool.path) {
        resultPath.push(curPool.path as [string, string])
      }
      return resultPath
    }, [])

    // Add new path for pool
    allPath.push([tokenAId.toString(), tokenBId.toString()])

    if (allPath.length > 0 && tx.status.toBoolean()) {
      const graph = prepareGraph(allPath)
      let routeTokenA = dijkstra(graph, tokenPair.tokenAId.toString(), STABLE_COIN_USDT)
      let routeTokenB = dijkstra(graph, tokenPair.tokenBId.toString(), STABLE_COIN_USDT)

      if (!routeTokenA && (tokenPair.tokenAId.toString() === STABLE_COIN_USDT )) {
        routeTokenA = {
          distance: 0,
          path: []
        }
      }

      if (!routeTokenB && (tokenPair.tokenBId.toString() === STABLE_COIN_USDT )) {
        routeTokenB = {
          distance: 0,
          path: []
        }
      }
      if (routeTokenA) {
        const vectorA = [tokenPair.tokenAId.toString(), ...routeTokenA.path]
        tx.status.toBoolean() && routeTokenA && await client.routeStable.upsert({
          where: {
            tokenId_tokenStableId: {
              tokenId: tokenPair.tokenAId.toString(),
              tokenStableId: STABLE_COIN_USDT
            }
          },
          create: {
            tokenId: tokenPair.tokenAId.toString(),
            tokenStableId: STABLE_COIN_USDT,
            vector: vectorA
          },
          update: {
            vector: vectorA
          }
        })

        const priceA = calculatePriceToken(allPool, vectorA)
        priceA && (tokenPrices[tokenPair.tokenAId.toString()] = priceA)
        tx.status.toBoolean() && priceA && await client.token.upsert({
          create: {
            tokenId: tokenPair.tokenAId.toString(),
            price: priceA
          },
          update: {
            price: priceA
          },
          where: {
            tokenId: tokenPair.tokenAId.toString()
          }
        })

        tx.status.toBoolean() && priceA && await client.historyToken.create({
          data: {
            tokenId: tokenPair.tokenAId.toString(),
            tokenStableId: STABLE_COIN_USDT,
            price: priceA,
            blockHeight: Number(block.height)
          }
        })
      }

      if (routeTokenB) {
        const vectorB = [tokenPair.tokenBId.toString(), ...routeTokenB.path]

        tx.status.toBoolean() && await client.routeStable.upsert({
          where: {
            tokenId_tokenStableId: {
              tokenId: tokenPair.tokenBId.toString(),
              tokenStableId: STABLE_COIN_USDT
            }
          },
          create: {
            tokenId: tokenPair.tokenBId.toString(),
            tokenStableId: STABLE_COIN_USDT,
            vector: vectorB
          },
          update: {
            vector: vectorB
          }
        })

        const priceB = calculatePriceToken(allPool, vectorB)
        priceB && (tokenPrices[tokenPair.tokenBId.toString()] = priceB)
        tx.status.toBoolean() && priceB && await client.token.upsert({
          create: {
            tokenId: tokenPair.tokenBId.toString(),
            price: priceB
          },
          update: {
            price: priceB
          },
          where: {
            tokenId: tokenPair.tokenBId.toString()
          }
        })

        tx.status.toBoolean() && priceB && await client.historyToken.create({
          data: {
            tokenId: tokenPair.tokenBId.toString(),
            tokenStableId: STABLE_COIN_USDT,
            price: priceB,
            blockHeight: Number(block.height)
          }
        })
      }
    }
  }

  const newTokenAAmount = PathProcessor.searchStateTransaction(
    tx.stateTransitions,
    PathProcessor.balancesPool({
      tokenIdTarget: tokenPair.tokenAId,
      tokenAId: tokenPair.tokenAId,
      tokenBId: tokenPair.tokenBId,
    })
  )

  const newTokenBAmount = PathProcessor.searchStateTransaction(
    tx.stateTransitions,
    PathProcessor.balancesPool({
      tokenIdTarget: tokenPair.tokenBId,
      tokenAId: tokenPair.tokenAId,
      tokenBId: tokenPair.tokenBId,
    })
  )

  await client.poolAction.create({
    data: {
      hash: tx.tx.hash().toString(),
      blockHeight: Number(block.height),
      creator: tx.tx.sender.toBase58(),
      status: tx.status.toBoolean(),
      eventIndex: 3,
      poolKey: poolKey.toBase58(),
      directionAB: false,
      type: TYPE_POOL_ACTIONS.CREATE_POOL,
      tokenAId: tokenPair.tokenAId.toString(),
      tokenBId: tokenPair.tokenBId.toString(),
      tokenAAmount: newTokenAAmount.toString(),
      tokenBAmount: newTokenBAmount.toString(),
      tokenAPrice: tokenPrices[tokenPair.tokenAId.toString()] || 0,
      tokenBPrice: tokenPrices[tokenPair.tokenBId.toString()] || 0
    }
  });

  tx.status.toBoolean() && await client.historyPool.create({
    data: {
      hash: tx.tx.hash().toString(),
      blockHeight: Number(block.height),
      poolKey: poolKey.toBase58(),
      tokenAId: tokenPair.tokenAId.toString(),
      tokenAAmount: newTokenAAmount.toString(),
      tokenAPrice: tokenPrices[tokenPair.tokenAId.toString()] || 0,
      tokenBId: tokenPair.tokenBId.toString(),
      tokenBAmount: newTokenBAmount.toString(),
      tokenBPrice: tokenPrices[tokenPair.tokenBId.toString()] || 0,
    }
  })

}

export const handleXYKAddLiquidity = async (
  client: Parameters<BlockHandler<PrismaClient>>[0],
  block: Block,
  tx: TransactionExecutionResult
) => {
  const indexEvent = 3
  const eventAddLiquidityPool = tx.events[indexEvent]
  const [
    creator,
    isOddCreator,
    tokenAId,
    tokenBId,
    tokenAAmount,
    tokenBAmount,
    tokenLPAmount
  ] = eventAddLiquidityPool.data

  const tokenPair = TokenPair.from(TokenId.from(tokenAId), TokenId.from(tokenBId))
  const poolKey = PoolKey.fromTokenPair(tokenPair)
  const isVectorAB = tokenPair.tokenAId.toString() === tokenAId.toString()

  // update Balance waitForUpdate
  const lpTokenId = LPTokenId.fromTokenPair(tokenPair)
  const addressWallet = tx.tx.sender
  tx.status.toBoolean() && await upsertBalance(client, tx.stateTransitions, addressWallet, [tokenAId, tokenBId, lpTokenId])

  const newTokenAAmount = PathProcessor.searchStateTransaction(
    tx.stateTransitions,
    PathProcessor.balancesPool({
      tokenIdTarget: tokenPair.tokenAId,
      tokenAId: tokenPair.tokenAId,
      tokenBId: tokenPair.tokenBId,
    })
  )

  const newTokenBAmount = PathProcessor.searchStateTransaction(
    tx.stateTransitions,
    PathProcessor.balancesPool({
      tokenIdTarget: tokenPair.tokenBId,
      tokenAId: tokenPair.tokenAId,
      tokenBId: tokenPair.tokenBId,
    })
  )

  tx.status.toBoolean() && await client.pool.update({
    data: {
      tokenAAmount: newTokenAAmount.toString(),
      tokenBAmount: newTokenBAmount.toString(),
      updateBlockHeight: Number(block.height.toString())
    },
    where: {
      poolKey: poolKey.toBase58()
    }
  });

  const tokenPrices = await client.token.findMany({
    where: {
      OR: [
        { tokenId: tokenPair.tokenAId.toString() },
        { tokenId: tokenPair.tokenBId.toString() }
      ]
    }
  })
  await client.poolAction.create({
    data: {
      hash: tx.tx.hash().toString(),
      blockHeight: Number(block.height),
      creator: tx.tx.sender.toBase58(),
      status: tx.status.toBoolean(),
      eventIndex: indexEvent,
      poolKey: poolKey.toBase58(),
      directionAB: false,
      type: TYPE_POOL_ACTIONS.ADD_LIQUIDITY,
      tokenAId: tokenPair.tokenAId.toString(),
      tokenBId: tokenPair.tokenBId.toString(),
      tokenAAmount: isVectorAB ? tokenAAmount.toString() : tokenBAmount.toString(),
      tokenBAmount: !isVectorAB ? tokenAAmount.toString() : tokenBAmount.toString(),
      tokenAPrice: tokenPrices.find((token) => token.tokenId === tokenPair.tokenAId.toString())?.price || 0,
      tokenBPrice: tokenPrices.find((token) => token.tokenId === tokenPair.tokenBId.toString())?.price || 0
    }
  });

  tx.status.toBoolean() && await client.historyPool.create({
    data: {
      hash: tx.tx.hash().toString(),
      blockHeight: Number(block.height),
      poolKey: poolKey.toBase58(),
      tokenAId: tokenPair.tokenAId.toString(),
      tokenAAmount: newTokenAAmount.toString(),
      tokenAPrice: tokenPrices.find((token) => token.tokenId === tokenPair.tokenAId.toString())?.price || 0,
      tokenBId: tokenPair.tokenBId.toString(),
      tokenBAmount: newTokenBAmount.toString(),
      tokenBPrice: tokenPrices.find((token) => token.tokenId === tokenPair.tokenBId.toString())?.price || 0,
    }
  })
}


export const handleXYKRemoveLiquidity = async (
  client: Parameters<BlockHandler<PrismaClient>>[0],
  block: Block,
  tx: TransactionExecutionResult
) => {
  const indexEvent = 3
  const eventRemoveLiquidityPool = tx.events[indexEvent]
  const [
    creator,
    isOddCreator,
    tokenAId,
    tokenBId,
    tokenAAmount,
    tokenBAmount,
    tokenLPAmount
  ] = eventRemoveLiquidityPool.data

  const tokenPair = TokenPair.from(TokenId.from(tokenAId), TokenId.from(tokenBId))
  const poolKey = PoolKey.fromTokenPair(tokenPair)
  const isVectorAB = tokenPair.tokenAId.toString() === tokenAId.toString()

  // update Balance waitForUpdate
  const lpTokenId = LPTokenId.fromTokenPair(tokenPair)
  const addressWallet = tx.tx.sender
  tx.status.toBoolean() && await upsertBalance(client, tx.stateTransitions, addressWallet, [tokenAId, tokenBId, lpTokenId])

  const newTokenAAmount = PathProcessor.searchStateTransaction(
    tx.stateTransitions,
    PathProcessor.balancesPool({
      tokenIdTarget: tokenPair.tokenAId,
      tokenAId: tokenPair.tokenAId,
      tokenBId: tokenPair.tokenBId,
    })
  )

  const newTokenBAmount = PathProcessor.searchStateTransaction(
    tx.stateTransitions,
    PathProcessor.balancesPool({
      tokenIdTarget: tokenPair.tokenBId,
      tokenAId: tokenPair.tokenAId,
      tokenBId: tokenPair.tokenBId,
    })
  )

  tx.status.toBoolean() && await client.pool.update({
    data: {
      tokenAAmount: newTokenAAmount.toString(),
      tokenBAmount: newTokenBAmount.toString(),
      updateBlockHeight: Number(block.height.toString())
    },
    where: {
      poolKey: poolKey.toBase58()
    }
  });

  const tokenPrices = await client.token.findMany({
    where: {
      OR: [
        { tokenId: tokenPair.tokenAId.toString() },
        { tokenId: tokenPair.tokenBId.toString() }
      ]
    }
  })
  await client.poolAction.create({
    data: {
      hash: tx.tx.hash().toString(),
      blockHeight: Number(block.height),
      creator: tx.tx.sender.toBase58(),
      status: tx.status.toBoolean(),
      eventIndex: indexEvent,
      poolKey: poolKey.toBase58(),
      directionAB: false,
      type: TYPE_POOL_ACTIONS.REMOVE_LIQUIDITY,
      tokenAId: tokenPair.tokenAId.toString(),
      tokenBId: tokenPair.tokenBId.toString(),
      tokenAAmount: isVectorAB ? tokenAAmount.toString() : tokenBAmount.toString(),
      tokenBAmount: !isVectorAB ? tokenAAmount.toString() : tokenBAmount.toString(),
      tokenAPrice: tokenPrices.find((token) => token.tokenId === tokenPair.tokenAId.toString())?.price || 0,
      tokenBPrice: tokenPrices.find((token) => token.tokenId === tokenPair.tokenBId.toString())?.price || 0
    }
  });
  tx.status.toBoolean() && await client.historyPool.create({
    data: {
      hash: tx.tx.hash().toString(),
      blockHeight: Number(block.height),
      poolKey: poolKey.toBase58(),
      tokenAId: tokenPair.tokenAId.toString(),
      tokenAAmount: newTokenAAmount.toString(),
      tokenAPrice: tokenPrices.find((token) => token.tokenId === tokenPair.tokenAId.toString())?.price || 0,
      tokenBId: tokenPair.tokenBId.toString(),
      tokenBAmount: newTokenBAmount.toString(),
      tokenBPrice: tokenPrices.find((token) => token.tokenId === tokenPair.tokenBId.toString())?.price || 0,
    }
  })
}