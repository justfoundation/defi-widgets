import React, { useState, useEffect } from 'react';
import { TokenListProvider } from '@widgets/swap-token-list';
import Menu from '../components/menu';

function App() {
  const [accountsChangedMsg, setAccountsChangedMsg] = useState('');
  useEffect(() => {
    setAccountsChangedMsg('');
  }, []);

  const addDefault = async () => {
    const res = await TokenListProvider.addDefaultTokenList();
    if (res.success) {
      setAccountsChangedMsg('Add default tokenlist success');
    } else {
      setAccountsChangedMsg(res.msg);
    }
  }

  const add = async () => {
    const testUri = `https://raw.githubusercontent.com/BlackChar92/tokenlist/main/testlist.json`;
    const res = await TokenListProvider.addTokenList(testUri);
    if (res.success) {
      setAccountsChangedMsg('Add custom tokenlist success');
    } else {
      setAccountsChangedMsg(res.msg);
    }
  }

  const del = async () => {
    const testUri = `https://raw.githubusercontent.com/BlackChar92/tokenlist/main/testlist.json`;
    const res = await TokenListProvider.deleteTokenList(testUri);
    if (res.success) {
      setAccountsChangedMsg('Delete specified tokenlist success');
    } else {
      setAccountsChangedMsg(res.msg);
    }
  }

  const getFromUri = async () => {
    const testUri = `https://raw.githubusercontent.com/BlackChar92/tokenlist/main/testlist.json`;
    const res = await TokenListProvider.getTokenListFromUri(testUri);
    if (res.success) {
      setAccountsChangedMsg(`Get specified tokenlist from uri success: ${JSON.stringify(res.data)}`);
    } else {
      setAccountsChangedMsg(res.msg);
    }
  }

  const getFromLocal = async () => {
    const res = await TokenListProvider.getTokenListFromLocal();
    if (res.success) {
      setAccountsChangedMsg(`Get all tokenlists from local success: ${JSON.stringify(res.data)}`);
    } else {
      setAccountsChangedMsg(res.msg);
    }
  }

  const updateFromUri = async () => {
    const testUri = `https://raw.githubusercontent.com/BlackChar92/tokenlist/main/testlist.json`;
    const res = await TokenListProvider.updateTokenList(testUri);
    if (res.success) {
      setAccountsChangedMsg(`Update specified tokenlist from uri success: ${JSON.stringify(res.data)}`);
    } else {
      setAccountsChangedMsg(res.msg);
    }
  }

  const getInfo = async () => {
    const res = await TokenListProvider.getUpdateInfo();
    if (res.success) {
      setAccountsChangedMsg(`Get all tokenlist update information success: ${JSON.stringify(res.updateInfo)}`);
    } else {
      setAccountsChangedMsg(res.msg);
    }
  }

  return (
    <div className="App">
      <Menu />
      <section className='content w750'>
        <div className='items'>
          <div className='item' onClick={() => addDefault()}>add default tokenlist</div>
          <div className='item' onClick={() => add()}>add custom tokenlist</div>
        </div>
        <div className='items'>
          <div className='item' onClick={() => del()}>delete specified tokenlist</div>
        </div>
        <div className='items'>
          <div className='item' onClick={() => updateFromUri()}>update specified tokenlist from uri</div>
        </div>
        <div className='items'>
          <div className='item' onClick={() => getFromUri()}>get specified tokenlist from uri</div>
          <div className='item' onClick={() => getFromLocal()}>get specified tokenlist from local</div>
        </div>
        <div className='items'>
          <div className='item' onClick={() => getInfo()}>get all tokenlist update information</div>
        </div>
        {accountsChangedMsg && <div className='msg' title={accountsChangedMsg}>Result message: {accountsChangedMsg}</div>}
      </section>
    </div>
  );
}

export default App;
