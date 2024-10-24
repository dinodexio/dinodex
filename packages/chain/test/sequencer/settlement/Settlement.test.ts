// import { jest } from "@jest/globals";
// import { FungibleToken } from "mina-fungible-token";
// import { FungibleToken } from "../../../src/protocol/settlement/contracts_v2/FungibleToken";
import { settlementTestFn } from "./Settlement";

// jest.useFakeTimers()
// describe.each(["mock-proofs", "signed"] as const)(
describe.each(["signed"] as const)(
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
