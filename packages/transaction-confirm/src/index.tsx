import React from 'react';
import { Loading3QuartersOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { renderToString } from 'react-dom/server';
import styled, { keyframes } from 'styled-components';

interface CustomObjType {
  title?: string;
  wait_confirm?: string;
  lang?: string;
  confirm_wallet?: string;
  submitted?: string;
  view_on_tronscan?: string;
  cancelled?: string;
}

export const OpenTransModal = async (stepInfo = { step: 0, txId: '' }, customObj: CustomObjType = {}, tronweb = null) => {
  const { step, txId } = stepInfo;

  if (!step) return;

  const tronWeb = tronweb || (window as any).tronWeb;
  const res = await tronWeb.fullNode;
  const { host } = res;
  const trongridNode = host === 'https://api.trongrid.io';

  const TransMask: any = styled.div`
    position: fixed;
    inset: 0;
    z-index: 1000;
    height: 100%;
    background-color: #00000073
  `

  const TransContent: any = styled.div`
    position: fixed;
    inset: 0;
    overflow: auto;
    outline: 0;
    z-index: 1000;
  `

  const TransBody: any = styled.div`
    padding: 24px;
    font-size: 14px;
    line-height: 1.5715;
    word-wrap: break-word;
    background-color: #fff;
    width: 320px;
    display: flex;
    margin: auto;
    flex-direction: column;
    align-items: center;
    transform: translateY(50%);
  `

  const TransTitle: any = styled.div`
    font-size: 16px
  `

  const BounceAnimation = keyframes`
    0% {
      transform: rotate(0deg)
    }
    50% {
      transform: rotate(180deg)
    }
    100% {
      transform: rotate(360deg)
    }
  `

  const Loading: any = styled.div`
    font-size: 80px;
    animation: ${BounceAnimation} 2s linear infinite;
    transform-origin: center;
  `

  const modalContent = <div className="trans-modal-container">
    <TransMask className="trans-modal-mask" />
    <TransContent className="trans-modal-content">
      <TransBody className="trans-modal-body">
        <TransTitle className="trans-modal-title">{customObj?.title ? customObj?.title : customObj?.lang === 'zh' ? '交易' : 'Transaction'}</TransTitle>
        {step == 1 ? (
          <React.Fragment>
            <Loading className="trans-modal-icon">
              <Loading3QuartersOutlined />
            </Loading>
            <div className="trans-modal-status trans-modal-wait-confirm">{
              customObj.wait_confirm ? customObj.wait_confirm : customObj?.lang === 'zh' ? '等待您的确认' : 'Waiting for your confirmation'
            }</div>
            <div className="trans-modal-tips trans-modal-wait-confirm-tips">{
              customObj.confirm_wallet ? customObj.confirm_wallet : customObj?.lang === 'zh' ? '请在您的钱包中确认' : 'Please confirm in your wallet'
            }</div>
          </React.Fragment>
        ) : null}
        {step == 2 ? (
          <React.Fragment>
            <div className="trans-modal-icon">
              <CheckCircleOutlined style={{ fontSize: '80px' }}></CheckCircleOutlined>
            </div>
            <div className="trans-modal-status trans-modal-submit">{customObj.submitted ? customObj.submitted : customObj?.lang === 'zh' ? '交易已提交' : 'Transaction Submitted'}</div>
            <div className="trans-modal-tips trans-modal-submit-tips">
              <a
                className="typo-text-link"
                href={`${trongridNode ?'https://tronscan.io/#' : 'https://nile.tronscan.io/#'}/transaction/${txId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {customObj.view_on_tronscan ? customObj.view_on_tronscan : customObj?.lang === 'zh' ? '在 TRONSCAN 上查看' : 'View on TRONSCAN'}
              </a>
            </div>
          </React.Fragment>
        ) : null}
        {step == 3 ? (
          <React.Fragment>
            <div className="trans-modal-icon">
              <CloseCircleOutlined style={{ fontSize: '80px' }}></CloseCircleOutlined>
            </div>
            <div className="trans-modal-status trans-modal-cancel">{customObj.cancelled ? customObj.cancelled : customObj?.lang === 'zh' ? '交易已取消' : 'Transaction Cancelled'}</div>
          </React.Fragment>
        ) : null}
      </TransBody>
    </TransContent>
  </div>;

  const container = document.createElement('div');
  container.innerHTML = renderToString(modalContent);
  document.body.appendChild(container);
}

export const setTransactionsData = (tx: string, customObj: any, tronweb: any) => {
  try {
    const tronWeb = tronweb || (window as any).tronWeb;
    if (!tronWeb.defaultAddress) return;
    let data = window.localStorage.getItem(`dw-${tronWeb.defaultAddress.base58}`) || '[]';
    let dataArr = JSON.parse(data);
    let item = {
      title: '', // compatible
      customObj,
      tx,
      status: 1, // 1: pending, 2: confirmed, 3: failed
      checkCnt: 0,
      showPending: true
    };
    dataArr.unshift(item);
    window.localStorage.setItem(`${tronWeb.defaultAddress.base58}_transaction`, JSON.stringify(dataArr.slice(0, 10)));
  } catch (error) {
    console.log(error);
  }
};
