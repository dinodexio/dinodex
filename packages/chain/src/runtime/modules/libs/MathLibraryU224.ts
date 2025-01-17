import { UInt64, UInt224 } from "@proto-kit/library";


/**
 * Function to multiply one Uint64 by another and divide the result,
 * We check for overflow on the final result to avoid a premature overflow error.
 * @param a The multiplicand
 * @param b The multiplier 
 * @param denominator The divisor
 * @returns The 64-bit result 
 */
export function mulDiv(a: UInt64, b: UInt64, denominator: UInt64): UInt64 {
    denominator.assertGreaterThan(UInt64.zero);
    const aConv = UInt224.from(a.toBigInt());
    const bConv = UInt224.from(b.toBigInt());
    const denominatorConv = UInt224.from(denominator.toBigInt());
    denominatorConv.assertGreaterThan(UInt224.from(0));
    const ab = aConv.mul(bConv).div(denominatorConv);
    ab.assertLessThanOrEqual(UInt224.from(UInt64.max.toBigInt()));
    return UInt64.from(ab.toBigInt());
}