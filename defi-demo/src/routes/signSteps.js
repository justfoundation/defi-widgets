import { useState, useEffect } from 'react';
import '../App.scss';
import BigNumber from 'bignumber.js';
import { TronWebConnector } from '@widgets/tronweb-connector';
import { SignSteps } from '@widgets/sign-steps';
import Menu from '../components/menu';
const { getStepNumber, executeSignsSimple } = SignSteps;

function App() {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [defaultAccountBalance, setDefaultAccountBalance] = useState('--');
  const [accountsChangedMsg, setAccountsChangedMsg] = useState('');
  const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

  const trxPrecision = 1e6;

  useEffect(() => {
    // @ts-ignore
    if (window.tronWeb?.defaultAddress) {
      // @ts-ignore
      initUserInfo(window.tronWeb.defaultAddress.base58);
      const startStepNumber = getStepNumber();
      // console.log(startStepNumber);
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

  const continuousSign = async () => {
    // @ts-ignore
    const params1 = {
      address: 'TLBaRhANQoJFTqre9Nf1mjuwNWjCJeYqUL', // usdj
      functionSelector: 'approve(address,uint256)',
      parameters: [
        { type: 'address', value: 'TSgZncDVzLq5SbEsCKAeviuG7nPKtJwRzU' },
        { type: 'uint256', value: MAX_UINT256 }
      ],
      options: {},
    }
    const params2 = {
      address: 'TSgZncDVzLq5SbEsCKAeviuG7nPKtJwRzU',
      functionSelector: 'mint(uint256)',
      parameters: [{ type: 'uint256', value: '100' }],
      options: {},
      // callbacks: 
    }
    const stepNumber = await executeSignsSimple([params1, params2]);
    console.log(stepNumber);
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
