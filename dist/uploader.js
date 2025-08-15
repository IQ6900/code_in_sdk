"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeToPDA = exports.codeToUserWallet = exports.codeInAfterErr = exports.codeIn = void 0;
const config_1 = require("./config");
const utils_1 = require("./utils");
const client_1 = require("./client");
const transaction_1 = require("./transaction");
const transactionSizeLimit = config_1.config.transactionSizeLimit; //if you get size error, reduce this 850
async function makeTransactions(chunkList, handle, type, offset) {
    let beforeHash = "Genesis";
    let method = 0;
    let decode_break = 0;
    let num = 0;
    for (let text of chunkList) {
        try {
            num++;
            const tx = await (0, client_1.createCodeInTransactionOnServer)(text, beforeHash, method, decode_break);
            beforeHash = await (0, transaction_1.txSend)(tx);
            console.log(num.toString() + '/' + chunkList.length.toString());
        }
        catch (error) {
            console.error(`Transaction ${num} failed, beforeHash:${beforeHash} `, error);
            let result;
            while (!result) {
                const tx = await (0, client_1.createCodeInTransactionOnServer)(text, beforeHash, method, decode_break);
                try {
                    beforeHash = await (0, transaction_1.txSend)(tx);
                    result = true;
                }
                catch (e) {
                    result = false;
                }
            }
        }
    }
    const tx = await (0, client_1.createDbCodeTransactionOnserver)(handle, beforeHash, type, offset); //
    return await (0, transaction_1.txSend)(tx);
}
async function makeSendDataTransactionsToWallet(chunkList, handle, type, offset, receiverAddressString, sendAmount) {
    let beforeHash = "Genesis";
    let method = 0;
    let decode_break = 0;
    let num = 0;
    for (let text of chunkList) {
        try {
            num++;
            const tx = await (0, client_1.createCodeInTransactionOnServer)(text, beforeHash, method, decode_break);
            beforeHash = await (0, transaction_1.txSend)(tx);
            console.log(num.toString() + '/' + chunkList.length.toString());
        }
        catch (error) {
            console.error(`Transaction ${num} failed, beforeHash:${beforeHash} `, error);
            let result;
            while (!result) {
                const tx = await (0, client_1.createCodeInTransactionOnServer)(text, beforeHash, method, decode_break);
                try {
                    beforeHash = await (0, transaction_1.txSend)(tx);
                    result = true;
                }
                catch (e) {
                    result = false;
                }
            }
        }
    }
    const tx = await (0, client_1.createDbPingTransactionToWalletOnServer)(receiverAddressString, sendAmount, handle, beforeHash, type, offset); //
    return await (0, transaction_1.txSend)(tx);
}
async function makeSendDataTransactionsToPDA(chunkList, handle, type, offset, receiverPDAAddressString, sendAmount) {
    let beforeHash = "Genesis";
    let method = 0;
    let decode_break = 0;
    let num = 0;
    for (let text of chunkList) {
        try {
            num++;
            const tx = await (0, client_1.createCodeInTransactionOnServer)(text, beforeHash, method, decode_break);
            beforeHash = await (0, transaction_1.txSend)(tx);
            //  console.log(num.toString() + '/' + chunkList.length.toString())
        }
        catch (error) {
            // console.error(`Transaction ${num} failed, beforeHash:${beforeHash} `, error);
            let result;
            while (!result) {
                const tx = await (0, client_1.createCodeInTransactionOnServer)(text, beforeHash, method, decode_break);
                try {
                    beforeHash = await (0, transaction_1.txSend)(tx);
                    result = true;
                }
                catch (e) {
                    result = false;
                }
            }
        }
    }
    const tx = await (0, client_1.createDbPingTransactionToPDAOnServer)(receiverPDAAddressString, sendAmount, handle, beforeHash, type, offset); //
    return await (0, transaction_1.txSend)(tx);
}
async function makeTransactionsAfterErr(brokeNum, beforeHash, chunkList, handle, type, offset) {
    let method = 0;
    let decode_break = 0;
    let num = 0;
    let _beforeHash = beforeHash;
    for (let text of chunkList) {
        try {
            num++;
            if (num < brokeNum) {
                console.log(`Transaction ${num} skip, beforeHash:${beforeHash} `);
            }
            else {
                const tx = await (0, client_1.createCodeInTransactionOnServer)(text, _beforeHash, method, decode_break);
                _beforeHash = await (0, transaction_1.txSend)(tx);
                console.log(num.toString() + '/' + chunkList.length.toString());
            }
        }
        catch (error) {
            console.error(`Transaction ${num} failed, beforeHash:${beforeHash} `, error);
            break;
        }
    }
    const tx = await (0, client_1.createDbCodeTransactionOnserver)(handle, beforeHash, type, offset); //
    return await (0, transaction_1.txSend)(tx);
}
async function codeIn(data, type, handle) {
    const chunkList = await (0, utils_1.getChunk)(data, transactionSizeLimit);
    const merkleRoot = await (0, client_1.makeMerkleRootFromServer)(chunkList);
    console.log("chunkList: ", chunkList);
    console.log("Chunk size: ", chunkList.length + 1);
    return await makeTransactions(chunkList, handle, type, merkleRoot);
}
exports.codeIn = codeIn;
async function codeInAfterErr(brokeNum, beforeHash, data, type, handle) {
    const chunkList = await (0, utils_1.getChunk)(data, transactionSizeLimit);
    const merkleRoot = await (0, client_1.makeMerkleRootFromServer)(chunkList);
    console.log("chunkList: ", chunkList);
    console.log("Chunk size: ", chunkList.length + 1);
    return await makeTransactionsAfterErr(brokeNum, beforeHash, chunkList, handle, type, merkleRoot);
}
exports.codeInAfterErr = codeInAfterErr;
async function codeToUserWallet(data, type, handle, receiverAddressString, sendAmount) {
    const chunkList = await (0, utils_1.getChunk)(data, transactionSizeLimit);
    const merkleRoot = await (0, client_1.makeMerkleRootFromServer)(chunkList);
    return await makeSendDataTransactionsToWallet(chunkList, handle, type, merkleRoot, receiverAddressString, sendAmount);
}
exports.codeToUserWallet = codeToUserWallet;
async function codeToPDA(data, type, handle, pdaAddressString, sendAmount) {
    const chunkList = await (0, utils_1.getChunk)(data, transactionSizeLimit);
    const merkleRoot = await (0, client_1.makeMerkleRootFromServer)(chunkList);
    return await makeSendDataTransactionsToPDA(chunkList, handle, type, merkleRoot, pdaAddressString, sendAmount);
}
exports.codeToPDA = codeToPDA;
