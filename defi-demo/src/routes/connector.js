import React, { useState, useEffect } from 'react';
import '../App.scss';
import BigNumber from 'bignumber.js';
import { TronWebConnector } from '@widgets/tronweb-connector';

function App() {
  const [defaultAccount, setDefaultAccount] = useState('');
  const [defaultAccountBalance, setDefaultAccountBalance] = useState('--');

  const trxPrecision = 1e6;

  useEffect(() => {
    if (window.tronWeb?.defaultAccount) {
      setDefaultAccount(window.tronWeb.defaultAddress.base58);
    }
  }, [])

  const activate = async () => {
    const tronWeb = await TronWebConnector.activate();

    if (tronWeb?.defaultAddress) {
      setDefaultAccount(tronWeb.defaultAddress.base58);

      const accountInfo = await tronWeb.trx.getAccount(tronWeb.defaultAddress.base58);
      const accountBalance = new BigNumber(accountInfo.balance).div(trxPrecision);
      setDefaultAccountBalance(accountBalance);
    }
  }

  const addListener = () => {
    TronWebConnector.on('accountsChanged', res => {
      if (res.action === 'accountsChanged')
      console.log('Current account address is: ', res.data.address);
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        {defaultAccount ?
          <>
            <div><span style={{ fontSize: '18px' }}>Current account: </span>{defaultAccount}</div>
            <div style={{ marginTop: '10px' }}><span style={{ fontSize: '18px' }}>Current account balance: </span>{defaultAccountBalance.toString()} TRX</div>
            <div className='item' onClick={() => addListener()} style={{ marginTop: '10px' }}>On accountsChanged</div>
          </>
          :
          <div className='item' onClick={() => activate()}>Connect Wallet</div>
        }
      </header>
    </div>
  );
}

export default App;
