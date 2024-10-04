import { Bool, Field, Proof, Signature, Struct, UInt64, Poseidon } from "o1js";
import { WithZkProgrammable, RollupMerkleTree, createMerkleTree } from "../../ProtokitCommon.js";

import { RuntimeTransaction } from "../../model/transaction/RuntimeTransaction.js";


export class BlockHashMerkleTree extends createMerkleTree(40) {}
export class BlockHashMerkleTreeWitness extends BlockHashMerkleTree.WITNESS {}

export class BlockHashTreeEntry extends Struct({
  blockHash: Field,
  closed: Bool,
  // TODO We could add startingEternalTransactionsHash here to offer
  // a more trivial connection to the sequence state
}) {
  public hash(): Field {
    return Poseidon.hash([this.blockHash, ...this.closed.toFields()]);
  }
}


export class CurrentBlock extends Struct({
    height: UInt64,
  }) {}
  
  export class PreviousBlock extends Struct({
    rootHash: Field,
  }) {}
  
  export class NetworkState extends Struct({
    block: CurrentBlock,
    previous: PreviousBlock,
  }) {
    public hash(): Field {
      return Poseidon.hash([
        ...CurrentBlock.toFields(this.block),
        ...PreviousBlock.toFields(this.previous),
      ]);
    }
  
    public static empty() {
      return new NetworkState({
        block: {
          height: UInt64.zero,
        },
        previous: {
          rootHash: Field(RollupMerkleTree.EMPTY_ROOT),
        },
      });
    }
  }
  

export class StateTransitionProverPublicInput extends Struct({
    stateTransitionsHash: Field,
    protocolTransitionsHash: Field,
    stateRoot: Field,
    protocolStateRoot: Field,
}) { }

export class StateTransitionProverPublicOutput extends Struct({
    stateTransitionsHash: Field,
    protocolTransitionsHash: Field,
    stateRoot: Field,
    protocolStateRoot: Field,
}) { }
export type StateTransitionProof = Proof<
    StateTransitionProverPublicInput,
    StateTransitionProverPublicOutput
>;
export class BlockProverPublicInput extends Struct({
    transactionsHash: Field,
    stateRoot: Field,
    networkStateHash: Field,
    blockHashRoot: Field,
    eternalTransactionsHash: Field,
    incomingMessagesHash: Field,
}) { }


export class MethodPublicOutput extends Struct({
    stateTransitionsHash: Field,
    status: Bool,
    transactionHash: Field,
    networkStateHash: Field,
    isMessage: Bool,
}) { }




export class BlockProverPublicOutput extends Struct({
    transactionsHash: Field,
    stateRoot: Field,
    networkStateHash: Field,
    blockHashRoot: Field,
    eternalTransactionsHash: Field,
    incomingMessagesHash: Field,
    closed: Bool,
    blockNumber: Field,
}) {
    public equals(
        input: BlockProverPublicInput,
        closed: Bool,
        blockNumber: Field
    ): Bool {
        const output2 = BlockProverPublicOutput.toFields({
            ...input,
            closed,
            blockNumber,
        });
        const output1 = BlockProverPublicOutput.toFields(this);
        return output1
            .map((value1, index) => value1.equals(output2[index]))
            .reduce((a, b) => a.and(b));
    }
}

export type BlockProverProof = Proof<
    BlockProverPublicInput,
    BlockProverPublicOutput
>;

export class BlockProverExecutionData extends Struct({
    transaction: RuntimeTransaction,
    signature: Signature,
    networkState: NetworkState,
}) { }

export interface BlockProvable
    extends WithZkProgrammable<BlockProverPublicInput, BlockProverPublicOutput> {
    proveTransaction: (
        publicInput: BlockProverPublicInput,
        stateProof: StateTransitionProof,
        appProof: Proof<void, MethodPublicOutput>,
        executionData: BlockProverExecutionData
    ) => Promise<BlockProverPublicOutput>;

    proveBlock: (
        publicInput: BlockProverPublicInput,
        networkState: NetworkState,
        blockWitness: BlockHashMerkleTreeWitness,
        stateTransitionProof: StateTransitionProof,
        transactionProof: BlockProverProof
    ) => Promise<BlockProverPublicOutput>;

    merge: (
        publicInput: BlockProverPublicInput,
        proof1: BlockProverProof,
        proof2: BlockProverProof
    ) => Promise<BlockProverPublicOutput>;
}
