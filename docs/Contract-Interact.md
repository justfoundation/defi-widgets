# Contract-Interact


## Introduction
Smart contract is a computerized transaction protocol that automatically implements its terms. Smart contract is the same as common contract, they all define the terms and rules related to the participants. Once the contract is started, it can runs in the way it is designed.

TRON smart contract support Solidity language in (Ethereum). Currently recommend Solidity language version is 0.5.12. Write a smart contract, then build the smart contract and deploy it to TRON network. When the smart contract is triggered, the corresponding function will be executed automatically.

Clients may have to connect their TronLink wallet with the Dapp before triggering contract function.

## Example
- copy and import "~/packages/contract-interact/ as "@widgets/contract-interact" in package.json

```
    "dependencies": {
      ...
      "@widgets/contract-interact": "file:../packages/contract-interact/",
      ...
    }
```

- Import and execute function
```
    import { ContractInteract } from '@widgets/contract-interact';

    const res = await ContractInteract.sendTrx(
      'TBHHa5Z6WQ1cRcgUhdvqdW4f728f2fiJmF',
      1000000
    );
```

## Available functions
1. trigger
2. sign
3. broadCast
4. send
5. call
6. deploy
7. sendTrx
8. sendToken

For more examples, check "~/defi-demo/src/routes/contracts.js"

For the specific parameters of each function, check "~/packages/contract-interact/dist/index.d.ts"
