import { TypedClass } from "@proto-kit/common";
import { SmartContract } from "o1js";
import { inject, injectable, injectAll } from "tsyringe";

import { type BlockProvable } from "./contracts/src/common/prover/block/BlockProvable";
import {
  ContractModule,
  SmartContractClassFromInterface,
} from "./ContractModule";
import { ProvableSettlementHook } from "./contracts/src/common/modularity/ProvableSettlementHook";

import { DispatchContractType } from "./contracts/src/DispatchSmartContract";
import {
  LazyBlockProof,
  SettlementContractType,
  SettlementSmartContract,
} from "./contracts/src/SettlementSmartContract";

export type SettlementContractConfig = {
  escapeHatchSlotsInterval?: number;
  withdrawalStatePath: `${string}.${string}`;
  withdrawalMethodPath: `${string}.${string}`;
};

// 24 hours
const DEFAULT_ESCAPE_HATCH = (60 / 3) * 24;

@injectable()
export class SettlementContractProtocolModule extends ContractModule<
  SettlementContractType,
  TypedClass<DispatchContractType & SmartContract>,
  SettlementContractConfig
> {
  public constructor(
    @injectAll("ProvableSettlementHook")
    private readonly hooks: ProvableSettlementHook<unknown>[],
    @inject("BlockProver")
    private readonly blockProver: BlockProvable
  ) {
    LazyBlockProof.tag = blockProver.zkProgrammable.zkProgram.Proof.tag;
    super();
  }

  public contractFactory(
    dispatchContract: TypedClass<DispatchContractType & SmartContract>
  ): SmartContractClassFromInterface<SettlementContractType> {
    const { hooks, config } = this;

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const withdrawalStatePathSplit = config.withdrawalStatePath.split(".") as [
      string,
      string,
    ];

    const escapeHatchSlotsInterval =
      config.escapeHatchSlotsInterval ?? DEFAULT_ESCAPE_HATCH;

    SettlementSmartContract.args = {
      DispatchContract: dispatchContract,
      hooks,
      withdrawalStatePath: withdrawalStatePathSplit,
      escapeHatchSlotsInterval,
    };

    return SettlementSmartContract;
  }
}
