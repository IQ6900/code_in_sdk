import {Connection, PublicKey} from "@solana/web3.js";
import {config} from "./config";
import {getChunk, isMerkleRoot} from "./utils";
import {
    fetchChunksUntilComplete,
    getCacheFromServer,
     getTransactionDataFromBlockchainOnServer,
    getTransactionInfoOnServer,
    makeMerkleRootFromServer, putCacheToServer,
} from "./client";



const network = config.rpc;
const transactionSizeLimit = config.transactionSizeLimit;

async function bringOffset(dataTxid: string) {
    const txInfo = await getTransactionInfoOnServer(dataTxid);
    if (txInfo == undefined) {
        return false;
    }

    return txInfo.offset;
}

async function fetchDataSignatures(address: string, max = 475) {

    try {
        const DBPDA = new PublicKey(address);
        const connection = new Connection(network, 'confirmed');
        const signaturesInfo = await connection.getSignaturesForAddress(DBPDA, {
            limit: max,
        });
        return signaturesInfo.map(info => info.signature);

    } catch (error) {
        console.error("Error fetching signatures:", error);
        return [];
    }
}

//we can make code that only bring from blockchain, lets only use getTransactionDataFromBlockchainOnServer
export async function readCode(dataTxid: string) {
    const txInfo = await getTransactionInfoOnServer(dataTxid);
    const offset = txInfo.offset;
    const type_field = txInfo.type_field;

    if (type_field) {
        let result:any = "";
        if (isMerkleRoot(offset)) {
            result = await getCacheFromServer(dataTxid, offset);
        } else {
            result = await getTransactionDataFromBlockchainOnServer(dataTxid);
        }
        return result;
    }
}

export async function dataValidation(txid: string, localData: string) {
    const chunkList = await getChunk(localData, transactionSizeLimit);
    const merkleRoot = await makeMerkleRootFromServer(chunkList);
    const onChainMerkleRoot = await bringOffset(txid);

    console.log("merkleRoot:" + merkleRoot + "," + "onChainMerkleRoot: " + onChainMerkleRoot)

    if (merkleRoot == onChainMerkleRoot) {
        console.log(`Data is same`);
    } else {
        console.log(`Data is not same`);
    }
}

export async function fetchLargeFileAndDoCache(txId: string): Promise<string> {
    let data = await fetchChunksUntilComplete(txId);
    console.log(`Raw response for ${txId}:`, data);
    if (!data || data.result.length === 0) {
        console.warn(`warning: empty result for tx ${txId}`);
        return "";
    }
    console.log(data)
    const txInfo = await getTransactionInfoOnServer(txId);
    const offset = txInfo.offset;
    const chunks = await getChunk(data.result, transactionSizeLimit);
    //old files inscribed before july size limit is 850
    const result = await putCacheToServer(chunks, offset);

    if (result === "Merkle root mismatch") {
        console.warn(`Merkle root mismatch, check your data carefully`);
        //we need to update this for smart fix. allow user inscribe from middle
    }
   return data.result;
}