import { PublicKey, Struct, UInt64, Field } from "o1js";
import { EMPTY_PUBLICKEY } from "../ProtokitCommon.js";

export class Withdrawal extends Struct({
  address: PublicKey,
  amount: UInt64,
  id: Field
}) {
  public static dummy() {
    return new Withdrawal({
      address: EMPTY_PUBLICKEY,
      amount: UInt64.from(0),
      id: Field.from(0)
    });
  }
}
