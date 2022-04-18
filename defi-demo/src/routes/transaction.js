import { useState, useEffect } from 'react';
import '../App.scss';
import BigNumber from 'bignumber.js';
import { TronWebConnector } from '@widgets/tronweb-connector';
import { ContractInteract } from '@widgets/contract-interact';
import { OpenTransModal, Thing2 } from '@widgets/transaction-confirm';
import { renderToString } from 'react-dom/server'
const { sendTrx } = ContractInteract;

function App() {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [defaultAccountBalance, setDefaultAccountBalance] = useState('--');

  const trxPrecision = 1e6;

  useEffect(() => {
    initTronLinkWallet();
  }, [])

  const initTronLinkWallet = async () => {
    const tronWeb = await TronWebConnector.initTronLinkWallet();

    if (tronWeb?.defaultAddress) {
      setDefaultAccount(tronWeb.defaultAddress.base58);

      const accountInfo = await tronWeb.trx.getAccount(tronWeb.defaultAddress.base58);
      const accountBalance = new BigNumber(accountInfo.balance).div(trxPrecision);
      setDefaultAccountBalance(accountBalance);
    }
  }

  const login = () => {
    TronWebConnector.activate();
  }

  const sendTrxFunc = async () => {
    OpenTransModal({step: 1});
    const res = await sendTrx(
      'TBHHa5Z6WQ1cRcgUhdvqdW4f728f2fiJmF',
      1000000
    );

    if (res?.result) {
      console.log(res); // txid
      OpenTransModal({step: 2 }, {title: 'Send TRX success'});
    } else {
      OpenTransModal({step: 3}, {title: 'Send TRX failed'});
    }
  }

  return (
    <div className="App">
        {defaultAccount ?
          <div className='logged'>
            <div><span style={{ fontSize: '18px' }}>Current account: </span>{defaultAccount}</div>
            <div style={{ marginTop: '10px' }}><span style={{ fontSize: '18px' }}>Current account balance: </span>{defaultAccountBalance.toString()} TRX</div>
            <button onClick={() => sendTrxFunc()}>Send TRX</button>
          </div>
          :
          <button onClick={() => login()}>Connect Wallet</button>
        }
    </div>
  );
}

export default App;
