import { runtimeMethod, runtimeModule, RuntimeModule, state } from "@proto-kit/module";
import { State, StateMap } from "@proto-kit/protocol";
import { Field, PublicKey, UInt64 as o1Uint64, Struct, Bool } from "o1js";
import { inject } from "tsyringe";
import { UInt64, TokenId, Balance } from "@proto-kit/library";
// import { UInt64 } from "../math/UInt64";

import { Balances } from "./balances";
// import { EMPTY_PUBLICKEY } from "../ProtokitCommon.js";

export const EMPTY_PUBLICKEY_X = Field(4600);
export const EMPTY_PUBLICKEY = PublicKey.fromObject({
  x: EMPTY_PUBLICKEY_X,
  isOdd: Bool(true),
});
export class Withdrawal extends Struct({
  address: PublicKey,
  amount: o1Uint64,
  tokenId: TokenId
}) {
  public static dummy() {
    return new Withdrawal({
      address: EMPTY_PUBLICKEY,
      amount: o1Uint64.from(0),
      tokenId: TokenId.from(0)
    });
  }
}


@runtimeModule()
export class Withdrawals extends RuntimeModule {
  @state() withdrawalCounter = State.from(Field);

  @state() withdrawals = StateMap.from<Field, Withdrawal>(Field, Withdrawal);

  public constructor(@inject("Balances") private readonly balances: Balances) {
    super();
  }

  protected async queueWithdrawal(withdrawal: Withdrawal) {
    const counter = (await this.withdrawalCounter.get()).orElse(Field(0));

    await this.withdrawals.set(counter, withdrawal);

    await this.withdrawalCounter.set(counter.add(1));
  }

  public async withdraw(address: PublicKey, tokenId: TokenId, amount: Balance) {

    const balance = await this.balances.getBalance(tokenId, address);

    const accountCreationFee = UInt64.Unsafe.fromField(Field(1n).mul(1e9));
    amount.assertGreaterThanOrEqual(
      accountCreationFee,
      "Minimum withdrawal amount not met"
    );
    balance.assertGreaterThanOrEqual(amount, "Not enough balance");

    // Deduct balance from user
    await this.balances.setBalance(tokenId, address, balance.sub(amount));

    // Add withdrawal to queue
    await this.queueWithdrawal(
      new Withdrawal({
        address,
        // Has to be o1js UInt since the withdrawal will be processed in a o1js SmartContract
        amount: amount.toO1UInt64(),
        tokenId: tokenId
      })
    );
  }
  @runtimeMethod()
  public async withdrawSigned(tokenId: TokenId, amount: Balance)  {
    await this.withdraw(this.transaction.sender.value, tokenId, amount);
  }
}
