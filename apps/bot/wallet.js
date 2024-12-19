


import { PrivateKey } from 'o1js';
import bip39 from "bip39"
import {BIP32Factory} from "bip32"
import * as ecc from "tiny-secp256k1"

// Replace this with your mnemonic phrase
const BOT_MNEMONICS = "later labor aerobic later labor aerobic later labor aerobic later labor aerobic";

const bip32 = BIP32Factory(ecc);

// Define the BIP44 path for Mina (BIP44 coin type 12586 for Mina)
export const seedDerivationPath = (x,y,z) => {
    return ( "m/44'/12586'/xx'/yy'/zz'").replace("xx", x).replace("yy", y).replace("zz", z);
}


export async function generateMinaPrivateKeyFromPath(mnemonic, path) {
  try {
    // Validate mnemonic
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error("Invalid mnemonic phrase");
    }

    // Generate a seed from the mnemonic
    const seed = await bip39.mnemonicToSeed(mnemonic);

    // Derive the node from the seed using bip32
    const root = bip32.fromSeed(seed);
    const childNode = root.derivePath(path);
    // Take the private key and convert to Mina's PrivateKey format
    const privateKeyBigInt = BigInt('0x' + Buffer.from(childNode.privateKey).toString('hex'));
    const minaPrivateKey = PrivateKey.fromBigInt(privateKeyBigInt);

    // console.log("Derivation Path:", path);
    // console.log("Mina Private Key (Base58):", minaPrivateKey.toBase58());
    // console.log("Public Key (Base58):", minaPrivateKey.toPublicKey().toBase58());
    return {
        publicKey:  minaPrivateKey.toPublicKey().toBase58(),
        privateKey: minaPrivateKey.toBase58()
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Run the function with the derivation path
// generateMinaPrivateKeyFromPath(BOT_MNEMONICS, seedDerivationPath(0,0,0));

const generateBotWallet = async () => {
    const botStore = [];
    for (let index = 0; index < 20; index++) {
        const tempWallet = await generateMinaPrivateKeyFromPath(BOT_MNEMONICS, seedDerivationPath(0,0, index));
        botStore.push(tempWallet);
    }
    console.log(botStore, botStore.map(item => item.publicKey));
}

// generateBotWallet();
export const BOT_STORES = [

];
export const BOT_STORES_ADDRESS = [

]
