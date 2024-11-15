import BigNumber from 'bignumber.js';
import { Mutex } from 'async-mutex';
import * as Utils from "./utils.js";
import { NULL_TX } from '../constants/index.js';

export const MemoTxs = {
    mutexTxsUpdate: new Mutex(),
    maxNonce: 0,
    minNonce: 0,
    pgClient: undefined,
    clientAppchain: undefined,
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
    init: async function (pgClient, clientAppchain) {
        this.pgClient = pgClient;
        this.clientAppchain = clientAppchain;
        // console.log(pgClient, this.pgClient)
        const release = await this.mutexTxsUpdate.acquire();
        const dataLength = 1000;
        const query = `${this.baseQuery} ORDER BY b.height::numeric desc, t.nonce::numeric desc LIMIT ${dataLength} ;`;
        const data = await this.pgClient.query(query);
        if(data.rows.length > 0){
            this.minNonce = Number(data.rows[data.rows.length - 1].nonce);
            this.minBlockHeight = Number(data.rows[data.rows.length - 1].blockHeight);
            this.append(data.rows);
        }
        release();
    },
    update: async function () {
        const release = await this.mutexTxsUpdate.acquire();
        const dataLength = 1000;
        const query = `${this.baseQuery} WHERE 
      (b.height::numeric > ${this.maxBlockHeight}  OR (b.height::numeric = ${this.maxBlockHeight}  AND t.nonce::numeric > ${this.maxNonce} ))
      ORDER BY b.height::numeric asc, t.nonce::numeric asc LIMIT ${dataLength} ;`;
        const data = await this.pgClient.query(query);
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
    loadHistory: async function ( limit) {
        if (this.data.length >= 0.99 * this.maxLength) return;
        const release = await this.mutexTxsUpdate.acquire();

        const query = `${this.baseQuery} WHERE
      (b.height::numeric < ${this.minBlockHeight}  OR (b.height::numeric = ${this.minBlockHeight}  AND t.nonce::numeric < ${this.minNonce} ))
      ORDER BY b.height::numeric desc, t.nonce::numeric desc LIMIT ${limit} ;`;
        const data = await this.pgClient.query(query);
        this.data.push(...data.rows.filter(tx => (
            BigNumber(this.minBlockHeight).gt(tx.blockHeight)
            || (BigNumber(this.maxBlockHeight).eq(tx.blockHeight) && BigNumber(tx.nonce).lt(this.maxNonce)))
        ));
        this.minNonce = Number(this.data[this.data.length - 1].nonce)
        this.minBlockHeight = Number(this.data[this.data.length - 1].blockHeight)
        this.mapping();
        release();
    },
    getTxs: async function ( blockHeightPoint, noncePoint, direction, limit) {
        limit = Number(limit);
        blockHeightPoint = Number(blockHeightPoint);
        noncePoint = Number(noncePoint);
        direction = Number(direction);
        limit = limit > this.maxLengthRequest ? this.maxLengthRequest : (limit > 0 ? limit : 1);
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
                await this.loadHistory(limit);
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
            var tempDataSingle = this.dataSingle.get(hash);
            if (tempDataSingle != undefined) {
                return tempDataSingle;
            }
            const data = await this.pgClient.query(`${this.baseQuery} WHERE t.hash='${hash}';`);
            if (data.rows.length > 0) {
                this.updateSingle(data.rows[0]);
                return data.rows[0];
            }
        }
        return NULL_TX;
    }
}