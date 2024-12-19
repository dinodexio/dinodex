import { AuroSigner, ClientAppChain } from "@proto-kit/sdk";
import { PrivateKeySigner } from "../sdk/transaction/PrivateKeySigner";
import runtime from "../runtime";
import { LPTokenId } from "../runtime/modules/dex/lp-token-id";
import { TokenPair } from "../runtime/modules/dex/token-pair";
import { PoolKey } from "../runtime/modules/dex/pool-key";
import { prepareGraph, dijkstra } from "../runtime/modules/dex/router";
import { TokenIdPath } from "../runtime/modules/dex/xyk";

const appChain = ClientAppChain.fromRuntime(runtime.modules, AuroSigner);
const appChainBot = ClientAppChain.fromRuntime(runtime.modules, PrivateKeySigner);

appChain.configurePartial({
  Runtime: runtime.config,
});

appChain.configurePartial({
  GraphqlClient: {
    url: process.env.NEXT_PUBLIC_PROTOKIT_GRAPHQL_URL,
  },
});
appChainBot.configurePartial({
  Runtime: runtime.config,
  GraphqlClient: {
    url: process.env.NEXT_PUBLIC_PROTOKIT_GRAPHQL_URL,
  },
  Signer: {
    private: process.env.NEXT_PUBLIC_PROTOKIT_FACTORY_KEY
  }
});
export const createConfigForAppChainPrivateKeySigner = (privateKey: string) => {
  return {
    Runtime: runtime.config,
    GraphqlClient: {
      url: process.env.NEXT_PUBLIC_PROTOKIT_GRAPHQL_URL,
    },
    Signer: {
      private: privateKey
    }
  };
}
export const client = appChain;
export const clientBot = appChainBot;
export const clientBotTrade0 = ClientAppChain.fromRuntime(runtime.modules, PrivateKeySigner);
export const clientBotTrade1 = ClientAppChain.fromRuntime(runtime.modules, PrivateKeySigner);
export const clientBotTrade2 = ClientAppChain.fromRuntime(runtime.modules, PrivateKeySigner);
export const clientBotTrade3 = ClientAppChain.fromRuntime(runtime.modules, PrivateKeySigner);
export const clientBotTrade4 = ClientAppChain.fromRuntime(runtime.modules, PrivateKeySigner);
export const clientBotTrade5 = ClientAppChain.fromRuntime(runtime.modules, PrivateKeySigner);
export const clientBotTrade6 = ClientAppChain.fromRuntime(runtime.modules, PrivateKeySigner);
export const clientBotTrade7 = ClientAppChain.fromRuntime(runtime.modules, PrivateKeySigner);

export { LPTokenId, TokenPair, PoolKey, prepareGraph, dijkstra, TokenIdPath };