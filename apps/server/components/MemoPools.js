import { Mutex } from 'async-mutex';
import * as Utils from "./utils"
import { RuntimeMethod, EXPIRED_TIME } from '../constants';
import { PoolKey, TokenPair, prepareGraph, dijkstra } from 'chain';

import { TokenId } from '@proto-kit/library';
import { dinodex_pool_list_collection, dinodex_pool_action_collection, upsertPoolDataSync } from "../db"

export const memoPools = {
    mutexUpdatePool: Array(10).fill(new Mutex()),
    maxBlockHeight: 0,
    dataMap: new Map(),
    dataLengthLimitRequest: 1000,
    pgClient: undefined,
    clientAppchain: undefined,
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
    poolList: {
        tempPools: {
            timeExpiry: 0,
            data: [],
            lastBlockHeight: -1
        },
        lastBlockHeight: async function () {
            return await dinodex_pool_list_collection.lastBlockHeight();
        },
        updatePoolData: async function(poolActions){
            
        },
        dataSync: async function () {
            const createPoolMethodId = RuntimeMethod.getMethodId(RuntimeMethod.CREATE_POOL, memoPools.clientAppchain)
            const workBlockHeight = await this.lastBlockHeight();
            const dataPrisma = await memoPools.pgClient.query(
                `${memoPools.baseQuery} WHERE t."methodId" = $1 
                    AND (b.height::numeric > $2)
                    AND ter.status=TRUE 
                    ORDER BY b.height::numeric asc LIMIT $3;`,
                [createPoolMethodId, workBlockHeight, memoPools.dataLengthLimitRequest]);
            await dinodex_pool_list_collection.insertPools(dataPrisma.rows.reverse().map(pool => {
                const argsFields = pool["argsFields"];
                const directionAB = BigInt(argsFields[0]) > BigInt(argsFields[1]);
                const [tokenAId, tokenBId] = directionAB ? [(argsFields[0]), (argsFields[1])] : [(argsFields[1]), (argsFields[0])];
                const [tokenAAmount, tokenBAmount] = directionAB ? [(argsFields[2]), (argsFields[3])] : [(argsFields[3]), (argsFields[2])];
                return {
                    hash: pool.hash,
                    tokenAId: tokenAId,
                    tokenBId: tokenBId,
                    path: [tokenAId, tokenBId],
                    poolKey: PoolKey.fromTokenPair(TokenPair.from(TokenId.from(tokenAId), TokenId.from(tokenBId))).toBase58(),
                    tokenAAmount: tokenAAmount,
                    tokenBAmount: tokenBAmount,
                    blockHeight: Number(pool.blockHeight)
                }
            }));
        },
        loadtempPools: async function(){
            const currentTime = new Date();
            const newExpiry = new Date((new Date()).getTime() + EXPIRED_TIME);
            if(currentTime > this.tempPools.timeExpiry){
                this.tempPools.data = await dinodex_pool_list_collection.allPools(this.tempPools.lastBlockHeight ?? 0);
                this.tempPools.timeExpiry = newExpiry;
                this.tempPools.lastBlockHeight = this.tempPools.data[0]?.blockHeight ?? 0;
            }
        }
    },
    poolActions: {
        tempData: {
            timeExpiry: 0,
            data: []
        },
        lastBlockHeight: async function () {
            return await dinodex_pool_action_collection.lastBlockHeight();
        },
        dataSync: async function () {
            const listMethodIdsPool = [
                RuntimeMethod.getMethodId(RuntimeMethod.SWAP, memoPools.clientAppchain),
                RuntimeMethod.getMethodId(RuntimeMethod.CREATE_POOL, memoPools.clientAppchain),
                RuntimeMethod.getMethodId(RuntimeMethod.ADD_LIQUIDITY, memoPools.clientAppchain),
                RuntimeMethod.getMethodId(RuntimeMethod.REMOVE_LIQUIDITY, memoPools.clientAppchain)
            ];
            const workBlockHeight = await this.lastBlockHeight();
            const dataPrisma = await memoPools.pgClient.query(
                `${memoPools.baseQuery} WHERE t."methodId" = ANY($1) AND b.height::numeric > $2 AND ter.status=TRUE ORDER BY b.height::numeric asc LIMIT $3;`,
                [listMethodIdsPool, workBlockHeight, memoPools.dataLengthLimitRequest]);
            const tempEvents = dataPrisma.rows.reverse().flatMap(item => {
                return item.events.map((sub, index) => {
                    const validAction = dinodex_pool_action_collection.actionType.checkTypeSupport(sub.eventName);
                    var { tokenAId, tokenBId, tokenAAmount, tokenBAmount } = {undefined, undefined, undefined, undefined};
                    var directionAB = true;
                    var creator = undefined
                    if(validAction){
                        var { tokenAId, tokenBId, tokenAAmount, tokenBAmount, creatorAddress } = Utils.decodeDinodexTxEvent.decodePoolAction(sub.data);
                        creator = creatorAddress
                        directionAB = BigInt(tokenAId) > BigInt(tokenBId);
                        if (!directionAB) {
                            [tokenAId, tokenBId] = [tokenBId, tokenAId];
                            [tokenAAmount, tokenBAmount] = [tokenBAmount, tokenAAmount];
                        }
                    }
                    return {
                        ...sub,
                        creator: creator,
                        hash: item.hash,
                        eventIndex: index,
                        validAction: validAction,
                        tokenAId,
                        tokenBId,
                        tokenAAmount,
                        tokenBAmount,
                        directionAB: directionAB,
                        type: sub.eventName,
                        blockHeight: item.blockHeight
                    }
                });
            });
            const poolActions = tempEvents.filter(item => item.validAction && item.tokenAId != '99999');
            // await dinodex_pool_action_collection.addActions(poolActions);
            if(poolActions.length > 0){
                await upsertPoolDataSync(poolActions);
            }
        }
    },

    getGraph: function () {
        return prepareGraph(this.poolList.tempPools.data.map(poolTx => poolTx.path))
    },

    getRouter: function (tokenAId, tokenBId) {
        const paths = dijkstra(this.getGraph(), tokenAId, tokenBId)
        return {
            ...paths,
            vector: [tokenAId, ...paths.path]
        }
    },
    init: async function (pgClient, clientAppchain) {
        this.pgClient = pgClient;
        this.clientAppchain = clientAppchain;
    },
}