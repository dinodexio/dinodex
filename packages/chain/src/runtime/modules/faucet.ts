import { Balance, TokenId } from "@proto-kit/library";
import { RuntimeModule, runtimeMethod, runtimeModule } from "@proto-kit/module";
import { assert } from "@proto-kit/protocol";
import { Provable, PublicKey } from "o1js";
import { inject } from "tsyringe";
import { Balances } from "./balances";


export interface FaucetConfig {
  factory: PublicKey;
}

@runtimeModule()
export class Faucet extends RuntimeModule<FaucetConfig> {
  public constructor(@inject("Balances") public balances: Balances) {
    super();
  }

  public async drip(tokenId: TokenId, address: PublicKey, amount: Balance) {
    await this.balances.mintAndIncrementSupply(tokenId, address, amount);
  }

  @runtimeMethod()
  public async dripSignedTo(tokenId: TokenId, address: PublicKey, amount: Balance)  {
    const isFactoryAddress = this.transaction.sender.value.equals(this.config.factory);
    assert(isFactoryAddress, "Sender is not Factory");
    await this.drip(tokenId, address, amount);
  }

  // testing method for the UI
  // @runtimeMethod()
  // public async dripBundle() {
  //   await this.drip(
  //     TokenId.from("0"),
  //     this.transaction.sender.value,
  //     Balance.from(1000n * 10n ** 9n)
  //   );

  //   await this.drip(
  //     TokenId.from("1"),
  //     this.transaction.sender.value,
  //     Balance.from(1000n * 10n ** 9n)
  //   );

  //   await this.drip(
  //     TokenId.from("2"),
  //     this.transaction.sender.value,
  //     Balance.from(1000n * 10n ** 9n)
  //   );
  //   await this.drip(
  //     TokenId.from("3"),
  //     this.transaction.sender.value,
  //     Balance.from(1000n * 10n ** 9n)
  //   );
  //   await this.drip(
  //     TokenId.from("4"),
  //     this.transaction.sender.value,
  //     Balance.from(1000n * 10n ** 9n)
  //   );
  //   await this.drip(
  //     TokenId.from("5"),
  //     this.transaction.sender.value,
  //     Balance.from(1000n * 10n ** 9n)
  //   );
  //   await this.drip(
  //     TokenId.from("6"),
  //     this.transaction.sender.value,
  //     Balance.from(1000n * 10n ** 9n)
  //   );
  //   await this.drip(
  //     TokenId.from("7"),
  //     this.transaction.sender.value,
  //     Balance.from(1000n * 10n ** 9n)
  //   );
  // }
  @runtimeMethod()
  public async dripBundleTo(toAddress: PublicKey) {
    const isFactoryAddress = this.transaction.sender.value.equals(this.config.factory);
    assert(isFactoryAddress, "Sender is not Factory");
    await this.drip(
      TokenId.from("0"),
      toAddress,
      Balance.from(1000n * 10n ** 9n)
    );
  }
}
