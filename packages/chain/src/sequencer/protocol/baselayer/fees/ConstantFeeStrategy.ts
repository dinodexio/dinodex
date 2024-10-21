import { noop } from "@proto-kit/common";

import { SequencerModule, sequencerModule } from "@proto-kit/sequencer";

import { FeeStrategy } from "./FeeStrategy";

export type ConstantFeeStrategyConfig = {
  fee?: number;
};

const DEFAULT_FEE = 0.1 * 1e9;

@sequencerModule()
export class ConstantFeeStrategy
  extends SequencerModule<ConstantFeeStrategyConfig>
  implements FeeStrategy
{
  getFee(): number {
    return this.config.fee ?? DEFAULT_FEE;
  }

  public async start() {
    noop();
  }
}
