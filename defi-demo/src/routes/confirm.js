import React, { useState, useEffect } from 'react';
import '../App.scss';
import BigNumber from 'bignumber.js';
import {
    OpenTransModal,
    setTransactionsData,
    getTransactionInfo,
    getDescription,
    checkPendingTransactions,
    logTransaction,
    saveTransactions,
    setVariablesInterval
} from '@widgets/transaction-confirm';
// import { triggerSmartContract, sign, sendRawTransaction, MAX_UINT256 } from '../utils/blockchain';
import { ContractInteract } from '@widgets/contract-interact';
const { trigger, sign, broadCast, send } = ContractInteract;

function App() {
    const [txID, setTxID] = useState('');
    const [description, setDescription] = useState('');
    const [intlObj, setIntlObj] = useState({ obj: { value: 0.1, symbol: 'SUN' }, title: '质押锁定 0.1 SUN' });
    const [transaction, setTransaction] = useState('');

    const trxPrecision = 1e6;
    const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    const feeLimitMin = 100000000;
    const feeLimitCommon = 400000000;

    useEffect(() => {}, []);
    // 1
    const openTransModal = async () => {
        const txId = await toApproveLP('TDqjTkZ63yHB19w2n7vPm2qAkLHwn9fKKk', 'TH1SvdkzHbeN7gYPKhtoDPtFe3V2nj9yVv', {
            continuous: true
        });
        if (txId) {
            lockSun();
        }
    };

    const toApproveLP = async (
        tokenAddress = 'TDqjTkZ63yHB19w2n7vPm2qAkLHwn9fKKk',
        exchangeAddress = 'TH1SvdkzHbeN7gYPKhtoDPtFe3V2nj9yVv',
        intlObj
    ) => {
        const result = await triggerFn(
            tokenAddress, // sun token test
            'approve(address,uint256)',
            [
                { type: 'address', value: exchangeAddress },
                { type: 'uint256', value: MAX_UINT256 }
            ],
            { feeLimit: feeLimitMin },
            intlObj
        );
        return result && result.transaction ? result.transaction.txID : '';
    };

    const triggerFn = async (
        address,
        functionSelector,
        parameters = [],
        options = {},
        intlObj = {},
        callbacks = false
    ) => {
        try {
            //   if (!this.rootStore.network.defaultAccount) return; // 如果没登录，禁止所有交易操作触发
            OpenTransModal({ step: 1 }, intlObj);
            // console.log('address', address, 'functionSelector', functionSelector, 'parameters', parameters);
            const transaction = await trigger(
                address,
                functionSelector,
                Object.assign({ feeLimit: feeLimitCommon }, options),
                parameters
            );
            // console.log(transaction, 'transaction');
            if (!transaction.result || !transaction.result.result) {
                throw new Error('Unknown trigger error: ' + JSON.stringify(transaction.transaction));
            }

            const signedTransaction = await sign(transaction.transaction);
            if (!signedTransaction) {
                OpenTransModal({ step: 3 }, intlObj);
                // getDescriptionFn(3, { obj: { value: 0.1, symbol: 'SUN' }, title: '授权失败' });
                return;
            }
            console.log(signedTransaction, 'signedTransaction');

            const result = await broadCast(signedTransaction);

            if (!intlObj.continuous) {
                console.log(result, 'result', intlObj);
                OpenTransModal({ step: 2, txId: result.transaction.txID }, intlObj);
            }

            if (result && result.result) {
                setTransactionsData(result.transaction.txID, intlObj);
            } else {
                OpenTransModal({ step: 3 }, intlObj);
                return;
            }

            callbacks && callbacks();
            return result;
        } catch (error) {
            if (error) {
                if (error && error.message == 'Confirmation declined by user') {
                    openTransModal({ step: 3 }, intlObj);
                }
            }
            console.log(`trigger error ${address} - ${functionSelector}`, error.message ? error.message : error);
            return {};
        }
    };

    const lockSun = async (value = 0.1, time = new Date('2022-10-10').getTime() / 1000) => {
        const intlObj = {
            title: `质押锁定 ${value} SUN`,
            obj: {
                value,
                symbol: 'SUN'
            }
        };
        let txId = await stakeSSP2(
            new BigNumber(value).times(1e18).toString(),
            false,
            new BigNumber(time).toString(),
            intlObj
        );
        if (txId) {
            setTxID(txId);
            setIntlObj(intlObj);
            getDescriptionFn(1, intlObj, txId);
            setTimeout(() => {
                // props.cb();
                getDescriptionFn(2, intlObj, txId);
            }, 5000);
        }
    };

    const stakeSSP2 = async (
        amount,
        lock,
        unlockTime,
        intlObj,
        address = 'TH1SvdkzHbeN7gYPKhtoDPtFe3V2nj9yVv',
        callbacks
    ) => {
        const result = await triggerFn(
            address,
            'stake(uint256,bool,uint256)',
            [
                { type: 'uint256', value: amount },
                { type: 'bool', value: lock },
                { type: 'uint256', value: unlockTime }
            ],
            {},
            intlObj,
            callbacks
        );
        return result && result.transaction ? result.transaction.txID : '';
    };
    // 2
    const setTransactionsDataFn = () => {
        if (txID) {
            setTransactionsData(txID, intlObj);
            console.log('SetTransactionsData', { txID, intlObj });
        } else {
            console.log('SetTransactionsData Error: No Transactions');
        }
    };
    // 3
    const getTransactionInfoFn = async () => {
        // console.log(txID, 'getTransactionInfoFn');
        let result = await getTransactionInfo(txID);
        setTransaction(result);
        console.log('GetTransactionInfo', result);
    };
    // 4
    const getDescriptionFn = async (status = 1, customObj = intlObj, tx = txID) => {
        let result = await getDescription(
            status,
            {
                tx,
                lang: 'zh'
            },
            customObj.title
        );
        setDescription(result);
        console.log('GetDescription', result, customObj, status);
    };

    // 5
    const checkPendingTransactionsFn = async () => {
        checkPendingTransactions();
        console.log('CheckPendingTransactions');
    };

    // 6
    const logTransactionFn = async (status = 1) => {
        logTransaction({ checkCnt: 0, customObj: intlObj, showPending: true, status, title: '', tx: txID }, status);
        console.log('LogTransaction: ', {
            checkCnt: 0,
            customObj: intlObj,
            showPending: true,
            status,
            title: '',
            txID
        });
    };

    // 7
    const saveTransactionsFn = async () => {
        saveTransactions({
            checkCnt: 0,
            customObj: intlObj,
            showPending: true,
            status: 1,
            title: 'saveTransactions',
            tx: txID
        });
        console.log('SaveTransactions: ', {
            checkCnt: 0,
            customObj: intlObj,
            showPending: true,
            status: 1,
            title: 'saveTransactions',
            txID
        });
    };

    // 8
    const setVariablesIntervalFn = async () => {
        setVariablesInterval();
        console.log('SetVariablesInterval');
    };

    return (
        <div className="App confirm">
            <div onClick={openTransModal}>1. OpenTransModal</div>
            <br />
            <div onClick={setTransactionsDataFn}>2. SetTransactionsData</div>
            <br />
            <div onClick={getTransactionInfoFn}>3. GetTransactionInfo</div>
            <br />
            <div onClick={e => getDescriptionFn(1, intlObj)}>4. GetDescription（status=1）</div>
            <br />
            <div onClick={e => getDescriptionFn(2, intlObj)}>5 GetDescription（status=2）</div>
            <br />
            <div onClick={e => getDescriptionFn(3, intlObj)}>6. GetDescription（status=3）</div>
            <br />
            <div onClick={checkPendingTransactionsFn}>7. CheckPendingTransactions</div>
            <br />
            <div onClick={e => logTransactionFn(1)}>8. LogTransaction（status=1）</div>
            <br />
            <div onClick={e => logTransactionFn(2)}>9. LogTransaction（status=2）</div>
            <br />
            <div onClick={e => logTransactionFn(3)}>10. LogTransaction（status=3）</div>
            <br />
            <div onClick={saveTransactionsFn}>11. SaveTransactions</div>
            <br />
            <div onClick={setVariablesIntervalFn}>12. SetVariablesInterval</div>
            <div className="wg-modal-root"></div>
            <div className="wg-notify-ques"></div>
            <div className="wg-notify-errTip"></div>
            <br />
            <div>{description}</div>
        </div>
    );
}

export default App;
