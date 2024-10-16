import { Field, PublicKey, UInt32, type Proof } from "o1js";
import {
    AreProofsEnabled,
    ChildContainerProvider,
    ConfigurableModule,
    NoConfig,
    noop
} from "../ProtokitCommon.js";
import {log} from "../log.js";
import { injectable } from "tsyringe";


import { NetworkState } from "../model/network/NetworkState.js";
import type { SettlementSmartContract } from "../../SettlementSmartContract.js";

import {BlockProverPublicInput, BlockProverPublicOutput} from "../prover/block/BlockProvable.js"

export type BlockProof = Proof<BlockProverPublicInput, BlockProverPublicOutput>;

const errors = {
  stateServiceNotSet: () =>
    new Error(
      "StateService has not been set yet. Be sure to either call your runtime or protocol function by creating them with an AppChain or by setting the stateService manually."
    ),
};

@injectable()
export class StateServiceProvider {
  private readonly stateServiceStack: SimpleAsyncStateService[] = [];

  public get stateService(): SimpleAsyncStateService {
    if (this.stateServiceStack.length === 0) {
      throw errors.stateServiceNotSet();
    }

    // Assertion here is ok, because we check that the array is not empty above
    return this.stateServiceStack.at(-1)!;
  }

  public setCurrentStateService(service: SimpleAsyncStateService) {
    this.stateServiceStack.push(service);
  }

  public popCurrentStateService() {
    if (this.stateServiceStack.length === 0) {
      log.trace("Trying to pop from empty state-service stack");
      return;
    }
    this.stateServiceStack.pop();
  }
}


export interface SimpleAsyncStateService {
    get: (key: Field) => Promise<Field[] | undefined>;
    set: (key: Field, value: Field[] | undefined) => Promise<void>;
  }
  
export interface ProtocolEnvironment {
    get stateService(): SimpleAsyncStateService;
    get stateServiceProvider(): StateServiceProvider;
    getAreProofsEnabled(): AreProofsEnabled;
}

export abstract class ProtocolModule<
    Config = NoConfig,
> extends ConfigurableModule<Config> {
    public protocol?: ProtocolEnvironment;

    public get appChain(): AreProofsEnabled | undefined {
        return this.protocol?.getAreProofsEnabled();
    }

    public create(childContainerProvider: ChildContainerProvider): void {
        noop();
    }

    public async start() {
        noop();
    }
}

export type SettlementStateRecord = {
    sequencerKey: PublicKey;
    lastSettlementL1BlockHeight: UInt32;

    stateRoot: Field;
    networkStateHash: Field;
    blockHashRoot: Field;
};

export type SettlementHookInputs = {
    blockProof: BlockProof;
    fromNetworkState: NetworkState;
    toNetworkState: NetworkState;
    newPromisedMessagesHash: Field;
    contractState: SettlementStateRecord;
    currentL1BlockHeight: UInt32;
};

export abstract class ProvableSettlementHook<
    Config,
> extends ProtocolModule<Config> {
    public abstract beforeSettlement(
        smartContract: SettlementSmartContract,
        inputs: SettlementHookInputs
    ): Promise<void>;
}
