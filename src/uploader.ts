import {config} from "./config";
import {
    getChunk
} from "./utils";

import {
    createCodeInTransactionOnServer,
    createDbCodeTransactionOnserver,
    createDbPingTransactionToWalletOnServer,
    createDbPingTransactionToPDAOnServer,
    makeMerkleRootFromServer,
} from "./client";
import {txSend} from "./transaction";

const transactionSizeLimit = config.transactionSizeLimit; //if you get size error, reduce this 850
async function makeTransactions(chunkList: Array<string>, handle: string, type: string, offset: string) {
    let beforeHash: string = "Genesis";
    let method = 0;
    let decode_break = 0;
    let num = 0;
    for (let text of chunkList) {
        try {
            num++;
            const tx = await createCodeInTransactionOnServer(text, beforeHash, method, decode_break);
            beforeHash = await txSend(tx);
            console.log(num.toString() + '/' + chunkList.length.toString())
        } catch (error) {
            console.error(`Transaction ${num} failed, beforeHash:${beforeHash} `, error);
            let result;
            while (!result) {
                const tx = await createCodeInTransactionOnServer(text, beforeHash, method, decode_break);
                try {
                    beforeHash = await txSend(tx);
                    result = true;
                } catch (e) {
                    result = false;
                }

            }
        }
    }
    const tx = await createDbCodeTransactionOnserver(handle, beforeHash, type, offset); //
    return await txSend(tx);
}

async function makeSendDataTransactionsToWallet(chunkList: Array<string>, handle: string, type: string, offset: string, receiverAddressString: string, sendAmount: number) {
    let beforeHash: string = "Genesis";
    let method = 0;
    let decode_break = 0;
    let num = 0;
    for (let text of chunkList) {
        try {
            num++;
            const tx = await createCodeInTransactionOnServer(text, beforeHash, method, decode_break);
            beforeHash = await txSend(tx);
            console.log(num.toString() + '/' + chunkList.length.toString())
        } catch (error) {
            console.error(`Transaction ${num} failed, beforeHash:${beforeHash} `, error);
            let result;
            while (!result) {
                const tx = await createCodeInTransactionOnServer(text, beforeHash, method, decode_break);
                try {
                    beforeHash = await txSend(tx);
                    result = true;
                } catch (e) {
                    result = false;
                }

            }
        }
    }
    const tx = await createDbPingTransactionToWalletOnServer(receiverAddressString, sendAmount, handle, beforeHash, type, offset); //
    return await txSend(tx);
}
async function makeSendDataTransactionsToPDA(chunkList: Array<string>, handle: string, type: string, offset: string, receiverPDAAddressString: string, sendAmount: number) {
    let beforeHash: string = "Genesis";
    let method = 0;
    let decode_break = 0;
    let num = 0;
    for (let text of chunkList) {
        try {
            num++;
            const tx = await createCodeInTransactionOnServer(text, beforeHash, method, decode_break);
            beforeHash = await txSend(tx);
          //  console.log(num.toString() + '/' + chunkList.length.toString())
        } catch (error) {
           // console.error(`Transaction ${num} failed, beforeHash:${beforeHash} `, error);
            let result;
            while (!result) {
                const tx = await createCodeInTransactionOnServer(text, beforeHash, method, decode_break);
                try {
                    beforeHash = await txSend(tx);
                    result = true;
                } catch (e) {
                    result = false;
                }

            }
        }
    }
    const tx = await createDbPingTransactionToPDAOnServer(receiverPDAAddressString, sendAmount, handle, beforeHash, type, offset); //
    return await txSend(tx);
}

async function makeTransactionsAfterErr(brokeNum: number, beforeHash: string, chunkList: Array<string>, handle: string, type: string, offset: string) {
    let method = 0;
    let decode_break = 0;
    let num = 0;
    let _beforeHash = beforeHash;
    for (let text of chunkList) {
        try {
            num++;
            if (num < brokeNum) {
                console.log(`Transaction ${num} skip, beforeHash:${beforeHash} `);
            } else {
                const tx = await createCodeInTransactionOnServer(text, _beforeHash, method, decode_break);
                _beforeHash = await txSend(tx);
                console.log(num.toString() + '/' + chunkList.length.toString())
            }

        } catch (error) {
            console.error(`Transaction ${num} failed, beforeHash:${beforeHash} `, error);
            break;
        }
    }
    const tx = await createDbCodeTransactionOnserver(handle, beforeHash, type, offset); //
    return await txSend(tx);
}

export async function codeIn(data: string, type: string, handle: string) {
    const chunkList = await getChunk(data, transactionSizeLimit);
    const merkleRoot = await makeMerkleRootFromServer(chunkList);
    console.log("chunkList: ", chunkList);

    console.log("Chunk size: ", chunkList.length + 1);
    return await makeTransactions(chunkList, handle, type, merkleRoot);
}

export async function codeInAfterErr(brokeNum: number, beforeHash: string, data: string, type: string, handle: string) {
    const chunkList = await getChunk(data, transactionSizeLimit);
    const merkleRoot = await makeMerkleRootFromServer(chunkList);
    console.log("chunkList: ", chunkList);

    console.log("Chunk size: ", chunkList.length + 1);
    return await makeTransactionsAfterErr(brokeNum, beforeHash, chunkList, handle, type, merkleRoot);
}

export async function codeToUserWallet(data: string, type: string, handle: string, receiverAddressString: string, sendAmount: number) {
    const chunkList = await getChunk(data, transactionSizeLimit);
    const merkleRoot = await makeMerkleRootFromServer(chunkList);

    return await makeSendDataTransactionsToWallet(chunkList,handle,type,merkleRoot,receiverAddressString,sendAmount);
}
export async function codeToPDA(data: string, type: string, handle: string, pdaAddressString: string, sendAmount: number) {
    const chunkList = await getChunk(data, transactionSizeLimit);
    const merkleRoot = await makeMerkleRootFromServer(chunkList);

    return await makeSendDataTransactionsToPDA(chunkList,handle,type,merkleRoot,pdaAddressString,sendAmount);
}


