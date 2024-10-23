import {FungibleToken} from "../../../src/protocol/settlement/contracts/build/src/FungibleToken"

import { settlementTestFn } from "./Settlement";

describe.each(["mock-proofs", "signed"] as const)(
  "Settlement contracts: local blockchain - %s",
  (type) => {
    const network = {
      network: {
        type: "local",
      },
    } as const;

    describe("Default token", () => {
      settlementTestFn(type, network);
    });

    // describe("Custom token", () => {
    //   settlementTestFn(type, network, {
    //     tokenOwner: FungibleToken,
    //   });
    // });
  }
);
