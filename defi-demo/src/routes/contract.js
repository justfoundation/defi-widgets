import { useState, useEffect } from 'react';
import '../App.scss';
import BigNumber from 'bignumber.js';
import { TronWebConnector } from '@widgets/tronweb-connector';
import { ContractInteract } from '@widgets/contract-interact';
const { deploy, send, sendTrx, sendToken, call } = ContractInteract;

function App() {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [defaultAccountBalance, setDefaultAccountBalance] = useState('--');

  const trxPrecision = 1e6;

  useEffect(() => {
    // activate();
  }, [])

  const activate = async () => {
    // const tronWeb = await TronWebConnector.activate();

    // if (tronWeb?.defaultAddress) {
    //   setDefaultAccount(tronWeb.defaultAddress.base58);

    //   const accountInfo = await tronWeb.trx.getAccount(tronWeb.defaultAddress.base58);
    //   const accountBalance = new BigNumber(accountInfo.balance).div(trxPrecision);
    //   setDefaultAccountBalance(accountBalance);
    // }
  }

  const login = () => {
    TronWebConnector.activate();
  }

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

  const deployOptions = {
    abi: funcABIV2.abi,
    bytecode: funcABIV2.bytecode,
    funcABIV2: funcABIV2.abi[0],
    parametersV2: [1]
  }

  const deployContract = async () => {
    const res = await deploy(deployOptions);
    if (res.result) {
      alert('Deploy success');
    }
  }

  const triggerContract = async () => {
    const res = await send(
      'TLmDopsmzmGDpQFyzRp1EDQJ588W7URXdH',
      "postMessage(string)",
      [{ type: 'string', value: 'Hello' }]
    );

    if (res.result) {
      alert('Trigger success');
    }
  }

  const callContract = async () => {
    const res = await call(
      'TLmDopsmzmGDpQFyzRp1EDQJ588W7URXdH',
      "getMessage()"
    );

    if (res?.length) {
      alert('Call success');
    }
  }

  const sendTrxFunc = async () => {
    const res = await sendTrx(
      'TBHHa5Z6WQ1cRcgUhdvqdW4f728f2fiJmF',
      1000000
    );

    if (res?.result) {
      alert('Send TRX success');
    }
  }

  const sendTokenFunc = async () => {
    const res = await sendToken(
      'TBHHa5Z6WQ1cRcgUhdvqdW4f728f2fiJmF',
      10000,
      '1000002'
    );

    if (res?.result) {
      alert('Send 10 Token success');
    }
  }

  return (
    <div className="App">
        {defaultAccount ?
          <div className='logged'>
            <div><span style={{ fontSize: '18px' }}>Current account: </span>{defaultAccount}</div>
            <div style={{ marginTop: '10px' }}><span style={{ fontSize: '18px' }}>Current account balance: </span>{defaultAccountBalance.toString()} TRX</div>
            <button onClick={() => deployContract()}>Deploy Contract</button>
            <button onClick={() => triggerContract()}>Trigger Contract</button>
            <button onClick={() => callContract()}>Call Contract</button>
            <button onClick={() => sendTrxFunc()}>Send TRX</button>
            <button onClick={() => sendTokenFunc()}>Send 10 Token</button>
          </div>
          :
          <button onClick={() => login()}>Connect Wallet</button>
        }
    </div>
  );
}

export default App;
