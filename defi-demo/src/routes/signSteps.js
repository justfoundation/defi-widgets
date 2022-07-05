import { useState, useEffect } from 'react';
import '../App.scss';
import BigNumber from 'bignumber.js';
import { TronWebConnector } from '@widgets/tronweb-connector';
import { SignSteps } from '@widgets/sign-steps';
import Menu from '../components/menu';
import { Steps } from 'antd';

const { getStepNumber, executeSignsSimple } = SignSteps;
const { Step } = Steps;

function App() {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [defaultAccountBalance, setDefaultAccountBalance] = useState('--');
  const [hideStepsStatus, setHideStepsStatus] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [stepStatusArray, setStepStatusArray] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
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
    setHideStepsStatus(true);
    setStatusMsg('');
  }, []);

  const initUserInfo = async (userAddress) => {
    setDefaultAccount(userAddress);
    // @ts-ignore
    const accountInfo = await window.tronWeb.trx.getAccount(userAddress);
    const accountBalance = new BigNumber(accountInfo.balance).div(trxPrecision);
    // @ts-ignore
    setDefaultAccountBalance(accountBalance);
  };

  const updateStatusAtStep = (stepNumber, status) => {
    var array = stepStatusArray;
    array[stepNumber-1] = status;
    setStepStatusArray(array);
  };

  const startEventCallback = (stepNumber) => {
    console.log('Start at step ' + stepNumber);

    setCurrentStep(stepNumber-1);
    updateStatusAtStep(stepNumber, 'process');
  };
  const signedEventCallback = (stepNumber) => {
    console.log('Signed at step ' + stepNumber);

    updateStatusAtStep(stepNumber, 'finish');
  };
  const errorEventCallback = (stepNumber) => {
    console.log('Error occurs at step ' + stepNumber);
    
    updateStatusAtStep(stepNumber, 'error');
  };

  const removeSignStepsListeners = () => {
    SignSteps.off('startAtStep', startEventCallback);
    SignSteps.off('signedAtStep', signedEventCallback);
    SignSteps.off('errorAtStep', errorEventCallback);
  }
  const addSignStepsListeners = () => {
    SignSteps.on('startAtStep', startEventCallback);
    SignSteps.on('signedAtStep', signedEventCallback);
    SignSteps.on('errorAtStep', errorEventCallback);
  }

  const activate = async () => {
    const tronWeb = await TronWebConnector.activate();

    if (tronWeb?.defaultAddress?.base58) {
      initUserInfo(tronWeb.defaultAddress.base58);
    }
  };

  const continuousSign = async () => {
    // @ts-ignore
    setCurrentStep(0);
    setHideStepsStatus(false);
    updateStatusAtStep(1, 'wait');
    updateStatusAtStep(2, 'wait');
    setStatusMsg();
    
    removeSignStepsListeners();
    addSignStepsListeners();
    
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
    const response = await executeSignsSimple([params1, params2]);

    setCurrentStep(2);
    if (response.success && response.data && response.data.completedAmount && response.data.completedAmount > 0) {
      console.log('Signed step: ' + response.data.completedAmount);
      setStatusMsg('Completed step: ' + response.data.completedAmount);
    } else {
      setStatusMsg('Failed to complete continuous signature');
    }
  }

  return (
    <div className="App">
      <Menu />
      <section className='content sign-steps'>
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

        <div style={{marginTop: '30px', opacity: hideStepsStatus? 0: 1, transition: 'opacity 0.2s ease-in-out'}}>
          <div style={{marginBottom: '12px'}}>Contract sign steps</div>
          
          <Steps direction="vertical" current={currentStep}>
            <Step title="Approve" description="" status={stepStatusArray[0]} />
            <Step title="Mint" description="" status={stepStatusArray[1]} />
          </Steps>
        </div>

        {statusMsg && <div className='msg' title={statusMsg}>{statusMsg}</div>}
      </section>
    </div>
  );
}

export default App;
