import { Indexer } from "@proto-kit/indexer";
import { Startable } from "@proto-kit/deployment";
import { config, modules } from "../../indexer";
import { Arguments } from "../../start";
import { DatabasePruneModule } from "@proto-kit/sequencer";

export const indexer = Indexer.from({
  modules: {
    ...modules,
    DatabasePruneModule,
  },
});

export default async (args: Arguments): Promise<Startable> => {
  indexer.configurePartial({
    ...config,
    DatabasePruneModule: {
      pruneOnStartup: args.pruneOnStartup,
    },
  });
  return indexer;
};
