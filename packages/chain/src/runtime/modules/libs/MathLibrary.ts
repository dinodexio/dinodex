import { Field, Provable, UInt64 as o1Uint64, Gadgets as RangeCheck } from "o1js";
import { UInt64 } from "@proto-kit/library";
/**
 * Function to multiply one Uint64 by another and divide the result,
 * We check for overflow on the final result to avoid a premature overflow error.
 * @param a The multiplicand
 * @param b The multiplier 
 * @param denominator The divisor
 * @returns  the quotient and the remainder
 */
export function mulDivMod(a: o1Uint64, b: o1Uint64, denominator: o1Uint64) {

    let x = a.value.mul(b.value);
    let y_ = denominator.value;
    if (x.isConstant() && y_.isConstant()) {
        let xn = x.toBigInt();
        let yn = y_.toBigInt();
        let q = xn / yn;
        let r = xn - q * yn;
        return {
            quotient: new o1Uint64(q),
            rest: new o1Uint64(r),
        };
    }
    y_ = y_.seal();
    let q = Provable.witness(Field, () => new Field(x.toBigInt() / y_.toBigInt()));
    RangeCheck.rangeCheckN(o1Uint64.NUM_BITS, q);
    // TODO: Could be a bit more efficient
    let r = x.sub(q.mul(y_)).seal();
    RangeCheck.rangeCheckN(o1Uint64.NUM_BITS, r);
    let r_ = new o1Uint64(r.value);
    let q_ = new o1Uint64(q.value);
    r_.assertLessThan(new o1Uint64(y_.value));
    return { quotient: q_, rest: r_ };
}

/**
 * Function to multiply one Uint64 by another and divide the result,
 * We check for overflow on the final result to avoid a premature overflow error.
 * @param a The multiplicand
 * @param b The multiplier 
 * @param denominator The divisor
 * @returns The 64-bit result 
 */
export function mulDiv(a: UInt64, b: UInt64, denominator: UInt64): UInt64 {
    const o1Uint64Result = mulDivMod(a.toO1UInt64(), b.toO1UInt64(), denominator.toO1UInt64()).quotient;
    return UInt64.Unsafe.fromField(o1Uint64Result.value);
}