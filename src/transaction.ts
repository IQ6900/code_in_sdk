import {createInitTransactionOnServer} from "./client";
import buffer from "buffer";
import {Connection, Keypair, Transaction} from "@solana/web3.js";

import {config} from "./config";
import anchor from "@coral-xyz/anchor";
const network = config.rpc!
const web3 = anchor.web3;
const keypair = config.keypair;

export async function user_init() {
    const userKey = keypair.publicKey;
    const useKeyString = userKey.toString()
    const transaction = await createInitTransactionOnServer(useKeyString)
    if (transaction != null) {
        await txSend(transaction)

    } else {
        console.error("Transaction build failed");
    }
}

export async function _translate_transaction(data: any) {
    const transaction = new web3.Transaction();
    const connection = new web3.Connection(network);
    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.feePayer = new web3.PublicKey(data.feePayer);

    data.instructions.forEach((instr: any) => {
        const instruction = new web3.TransactionInstruction({
            keys: instr.keys.map((key: any) => ({
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
export async function txSend(tx: Transaction): Promise<string> {
    let connection = new Connection(network, 'confirmed');
    let blockHash = await connection.getLatestBlockhash();
    while (blockHash == undefined) {
        connection = new Connection(network, 'confirmed');
        blockHash = await connection.getLatestBlockhash();
    }
    tx.recentBlockhash = blockHash.blockhash;
    tx.lastValidBlockHeight = blockHash.lastValidBlockHeight;
    tx.feePayer = keypair.publicKey;
    tx.sign(keypair);

    const txid = await web3.sendAndConfirmTransaction(connection, tx, [keypair]);
    if (txid == undefined) {
        return "null";
    } else {
        console.log('Transaction sent, txid:', txid);
        return txid;
    }
}