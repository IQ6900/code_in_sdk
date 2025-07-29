"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionDataFromBlockchainOnServer = exports.getTransactionInfoOnServer = exports.putCacheToServer = exports.getCacheFromServer = exports.fetchChunksUntilComplete = exports.makeMerkleRootFromServer = exports.createDbPingTransactionToPDAOnServer = exports.createDbPingTransactionToWalletOnServer = exports.createDbCodeTransactionOnserver = exports.createCodeInTransactionOnServer = exports.createInitTransactionOnServer = exports.createServerInitTransactionOnServer = exports.getServerPDA = exports.getDBPDA = exports.secretKey = exports.secretKeyBase58 = void 0;
const config_1 = require("./config");
const transaction_1 = require("./transaction");
const undici_1 = require("undici");
const web3_js_1 = require("@solana/web3.js");
const bs58 = require('bs58');
const iqHost = config_1.config.iqHost;
exports.secretKeyBase58 = config_1.config.signerPrivateKey; //paste your secret key
exports.secretKey = bs58.decode(exports.secretKeyBase58);
const keypair = web3_js_1.Keypair.fromSecretKey(exports.secretKey);
const userKeyString = keypair.publicKey;
const express = require('express');
const app = express();
app.use(express.json());
async function getDBPDA(userKey) {
    try {
        const response = await (0, undici_1.fetch)(`${iqHost}/getDBPDA/${userKey}`);
        const data = await response.json();
        if (response.ok) {
            return data.DBPDA;
        }
        else {
            throw new Error(data.error || 'Failed to fetch PDA');
        }
    }
    catch (error) {
        console.error('Error fetching PDA:', error);
        return "null";
    }
}
exports.getDBPDA = getDBPDA;
async function getServerPDA(userKey, serverId) {
    try {
        const response = await (0, undici_1.fetch)(`${iqHost}/get-server-pda/${userKey}/${serverId}`);
        const data = await response.json();
        if (response.ok) {
            return data.PDA;
        }
        else {
            throw new Error(data.error || 'Failed to fetch PDA');
        }
    }
    catch (error) {
        console.error('Error fetching PDA:', error);
        return "null";
    }
}
exports.getServerPDA = getServerPDA;
async function createServerInitTransactionOnServer(userKey, serverType, serverID, allowedMerkleRoot = "public") {
    const url = iqHost + '/initialize-server';
    try {
        const requestData = {
            userKey: userKey,
            serverType: serverType,
            serverID: serverID,
            allowedMerkleRoot: allowedMerkleRoot,
        };
        const response = await (0, undici_1.fetch)(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });
        if (response.ok) {
            try {
                const data = await response.json();
                return await (0, transaction_1._translate_transaction)(data.transaction);
            }
            catch (error) {
                console.error('Error creating transaction:', error);
                return null;
            }
        }
    }
    catch (error) {
        console.error('Error creating initTransactionOnServer:', error);
        return null;
    }
}
exports.createServerInitTransactionOnServer = createServerInitTransactionOnServer;
async function createInitTransactionOnServer(userKeyString) {
    try {
        const response = await (0, undici_1.fetch)(iqHost + `/initialize-user/${userKeyString}`);
        if (response.ok) {
            try {
                const responseData = await response.json();
                const data = responseData;
                const tx = await (0, transaction_1._translate_transaction)(data.transaction);
                return tx;
            }
            catch (error) {
                console.error('Error creating transaction:', error);
                return null;
            }
        }
    }
    catch (error) {
        console.error('Error creating initTransactionOnServer:', error);
        return null;
    }
}
exports.createInitTransactionOnServer = createInitTransactionOnServer;
//fetch for upload
async function createCodeInTransactionOnServer(code, before_tx, method, decode_break) {
    const url = iqHost + '/create-send-transaction';
    const requestData = {
        userKeyString,
        code,
        before_tx,
        method,
        decode_break,
    };
    try {
        const response = await (0, undici_1.fetch)(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response}`);
        }
        const data = await response.json();
        return await (0, transaction_1._translate_transaction)(data.transaction);
    }
    catch (error) {
        console.error("Failed to create transaction:", error);
        throw error;
    }
}
exports.createCodeInTransactionOnServer = createCodeInTransactionOnServer;
async function createDbCodeTransactionOnserver(handle, tail_tx, type, offset) {
    const url = iqHost + '/create-db-code-transaction';
    const userKey = keypair.publicKey;
    const userKeyString = userKey.toString();
    const requestData = {
        userKeyString,
        handle,
        tail_tx,
        type,
        offset
    };
    try {
        const response = await (0, undici_1.fetch)(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return (0, transaction_1._translate_transaction)(data.transaction);
    }
    catch (error) {
        console.error("Failed to create transaction:", error);
        throw error;
    }
}
exports.createDbCodeTransactionOnserver = createDbCodeTransactionOnserver;
async function createDbPingTransactionToWalletOnServer(pingWalletAddressString, pingAmount, handle, tail_tx, type, offset) {
    const url = iqHost + '/create-db-ping-transaction-to-wallet';
    const userKey = keypair.publicKey;
    const userKeyString = userKey.toString();
    const requestData = {
        userKeyString: userKeyString,
        pingWalletString: pingWalletAddressString,
        pingAmount: pingAmount,
        handle: handle,
        tail_tx: tail_tx,
        type: type,
        offset: offset
    };
    try {
        const response = await (0, undici_1.fetch)(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return (0, transaction_1._translate_transaction)(data.transaction);
    }
    catch (error) {
        console.error("Failed to create transaction:", error);
        throw error;
    }
}
exports.createDbPingTransactionToWalletOnServer = createDbPingTransactionToWalletOnServer;
async function createDbPingTransactionToPDAOnServer(pingPdaString, pingAmount, handle, tail_tx, type, offset) {
    const url = iqHost + '/create-db-ping-transaction-to-pda';
    const userKey = keypair.publicKey;
    const userKeyString = userKey.toString();
    const requestData = {
        userKeyString: userKeyString,
        pingPdaString: pingPdaString,
        pingAmount: pingAmount,
        handle: handle,
        tail_tx: tail_tx,
        type: type,
        offset: offset
    };
    try {
        const response = await (0, undici_1.fetch)(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return (0, transaction_1._translate_transaction)(data.transaction);
    }
    catch (error) {
        console.error("Failed to create transaction:", error);
        throw error;
    }
}
exports.createDbPingTransactionToPDAOnServer = createDbPingTransactionToPDAOnServer;
async function makeMerkleRootFromServer(dataList) {
    const url = iqHost + "/generate-merkle-root";
    const requestData = {
        data: dataList,
    };
    try {
        const response = await (0, undici_1.fetch)(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.merkleRoot;
    }
    catch (error) {
        console.error("Failed to get Merkle Root:", error);
        throw error;
    }
}
exports.makeMerkleRootFromServer = makeMerkleRootFromServer;
//read functions
async function fetchChunksUntilComplete(txId) {
    let allChunks = [];
    let currentTx = txId;
    let i = 0;
    while (true) {
        console.log("progress:", i);
        i++;
        const url = `${iqHost}/get_transaction_chunks/${currentTx}`; //read transaction by 100 tx read
        const response = await (0, undici_1.fetch)(url);
        const data = await response.json();
        const chars = data.resultStr;
        allChunks.push(chars);
        currentTx = data.beforeTx;
        if (!currentTx || currentTx === "Genesis")
            break;
    }
    const resultReverse = allChunks.reverse();
    const result = resultReverse.join("");
    return { result };
}
exports.fetchChunksUntilComplete = fetchChunksUntilComplete;
async function getCacheFromServer(txId, merkleRoot) {
    const url = `${iqHost}/getCache?txId=${encodeURIComponent(txId)}&merkleRoot=${encodeURIComponent(merkleRoot)}`;
    try {
        const response = await (0, undici_1.fetch)(url);
        if (response.ok) {
            return await response.text();
        }
        else {
            console.error('Error fetching cache data:', response.statusText);
            return "null";
        }
    }
    catch (error) {
        console.error('Request failed:', error);
        return "null";
    }
}
exports.getCacheFromServer = getCacheFromServer;
async function putCacheToServer(chunk, merkleRoot) {
    const url = `${iqHost}/putCache`;
    try {
        const response = await (0, undici_1.fetch)(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chunks: chunk, merkleRoot }),
        });
        const result = await response.text();
        return result;
    }
    catch (error) {
        console.error("Failed to send cache:", error);
        return null;
    }
}
exports.putCacheToServer = putCacheToServer;
async function getTransactionInfoOnServer(txId) {
    try {
        const response = await (0, undici_1.fetch)(iqHost + `/get_transaction_info/${txId}`);
        if (response.ok) {
            try {
                const data = await response.json();
                return data.argData;
            }
            catch (error) {
                console.error('Error creating transaction:', error);
                return null;
            }
        }
    }
    catch (error) {
        console.error('Error creating initTransactionOnServer:', error);
        return null;
    }
}
exports.getTransactionInfoOnServer = getTransactionInfoOnServer;
async function getTransactionDataFromBlockchainOnServer(txId) {
    try {
        const response = await (0, undici_1.fetch)(iqHost + `/get_transaction_result/${txId}`);
        if (response.ok) {
            try {
                return response.text();
            }
            catch (error) {
                console.error("Error getting transaction:", error);
                return null;
            }
        }
        console.error("Error getting transaction:", txId);
        return null;
    }
    catch (error) {
        console.error("Error creating initTransactionOnServer:", error);
        return null;
    }
}
exports.getTransactionDataFromBlockchainOnServer = getTransactionDataFromBlockchainOnServer;
