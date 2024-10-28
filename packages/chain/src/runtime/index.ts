import { Balance, VanillaRuntimeModules } from "@proto-kit/library";
import { ModulesConfig } from "@proto-kit/common";

import { Balances } from "./modules/balances";
import { Faucet } from "./modules/faucet";
import { XYK } from "./modules/dex/xyk";
import { TokenRegistry } from "./modules/dex/token-registry";
import { Withdrawals } from "./modules/Withdrawals";
import { Locks } from "./modules/locks";
export const modules = VanillaRuntimeModules.with({
  Balances,
  Locks,
  Withdrawals,
  Faucet,
  TokenRegistry,
  XYK,
});

export const config: ModulesConfig<typeof modules> = {
  Balances: {
    totalSupply: Balance.from(10n ** 18n),
  },
  Locks: {},
  Withdrawals: {},
  Faucet: {},
  TokenRegistry: {},
  XYK: {
    feeDivider: 1000n,
    fee: 3n
  },
};

export default {
  modules,
  config,
};
