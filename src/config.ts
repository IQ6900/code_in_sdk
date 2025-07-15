import * as dotenv from 'dotenv';
import bs58 from 'bs58';
import {Keypair} from "@solana/web3.js";
dotenv.config();
const secretKey = bs58.decode(process.env.SIGNER_PRIVATE_KEY!);
const keypair = Keypair.fromSecretKey(secretKey);


export const config = {
    rpc: process.env.RPC || '',
    iqHost: "https://solanacontractapi.uc.r.appspot.com",
    signerPrivateKey: process.env.SIGNER_PRIVATE_KEY || '',
    keypair:keypair,
    transactionSizeLimit:900,
    sizeLimitForSplitCompression:10000,
};