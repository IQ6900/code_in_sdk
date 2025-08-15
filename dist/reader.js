"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinChat = exports.getChatRecords = exports.fetchLargeFileAndDoCache = exports.dataValidation = exports.readCode = exports.fetchDataSignatures = void 0;
const web3_js_1 = require("@solana/web3.js");
const config_1 = require("./config");
const utils_1 = require("./utils");
const client_1 = require("./client");
const network = config_1.config.rpc;
const transactionSizeLimit = config_1.config.transactionSizeLimit;
async function bringOffset(dataTxid) {
    const txInfo = await (0, client_1.getTransactionInfoOnServer)(dataTxid);
    if (txInfo == undefined) {
        return false;
    }
    return txInfo.offset;
}
async function fetchDataSignatures(address, max = 100) {
    try {
        const DBPDA = new web3_js_1.PublicKey(address);
        const connection = new web3_js_1.Connection(network, 'confirmed');
        const signaturesInfo = await connection.getSignaturesForAddress(DBPDA, {
            limit: max,
        });
        return signaturesInfo.map(info => info.signature);
    }
    catch (error) {
        console.error("Error fetching signatures:", error);
        return [];
    }
}
exports.fetchDataSignatures = fetchDataSignatures;
//we can make code that only bring from blockchain, lets only use getTransactionDataFromBlockchainOnServer
async function readCode(dataTxid) {
    const txInfo = await (0, client_1.getTransactionInfoOnServer)(dataTxid);
    const offset = txInfo.offset;
    const type_field = txInfo.type_field;
    if (type_field) {
        let result = "";
        if ((0, utils_1.isMerkleRoot)(offset)) {
            result = await (0, client_1.getCacheFromServer)(dataTxid, offset);
        }
        else {
            result = await (0, client_1.getTransactionDataFromBlockchainOnServer)(dataTxid);
        }
        return result;
    }
}
exports.readCode = readCode;
async function readChat(dataTxid) {
    const txInfo = await (0, client_1.getTransactionInfoOnServer)(dataTxid);
    const offset = txInfo.offset;
    const type_field = txInfo.type_field;
    const handle = txInfo.handle;
    if (type_field) {
        if (type_field != "group_chat") {
            return;
        }
        let result = "";
        if ((0, utils_1.isMerkleRoot)(offset)) {
            result = await (0, client_1.getCacheFromServer)(dataTxid, offset);
        }
        else {
            result = await (0, client_1.getTransactionDataFromBlockchainOnServer)(dataTxid);
        }
        return handle + ": " + result;
    }
}
async function dataValidation(txid, localData) {
    const chunkList = await (0, utils_1.getChunk)(localData, transactionSizeLimit);
    const merkleRoot = await (0, client_1.makeMerkleRootFromServer)(chunkList);
    const onChainMerkleRoot = await bringOffset(txid);
    console.log("merkleRoot:" + merkleRoot + "," + "onChainMerkleRoot: " + onChainMerkleRoot);
    if (merkleRoot == onChainMerkleRoot) {
        console.log(`Data is same`);
    }
    else {
        console.log(`Data is not same`);
    }
}
exports.dataValidation = dataValidation;
async function fetchLargeFileAndDoCache(txId) {
    let data = await (0, client_1.fetchChunksUntilComplete)(txId);
    console.log(`Raw response for ${txId}:`, data);
    if (!data || data.result.length === 0) {
        console.warn(`warning: empty result for tx ${txId}`);
        return "";
    }
    console.log(data);
    const txInfo = await (0, client_1.getTransactionInfoOnServer)(txId);
    const offset = txInfo.offset;
    const chunks = await (0, utils_1.getChunk)(data.result, transactionSizeLimit);
    //old files inscribed before july size limit is 850
    const result = await (0, client_1.putCacheToServer)(chunks, offset);
    if (result === "Merkle root mismatch") {
        console.warn(`Merkle root mismatch, check your data carefully`);
        //we need to update this for smart fix. allow user inscribe from middle
    }
    return data.result;
}
exports.fetchLargeFileAndDoCache = fetchLargeFileAndDoCache;
async function getChatRecords(pdaString, sizeLimit, onMessage) {
    const connection = new web3_js_1.Connection(network, 'confirmed');
    const chatPDA = new web3_js_1.PublicKey(pdaString);
    try {
        const signatures = await connection.getSignaturesForAddress(chatPDA, {
            limit: sizeLimit,
        });
        if (signatures.length === 0)
            return [];
        const reversedSignatures = signatures.reverse();
        for (const sig of reversedSignatures) {
            try {
                const txDetails = await readChat(sig.signature);
                if (txDetails) {
                    onMessage(txDetails);
                }
            }
            catch (err) {
                console.error(`Failed to read chat for ${sig.signature}:`, err);
            }
        }
    }
    catch (error) {
        console.error('Failed to fetch chat records:', error);
        return [];
    }
}
exports.getChatRecords = getChatRecords;
async function joinChat(pdaString, onMessage) {
    const connection = new web3_js_1.Connection(network, 'finalized');
    const chatPDA = new web3_js_1.PublicKey(pdaString);
    console.log(`Join chat on ${pdaString} ...`); // lets change this as a handle name (chat name)
    connection.onLogs(chatPDA, async (logs, ctx) => {
        const txDetails = await readChat(logs.signature);
        if (txDetails) {
            onMessage(txDetails);
        }
    });
}
exports.joinChat = joinChat;
