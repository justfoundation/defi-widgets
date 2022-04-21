import React, { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { TronWebConnector } from '@widgets/tronweb-connector';
import Menu from '../components/menu';

function App() {
  const [defaultAccount, setDefaultAccount] = useState('');
  const [defaultAccountBalance, setDefaultAccountBalance] = useState('--');
  const [accountsChangedMsg, setAccountsChangedMsg] = useState('');
  
  const trxPrecision = 1e6;

  useEffect(() => {
    if (window.tronWeb?.defaultAddress) {
      initUserInfo(window.tronWeb.defaultAddress.base58);
    }
    setAccountsChangedMsg('');
  }, []);

  const initUserInfo = async (userAddress) => {
    setDefaultAccount(userAddress);
    const accountInfo = await window.tronWeb.trx.getAccount(userAddress);
    const accountBalance = new BigNumber(accountInfo.balance).div(trxPrecision);
    setDefaultAccountBalance(accountBalance);
  };

  const activate = async () => {
    const tronWeb = await TronWebConnector.activate();

    if (tronWeb?.defaultAddress?.base58) {
      initUserInfo(tronWeb.defaultAddress.base58);
    }
  };

  const addListener = () => {
    TronWebConnector.on('accountsChanged', res => {
      if (res.action === 'accountsChanged')
      setDefaultAccount(res.data.address);
      setAccountsChangedMsg(`Current account address is: ${res.data.address}`);
    })
  };

  return (
    <div className="App">
      <Menu />
      <section className="content">
        {defaultAccount ?
          <>
            <div className='info'>
              <div><span>Current account: </span>{defaultAccount}</div>
              <div><span>Current account balance: </span>{defaultAccountBalance.toString()} TRX</div>
            </div>
            
            <div className='items'>
              <div className='item' onClick={() => addListener()} style={{ marginTop: '10px' }}>On accountsChanged</div>
            </div>
          </>
          :
          <div className='items'>
            <div className='item' onClick={() => activate()}>Connect Wallet</div>
          </div>
        }
        {accountsChangedMsg && <div className='msg'>Result message: {accountsChangedMsg}</div>}
      </section>
    </div>
  );
}

export default App;
