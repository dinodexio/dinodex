import BigNumber from "bignumber.js";
import { EXPIRED_TIME } from "../constants";

export const MemoChain = {
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
          BigNumber(this.maxBlockHeight || 0).minus(blockHeight || 0).multipliedBy(EXPIRED_TIME)
        ).toNumber()
    }
  }