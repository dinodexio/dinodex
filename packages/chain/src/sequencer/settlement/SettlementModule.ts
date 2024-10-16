import {
    Protocol,
    BATCH_SIGNATURE_PREFIX,
    Path,
    OUTGOING_MESSAGE_BATCH_SIZE,
    SettlementContractConfig,
    MandatorySettlementModulesRecord,
    MandatoryProtocolModulesRecord,
    BlockProverPublicOutput,
    // SettlementSmartContract,
    // DispatchSmartContract
} from "@proto-kit/protocol";
import { SettlementSmartContract} from "../../protocol/settlement/contracts/build/src/SettlementSmartContract.js";
import { DispatchSmartContract} from "../../protocol/settlement/contracts/build/src/DispatchSmartContract.js";
import { SettlementContractModule } from "../../protocol/settlement/SettlementContractModule.js";
import { OutgoingMessageArgumentBatch, OutgoingMessageArgument } from "../../protocol/settlement/contracts/build/src/common/messages/OutgoingMessageArgument.js";
import {
    AccountUpdate,
    Field,
    Mina,
    PrivateKey,
    PublicKey,
    Signature,
    Transaction,
    fetchAccount,
} from "o1js";
import { inject } from "tsyringe";
import {
    EventEmitter,
    EventEmittingComponent,
    log,
    noop,
    RollupMerkleTree,
    type AreProofsEnabled,
} from "@proto-kit/common";
import { Runtime, RuntimeModulesRecord } from "@proto-kit/module";

import {
    SequencerModule, sequencerModule,
    type SettlementStorage, type MessageStorage,
    MinaBaseLayer, Batch, SettleableBatch,
    type AsyncMerkleTreeStore, CachedMerkleTreeStore,
    Settlement,
    MinaTransactionSender, FlowCreator,
} from "@proto-kit/sequencer";
// import { FlowCreator } from "../worker/flow/Flow.js";
import { type IncomingMessageAdapter } from "./messages/IncomingMessageAdapter.js";
import { BlockProofSerializer } from "@proto-kit/sequencer/dist/protocol/production/helpers/BlockProofSerializer";
import { type FeeStrategy } from "../protocol/baselayer/fees/FeeStrategy";

import type { OutgoingMessageQueue } from "./messages/WithdrawalQueue";

import { ProvenSettlementPermissions } from "./permissions/ProvenSettlementPermissions";
import { SignedSettlementPermissions } from "./permissions/SignedSettlementPermissions";

export interface SettlementModuleConfig {
    feepayer: PrivateKey;
    address?: PublicKey;
}

export type SettlementModuleEvents = {
    "settlement-submitted": [Batch];
};

@sequencerModule()
export class SettlementModule
    extends SequencerModule<SettlementModuleConfig>
    implements EventEmittingComponent<SettlementModuleEvents> {
    protected contracts?: {
        settlement: SettlementSmartContract;
        dispatch: DispatchSmartContract;
    };

    protected settlementModuleConfig?: SettlementContractConfig;

    public addresses?: {
        settlement: PublicKey;
        dispatch: PublicKey;
    };

    public keys?: {
        settlement: PrivateKey;
        dispatch: PrivateKey;
    };

    public events = new EventEmitter<SettlementModuleEvents>();

    public constructor(
        @inject("BaseLayer")
        private readonly baseLayer: MinaBaseLayer,
        @inject("Protocol")
        private readonly protocol: Protocol<MandatoryProtocolModulesRecord>,
        @inject("Runtime")
        private readonly runtime: Runtime<RuntimeModulesRecord>,
        private readonly flowCreator: FlowCreator,
        @inject("IncomingMessageAdapter")
        private readonly incomingMessagesAdapter: IncomingMessageAdapter,
        @inject("MessageStorage")
        private readonly messageStorage: MessageStorage,
        @inject("SettlementStorage")
        private readonly settlementStorage: SettlementStorage,
        @inject("OutgoingMessageQueue")
        private readonly outgoingMessageQueue: OutgoingMessageQueue,
        @inject("AsyncMerkleStore")
        private readonly merkleTreeStore: AsyncMerkleTreeStore,
        private readonly blockProofSerializer: BlockProofSerializer,
        @inject("TransactionSender")
        private readonly transactionSender: MinaTransactionSender,
        @inject("AreProofsEnabled")
        private readonly areProofsEnabled: AreProofsEnabled,
        @inject("FeeStrategy")
        private readonly feeStrategy: FeeStrategy
    ) {
        super();
    }

    protected settlementContractModule(): SettlementContractModule<MandatorySettlementModulesRecord> {
        return this.protocol.dependencyContainer.resolve(
            "SettlementContractModule"
        );
    }

    public getSettlementModuleConfig(): SettlementContractConfig {
        if (this.settlementModuleConfig === undefined) {
            const settlementContractModule = this.settlementContractModule();

            this.settlementModuleConfig =
                settlementContractModule.resolve("SettlementContract").config;

            if (this.settlementModuleConfig === undefined) {
                throw new Error("Failed to fetch config from SettlementContract");
            }
        }
        return this.settlementModuleConfig;
    }

    public getContracts() {
        if (this.contracts === undefined) {
            const { addresses, protocol } = this;
            if (addresses === undefined) {
                throw new Error(
                    "Settlement Contract hasn't been deployed yet. Deploy it first, then restart"
                );
            }
            const settlementContractModule = protocol.dependencyContainer.resolve<
                SettlementContractModule<MandatorySettlementModulesRecord>
            >("SettlementContractModule");

            // TODO Add generic inference of concrete Contract types
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            this.contracts = settlementContractModule.createContracts(addresses) as {
                settlement: SettlementSmartContract;
                dispatch: DispatchSmartContract;
            };
        }
        return this.contracts;
    }

    protected isSignedSettlement(): boolean {
        return !this.areProofsEnabled.areProofsEnabled;
    }

    public signTransaction(
        tx: Transaction<false, false>,
        pks: PrivateKey[]
    ): Transaction<false, true> {
        this.requireSignatureIfNecessary(tx);
        const contractKeys = this.isSignedSettlement()
            ? Object.values(this.keys ?? {})
            : [];
        return tx.sign([...pks, ...contractKeys]);
    }

    private requireSignatureIfNecessary(tx: Transaction<false, false>) {
        const { addresses } = this;
        if (this.isSignedSettlement() && addresses !== undefined) {
            tx.transaction.accountUpdates.forEach((au) => {
                if (
                    au.publicKey
                        .equals(addresses.settlement)
                        .or(au.publicKey.equals(addresses.dispatch))
                        .toBoolean()
                ) {
                    au.requireSignature();
                }
            });
        }
    }

    /* eslint-disable no-await-in-loop */
    public async sendRollupTransactions(options: { nonce: number }): Promise<
        {
            tx: Transaction<false, true>;
        }[]
    > {
        const length = this.outgoingMessageQueue.length();
        const { feepayer } = this.config;
        let { nonce } = options;

        const txs: {
            tx: Transaction<false, true>;
        }[] = [];

        const { settlement } = this.getContracts();

        const cachedStore = new CachedMerkleTreeStore(this.merkleTreeStore);
        const tree = new RollupMerkleTree(cachedStore);

        const [withdrawalModule, withdrawalStateName] =
            this.getSettlementModuleConfig().withdrawalStatePath.split(".");
        const basePath = Path.fromProperty(withdrawalModule, withdrawalStateName);

        for (let i = 0; i < length; i += OUTGOING_MESSAGE_BATCH_SIZE) {
            const batch = this.outgoingMessageQueue.peek(OUTGOING_MESSAGE_BATCH_SIZE);

            const keys = batch.map((x) =>
                Path.fromKey(basePath, Field, Field(x.index))
            );
            // Preload keys
            await cachedStore.preloadKeys(keys.map((key) => key.toBigInt()));

            const transactionParamaters = batch.map((message, index) => {
                const witness = tree.getWitness(keys[index].toBigInt());
                return new OutgoingMessageArgument({
                    witness,
                    value: message.value,
                });
            });

            const tx = await Mina.transaction(
                {
                    sender: feepayer.toPublicKey(),
                    // eslint-disable-next-line no-plusplus
                    nonce: nonce++,
                    fee: this.feeStrategy.getFee(),
                    memo: "roll up actions",
                },
                async () => {
                    await settlement.rollupOutgoingMessages(
                        OutgoingMessageArgumentBatch.fromMessages(transactionParamaters)
                    );
                }
            );

            const signedTx = this.signTransaction(tx, [feepayer]);

            await this.transactionSender.proveAndSendTransaction(
                signedTx
            );

            this.outgoingMessageQueue.pop(OUTGOING_MESSAGE_BATCH_SIZE);

            txs.push({
                tx: signedTx,
            });
        }

        return txs;
    }
    /* eslint-enable no-await-in-loop */

    private async fetchContractAccounts() {
        const contracts = this.getContracts();
        if (
            contracts !== undefined &&
            this.baseLayer.config.network.local !== true
        ) {
            await fetchAccount({
                publicKey: contracts.settlement.address,
                tokenId: contracts.settlement.tokenId,
            });
            await fetchAccount({
                publicKey: contracts.dispatch.address,
                tokenId: contracts.dispatch.tokenId,
            });
        }
    }

    public async settleBatch(
        batch: SettleableBatch,
        options: {
            nonce?: number;
        } = {}
    ): Promise<Settlement> {
        await this.fetchContractAccounts();
        const { settlement, dispatch } = this.getContracts();
        const { feepayer } = this.config;

        log.debug("Preparing settlement");

        const lastSettlementL1BlockHeight =
            settlement.lastSettlementL1BlockHeight.get().value;
        const signature = Signature.create(feepayer, [
            BATCH_SIGNATURE_PREFIX,
            lastSettlementL1BlockHeight,
        ]);

        const fromSequenceStateHash = BlockProverPublicOutput.fromFields(
            batch.proof.publicOutput.map((x) => Field(x))
        ).incomingMessagesHash;
        const latestSequenceStateHash = dispatch.account.actionState.get();

        // Fetch actions and store them into the messageStorage
        const actions = await this.incomingMessagesAdapter.getPendingMessages(
            dispatch.address,
            {
                fromActionHash: fromSequenceStateHash.toString(),
                toActionHash: latestSequenceStateHash.toString(),
                fromL1BlockHeight: Number(lastSettlementL1BlockHeight.toString()),
            }
        );
        await this.messageStorage.pushMessages(
            actions.from,
            actions.to,
            actions.messages
        );

        const blockProof = await this.blockProofSerializer
            .getBlockProofSerializer()
            .fromJSONProof(batch.proof);

        const tx = await Mina.transaction(
            {
                sender: feepayer.toPublicKey(),
                nonce: options?.nonce,
                fee: this.feeStrategy.getFee(),
                memo: "Protokit settle",
            },
            async () => {
                await settlement.settle(
                    blockProof,
                    signature,
                    dispatch.address,
                    feepayer.toPublicKey(),
                    batch.fromNetworkState,
                    batch.toNetworkState,
                    latestSequenceStateHash
                );
            }
        );

        this.signTransaction(tx, [feepayer]);

        await this.transactionSender.proveAndSendTransaction(tx);

        log.info("Settlement transaction send queued");

        this.events.emit("settlement-submitted", batch);

        return {
            batches: [batch.height],
            promisedMessagesHash: latestSequenceStateHash.toString(),
        };
    }

    public async deploy(
        settlementKey: PrivateKey,
        dispatchKey: PrivateKey,
        options: { nonce?: number } = {}
    ) {
        log.info("Start deploy settlement");
        const feepayerKey = this.config.feepayer;
        const feepayer = feepayerKey.toPublicKey();

        const nonce = options?.nonce ?? 0;

        const sm = this.protocol.dependencyContainer.resolve<
            SettlementContractModule<MandatorySettlementModulesRecord>
        >("SettlementContractModule");
        const { settlement, dispatch } = sm.createContracts({
            settlement: settlementKey.toPublicKey(),
            dispatch: dispatchKey.toPublicKey(),
        });

        const permissions = this.isSignedSettlement()
            ? new SignedSettlementPermissions()
            : new ProvenSettlementPermissions();

        const tx = await Mina.transaction(
            {
                sender: feepayer,
                nonce,
                fee: this.feeStrategy.getFee(),
                memo: "Protokit settlement deploy",
            },
            async () => {
                AccountUpdate.fundNewAccount(feepayer, 2);
                await settlement.deploy({
                    // TODO Create compilation task that generates those artifacts if proofs enabled
                    verificationKey: undefined,
                });
                settlement.account.permissions.set(permissions.settlementContract());

                await dispatch.deploy({
                    verificationKey: undefined,
                });
                dispatch.account.permissions.set(permissions.dispatchContract());
            }
        ).sign([feepayerKey, settlementKey, dispatchKey]);
        // Note: We can't use this.signTransaction on the above tx

        // This should already apply the tx result to the
        // cached accounts / local blockchain
        await this.transactionSender.proveAndSendTransaction(tx);

        this.addresses = {
            settlement: settlementKey.toPublicKey(),
            dispatch: dispatchKey.toPublicKey(),
        };
        this.keys = {
            settlement: settlementKey,
            dispatch: dispatchKey,
        };

        const initTx = await Mina.transaction(
            {
                sender: feepayer,
                nonce: nonce + 1,
                fee: this.feeStrategy.getFee(),
                memo: "Protokit settlement init",
            },
            async () => {
                await settlement.initialize(
                    feepayerKey.toPublicKey(),
                    dispatchKey.toPublicKey()
                );
            }
        );

        const initTxSigned = this.signTransaction(initTx, [feepayerKey]);

        await this.transactionSender.proveAndSendTransaction(
            initTxSigned
        );
    }

    public async start(): Promise<void> {
        noop();
    }
}
