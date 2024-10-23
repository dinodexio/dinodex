import { runtimeModule, state, runtimeMethod } from "@proto-kit/module";
import { State, StateMap, assert } from "@proto-kit/protocol";
import { Balance, Balances as BaseBalances, TokenId } from "@proto-kit/library";
import { PublicKey } from "o1js";

interface BalancesConfig {
  totalSupply: Balance;
}

@runtimeModule()
export class Balances extends BaseBalances<BalancesConfig> {
  // @state() public circulatingSupply = State.from<Balance>(Balance);
  @state() public circulatingSupply = StateMap.from<TokenId, Balance>(
    TokenId,
    Balance
  );

  public async getCirculatingSupply(tokenId: TokenId) {
    return Balance.from((await this.circulatingSupply.get(tokenId)).value);
  }
  @runtimeMethod()
  public async mintAndIncrementSupply(
    tokenId: TokenId,
    address: PublicKey,
    amount: Balance
  ): Promise<void> {
    const circulatingSupply = await this.circulatingSupply.get(tokenId);
    const newCirculatingSupply = Balance.from(circulatingSupply.value).add(
      amount
    );
    assert(
      newCirculatingSupply.lessThanOrEqual(this.config.totalSupply),
      "Circulating supply would be higher than total supply"
    );
    await this.circulatingSupply.set(tokenId, newCirculatingSupply);
    await this.mint(tokenId, address, amount);
  }
  public async burnAndDecrementSupply(
    tokenId: TokenId,
    address: PublicKey,
    amount: Balance
  ): Promise<void> {
    const circulatingSupply = await this.circulatingSupply.get(tokenId);
    const newtotalSupply = Balance.from(circulatingSupply.value).sub(amount);
    await this.circulatingSupply.set(tokenId, newtotalSupply);
    await this.burn(tokenId, address, amount);
  }
}
