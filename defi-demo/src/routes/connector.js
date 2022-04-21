import React, { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { TronWebConnector } from '@widgets/tronweb-connector';
import Menu from '../components/menu';
import { Spin } from 'antd';

function App() {
  const [defaultAccount, setDefaultAccount] = useState('');
  const [defaultAccountBalance, setDefaultAccountBalance] = useState('--');
  const [accountsChangedMsg, setAccountsChangedMsg] = useState('');
  const [loading, setLoading] = useState(false);

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
    setAccountsChangedMsg('');
    setLoading(true);
    const res = await TronWebConnector.activate();
    setLoading(false);
    if (res?.defaultAddress?.base58) {
      initUserInfo(res.defaultAddress.base58);
    } else if (!res?.success && res?.msg) {
      setAccountsChangedMsg(res.msg);
    } else {
      setAccountsChangedMsg(`Please install and log in to tronlink first`);
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
        {accountsChangedMsg && <div className='msg' title={accountsChangedMsg}>Result message: {accountsChangedMsg}</div>}
        <Spin spinning={loading} />
      </section>
    </div>
  );
}

export default App;
