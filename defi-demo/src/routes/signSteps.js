import { useState, useEffect } from 'react';
import '../App.scss';
import BigNumber from 'bignumber.js';
import { TronWebConnector } from '@widgets/tronweb-connector';
import { ContractInteract } from '@widgets/contract-interact';
import { SignSteps } from '@widgets/sign-steps';
import Menu from '../components/menu';
const { send, sendTrx, sendToken } = ContractInteract;
const { getStepNumber, executeSignsSimple } = SignSteps;

function App() {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [defaultAccountBalance, setDefaultAccountBalance] = useState('--');
  const [accountsChangedMsg, setAccountsChangedMsg] = useState('');

  const trxPrecision = 1e6;

  useEffect(() => {
    // @ts-ignore
    if (window.tronWeb?.defaultAddress) {
      // @ts-ignore
      initUserInfo(window.tronWeb.defaultAddress.base58);
      const startStepNumber = getStepNumber();
      console.log(startStepNumber);
    }
    setAccountsChangedMsg('');
  }, []);

  const initUserInfo = async (userAddress) => {
    setDefaultAccount(userAddress);
    // @ts-ignore
    const accountInfo = await window.tronWeb.trx.getAccount(userAddress);
    const accountBalance = new BigNumber(accountInfo.balance).div(trxPrecision);
    // @ts-ignore
    setDefaultAccountBalance(accountBalance);
  };

  const activate = async () => {
    const tronWeb = await TronWebConnector.activate();

    if (tronWeb?.defaultAddress?.base58) {
      initUserInfo(tronWeb.defaultAddress.base58);
    }
  };

  const sendTrxFunc = async () => {
    // @ts-ignore
    const res = await sendTrx(
      'TBHHa5Z6WQ1cRcgUhdvqdW4f728f2fiJmF',
      1000000
    );

    if (res?.result) {
      setAccountsChangedMsg('Send 1 TRX to TBHHa5Z6WQ1cRcgUhdvqdW4f728f2fiJmF success');
    } else {
      setAccountsChangedMsg(res.msg);
    }
  }

  const sendTokenFunc = async () => {
    // @ts-ignore
    const res = await sendToken(
      'TBHHa5Z6WQ1cRcgUhdvqdW4f728f2fiJmF',
      10000,
      '1000617'
    );

    if (res?.result) {
      setAccountsChangedMsg('Send 0.01 TRC10 Token to TBHHa5Z6WQ1cRcgUhdvqdW4f728f2fiJmF success');
    } else {
      setAccountsChangedMsg(res.msg);
    }
  }

  const continuousSign = () => {
    // @ts-ignore
    executeSignsSimple([sendTrxFunc(), sendTokenFunc()]);
  }

  return (
    <div className="App">
      <Menu />
      <section className='content'>
        {defaultAccount ?
          <>
            <div className='info'>
              <div><span>Current account: </span>{defaultAccount}</div>
              <div><span>Current account balance: </span>{defaultAccountBalance.toString()} TRX</div>
            </div>

            <div className='items'>
              <div className='item' onClick={() => continuousSign()}>Continuous Signature</div>
            </div>
          </>
          :
          <div className='items'>
            <div className='item' onClick={() => activate()}>Connect Wallet</div>
          </div>
        }
        {accountsChangedMsg && <div className='msg' title={accountsChangedMsg}>Result message: {accountsChangedMsg}</div>}
      </section>
    </div>
  );
}

export default App;
