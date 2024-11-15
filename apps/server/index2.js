import pg from 'pg'
import cors from 'cors'
import express from 'express'
// import { Pools } from "./tokens"
import { client as clientAppchain, PoolKey, TokenPair } from "chain";
import { TokenId } from "@proto-kit/library";
import BigNumber from 'bignumber.js';

import { EXPIRED_TIME, PRICE_TOKENS } from './constants';
import { MemoTxs } from './components/Memotxs';
import { memoPools } from './components/MemoPools';
import { decodeDinodexTxEvent, revertPrecision, sleep } from './components/utils';
import { MemoChain } from './components/MemoChain';
import { dinodex_pool_action_collection, dinodex_pool_list_collection, dinodex_tokens_price_collection } from './db';
import { MemoPriceToken } from './components/MemoPriceToken';

const { Client } = pg
const app = express();

await clientAppchain.start();

app.use(cors())


const PORT = process.env.NEXT_PUBLIC_SERVER_APP_PORT || 3333
const HOST = process.env.SERVER_APP_HOST || "http://localhost"
const _pgClient = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    schema: "public"
});

await _pgClient.connect();

///////////
const mainLoop = async () => {
    await MemoTxs.init(_pgClient, clientAppchain);
    await memoPools.init(_pgClient, clientAppchain);

    // await memoPools.poolList.dataSync();
    // await sleep(500);
    await memoPools.poolActions.dataSync();
    await sleep(500);
    while (true) {
        await MemoChain.loadMaxBlockHeight()
        await MemoTxs.update();
        await sleep(2000);
        await memoPools.poolList.loadtempPools();
        await sleep(2000);
        await memoPools.poolActions.dataSync();
        await sleep(1000);
        await MemoPriceToken.update(memoPools.poolList.tempPools.data)
    }
}
mainLoop();





app.get('/transactions', async (req, res) => {
    const { blockHeightPoint = -1, noncePoint = -1, direction = 1, limit = 100 } = req.query
    const txs = await MemoTxs.getTxs(blockHeightPoint, noncePoint, direction, limit);
    res.json({ error: false, data: txs });
});

app.get('/txs', async (req, res) => {
    const { blockHeightPoint = -1, noncePoint = -1, direction = 1, limit = 100 } = req.query
    const txs = await MemoTxs.getTxs(blockHeightPoint, noncePoint, direction, limit);
    try {
        res.json({ error: false, data: txs.map(tx => decodeDinodexTxEvent.decodeTx(clientAppchain, tx, MemoChain.maxBlockHeight)) });
        return
    } catch (error) {
        res.json({ error: true, data: txs });
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
});

app.get("/pools", async (req, res) => {
    const { take = 100, skip = 0 } = req.query
    try {
        const dataPools = await dinodex_pool_list_collection.allPools()
        const dataPoolsAction1D = await dinodex_pool_action_collection.getActions({
            blockPoint: BigNumber(MemoChain.maxBlockHeight).minus((24 * 60 * 60 * 1000) / EXPIRED_TIME).toNumber()
        })
        const dataPoolsAction7D = await dinodex_pool_action_collection.getActions({
            blockPoint: BigNumber(MemoChain.maxBlockHeight).minus((7 * 24 * 60 * 60 * 1000) / EXPIRED_TIME).toNumber()
        })

        const appendAmount = function (oldresult, tokenId, value, key = 'total_amount') {
            if (!Object.keys(oldresult).includes(tokenId)) {
                oldresult[tokenId] = {}
            }
            oldresult[tokenId][key] = BigNumber(oldresult[tokenId][key] || 0).plus(value).toString()
        }

        const getVolumePool = function (dataPoolActions = []) {
            let result = {}
            const actionType = dinodex_pool_action_collection.actionType
            dataPoolActions.forEach(poolAction => {
                const {
                    type,
                    directionAB,
                    tokenAId,
                    tokenBId,
                    tokenAAmount,
                    tokenBAmount
                } = poolAction
                const poolKey = PoolKey.fromTokenPair(
                    TokenPair.from(TokenId.from(tokenAId), TokenId.from(tokenBId))
                ).toBase58()
                if ([actionType.CREATE_POOL, actionType.ADD_LIQUIDITY, actionType.REMOVE_LIQUIDITY, actionType.SWAP].includes(type)) {
                    appendAmount(result, poolKey, tokenAAmount, tokenAId)
                    appendAmount(result, poolKey, tokenBAmount, tokenBId)
                }

            })
            return result
        }
        const getVolumeWithPrice = (volumeObj = {}) => {
            return Object.entries(volumeObj).reduce((preResult, [tokenId, amount]) => {
                return BigNumber(preResult).plus(
                    BigNumber(revertPrecision(amount)).multipliedBy(MemoPriceToken.getPriceTokens(tokenId))
                ).toNumber()
            }, 0)
        }
        const volumes1D = getVolumePool(dataPoolsAction1D)
        const volumes7D = getVolumePool(dataPoolsAction7D)
        res.json({
            error: false,
            data: dataPools.map((pool) => {
                const { tokenAAmount, tokenBAmount, tokenAId, tokenBId } = pool
                const priceTokenA = MemoPriceToken.getPriceTokens(tokenAId)
                const priceTokenB = MemoPriceToken.getPriceTokens(tokenBId)
                const poolKey = PoolKey.fromTokenPair(
                    TokenPair.from(TokenId.from(tokenAId), TokenId.from(tokenBId))
                ).toBase58()
                const tvl = BigNumber(revertPrecision(tokenAAmount)).multipliedBy(priceTokenA)
                    .plus(BigNumber(revertPrecision(tokenBAmount)).multipliedBy(priceTokenB)).toNumber()
                return {
                    ...pool,
                    tvl: {
                        usd: tvl
                    },
                    apr: null,
                    volume_1d: {
                        usd: getVolumeWithPrice(volumes1D[poolKey])
                    },
                    volume_7d: {
                        usd: getVolumeWithPrice(volumes7D[poolKey])
                    }
                }
            })
        })
    } catch (error) {
        res.json({
            error: true,
            data: []
        })
    }
});

app.get('/pool/info/:key', async (req, res) => {
    const { key } = req.params
    try {
        const poolKey = (key.indexOf("0x") === -1) ? key : key.substring(2)
        const dataPools = await dinodex_pool_list_collection.findPools({
            poolKey: poolKey
        })
        if (dataPools.length === 0) {
            throw Error('No data Pool!')
        }

        const { tokenAId, tokenBId, tokenAAmount, tokenBAmount } = dataPools[0]

        const dataPoolsAction1D = await dinodex_pool_action_collection.getActions({
            blockPoint: BigNumber(MemoChain.maxBlockHeight).minus((24 * 60 * 60 * 1000) / EXPIRED_TIME).toNumber(),
            tokenAId,
            tokenBId
        })

        const appendAmount = function (oldresult, tokenId, value, key = 'total_amount') {
            if (!Object.keys(oldresult).includes(tokenId)) {
                oldresult[tokenId] = {}
            }
            oldresult[tokenId][key] = BigNumber(oldresult[tokenId][key] || 0).plus(value).toString()
        }

        const getVolumePool = function (dataPoolActions = []) {
            let result = {}
            const actionType = dinodex_pool_action_collection.actionType
            dataPoolActions.forEach(poolAction => {
                const {
                    type,
                    directionAB,
                    tokenAId,
                    tokenBId,
                    tokenAAmount,
                    tokenBAmount
                } = poolAction
                const poolKey = PoolKey.fromTokenPair(
                    TokenPair.from(TokenId.from(tokenAId), TokenId.from(tokenBId))
                ).toBase58()
                if ([actionType.CREATE_POOL, actionType.ADD_LIQUIDITY, actionType.REMOVE_LIQUIDITY, actionType.SWAP].includes(type)) {
                    appendAmount(result, poolKey, tokenAAmount, tokenAId)
                    appendAmount(result, poolKey, tokenBAmount, tokenBId)
                }

            })
            return result
        }
        const getVolumeWithPrice = (volumeObj = {}) => {
            return Object.entries(volumeObj).reduce((preResult, [tokenId, amount]) => {
                return BigNumber(preResult).plus(
                    BigNumber(revertPrecision(amount)).multipliedBy(MemoPriceToken.getPriceTokens(tokenId))
                ).toNumber()
            }, 0)
        }

        const volumes1D = getVolumePool(dataPoolsAction1D)
        const tvl = BigNumber(revertPrecision(tokenAAmount)).multipliedBy(MemoPriceToken.getPriceTokens(tokenAId))
            .plus(BigNumber(revertPrecision(tokenBAmount)).multipliedBy(MemoPriceToken.getPriceTokens(tokenBId))).toNumber()
        res.status(200)
        res.json({
            error: false,
            data: {
                ...dataPools[0],
                tvl: {
                    usd: tvl
                },
                volume_1d: {
                    usd: getVolumeWithPrice(volumes1D[poolKey])
                }
            }
        });
    } catch (error) {
        res.status(400)
        res.json({ error: true, message: "Pool key is invalid!", data: error })
    }
})

app.get('/pool/txs/:key', async (req, res) => {
    const { key } = req.params
    try {
        const poolKey = (key.indexOf("0x") === -1) ? key : key.substring(2)
        const dataPools = await dinodex_pool_list_collection.findPools({
            poolKey: poolKey
        })
        if (dataPools.length === 0) {
            throw Error('No data Pool!')
        }
        const { tokenAId, tokenBId } = dataPools[0]

        const dataPoolsActions = await dinodex_pool_action_collection.getActions({
            tokenAId, tokenBId
        })
        res.status(200)
        res.json({
            error: false,
            data: dataPoolsActions.map((poolTxInfo) => {
                return {
                    ...poolTxInfo,
                    timestamp: MemoChain.getTimestamp(poolTxInfo.blockHeight)
                }
            })
        });
    } catch (error) {
        res.status(400)
        res.json({ error: true, message: "Pool key is invalid!" })
    }
})

app.get('/tokens', async (req, res) => {
    const { take = 100, skip = 0 } = req.query
    const result = {}
    try {
        const dataPools = await dinodex_pool_list_collection.allPools()
        const dataPoolsAction1D = await dinodex_pool_action_collection.getActions({
            blockPoint: BigNumber(MemoChain.maxBlockHeight).minus((24 * 60 * 60 * 1000) / EXPIRED_TIME).toNumber()
        })

        const appendAmount = function (oldresult, tokenId, value, key = 'total_amount') {
            if (!Object.keys(oldresult).includes(tokenId)) {
                oldresult[tokenId] = {}
            }
            oldresult[tokenId][key] = BigNumber(oldresult[tokenId][key] || 0).plus(value).toString()
        }

        const getVolumeTokens = function (dataPoolActions = []) {
            let result = {}
            const actionType = dinodex_pool_action_collection.actionType
            dataPoolActions.forEach(poolAction => {
                const {
                    type,
                    directionAB,
                    tokenAId,
                    tokenBId,
                    tokenAAmount,
                    tokenBAmount
                } = poolAction

                if ([actionType.CREATE_POOL, actionType.ADD_LIQUIDITY, actionType.REMOVE_LIQUIDITY, actionType.SWAP].includes(type)) {
                    appendAmount(result, tokenAId, tokenAAmount, 'volume')
                    appendAmount(result, tokenBId, tokenBAmount, 'volume')
                }

            })
            return result
        }
        const volumes = getVolumeTokens(dataPoolsAction1D)
        dataPools.forEach(pool => {
            const {
                tokenAId,
                tokenBId,
                tokenAAmount,
                tokenBAmount
            } = pool
            appendAmount(result, tokenAId, tokenAAmount)
            appendAmount(result, tokenBId, tokenBAmount)
        })

        res.json({
            error: false, data: Object.entries(result).map(([tokenId, info]) => ({
                id: tokenId,
                name: PRICE_TOKENS[tokenId].name,
                ticker: PRICE_TOKENS[tokenId].ticker,
                volume: {
                    usd: BigNumber(revertPrecision(volumes[tokenId]?.volume) || 0).multipliedBy(MemoPriceToken.getPriceTokens(tokenId)).toNumber()
                },
                fdv: {
                    usd: BigNumber(revertPrecision(info?.total_amount) || 0).multipliedBy(MemoPriceToken.getPriceTokens(tokenId)).toNumber()
                },
                price: {
                    usd: MemoPriceToken.getPriceTokens(tokenId)
                },
                tvl: {
                    usd: BigNumber(revertPrecision(info?.total_amount) || 0).toNumber()
                }
            }))
        })
    } catch (error) {
        res.json({
            error: true,
            data: []
        })
    }
})


app.get('/token/info/:id', async (req, res) => {
    const { id } = req.params
    const result = {}
    try {
        if (!Object.keys(PRICE_TOKENS).includes(id)) {
            throw Error("No token Id")
        }
        const dataPools = await dinodex_pool_list_collection.allPools()
        const dataPoolsActions1D = await dinodex_pool_action_collection.getActionsWithCondition({
            $and: [
                { blockHeight: { $gt: BigNumber(MemoChain.maxBlockHeight).minus((24 * 60 * 60 * 1000) / EXPIRED_TIME) } },
                { $or: [{ tokenAId: id }, { tokenBId: id }] }
            ]
        })

        const appendAmount = function (oldresult, tokenId, value, key = 'total_amount') {
            if (!Object.keys(oldresult).includes(tokenId)) {
                oldresult[tokenId] = {}
            }
            oldresult[tokenId][key] = BigNumber(oldresult[tokenId][key] || 0).plus(value).toString()
        }

        const getVolumeTokens = function (dataPoolActions = []) {
            let result = {}
            const actionType = dinodex_pool_action_collection.actionType
            dataPoolActions.forEach(poolAction => {
                const {
                    type,
                    directionAB,
                    tokenAId,
                    tokenBId,
                    tokenAAmount,
                    tokenBAmount
                } = poolAction

                if ([actionType.CREATE_POOL, actionType.ADD_LIQUIDITY, actionType.REMOVE_LIQUIDITY, actionType.SWAP].includes(type)) {
                    appendAmount(result, tokenAId, tokenAAmount, 'volume')
                    appendAmount(result, tokenBId, tokenBAmount, 'volume')
                }

            })
            return result
        }
        const volumes = getVolumeTokens(dataPoolsActions1D)
        dataPools.forEach(pool => {
            const {
                tokenAId,
                tokenBId,
                tokenAAmount,
                tokenBAmount
            } = pool
            appendAmount(result, tokenAId, tokenAAmount)
            appendAmount(result, tokenBId, tokenBAmount)
        })
        const info = result[id]
        res.status(200)
        res.json({
            error: false,
            data: {
                id: id,
                name: PRICE_TOKENS[id].name,
                ticker: PRICE_TOKENS[id].ticker,
                fdv: {
                    usd: BigNumber(revertPrecision(info?.total_amount) || 0).multipliedBy(MemoPriceToken.getPriceTokens(id)).toNumber()
                },
                volume_1d: {
                    usd: BigNumber(revertPrecision(volumes[id]?.volume) || 0).multipliedBy(MemoPriceToken.getPriceTokens(id)).toNumber()
                },
                price: {
                    usd: MemoPriceToken.getPriceTokens(id)
                },
                tvl: {
                    usd: BigNumber(revertPrecision(info?.total_amount) || 0).toNumber()
                }
            }
        })
    } catch (error) {
        res.status(400)
        res.json({ error: true, message: "Token is invalid!" })
    }
})

app.get('/token/txs/:id', async (req, res) => {
    const { id } = req.params
    try {
        if (!Object.keys(PRICE_TOKENS).includes(id)) {
            throw Error("No token Id")
        }
        const dataPoolsActions = await dinodex_pool_action_collection.getActionsWithCondition({
            $and: [
                { blockHeight: { $gt: 0 } },
                { type: dinodex_pool_action_collection.actionType.SWAP },
                { $or: [{ tokenAId: id }, { tokenBId: id }] }
            ]
        },
            {
                limit: 100
            })
        res.status(200)
        res.json({
            error: false,
            data: dataPoolsActions.map((poolTxInfo) => {
                return {
                    ...poolTxInfo,
                    timestamp: MemoChain.getTimestamp(poolTxInfo.blockHeight)
                }
            })
        });
    } catch (error) {
        res.status(400)
        res.json({ error: true, message: "Token is invalid!" })
    }
})

app.get('/routers', (req, res) => {
    const { tokenAId = '', tokenBId = '' } = req.query
    if (!tokenAId || !tokenBId) {
        res.json({ error: true, message: "No Router" })
        return
    }
    try {
        res.json({ error: false, data: memoPools.getRouter(tokenAId, tokenBId) })
    } catch (error) {
        res.json({ error: true, message: "No Router" })
    }
})

app.get('/token/chart/:tokenId', async (req, res) => {
    const { tokenId } = req.params
    if (!tokenId) {
        res.json({ error: true, message: "No Token" })
        return
    }
    try {
        const data = await dinodex_tokens_price_collection.getHistorical({
            timestamp: new Date().valueOf() - (24 * 60 * 60 * 1000),
            tokenId,
            limit: 100
        })
        res.json({ error: false, data: data })
    } catch (error) {
        res.json({ error: true, message: "Token is invalid!" })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running at ${HOST}:${PORT}`);
})