import { Field, type FlexibleProvablePure, Poseidon } from "o1js";

import floor from 'lodash/floor.js';

export function stringToField(value: string) {
    const fieldSize = Field.sizeInBytes - 1;

    // Encode string as byte[]
    const encoder = new TextEncoder();
    const stringBytes = Array.from(encoder.encode(value));

    // Add padding in case the string is not a multiple of Field.sizeInBytes
    const padding = Array.from<number>({
        length: fieldSize - (stringBytes.length % fieldSize),
    }).fill(0);
    const data = stringBytes.concat(padding).reverse();

    // Hash the result Field[] to reduce it to
    const chunks = data.reduce<number[][]>(
        (a, b, index) => {
            const arrayIndex = floor(index / fieldSize);
            a[arrayIndex].push(b);
            return a;
        },

        Array.from<number[]>({ length: floor(data.length / fieldSize) }).map(
            () => []
        )
    );
    const fields = chunks.map((x) =>
        // We have to add a zero at the highest byte here, because a Field is
        // a bit smaller than 2^256
        Field.fromBytes(x.concat([0]))
    );
    return Poseidon.hash(fields);
}



/**
 * Helps manage path (key) identifiers for key-values in trees.
 */
export class Path {
    /**
     * Encodes a JS string as a Field
     *
     * @param value
     * @returns Field representation of the provided value
     */
    public static toField(value: string) {
        return stringToField(value);
    }

    /**
     * Encodes a class name and its property name into a Field
     *
     * @param className
     * @param propertyKey
     * @returns Field representation of class name + property name
     */
    public static fromProperty(className: string, propertyKey: string): Field {
        return Poseidon.hash([
            Path.toField(className),
            Path.toField(propertyKey),
            Field(0),
        ]);
    }

    /**
     * Encodes an existing path with the provided key into a single Field.
     *
     * @param path
     * @param keyType
     * @param key
     * @returns Field representation of the leading path + the provided key.
     */
    public static fromKey<KeyType>(
        path: Field,
        keyType: FlexibleProvablePure<KeyType>,
        key: KeyType
    ): Field {
        const keyHash = Poseidon.hash(keyType.toFields(key));
        return Poseidon.hash([path, keyHash]);
    }
}
