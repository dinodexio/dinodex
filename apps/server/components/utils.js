import { PoolKey, TokenPair, prepareGraph, dijkstra } from 'chain';
import { TokenId } from '@proto-kit/library';
import { EXPIRED_TIME, RuntimeMethod } from '../constants';
import BigNumber from 'bignumber.js';
import { PublicKey } from 'o1js';


export function findSurroundingNumbers(arr, num) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] > num && (mid + 1 < arr.length && arr[mid + 1] <= num)) {
      return {
        larger: arr[mid],
        smaller: arr[mid + 1]
      };
    }

    if (arr[mid] <= num) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return null;
}

export const decodeDinodexTxEvent = {
  decodeTransfer: function (data = []) {
    const tokenId = data[0]
    const addressFrom = data[1]
    const isOddFrom = data[2]
    const addressTo = data[3]
    const isOddTo = data[4]
    const amount = data[5]

    return { tokenId, addressFrom, isOddFrom, addressTo, isOddTo, amount }

  },

  decodeSwap: function (data = []) {
    const creator = data[0]
    const isOddCreator = data[1]
    const tokenAId = data[2]
    const tokenBId = data[3]
    const tokenAAmount = data[4]
    const tokenBAmount = data[5]
    const creatorAddress = PublicKey.from({
      x: creator,
      isOdd: isOddCreator
    }).toBase58()
    return {
      creatorAddress,
      creator,
      isOddCreator,
      tokenAId,
      tokenBId,
      tokenAAmount,
      tokenBAmount
    }
  },
  decodeCreatePool: function (data = []) {
    const creator = data[0]
    const isOddCreator = data[1]
    const tokenAId = data[2]
    const tokenBId = data[3]
    const tokenAAmount = data[4]
    const tokenBAmount = data[5]
    const tokenLPAmount = data[6]
    const creatorAddress = PublicKey.from({
      x: creator,
      isOdd: isOddCreator
    }).toBase58()
    return {
      creatorAddress,
      creator,
      isOddCreator,
      tokenAId,
      tokenBId,
      tokenAAmount,
      tokenBAmount,
      tokenLPAmount
    }
  },
  decodeAddLiquityPool: function (data = []) {
    const creator = data[0]
    const isOddCreator = data[1]
    const tokenAId = data[2]
    const tokenBId = data[3]
    const tokenAAmount = data[4]
    const tokenBAmount = data[5]
    const tokenLPAmount = data[6]
    const creatorAddress = PublicKey.from({
      x: creator,
      isOdd: isOddCreator
    }).toBase58()
    return {
      creatorAddress,
      creator,
      isOddCreator,
      tokenAId,
      tokenBId,
      tokenAAmount,
      tokenBAmount,
      tokenLPAmount
    }
  },
  decodeRemoveLiquityPool: function (data = []) {
    const creator = data[0]
    const isOddCreator = data[1]
    const tokenAId = data[2]
    const tokenBId = data[3]
    const tokenAAmount = data[4]
    const tokenBAmount = data[5]
    const tokenLPAmount = data[6]
    const creatorAddress = PublicKey.from({
      x: creator,
      isOdd: isOddCreator
    }).toBase58()
    return {
      creatorAddress,
      creator,
      isOddCreator,
      tokenAId,
      tokenBId,
      tokenAAmount,
      tokenBAmount,
      tokenLPAmount
    }
  },
  decodePoolAction: function (data = []) {
    const creator = data[0]
    const isOddCreator = data[1]
    const tokenAId = data[2]
    const tokenBId = data[3]
    const tokenAAmount = data[4]
    const tokenBAmount = data[5]
    const creatorAddress = PublicKey.from({
      x: creator,
      isOdd: isOddCreator
    }).toBase58()
    return {
      creatorAddress,
      creator,
      isOddCreator,
      tokenAId,
      tokenBId,
      tokenAAmount,
      tokenBAmount,
    }
  },
  decodeTx: function (clientAppchain, tx = {}, maxBlockHeight = 0) {
    const {
      methodId,
      events
    } = tx
    let result = {
      type: null,
      data: null,
      hash: tx.hash,
      sender: tx.sender,
      nonce: tx.nonce,
      blockHash: tx.blockHash,
      status: tx.status,
      statusMessage: tx.statusMessage,
      blockHeight: tx.blockHeight,
      timeStamp: !maxBlockHeight ? new Date().getTime()
        : BigNumber(new Date().getTime()).minus(
          BigNumber(maxBlockHeight || 0).minus(tx.blockHeight || 0).multipliedBy(EXPIRED_TIME)
        ).toNumber()
    }

    if (events.length === 0) {
      return result
    }
    if (RuntimeMethod.isMethodWithId(methodId, RuntimeMethod.SWAP, clientAppchain)) {
      result = {
        ...result,
        type: "swap",
        data: this.convertTxSwap(events)
      }
    }

    if (RuntimeMethod.isMethodWithId(methodId, RuntimeMethod.CREATE_POOL, clientAppchain)) {
      result = {
        ...result,
        type: "createPool",
        data: this.convertTxCreatePool(events)
      }
    }

    if (RuntimeMethod.isMethodWithId(methodId, RuntimeMethod.REMOVE_LIQUIDITY, clientAppchain)) {
      result = {
        ...result,
        type: "removeLiquidity",
        data: this.convertTxRemoveLiquidity(events)
      }
    }

    if (RuntimeMethod.isMethodWithId(methodId, RuntimeMethod.ADD_LIQUIDITY, clientAppchain)) {
      result = {
        ...result,
        type: "addLiquidity",
        data: this.convertTxAddLiquidity(events)
      }
    }
    return result
  },
  convertTxSwap: function (events = [], withPoolKey = false) {
    let result = {
      from: { tokenId: null, amount: null },
      to: { tokenId: null, amount: null }
    }
    const eventTransferIn = events[1]
    const eventTransferOut = events[events.length - 1]
    {
      const { tokenId, amount } = this.decodeTransfer(eventTransferIn.data)
      result = {
        ...result,
        from: { tokenId, amount }
      }
    }
    if (withPoolKey) {
      const routers = []
      let BALANCE_ZERO = "0"
      for (var i = 0; i < events.length - 1; i = i + 2) {
        let itemRoute = {
          poolKey: null,
          from: {
            id: null,
            amount: null,
            amount_usd: null
          },
          to: {
            id: null,
            amount: null,
            amount_usd: null
          },
        }
        const eventSwap = events[i]
        const eventTransfer = events[i + 1]
        const { tokenA, tokenB, creator } = this.decodeSwap(eventSwap.data)

        // TODO if amout swap is Balance Zero then break loop
        if (tokenA.amount === BALANCE_ZERO || tokenB.amount === BALANCE_ZERO) {
          break
        }
        const { addressTo } = this.decodeTransfer(eventTransfer.data)

        itemRoute.poolKey = addressTo
        itemRoute.from = tokenA
        itemRoute.to = tokenB

        routers.push(itemRoute)

      }
      result = {
        ...result,
        routers: routers
      }
    }

    {
      const { tokenId, amount } = this.decodeTransfer(eventTransferOut.data)
      result = {
        ...result,
        to: { tokenId, amount }
      }
    }
    return result
  },
  convertTxCreatePool: function (events = [], withPoolKey = false) {
    let result = {}

    const eventTransferTokenA = events[0]
    const eventTransferTokenB = events[1]
    const eventMintLp = events[2]
    const eventCreatePool = events[3]
    {
      const {
        tokenAId,
        tokenBId,
        tokenAAmount,
        tokenBAmount,
        creator
      } = this.decodeCreatePool(eventCreatePool.data)
      const tokenPair = TokenPair.from(TokenId.from(tokenAId), TokenId.from(tokenBId))
      result = {
        ...result,
        tokenA: tokenBId === tokenPair.tokenBId.toString() ? { id: tokenBId, amount: tokenBAmount } : { id: tokenAId, amount: tokenAAmount },
        tokenB: tokenAId === tokenPair.tokenAId.toString() ? { id: tokenAId, amount: tokenAAmount } : { id: tokenBId, amount: tokenBAmount },
      }
      if (withPoolKey) {
        result = { ...result, poolKey: PoolKey.fromTokenPair(tokenPair).toBase58() }
      }
    }
    return result
  },
  convertTxRemoveLiquidity: function (events = [], withPoolKey = false) {
    let result = {}

    const eventTransferTokenA = events[0]
    const eventTransferTokenB = events[1]
    const eventMintLp = events[2]
    const eventRemoveLiquityPool = events[3]
    {
      const {
        tokenAId,
        tokenBId,
        tokenAAmount,
        tokenBAmount,
        creator
      } = this.decodeRemoveLiquityPool(eventRemoveLiquityPool.data)
      const tokenPair = TokenPair.from(TokenId.from(tokenAId), TokenId.from(tokenBId))

      result = {
        ...result,
        tokenA: tokenBId === tokenPair.tokenBId.toString() ? { id: tokenBId, amount: tokenBAmount } : { id: tokenAId, amount: tokenAAmount },
        tokenB: tokenAId === tokenPair.tokenAId.toString() ? { id: tokenAId, amount: tokenAAmount } : { id: tokenBId, amount: tokenBAmount },
      }
      if (withPoolKey) {
        result = { ...result, poolKey: PoolKey.fromTokenPair(tokenPair).toBase58() }
      }
    }

    return result
  },
  convertTxAddLiquidity: function (events = [], withPoolKey = false) {
    let result = {}

    const eventTransferTokenA = events[0]
    const eventTransferTokenB = events[1]
    const eventMintLp = events[2]
    const eventAddLiquityPool = events[3]
    {
      const {
        tokenAId,
        tokenBId,
        tokenAAmount,
        tokenBAmount,
        creator
      } = this.decodeAddLiquityPool(eventAddLiquityPool.data)
      const tokenPair = TokenPair.from(TokenId.from(tokenAId), TokenId.from(tokenBId))
      result = {
        ...result,
        tokenA: tokenBId === tokenPair.tokenBId.toString() ? { id: tokenBId, amount: tokenBAmount } : { id: tokenAId, amount: tokenAAmount },
        tokenB: tokenAId === tokenPair.tokenAId.toString() ? { id: tokenAId, amount: tokenAAmount } : { id: tokenBId, amount: tokenBAmount },
      }
      if (withPoolKey) {
        result = { ...result, poolKey: PoolKey.fromTokenPair(tokenPair).toBase58() }
      }
    }
    return result
  },
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function createPoolKeyFromTokenAB(tokenAId, tokenBId) {
  return PoolKey.fromTokenPair(TokenPair.from(TokenId.from(tokenAId), TokenId.from(tokenBId))).toBase58();
}

export function addPrecision(value) {
  return BigNumber(value).multipliedBy(1e9).toString()
}

export function revertPrecision(value) {
  return BigNumber(value).dividedBy(1e9).toNumber()
}
