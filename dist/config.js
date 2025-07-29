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
    iqHost: "https://solanacontractapi.uc.r.appspot.com",
    signerPrivateKey: process.env.SIGNER_PRIVATE_KEY || '',
    keypair: keypair,
    transactionSizeLimit: 900,
    sizeLimitForSplitCompression: 10000,
};
