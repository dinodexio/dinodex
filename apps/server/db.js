import { MongoClient, ObjectId, Decimal128 } from 'mongodb';
// import BigNumber from 'bignumber.js';
import { sleep, createPoolKeyFromTokenAB } from './components/utils';

const USERNAME = process.env.MONGO_DB_USERNAME;
const PASSWORD = encodeURIComponent(process.env.MONGO_DB_PASSWORD);
const HOST = process.env.MONGO_DATABASE_URL;
const PORT = process.env.MONGO_DB_PORT;
const DB = process.env.MONGO_DB_NAME;
const AUTH_DB = process.env.MONGO_DB_NAME;

// Connection URL
const MONGO_URL = `mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${DB}?authSource=${AUTH_DB}`;
const MONGO_CLIENT = new MongoClient(MONGO_URL);

await MONGO_CLIENT.connect();

const MONGO_DB = MONGO_CLIENT.db(DB);

const MAX_MONGO_DOCUMENTS_REQUEST = 1000;

function convertDecimal128Fields(doc, skip = ['_id']) {
    const convertedDoc = {};

    for (const [key, value] of Object.entries(doc)) {
        if (skip.includes(key)) {
            convertedDoc[key] = value;
            continue;
        }

        if (value instanceof Decimal128) {
            convertedDoc[key] = value.toString();
        } else if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            convertedDoc[key] = convertDecimal128Fields(value);
        } else {
            convertedDoc[key] = value;
        }
    }

    return convertedDoc;
}

const setup = async () => {
    if (
        !(await system_status_collection.haveIndexs() &&
            await dinodex_pool_action_collection.haveIndexs() &&
            await dinodex_pool_list_collection.haveIndexs() &&
            await dinodex_token_collection.haveIndexs())
    ) {
        await system_status_collection.collection().createIndexes([
            { key: { hash: 1 }, name: "hash_1", unique: true }
        ]);
        await dinodex_pool_action_collection.collection().createIndexes([
            { key: { hash: 1, eventIndex: 1 }, name: "hash_eventIndex", unique: true },
            { key: { blockHeight: 1 }, name: "blockHeight_1" },
            { key: { tokenAId: 1, tokenBId: 1 }, name: "tokenAId_tokenBId" }
        ]);
        await dinodex_pool_list_collection.collection().createIndexes([
            { key: { hash: 1 }, name: "hash_1", unique: true },
            { key: { blockHeight: 1 }, name: "blockHeight_1" },
            { key: { poolKey: 1 }, name: "poolKey_1", unique: true },
            { key: { tokenAId: 1, tokenBId: 1 }, name: "tokenAId_tokenBId" }
        ]);
        await dinodex_token_collection.collection().createIndexes([
            { key: { hash: 1 }, name: "hash_1", unique: true },
            { key: { blockHeight: 1 }, name: "blockHeight_1" }
        ]);
        await dinodex_tokens_price_collection.collection().createIndexes([
            { key: { tokenId: 1 }, name: "tokenId_1", unique: true },
            { key: { timestamp: 1 }, name: "timestamp_1", unique: true }
        ]);
    }
}
const clear = async () => {
    await system_status_collection.collection().deleteMany({});
    await dinodex_pool_action_collection.collection().deleteMany({});
    await dinodex_pool_list_collection.collection().deleteMany({});
    await dinodex_token_collection.collection().deleteMany({});

    await MONGO_DB.dropCollection(system_status_collection.collectionName);
    await MONGO_DB.dropCollection(dinodex_pool_action_collection.collectionName);
    await MONGO_DB.dropCollection(dinodex_pool_list_collection.collectionName);
    await MONGO_DB.dropCollection(dinodex_token_collection.collectionName);
    await MONGO_DB.dropCollection(dinodex_tokens_price_collection.collectionName);
}

export const system_status_collection = {
    collectionName: 'system_status',
    collection: function () {
        return MONGO_DB.collection(this.collectionName);
    },
    totalDocuments: async function () {
        return await this.collection().countDocuments();
    },
    haveIndexs: async function () {
        try {
            return (await this.collection().listIndexes().toArray()).length > 0;
        } catch (error) {
            return false;
        }
    },
    // insertStatus: async function(){

    // }
}

export const dinodex_pool_list_collection = {
    collectionName: 'pools',
    collection: function () {
        return MONGO_DB.collection(this.collectionName);
    },
    totalDocuments: async function () {
        return await this.collection().countDocuments();
    },
    haveIndexs: async function () {
        try {
            return (await this.collection().listIndexes().toArray()).length > 0;
        } catch (error) {
            return false;
        }
    },
    lastBlockHeight: async function () {
        try {
            const data = await this.collection().find().sort({ blockHeight: -1 }).limit(1).toArray();
            if (data.length > 0) {
                return data[0].blockHeight;
            }
            return 0;
        } catch (error) {
            console.log(error);
            return 0;
        }
    },
    insertPool: async function (pool, session = null) {
        pool = {
            hash: pool.hash,
            tokenAId: String(pool.tokenAId),
            tokenBId: String(pool.tokenBId),
            poolKey: pool.poolKey,
            tokenAAmount: Decimal128.fromString(String(pool.tokenAAmount)),
            tokenBAmount: Decimal128.fromString(String(pool.tokenBAmount)),
            blockHeight: Number(pool.blockHeight)
        };
        if (session != null) {
            await this.collection().insertOne(pool, { session });
        } else {
            await this.collection().insertOne(pool);
        }
    },
    insertPools: async function (pools, session = null) {
        if (pools.length == 0) {
            return;
        }
        pools = pools.map(pool => ({
            hash: pool.hash,
            tokenAId: String(pool.tokenAId),
            tokenBId: String(pool.tokenBId),
            path: pool.path,
            poolKey: pool.poolKey,
            tokenAAmount: Decimal128.fromString(String(pool.tokenAAmount)),
            tokenBAmount: Decimal128.fromString(String(pool.tokenBAmount)),
            blockHeight: Number(pool.blockHeight)
        }));
        if (session != null) {
            await this.collection().insertMany(pools, { session });
        } else {
            await this.collection().insertMany(pools);
        }
    },
    usertPools: async function (poolActions, session = null) {
        //load old state
        const findPoolConditions = poolActions.map(action => ({ ...action, poolKey: createPoolKeyFromTokenAB(action.tokenAId, action.tokenBId) }));
        const groupedByPoolKey = findPoolConditions.reduce((acc, action) => {
            if (!acc[action.poolKey]) {
                acc[action.poolKey] = [];
            }
            acc[action.poolKey].push(action);
            return acc;
        }, {});
        const tempUpsertData = {};
        for (const [key, value] of Object.entries(groupedByPoolKey)) {
            tempUpsertData[key] = value.reduce((acc, action, actionIndex) => {
                if (actionIndex == 0) {
                    acc.tokenAId = action.tokenAId;
                    acc.tokenBId = action.tokenBId;
                    acc.path = [action.tokenAId, action.tokenBId];
                }
                if (action.type == dinodex_pool_action_collection.actionType.CREATE_POOL) {
                    acc.hash = action.hash;
                    acc.blockHeight = action.blockHeight;
                }
                if (acc.updatedAtBlockHeight == undefined || Number(acc.updatedAtBlockHeight) < Number(action.blockHeight)) {
                    acc.updatedAtBlockHeight = action.blockHeight;
                }
                switch (action.type) {
                    case dinodex_pool_action_collection.actionType.CREATE_POOL:
                        acc.tokenAAmount += BigInt(action.tokenAAmount);
                        acc.tokenBAmount += BigInt(action.tokenBAmount);
                        break;
                    case dinodex_pool_action_collection.actionType.ADD_LIQUIDITY:
                        acc.tokenAAmount += BigInt(action.tokenAAmount);
                        acc.tokenBAmount += BigInt(action.tokenBAmount);
                        break;
                    case dinodex_pool_action_collection.actionType.REMOVE_LIQUIDITY:
                        acc.tokenAAmount -= BigInt(action.tokenAAmount);
                        acc.tokenBAmount -= BigInt(action.tokenBAmount);
                        break;
                    case dinodex_pool_action_collection.actionType.SWAP:
                        if (action.directionAB) {
                            acc.tokenAAmount += BigInt(action.tokenAAmount);
                            acc.tokenBAmount -= BigInt(action.tokenBAmount);
                        } else {
                            acc.tokenAAmount -= BigInt(action.tokenAAmount);
                            acc.tokenBAmount += BigInt(action.tokenBAmount);
                        }
                        break;

                    default:
                        break;
                }
                return acc;
            }, {
                tokenAAmount: BigInt(0),
                tokenBAmount: BigInt(0),
                tokenAId: undefined,
                tokenBId: undefined,
                path: undefined,
                hash: undefined,
                blockHeight: undefined,
                updatedAtBlockHeight: undefined
            });
        }
        const oldData = await this.findPools({ poolKey: { '$in': Object.keys(groupedByPoolKey) } });
        const oldDataObj = {};
        oldData.forEach(item => oldDataObj[item.poolKey] = item);

        const upsertData = [];
        for (const [key, value] of Object.entries(tempUpsertData)) {
            const tempDataSet = {
                tokenAAmount: Decimal128.fromString((value.tokenAAmount + BigInt(oldDataObj[key]?.tokenAAmount ?? 0)).toString()),
                tokenBAmount: Decimal128.fromString((value.tokenBAmount + BigInt(oldDataObj[key]?.tokenBAmount ?? 0)).toString()),
                updatedAtBlockHeight: Number(value.updatedAtBlockHeight)
            };
            if (value.hash != undefined) {
                tempDataSet.hash = value.hash;
            }
            if (value.blockHeight != undefined) {
                tempDataSet.blockHeight = Number(value.blockHeight);
                tempDataSet.tokenAId = value.tokenAId;
                tempDataSet.tokenBId = value.tokenBId;
                tempDataSet.path = value.path;
            }
            upsertData.push({
                updateOne: {
                    filter: { poolKey: key },
                    update: { $set: tempDataSet },
                    upsert: true
                }
            })
        }
        if (session != null) {
            const result = await this.collection().bulkWrite(upsertData, { session });
        } else {
            const result = await this.collection().bulkWrite(upsertData);
        }


    },
    allPools: async function (fromBlockHeight = 0) {
        const documents = await this.collection().find({ blockHeight: { $gt: fromBlockHeight } }).sort({ blockHeight: -1 }).limit(MAX_MONGO_DOCUMENTS_REQUEST).toArray();
        // return documents
        return documents.map(doc => convertDecimal128Fields(doc))
    },
    findPools: async function (conditions) {
        const documents = await this.collection().find(conditions).sort({ blockHeight: -1 }).limit(MAX_MONGO_DOCUMENTS_REQUEST).toArray();
        return documents.map(doc => convertDecimal128Fields(doc))
    }
}

export const dinodex_pool_action_collection = {
    collectionName: 'pool_actions',
    collection: function () {
        return MONGO_DB.collection(this.collectionName);
    },
    totalDocuments: async function () {
        return await this.collection().countDocuments();
    },
    haveIndexs: async function () {
        try {
            return (await this.collection().listIndexes().toArray()).length > 0;
        } catch (error) {
            return false;
        }
    },
    lastBlockHeight: async function () {
        try {
            const data = await this.collection().find().sort({ blockHeight: -1 }).limit(1).toArray();
            if (data.length > 0) {
                return data[0].blockHeight;
            }
            return 0;
        } catch (error) {
            console.log(error);
            return 0;
        }
    },
    actionType: {
        CREATE_POOL: "createPool",
        ADD_LIQUIDITY: "addLiquidity",
        REMOVE_LIQUIDITY: "removeLiquidity",
        SWAP: "swap",
        checkTypeSupport: function (tempType) {
            return [this.CREATE_POOL, this.ADD_LIQUIDITY, this.REMOVE_LIQUIDITY, this.SWAP].includes(tempType);
        },
        renderType: function (tempType) {
            switch (tempType) {
                case this.CREATE_POOL:
                    return this.CREATE_POOL;
                case this.ADD_LIQUIDITY:
                    return this.ADD_LIQUIDITY;
                case this.REMOVE_LIQUIDITY:
                    return this.REMOVE_LIQUIDITY;
                case this.SWAP:
                    return this.SWAP;
                default:
                    this.SWAP;
            }
        }
    },
    //swap, create, add, remove (actions, runtimeMethod)
    addAction: async function (action, session = null) {
        action = {
            hash: action.hash,
            eventIndex: action.eventIndex,
            tokenAId: action.tokenAId,
            tokenBId: action.tokenBId,
            tokenAAmount: Decimal128.fromString(String(action.tokenAAmount)),
            tokenBAmount: Decimal128.fromString(String(action.tokenBAmount)),
            directionAB: action.direction > 0 ? true : false,
            type: this.actionType.renderType(action.type),
            blockHeight: Number(action.blockHeight)
        };
        if (session != null) {
            await this.collection().insertOne(action, { session });
        } else {
            await this.collection().insertOne(action);
        }
    },
    addActions: async function (actions, session = null) {
        if (actions.length == 0) {
            return;
        }
        actions = actions.map(action => ({
            creator: action.creator,
            hash: action.hash,
            eventIndex: action.eventIndex,
            tokenAId: action.tokenAId,
            tokenBId: action.tokenBId,
            tokenAAmount: Decimal128.fromString(String(action.tokenAAmount)),
            tokenBAmount: Decimal128.fromString(String(action.tokenBAmount)),
            directionAB: action.direction > 0 ? true : false,
            type: this.actionType.renderType(action.type),
            blockHeight: Number(action.blockHeight)
        }));
        if (session != null) {
            await this.collection().insertMany(actions, { session });
        } else {
            await this.collection().insertMany(actions);
        }
    },
    getActions: async function ({ blockPoint = 0, tokenAId, tokenBId }) {
        const data = await this.collection().find({
            blockHeight: { $gt: blockPoint },
            ...tokenAId ? { tokenAId } : {},
            ...tokenBId ? { tokenBId } : {},
        }).sort({ blockHeight: -1 }).toArray();
        return data.map(doc => convertDecimal128Fields(doc))
    },
    getActionsWithCondition: async function (condition = {}, options = {}) {
        const data = await this.collection().find(condition, options).sort({ blockHeight: -1 }).toArray();
        return data.map(doc => convertDecimal128Fields(doc))
    }

}
export async function upsertPoolDataSync(actions) {
    // const session = MONGO_CLIENT.startSession();
    // session.startTransaction();
    try {
        await dinodex_pool_action_collection.addActions(actions);
        await sleep(100);
        await dinodex_pool_list_collection.usertPools(actions);

        // await session.commitTransaction();


    } catch (error) {
        // await session.abortTransaction()
        console.log("upsertPoolDataSync", error);
    } finally {
        // await session.endSession();
    }
}

// export async function upsertPoolDataSync(actions, pools){
//     const session = MONGO_CLIENT.startSession();
//     session.startTransaction();
//     try {
//         await dinodex_pool_action_collection.addActions(actions, session);
//         await sleep(100);
//         await dinodex_pool_list_collection.insertPools(pools, session);

//         await session.commitTransaction();


//     } catch (error) {
//         await session.abortTransaction()
//         console.log("upsertPoolDataSync", error);
//     } finally {
//         await session.endSession();
//     }
// }

export const dinodex_token_collection = {
    collectionName: 'tokens',
    collection: function () {
        return MONGO_DB.collection(this.collectionName);
    },
    totalDocuments: async function () {
        return await this.collection().countDocuments();
    },
    haveIndexs: async function () {
        try {
            return (await this.collection().listIndexes().toArray()).length > 0;
        } catch (error) {
            return false;
        }
    },
    //swap, create, add, remove, transfer (actions, runtimeMethod)

}

export const dinodex_tokens_price_collection = {
    collectionName: 'tokens_price',
    collection: function () {
        return MONGO_DB.collection(this.collectionName);
    },
    totalDocuments: async function () {
        return await this.collection().countDocuments();
    },
    haveIndexs: async function () {
        try {
            return (await this.collection().listIndexes().toArray()).length > 0;
        } catch (error) {
            return false;
        }
    },
    insertHistorical: async function (newHistory = {}, session = null) {
        const listHistory = Object.entries(newHistory).map(([tokenId, infoPrice]) => ({
            tokenId: tokenId,
            timestamp: infoPrice.timestamp,
            value: infoPrice.value,
        }));
        if (session != null) {
            await this.collection().insertMany(listHistory, { session });
        } else {
            await this.collection().insertMany(listHistory);
        }
    },
    getHistorical: async function ({ timestamp = 0, tokenId, limit = 100 }) {
        const data = await this.collection().find({
            timestamp: { $gt: timestamp },
            ...tokenId ? { tokenId } : {}
        }).sort({ timestamp: -1 }).limit(limit).toArray();
        return data.map(doc => convertDecimal128Fields(doc)).map(his => ({
            timestamp: his.timestamp,
            value: his.value
        }))
    },
    //swap, create, add, remove, transfer (actions, runtimeMethod)

}

await setup();