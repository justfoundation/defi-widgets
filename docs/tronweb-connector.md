# What is tronweb-connector

tronweb-connector helps dapp to interact with the TRON network via the TronLink Chrome extension. With tronweb-connector, dapp developers will be able to:

- request account information authorization on the dapp
- retrieve the TronLink instance
- listen to TronLink events

# Get Started

### Installation

- `npm i`

### Run

- `npm run start`

### Build

- `npm run build`


# Request user authorization to dapp

Developer can connect TronLink wallet and request user authorization to dapp using the async `activate` method


### Response

| Scenario | Response |
| ----------- | ----------- |
| TronLink not installed | Error response object |
| TronLink installed and the user did not provide authorization before. <br />Authorization box will be shown and the user ACCEPTS the authorization request | TronLink instance |
| TronLink installed and the user did not provide authorization before. <br />Authorization box will be shown and the user REJECTS the authorization request | Error response object |
| TronLink installed and user provided authorization before | TronLink instance |

### Errors

| Error code | Description |
| ----------- | ----------- |
| 4001 | User refuse to authorize |
| 4002 | TronLink not installed |
| 4003 | Unknown error |

### Example

```
const res = await TronwebConnector.activate();

if (res?.defaultAddress?.base58) {
  initUserInfo(res.defaultAddress.base58);
} else if (!res?.success && res?.errorCode && res?.msg) {
  console.log(`${res.msg}(${res.errorCode})`);
} else {
  console.log(`Please install and log in to TronLink first`);
}
```

# Listen to TronLink events

Developer can listen to the TronLink events using the `on` method

### Parameters

| Argument | Description | Type |
| ----------- | ----------- | ----------- | 
| _action | Action name of the event to listen | String |
| cb | Call back function in response to the event | Function |

### Response

| Scenario | Response |
| ----------- | ----------- |
| Successfully added event listener to specified event action | `true` |
| Failed to add event listener | `false` |

### Event action name

| Event action | Description | Version started to support |
| ----------- | ----------- | ----------- |
| tabReply | TronLink initialization complete | 3.0.0 |
| setAccount | when account was set | 3.0.0 |
| setNode | when node was set | 3.0.0 |
| accountsChanged | when switching accounts | 3.22.0 |
| chainChanged | when switching chains | 3.22.0 |
| connectWeb | when the `active connection` dapp is made in the plugin popup page | 3.22.0 |
| acceptWeb | when a user `accepts` an authorization request initiated by dapp in the plugin whitelist authorization page | 3.22.0 |
| disconnectWeb | when the `active reject` dapp is in the plugin popup page | 3.22.0 |
| rejectWeb | when a user `rejects` a dapp initiated authorization request on the plugin whitelist authorization page | 3.22.0 |
| connect | when a user accepts to connects to the dapp on the popup screen | 3.22.1 |
| disconnect | when a user rejects to connect to the dapp on the popup screen | 3.22.1 |

### Example
```
TronwebConnector.on('accountsChanged', res => {
  console.log('TronLink account changed')
})

TronWebConnector.on('chainChanged', res => {
  console.log(`Current account fullnode is ${res.data.node.fullNode}`);
})

TronWebConnector.on('disconnectWeb', res => {
  console.log(`User rejects the authorization request on ${res.data.websiteName}`);
})

TronWebConnector.on('connectWeb', res => {
  console.log(`User accepts the authorization request on ${res.data.websiteName}`);
})
```