
import { DependencyContainer } from "tsyringe";
import { Memoize } from "typescript-memoize";
import { ZkProgram, FlexibleProvablePure, Proof, Field, Provable, PublicKey, Bool, Poseidon } from "o1js";


export * from "./RollupMerkleTree.js";
import { log } from "./log.js"
export const MOCK_PROOF = "mock-proof";
export type NoConfig = Record<never, never>;
export function noop(): void { }
export type TypedClass<Class> = new (...args: any[]) => Class;

export const EMPTY_PUBLICKEY_X = Field(4600);
export const EMPTY_PUBLICKEY = PublicKey.fromObject({
  x: EMPTY_PUBLICKEY_X,
  isOdd: Bool(true),
});

const encoder = new TextEncoder();
export function prefixToField(prefix: string): Field {
    const fieldSize = Field.sizeInBytes;
    if (prefix.length >= fieldSize) throw Error("prefix too long");
    const stringBytes = [...encoder.encode(prefix)];
    return Field.fromBytes(
        stringBytes.concat(Array(fieldSize - stringBytes.length).fill(0))
    );
}

export function mapSequential<T, R>(
    array: T[],
    f: (element: T, index: number, array: T[]) => Promise<R>
) {
    return array.reduce<Promise<R[]>>(async (r, element, index, a) => {
        const ret = await r;
        const next = await f(element, index, a);
        ret.push(next);
        return ret;
    }, Promise.resolve([]));
}


const errors = {
    appChainNotSet: (name: string) =>
        new Error(`Appchain was not injected for: ${name}`),
    configNotSet: (moduleName: string) =>
        new Error(
            `Trying to retrieve config of ${moduleName}, which was not yet set`
        ),
};

export interface AreProofsEnabled {
    areProofsEnabled: boolean;
    setProofsEnabled: (areProofsEnabled: boolean) => void;
}
export interface ChildContainerProvider {
    (): DependencyContainer;
}
export interface ChildContainerCreatable {
    create: (childContainerProvider: ChildContainerProvider) => void;
}

export interface Configurable<Config> {
    config: Config;
}
export interface BaseModuleInstanceType
    extends ChildContainerCreatable,
    Configurable<unknown> { }
export class ConfigurableModule<Config = NoConfig>
    implements BaseModuleInstanceType {
    /**
     * Store the config separately, so that we can apply additional
     * checks when retrieving it via the getter
     */
    protected currentConfig: Config | undefined;

    // retrieve the existing config
    public get config(): Config {
        if (this.currentConfig === undefined) {
            throw errors.configNotSet(this.constructor.name);
        }
        return this.currentConfig;
    }

    // set the config
    public set config(config: Config) {
        this.currentConfig = config;
    }

    public create(childContainerProvider: ChildContainerProvider): void {
        noop();
    }
}

export interface CompileArtifact {
    verificationKey: {
        data: string;
        hash: Field;
    };
}
export interface Compile {
    (): Promise<CompileArtifact>;
}
export interface Verify<PublicInput, PublicOutput> {
    (proof: Proof<PublicInput, PublicOutput>): Promise<boolean>;
}
export interface PlainZkProgram<PublicInput = undefined, PublicOutput = void> {
    compile: Compile;
    verify: Verify<PublicInput, PublicOutput>;
    Proof: ReturnType<
        typeof ZkProgram.Proof<
            FlexibleProvablePure<PublicInput>,
            FlexibleProvablePure<PublicOutput>
        >
    >;
    methods: Record<
        string,
        | ((...args: any) => Promise<Proof<PublicInput, PublicOutput>>)
        | ((
            publicInput: PublicInput,
            ...args: any
        ) => Promise<Proof<PublicInput, PublicOutput>>)
    >;
    analyzeMethods: () => Promise<
        Record<string, Awaited<ReturnType<typeof Provable.constraintSystem>>>
    >;
}
export function verifyToMockable<PublicInput, PublicOutput>(
    verify: Verify<PublicInput, PublicOutput>,
    { areProofsEnabled }: AreProofsEnabled
) {
    return async (proof: Proof<PublicInput, PublicOutput>) => {
        if (areProofsEnabled) {
            let verified = false;

            try {
                verified = await verify(proof);
            } catch (error: unknown) {
                // silently fail verification
                log.error(error);
                verified = false;
            }

            return verified;
        }

        return proof.proof === MOCK_PROOF;
    };
}
export const MOCK_VERIFICATION_KEY = {
    data: "mock-verification-key",
    hash: Field(0),
};

export function compileToMockable(
    compile: Compile,
    { areProofsEnabled }: AreProofsEnabled
): () => Promise<CompileArtifact> {
    return async () => {
        if (areProofsEnabled) {
            return await compile();
        }

        return {
            verificationKey: MOCK_VERIFICATION_KEY,
        };
    };
}
export abstract class ZkProgrammable<
    PublicInput = undefined,
    PublicOutput = void,
> {
    public abstract get appChain(): AreProofsEnabled | undefined;

    public abstract zkProgramFactory(): PlainZkProgram<PublicInput, PublicOutput>;

    @Memoize()
    public get zkProgram(): PlainZkProgram<PublicInput, PublicOutput> {
        const zkProgram = this.zkProgramFactory();

        if (!this.appChain) {
            throw errors.appChainNotSet(this.constructor.name);
        }

        return {
            ...zkProgram,
            verify: verifyToMockable(zkProgram.verify, this.appChain),
            compile: compileToMockable(zkProgram.compile, this.appChain),
        };
    }
}
export interface WithZkProgrammable<
    PublicInput = undefined,
    PublicOutput = void,
> {
    zkProgrammable: ZkProgrammable<PublicInput, PublicOutput>;
}

export function hashWithPrefix(prefix: string, input: Field[]) {
    const salt = Poseidon.update(
      [Field(0), Field(0), Field(0)],
      [prefixToField(prefix)]
    );
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return Poseidon.update(salt as [Field, Field, Field], input)[0];
  }