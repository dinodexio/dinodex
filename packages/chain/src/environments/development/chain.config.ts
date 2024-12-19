import { AppChain } from "@proto-kit/sdk";
import { Runtime } from "@proto-kit/module";
import { Protocol } from "@proto-kit/protocol";
import { DatabasePruneModule, Sequencer, PendingTransaction, sequencerModule } from "@proto-kit/sequencer";
import { PrismaRedisDatabase, PrismaTransactionStorage, type PrismaConnection, TransactionMapper } from "@proto-kit/persistance";
import runtime from "../../runtime";
import protocol from "../../protocol";
import {
  baseSequencerModules,
  baseSequencerModulesConfig,
  indexerSequencerModules,
  indexerSequencerModulesConfig,
} from "../../sequencer";
import { BullQueue, Startable } from "@proto-kit/deployment";
import { Arguments } from "../../start";
import {
  baseAppChainModules,
  baseAppChainModulesConfig,
} from "../../app-chain";
import { inject, injectable } from "tsyringe";

const BLOCK_SIZE = 20;

@injectable()
class CustomPrismaTransactionStorage extends PrismaTransactionStorage {
  public constructor(
    // never mind the 'custom' prefix here
    @inject("Database") public readonly customConnection: PrismaConnection,
    private readonly customTransactionMapper: TransactionMapper
  ) {
    super(customConnection, customTransactionMapper);
  }

  public async getPendingUserTransactions(): Promise<PendingTransaction[]> {
    const { prismaClient } = this.customConnection;

    const txs = await prismaClient.transaction.findMany({
      where: {
        executionResult: {
          is: null,
        },
        isMessage: {
          equals: false,
        },
      },
      // this is the part we're customising
      take: BLOCK_SIZE,
    });

    return txs.map((tx:any) => this.customTransactionMapper.mapIn(tx));
  }
}

@sequencerModule()
class CustomPrismaRedisDatabase extends PrismaRedisDatabase {
  public dependencies() {
    const dependencies = super.dependencies();

    dependencies["transactionStorage"] = {
      useClass: CustomPrismaTransactionStorage,
    };

    return dependencies;
  }
}



export const appChain = AppChain.from({
  Runtime: Runtime.from({
    modules: runtime.modules,
  }),
  Protocol: Protocol.from({
    modules: protocol.modules,
  }),
  Sequencer: Sequencer.from({
    modules: {
      // ordering of the modules matters due to dependency resolution
      // Database: PrismaRedisDatabase,
      Database: CustomPrismaRedisDatabase,
      ...baseSequencerModules,
      ...indexerSequencerModules,
      TaskQueue: BullQueue,
      DatabasePruneModule,
    },
  }),
  modules: baseAppChainModules,
});

export default async (args: Arguments): Promise<Startable> => {
  appChain.configurePartial({
    Runtime: runtime.config,
    Protocol: protocol.config,
    Sequencer: {
      ...baseSequencerModulesConfig,
      ...indexerSequencerModulesConfig,
      DatabasePruneModule: {
        pruneOnStartup: args.pruneOnStartup,
      },
      TaskQueue: {
        redis: {
          host: process.env.REDIS_HOST!,
          port: Number(process.env.REDIS_PORT)!,
          password: process.env.REDIS_PASSWORD!,
        },
      },
      Database: {
        redis: {
          host: process.env.REDIS_HOST!,
          port: Number(process.env.REDIS_PORT)!,
          password: process.env.REDIS_PASSWORD!,
        },
        prisma: {
          connection: process.env.DATABASE_URL!,
        },
      },
    },
    ...baseAppChainModulesConfig,
  });

  return appChain;
};
