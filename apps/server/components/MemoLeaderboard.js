import BigNumber from "bignumber.js";
import { PublicKey } from 'o1js';
import { BalancesKey, TokenId } from "@proto-kit/library";

export const MemoLeaderboard = {
  clientBotAppChain: undefined,
  blockHeight: 0,
  data: {},
  processData: {},
  maxBlockRank: 60 * 60 / 5,
  maxLengthHistory: 60 * 60 / 5,
  sortTotalVolume: [],
  tokens: ["0", "1", "2"],
  prices: {

  },
  historical: {},
  space_time: 30 * 1000,
  init: function (client) {
    this.clientBotAppChain = client
  },
  loadLeaderboard: async function () {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PROTOKIT_PROCESSOR_GRAPHQL_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query LeaderboardQuery {
              poolActions(where: {blockHeight: {equals: ${this.blockHeight}}}) {
                blockHeight
                createAt
                creator
                directionAB
                eventIndex
                hash
                poolKey
                status
                tokenAAmount
                tokenAId
                tokenAPrice
                tokenBAmount
                tokenBId
                tokenBPrice
                type
              }
              tokens {
                price
                tokenId
              }
            }
          `,
        }),
      });

      const dataRes = await response.json()
      const dataPoolActions = dataRes.data.poolActions
      dataRes.data.tokens.forEach(({ tokenId, price }) => {
        this.prices[tokenId] = price
      })
      this.updateData(dataPoolActions)

      //end
      this.data = { ...this.processData }
      Object.entries(this.data).forEach(([walletAddress, info = {}]) => {
        let oldTotalVolume = this.historical[walletAddress] ? this.historical[walletAddress]["totalVolume"] : []
        let oldPnl = this.historical[walletAddress] ? this.historical[walletAddress]["pnl"] : []
        if (oldTotalVolume.length > this.maxLengthHistory) {
          oldTotalVolume = oldTotalVolume.slice(0, this.maxLengthHistory)
        }
        if (oldPnl.length > this.maxLengthHistory) {
          oldPnl = oldPnl.slice(0, this.maxLengthHistory)
        }
        this.historical = {
          ...this.historical,
          [walletAddress]: {
            totalVolume: [info.totalVolume, ...oldTotalVolume],
            pnl: [info.pnl, ...oldPnl]
          }

        }
      });
      this.blockHeight += 1
    } catch (error) {
      console.log(error)
    }

  },
  updateData: function (dataPoolActions = []) {
    if (dataPoolActions.length == 0) return
    dataPoolActions.forEach((poolAction = {}) => {
      this.updateInfoWallet(poolAction)
    })

    this.updateRank()
  },
  getBalance: async function (tokenId, address) {
    const balanceKey = new BalancesKey({ tokenId: TokenId.from(tokenId), address: PublicKey.fromBase58(address) })
    const balance = await this.clientBotAppChain.query.runtime.Balances.balances.get(balanceKey)
    return balance
  },
  getHistory: function (address, key = 'totalVolume') {
    const historicalData = this.historical[address] ? this.historical[address][key] : []
    let indexHistory = this.maxLengthHistory - 1
    if (historicalData.length == 0) return 0
    if (indexHistory > historicalData.length) {
      indexHistory = historicalData.length - 1
    }
    return historicalData[indexHistory]
  },
  updateInfoWallet: function (currentDataBlock = {}) {
    const {
      creator,
      tokenAAmount,
      tokenAPrice,
      tokenBAmount,
      tokenBPrice
    } = currentDataBlock

    const volume = BigNumber(tokenAAmount).times(tokenAPrice).plus(
      BigNumber(tokenBAmount).times(tokenBPrice)
    ).dividedBy(10e9)

    const newTotalVolume = BigNumber(this.processData[creator]?.totalVolume || 0).plus(volume)
    const totalVolumeHistory = this.getHistory(creator, "totalVolume") || 0

    this.processData[creator] = {
      ...this.processData[creator],
      totalVolume: newTotalVolume.toString(),
      totalVolumeChange: totalVolumeHistory == 0 ? 100 : BigNumber(newTotalVolume).minus(totalVolumeHistory).dividedBy(totalVolumeHistory).times(100).toNumber()
    }
  },
  updateRank: async function () {
    const sortTotalVolume = this.convertAndSort("totalVolume", 'desc')
    const wallets = []
    sortTotalVolume.forEach((item, index) => {
      const rank = index + 1
      const { walletAddress, blockHeightRank, ...otherInfo } = item
      wallets.push(walletAddress)
      this.processData[walletAddress] = {
        ...this.processData[walletAddress],
        ...otherInfo,
        ...BigNumber(otherInfo["totalVolume"] || 0).eq(this.data[walletAddress]?.totalVolume || 0) ? {} : {
          blockHeightRank: this.blockHeight
        },
        ...(otherInfo.rank !== rank) ? { preRank: otherInfo.rank } : {},
        // ...(this.blockHeight - blockHeightRank > this.maxBlockRank) ? {} : { preRank: undefined },
        rank
      }
    })

    for (var i = 0; i < wallets.length; i++) {
      const addressWallet = wallets[i]
      const balancesMina = await this.getBalance("0", addressWallet)
      const balancesTrex = await this.getBalance("1", addressWallet)
      const balancesRaptor = await this.getBalance("2", addressWallet)
      const pnl = BigNumber(balancesMina.toString())
        .plus(BigNumber(balancesTrex.toString()).times(this.prices["1"] || 0))
        .plus(BigNumber(balancesRaptor.toString()).times(this.prices["2"] || 0))
        .minus(1000 * 10e9)
        .dividedBy(10e9)
      const pnlHistory = this.getHistory(addressWallet, "pnl") || 0
      this.processData[addressWallet] = {
        ...this.processData[addressWallet],
        pnl: pnl.toString(),
        pnlChange: pnlHistory == 0 ? 100 : BigNumber(pnl).minus(pnlHistory).dividedBy(pnlHistory).times(100).toNumber()
      }
    }
    this.sortTotalVolume = this.convertAndSort()

  },
  convertAndSort: function (key = "rank", type = 'asc') {
    const array = Object.entries(this.processData).map(([walletAddress, info = {}]) => ({
      walletAddress,
      ...info
    }));
    (type == 'asc') && array.sort((a, b) => BigNumber(a[key]).minus(b[key]).toNumber());
    (type == 'desc') && array.sort((a, b) => BigNumber(b[key]).minus(a[key]).toNumber());
    return array;
  }
}