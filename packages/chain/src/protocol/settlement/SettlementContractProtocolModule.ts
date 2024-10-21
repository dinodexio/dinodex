import { CompileArtifact } from "@proto-kit/common";
import { inject, injectable, injectAll } from "tsyringe";

import type { BlockProvable } from "../prover/block/BlockProvable.js";
import { ContractModule, SmartContractClassFromInterface } from "./ContractModule.js";
import { ProvableSettlementHook } from "./contracts/build/src/common/modularity/ProvableSettlementHook.js";
import { DispatchSmartContractBase } from "./contracts/build/src/DispatchSmartContract.js";
import {
  LazyBlockProof,
  SettlementContractType,
  SettlementSmartContract,
  SettlementSmartContractBase,
} from "./contracts/build/src/SettlementSmartContract.js";
import { BridgeContractBase } from "./contracts/build/src/BridgeContract.js";
import { DispatchContractProtocolModule } from "./DispatchContractProtocolModule.js";
import { BridgeContractProtocolModule } from "./BridgeContractProtocolModule.js";

export type SettlementContractConfig = {
  escapeHatchSlotsInterval?: number;
};

// 24 hours
export const DEFAULT_ESCAPE_HATCH = (60 / 3) * 24;

@injectable()
export class SettlementContractProtocolModule extends ContractModule<
  SettlementContractType,
  SettlementContractConfig
> {
  public constructor(
    @injectAll("ProvableSettlementHook")
    private readonly hooks: ProvableSettlementHook<unknown>[],
    @inject("BlockProver")
    blockProver: BlockProvable,
    @inject("DispatchContract")
    private readonly dispatchContractModule: DispatchContractProtocolModule,
    @inject("BridgeContract")
    private readonly bridgeContractModule: BridgeContractProtocolModule
  ) {
    LazyBlockProof.tag = blockProver.zkProgrammable.zkProgram[0].Proof.tag;
    super();
  }

  public contractFactory(): SmartContractClassFromInterface<SettlementContractType> {
    const { hooks, config } = this;
    const dispatchContract = this.dispatchContractModule.contractFactory();
    const bridgeContract = this.bridgeContractModule.contractFactory();

    const escapeHatchSlotsInterval =
      config.escapeHatchSlotsInterval ?? DEFAULT_ESCAPE_HATCH;

    const { args } = SettlementSmartContractBase;
    SettlementSmartContractBase.args = {
      DispatchContract: dispatchContract,
      hooks,
      escapeHatchSlotsInterval,
      BridgeContract: bridgeContract,
      BridgeContractVerificationKey: args?.BridgeContractVerificationKey,
      BridgeContractPermissions: args?.BridgeContractPermissions,
      signedSettlements: args?.signedSettlements,
    };

    // Ideally we don't want to have this cyclic dependency, but we have it in the protocol,
    // So its logical that we can't avoid that here
    BridgeContractBase.args.SettlementContract = SettlementSmartContract;

    DispatchSmartContractBase.args.settlementContractClass =
      SettlementSmartContract;

    return SettlementSmartContract;
  }

  public async compile(): Promise<Record<string, CompileArtifact>> {
    const settlementVK = await SettlementSmartContract.compile();
    return {
      SettlementContract: settlementVK,
    };
  }
}
