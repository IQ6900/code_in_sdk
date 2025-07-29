export declare const secretKeyBase58: string;
export declare const secretKey: any;
export declare function getDBPDA(userKey: string): Promise<string>;
export declare function getServerPDA(userKey: string, serverId: string): Promise<string>;
export declare function createServerInitTransactionOnServer(userKey: string, serverType: string, serverID: string, allowedMerkleRoot?: string): Promise<any>;
export declare function createInitTransactionOnServer(userKeyString: string): Promise<any>;
export declare function createCodeInTransactionOnServer(code: string, before_tx: string, method: number, decode_break: number): Promise<any>;
export declare function createDbCodeTransactionOnserver(handle: string, tail_tx: string, type: string, offset: string): Promise<any>;
export declare function createDbPingTransactionToWalletOnServer(pingWalletAddressString: string, pingAmount: number, handle: string, tail_tx: string, type: string, offset: string): Promise<any>;
export declare function createDbPingTransactionToPDAOnServer(pingPdaString: string, pingAmount: number, handle: string, tail_tx: string, type: string, offset: string): Promise<any>;
export declare function makeMerkleRootFromServer(dataList: Array<string>): Promise<any>;
export declare function fetchChunksUntilComplete(txId: string): Promise<{
    result: string;
}>;
export declare function getCacheFromServer(txId: string, merkleRoot: string): Promise<string>;
export declare function putCacheToServer(chunk: string[], merkleRoot: string): Promise<string | null>;
export declare function getTransactionInfoOnServer(txId: string): Promise<any>;
export declare function getTransactionDataFromBlockchainOnServer(txId: string): Promise<string | null>;
