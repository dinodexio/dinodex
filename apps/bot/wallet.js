


import { PrivateKey } from 'o1js';
import bip39 from "bip39"
import {BIP32Factory} from "bip32"
import * as ecc from "tiny-secp256k1"

// Replace this with your mnemonic phrase
// const BOT_MNEMONICS = "later labor aerobic fossil version hard curious spin sport square clock chair";
const BOT_MNEMONICS = "merit kiwi oven nuclear idle town destroy magnet cause grief ripple term";

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
// export const BOT_STORES = [
//     {
//       publicKey: 'B62qnqshC1MkKTfD7ogzmm1VAXx9DpcQmmN22RRVcAVtzgdD1EDevh2',
//       privateKey: 'EKF4sTs8VgpomzyV5hsfim7Z6jYPJx3ivRQmmE8M7u4yeQM6p8y5'
//     },
//     {
//       publicKey: 'B62qmrkVYShvTjnLK18yaynitaF1DHG6p8yqoQnnNZgAAx1wAR3UCpy',
//       privateKey: 'EKFUjKWhH7MjHQTPtzRRPehGDhDzhixF6FtjmmSbNaQG6VGvfvza'
//     },
//     {
//       publicKey: 'B62qmKqmjtjBMw9CkN6H9XdDMomJ1ibUNr4QaSpoAzwFWPvHoH99Tsm',
//       privateKey: 'EKDkq8H4kUnyBkVNs8vpn7kzw1HUNbdpvsmiT9A3bRV9Qn3FFZ7v'
//     },
//     {
//       publicKey: 'B62qmh72UEppkV9Utis6qptotJ2SRyCHUcrjUhySPB8GyBv6dqXFRf9',
//       privateKey: 'EKFWL4a2RMP2iR5JYFJS9DKUGJ3S8ntukidsXmGWcVaYW1Q8XuQd'
//     },
//     {
//       publicKey: 'B62qkh9Z7DzK5K4Y2KgzT62okezjDhtioKahmY7ALepafeqyPokU587',
//       privateKey: 'EKEwajinqMebsRyZFxe17JFYt4khjXp9fya6eF2J4skoEpj5cqzd'
//     },
//     {
//       publicKey: 'B62qiZDGPyNxLRKrnwc91ySMkUTuDjPDrDNTK231yWjvhVyqphcpXGa',
//       privateKey: 'EKEbfEAy3riuJfpWnJzPzN4YSJm4FKZAnuEQsQWS3XHRxi4UdrgF'
//     },
//     {
//       publicKey: 'B62qkUD8obg3asrWY9ZjBQCJDr5FoUsei7uDK9BteKvABNzpe8TRaXw',
//       privateKey: 'EKFPF7hxFwnNWfSQC5DyBjvfgRLy65P547YuPMDaNTLXScNwH41y'
//     },
//     {
//       publicKey: 'B62qmwkYwLopQXYMVJ1WYpyi6TpcrmM1ab9wZGkmFx1XWkePAmpew9L',
//       privateKey: 'EKFNfDd2cfUBgqsqiUoXeeBisECRhTRQREkopPTvMPqvkc9Cgogc'
//     }
//   ];
export const BOT_STORES = [
  {
    publicKey: 'B62qnqshC1MkKTfD7ogzmm1VAXx9DpcQmmN22RRVcAVtzgdD1EDevh2',
    privateKey: 'EKF4sTs8VgpomzyV5hsfim7Z6jYPJx3ivRQmmE8M7u4yeQM6p8y5'
  },
  {
    publicKey: 'B62qmrkVYShvTjnLK18yaynitaF1DHG6p8yqoQnnNZgAAx1wAR3UCpy',
    privateKey: 'EKFUjKWhH7MjHQTPtzRRPehGDhDzhixF6FtjmmSbNaQG6VGvfvza'
  },
  {
    publicKey: 'B62qmKqmjtjBMw9CkN6H9XdDMomJ1ibUNr4QaSpoAzwFWPvHoH99Tsm',
    privateKey: 'EKDkq8H4kUnyBkVNs8vpn7kzw1HUNbdpvsmiT9A3bRV9Qn3FFZ7v'
  },
  {
    publicKey: 'B62qmh72UEppkV9Utis6qptotJ2SRyCHUcrjUhySPB8GyBv6dqXFRf9',
    privateKey: 'EKFWL4a2RMP2iR5JYFJS9DKUGJ3S8ntukidsXmGWcVaYW1Q8XuQd'
  },
  {
    publicKey: 'B62qkh9Z7DzK5K4Y2KgzT62okezjDhtioKahmY7ALepafeqyPokU587',
    privateKey: 'EKEwajinqMebsRyZFxe17JFYt4khjXp9fya6eF2J4skoEpj5cqzd'
  },
  {
    publicKey: 'B62qiZDGPyNxLRKrnwc91ySMkUTuDjPDrDNTK231yWjvhVyqphcpXGa',
    privateKey: 'EKEbfEAy3riuJfpWnJzPzN4YSJm4FKZAnuEQsQWS3XHRxi4UdrgF'
  },
  {
    publicKey: 'B62qkUD8obg3asrWY9ZjBQCJDr5FoUsei7uDK9BteKvABNzpe8TRaXw',
    privateKey: 'EKFPF7hxFwnNWfSQC5DyBjvfgRLy65P547YuPMDaNTLXScNwH41y'
  },
  {
    publicKey: 'B62qmwkYwLopQXYMVJ1WYpyi6TpcrmM1ab9wZGkmFx1XWkePAmpew9L',
    privateKey: 'EKFNfDd2cfUBgqsqiUoXeeBisECRhTRQREkopPTvMPqvkc9Cgogc'
  },
  {
    publicKey: 'B62qoKCLQtRbAEarV2xo2cDn2YDS43b4A6V3na3cbvvVTf7ocHkNYL5',
    privateKey: 'EKEyhuXt73Tn7BDcfHbjooVJZV8JSxokNCenymBih3T7SmrDFDDz'
  },
  {
    publicKey: 'B62qoNdNBwN3FNq3b3fEBC1hHdmFLhuu1LDJHEKBsgsGav3KZQGtRpW',
    privateKey: 'EKEhQkvDa2UpDPKtoMmrFtCWirQaLH4CJVnzSEepM8WUdoqyDZY3'
  },
  {
    publicKey: 'B62qozjHCU5LYS592AXSAY6VGfCTu8ooW21JNKMomhz5Virs4xnrAEk',
    privateKey: 'EKFR9hte1FbtwK48bjPMEbfNTJzDJeC3ygze5u47EgfxwJwDA4q3'
  },
  {
    publicKey: 'B62qjbWSEmVRbgqjBJjcojEfKKLUXJAVjDSaGe1o51ewDw46qPftMUT',
    privateKey: 'EKDuoH1YAmCUN4K5xTXBzvvj4ssHKEpWre6EtjGS7MSWQSJJxAVY'
  },
  {
    publicKey: 'B62qih3ZHh5phdRfNohwiVzwjNQBagHhVhLFuNav2xY7ueK7nTAv8BT',
    privateKey: 'EKFZJpRcgeVUxFoPJTJ1CcgqzKae5Bh3p7UNVczQvKLrgt8bzUBo'
  },
  {
    publicKey: 'B62qjgtSBqvcz3taZzT3oftf6QgJfPyUsjGJUUA9uEoSSgiDTBuM8M4',
    privateKey: 'EKE8xP54rJ17ro6bT3NVgLwHYWKTZZc2RBo2oK4QPzfhtAxKZZbP'
  },
  {
    publicKey: 'B62qnCKvxiJLSpTxEPFiLVMhkAixtcxkeVGp65ugQAEWiT7vU2vFMPv',
    privateKey: 'EKFGXkFDHd8ynRfBT3LCKEXGUEx2o8cuKaYxJDpipF2Eu3j9nQEp'
  },
  {
    publicKey: 'B62qiuF9uRnaKetLE2V2h7Qkm8qFqUL1Qhcn23jcLBQGgq2RZLgTTid',
    privateKey: 'EKE23fekPcxNB6nhrbYABPyf92p4sP4YvGR9in7kJxNU97TeKEoH'
  },
  {
    publicKey: 'B62qqaXGKE2nvqxCmiXxieDEdTCcvX1hs4G67czxiDPS9teRgmaTsA8',
    privateKey: 'EKEoYRPfNYRwKJUP8ibRtwQe4zWAq8z6X8K5HNAhtKzxf4hLaFNv'
  },
  {
    publicKey: 'B62qkem3xVSpAaebaTEpCKSrioARz9HxXryqhaU39oDM9THcNCsDMda',
    privateKey: 'EKDwRkToNL7hgXdudB3shrYqvZKtg8XVzN9po4XcJxzRFVRJ8THz'
  },
  {
    publicKey: 'B62qkLp54gVD7D1H4J5p3TQgyMXdtigRLQ7gVG1siEPZJZH3sS7Nm4H',
    privateKey: 'EKEKvbdUrKquZrS3V3nUppnuyhcqbeTsVooMh1JNAzd3RroHL4Nx'
  },
  {
    publicKey: 'B62qjTKxJRPqzknC5LyA1vaKnxpAgcispmRA39iiK5kzuineVcwYZxY',
    privateKey: 'EKDu21VmicSZyh6aNdkTeewUZs5g1PGw3msu7XYGjTFnCENvfQU6'
  }
];
export const BOT_STORES_ADDRESS = [
  'B62qnqshC1MkKTfD7ogzmm1VAXx9DpcQmmN22RRVcAVtzgdD1EDevh2',
  'B62qmrkVYShvTjnLK18yaynitaF1DHG6p8yqoQnnNZgAAx1wAR3UCpy',
  'B62qmKqmjtjBMw9CkN6H9XdDMomJ1ibUNr4QaSpoAzwFWPvHoH99Tsm',
  'B62qmh72UEppkV9Utis6qptotJ2SRyCHUcrjUhySPB8GyBv6dqXFRf9',
  'B62qkh9Z7DzK5K4Y2KgzT62okezjDhtioKahmY7ALepafeqyPokU587',
  'B62qiZDGPyNxLRKrnwc91ySMkUTuDjPDrDNTK231yWjvhVyqphcpXGa',
  'B62qkUD8obg3asrWY9ZjBQCJDr5FoUsei7uDK9BteKvABNzpe8TRaXw',
  'B62qmwkYwLopQXYMVJ1WYpyi6TpcrmM1ab9wZGkmFx1XWkePAmpew9L',
  'B62qoKCLQtRbAEarV2xo2cDn2YDS43b4A6V3na3cbvvVTf7ocHkNYL5',
  'B62qoNdNBwN3FNq3b3fEBC1hHdmFLhuu1LDJHEKBsgsGav3KZQGtRpW',
  'B62qozjHCU5LYS592AXSAY6VGfCTu8ooW21JNKMomhz5Virs4xnrAEk',
  'B62qjbWSEmVRbgqjBJjcojEfKKLUXJAVjDSaGe1o51ewDw46qPftMUT',
  'B62qih3ZHh5phdRfNohwiVzwjNQBagHhVhLFuNav2xY7ueK7nTAv8BT',
  'B62qjgtSBqvcz3taZzT3oftf6QgJfPyUsjGJUUA9uEoSSgiDTBuM8M4',
  'B62qnCKvxiJLSpTxEPFiLVMhkAixtcxkeVGp65ugQAEWiT7vU2vFMPv',
  'B62qiuF9uRnaKetLE2V2h7Qkm8qFqUL1Qhcn23jcLBQGgq2RZLgTTid',
  'B62qqaXGKE2nvqxCmiXxieDEdTCcvX1hs4G67czxiDPS9teRgmaTsA8',
  'B62qkem3xVSpAaebaTEpCKSrioARz9HxXryqhaU39oDM9THcNCsDMda',
  'B62qkLp54gVD7D1H4J5p3TQgyMXdtigRLQ7gVG1siEPZJZH3sS7Nm4H',
  'B62qjTKxJRPqzknC5LyA1vaKnxpAgcispmRA39iiK5kzuineVcwYZxY'
]
