import React from 'react';
import {
  Loading3QuartersOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { renderToString } from 'react-dom/server';
import styled, { keyframes } from 'styled-components';
import styles from './assets/css/transaction.scss';

interface CustomObjType {
  title?: string;
  wait_confirm?: string;
  lang?: string;
  confirm_wallet?: string;
  submitted?: string;
  view_on_tronscan?: string;
  cancelled?: string;
}

export const OpenTransModal = async (
  stepInfo = { step: 0, txId: '' },
  customObj: CustomObjType = {},
) => {
  const tronscanLink = 'https://tronscan.io/#';
  const { step, txId } = stepInfo;

  if (!step) return;

  const TransContent: any = styled.div`
    position: fixed;
    inset: 0;
    overflow: auto;
    outline: 0;
    z-index: 1000;
  `;

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
    position: relative;
    border-radius: 15px;
    color: rgba(0, 0, 0, 0.85);
    box-shadow: 0 20px 40px hsl(0deg 0% 58% / 6%);
    font-size: 14px;
  `;

  const TransTitle: any = styled.div`
    font-size: 14px;
  `;

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
  `;

  const Loading: any = styled.div`
    margin: 15px 0;
    animation: ${BounceAnimation} 2s linear infinite;
  `;

  const Close: any = styled.div`
    position: absolute;
    width: 20px;
    height: 20px;
    right: 15px;
    top: 15px;
    cursor: pointer;
  `;

  const intlZh = {
    transaction: '交易',
    waiting: '等待您的确认',
    confirm: '请在您的钱包中确认',
    submited: '交易已提交',
    tronscan: '在 TRONSCAN 上查看',
    cancelled: '交易已取消',
  };

  const intlEn = {
    transaction: 'Transaction',
    waiting: 'Waiting for your confirmation',
    confirm: 'Please confirm in your wallet',
    submited: 'Transaction Submitted',
    tronscan: 'View on TRONSCAN',
    cancelled: 'Transaction Cancelled',
  };

  const intl = customObj?.lang === 'zh' ? intlZh : intlEn;

  const modalContent = (
    <div className={styles.transModalContainer}>
      <div className={styles.transModalMask} ></div>
      <TransContent className="trans-modal-content">
        <TransBody className="trans-modal-body">
          <TransTitle className="trans-modal-title">
            {customObj?.title ? customObj?.title : intl.transaction}
          </TransTitle>
          {step == 1 ? (
            <React.Fragment>
              <Loading className="trans-modal-icon">
                <Loading3QuartersOutlined
                  style={{
                    fontSize: '60px',
                    display: 'flex',
                    margin: '20px 0',
                  }}
                />
              </Loading>
              <div className="trans-modal-status trans-modal-wait-confirm">
                {customObj.wait_confirm ? customObj.wait_confirm : intl.waiting}
              </div>
              <div className="trans-modal-tips trans-modal-wait-confirm-tips">
                {customObj.confirm_wallet
                  ? customObj.confirm_wallet
                  : intl.confirm}
              </div>
            </React.Fragment>
          ) : step == 2 ? (
            <React.Fragment>
              <div className="trans-modal-icon">
                <CheckCircleOutlined
                  style={{ fontSize: '80px', color: '#1bc378' }}
                ></CheckCircleOutlined>
              </div>
              <div className="trans-modal-status trans-modal-submit">
                {customObj.submitted ? customObj.submitted : intl.submited}
              </div>
              {txId && (
                <div className="trans-modal-tips trans-modal-submit-tips">
                  <a
                    className="typo-text-link"
                    href={`${tronscanLink}/transaction/${txId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {customObj.view_on_tronscan
                      ? customObj.view_on_tronscan
                      : intl.tronscan}
                  </a>
                </div>
              )}
            </React.Fragment>
          ) : step == 3 ? (
            <React.Fragment>
              <div className="trans-modal-icon">
                <CloseCircleOutlined
                  style={{ fontSize: '80px', color: '#d84b79' }}
                ></CloseCircleOutlined>
              </div>
              <div className="trans-modal-status trans-modal-cancel">
                {customObj.cancelled ? customObj.cancelled : intl.cancelled}
              </div>
            </React.Fragment>
          ) : (
            <></>
          )}
          <Close className="trans-modal-close">
            <CloseOutlined />
          </Close>
        </TransBody>
      </TransContent>
    </div>
  );

  let container: any = document.querySelector('.wg-modal-root');
  if (!container) {
    container = document.createElement('div');
    container.classList.add('wg-modal-root');
    container.innerHTML = renderToString(modalContent);
    document.body.appendChild(container);
  } else {
    container.innerHTML = renderToString(modalContent);
  }
  container.style.display = 'block';

  let closeIcon: any = document.querySelector('.trans-modal-close');
  closeIcon.onclick = () => {
    container.style.display = 'none';
  };
};

export const setTransactionsData = (
  tx: string,
  customObj: any,
  saveAmount: number = 10,
  tronweb: any
) => {
  try {
    const tronWeb = tronweb || (window as any).tronWeb;
    if (!tronWeb.defaultAddress) return;
    let data =
      window.localStorage.getItem(
        `${tronWeb.defaultAddress.base58}_transaction`
      ) || '[]';
    let dataArr = JSON.parse(data);
    let item = {
      title: '', // compatible
      customObj,
      tx,
      status: 1, // 1: pending, 2: confirmed, 3: failed
      checkCnt: 0,
      showPending: true,
    };
    dataArr.unshift(item);
    window.localStorage.setItem(
      `${tronWeb.defaultAddress.base58}_transaction`,
      JSON.stringify(dataArr.slice(0, saveAmount))
    );
  } catch (error) {
    console.log(error);
  }
};

export const getTransactionInfo = (tx: string, tronweb = null) => {
  const tronWeb = tronweb || (window as any).tronWeb;
  return new Promise((resolve, reject) => {
    tronWeb.trx.getConfirmedTransaction(tx, (e: any, r: unknown) => {
      if (!e) {
        resolve(r);
      } else {
        reject(e);
      }
    });
  });
};

export const getDescription = async (
  type: number,
  item: any,
  text: string,
) => {
  const tronscanLink = 'https://tronscan.io/#';
  const { tx, lang, view_on_tronscan } = item;
  let className = '';
  let statusText = '';
  switch (type) {
    case 1:
      className = 'trans-pending';
      statusText = lang === 'zh' ? '待确认' : 'Pending';
      break;
    case 2:
      className = 'trans-confirmed';
      statusText = lang === 'zh' ? '交易已经广播' : 'Transaction Broadcasted';
      break;
    case 3:
      className = 'trans-failed';
      statusText = lang === 'zh' ? '交易失败' : 'Transaction Failed';
      break;
  }
  const intlZh = {
    tronscan: '在 TRONSCAN 上查看',
    errTip:
      '失败原因可能是以下几种，请自查：<br /> ①能量或者带宽不足，需补充 <br /> ②滑点设置过低，需重新设置 <br /> ③当前网络过于拥堵，请稍后再试 <br /> ④系统时间不正确，请校验后再试',
  };
  const intlEn = {
    tronscan: 'View on TRONSCAN',
    errTip:
      'Failure may be caused by the following situations, please check if:<br />①your Energy or bandwidth is insufficient; please top up<br />②your slippage is too low; please reset<br />③your current network is congested; please try again later<br />④your system time is incorrect; please check and try again',
  };
  const intl = lang === 'zh' ? intlZh : intlEn;
  const Notify: any = styled.div`
    position: relative;
  `;
  const ErrTip: any = styled.div`
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    background: #000;
    color: #fff;
  `;
  const notifyDom = (
    <Notify className={'wg-trans-notify'}>
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '14px',
        }}
      >
        <a
          className="typo-text-link"
          href={`${tronscanLink}/transaction/${tx}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {view_on_tronscan ? view_on_tronscan : intl.tronscan}
        </a>
        <a>{statusText}</a>
      </span>
      {type === 3 ? (
        <div className={'flex between ai-center'}>
          <ErrTip
            className="wg-notify-errTip"
            dangerouslySetInnerHTML={{ __html: intl.errTip }}
          ></ErrTip>
          <span className="wg-notify-ques">?</span>
          <span className={'trans-btn-tip ' + className}>{text}</span>
        </div>
      ) : (
        <span className={'trans-btn-tip ' + className}>{text}</span>
      )}
    </Notify>
  );
  const ques: any = document.querySelector('.wg-notify-ques');
  const errTip: any = document.querySelector('.wg-notify-errTip');
  const notify: any = document.querySelector('.wg-trans-notify');

  ques.onmouseover = () => {
    errTip.style.display = 'block';
  };
  ques.onmouseend = () => {
    errTip.style.display = 'none';
  };

  setTimeout(() => {
    notify.style.display = 'none';
  }, 5000);

  return notifyDom;
};

export const checkPendingTransactions = (tronweb = null) => {
  const tronWeb = tronweb || (window as any).tronWeb;
  let data =
    window.localStorage.getItem(
      `${tronWeb.defaultAddress.base58}_transaction`
    ) || '[]';
  const transactions = JSON.parse(data);

  transactions.map(
    (item: { checkCnt?: any; tx?: any; status?: any; showPending?: any }) => {
      const { tx, status, showPending } = item;
      if (Number(status) === 1) {
        if (showPending) {
          logTransaction(item, 1);
        }
        item.checkCnt++;
        getTransactionInfo(tx)
          .then((r: any) => {
            if (r) {
              if (r?.ret[0]?.contractRet === 'SUCCESS') {
                logTransaction(item, 2);
              } else if (
                r &&
                r.ret &&
                r.ret[0].contractRet &&
                r.ret[0].contractRet != 'SUCCESS'
              ) {
                logTransaction(item, 3);
              } else {
                if (item.checkCnt != undefined && item.checkCnt < 30) {
                  setTimeout(checkPendingTransactions, 3000);
                } else {
                  logTransaction(item, 3);
                }
              }
            }
          })
          .catch((ex) => {
            console.error(ex);
          });
      }
      return false;
    }
  );
};

export const logTransaction = async (
  item: {
    checkCnt?: any;
    tx?: any;
    status?: any;
    showPending?: any;
    customObj?: any;
  },
  status: number,
  lang: string = 'en'
) => {
  item.status = status;
  if (status === 1) item.showPending = false;
  const { customObj } = item;

  const Notification: any = styled.div`
    position: absolute;
    z-index: 9;
    right: 20px;
    top: 20px;
  `;

  const Close: any = styled.div`
    position: absolute;
    width: 20px;
    height: 20px;
    right: 15px;
    top: 15px;
    cursor: pointer;
  `;

  const intlZh = {
    pending: '待确认',
    confirmed: '已确认',
    failed: '失败',
  };

  const intlEn = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    failed: 'Failed',
  };

  const intl = lang === 'zh' ? intlZh : intlEn;

  let description = intl.pending;
  if (status === 2) description = intl.confirmed;
  if (status === 3) description = intl.failed;

  const notifyContent = (
    <div className="notification">
      <div className="message">{customObj.title}</div>
      <div className="description">
        {await getDescription(status, item, description)}
      </div>
      <Notification className="wg-notify-block">
        <div className="message">{customObj.title}</div>
        <div className="description">
          {await getDescription(status, item, description)}
        </div>
        <Close className="trans-notify-close">{<CloseOutlined />} </Close>
      </Notification>
    </div>
  );

  let container: any = document.querySelector('.wg-notify-root');
  if (!container) {
    container = document.createElement('div');
    container.classList.add('wg-notify-root');
    // container.innerHTML = renderToString(notifyContent);
    container.innerHTML = renderToString(notifyContent);
    document.body.appendChild(container);
  } else {
    // container.innerHTML = renderToString(notifyContent);
    container.innerHTML = renderToString(notifyContent);
  }
  container.style.display = 'block';

  let closeIcon: any = document.querySelector('.trans-notify-close');
  closeIcon.onclick = () => {
    container.style.display = 'none';
  };

  saveTransactions(item);

  setTimeout(
    () => {
      container.style.display = 'none';
    },
    status === 3 ? 30000 : 5000
  );
};

export const saveTransactions = (record: any, tronweb: any = null) => {
  const { tx } = record;
  const tronWeb = tronweb || (window as any).tronWeb;
  let data =
    window.localStorage.getItem(
      `${tronWeb.defaultAddress.base58}_transaction`
    ) || '[]';
  let dataArr = JSON.parse(data);
  let pos: string | number = 'true';
  dataArr.map((item: { tx: any }, index: number) => {
    if (item.tx === tx) {
      pos = index;
    }
  });
  if (pos === 'true') {
    return;
  }
  dataArr[pos] = record;
  window.localStorage.setItem(
    `${tronWeb.defaultAddress.base58}_transaction`,
    JSON.stringify(dataArr)
  );
};

export const setVariablesInterval = () => {
  let interval = null;
  if (!interval) {
    interval = setInterval(async () => {
      try {
        checkPendingTransactions();
      } catch (err) {
        console.log('interval error:' + err);
      }
    }, 3000);
  }
};
