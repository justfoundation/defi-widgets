import React from 'react';
import '../App.scss';
import { TokenListProvider } from '@widgets/swap-token-list';

function App() {
  const addDefault = async () => {
    const res = await TokenListProvider.addDefaultTokenList();
    console.log(res);
    if (res.success) {
      console.log('add default tokenlist success');
    } else {
      console.log('error message: ', res.msg);
    }
  }

  const add = async () => {
    const testUri = `https://raw.githubusercontent.com/BlackChar92/tokenlist/main/testlist.json`;
    const res = await TokenListProvider.addTokenList(testUri);
    if (res.success) {
      console.log('add custom tokenlist success');
    } else {
      console.log('error message: ', res.msg);
    }
  }

  const del = async () => {
    const testUri = `https://raw.githubusercontent.com/BlackChar92/tokenlist/main/testlist.json`;
    const res = await TokenListProvider.deleteTokenList(testUri);
    if (res.success) {
      console.log('delete specified tokenlist success');
    } else {
      console.log('error message: ', res.msg);
    }
  }

  const getFromUri = async () => {
    const testUri = `https://raw.githubusercontent.com/BlackChar92/tokenlist/main/testlist.json`;
    const res = await TokenListProvider.getTokenListFromUri(testUri);
    if (res.success) {
      console.log('get specified tokenlist from uri success: ', res.data);
    } else {
      console.log('error message: ', res.msg);
    }
  }

  const getFromLocal = async () => {
    const res = await TokenListProvider.getTokenListFromLocal();
    if (res.success) {
      console.log('get all tokenlists from local success: ', res.data);
    } else {
      console.log('error message: ', res.msg);
    }
  }

  const updateFromUri = async () => {
    const testUri = `https://raw.githubusercontent.com/BlackChar92/tokenlist/main/testlist.json`;
    const res = await TokenListProvider.updateTokenList(testUri);
    if (res.success) {
      console.log('update specified tokenlist from uri success: ', res.data);
    } else {
      console.log('error message: ', res.msg);
    }
  }

  const getInfo = async () => {
    const res = await TokenListProvider.getUpdateInfo();
    if (res.success) {
      console.log('get all tokenlist update information success: ', res.updateInfo);
    } else {
      console.log('error message: ', res.msg);
    }
  }

  return (
    <div className="App">
        <button onClick={() => addDefault()}>add default tokenlist</button>
        <button onClick={() => add()}>add custom tokenlist</button>
        <button onClick={() => del()}>delete specified tokenlist</button>
        <button onClick={() => getFromUri()}>get specified tokenlist from uri</button>
        <button onClick={() => getFromLocal()}>get specified tokenlist from local</button>
        <button onClick={() => updateFromUri()}>update specified tokenlist from uri</button>
        <button onClick={() => getInfo()}>get all tokenlist update information</button>
    </div>
  );
}

export default App;
