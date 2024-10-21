import {
  VanillaGraphqlModules,
  GraphqlSequencerModule,
  GraphqlServer,
} from "@proto-kit/api";
import {
  PrivateMempool,
  SequencerModulesRecord,
  // TimedBlockTrigger,
  BlockProducerModule,
  MinaBaseLayer
} from "@proto-kit/sequencer";
import { TimedBlockTrigger } from "./protocol/production/trigger/TimedBlockTrigger";
import { ModulesConfig } from "@proto-kit/common";
import { IndexerNotifier } from "@proto-kit/indexer";
import { SettlementModule } from "./settlements/SettlementModule";
import { ConstantFeeStrategy } from "./protocol/baselayer/fees/ConstantFeeStrategy";
import { PrivateKey } from "o1js";

export const apiSequencerModules = {
  GraphqlServer,
  Graphql: GraphqlSequencerModule.from({
    modules: VanillaGraphqlModules.with({}),
  }),
} satisfies SequencerModulesRecord;

export const apiSequencerModulesConfig = {
  Graphql: VanillaGraphqlModules.defaultConfig(),
  GraphqlServer: {
    port: Number(process.env.PROTOKIT_GRAPHQL_PORT),
    host: process.env.PROTOKIT_GRAPHQL_HOST!,
    graphiql: Boolean(process.env.PROTOKIT_GRAPHIQL_ENABLED),
  },
} satisfies ModulesConfig<typeof apiSequencerModules>;

export const baseSequencerModules = {
  ...apiSequencerModules,
  Mempool: PrivateMempool,
  BlockProducerModule: BlockProducerModule,
  BlockTrigger: TimedBlockTrigger,
  BaseLayer: MinaBaseLayer,
  FeeStrategy: ConstantFeeStrategy,
  SettlementModule: SettlementModule
} satisfies SequencerModulesRecord;

export const baseSequencerModulesConfig = {
  ...apiSequencerModulesConfig,
  Mempool: {},
  BlockProducerModule: {},
  BlockTrigger: {
    blockInterval: Number(process.env.PROTOKIT_BLOCK_INTERVAL!),
    produceEmptyBlocks: true,
  },
  BaseLayer: {
    network: {
      type: "local"
    }
  },
  FeeStrategy: {},
  SettlementModule: {
    feepayer: PrivateKey.fromBase58("EKDhmW7LrEpL365ZJsb1efZQwjTstSu1B8qWmgKwNLG6xmjgsCMr")
  }
} satisfies ModulesConfig<typeof baseSequencerModules>;

export const indexerSequencerModules = {
  IndexerNotifier: IndexerNotifier,
} satisfies SequencerModulesRecord;

export const indexerSequencerModulesConfig = {
  IndexerNotifier: {},
} satisfies ModulesConfig<typeof indexerSequencerModules>;
