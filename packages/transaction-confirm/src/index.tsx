import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { renderToString } from 'react-dom/server';
import classNames from 'classnames';
import ModalContent from './components/modalContent';
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
  let container: any = document.querySelector('.wg-modal-root');
  if (!container) {
    container = document.createElement('div');
    container.classList.add('wg-modal-root');

    const contentString: any = ModalContent(stepInfo, customObj)
    container.innerHTML = renderToString(contentString);
    document.body.appendChild(container);
  } else {
    const contentString: any = ModalContent(stepInfo, customObj)
    container.innerHTML = renderToString(contentString);
  }
  container.style.display = 'block';

  let closeIcon: any = document.querySelector('.modal-close');
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

  const notifyDom = (
    <div className={styles.notify}>
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
          <div
            className={styles.errTip}
            dangerouslySetInnerHTML={{ __html: intl.errTip }}
          ></div>
          <span className="wg-notify-ques">?</span>
          <span className={'trans-btn-tip ' + className}>{text}</span>
        </div>
      ) : (
        <span className={'trans-btn-tip ' + className}>{text}</span>
      )}
    </div>
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
      <div className={styles.notification}>
        <div className="message">{customObj.title}</div>
        <div className="description">
          {await getDescription(status, item, description)}
        </div>
        <div className={classNames(styles.notifyClose, 'notify-close')}>{<CloseOutlined />} </div>
      </div>
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

  let closeIcon: any = document.querySelector('.notify-close');
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
