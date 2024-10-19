import { settlementTestFn } from "./Settlement.js";

describe.each(["mock-proofs", "signed"] as const)(
  "settlement contracts: localblockchain - %s",
  (type) => {
    settlementTestFn(type, {
      network: {
        local: true,
      },
    });
  }
);
