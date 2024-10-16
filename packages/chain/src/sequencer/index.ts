import {
  VanillaGraphqlModules,
  GraphqlSequencerModule,
  GraphqlServer,
} from "@proto-kit/api";
import {
  PrivateMempool,
  SequencerModulesRecord,
  TimedBlockTrigger,
  BlockProducerModule,
  WithdrawalQueue,
  MinaBaseLayer,
  LocalTaskQueue
} from "@proto-kit/sequencer";
import { SettlementModule } from "./settlement/SettlementModule";
import { ModulesConfig } from "@proto-kit/common";
import { PrivateKey } from "o1js";

import { ConstantFeeStrategy } from "./protocol/baselayer/fees/ConstantFeeStrategy";

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
  BaseLayer: MinaBaseLayer,
  TaskQueue: LocalTaskQueue,
  FeeStrategy: ConstantFeeStrategy,
  SettlementModule: SettlementModule,
  BlockTrigger: TimedBlockTrigger,
  // WithdrawalQueue: WithdrawalQueue,
} satisfies SequencerModulesRecord;

export const baseSequencerModulesConfig = {
  ...apiSequencerModulesConfig,
  Mempool: {},
  BlockProducerModule: {},
  BaseLayer: {
    network: {
      local: true
    }
  },
  TaskQueue: {},
  FeeStrategy: {},
  SettlementModule: {
    feepayer: PrivateKey.fromBase58("EKDhmW7LrEpL365ZJsb1efZQwjTstSu1B8qWmgKwNLG6xmjgsCMr")
  },
  BlockTrigger: {
    blockInterval: Number(process.env.PROTOKIT_BLOCK_INTERVAL!),
    produceEmptyBlocks: false,
  }
  // WithdrawalQueue: {},
} satisfies ModulesConfig<typeof baseSequencerModules>;
