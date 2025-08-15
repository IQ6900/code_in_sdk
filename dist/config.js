"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv = require("dotenv");
const bs58 = require('bs58');
const web3_js_1 = require("@solana/web3.js");
dotenv.config();
const secretKey = bs58.decode(process.env.SIGNER_PRIVATE_KEY);
const keypair = web3_js_1.Keypair.fromSecretKey(secretKey);
exports.config = {
    rpc: process.env.RPC || '',
    iqHost: "https://iq6900-backend-381334931214.asia-northeast3.run.app",
    signerPrivateKey: process.env.SIGNER_PRIVATE_KEY || '',
    keypair: keypair,
    transactionSizeLimit: 850,
    sizeLimitForSplitCompression: 10000,
};
