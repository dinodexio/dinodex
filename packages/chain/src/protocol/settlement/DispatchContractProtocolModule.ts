import { inject, injectable } from "tsyringe";
import { PublicKey } from "o1js";

import type { RuntimeLike } from "@proto-kit/protocol";
import { ContractModule, SmartContractClassFromInterface } from "./ContractModule.js";
import {
  DispatchSmartContract,
  DispatchContractType,
  DispatchSmartContractBase,
} from "./contracts/build/src/DispatchSmartContract.js";

export type DispatchContractConfig = {
  incomingMessagesMethods: Record<string, `${string}.${string}`>;
};

@injectable()
export class DispatchContractProtocolModule extends ContractModule<
  DispatchContractType,
  DispatchContractConfig
> {
  public constructor(@inject("Runtime") private readonly runtime: RuntimeLike) {
    super();
  }

  public eventsDefinition() {
    return new DispatchSmartContract(PublicKey.empty<typeof PublicKey>())
      .events;
  }

  public contractFactory(): SmartContractClassFromInterface<DispatchContractType> {
    const { incomingMessagesMethods } = this.config;
    const methodIdMappings = this.runtime.methodIdResolver.methodIdMap();

    DispatchSmartContractBase.args = {
      incomingMessagesPaths: incomingMessagesMethods,
      methodIdMappings,
    };

    return DispatchSmartContract;
  }

  public async compile() {
    const contractVk = await DispatchSmartContract.compile();
    return {
      DispatchSmartContract: contractVk,
    };
  }
}
