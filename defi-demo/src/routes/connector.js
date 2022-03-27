import { useState, useEffect } from 'react';
import '../App.scss';
import BigNumber from 'bignumber.js';
import { TronWebConnector } from '@widgets/tronweb-connector';

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

  return (
    <div className="App">
      <header className="App-header">
        {defaultAccount ?
          <>
            <div><span style={{ fontSize: '18px' }}>Current account: </span>{defaultAccount}</div>
            <div style={{ marginTop: '10px' }}><span style={{ fontSize: '18px' }}>Current account balance: </span>{defaultAccountBalance.toString()} TRX</div>
          </>
          :
          <button onClick={() => login()}>Connect Wallet</button>
        }
      </header>
    </div>
  );
}

export default App;
