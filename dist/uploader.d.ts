export declare function codeIn(data: string, type: string, handle: string): Promise<string>;
export declare function codeInAfterErr(brokeNum: number, beforeHash: string, data: string, type: string, handle: string): Promise<string>;
export declare function codeToUserWallet(data: string, type: string, handle: string, receiverAddressString: string, sendAmount: number): Promise<string>;
export declare function codeToPDA(data: string, type: string, handle: string, pdaAddressString: string, sendAmount: number): Promise<string>;
