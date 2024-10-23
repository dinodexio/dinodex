import {
  prefixToField,
  RollupMerkleTree,
  TypedClass,
  mapSequential,
} from "./common/index.js";
import {
  AccountUpdate,
  Bool,
  Field,
  method,
  Proof,
  PublicKey,
  Signature,
  SmartContract,
  State,
  state,
  UInt32,
  AccountUpdateForest,
  TokenContractV2,
  PrivateKey,
  VerificationKey,
  Permissions,
  Struct,
  Provable,
  TokenId,
} from "o1js";
// import { singleton } from "tsyringe";

import { NetworkState, BlockHashMerkleTree, BlockProverPublicInput, BlockProverPublicOutput } from "./protocol/index.js";
import {SettlementStateRecord, SettlementHookInputs, ProvableSettlementHook} from "./common/modularity/ProvableSettlementHook.js";

import { DispatchContractType, DispatchSmartContract } from "./DispatchSmartContract.js";
import { BridgeContractType, BridgeContract } from "./BridgeContract.js";
import { TokenBridgeDeploymentAuth } from "./authorizations/TokenBridgeDeploymentAuth.js";
import { UpdateMessagesHashAuth } from "./authorizations/UpdateMessagesHashAuth.js";

/* eslint-disable @typescript-eslint/lines-between-class-members */
const DEFAULT_ESCAPE_HATCH = (60 / 3) * 24;
const defaultBridgeContractPermissions : Permissions = Permissions.default();
const defaultBridgeContractVerificationKey : VerificationKey = VerificationKey.fromValue({
  "data": "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",
  "hash": 4264645620316403855980514226827210121771031247239717607990738817962250689384n
});

export class LazyBlockProof extends Proof<
  BlockProverPublicInput,
  BlockProverPublicOutput
> {
  public static publicInputType = BlockProverPublicInput;

  public static publicOutputType = BlockProverPublicOutput;

  public static tag: () => { name: string } = () => {
    throw new Error("Tag not initialized yet");
  };
}

export class TokenMapping extends Struct({
  tokenId: Field,
  publicKey: PublicKey,
}) {}

export interface SettlementContractType {
  authorizationField: State<Field>;

  initialize: (
    sequencer: PublicKey,
    dispatchContract: PublicKey,
    bridgeContract: PublicKey,
    contractKey: PrivateKey
  ) => Promise<void>;
  assertStateRoot: (root: Field) => AccountUpdate;
  settle: (
    blockProof: LazyBlockProof,
    signature: Signature,
    dispatchContractAddress: PublicKey,
    publicKey: PublicKey,
    inputNetworkState: NetworkState,
    outputNetworkState: NetworkState,
    newPromisedMessagesHash: Field
  ) => Promise<void>;
  addTokenBridge: (
    tokenId: Field,
    address: PublicKey,
    dispatchContract: PublicKey
  ) => Promise<void>;
}

// Some random prefix for the sequencer signature
export const BATCH_SIGNATURE_PREFIX = prefixToField("pk-batchSignature");


const defaultHooks : ProvableSettlementHook<unknown>[] = [];

export abstract class SettlementSmartContractBase extends TokenContractV2 {
  // This pattern of injecting args into a smartcontract is currently the only
  // viable solution that works given the inheritance issues of o1js
  // public static args = container.resolve(SettlementSmartContractStaticArgs);
  public static args: {
    DispatchContract: TypedClass<DispatchContractType & SmartContract>;
    hooks: ProvableSettlementHook<unknown>[];
    escapeHatchSlotsInterval: number;
    BridgeContract: TypedClass<BridgeContractType> & typeof SmartContract;
    // Lazily initialized
    BridgeContractVerificationKey: VerificationKey | undefined;
    BridgeContractPermissions: Permissions | undefined;
    signedSettlements: boolean | undefined;
  };

  events = {
    "announce-private-key": PrivateKey,
    "token-bridge-deployed": TokenMapping,
  };

  abstract sequencerKey: State<Field>;
  abstract lastSettlementL1BlockHeight: State<UInt32>;
  abstract stateRoot: State<Field>;
  abstract networkStateHash: State<Field>;
  abstract blockHashRoot: State<Field>;
  abstract dispatchContractAddressX: State<Field>;

  abstract authorizationField: State<Field>;

  // Not @state
  // abstract offchainStateCommitmentsHash: State<Field>;

  public assertStateRoot(root: Field): AccountUpdate {
    this.stateRoot.requireEquals(root);
    return this.self;
  }

  // TODO Like these properties, I am too lazy to properly infer the types here
  private assertLazyConfigsInitialized() {
    const uninitializedProperties: string[] = [];
    // const { args } = SettlementSmartContractBase;
    const args = {
      BridgeContractPermissions: Permissions.default(),
      signedSettlements: false
    }
    if (args.BridgeContractPermissions === undefined) {
      uninitializedProperties.push("BridgeContractPermissions");
    }
    if (args.signedSettlements === undefined) {
      uninitializedProperties.push("signedSettlements");
    }
    if (uninitializedProperties.length > 0) {
      throw new Error(
        `Lazy configs of SettlementSmartContract haven't been initialized ${uninitializedProperties.reduce(
          (a, b) => `${a},${b}`
        )}`
      );
    }
  }

  protected async deployTokenBridge(
    tokenId: Field,
    address: PublicKey,
    dispatchContractAddress: PublicKey,
    dispatchContractPreconditionEnforced = false,
    bridgeContractVerificationKey: VerificationKey,
    signedSettlements: boolean,
    bridgeContractPermissions: Permissions

  ) {
    Provable.asProver(() => {
      this.assertLazyConfigsInitialized();
    });

    // const { args } = SettlementSmartContractBase;
    // const BridgeContractClass = args.BridgeContract;
    const bridgeContract = new BridgeContract(address, tokenId);

    // This function is not a zkapps method, therefore it will be part of this methods execution
    // The returning account update (owner.self) is therefore part of this circuit and is assertable
    const deploymentAccountUpdate = await bridgeContract.deployProvable(
      bridgeContractVerificationKey,
      signedSettlements,
      bridgeContractPermissions,
      this.address
    );

    this.approve(deploymentAccountUpdate);

    this.self.body.mayUseToken = {
      // Only set this if we deploy a custom token
      parentsOwnToken: tokenId.equals(TokenId.default).not(),
      inheritFromParent: Bool(false),
    };

    this.emitEvent(
      "token-bridge-deployed",
      new TokenMapping({
        tokenId: tokenId,
        publicKey: address,
      })
    );

    // We can't set a precondition twice, for the $mina bridge deployment that
    // would be the case, so we disable it in this case
    if (!dispatchContractPreconditionEnforced) {
      this.dispatchContractAddressX.requireEquals(dispatchContractAddress.x);
    }

    // Set authorization for the auth callback, that we need
    this.authorizationField.set(
      new TokenBridgeDeploymentAuth({
        target: dispatchContractAddress,
        tokenId,
        address,
      }).hash()
    );
    const dispatchContract =
      new DispatchSmartContract(
        dispatchContractAddress
      );
    await dispatchContract.enableTokenDeposits(tokenId, address, this.address);
  }

  protected async initializeBase(
    sequencer: PublicKey,
    dispatchContract: PublicKey,
    bridgeContract: PublicKey,
    contractKey: PrivateKey
  ) {
    this.sequencerKey.getAndRequireEquals().assertEquals(Field(0));
    this.stateRoot.getAndRequireEquals().assertEquals(Field(0));
    this.blockHashRoot.getAndRequireEquals().assertEquals(Field(0));
    this.networkStateHash.getAndRequireEquals().assertEquals(Field(0));
    this.dispatchContractAddressX.getAndRequireEquals().assertEquals(Field(0));

    this.sequencerKey.set(sequencer.x);
    this.stateRoot.set(Field(RollupMerkleTree.EMPTY_ROOT));
    this.blockHashRoot.set(Field(BlockHashMerkleTree.EMPTY_ROOT));
    this.networkStateHash.set(NetworkState.empty().hash());
    this.dispatchContractAddressX.set(dispatchContract.x);

    // const { DispatchContract } = SettlementSmartContractBase.args;
    // const contractInstance = new DispatchContract(dispatchContract);
    const contractInstance = new DispatchSmartContract(dispatchContract);
    await contractInstance.initialize(this.address);

    // Deploy bridge contract for $Mina
    await this.deployTokenBridge(
      this.tokenId,
      bridgeContract,
      dispatchContract,
      true,
      defaultBridgeContractVerificationKey,
      false,
      defaultBridgeContractPermissions
    );

    contractKey.toPublicKey().assertEquals(this.address);
    this.emitEvent("announce-private-key", contractKey);
  }

  protected async settleBase(
    blockProof: LazyBlockProof,
    signature: Signature,
    dispatchContractAddress: PublicKey,
    publicKey: PublicKey,
    inputNetworkState: NetworkState,
    outputNetworkState: NetworkState,
    newPromisedMessagesHash: Field
  ) {
    // Verify the blockproof
    blockProof.verify();

    // Get and assert on-chain values
    const stateRoot = this.stateRoot.getAndRequireEquals();
    const networkStateHash = this.networkStateHash.getAndRequireEquals();
    const blockHashRoot = this.blockHashRoot.getAndRequireEquals();
    const sequencerKey = this.sequencerKey.getAndRequireEquals();
    const lastSettlementL1BlockHeight =
      this.lastSettlementL1BlockHeight.getAndRequireEquals();
    const onChainDispatchContractAddressX =
      this.dispatchContractAddressX.getAndRequireEquals();

    onChainDispatchContractAddressX.assertEquals(
      dispatchContractAddress.x,
      "DispatchContract address not provided correctly"
    );

    // const { DispatchContract, escapeHatchSlotsInterval, hooks } = SettlementSmartContractBase.args;
    // Get dispatch contract values
    // These values are witnesses but will be checked later on the AU
    // call to the dispatch contract via .updateMessagesHash()
    const dispatchContract = new DispatchSmartContract(dispatchContractAddress);
    const promisedMessagesHash = dispatchContract.promisedMessagesHash.get();

    // Get block height and use the lower bound for all ops
    const minBlockHeightIncluded = this.network.blockchainLength.get();
    this.network.blockchainLength.requireBetween(
      minBlockHeightIncluded,
      // 5 because that is the length the newPromisedMessagesHash will be valid
      minBlockHeightIncluded.add(4)
    );

    // Check signature/escape catch
    publicKey.x.assertEquals(
      sequencerKey,
      "Sequencer public key witness not matching"
    );
    const signatureValid = signature.verify(publicKey, [
      BATCH_SIGNATURE_PREFIX,
      lastSettlementL1BlockHeight.value,
    ]);
    const escapeHatchActivated = lastSettlementL1BlockHeight
      .add(UInt32.from(DEFAULT_ESCAPE_HATCH))
      .lessThan(minBlockHeightIncluded);
    signatureValid
      .or(escapeHatchActivated)
      .assertTrue(
        "Sequencer signature not valid and escape hatch not activated"
      );

    // Assert correctness of networkState witness
    inputNetworkState
      .hash()
      .assertEquals(networkStateHash, "InputNetworkState witness not valid");
    outputNetworkState
      .hash()
      .assertEquals(
        blockProof.publicOutput.networkStateHash,
        "OutputNetworkState witness not valid"
      );

    blockProof.publicOutput.closed.assertEquals(
      Bool(true),
      "Supplied proof is not a closed BlockProof"
    );

    // Execute onSettlementHooks for additional checks
    const stateRecord: SettlementStateRecord = {
      blockHashRoot,
      stateRoot,
      networkStateHash,
      lastSettlementL1BlockHeight,
      sequencerKey: publicKey,
    };
    const inputs: SettlementHookInputs = {
      blockProof,
      contractState: stateRecord,
      newPromisedMessagesHash,
      fromNetworkState: inputNetworkState,
      toNetworkState: outputNetworkState,
      currentL1BlockHeight: minBlockHeightIncluded,
    };
    const hooks = defaultHooks;
    await mapSequential(hooks, async (hook) => {
      await hook.beforeSettlement(this, inputs);
    });

    // Apply blockProof
    stateRoot.assertEquals(
      blockProof.publicInput.stateRoot,
      "Input state root not matching"
    );

    networkStateHash.assertEquals(
      blockProof.publicInput.networkStateHash,
      "Input networkStateHash not matching"
    );
    blockHashRoot.assertEquals(
      blockProof.publicInput.blockHashRoot,
      "Input blockHashRoot not matching"
    );
    this.stateRoot.set(blockProof.publicOutput.stateRoot);
    this.networkStateHash.set(blockProof.publicOutput.networkStateHash);
    this.blockHashRoot.set(blockProof.publicOutput.blockHashRoot);

    // Assert and apply deposit commitments
    promisedMessagesHash.assertEquals(
      blockProof.publicOutput.incomingMessagesHash,
      "Promised messages not honored"
    );

    // Set authorization for the dispatchContract to verify the messages hash update
    this.authorizationField.set(
      new UpdateMessagesHashAuth({
        target: dispatchContract.address,
        executedMessagesHash: promisedMessagesHash,
        newPromisedMessagesHash,
      }).hash()
    );

    // Call DispatchContract
    // This call checks that the promisedMessagesHash, which is already proven
    // to be the blockProofs publicoutput, is actually the current on-chain
    // promisedMessageHash. It also checks the newPromisedMessagesHash to be
    // a current sequencestate value
    await dispatchContract.updateMessagesHash(
      promisedMessagesHash,
      newPromisedMessagesHash
    );

    this.lastSettlementL1BlockHeight.set(minBlockHeightIncluded);
  }
}

export class SettlementSmartContract
  extends SettlementSmartContractBase
  implements SettlementContractType
{
  @state(Field) public sequencerKey = State<Field>();
  @state(UInt32) public lastSettlementL1BlockHeight = State<UInt32>();

  @state(Field) public stateRoot = State<Field>();
  @state(Field) public networkStateHash = State<Field>();
  @state(Field) public blockHashRoot = State<Field>();

  @state(Field) public dispatchContractAddressX = State<Field>();

  @state(Field) public authorizationField = State<Field>();

  @method async approveBase(forest: AccountUpdateForest) {
    this.checkZeroBalanceChange(forest);
  }

  @method
  public async initialize(
    sequencer: PublicKey,
    dispatchContract: PublicKey,
    bridgeContract: PublicKey,
    contractKey: PrivateKey
  ) {
    await this.initializeBase(
      sequencer,
      dispatchContract,
      bridgeContract,
      contractKey
    );
  }

  @method
  public async addTokenBridge(
    tokenId: Field,
    address: PublicKey,
    dispatchContract: PublicKey
  ) {
    await this.deployTokenBridge(tokenId, address, dispatchContract, true, defaultBridgeContractVerificationKey, false, defaultBridgeContractPermissions);
  }

  @method
  public async settle(
    blockProof: LazyBlockProof,
    signature: Signature,
    dispatchContractAddress: PublicKey,
    publicKey: PublicKey,
    inputNetworkState: NetworkState,
    outputNetworkState: NetworkState,
    newPromisedMessagesHash: Field
  ) {
    return await this.settleBase(
      blockProof,
      signature,
      dispatchContractAddress,
      publicKey,
      inputNetworkState,
      outputNetworkState,
      newPromisedMessagesHash
    );
  }
}

/* eslint-enable @typescript-eslint/lines-between-class-members */
