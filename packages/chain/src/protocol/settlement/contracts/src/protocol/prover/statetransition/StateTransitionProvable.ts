import { Field, Proof, Struct } from "o1js";
import { WithZkProgrammable } from "../../../common/index.js";

import { StateTransitionProvableBatch } from "../../model/StateTransitionProvableBatch.js";

import { StateTransitionWitnessProviderReference } from "./StateTransitionWitnessProviderReference.js";

export class StateTransitionProverPublicInput extends Struct({
  stateTransitionsHash: Field,
  protocolTransitionsHash: Field,
  stateRoot: Field,
  protocolStateRoot: Field,
}) {}

export class StateTransitionProverPublicOutput extends Struct({
  stateTransitionsHash: Field,
  protocolTransitionsHash: Field,
  stateRoot: Field,
  protocolStateRoot: Field,
}) {}

export type StateTransitionProof = Proof<
  StateTransitionProverPublicInput,
  StateTransitionProverPublicOutput
>;

export interface StateTransitionProvable
  extends WithZkProgrammable<
    StateTransitionProverPublicInput,
    StateTransitionProverPublicOutput
  > {
  witnessProviderReference: StateTransitionWitnessProviderReference;

  runBatch: (
    publicInput: StateTransitionProverPublicInput,
    batch: StateTransitionProvableBatch
  ) => Promise<StateTransitionProverPublicOutput>;

  merge: (
    publicInput: StateTransitionProverPublicInput,
    proof1: StateTransitionProof,
    proof2: StateTransitionProof
  ) => Promise<StateTransitionProverPublicOutput>;
}
