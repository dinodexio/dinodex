import { AuroSigner, ClientAppChain } from "@proto-kit/sdk";
import runtime from "../runtime";
import { LPTokenId } from "../runtime/modules/dex/lp-token-id";
import { TokenPair } from "../runtime/modules/dex/token-pair";
import { PoolKey } from "../runtime/modules/dex/pool-key";
import { prepareGraph, dijkstra } from "../runtime/modules/dex/router";
import { TokenIdPath } from "../runtime/modules/dex/xyk";

const appChain = ClientAppChain.fromRuntime(runtime.modules, AuroSigner);

appChain.configurePartial({
  Runtime: runtime.config,
});

appChain.configurePartial({
  GraphqlClient: {
    url: process.env.NEXT_PUBLIC_PROTOKIT_GRAPHQL_URL,
  },
});

export const client = appChain;
export { LPTokenId, TokenPair, PoolKey, prepareGraph, dijkstra, TokenIdPath };