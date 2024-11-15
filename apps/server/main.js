import pg from 'pg'
import cors from 'cors'
import express from 'express'
// import { Pools } from "./tokens"
import { client as clientApp, dijkstra, PoolKey, prepareGraph, TokenPair } from "chain";
import { MethodIdResolver } from "@proto-kit/module";
import { promises as fs } from 'fs';
import { Mutex } from 'async-mutex';
import { BalancesKey, TokenId } from "@proto-kit/library";
import BigNumber from 'bignumber.js';

import { PRICE_TOKENS } from './constants';

import { dinodex_pool_action_collection, dinodex_pool_list_collection } from './db';


const { Client } = pg
const app = express()
await clientApp.start()

app.use(cors())
const PORT = process.env.NEXT_PUBLIC_SERVER_APP_PORT || 3333
const HOST = process.env.SERVER_APP_HOST || "http://localhost"
const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  schema: "public"
});

client.connect()

const NULL_TX = { hash: null };
const BLOCK_TIME = 5
const RuntimeMethod = {
  SWAP: {
    moduleName: "XYK",
    methodName: "sellPathSigned"
  },
  CREATE_POOL: {
    moduleName: "XYK",
    methodName: "createPoolSigned"
  },
  ADD_LIQUIDITY: {
    moduleName: "XYK",
    methodName: "addLiquiditySigned"
  },
  REMOVE_LIQUIDITY: {
    moduleName: "XYK",
    methodName: "removeLiquiditySigned"
  },
  getMethodId: function ({ moduleName, methodName }) {
    const methodIdResolverModule = clientApp.resolveOrFail("MethodIdResolver", MethodIdResolver)
    return methodIdResolverModule.getMethodId(moduleName, methodName).toString()
  },
  getMethodNameFromId: function (methodId) {
    const methodIdResolverModule = clientApp.resolveOrFail("MethodIdResolver", MethodIdResolver)
    return methodIdResolverModule.getMethodNameFromId(BigInt(methodId))
  },
  isMethodWithId: function (methodId, methodCheck) {
    const [moduleNameTarget, methodNameTarget] = this.getMethodNameFromId(methodId)
    return methodCheck.moduleName === moduleNameTarget && methodCheck.methodName === methodNameTarget
  }
}

const Utils = {
  addPrecision: function (value) {
    return BigNumber(value).multipliedBy(1e9).toString()
  },
  revertPrecision: function (value) {
    return BigNumber(value).dividedBy(1e9).toNumber()
  },
  getPriceTokens: function (tokenId) {
    const { [tokenId]: { usd = null } = {} } = PRICE_TOKENS
    return usd
  },
  getAmountToken: function (amount, tokenId) {
    return BigNumber(this.revertPrecision(amount)).multipliedBy(this.getPriceTokens(tokenId)).toString()
  },
  getBalance: async function (tokenId, address) {
    const balanceKey = new BalancesKey({ tokenId: TokenId.from(tokenId), address: address })
    const balance = await clientApp.query.runtime.Balances.balances.get(balanceKey)
    return balance
  },
  getDecodeTx: function (tx = {}) {
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
      timeStamp: !MemoBlock.maxBlockHeight ? new Date().getTime()
        : BigNumber(new Date().getTime()).minus(
          BigNumber(MemoBlock.maxBlockHeight || 0).minus(tx.blockHeight || 0).multipliedBy(BLOCK_TIME).multipliedBy(1000)
        ).toNumber()
    }

    if (events.length === 0) {
      return result
    }
    if (RuntimeMethod.isMethodWithId(methodId, RuntimeMethod.SWAP)) {
      result = {
        ...result,
        type: "Swap",
        data: this.convertTxSwap(events)
      }
    }

    if (RuntimeMethod.isMethodWithId(methodId, RuntimeMethod.CREATE_POOL)) {
      result = {
        ...result,
        type: "CreatePool",
        data: this.convertTxCreatePool(events)
      }
    }

    if (RuntimeMethod.isMethodWithId(methodId, RuntimeMethod.REMOVE_LIQUIDITY)) {
      result = {
        ...result,
        type: "RemoveLiquidity",
        data: this.convertTxRemoveLiquidity(events)
      }
    }

    if (RuntimeMethod.isMethodWithId(methodId, RuntimeMethod.ADD_LIQUIDITY)) {
      result = {
        ...result,
        type: "AddLiquidity",
        data: this.convertTxAddLiquidity(events)
      }
    }

    return result
  },
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
    return {
      creator,
      isOddCreator,
      tokenA: { id: tokenAId, amount: tokenAAmount, amount_usd: this.getAmountToken(tokenAAmount, tokenAId) },
      tokenB: { id: tokenBId, amount: tokenBAmount, amount_usd: this.getAmountToken(tokenBAmount, tokenBId) }
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

    return {
      creator,
      isOddCreator,
      tokenA: { id: tokenAId, amount: tokenAAmount, amount_usd: this.getAmountToken(tokenAAmount, tokenAId) },
      tokenB: { id: tokenBId, amount: tokenBAmount, amount_usd: this.getAmountToken(tokenBAmount, tokenBId) },
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

    return {
      creator,
      isOddCreator,
      tokenA: { id: tokenAId, amount: tokenAAmount, amount_usd: this.getAmountToken(tokenAAmount, tokenAId) },
      tokenB: { id: tokenBId, amount: tokenBAmount, amount_usd: this.getAmountToken(tokenBAmount, tokenBId) },
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

    return {
      creator,
      isOddCreator,
      tokenA: { id: tokenAId, amount: tokenAAmount, amount_usd: this.getAmountToken(tokenAAmount, tokenAId) },
      tokenB: { id: tokenBId, amount: tokenBAmount, amount_usd: this.getAmountToken(tokenBAmount, tokenBId) },
      tokenLPAmount
    }
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
        from: { tokenId, amount, amount_usd: this.getAmountToken(amount, tokenId) }
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
        to: { tokenId, amount, amount_usd: this.getAmountToken(amount, tokenId) }
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
        tokenA,
        tokenB,
        creator
      } = this.decodeCreatePool(eventCreatePool.data)
      const tokenPair = TokenPair.from(TokenId.from(tokenA.id), TokenId.from(tokenB.id))
      result = {
        ...result,
        tokenA: tokenB.id === tokenPair.tokenBId.toString() ? { ...tokenB } : { ...tokenA },
        tokenB: tokenA.id === tokenPair.tokenAId.toString() ? { ...tokenA } : { ...tokenB },
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
        tokenA,
        tokenB,
        creator
      } = this.decodeRemoveLiquityPool(eventRemoveLiquityPool.data)
      const tokenPair = TokenPair.from(TokenId.from(tokenA.id), TokenId.from(tokenB.id))

      result = {
        ...result,
        tokenA: tokenB.id === tokenPair.tokenBId.toString() ? { ...tokenB } : { ...tokenA },
        tokenB: tokenA.id === tokenPair.tokenAId.toString() ? { ...tokenA } : { ...tokenB },
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
        tokenA,
        tokenB,
        creator
      } = this.decodeAddLiquityPool(eventAddLiquityPool.data)
      const tokenPair = TokenPair.from(TokenId.from(tokenA.id), TokenId.from(tokenB.id))
      result = {
        ...result,
        tokenA: tokenB.id === tokenPair.tokenBId.toString() ? { ...tokenB } : { ...tokenA },
        tokenB: tokenA.id === tokenPair.tokenAId.toString() ? { ...tokenA } : { ...tokenB },
      }
      if (withPoolKey) {
        result = { ...result, poolKey: PoolKey.fromTokenPair(tokenPair).toBase58() }
      }
    }
    return result
  },
  findSurroundingNumbers(arr, num) {
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
}
const MemoBlock = {
  maxBlockHeight: 0,
  loadMaxBlockHeight: async function () {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PROTOKIT_GRAPHQL_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query GetBlock {
              block {
                txs {
                  tx {
                    argsFields
                    auxiliaryData
                    methodId
                    nonce
                    sender
                    signature {
                      r
                      s
                    }
                  }
                  status
                  statusMessage
                }
              }
              network {
                unproven {
                  block {
                    height
                  }
                }
              }
            }
          `,
        }),
      });

      const { data } = await response.json()
      if (data.network.unproven) {
        this.maxBlockHeight = data.network.unproven.block.height
      }
    } catch (error) {

    }

  },
  getTimestamp: function (blockHeight) {
    return !this.maxBlockHeight ? new Date().getTime()
      : BigNumber(new Date().getTime()).minus(
        BigNumber(this.maxBlockHeight || 0).minus(blockHeight || 0).multipliedBy(BLOCK_TIME).multipliedBy(1000)
      ).toNumber()
  }
}
const MemoTxs = {
  mutexTxsUpdate: new Mutex(),
  maxNonce: 0,
  minNonce: 0,
  maxBlockHeight: 0,
  minBlockHeight: 0,
  data: [],
  dataMap: {
    txMapping: new Map(),
    blockMapping: new Map(),
    blockList: []
  },
  dataSingle: new Map(),
  baseQuery: `SELECT 
                    t.*, ter.status, 
                    ter."statusMessage", 
                    ter."blockHash", 
                    ter.events, 
                    b.height AS "blockHeight" 
                  FROM 
                    "public"."Transaction" t 
                  JOIN 
                    "public"."TransactionExecutionResult" ter 
                  ON 
                    t.hash = ter."txHash" 
                  JOIN 
                    "public"."Block" b 
                  ON 
                    b.hash = ter."blockHash"`,
  maxLength: Number(process.env.MAX_MEMO_TRANS || 50000),
  maxLengthRequest: 1000,
  mapping: function () {
    this.dataMap.txMapping.clear();
    this.dataMap.blockMapping.clear();
    this.dataMap.blockList = [];
    var currentBlock = this.data[0].blockHeight;
    this.dataMap.blockList.push(currentBlock);
    var indexStartBlock = 0;
    var indexEndBLock = 0;
    for (let index = 0; index < this.data.length; index++) {
      const element = this.data[index];
      this.dataMap.txMapping.set(element.hash, index);
      if (currentBlock > element.blockHeight || index == this.data.length - 1) {
        this.dataMap.blockMapping.set(currentBlock, [indexStartBlock, index == this.data.length - 1 ? index : indexEndBLock]);
        currentBlock = element.blockHeight;
        this.dataMap.blockList.push(element.blockHeight);
        indexStartBlock = index;
      }
      indexEndBLock = index;
    }
  },
  append: function (newTxs = []) {
    if (!newTxs || newTxs.length == 0) return
    const newTxsWillAppend = newTxs.filter(tx => (
      BigNumber(this.maxBlockHeight).lt(tx.blockHeight)
      || (BigNumber(tx.nonce).gt(this.maxNonce) && BigNumber(this.maxBlockHeight).eq(tx.blockHeight))
    ))
    this.data.unshift(...newTxsWillAppend)
    if (this.data.length > 0) {
      this.maxNonce = Number(this.data[0].nonce)
      this.maxBlockHeight = Number(this.data[0].blockHeight)
    }
    if (this.data.length > this.maxLength) {
      this.data.splice(this.maxLength, this.data.length - this.maxLength)
      this.minNonce = Number(this.data[this.data.length - 1].nonce)
      this.minBlockHeight = Number(this.data[this.data.length - 1].blockHeight)
    }
    this.mapping();
  },
  init: async function () {
    const release = await this.mutexTxsUpdate.acquire();
    const dataLength = 1000;
    const query = `${this.baseQuery} ORDER BY b.height::numeric desc, t.nonce::numeric desc LIMIT ${dataLength} ;`;
    const data = await client.query(query);
    this.minNonce = Number(data.rows[data.rows.length - 1].nonce);
    this.minBlockHeight = Number(data.rows[data.rows.length - 1].blockHeight);
    this.append(data.rows);
    release();
  },
  update: async function () {
    const release = await this.mutexTxsUpdate.acquire();
    const dataLength = 1000;
    const query = `${this.baseQuery} WHERE 
    (b.height::numeric > ${this.maxBlockHeight}  OR (b.height::numeric = ${this.maxBlockHeight}  AND t.nonce::numeric > ${this.maxNonce} ))
    ORDER BY b.height::numeric asc, t.nonce::numeric asc LIMIT ${dataLength} ;`;
    const data = await client.query(query);
    this.append(data.rows.reverse());
    release();
  },
  updateSingle: function (newTx) {
    if (this.dataSingle.size >= 10000) {
      let count = 0;
      for (let key of this.dataSingle.keys()) {
        if (count < 2500) {
          this.dataSingle.delete(key);
          count++;
        } else {
          break;
        }
      }
    }
    if (!this.dataSingle.has(newTx.hash)) {
      this.dataSingle.set(newTx.hash, newTx);
    }
  },
  loadHistory: async function (limit) {
    if (this.data.length >= 0.99 * this.maxLength) return;
    const release = await this.mutexTxsUpdate.acquire();

    const query = `${this.baseQuery} WHERE
    (b.height::numeric < ${this.minBlockHeight}  OR (b.height::numeric = ${this.minBlockHeight}  AND t.nonce::numeric < ${this.minNonce} ))
    ORDER BY b.height::numeric desc, t.nonce::numeric desc LIMIT ${limit} ;`;
    const data = await client.query(query);
    this.data.push(...data.rows.filter(tx => (
      BigNumber(this.minBlockHeight).gt(tx.blockHeight)
      || (BigNumber(this.maxBlockHeight).eq(tx.blockHeight) && BigNumber(tx.nonce).lt(this.maxNonce)))
    ));
    this.minNonce = Number(this.data[this.data.length - 1].nonce)
    this.minBlockHeight = Number(this.data[this.data.length - 1].blockHeight)
    this.mapping();
    release();
  },
  getTxs: async function (blockHeightPoint, noncePoint, direction, limit) {
    limit = Number(limit);
    blockHeightPoint = Number(blockHeightPoint);
    noncePoint = Number(noncePoint);
    direction = Number(direction);
    limit = limit > this.maxLengthRequest ? this.maxLengthRequest : (limit > 0 ? limit : 1);

    console.log(limit, typeof limit)
    if (blockHeightPoint == -1 || noncePoint == -1) {
      return this.data.slice(0, limit);
    }
    //
    if (direction > 0 && (this.minBlockHeight > blockHeightPoint || (this.minBlockHeight == blockHeightPoint && this.minNonce > noncePoint))) {
      await this.loadHistory(limit);
    }
    var blockSurrounding = Utils.findSurroundingNumbers(this.dataMap.blockList, blockHeightPoint);
    console.log("blockSurrounding", blockSurrounding)
    if (blockSurrounding == null) {
      return [];
    }
    if (direction > 0) {
      var dataIndexPoint = this.dataMap.blockMapping.get(blockSurrounding.larger);
      return this.data.slice(0, dataIndexPoint[1]).reverse().slice(0, limit).reverse();
    } else {

      var dataIndexPoint = this.dataMap.blockMapping.get(blockSurrounding.smaller);
      // console.log("dataIndexPoint", dataIndexPoint)
      dataIndexPoint = blockSurrounding.smaller == blockHeightPoint ? dataIndexPoint[1] + 1 : dataIndexPoint[0];

      var tempData = this.data.slice(dataIndexPoint, dataIndexPoint + limit);
      if (tempData.length < limit) {
        await this.loadHistory();
      } else {
        return tempData;
      }
      dataIndexPoint = this.dataMap.blockMapping.get(blockSurrounding.smaller);
      console.log("dataIndexPoint", dataIndexPoint)
      dataIndexPoint = blockSurrounding.smaller == blockHeightPoint ? dataIndexPoint[1] + 1 : dataIndexPoint[0];
      return this.data.slice(dataIndexPoint, dataIndexPoint + limit);

    }
  },
  getTx: async function (hash) {
    const tempData = this.dataMap.txMapping.get(hash);
    if (tempData != undefined) {
      return this.data[tempData];
    } else {
      tempDataSingle = this.dataSingle.get(hash);
      if (tempDataSingle != undefined) {
        return tempDataSingle;
      }
      const data = await client.query(`${this.baseQuery} WHERE ter.hash='${hash}';`);
      if (data.rows.length > 0) {
        this.updateSingle(data.rows[0]);
        return data.rows[0];
      }
    }
    return NULL_TX;
  }
}



const MemoPool = {
  mutexUpdatePool: Array(10).fill(new Mutex()),
  maxNonce: 0,
  maxBlockHeight: 0,
  // minNonce: undefined,
  data: [],
  dataMap: new Map(),
  append: function (newTxs = []) {
    if (!newTxs || newTxs.length == 0) return
    const newTxsWillAppend = newTxs.filter(tx => (
      BigNumber(this.maxBlockHeight).lt(tx.blockHeight)
      || (BigNumber(tx.nonce).gt(this.maxNonce) && BigNumber(this.maxBlockHeight).eq(tx.blockHeight))
    ))
    this.data.unshift(...newTxsWillAppend)
    if (this.data.length > 0) {
      this.maxNonce = Number(this.data[0].nonce)
      this.maxBlockHeight = Number(this.data[0].blockHeight)
    }
  },

  getGraph: function () {
    return prepareGraph(this.data.map(poolTx => poolTx.path))
  },

  getRouter: function (tokenAId, tokenBId) {
    const paths = dijkstra(this.getGraph(), tokenAId, tokenBId)
    return {
      ...paths,
      vector: [tokenAId, ...paths.path]
    }
  },
  init: async function () {
    const createPoolMethodId = RuntimeMethod.getMethodId(RuntimeMethod.CREATE_POOL)
    try {
      //init mongodb
      if (await dinodex_pool_list_collection.totalDocuments() == 0) {
        const dataPrisma = await client.query(
          `${MemoTxs.baseQuery} WHERE t."methodId" = $1 
          AND (b.height::numeric > $2 OR (b.height::numeric = $3 AND t.nonce::numeric > $4))
          AND ter.status=TRUE 
          ORDER BY b.height::numeric asc, t.nonce::numeric asc LIMIT $5;`,
          [createPoolMethodId, this.maxBlockHeight, this.maxBlockHeight, this.maxNonce, 1000]);
        const newTxsPool = []
        dataPrisma.rows.reverse().forEach((tx, tempIndex) => {
          const argsFields = tx["argsFields"];
          const [tokenAId, tokenBId] = BigInt(argsFields[0]) > BigInt(argsFields[1]) ? [BigInt(argsFields[0]), BigInt(argsFields[1])] : [BigInt(argsFields[1]), BigInt(argsFields[0])];
          const path = [tokenAId.toString(), tokenBId.toString()];
          const tempData = {
            ...tx,
            path: path,
            tokenAId: tokenAId,
            tokenBId: tokenBId,
            tokenAAmount: 0,
            tokenBAmount: 0
          };
          newTxsPool.push(tempData);

          this.dataMap.set(JSON.stringify(path), tempData);
          this.fillPool(tempIndex % this.mutexUpdatePool.length, path);
        });
        dinodex_pool_list_collection.insertPools(dataPrisma.rows.reverse().map(pool => {
          const argsFields = pool["argsFields"];
          const [tokenAId, tokenBId] = BigInt(argsFields[0]) > BigInt(argsFields[1]) ? [BigInt(argsFields[0]), BigInt(argsFields[1])] : [BigInt(argsFields[1]), BigInt(argsFields[0])];
          const [tokenAAmount, tokenBAmount] = BigInt(argsFields[0]) > BigInt(argsFields[1]) ? [BigInt(argsFields[2]), BigInt(argsFields[3])] : [BigInt(argsFields[3]), BigInt(argsFields[2])];
          return {
            hash: pool.hash,
            tokenAId: tokenAId.toString(),
            tokenBId: tokenBId.toString(),
            poolKey: PoolKey.fromTokenPair(TokenPair.from(TokenId.from(tokenAId), TokenId.from(tokenBId))).toBase58(),
            tokenAAmount: tokenAAmount,
            tokenBAmount: tokenBAmount,
            blockHeight: Number(pool.blockHeight)
          }
        }))
        this.append(newTxsPool)
      }


    } catch (error) {
      console.log("error", error)
    }
  },
  loadPools: async function (length = 1000) {
    const createPoolMethodId = RuntimeMethod.getMethodId(RuntimeMethod.CREATE_POOL)
    try {
      const dataPrisma = await client.query(
        `${MemoTxs.baseQuery} WHERE t."methodId" = $1 
        AND (b.height::numeric > $2 OR (b.height::numeric = $3 AND t.nonce::numeric > $4))
        AND ter.status=TRUE 
        ORDER BY b.height::numeric asc, t.nonce::numeric asc LIMIT $5;`,
        [createPoolMethodId, this.maxBlockHeight, this.maxBlockHeight, this.maxNonce, length]);
      const newTxsPool = []
      dataPrisma.rows.reverse().forEach((tx, tempIndex) => {
        const argsFields = tx["argsFields"];
        const [tokenAId, tokenBId] = Number(argsFields[0]) > Number(argsFields[1]) ? [Number(argsFields[0]), Number(argsFields[1])] : [Number(argsFields[1]), Number(argsFields[0])];
        const path = [tokenAId, tokenBId];
        const tempData = {
          ...tx,
          path: path,
          tokenAId: tokenAId,
          tokenBId: tokenBId,
          poolKey: PoolKey.fromTokenPair(TokenPair.from(TokenId.from(tokenAId), TokenId.from(tokenBId))).toBase58(),
          tokenAAmount: 0,
          tokenBAmount: 0
        };
        newTxsPool.push(tempData);

        this.dataMap.set(JSON.stringify(path), tempData);
        this.fillPool(tempIndex % this.mutexUpdatePool.length, path);
      });
      this.append(newTxsPool)
    } catch (error) {
      console.log("error", error)
    }
  },
  fillPool: async function (mutexId, poolPath) {
    const release = await this.mutexUpdatePool[mutexId].acquire();
    const tempData = this.dataMap.get(JSON.stringify(poolPath));
    const poolKey = PoolKey.fromTokenPair(TokenPair.from(TokenId.from(poolPath[0]), TokenId.from(poolPath[1])));
    const balancesA = await Utils.getBalance(tempData.tokenAId, poolKey);
    const balancesB = await Utils.getBalance(tempData.tokenBId, poolKey);
    this.dataMap.set(poolPath, { ...tempData, tokenAAmount: balancesA, tokenBAmount: balancesB });

    release();

  },
  fillData: async function () {
    try {
      const promiseGetPool = async (tokenAId, tokenBId) => {
        const poolKey = PoolKey.fromTokenPair(TokenPair.from(
          TokenId.from(tokenAId),
          TokenId.from(tokenBId)
        ))
        const balancesA = await Utils.getBalance(tokenAId, poolKey)
        const balancesB = await Utils.getBalance(tokenBId, poolKey)
        return {
          balancesA: balancesA.value,
          balancesB: balancesB.value,
          tokenAId: tokenAId,
          tokenBId: tokenBId
        }
      }

      const getVolume = function (poolKey, timesBlock = Infinity) {
        if (!poolKey) return null
        if (!Object.keys(MemoChart.pools).includes(poolKey)) return null
        let result = {}
        const dataPoolsChart = MemoChart.pools[poolKey]
        for (var i = 0; i < dataPoolsChart.length - 1; i++) {
          const { blockHeight, change = {} } = dataPoolsChart[i]
          if (BigNumber(MemoBlock.maxBlockHeight).minus(timesBlock).gt(blockHeight)) break
          Object.entries(change).forEach(([idToken, amountChange]) => {
            result[idToken] = BigNumber(result[idToken] || 0).plus(BigNumber(amountChange).abs()).toString()
          })
        }
        if (Object.keys(result).length == 0) {
          return null
        }
        return result[Math.max(...Object.keys(result).map(Number))]
      }

      const dataPool = await Promise.all(processPool.map(txPool => {
        const tokenAId = txPool.tokenAId
        const tokenBId = txPool.tokenBId
        return promiseGetPool(tokenAId, tokenBId)
      }))
      res.json({
        error: false,
        data: dataPool.map((pool) => {
          const { balancesA, balancesB, tokenAId, tokenBId } = pool
          const priceTokenA = Utils.getPriceTokens(tokenAId)
          const priceTokenB = Utils.getPriceTokens(tokenBId)
          const poolKey = PoolKey.fromTokenPair(
            TokenPair.from(TokenId.from(tokenAId), TokenId.from(tokenBId))
          ).toBase58()
          const tvl = BigNumber(balancesA).multipliedBy(priceTokenA)
            .plus(BigNumber(balancesB).multipliedBy(priceTokenB)).toString()
          return {
            ...pool,
            tvl: tvl,
            apr: null,
            volume_1d: getVolume(poolKey, BigNumber(24 * 60 * 60).dividedBy(BLOCK_TIME)),
            volume_7d: getVolume(poolKey, BigNumber(7 * 24 * 60 * 60).dividedBy(BLOCK_TIME)),
          }
        })
      })
      return
    } catch (error) {

    }
    res.json({
      error: false,
      data: processPool.map(txPool => {
        const tokenAId = txPool.tokenAId
        const tokenBId = txPool.tokenBId
        return {
          tokenAId,
          tokenBId
        }
      })
    })

  }
}

const MemoChart = {
  maxNonce: 0,
  maxBlockHeight: 0,
  pools: {},
  appendDataPoolChart: function (...txsDataChart) {
    txsDataChart.forEach(txChart => {
      const { blockHeight, blockHash, hash, poolKey, tokenA, tokenB, type } = txChart
      if (!Object.keys(this.pools).includes(poolKey)) {
        this.pools[poolKey] = []
      }
      this.pools[poolKey].unshift({
        blockHeight,
        blockHash,
        hash,
        poolKey,
        type,
        change: { [tokenA.id]: tokenA.amountChange, [tokenB.id]: tokenB.amountChange },
        price_change: {
          [tokenA.id]: BigNumber(Utils.revertPrecision(tokenA.amountChange)).multipliedBy(Utils.getPriceTokens(tokenA.id)).toNumber(),
          [tokenB.id]: BigNumber(Utils.revertPrecision(tokenB.amountChange)).multipliedBy(Utils.getPriceTokens(tokenB.id)).toNumber() },
      })
    })
  },
  loadPoolsChart: async function (length = 20) {
    try {
      const listMethodIdsPool = [
        RuntimeMethod.getMethodId(RuntimeMethod.SWAP),
        RuntimeMethod.getMethodId(RuntimeMethod.CREATE_POOL),
        RuntimeMethod.getMethodId(RuntimeMethod.ADD_LIQUIDITY),
        RuntimeMethod.getMethodId(RuntimeMethod.REMOVE_LIQUIDITY)
      ]
      const dataPrisma = await client.query(
        `${MemoTxs.baseQuery} WHERE t."methodId" = ANY($1) AND b.height::numeric > $2 AND ter.status=TRUE ORDER BY b.height::numeric asc, t.nonce::numeric asc LIMIT $3;`,
        [listMethodIdsPool, this.maxBlockHeight, length]);
      const processData = dataPrisma.rows
        .filter((tx) => (
          BigNumber(this.maxBlockHeight).lt(tx.blockHeight)
          || (BigNumber(tx.nonce).gt(this.maxNonce) && BigNumber(this.maxBlockHeight).eq(tx.blockHeight))
        ))
      if (processData.length > 0) {
        this.maxNonce = processData[processData.length - 1].nonce
        this.maxBlockHeight = processData[processData.length - 1].blockHeight
      }
      processData.forEach((tx) => {
        const { methodId, events, blockHeight, blockHash, hash } = tx
        if (RuntimeMethod.isMethodWithId(methodId, RuntimeMethod.SWAP)) {
          const dataSwap = Utils.convertTxSwap(events, true)
          const {
            routers = []
          } = dataSwap
          routers.forEach(({ poolKey, from, to }) => {
            const { id: idFrom } = from
            const { id: idTo } = to
            const tokenPair = TokenPair.from(TokenId.from(idFrom), TokenId.from(idTo))
            let tokenA = tokenPair.tokenAId.toString() === idFrom ? from : to
            let tokenB = tokenPair.tokenBId.toString() === idFrom ? from : to
            const newTxPoolChartSwap = {
              blockHeight, blockHash, hash,
              poolKey: PoolKey.fromTokenPair(tokenPair).toBase58(),
              type: "Swap",
              tokenA: {
                id: tokenA.id,
                amountChange: tokenA.amount
              },
              tokenB: {
                id: tokenB.id,
                amountChange: BigNumber(tokenB.amount).multipliedBy(-1).toString()
              }
            }
            this.appendDataPoolChart(newTxPoolChartSwap)
          })
        }
        if (RuntimeMethod.isMethodWithId(methodId, RuntimeMethod.CREATE_POOL)) {
          const dataCreatePool = Utils.convertTxCreatePool(events, true)
          const {
            tokenA: { id: idA, amount: amountA },
            tokenB: { id: idB, amount: amountB },
            poolKey
          } = dataCreatePool
          const newTxPoolChartCreate = {
            blockHeight, blockHash, hash,
            poolKey,
            type: "CreatePool",
            tokenA: {
              id: idA,
              amountChange: amountA
            },
            tokenB: {
              id: idB,
              amountChange: amountB
            }
          }
          this.appendDataPoolChart(newTxPoolChartCreate)
        }

        if (RuntimeMethod.isMethodWithId(methodId, RuntimeMethod.ADD_LIQUIDITY)) {
          const dataCreatePool = Utils.convertTxAddLiquidity(events, true)
          const {
            tokenA: { id: idA, amount: amountA },
            tokenB: { id: idB, amount: amountB },
            poolKey
          } = dataCreatePool
          const newTxPoolChartCreate = {
            blockHeight, blockHash, hash,
            poolKey,
            type: "AddLiquidity",
            tokenA: {
              id: idA,
              amountChange: amountA
            },
            tokenB: {
              id: idB,
              amountChange: amountB
            }
          }
          this.appendDataPoolChart(newTxPoolChartCreate)
        }

        if (RuntimeMethod.isMethodWithId(methodId, RuntimeMethod.REMOVE_LIQUIDITY)) {
          const dataCreatePool = Utils.convertTxRemoveLiquidity(events, true)
          const {
            tokenA: { id: idA, amount: amountA },
            tokenB: { id: idB, amount: amountB },
            poolKey
          } = dataCreatePool
          const newTxPoolChartCreate = {
            blockHeight, blockHash, hash,
            poolKey,
            type: "RemoveLiquidity",
            tokenA: {
              id: idA,
              amountChange: BigNumber(amountA).multipliedBy(-1).toString()
            },
            tokenB: {
              id: idB,
              amountChange: BigNumber(amountB).multipliedBy(-1).toString()
            }
          }
          this.appendDataPoolChart(newTxPoolChartCreate)
        }
      })
    } catch (error) {
      console.log("error", error)
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const mainLoop = async () => {
  const maxLoop = 1000;
  var loopIndex = 0;
  await MemoTxs.init();
  await MemoPool.init();

  while (loopIndex < maxLoop) {
    await MemoBlock.loadMaxBlockHeight()
    await MemoTxs.update();
    await sleep(2000);
    await MemoPool.loadPools();
    await sleep(2000);
    await MemoChart.loadPoolsChart()
  }
}

mainLoop();

//wp custom
async function saveDataToFile(data, filePath) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonData);
    console.log('File successfully written!');
  } catch (err) {
    console.error('Error writing file:', err);
  }
}
const getAllTxResults = async () => {
  const query = `${MemoTxs.baseQuery}
                  ORDER BY 
                    b.height::numeric asc,
                    nonce::numeric asc;`;
  const data = await client.query(query);
  await saveDataToFile(JSON.parse(JSON.stringify(data.rows)), "txResults.json");
  console.log(data);
}
// getAllTxResults();
//end wp custom

app.get('/routers', (req, res) => {
  const { tokenAId = '', tokenBId = '' } = req.query
  if (!tokenAId || !tokenBId) {
    res.json({ error: true, message: "No Router" })
    return
  }
  try {
    res.json({ error: false, data: MemoPool.getRouter(tokenAId, tokenBId) })
  } catch (error) {
    res.json({ error: true, message: "No Router" })
  }
})

app.get('/tokens', (req, res) => {
  const { take = 100, skip = 0 } = req.query
  const processTokens = Object.entries(PRICE_TOKENS)
    .slice(skip, take > 100 ? 100 : take)
  const getVolumeTokens = function (tokenIds = [], timesBlock = Infinity) {
    if (!tokenIds.length) return null // TODO process performance
    if (!Object.keys(MemoChart.pools).length === 0) return null
    let result = {}
    let dataChartAllPool = Object.values(MemoChart.pools)
    for (var i = 0; i < dataChartAllPool.length; i++) {
      const dataChartOfPool = dataChartAllPool[i]
      for (var j = 0; j < dataChartOfPool.length; j++) {
        const { blockHeight, change = {}, type } = dataChartOfPool[j]
        if (BigNumber(MemoBlock.maxBlockHeight).minus(timesBlock).gt(blockHeight)) break
        if (type !== "Swap") continue
        Object.entries(change).forEach(([idToken, amountChange]) => {
          result[idToken] = BigNumber(result[idToken] || 0).plus(BigNumber(amountChange).abs()).toString()
        })
      }

    }
    return result
  }
  const volumes = getVolumeTokens(
    processTokens.map(([tokenId]) => tokenId),
    BigNumber(24 * 60 * 60).dividedBy(BLOCK_TIME)
  ) || {}
  const result = processTokens.map(([tokenId, info]) => {
    return {
      id: tokenId,
      ticker: info.ticker,
      name: info.name,
      price: {
        usd: info.usd
      },
      volume: volumes[tokenId] || null,
      fdv: volumes[tokenId] ? BigNumber(volumes[tokenId] || 0).multipliedBy(Utils.getPriceTokens(tokenId)) : null
    }
  })

  res.json({
    error: false,
    data: result
  })
})

app.get('/pools', async (req, res) => {
  const { take = 100, skip = 0 } = req.query
  // return res.json(MemoPool.data);
  const processPool = MemoPool.data
    .slice(skip, take > 100 ? 100 : take)
  try {
    const promiseGetPool = async (tokenAId, tokenBId) => {
      const poolKey = PoolKey.fromTokenPair(TokenPair.from(
        TokenId.from(tokenAId),
        TokenId.from(tokenBId)
      ))
      const balancesA = await Utils.getBalance(tokenAId, poolKey)
      const balancesB = await Utils.getBalance(tokenBId, poolKey)
      return {
        balancesA: balancesA.value,
        balancesB: balancesB.value,
        poolKey: poolKey.toBase58(),
        tokenAId: tokenAId,
        tokenBId: tokenBId
      }
    }

    const getVolume = function (poolKey, timesBlock = Infinity) {
      if (!poolKey) return null
      if (!Object.keys(MemoChart.pools).includes(poolKey)) return null
      let result = {}
      const dataPoolsChart = MemoChart.pools[poolKey]
      for (var i = 0; i < dataPoolsChart.length - 1; i++) {
        const { blockHeight, change = {} } = dataPoolsChart[i]
        if (BigNumber(MemoBlock.maxBlockHeight).minus(timesBlock).gt(blockHeight)) break
        Object.entries(change).forEach(([idToken, amountChange]) => {
          result[idToken] = BigNumber(result[idToken] || 0).plus(BigNumber(amountChange).abs()).toString()
        })
      }
      if (Object.keys(result).length == 0) {
        return null
      }
      return result[Math.max(...Object.keys(result).map(Number))]
    }

    const dataPool = await Promise.all(processPool.map(txPool => {
      const tokenAId = txPool.tokenAId
      const tokenBId = txPool.tokenBId
      return promiseGetPool(tokenAId, tokenBId)
    }))
    res.json({
      error: false,
      data: dataPool.map((pool) => {
        const { balancesA, balancesB, tokenAId, tokenBId } = pool
        const priceTokenA = Utils.getPriceTokens(tokenAId)
        const priceTokenB = Utils.getPriceTokens(tokenBId)
        const poolKey = PoolKey.fromTokenPair(
          TokenPair.from(TokenId.from(tokenAId), TokenId.from(tokenBId))
        ).toBase58()
        const tvl = BigNumber(balancesA).multipliedBy(priceTokenA)
          .plus(BigNumber(balancesB).multipliedBy(priceTokenB)).toString()
        return {
          ...pool,
          tvl: tvl,
          apr: null,
          volume_1d: getVolume(poolKey, BigNumber(24 * 60 * 60).dividedBy(BLOCK_TIME)),
          volume_7d: getVolume(poolKey, BigNumber(7 * 24 * 60 * 60).dividedBy(BLOCK_TIME)),
        }
      })
    })
    return
  } catch (error) {

  }
  res.json({
    error: false,
    data: processPool.map(txPool => {
      const tokenAId = txPool.tokenAId
      const tokenBId = txPool.tokenBId
      return {
        tokenAId,
        tokenBId
      }
    })
  })
})

app.get('/pool/info/:key', async (req, res) => {
  const { key } = req.params
  try {
    const poolKey = (key.indexOf("0x") === -1) ? key : key.substring(2)
    const poolInfo = MemoPool.data.find(pool => pool.poolKey === poolKey)
    const { tokenAId, tokenBId } = poolInfo
    const poolKeyOf = PoolKey.fromTokenPair(TokenPair.from(
      TokenId.from(tokenAId),
      TokenId.from(tokenBId)
    ))
    const balancesA = await Utils.getBalance(tokenAId, poolKeyOf)
    const balancesB = await Utils.getBalance(tokenBId, poolKeyOf)
    res.status(200)
    res.json({
      error: false,
      data: {
        poolKey: poolKey,
        tokenAId,
        tokenBId,
        balancesA: balancesA.value,
        balancesB: balancesB.value
      }
    });
  } catch (error) {
    console.log("error", error)
    res.status(400)
    res.json({ error: true, message: "Pool key is invalid!", data: error })
  }
})

app.get('/pool/txs/:key', async (req, res) => {
  const { key } = req.params
  try {
    const poolKey = (key.indexOf("0x") === -1) ? key : key.substring(2)
    const poolInfo = MemoPool.data.find(pool => pool.poolKey === poolKey)
    const chartPoolInfo = MemoChart.pools[poolKey]
    const { tokenAId, tokenBId } = poolInfo
    res.status(200)
    res.json({
      error: false,
      data: {
        poolKey: poolKey,
        tokenAId,
        tokenBId,
        txs: chartPoolInfo.map((poolTxInfo) => {
          return {
            timestamp: MemoBlock.getTimestamp(poolTxInfo.blockHeight),
            ...poolTxInfo
          }
        })
      }
    });
  } catch (error) {
    console.log("error", error)
    res.status(400)
    res.json({ error: true, message: "Pool key is invalid!", data: error })
  }
})

app.get('/transactions', async (req, res) => {
  const { blockHeightPoint = -1, noncePoint = -1, direction = 1, limit = 100 } = req.query
  const txs = await MemoTxs.getTxs(blockHeightPoint, noncePoint, direction, limit);
  res.json({ error: false, data: txs });
})

app.get('/txs', async (req, res) => {
  const { blockHeightPoint = -1, noncePoint = -1, direction = 1, limit = 100 } = req.query
  const txs = await MemoTxs.getTxs(blockHeightPoint, noncePoint, direction, limit);
  try {
    res.json({ error: false, data: txs.map(tx => Utils.getDecodeTx(tx)) });
    return
  } catch (error) {
    res.json({ error: false, data: txs });
  }

})

app.get('/tx/:hash', async (req, res) => {
  const { hash } = req.params
  try {
    const tx = await MemoTxs.getTx(hash);
    res.status(200)
    res.json(tx);
  } catch (error) {
    console.log("error", error)
    res.status(400)
    res.json({ error: true, message: "Transaction hash is invalid!" })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running at ${HOST}:${PORT}`);
})