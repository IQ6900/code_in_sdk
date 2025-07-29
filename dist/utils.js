"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChunk = exports.isMerkleRoot = exports.naturalSort = exports.sleep = exports.getMyPublicKey = void 0;
const config_1 = require("./config");
const keypair = config_1.config.keypair;
function getMyPublicKey() {
    return keypair.publicKey;
}
exports.getMyPublicKey = getMyPublicKey;
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
function naturalSort(files) {
    return files.sort((a, b) => {
        const aMatch = a.match(/\d+/);
        const bMatch = b.match(/\d+/);
        const aNum = aMatch ? parseInt(aMatch[0], 10) : 0;
        const bNum = bMatch ? parseInt(bMatch[0], 10) : 0;
        return aNum - bNum || a.localeCompare(b);
    });
}
exports.naturalSort = naturalSort;
function isMerkleRoot(str) {
    const base58Alphabet = /^[1-9A-HJ-NP-Za-km-z]+$/;
    return base58Alphabet.test(str) && str.length === 44;
}
exports.isMerkleRoot = isMerkleRoot;
async function getChunk(textData, chunkSize) {
    const datalength = textData.length;
    const totalChunks = Math.ceil(datalength / chunkSize);
    let chunks = [];
    for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, datalength);
        await chunks.push(textData.slice(start, end));
    }
    if (chunks.length < 1) {
        return ["null"];
    }
    else {
        return chunks;
    }
}
exports.getChunk = getChunk;
