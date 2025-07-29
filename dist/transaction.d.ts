import { Transaction } from "@solana/web3.js";
export declare function serverInit(serverType: string, serverID: string, allowedMerkleRoot?: string): Promise<string | undefined>;
export declare function userInit(): Promise<string | undefined>;
export declare function pdaCheck(PDA: string): Promise<any>;
export declare function _translate_transaction(data: any): Promise<any>;
export declare function txSend(tx: Transaction): Promise<string>;
