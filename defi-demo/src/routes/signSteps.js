import { useState, useEffect, useCallback } from 'react';
import '../App.scss';
import BigNumber from 'bignumber.js';

import { TronWebConnector } from '@widgets/tronweb-connector';
import { SignSteps } from '@widgets/sign-steps';

import Menu from '../components/menu';

import SignStepsPopup from '../components/SignStepsPopup';
import { StepStatus } from '../components/SignStepsPopup/constants';
import { StepInfo } from '../components/SignStepsPopup/StepInfo';

const { executeContinuousSigns, continueCurrentSignSteps } = SignSteps;

function App() {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [defaultAccountBalance, setDefaultAccountBalance] = useState('--');
  const [stepInfoArray, setStepInfoArray] = useState([]);
  const [shouldShowPopup, setShouldShouldPopup] = useState(false);
  const [didFinishAllSteps, setDidFinishAllSteps] = useState(true);

  const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

  const trxPrecision = 1e6;

  useEffect(() => {
    // @ts-ignore
    if (window.tronWeb?.defaultAddress) {
      // @ts-ignore
      initUserInfo(window.tronWeb.defaultAddress.base58);
    }

    setStepInfoArray([StepInfo('Approve'), StepInfo('Mint')]);
    setDidFinishAllSteps(true);
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

  const updateStatusAtStep = (stepNumber, status) => {
    var array = [...stepInfoArray];
    array[stepNumber-1].status = status;
    setStepInfoArray(array);
  };
  
  const startEventCallback = useCallback((stepNumber) => {
    console.log('signSteps Demo || Started step ' + stepNumber);
    updateStatusAtStep(stepNumber, StepStatus.Active);
  });
  const signedEventCallback = useCallback((stepNumber) => {
    console.log('signSteps Demo || Signed at step ' + stepNumber);
    updateStatusAtStep(stepNumber, StepStatus.Completed);
  });
  const errorEventCallback = useCallback((stepNumber, errorMsg) => {
    console.log('signSteps Demo || Error occurs at step ' + stepNumber + ' (' + errorMsg + ')');
    updateStatusAtStep(stepNumber, StepStatus.Error);
  });
  const completedAllStepsCallback = useCallback(() => {
    console.log('signSteps Demo || Finished all steps');
    setDidFinishAllSteps(true);
    removeSignStepsListeners();
  });

  const removeSignStepsListeners = () => {
    SignSteps.off('startAtStep', startEventCallback);
    SignSteps.off('signedAtStep', signedEventCallback);
    SignSteps.off('errorAtStep', errorEventCallback);
    SignSteps.off('completedAllSteps', completedAllStepsCallback);
  }
  const addSignStepsListeners = () => {
    SignSteps.on('startAtStep', startEventCallback);
    SignSteps.on('signedAtStep', signedEventCallback);
    SignSteps.on('errorAtStep', errorEventCallback);
    SignSteps.on('completedAllSteps', completedAllStepsCallback);
  }

  const continuousSign = async () => {
    setShouldShouldPopup(true);

    if (didFinishAllSteps) {
      setDidFinishAllSteps(false);
      addSignStepsListeners();
      updateStatusAtStep(1, StepStatus.Pending);
      updateStatusAtStep(2, StepStatus.Pending);
      
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
      executeContinuousSigns([params1, params2]);
    }
  }

  const onClickStepRetry = () => {
    continueCurrentSignSteps();
  }

  const closePopup = () => {
    setShouldShouldPopup(false);
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
        <SignStepsPopup 
          shouldShowPopup={shouldShowPopup}
          stepInfoArray={stepInfoArray}
          onClickRetry={onClickStepRetry}
          onClosePopup={closePopup}
        />
      </section>
    </div>
  );
}

export default App;
