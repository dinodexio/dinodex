import { PublicKey, Struct, UInt64, Field } from "o1js";

export class Deposit extends Struct({
  address: PublicKey,
  amount: UInt64,
  id: Field
}) {}
