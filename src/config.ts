import * as dotenv from 'dotenv';
const bs58 = require('bs58');
import {Keypair} from "@solana/web3.js";
dotenv.config();
const secretKey = bs58.decode(process.env.SIGNER_PRIVATE_KEY!);
const keypair = Keypair.fromSecretKey(secretKey);


export const config = {
    rpc: process.env.RPC || '',
    iqHost: "https://iq6900-backend-381334931214.asia-northeast3.run.app",
    signerPrivateKey: process.env.SIGNER_PRIVATE_KEY || '',
    keypair:keypair,
    transactionSizeLimit:850,
    sizeLimitForSplitCompression:10000,
};