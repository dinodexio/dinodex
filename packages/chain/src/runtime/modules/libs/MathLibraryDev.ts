import { Field, Provable, Gadgets as RangeCheck } from "o1js";
import { UInt64 } from "@proto-kit/library";
/**
 * Function to multiply one Uint64 by another and divide the result,
 * We check for overflow on the final result to avoid a premature overflow error.
 * @param a The multiplicand
 * @param b The multiplier 
 * @param denominator The divisor
 * @returns  the quotient and the remainder
 */
export function mulDivMod(a: UInt64, b: UInt64, denominator: UInt64) {

    let x = a.value.mul(b.value);
    let y_ = denominator.value;
    if (x.isConstant() && y_.isConstant()) {
        let xn = x.toBigInt();
        let yn = y_.toBigInt();
        let q = xn / yn;
        let r = xn - q * yn;
        return {
            quotient: UInt64.from(q),
            rest: UInt64.from(r),
        };
    }
    y_ = y_.seal();
    let q = Provable.witness(Field, () => new Field(x.toBigInt() / y_.toBigInt()));
    RangeCheck.rangeCheckN(a.numBits(), q);
    // TODO: Could be a bit more efficient
    let r = x.sub(q.mul(y_)).seal();
    RangeCheck.rangeCheckN(a.numBits(), r);
    let r_ =  UInt64.from(r.toBigInt());
    let q_ =  UInt64.from(q.toBigInt());
    r_.assertLessThan(UInt64.from(y_.toBigInt()));
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
    return mulDivMod(a, b, denominator).quotient;
}