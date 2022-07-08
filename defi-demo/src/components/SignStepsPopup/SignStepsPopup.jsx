import React, { useState, useEffect } from 'react';

import classNames from 'classnames';

import { StepStatus } from './constants';

import closeIcon from './assets/close.png'
import completedIcon from './assets/completed.png'
import failedIcon from './assets/failed.png'
import retryIcon from './assets/retry.png'

import './SignStepsPopup.scss';

function SignStepsPopup({shouldShowPopup = false, stepInfoArray = [], onClosePopup, onClickRetry}) {
  const [showRetryButton, setShowRetryButton] = useState(false);
  const [showFinishButton, setShowFinishButton] = useState(false);

  useEffect(() => {
    setShowRetryButton(stepInfoArray.some(step => step.status === StepStatus.Error));
    setShowFinishButton(stepInfoArray.every(step => step.status === StepStatus.Completed));
  }, [stepInfoArray]);

  return (
    <div className={classNames('sign-steps-popup', { 'is-active': shouldShowPopup })}>
      <div className='popup-content'>
          <input
            className='close-button'
            type='image'
            src={closeIcon}
            onClick={onClosePopup}
          />
        <div className='popup-title'>Contract sign steps</div>
        <div className='popup-desc'>Please follow the below steps to mint the token...</div>
        <div className='steps'>
          {
            stepInfoArray.map((info, index) => {
              return (
                <div className={classNames('step', info.status)} key={`step${index}`}>
                  <span className='step-icon'>
                    <span className='step-number'>{index+1}</span>
                    <img className='completed-icon' src={completedIcon} alt='completed' />
                    <img className='failed-icon' src={failedIcon} alt='failed' />
                  </span>
                  <div className='step-title'>{info.title}</div>
                  <span className='status-tail' />
                </div>
              )
            })
          }
        </div>

        <button
          className={classNames('finish-button', {'disabled': !showFinishButton})}
          onClick={onClosePopup}
        >
          Close
        </button>
        <button
          className={classNames('retry-button', {'disabled': !showRetryButton})}
          onClick={onClickRetry}
        >
          <img src={retryIcon} alt='retry' />
          <span>Retry</span>
        </button>
      </div>
    </div>
  );
}

export default SignStepsPopup;