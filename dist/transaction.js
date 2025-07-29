"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.txSend = exports._translate_transaction = exports.pdaCheck = exports.userInit = exports.serverInit = void 0;
const client_1 = require("./client");
const web3_js_1 = require("@solana/web3.js");
const config_1 = require("./config");
const anchor = require("@coral-xyz/anchor");
const network = config_1.config.rpc;
const web3 = anchor.web3;
const keypair = config_1.config.keypair;
async function serverInit(serverType, serverID, allowedMerkleRoot = "public") {
    const userKey = keypair.publicKey;
    const useKeyString = userKey.toString();
    const PDA = await (0, client_1.getServerPDA)(useKeyString, serverID);
    const isPDAExist = await pdaCheck(PDA);
    if (isPDAExist) {
        console.log("PDA Exist :", PDA);
        return PDA;
    }
    const transaction = await (0, client_1.createServerInitTransactionOnServer)(useKeyString, serverType, serverID, allowedMerkleRoot);
    if (transaction != null) {
        await txSend(transaction);
        console.log("Your Server PDA address:", PDA);
        return PDA;
    }
    else {
        console.error("Transaction build failed");
    }
}
exports.serverInit = serverInit;
async function userInit() {
    const userKey = keypair.publicKey;
    const useKeyString = userKey.toString();
    const transaction = await (0, client_1.createInitTransactionOnServer)(useKeyString);
    const PDA = await (0, client_1.getDBPDA)(useKeyString);
    const isPDAExist = await pdaCheck(PDA);
    if (isPDAExist) {
        console.log("PDA Exist");
        return PDA;
    }
    if (transaction != null) {
        await txSend(transaction);
    }
    else {
        console.error("Transaction build failed");
    }
}
exports.userInit = userInit;
async function pdaCheck(PDA) {
    try {
        const PDAPubkey = new web3_js_1.PublicKey(PDA);
        const connection = new web3.Connection(network);
        return await connection.getAccountInfo(PDAPubkey);
    }
    catch (error) {
        console.error("PDA Check failed:", error);
    }
}
exports.pdaCheck = pdaCheck;
async function _translate_transaction(data) {
    const transaction = new web3.Transaction();
    const connection = new web3.Connection(network);
    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.feePayer = new web3.PublicKey(data.feePayer);
    data.instructions.forEach((instr) => {
        const instruction = new web3.TransactionInstruction({
            keys: instr.keys.map((key) => ({
                pubkey: new web3.PublicKey(key.pubkey),
                isSigner: key.isSigner,
                isWritable: key.isWritable,
            })),
            programId: new web3.PublicKey(instr.programId),
            data: instr.data,
        });
        transaction.add(instruction);
    });
    return transaction;
}
exports._translate_transaction = _translate_transaction;
async function txSend(tx) {
    let connection = new web3_js_1.Connection(network, 'confirmed');
    let blockHash = await connection.getLatestBlockhash();
    while (blockHash == undefined) {
        connection = new web3_js_1.Connection(network, 'confirmed');
        blockHash = await connection.getLatestBlockhash();
    }
    tx.recentBlockhash = blockHash.blockhash;
    tx.lastValidBlockHeight = blockHash.lastValidBlockHeight;
    tx.feePayer = keypair.publicKey;
    tx.sign(keypair);
    const txid = await web3.sendAndConfirmTransaction(connection, tx, [keypair]);
    if (txid == undefined) {
        return "null";
    }
    else {
        return txid;
    }
}
exports.txSend = txSend;
