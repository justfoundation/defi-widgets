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
  const [added, setAdded] = useState(false);

  const trxPrecision = 1e6;

  useEffect(() => {
    if (window.tronWeb?.defaultAddress) {
      initUserInfo(window.tronWeb.defaultAddress.base58);
    }
    setAccountsChangedMsg('');
    setLoading(false);
    setAdded(false);
  }, []);

  const initUserInfo = async (userAddress) => {
    setDefaultAccount(userAddress);
    updateAccountBalance(userAddress);
  };

  const resetDefaultAccount = () => {
    setDefaultAccount('');
    setDefaultAccountBalance('--');
  };

  const updateAccountBalance = async (userAddress) => {
    const accountInfo = await window.tronWeb.trx.getAccount(userAddress? userAddress: defaultAccount);
    if (accountInfo.balance) {
      const accountBalance = new BigNumber(accountInfo.balance).div(trxPrecision);
      setDefaultAccountBalance(accountBalance);
    } else {
      const accountBalance = new BigNumber(accountInfo.balance).div(trxPrecision);
      setDefaultAccountBalance('0');
    }
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
    setAdded(true);
    TronWebConnector.on('accountsChanged', res => {
      setDefaultAccount(res.data.address);
      setAccountsChangedMsg(`Current account address is: ${res.data.address}`);
    })

    TronWebConnector.on('chainChanged', res => {
      setAccountsChangedMsg(`Current account fullNode is: ${res.data.node.fullNode}`);
      updateAccountBalance();
    })

    TronWebConnector.on('disconnectWeb', res => {
      setAccountsChangedMsg(`disconnect website name: ${res.data.websiteName}`);
      resetDefaultAccount();
    })

    TronWebConnector.on('connectWeb', res => {
      setAccountsChangedMsg(`connect website name: ${res.data.websiteName}`);
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
              <div className='item' onClick={() => addListener()} >addListeners</div>
              {added && <div className="desc">{'added!'}</div>}
            </div>
            <div className='desc'>Such as accountsChanged, setAccount, setNode, disconnectWeb, connectWeb</div>
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
