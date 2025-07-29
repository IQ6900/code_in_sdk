export declare function getMyPublicKey(): import("@solana/web3.js").PublicKey;
export declare function sleep(ms: number): Promise<unknown>;
export declare function naturalSort(files: string[]): string[];
export declare function isMerkleRoot(str: string): boolean;
export declare function getChunk(textData: string, chunkSize: number): Promise<string[]>;
