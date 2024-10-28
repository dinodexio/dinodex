import pg from 'pg'
import cors from 'cors'
import express, { json } from 'express'
// import { Pools } from "./tokens"
import { client as clientApp, dijkstra, prepareGraph } from "chain";
import { MethodIdResolver } from "@proto-kit/module";
import { promises as fs } from 'fs';
import { Mutex } from 'async-mutex';
import {TokenId} from "@proto-kit/library"

const mutex = new Mutex();
const mutexs = {
  txsLoadHistory: new Mutex(),
  txsUpdate: new Mutex(),
}

const { Client } = pg
const app = express()
await clientApp.start()
// test get circulatingSupply
const circulatingSupply = await clientApp.query.runtime.Balances.circulatingSupply.get(
  TokenId.from(0),
);
console.log("circulatingSupply ", circulatingSupply);
//
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

const CREATE_POOL_METHOD_ID = "14611692223427430559526007140581096422970105604128196339131458122687359281956";
const NULL_TX = {hash: null};
const MemoTxs = {
  maxNonce: 0,
  minNonce: undefined,
  data: [],
  dataSingle: [],
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
  maxLength: Number(process.env.MAX_MEMO_TRANS || 10000),
  maxLengthRequest: 1000,
  dataObject: {},
  append: function (newTxs = []) {
    if (!newTxs || newTxs.length == 0) return
    const newTxsWillAppend = newTxs.filter(tx => Number(tx.nonce) > this.maxNonce)
    this.data.unshift(...newTxsWillAppend)
    this.maxNonce = Number(this.data[0].nonce)
    if (this.data.length > this.maxLength) {
      this.data.splice(this.maxLength, this.data.length - this.maxLength)
      this.minNonce = Number(this.data[this.data.length - 1].nonce)
    }
  },
  init: async function () {
    const dataLength = 1000;
    const query = `${this.baseQuery} ORDER BY  nonce::numeric desc LIMIT ${dataLength} ;`;
    const data = await client.query(query);
    this.append(data.rows);
  },
  update: async function () {
    const release = await mutexs.txsUpdate.acquire();
    const dataLength = 1000;
    const query = `${this.baseQuery} WHERE t.nonce::numeric > ${this.maxNonce} ORDER BY t.nonce::numeric asc LIMIT ${dataLength} ;`;
    const data = await client.query(query);
    this.append(data.rows.reverse());
    release();
  },
  updateSingle: function(newTx) {
    if(this.dataSingle.length >= 1000){
      this.dataSingle.splice(500, 2000);
    }
    this.dataSingle.unshift(newTx);
  },
  loadHistory: async function (limit) {
    const release = await mutexs.txsLoadHistory.acquire();
    const query = `${this.baseQuery} WHERE t.nonce::numeric < ${this.minNonce} ORDER BY t.nonce::numeric desc LIMIT ${limit} ;`;
    const data = await client.query(query);
    this.data.push(...data);
    release();
  },
  getTxs: async function(noncePoint, direction, limit){
    limit = limit > this.maxLengthRequest ? this.maxLengthRequest : limit;

    if(noncePoint == -1){
      return this.data.slice(0, limit);
    }

    if(direction < 0 && noncePoint - limit > 0 && this.minNonce > noncePoint - limit){
      await this.loadHistory(noncePoint - limit);
    } else if(direction > 0 && this.minNonce > noncePoint){
      await this.loadHistory(this.minNonce - noncePoint);
    }
    
    const tempData = this.data.filter(tx => direction > 0 ? Number(tx.nonce) > Number(noncePoint) : Number(tx.nonce) < Number(noncePoint));
    if(direction > 0){
      return tempData.reverse().slice(0, limit).reverse();
    } else {
      return tempData.slice(0, limit);
    }
  },
  getTx: async function(hash){
    const tempData = this.data.filter(tx => tx.hash == hash);
    if(tempData.length > 0){
      return tempData[0];
    } else {
      tempDataSingle = this.dataSingle.filter(tx => tx.hash == hash);
      if(tempDataSingle.length > 0){
        return tempDataSingle[0];
      }
      const data = await client.query(`${this.baseQuery} WHERE ter.hash='${hash}';`);
      if(data.rows.length > 0){
        this.updateSingle(data.rows[0]);
        return data.rows[0];
      }
    }
    return NULL_TX;
  }
}

const MemoPool = {
  maxNonce: 0,
  // minNonce: undefined,
  data: [],
  append: function (newTxs = []) {
    if (!newTxs || newTxs.length == 0) return
    const newTxsWillAppend = newTxs.filter(tx => Number(tx.nonce) > this.maxNonce)
    this.data.unshift(...newTxsWillAppend)
    this.maxNonce = Number(this.data[0].nonce)

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
  loadPools: async function (length = 20) {
    try {
      const dataPrisma = await client.query(
        `${MemoTxs.baseQuery} WHERE t."methodId" = $1 AND t.nonce::numeric > $2 AND ter.status=TRUE ORDER BY t.nonce::numeric asc LIMIT $3;`,
        [CREATE_POOL_METHOD_ID, this.maxNonce, length]);
      const newTxsPool = []
      dataPrisma.rows.reverse().forEach((tx) => {
        const argsFields = tx["argsFields"]
        newTxsPool.push({
          ...tx,
          path: [argsFields[0], argsFields[1]],
          tokenAId: argsFields[0],
          tokenBId: argsFields[1],
        })
      })
      this.append(newTxsPool)
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
  while (loopIndex < maxLoop) {
    await MemoTxs.update();
    await sleep(2000);
    await MemoPool.loadPools();
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
                    nonce::numeric desc;`;
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

app.get('/pools', (req, res) => {
  const { take = 100, skip = 0 } = req.query
  // return res.json(MemoPool.data);
  res.json({
    error: false,
    data: MemoPool.data
      .slice(skip, take > 100 ? 100 : take)
      .map(txPool => ({
        tokenAId: txPool.tokenAId,
        tokenBId: txPool.tokenBId,
      }))
  })
})

app.get('/transactions', async (req, res) => {
  const { noncePoint = -1, direction = 1, limit = 100 } = req.query
  const txs = await MemoTxs.getTxs(noncePoint, direction, limit);
  res.json({ error: false, data: txs });
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