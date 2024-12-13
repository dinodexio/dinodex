import { Field, Signature } from "o1js";
import { injectable } from "tsyringe";

// import { AppChainModule } from "../appChain/AppChainModule";
import { AppChainModule, Signer } from "@proto-kit/sdk";
import Client from "mina-signer";

@injectable()
export class PrivateKeySigner extends AppChainModule<unknown> implements Signer {
  public async sign(message: Field[]): Promise<Signature> {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions,@typescript-eslint/no-unsafe-assignment
    const client = new Client({network: 'testnet'});
    const response = client.signFields(
      message.map((field) => field.toBigInt()), process.env.PROTOKIT_FACTORY_KEY! // privateKey of Factory
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Signature.fromBase58(response.signature);
  }
}
