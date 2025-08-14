
# IQ SDK

This SDK provides a simple interface to inscribe, read, and validate data on-chain using the IQ6900 protocol.

---

##  Features

- **Inscribe data** (`codeIn`, `codeInAfterErr`)
- **Fetch data** (`readCode`, `fetchLargeFileAndDoCache`)
- **Validate local data against on-chain state** (`dataValidation`)
- **Account initialization helper** (`user_init`)

---

## Setup

### Install from GitHub

```bash
npm install https://github.com/IQ6900/code_in_sdk.git
```

---

### Environment variables (`.env`)

Before using the SDK, create a `.env` file at your project root:

```env
SIGNER_PRIVATE_KEY="your_base58_encoded_private_key"
RPC="https://your.solana.rpc.endpoint"
```

---

### Build (only if using source directly)

If you cloned the repository directly:

```bash
npm run build
```

---

## Usage Guide

### Account initialization (required on first use per wallet)

Before writing data for a wallet, you **must initialize the user account** on-chain:

```ts
import iqsdk from 'iq-sdk';

await iqsdk.userInit();
```

---

### Write data to chain

```ts
import iqsdk from 'iq-sdk';


await iqsdk.codeIn("your data here", "manual_datatype", "your_handle");
```

---

### Fetch data from chain

```ts
import iqsdk from 'iq-sdk';

const result = await iqsdk.readCode("your_transaction_id");
```

Or fetch and cache large files:

```ts
import iqsdk from 'iq-sdk';

const content = await iqsdk.fetchLargeFileAndDoCache("your_transaction_id");
```

---

### Validate local data

```ts
import iqsdk from 'iq-sdk';

await iqsdk.dataValidation("transaction_id", "localDataString");
```
