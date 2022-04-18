import { useState, useEffect } from 'react';
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
} from 'transaction-confirm';
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
            const transaction = await trigger(
                address,
                functionSelector,
                Object.assign({ feeLimit: feeLimitCommon }, options),
                parameters
            );
            console.log(transaction, 'transaction');
            const signedTransaction = await sign(transaction.transaction);
            console.log(signedTransaction, 'signedTransaction');
            const result = await broadCast(signedTransaction);
            if (!intlObj.continuous) {
                console.log(result, 'result', intlObj);
                OpenTransModal({ step: 2, txId: result.transaction.txID }, intlObj);
            }
            if (result && result.result) {
                setTransactionsData(result.transaction.txID, intlObj);
            }

            // callbacks && this.executeCallback(callbacks);
            return result;
        } catch (error) {
            console.log(11122223333, error);
            if (error) {
                // if (error && error.message == 'Confirmation declined by user') {
                // this.openTransModal({ ...intlObj, step: 3 });
                OpenTransModal({ step: 3 }, intlObj);
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
            getDescriptionFn(1, intlObj);
            setTimeout(() => {
                // props.cb();
                getDescriptionFn(2, intlObj);
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
        setTransactionsData(txID, intlObj);
    };
    // 3
    const getTransactionInfoFn = async () => {
        console.log(txID, 'getTransactionInfoFn');
        let result = await getTransactionInfo(txID);
        setTransaction(result);
        console.log(result, 'getTransactionInfo');
    };
    // 4
    const getDescriptionFn = async (status = 1, customObj = intlObj) => {
        let result = await getDescription(
            status,
            {
                tx: txID,
                lang: 'zh'
            },
            customObj.title
        );
        setDescription(result);
        console.log(result, 'getDescriptionFn', customObj, status);
    };

    // 5
    const checkPendingTransactionsFn = async () => {
        checkPendingTransactions();
    };

    // 6
    const logTransactionFn = async () => {
        logTransaction({ checkCnt: 0, customObj: intlObj, showPending: true, status: 1, title: '', tx: txID });
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
    };

    // 8
    const setVariablesIntervalFn = async () => {
        setVariablesInterval();
    };

    return (
        <div className="App confirm">
            <div onClick={openTransModal}>1. OpenTransModal</div>
            <br />
            <div onClick={setTransactionsDataFn}>2. SetTransactionsData</div>
            <br />
            <div onClick={getTransactionInfoFn}>3. GetTransactionInfo</div>
            <br />
            <div onClick={e => getDescriptionFn(3, intlObj)}>4. GetDescription</div>
            <br />
            <div onClick={checkPendingTransactionsFn}>5. CheckPendingTransactions</div>
            <br />
            <div onClick={e => logTransactionFn()}>6. LogTransaction</div>
            <br />
            <div onClick={saveTransactionsFn}>7. SaveTransactions</div>
            <br />
            <div onClick={setVariablesIntervalFn}>8. SetVariablesInterval</div>
            <div className="wg-modal-root"></div>
            <div className="wg-notify-ques"></div>
            <div className="wg-notify-errTip"></div>
            <br />
            <div>{description}</div>
        </div>
    );
}

export default App;
