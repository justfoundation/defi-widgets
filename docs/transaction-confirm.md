# What is transaction-confirm

transaction-confirm helps dapp to handle the event of newly created transactions. With transaction-confirm, dapp developers will be able to:

- save and update transaction detail in browser's local storage
- display transaction confirm status on the transaction modal
- display notification message if transaction's status was changed

# Get Started

### Installation

- `npm i`

### Run

- `npm run start`

### Build

- `npm run build`

# Display the transaction modal

Developer can display the transaction modal using the `openTransModal` method

### Request Parameters

| Argument | Description | Type |
| ----------- | ----------- | ----------- | 
| stepInfo | Display settings for the modal | object |
| customObj | Additional configuration of the modal | object |

### stepInfo object

| Argument | Description | Type |
| ----------- | ----------- | ----------- | 
| step | 1: Waiting for customer response<br/> 2: Transaction accepted<br/> 3: Transaction rejected | int |
| txId | Transaction id of the transaction(if any) | string |

### customObj object

| Argument | Description | Type |
| ----------- | ----------- | ----------- | 
| title | Modal title | string |
| lang | Language of modal content: en/zh | string |
| wait_confirm | Custom message for the waiting for confirmation scenario | string |
| confirm_wallet | Custom message to ask customer to confirm the transaction in the wallet  | string |
| submitted | Custom message for the transaction submitted scenario | string |
| view_on_tronscan | Custom message for the tronscan link  | string |
| cancelled | Custom message for the transaction cancelled scenario | string |

### Example

```
openTransModal({step: 2, txId: 'xxxxxx'}, {title: 'Send TRX success'});
```

# Add new transaction to the pending transaction list

Developer can save a new transaction to the pending transaction list in the browser's local storage using `addNewTransactionToList` method

### Request Parameters

| Argument | Description | Type |
| ----------- | ----------- | ----------- | 
| tx | The transaction object returned from tronweb | object |
| customObj | Custom data to be saved with the transaction in the pending transaciton list | object |
| saveAmount | Maximum | object |
| tronweb | Tronweb instance | object |

### Example

```
const tx = await sendTrx(
  'TBHHa5Z6WQ1cRcgUhdvqdW4f728f2fiJmF',
  1000000
);

addNewTransactionToList(tx, {title: 'Send 1 TRX to somewhere'}, 10);
```

# Update an existing transaction in the pending transaction list

Developer can update the content of an existing transaction stored in the pending transaction list using `updateTransactionInList` method

### Request Parameters

| Argument | Description | Type |
| ----------- | ----------- | ----------- | 
| record | The transaction object to be updated | object |
| tronweb | Tronweb instance | object |

### Example

```
// Update transaction content
transaction.showPending = false

// And save to the pending transaction list
updateTransactionInList(transaction)
```


# Update transaction status and display notification message

Developer can update the status of an existing transaction and display the notification message using `logTransaction` method

### Request Parameters

| Argument | Description | Type |
| ----------- | ----------- | ----------- | 
| record | Transaction object to be updated | object |
| status | New status: 1/2/3 | int |
| lang | Language of the notifaction message content | string |

### Example

```
logTransaction(transaction, 2)
```

# Get transaction description content

Developer can get the transaction description dom object using the `getDescription` method

### Request Parameters

| Argument | Description | Type |
| ----------- | ----------- | ----------- | 
| type | Transaction status value | int |
| item | Transaction object | object |
| text | The status text display on the dom object | string |

### Response

The dom object

```
<div class="transaction_notify__nhkKG">
  <span>
    <a href="https://tronscan.io/#/transaction/xxxx" target="_blank">
      View on TRONSCAN
    </a>
    <a>
      Pending
    </a>
  </span>
  <span class="trans-btn-tip">
    Pending
  </span>
</div>
```

### Example

```
getDescription(status, item, description)
```

# Get transaction info

Developer can get the latest status of a transaction using `getTransactionInfo` method
<br />This method uses tronWeb.trx.getConfirmedTransaction

### Request Parameters

| Argument | Description | Type |
| ----------- | ----------- | ----------- | 
| txid | Transaction id | string |
| tronweb | Tronweb instance | object |

### Response

The promise of tronWeb.trx.getConfirmedTransaction response

### Example

```
getTransactionInfo(xxxxxx)
  .then(response => {
    console.log(response)
  })
```

# Check the status of each pending transaction in the transaction list

`checkPendingTransaction` will retrieve the pending transaction list from the browser's local storage, and use `getTransactionInfo` to check the latest status of each pending transaction. If the status was updated, call `logTransaction` to update and save the transaction.

### Request Parameters

| Argument | Description | Type |
| ----------- | ----------- | ----------- |
| tronweb | Tronweb instance | object |

### Example

```
checkPendingTransactions()
```

# Constantly check the status of each pending transactions

Developer can start the job to constantly check the status of each transaction in the pending transaction list using `startPendingTransactionCheck` call

### Request Parameters

| Argument | Description | Type |
| ----------- | ----------- | ----------- |
| milliseconds | The interval of each `checkPendingTransaction` call | number |
| tronweb | Tronweb instance | object |

### Example

```
startPendingTransactionCheck(3000)
```
