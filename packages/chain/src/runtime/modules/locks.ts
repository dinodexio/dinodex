import { Balance, Balances, TokenId, UInt64 } from "@proto-kit/library";
import {
  RuntimeModule,
  runtimeMethod,
  runtimeModule,
  state,
} from "@proto-kit/module";
import { StateMap, assert } from "@proto-kit/protocol";
import { Field, PublicKey, Struct, Bool,  UInt64 as o1Uint64 } from "o1js";
import { inject } from "tsyringe";

export class LockId extends Field {}

export class BlockHeight extends o1Uint64 {}

export class LockKey extends Struct({
  address: PublicKey,
  tokenId: TokenId,
  lockId: LockId,
}) {}

export class Lock extends Struct({
  amount: Balance,
  expiresAt: BlockHeight,
  hasBeenUnlocked: Bool,
}) {}

@runtimeModule()
export class Locks extends RuntimeModule {
  @state() public locks = StateMap.from<LockKey, Lock>(LockKey, Lock);

  @state() public lastAddressLockId = StateMap.from<PublicKey, LockId>(
    PublicKey,
    LockId
  );

  public constructor(@inject("Balances") public balances: Balances) {
    super();
  }

  public async lock(
    address: PublicKey,
    tokenId: TokenId,
    amount: Balance,
    expiresAt: BlockHeight
  ) {
    const lastAddressLockId = (await this.lastAddressLockId.get(address)).value;
    const lockId = lastAddressLockId.add(1);
    const key = new LockKey({ address, tokenId, lockId });
    const hasBeenUnlocked = Bool(false);

    const lock = new Lock({
      amount,
      expiresAt,
      hasBeenUnlocked,
    });

    assert(
      BlockHeight.from(this.network.block.height).lessThan(expiresAt),
      "Cannot create a lock that expires in the past"
    );

    await this.balances.burn(tokenId, address, amount);
    await this.locks.set(key, lock);
    await this.lastAddressLockId.set(address, lockId);
  }

  public async unlock(tokenId: TokenId, address: PublicKey, lockId: LockId) {
    const key = new LockKey({ address, tokenId, lockId });
    const lock = await this.locks.get(key);
    const isExpired = BlockHeight.from(
      this.network.block.height
    ).greaterThanOrEqual(lock.value.expiresAt);

    // TODO: extract error messages
    assert(lock.isSome, "Lock not found");
    assert(lock.value.hasBeenUnlocked.not(), "Lock has already been unlocked");
    assert(isExpired, "Lock is not expired yet");

    const hasBeenUnlocked = Bool(true);
    const updatedLock = new Lock({ ...lock.value, hasBeenUnlocked });

    await this.locks.set(key, updatedLock);
    await this.balances.mint(key.tokenId, key.address, lock.value.amount);
  }

  @runtimeMethod()
  public async lockSigned(tokenId: TokenId, amount: Balance, expiresAt: BlockHeight) {
    const address = this.transaction.sender.value;

    await this.lock(address, tokenId, amount, expiresAt);
  }

  @runtimeMethod()
  public async unlockSigned(tokenId: TokenId, lockId: LockId) {
    const address = this.transaction.sender.value;
    await this.unlock(tokenId, address, lockId);
  }
}
