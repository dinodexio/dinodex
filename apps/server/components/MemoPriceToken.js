import BigNumber from "bignumber.js";
import { dinodex_tokens_price_collection } from "../db";
import { prepareGraph, dijkstra } from "chain";

export const MemoPriceToken = {
    TOKEN_ID_BASE: "4",
    MAX_LENGTH_HISTORY: 1000,
    tokens: ["0", "1", "2", "3", "4", "5", "6", "7"],
    data: {},
    historical: {

    },

    set: function ({
        tokens,
        data,
    }) {
        tokens && (this.tokens = tokens)
        data && (this.tokens = data)
    },

    update: async function (newPools = [], tokenIdBase = this.TOKEN_ID_BASE) {
        const timestamp = new Date().valueOf()
        if (!newPools || newPools.length == 0) return

        const PATHS = this.getPaths(newPools)
        const graph = prepareGraph(PATHS)
        const tempHistory = {}
        this.tokens.forEach((tokenId) => {
            if (tokenId == tokenIdBase) {
                this.data[tokenId] = "1"
                return
            }
            const dijkstraValue = dijkstra(graph, tokenIdBase, tokenId)
            if (!dijkstraValue) return
            const vectorValue = [tokenIdBase, ...dijkstraValue.path]
            let rateTokenWithTokenBase = BigNumber(1)
            for (var i = 0; i < vectorValue.length - 1; i++) {
                const tokenOne = vectorValue[i]
                const tokenTwo = vectorValue[i + 1]

                const [tokenOneAmount, tokenTwoAmount] = this.getAmountPool(newPools, tokenOne, tokenTwo)
                rateTokenWithTokenBase = BigNumber(tokenOneAmount).multipliedBy(rateTokenWithTokenBase).dividedBy(tokenTwoAmount)
            }
            this.data[tokenId] = rateTokenWithTokenBase.toString()

            // TO DO save historical in database
            if (!Object.keys(this.historical).includes(tokenId)) {
                this.historical[tokenId] = []
            }
            this.historical[tokenId].unshift({
                timestamp,
                value: rateTokenWithTokenBase.toString()
            })
            if (this.historical[tokenId].length > this.MAX_LENGTH_HISTORY) {
                this.historical[tokenId].splice(this.MAX_LENGTH_HISTORY, this.historical[tokenId].length - this.MAX_LENGTH_HISTORY)
            }

            // TO DO
            tempHistory[tokenId] = {
                timestamp,
                value: rateTokenWithTokenBase.toString()
            }
        })
        dinodex_tokens_price_collection.insertHistorical(tempHistory)
    },

    getAmountPool: function (pools = [], tokenAId = '', tokenBId = '') {
        const pool = pools.find(pool => (
            [pool.tokenAId, pool.tokenBId].includes(tokenAId)
            && [pool.tokenAId, pool.tokenBId].includes(tokenBId)
        ))

        return [
            pool.tokenAId == tokenAId ? pool.tokenAAmount : pool.tokenBAmount,
            pool.tokenAId == tokenAId ? pool.tokenBAmount : pool.tokenAAmount
        ]
    },

    getPaths: function (pools = newPools) {
        return pools.reduce((result, pool) => {
            if (!BigNumber(pool.tokenAAmount).eq(0) && !BigNumber(pool.tokenAAmount).eq(0)) {
                result.push(pool.path)
            }
            return result
        }, [])
    },

    getPriceTokens: function (tokenId) {
        return this.data[tokenId]
    }
}