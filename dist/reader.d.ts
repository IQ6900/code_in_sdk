export declare function fetchDataSignatures(address: string, max?: number): Promise<string[]>;
export declare function readCode(dataTxid: string): Promise<any>;
export declare function dataValidation(txid: string, localData: string): Promise<void>;
export declare function fetchLargeFileAndDoCache(txId: string): Promise<string>;
export declare function getChatRecords(pdaString: string, sizeLimit: number, onMessage: (msg: string) => void): Promise<never[] | undefined>;
export declare function joinChat(pdaString: string, onMessage: (msg: string) => void): Promise<void>;
