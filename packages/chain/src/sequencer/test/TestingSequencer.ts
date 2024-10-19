import { TypedClass } from "@proto-kit/common";

import {
  BatchProducerModule,
  InMemoryDatabase,
  LocalTaskQueue,
  LocalTaskWorkerModule,
  ManualBlockTrigger,
  NoopBaseLayer,
  PrivateMempool,
  Sequencer,
  SequencerModulesRecord,
  TaskWorkerModulesRecord,
  VanillaTaskWorkerModules,
} from "@proto-kit/sequencer";
import {BlockProducerModule} from "../protocol/production/sequencing/BlockProducerModule"
import { ConstantFeeStrategy } from "../protocol/baselayer/fees/ConstantFeeStrategy";

export interface DefaultTestingSequencerModules extends SequencerModulesRecord {
  Database: typeof InMemoryDatabase;
  Mempool: typeof PrivateMempool;
  LocalTaskWorkerModule: TypedClass<LocalTaskWorkerModule<any>>;
  BaseLayer: typeof NoopBaseLayer;
  BatchProducerModule: typeof BatchProducerModule;
  BlockProducerModule: typeof BlockProducerModule;
  BlockTrigger: typeof ManualBlockTrigger;
  TaskQueue: typeof LocalTaskQueue;
  FeeStrategy: typeof ConstantFeeStrategy;
}

export function testingSequencerFromModules<
  AdditionalModules extends SequencerModulesRecord,
  AdditionalTaskWorkerModules extends TaskWorkerModulesRecord,
>(
  modules: AdditionalModules,
  additionalTaskWorkerModules?: AdditionalTaskWorkerModules
): TypedClass<Sequencer<DefaultTestingSequencerModules & AdditionalModules>> {
  const taskWorkerModule = LocalTaskWorkerModule.from({
    ...VanillaTaskWorkerModules.withoutSettlement(),
    ...additionalTaskWorkerModules,
  });

  const defaultModules: DefaultTestingSequencerModules = {
    Database: InMemoryDatabase,
    Mempool: PrivateMempool,
    BaseLayer: NoopBaseLayer,
    // LocalTaskWorkerModule: taskWorkerModule,
    BatchProducerModule,
    BlockProducerModule,
    BlockTrigger: ManualBlockTrigger,
    TaskQueue: LocalTaskQueue,
    FeeStrategy: ConstantFeeStrategy,
  } as DefaultTestingSequencerModules;

  return Sequencer.from({
    modules: {
      ...defaultModules,
      ...modules,
      // We need to make sure that the taskworkermodule is initialized last
      LocalTaskWorkerModule: taskWorkerModule,
    },
  });
}
