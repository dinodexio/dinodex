import { inject } from "tsyringe";
import {
  MandatoryProtocolModulesRecord,
  Protocol,
  RuntimeVerificationKeyRootService,
} from "@proto-kit/protocol";
import { log, sleep } from "@proto-kit/common";

import {
  SequencerModule,
  sequencerModule,
  FlowCreator,
} from "@proto-kit/sequencer";
import { WorkerRegistrationFlow } from "@proto-kit/sequencer/dist/worker/WorkerRegistrationFlow";

import { CircuitCompilerTask } from "@proto-kit/sequencer/dist/protocol/production/tasks/CircuitCompilerTask";
import { VerificationKeyService, VKRecord } from "@proto-kit/sequencer/dist/protocol/runtime/RuntimeVerificationKeyService";

@sequencerModule()
export class ProtocolStartupModule extends SequencerModule {
  public constructor(
    private readonly flowCreator: FlowCreator,
    @inject("Protocol")
    private readonly protocol: Protocol<MandatoryProtocolModulesRecord>,
    private readonly compileTask: CircuitCompilerTask,
    private readonly verificationKeyService: VerificationKeyService,
    private readonly registrationFlow: WorkerRegistrationFlow
  ) {
    super();
  }

  public async start() {
    const flow = this.flowCreator.createFlow("compile-circuits", {});

    log.info("Compiling Protocol circuits, this can take a few minutes");

    // const vks = await flow.withFlow<VKRecord>(async (res, rej) => {
    // log.info("Protocol circuits res", res);
    //   await flow.pushTask(this.compileTask, undefined, async (result) => {
    //     log.info("Protocol result", result);
    //     res(result);
    //   });
    // });

    // log.info("Protocol circuits compiled");

    // await this.verificationKeyService.initializeVKTree(vks);

    // const root = this.verificationKeyService.getRoot();
    const root = 0n;
    log.info("root verificationKeyService", root);

    this.protocol.dependencyContainer
      .resolve(RuntimeVerificationKeyRootService)
      .setRoot(root);

    await this.registrationFlow.start({
      runtimeVerificationKeyRoot: root,
    });

    await sleep(500);

    log.info("Protocol circuits compiled successfully, commencing startup");
  }
}
