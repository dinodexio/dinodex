import {
  RuntimeModule,
  runtimeMethod,
  runtimeModule,
  state,
} from "@proto-kit/module";
import { StateMap, assert } from "@proto-kit/protocol";
import { PoolKey } from "./pool-key";
import { Provable, PublicKey, Struct, UInt64 as O1UInt64, Bool } from "o1js";
import { inject } from "tsyringe";
import { Balance, TokenId, UInt64 } from "@proto-kit/library";
import { TokenPair } from "./token-pair";
import { LPTokenId } from "./lp-token-id";
import { MAX_TOKEN_ID, TokenRegistry } from "./token-registry";
import { Balances } from "../balances";

export const errors = {
  tokensNotDistinct: () => `Tokens must be different`,
  poolAlreadyExists: () => `Pool already exists`,
  poolDoesNotExist: () => `Pool does not exist`,
  amountAIsZero: () => `Amount A must be greater than zero`,
  amountALimitInsufficient: () => `Amount A limit is insufficient`,
  amountBLimitInsufficient: () => `Amount B limit is insufficient`,
  reserveAIsZero: () => `Reserve A must be greater than zero`,
  lpTokenSupplyIsZero: () => `LP token supply is zero`,
  amountOutIsInsufficient: () => `Amount out is insufficient`,
};

// we need a placeholder pool value until protokit supports value-less dictonaries or state arrays
export const placeholderPoolValue = Bool(true);

export const MAX_PATH_LENGTH = 3;
export class TokenIdPath extends Struct({
  path: Provable.Array(TokenId, MAX_PATH_LENGTH),
}) {
  public static from(path: TokenId[]) {
    return new TokenIdPath({ path });
  }
}

export interface XYKConfig {
  feeDivider: bigint;
  fee: bigint;
}

/**
 * Runtime module responsible for providing trading/management functionalities for XYK pools.
 */
@runtimeModule()
export class XYK extends RuntimeModule<XYKConfig> {
  // all existing pools in the system
  @state() public pools = StateMap.from<PoolKey, Bool>(PoolKey, Bool);

  /**
   * Provide access to the underlying Balances runtime to manipulate balances
   * for both pools and users
   */
  public constructor(
    @inject("Balances") public balances: Balances,
    @inject("TokenRegistry") public tokenRegistry: TokenRegistry
  ) {
    super();
  }

  public async poolExists(poolKey: PoolKey) {
    return (await this.pools.get(poolKey)).isSome;
  }

  /**
   * Creates an XYK pool if one doesnt exist yet, and if the creator has
   * sufficient balance to do so.
   *
   * @param creator
   * @param tokenAId
   * @param tokenBId
   * @param tokenASupply
   * @param tokenBSupply
   */
  public async createPool(
    creator: PublicKey,
    tokenAId: TokenId,
    tokenBId: TokenId,
    tokenAAmount: Balance,
    tokenBAmount: Balance
  ) {
    const tokenPair = TokenPair.from(tokenAId, tokenBId);
    const poolKey = PoolKey.fromTokenPair(tokenPair);
    const areTokensDistinct = tokenAId.equals(tokenBId).not();
    const poolDoesNotExist = (await this.poolExists(poolKey)).not();

    // TODO: add check for minimal liquidity in pools
    assert(areTokensDistinct, errors.tokensNotDistinct());
    assert(poolDoesNotExist, errors.poolAlreadyExists());

    // transfer liquidity from the creator to the pool
    await this.balances.transfer(tokenAId, creator, poolKey, tokenAAmount);
    await this.balances.transfer(tokenBId, creator, poolKey, tokenBAmount);

    // determine initial LP token supply
    const lpTokenId = LPTokenId.fromTokenPair(tokenPair);
    // if tokenA supply is greater than tokenB supply, use tokenA supply, otherwise use tokenB supply
    const initialLPTokenSupply = Balance.from(Provable.if<Balance>( tokenAId.greaterThan(tokenBId), Balance, tokenAAmount, tokenBAmount));

    await this.tokenRegistry.addTokenId(lpTokenId);
    await this.balances.mintAndIncrementSupply(
      lpTokenId,
      creator,
      initialLPTokenSupply
    );
    await this.pools.set(poolKey, placeholderPoolValue);
  }

  /**
   * Provides liquidity to an existing pool, if the pool exists and the
   * provider has sufficient balance. Additionally mints LP tokens for the provider.
   *
   * @param provider
   * @param tokenAId
   * @param tokenBId
   * @param amountA
   * @param amountBLimit
   */
  public async addLiquidity(
    provider: PublicKey,
    tokenAId: TokenId,
    tokenBId: TokenId,
    tokenAAmount: Balance,
    tokenBAmountLimit: Balance
  ) {
    const tokenPair = TokenPair.from(tokenAId, tokenBId);
    // tokenAId = tokenPair.tokenAId;
    // tokenBId = tokenPair.tokenBId;
    const poolKey = PoolKey.fromTokenPair(tokenPair);
    const poolDoesExists = await this.poolExists(poolKey);
    const amountANotZero = tokenAAmount.greaterThan(Balance.from(0));

    const reserveA = await this.balances.getBalance(tokenAId, poolKey);
    const reserveB = await this.balances.getBalance(tokenBId, poolKey);
    const reserveANotZero =  reserveA.greaterThan(Balance.from(0));
    const adjustedReserveA = Balance.from(
      Provable.if<Balance>(reserveANotZero, Balance, reserveA, Balance.from(1))
    );

    // TODO: why do i need Balance.from on the `amountA` argument???
    const amountB = Balance.from(tokenAAmount)
      .mul(reserveB)
      .div(adjustedReserveA);
    const isAmountBLimitSufficient =
      tokenBAmountLimit.greaterThanOrEqual(amountB);

    const lpTokenId = LPTokenId.fromTokenPair(tokenPair);
    const lpTokenTotalSupply = await this.balances.getCirculatingSupply(lpTokenId);

    // TODO: ensure tokens are provided in the right order, not just ordered by the TokenPair
    // otherwise the inputs for the following math will be in the wrong order
    const lpTokensToMint = lpTokenTotalSupply
      .mul(tokenAAmount)
      .div(adjustedReserveA);

    assert(poolDoesExists, errors.poolDoesNotExist());
    assert(amountANotZero, errors.amountAIsZero());
    assert(reserveANotZero, errors.reserveAIsZero());
    assert(isAmountBLimitSufficient, errors.amountBLimitInsufficient());

    await this.balances.transfer(tokenAId, provider, poolKey, tokenAAmount);
    await this.balances.transfer(tokenBId, provider, poolKey, amountB);
    await this.balances.mintAndIncrementSupply(lpTokenId, provider, lpTokensToMint);
  }

  public async removeLiquidity(
    provider: PublicKey,
    tokenAId: TokenId,
    tokenBId: TokenId,
    lpTokenAmount: Balance,
    // TODO: change to min/max limits everywhere
    tokenAAmountLimit: Balance,
    tokenBLAmountLimit: Balance
  ) {
    const tokenPair = TokenPair.from(tokenAId, tokenBId);
    tokenAId = tokenPair.tokenAId;
    tokenBId = tokenPair.tokenBId;
    const poolKey = PoolKey.fromTokenPair(tokenPair);
    const poolDoesExists = await this.poolExists(poolKey);
    const lpTokenId = LPTokenId.fromTokenPair(tokenPair);
    const lpTokenTotalSupply = await this.balances.getCirculatingSupply(lpTokenId);
    const lpTokenTotalSupplyIsZero = lpTokenTotalSupply.equals(Balance.from(0));
    const adjustedLpTokenTotalSupply = Balance.from(
      Provable.if<Balance>(lpTokenTotalSupplyIsZero, Balance, Balance.from(1), lpTokenTotalSupply)
    );
    const reserveA = await this.balances.getBalance(tokenAId, poolKey);
    const reserveB = await this.balances.getBalance(tokenBId, poolKey);

    const tokenAAmount = Balance.from(lpTokenAmount)
      .mul(reserveA)
      .div(adjustedLpTokenTotalSupply);
    const tokenBAmount = Balance.from(lpTokenAmount)
      .mul(reserveB)
      .div(adjustedLpTokenTotalSupply);

    const isTokenAAmountLimitSufficient =
      tokenAAmountLimit.greaterThanOrEqual(tokenAAmount);
    const isTokenBAmountLimitSufficient =
      tokenBLAmountLimit.greaterThanOrEqual(tokenBAmount);

    Provable.log("limits", {
      tokenAAmount,
      tokenBAmount,
      tokenAAmountLimit,
      tokenBLAmountLimit,
    });

    assert(poolDoesExists, errors.poolDoesNotExist());
    assert(lpTokenTotalSupplyIsZero.not(), errors.lpTokenSupplyIsZero());
    assert(isTokenAAmountLimitSufficient, errors.amountALimitInsufficient());
    assert(isTokenBAmountLimitSufficient, errors.amountBLimitInsufficient());

    await this.balances.transfer(tokenAId, poolKey, provider, tokenAAmount);
    await this.balances.transfer(tokenBId, poolKey, provider, tokenBAmount);
    await this.balances.burnAndDecrementSupply(lpTokenId, provider, lpTokenAmount);
  }

  public calculateTokenOutAmountFromReserves(
    reserveIn: Balance,
    reserveOut: Balance,
    amountIn: Balance
  ) {
    const numerator = amountIn.mul(reserveOut);
    const denominator = reserveIn.add(amountIn);

    // TODO: extract to safemath
    const adjustedDenominator = Balance.from(Provable.if<Balance>(denominator.equals(0), Balance, Balance.from(1), denominator));

    assert(denominator.equals(adjustedDenominator), "denominator is zero");

    return numerator.div(adjustedDenominator);
  }

  public async calculateTokenOutAmount(
    tokenIn: TokenId,
    tokenOut: TokenId,
    amountIn: Balance
  ) {
    const tokenPair = TokenPair.from(tokenIn, tokenOut);
    const pool = PoolKey.fromTokenPair(tokenPair);

    const reserveIn = await this.balances.getBalance(tokenIn, pool);
    const reserveOut = await this.balances.getBalance(tokenOut, pool);

    return this.calculateTokenOutAmountFromReserves(
      reserveIn,
      reserveOut,
      amountIn
    );
  }

  public async calculateAmountIn(
    tokenIn: TokenId,
    tokenOut: TokenId,
    amountOut: Balance
  ) {
    const tokenPair = TokenPair.from(tokenIn, tokenOut);
    const pool = PoolKey.fromTokenPair(tokenPair);

    const reserveIn = await this.balances.getBalance(tokenIn, pool);
    const reserveOut = await this.balances.getBalance(tokenOut, pool);

    return this.calculateAmountInFromReserves(reserveIn, reserveOut, amountOut);
  }

  public calculateAmountInFromReserves(
    reserveIn: Balance,
    reserveOut: Balance,
    amountOut: Balance
  ) {
    const numerator = reserveIn.mul(amountOut);
    const denominator = reserveOut.sub(amountOut);

    // TODO: extract to safemath
    const adjustedDenominator = Balance.from(Provable.if<Balance>(denominator.equals(0), Balance, Balance.from(1), denominator));

    assert(denominator.equals(adjustedDenominator), "denominator is zero");

    return numerator.div(adjustedDenominator);
  }

  public async sellPath(
    seller: PublicKey,
    { path }: TokenIdPath,
    amountIn: Balance,
    amountOutMinLimit: Balance
  ) {
    const initialTokenPair = TokenPair.from(path[0], path[1]);
    const initialPoolKey = PoolKey.fromTokenPair(initialTokenPair);
    const pathBeginswWithExistingPool = await this.poolExists(initialPoolKey);

    assert(pathBeginswWithExistingPool, errors.poolDoesNotExist());

    let amountOut = Balance.zero;
    let lastPoolKey = PoolKey.empty();
    let sender = seller;
    // TODO: better handling of dummy tokens
    let lastTokenOut = TokenId.from(MAX_TOKEN_ID);

    // TODO: figure out if there are path variation edge cases
    // if yes, make the whole trade fail if the path is not valid
    for (let i = 0; i < MAX_PATH_LENGTH - 1; i++) {
      const tokenIn = path[i];
      const tokenOut = path[i + 1];

      const tokenPair = TokenPair.from(tokenIn, tokenOut);
      const poolKey = PoolKey.fromTokenPair(tokenPair);
      const poolExists = await this.poolExists(poolKey);

      const calculatedAmountOut = await this.calculateTokenOutAmount(
        tokenIn,
        tokenOut,
        Balance.from(amountIn)
      );

      const amoutOutWithoutFee = calculatedAmountOut.sub(
        calculatedAmountOut.mul(3n).div(100000n)
      );

      lastTokenOut = Provable.if(poolExists, TokenId, tokenOut, lastTokenOut);

      lastPoolKey = Provable.if(poolExists, PoolKey, poolKey, lastPoolKey);

      amountOut = Balance.from(Provable.if<Balance>(poolExists, Balance, amoutOutWithoutFee, amountOut));

      amountIn = Balance.from(Provable.if<Balance>(poolExists, Balance, amountIn, Balance.zero));

      await this.balances.transfer(tokenIn, sender, lastPoolKey, amountIn);

      sender = lastPoolKey;
      amountIn = amountOut;
    }

    const isAmountOutMinLimitSufficient =
      amountOut.greaterThanOrEqual(amountOutMinLimit);

    assert(isAmountOutMinLimitSufficient, errors.amountOutIsInsufficient());

    await this.balances.transfer(lastTokenOut, lastPoolKey, seller, amountOut);
  }

  @runtimeMethod()
  public async createPoolSigned(
    tokenAId: TokenId,
    tokenBId: TokenId,
    tokenAAmount: Balance,
    tokenBAmount: Balance
  ) {
    const creator = this.transaction.sender.value;
    await this.createPool(creator, tokenAId, tokenBId, tokenAAmount, tokenBAmount);
  }

  @runtimeMethod()
  public async addLiquiditySigned(
    tokenAId: TokenId,
    tokenBId: TokenId,
    tokenAAmount: Balance,
    tokenBAmountLimit: Balance
  ) {
    const provider = this.transaction.sender.value;
    await this.addLiquidity(
      provider,
      tokenAId,
      tokenBId,
      tokenAAmount,
      tokenBAmountLimit
    );
  }

  @runtimeMethod()
  public async removeLiquiditySigned(
    tokenAId: TokenId,
    tokenBId: TokenId,
    lpTokenAmount: Balance,
    tokenAAmountLimit: Balance,
    tokenBLAmountLimit: Balance
  ) {
    const provider = this.transaction.sender.value;
    await this.removeLiquidity(
      provider,
      tokenAId,
      tokenBId,
      lpTokenAmount,
      tokenAAmountLimit,
      tokenBLAmountLimit
    );
  }

  @runtimeMethod()
  public async sellPathSigned(
    path: TokenIdPath,
    amountIn: Balance,
    amountOutMinLimit: Balance
  ) {
    await this.sellPath(
      this.transaction.sender.value,
      path,
      amountIn,
      amountOutMinLimit
    );
  }
}
