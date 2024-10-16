import { Balance, VanillaRuntimeModules } from "@proto-kit/library";
import { ModulesConfig } from "@proto-kit/common";

import { Balances } from "./modules/balances";
import { Faucet } from "./modules/faucet";
import { XYK } from "./modules/dex/xyk";
import { TokenRegistry } from "./modules/dex/token-registry";
import { Withdrawals } from "./modules/Withdrawals";

export const modules = VanillaRuntimeModules.with({
  Balances,
  Withdrawals,
  Faucet,
  TokenRegistry,
  XYK
});

export const config: ModulesConfig<typeof modules> = {
  Balances: {
    totalSupply: Balance.from(1_000_000_000),
  },
  Withdrawals: {},
  Faucet: {},
  TokenRegistry: {},
  XYK: {
    feeDivider: 1000n,
    fee: 3n
  }
};

export default {
  modules,
  config,
};
