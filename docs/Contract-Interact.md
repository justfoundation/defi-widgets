# Contract Interact


## Introduction
Smart contract is a computerized transaction protocol that automatically implements its terms. Smart contract is the same as common contract, they all define the terms and rules related to the participants. Once the contract is started, it can runs in the way it is designed.

TRON smart contract support Solidity language in (Ethereum). Currently recommend Solidity language version is 0.5.12. Write a smart contract, then build the smart contract and deploy it to TRON network. When the smart contract is triggered, the corresponding function will be executed automatically.

Clients may have to connect their TronLink wallet with the Dapp before triggering contract function.

## Available functions
  1. [trigger](#trigger)
  2. [sign](#sign)
  3. [broadcast](#broadcast)
  4. [send](#send)
  5. [call](#call)
  6. [deploy](#deploy)
  7. [sendTrx](#sendtrx)
  8. [sendToken](#sendtoken)

## Implementation tips
  Clone the repo or copy "~/packages/contract-interact/" and import it as local dependency with the preferred name "@widgets/contract-interact" in package.json.
  ```
    "dependencies": {
      ...
      "@widgets/contract-interact": "file:../packages/contract-interact/",
      ...
    }
  ```

  Import it at the top of your code.
  ```
  import { ContractInteract } from "@widgets/contract-interact";
  ```

  Contract function may require an Tron wallet address as target recipient.
  ```
  const ACCOUNT = "TBHHa5Z6WQ1cRcgUhdvqdW4f728f2fiJmF";
  ```

  Token contract (BTT @ nile testnet).
  ```
  const CONTRACT = "TNuoKL1ni8aoshfFL1ASca1Gou9RXwAzfn";
  ```

  The [ABI](#abi) code example is located at the end of the document.

  All functions are [asynchronous](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) and the await keyword is permitted within it. The return type is [Promise object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

  Check "~/defi-demo/src/routes/contract.js" for real world implementation.

  Check "~/packages/contract-interact/src/index.ts" or "~/packages/contract-interact/dist/index.d.ts" for code source.

## Time to BUIDL!

## trigger
  ### parameters: 
  ```
  (address: any, functionSelector: any, { options, parameters, tronweb }?: {
    options?: {} | undefined;
    parameters?: never[] | undefined;
    tronweb?: {} | undefined;
  })
  ```

  ### example: 
  ```
  const response = await ContractInteract.trigger(
    "TGjgvdTWWrybVLaVeFqSyVqJQWjxqRYbaK", // Decentralized USD (USDD)
    "name()"
  )

  // convert response.constant_result from Hex to ASCII to retrieve string value
  ```

  ### response: 
  ```
  {
    "result": {
        "result": true
    },
    "energy_used": 903,
    "constant_result": [
        "00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000011446563656e7472616c697a656420555344000000000000000000000000000000"
    ],
    "transaction": {
        "ret": [
            {}
        ],
        "visible": false,
        "txID": "034888a1b4492b71189d72dfacacbb75b1a59b339e596d1c0fab679cb4ca167a",
        "raw_data": {
            "contract": [
                {
                    "parameter": {
                        "value": {
                            "data": "06fdde03",
                            "owner_address": "41c4ae90260992e400b449011a49374e6cdc95f67a",
                            "contract_address": "414a3a5dd265bd974b4de0bbe33faa7efb8b7b87e8"
                        },
                        "type_url": "type.googleapis.com/protocol.TriggerSmartContract"
                    },
                    "type": "TriggerSmartContract"
                }
            ],
            "ref_block_bytes": "5f50",
            "ref_block_hash": "6d01101e64239ef7",
            "expiration": 1652860608000,
            "fee_limit": 150000000,
            "timestamp": 1652860548453
        },
        "raw_data_hex": "0a025f5022086d01101e64239ef74080bcadb18d305a6d081f12690a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412340a1541c4ae90260992e400b449011a49374e6cdc95f67a1215414a3a5dd265bd974b4de0bbe33faa7efb8b7b87e8220406fdde0370e5eaa9b18d30900180a3c347"
    }
  }
  ```

## sign
  ### parameters: 
  ```
  (transaction: any, { tronweb }?: { tronweb?: {} | undefined; })
  ```

  ### example: 
  ```
  const { transaction, result } = await window.tronWeb.transactionBuilder.triggerSmartContract(
    CONTRACT,
    "transfer(address,uint256)",
    {
      feeLimit: 1_000_000,
      callValue: 0
    },
    [{
      type: "address",
      value: ACCOUNT
    }, {
      type: "uint256",
      value: 1000000
    }]
  );
  if (!result.result) {
    console.error("error:", result);
    return;
  }

  const response = await window.tronWeb.trx.sign(transaction);
  ```

  ### response: 
  ``` 
  {
    "visible": false,
    "txID": "093e9f4b3ba31c6429fa0b1b22f10281886e6bbe5ecb97bb25c721497c291231",
    "raw_data": {
        "contract": [
            {
                "parameter": {
                    "value": {
                        "data": "a9059cbb0000000000000000000000000e636d680b300214cf10e3343d0eef14f642c8a400000000000000000000000000000000000000000000000000000000000f4240",
                        "owner_address": "41c4ae90260992e400b449011a49374e6cdc95f67a",
                        "contract_address": "418df49db5dbf07e498492d2dafcf7b305cdc72471"
                    },
                    "type_url": "type.googleapis.com/protocol.TriggerSmartContract"
                },
                "type": "TriggerSmartContract"
            }
        ],
        "ref_block_bytes": "6101",
        "ref_block_hash": "1f3cbafca3705dd1",
        "expiration": 1652861919000,
        "fee_limit": 1000000,
        "timestamp": 1652861859565
    },
    "raw_data_hex": "0a02610122081f3cbafca3705dd14098befdb18d305aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a1541c4ae90260992e400b449011a49374e6cdc95f67a1215418df49db5dbf07e498492d2dafcf7b305cdc724712244a9059cbb0000000000000000000000000e636d680b300214cf10e3343d0eef14f642c8a400000000000000000000000000000000000000000000000000000000000f424070ededf9b18d309001c0843d",
    "signature": [
        "5401945088ec48ee611d871fe251756678c487b4b314a8c45306337084ca3ee52975152d64aafcc5438e737f93cd1f03b00df5b208ec91a5371c28d79da352fa00"
    ]
  }
  ```

## broadcast
  ### parameters: 
  ```
  (signedTransaction: any, { tronweb }?: { tronweb?: {} | undefined; })
  ```

  ### example: 
  ```
  const address = "TDqjTkZ63yHB19w2n7vPm2qAkLHwn9fKKk";
  const functionSelector = "approve(address,uint256)";
  const exchangeAddress = "TH1SvdkzHbeN7gYPKhtoDPtFe3V2nj9yVv";
  const MAX_UINT256 = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
  const feeLimitCommon = 400000000;
  const feeLimitMin = 100000000;
  
  const parameters = [
    { type: "address", value: exchangeAddress },
    { type: "uint256", value: MAX_UINT256 }
    ];

  const transaction = await ContractInteract.trigger(
    address,
    functionSelector,
    Object.assign({ feeLimit: feeLimitCommon },{ feeLimit: feeLimitMin }),
    parameters
  );

  if (!transaction.result || !transaction.result.result) {
    throw new Error("Unknown trigger error: " + JSON.stringify(transaction.transaction));
  }

  const signedTransaction = await ContractInteract.sign(transaction.transaction);

  const response = await ContractInteract.broadcast(signedTransaction);
  ```

  ### transaction: 
  ```
  {
    "result": {
        "result": true
    },
    "transaction": {
        "visible": false,
        "txID": "60a8c18dbe622bbdc6c67cd289f012589bd1b71ebbb0826d2834c40b54f12273",
        "raw_data": {
            "contract": [
                {
                    "parameter": {
                        "value": {
                            "data": "095ea7b3",
                            "owner_address": "41c4ae90260992e400b449011a49374e6cdc95f67a",
                            "contract_address": "412a769a33b6ed01a074e4a45bffa0778a27949bec"
                        },
                        "type_url": "type.googleapis.com/protocol.TriggerSmartContract"
                    },
                    "type": "TriggerSmartContract"
                }
            ],
            "ref_block_bytes": "622e",
            "ref_block_hash": "1f79b52388ace764",
            "expiration": 1652862834000,
            "fee_limit": 150000000,
            "timestamp": 1652862775340
        },
        "raw_data_hex": "0a02622e22081f79b52388ace76440d0aab5b28d305a6d081f12690a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412340a1541c4ae90260992e400b449011a49374e6cdc95f67a1215412a769a33b6ed01a074e4a45bffa0778a27949bec2204095ea7b370ace0b1b28d30900180a3c347"
    }
  }
  ```

  ### signedTransaction: 
  ```
  {
    "visible": false,
    "txID": "f80c9c44d2641da98c128b729d1251da8e21c0bc7a55b0def102f5225d21cc63",
    "raw_data": {
        "contract": [
            {
                "parameter": {
                    "value": {
                        "data": "095ea7b3",
                        "owner_address": "41c4ae90260992e400b449011a49374e6cdc95f67a",
                        "contract_address": "412a769a33b6ed01a074e4a45bffa0778a27949bec"
                    },
                    "type_url": "type.googleapis.com/protocol.TriggerSmartContract"
                },
                "type": "TriggerSmartContract"
            }
        ],
        "ref_block_bytes": "622e",
        "ref_block_hash": "1f79b52388ace764",
        "expiration": 1652862834000,
        "fee_limit": 150000000,
        "timestamp": 1652862775617
    },
    "raw_data_hex": "0a02622e22081f79b52388ace76440d0aab5b28d305a6d081f12690a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412340a1541c4ae90260992e400b449011a49374e6cdc95f67a1215412a769a33b6ed01a074e4a45bffa0778a27949bec2204095ea7b370c1e2b1b28d30900180a3c347",
    "signature": [
        "8c5f61d3f68d5f1d52170ecb9c941df9b7a2c4e0be89e1d3cb3e9d6c5ff2edcbf728a5809c3b736f15437aa7b79cd669825f2f58f930ce723bfaa1ef8cebfdb400"
    ]
  }
  ```

  ### response: 
  ```
  {
    "result": true,
    "txid": "f80c9c44d2641da98c128b729d1251da8e21c0bc7a55b0def102f5225d21cc63",
    "transaction": {
        "visible": false,
        "txID": "f80c9c44d2641da98c128b729d1251da8e21c0bc7a55b0def102f5225d21cc63",
        "raw_data": {
            "contract": [
                {
                    "parameter": {
                        "value": {
                            "data": "095ea7b3",
                            "owner_address": "41c4ae90260992e400b449011a49374e6cdc95f67a",
                            "contract_address": "412a769a33b6ed01a074e4a45bffa0778a27949bec"
                        },
                        "type_url": "type.googleapis.com/protocol.TriggerSmartContract"
                    },
                    "type": "TriggerSmartContract"
                }
            ],
            "ref_block_bytes": "622e",
            "ref_block_hash": "1f79b52388ace764",
            "expiration": 1652862834000,
            "fee_limit": 150000000,
            "timestamp": 1652862775617
        },
        "raw_data_hex": "0a02622e22081f79b52388ace76440d0aab5b28d305a6d081f12690a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412340a1541c4ae90260992e400b449011a49374e6cdc95f67a1215412a769a33b6ed01a074e4a45bffa0778a27949bec2204095ea7b370c1e2b1b28d30900180a3c347",
        "signature": [
            "8c5f61d3f68d5f1d52170ecb9c941df9b7a2c4e0be89e1d3cb3e9d6c5ff2edcbf728a5809c3b736f15437aa7b79cd669825f2f58f930ce723bfaa1ef8cebfdb400"
        ]
    }
  }
  ```

## send
  ### parameters: 
  ```
  (address: any, functionSelector: any, { options, parameters, tronweb }?: {
    options?: {} | undefined;
    parameters?: never[] | undefined;
    tronweb?: {} | undefined;
  })
  ```

  ### example: 
  ```
  const response = await ContractInteract.send(
    ACCOUNT,
    "postMessage(string)",
    { parameters: [{ type: "string", value: "Hello" }] }
  );
  ```

  ### response: 
  ```
  {
    "result": true,
    "txid": "75901bee90e7134590c47df2af885e281f251270572328ee258b26a2271dd4f4",
    "transaction": {
        "visible": false,
        "txID": "75901bee90e7134590c47df2af885e281f251270572328ee258b26a2271dd4f4",
        "raw_data": {
            "contract": [
                {
                    "parameter": {
                        "value": {
                            "data": "6630f88f0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000",
                            "owner_address": "41c4ae90260992e400b449011a49374e6cdc95f67a",
                            "contract_address": "41766510af1f0d793718f22de068600089da9af9d0"
                        },
                        "type_url": "type.googleapis.com/protocol.TriggerSmartContract"
                    },
                    "type": "TriggerSmartContract"
                }
            ],
            "ref_block_bytes": "4dd5",
            "ref_block_hash": "bac6a76f7be8c97e",
            "expiration": 1652847045000,
            "fee_limit": 150000000,
            "timestamp": 1652846986508
        },
        "raw_data_hex": "0a024dd52208bac6a76f7be8c97e4088d3f1aa8d305acf01081f12ca010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e74726163741294010a1541c4ae90260992e400b449011a49374e6cdc95f67a121541766510af1f0d793718f22de068600089da9af9d022646630f88f0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000708c8aeeaa8d30900180a3c347",
        "signature": [
            "37185e7e01b1ff00ae1d661af9c51230ff10cfbab33a3ace970116a47783491bc06640705ab3a7311721e9be1f3ecc5d659d27854ef1283ebb8ab2585d382b9000"
        ]
    }
}
```

## call
  ### parameters: 
  ```
  (address: string, _functionSelector: any, { tronweb, abi }?: {
    tronweb?: {} | undefined;
    abi?: never[] | undefined;
  })  
  ```

  ### example: 
  ```
  const response = await call(
    ACCOUNT,
    "getMessage()",
    { abi: funcABIV2.abi }
  );
  ```

  ### response: 
  ```
  {
    "result": "Hello"
  }
  ```

## deploy
  ### parameters: 
  ```
  (options: any, address: string, { callbacks, tronweb }?: {
    callbacks?: (() => void) | undefined;
    tronweb?: {} | undefined;
  })
  ```

  ### example: 
  ```
  const deployOptions = {
    abi: funcABIV2.abi,
    bytecode: funcABIV2.bytecode,
    funcABIV2: funcABIV2.abi[0],
    parametersV2: [1]
  }

  const response = await ContractInteract.deploy(deployOptions);
  ```

  ### response: 
  ```
  {
    "result": true,
    "txid": "54e91f79a5b88e76eb100dcd288bcba1d726912024dd783f12a767123b8fe9dd",
    "transaction": {
        "visible": false,
        "txID": "54e91f79a5b88e76eb100dcd288bcba1d726912024dd783f12a767123b8fe9dd",
        "contract_address": "4194abf50b4cae22905c1d383899d36019b372db35",
        "raw_data": {
            "contract": [
                {
                    "parameter": {
                        "value": {
                            "owner_address": "41c4ae90260992e400b449011a49374e6cdc95f67a",
                            "new_contract": {
                                "bytecode": "608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b506103528061003a6000396000f3006080604052600436106100325763ffffffff60e060020a6000350416636630f88f8114610037578063ce6d41de1461011f575b600080fd5b34801561004357600080fd5b50d3801561005057600080fd5b50d2801561005d57600080fd5b506040805160206004803580820135601f81018490048402850184019095528484526100aa94369492936024939284019190819084018382808284375094975061014e9650505050505050565b6040805160208082528351818301528351919283929083019185019080838360005b838110156100e45781810151838201526020016100cc565b50505050905090810190601f1680156101115780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561012b57600080fd5b50d3801561013857600080fd5b50d2801561014557600080fd5b506100aa6101f7565b805160609061016490600090602085019061028e565b506000805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156101eb5780601f106101c0576101008083540402835291602001916101eb565b820191906000526020600020905b8154815290600101906020018083116101ce57829003601f168201915b50505050509050919050565b60008054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156102835780601f1061025857610100808354040283529160200191610283565b820191906000526020600020905b81548152906001019060200180831161026657829003601f168201915b505050505090505b90565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106102cf57805160ff19168380011785556102fc565b828001600101855582156102fc579182015b828111156102fc5782518255916020019190600101906102e1565b5061030892915061030c565b5090565b61028b91905b8082111561030857600081556001016103125600a165627a7a72305820d8016da0e588b4005857fe9a130eca1a7da6a671e252156ab06e485cc9058bb2002900000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000",
                                "consume_user_resource_percent": 100,
                                "origin_address": "41c4ae90260992e400b449011a49374e6cdc95f67a",
                                "abi": {
                                    "entrys": [
                                        {
                                            "outputs": [
                                                {
                                                    "type": "string"
                                                }
                                            ],
                                            "inputs": [
                                                {
                                                    "name": "value",
                                                    "type": "string"
                                                }
                                            ],
                                            "name": "postMessage",
                                            "stateMutability": "Nonpayable",
                                            "type": "Function"
                                        },
                                        {
                                            "outputs": [
                                                {
                                                    "type": "string"
                                                }
                                            ],
                                            "constant": true,
                                            "name": "getMessage",
                                            "stateMutability": "View",
                                            "type": "Function"
                                        }
                                    ]
                                },
                                "origin_energy_limit": 10000000
                            }
                        },
                        "type_url": "type.googleapis.com/protocol.CreateSmartContract"
                    },
                    "type": "CreateSmartContract"
                }
            ],
            "ref_block_bytes": "4f29",
            "ref_block_hash": "cbdc889b7afcb668",
            "expiration": 1652848077000,
            "fee_limit": 150000000,
            "timestamp": 1652848019189
        },
        "raw_data_hex": "0a024f292208cbdc889b7afcb66840c8d1b0ab8d305a8f09081e128a090a30747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e437265617465536d617274436f6e747261637412d5080a1541c4ae90260992e400b449011a49374e6cdc95f67a12bb080a1541c4ae90260992e400b449011a49374e6cdc95f67a1a4c0a2c1a0b706f73744d657373616765220f120576616c75651a06737472696e672a081a06737472696e67300240030a1c10011a0a6765744d6573736167652a081a06737472696e673002400222cc07608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b506103528061003a6000396000f3006080604052600436106100325763ffffffff60e060020a6000350416636630f88f8114610037578063ce6d41de1461011f575b600080fd5b34801561004357600080fd5b50d3801561005057600080fd5b50d2801561005d57600080fd5b506040805160206004803580820135601f81018490048402850184019095528484526100aa94369492936024939284019190819084018382808284375094975061014e9650505050505050565b6040805160208082528351818301528351919283929083019185019080838360005b838110156100e45781810151838201526020016100cc565b50505050905090810190601f1680156101115780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561012b57600080fd5b50d3801561013857600080fd5b50d2801561014557600080fd5b506100aa6101f7565b805160609061016490600090602085019061028e565b506000805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156101eb5780601f106101c0576101008083540402835291602001916101eb565b820191906000526020600020905b8154815290600101906020018083116101ce57829003601f168201915b50505050509050919050565b60008054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156102835780601f1061025857610100808354040283529160200191610283565b820191906000526020600020905b81548152906001019060200180831161026657829003601f168201915b505050505090505b90565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106102cf57805160ff19168380011785556102fc565b828001600101855582156102fc579182015b828111156102fc5782518255916020019190600101906102e1565b5061030892915061030c565b5090565b61028b91905b8082111561030857600081556001016103125600a165627a7a72305820d8016da0e588b4005857fe9a130eca1a7da6a671e252156ab06e485cc9058bb200290000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000030644080ade20470f58dadab8d30900180a3c347",
        "signature": [
            "be094b056dd6ef725698aa5e89ca9c7e32d2d43ec04d27a290c8d3f0581f754e0cb3c5536c8cef7670ee67e487658cf3d0f2aee3673a9726fd42340c1089227601"
        ]
    }
  }
  ```

## sendTrx
  ### parameters: 
  ```
  (toAddress: string, amount: string | number, fromAddress: string, options: any, { callbacks, tronweb }?: {
    callbacks?: (() => void) | undefined;
    tronweb?: {} | undefined;
  })
  ```

  ### example: 
  ```
  const response = await ContractInteract.sendTrx(
    "TBHHa5Z6WQ1cRcgUhdvqdW4f728f2fiJmF",
    1000000
  );
  ```

  ### response: 
  ```
  {
    "result": true,
    "txid": "1fd5f9483ecdc6a7ae0897d24be14d3de6d43afbe1e4c2ca675fdaa5bb551bf8",
    "transaction": {
        "visible": false,
        "txID": "1fd5f9483ecdc6a7ae0897d24be14d3de6d43afbe1e4c2ca675fdaa5bb551bf8",
        "raw_data": {
            "contract": [
                {
                    "parameter": {
                        "value": {
                            "amount": 1000000,
                            "owner_address": "41c4ae90260992e400b449011a49374e6cdc95f67a",
                            "to_address": "410e636d680b300214cf10e3343d0eef14f642c8a4"
                        },
                        "type_url": "type.googleapis.com/protocol.TransferContract"
                    },
                    "type": "TransferContract"
                }
            ],
            "ref_block_bytes": "5098",
            "ref_block_hash": "ae68369446756cd2",
            "expiration": 1652849190000,
            "timestamp": 1652849132334
        },
        "raw_data_hex": "0a0250982208ae68369446756cd240f0c8f4ab8d305a67080112630a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412320a1541c4ae90260992e400b449011a49374e6cdc95f67a1215410e636d680b300214cf10e3343d0eef14f642c8a418c0843d70ae86f1ab8d30",
        "signature": [
            "1a108d49e226fe184d8dbb7b03f3453ebd07c9ffbcb21a400229668e01c9287190cb7027a884244bc7a790d911f48e98c58ff7eee338554fb618260db5f3f5fe00"
        ]
    }
  }
  ```

## sendToken
  ### parameters: 
  ```
  (address: string, amount: string | number, tokenID: string | number, privateKey: string, { callbacks, tronweb }?: {
    callbacks?: (() => void) | undefined;
    tronweb?: {} | undefined;
  })
  ```

  ### example: 
  ```
  const response = await ContractInteract.sendToken(
    ACCOUNT,
    10000,
    "1000617"
  ); 
  ```

  ### response: 
  ```
  {
    "result": true,
    "txid": "23d404c13f9850ae265cb9cabe83fd34802de60d08830c13b36ec1879fc0bd72",
    "transaction": {
        "visible": false,
        "txID": "23d404c13f9850ae265cb9cabe83fd34802de60d08830c13b36ec1879fc0bd72",
        "raw_data": {
            "contract": [
                {
                    "parameter": {
                        "value": {
                            "amount": 10000,
                            "asset_name": "31303030363137",
                            "owner_address": "41c4ae90260992e400b449011a49374e6cdc95f67a",
                            "to_address": "410e636d680b300214cf10e3343d0eef14f642c8a4"
                        },
                        "type_url": "type.googleapis.com/protocol.TransferAssetContract"
                    },
                    "type": "TransferAssetContract"
                }
            ],
            "ref_block_bytes": "58fd",
            "ref_block_hash": "386870048618a656",
            "expiration": 1652855703000,
            "timestamp": 1652855644792
        },
        "raw_data_hex": "0a0258fd2208386870048618a65640d88b82af8d305a74080212700a32747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e736665724173736574436f6e7472616374123a0a0731303030363137121541c4ae90260992e400b449011a49374e6cdc95f67a1a15410e636d680b300214cf10e3343d0eef14f642c8a420904e70f8c4feae8d30",
        "signature": [
            "d0ea580ccff32bd595e5df2ac82cebdae125ad9f156094b57320e6cfe301d31b9ac53d3179cfb47a27aaa7c6a5037de9334e7da0a58256e6da19e5a7dd42138b00"
        ]
    }
  }
  ```

## ABI
  ```
  const funcABIV2 = {
    "bytecode": "608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b506103528061003a6000396000f3006080604052600436106100325763ffffffff60e060020a6000350416636630f88f8114610037578063ce6d41de1461011f575b600080fd5b34801561004357600080fd5b50d3801561005057600080fd5b50d2801561005d57600080fd5b506040805160206004803580820135601f81018490048402850184019095528484526100aa94369492936024939284019190819084018382808284375094975061014e9650505050505050565b6040805160208082528351818301528351919283929083019185019080838360005b838110156100e45781810151838201526020016100cc565b50505050905090810190601f1680156101115780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561012b57600080fd5b50d3801561013857600080fd5b50d2801561014557600080fd5b506100aa6101f7565b805160609061016490600090602085019061028e565b506000805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156101eb5780601f106101c0576101008083540402835291602001916101eb565b820191906000526020600020905b8154815290600101906020018083116101ce57829003601f168201915b50505050509050919050565b60008054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156102835780601f1061025857610100808354040283529160200191610283565b820191906000526020600020905b81548152906001019060200180831161026657829003601f168201915b505050505090505b90565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106102cf57805160ff19168380011785556102fc565b828001600101855582156102fc579182015b828111156102fc5782518255916020019190600101906102e1565b5061030892915061030c565b5090565b61028b91905b8082111561030857600081556001016103125600a165627a7a72305820d8016da0e588b4005857fe9a130eca1a7da6a671e252156ab06e485cc9058bb20029",
    "name": "HelloWorld",
    "origin_address": "4175f09e51f8ecb695a0be1701581ec9493b164495",
    "abi": [
      {
        "outputs": [
          {
            "type": "string"
          }
        ],
        "inputs": [
          {
            "name": "value",
            "type": "string"
          }
        ],
        "name": "postMessage",
        "stateMutability": "Nonpayable",
        "type": "Function"
      },
      {
        "outputs": [
          {
            "type": "string"
          }
        ],
        "constant": true,
        "name": "getMessage",
        "stateMutability": "View",
        "type": "Function"
      }
    ],
    "origin_energy_limit": 10000000
  }
  ```


reference:

[mozilla](#https://developer.mozilla.org)
