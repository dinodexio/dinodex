import { runtimeModule, state, runtimeMethod, RuntimeEvents } from "@proto-kit/module";
import { State, StateMap, assert } from "@proto-kit/protocol";
import { Balance, errors, Balances as BaseBalances, TokenId } from "@proto-kit/library";
import { PublicKey, Provable, Struct } from "o1js";

interface BalancesConfig {
  totalSupply: Balance;
}

export class MintEvent extends Struct({tokenId: TokenId, address: PublicKey, amount: Balance}){}
export class BurnEvent extends Struct({tokenId: TokenId, address: PublicKey, amount: Balance}){}
export class TransferEvent extends Struct({ tokenId: TokenId, from: PublicKey, to: PublicKey, amount: Balance}){}

@runtimeModule()
export class Balances extends BaseBalances<BalancesConfig> {
  // @state() public circulatingSupply = State.from<Balance>(Balance);
  @state() public circulatingSupply = StateMap.from<TokenId, Balance>(
    TokenId,
    Balance
  );

  public events = new RuntimeEvents({
    mint: MintEvent,
    burn: BurnEvent,
    transfer: TransferEvent,
  });
    //overwrite
    public async transfer(
      tokenId: TokenId,
      from: PublicKey,
      to: PublicKey,
      amount: Balance
    ) {
      const fromBalance = await this.getBalance(tokenId, from);
  
      const fromBalanceIsSufficient = fromBalance.greaterThanOrEqual(amount);
  
      assert(fromBalanceIsSufficient, errors.fromBalanceInsufficient());
  
      const newFromBalance = fromBalance.sub(amount);
      await this.setBalance(tokenId, from, newFromBalance);
  
      const toBalance = await this.getBalance(tokenId, to);
      const newToBalance = toBalance.add(amount);
  
      await this.setBalance(tokenId, to, newToBalance);
      this.events.emit('transfer', new TransferEvent({tokenId, from, to, amount}));
    }
  
    public async mint(tokenId: TokenId, address: PublicKey, amount: Balance) {
      const balance = await this.getBalance(tokenId, address);
      const newBalance = balance.add(amount);
      await this.setBalance(tokenId, address, newBalance);
      this.events.emit('mint', new MintEvent({tokenId, address, amount}));
    }
  
    public async burn(tokenId: TokenId, address: PublicKey, amount: Balance) {
      const balance = await this.getBalance(tokenId, address);
      Provable.log("Balance", balance, amount);
      const newBalance = balance.sub(amount);
      await this.setBalance(tokenId, address, newBalance);
      this.events.emit('burn', new BurnEvent({tokenId, address, amount}));
    }
    //end overwrite

  public async getCirculatingSupply(tokenId: TokenId) {
    return Balance.from((await this.circulatingSupply.get(tokenId)).value);
  }
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
