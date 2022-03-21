'use strict';
export class Contract {
  public feeLimitCommon: number = 400000000;

  trigger = async (address: any, functionSelector: any, options = {}, parameters = [], tronweb: any) => {
    try {
      const tronWeb = tronweb || (window as any).tronWeb;
      if (!tronWeb.defaultAddress) return;
      const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
        address,
        functionSelector,
        Object.assign({ feeLimit: this.feeLimitCommon }, options),
        parameters
      );

      if (!transaction.result || !transaction.result.result) {
        throw new Error('Unknown trigger error: ' + JSON.stringify(transaction.transaction));
      }
      return transaction;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  sign = async (transaction: { transaction: any; }, tronweb: any) => {
    try {
      const tronWeb = tronweb || (window as any).tronWeb;
      if (!tronWeb.defaultAddress) return;
      const signedTransaction = await tronWeb.trx.sign(transaction.transaction);
      return signedTransaction;
    } catch (error: any) {
      console.log(error, 'signerr');
      throw new Error(error);
    }
  }

  broadCast = async (signedTransaction: any, tronweb: any) => {
    try {
      const tronWeb = tronweb || (window as any).tronWeb;
      if (!tronWeb.defaultAddress) return;
      const result = await tronWeb.trx.sendRawTransaction(signedTransaction);
      return result;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  send = async (address: any, functionSelector: any, parameters = [], options = {}, callbacks: () => any, tronWeb: any) => {
    try {
      const transaction = await this.trigger(
        address,
        functionSelector,
        Object.assign({ feeLimit: this.feeLimitCommon }, options),
        parameters,
        tronWeb
      );

      const signedTransaction = await this.sign(transaction, tronWeb);
      const result = await this.broadCast(signedTransaction, tronWeb);

      callbacks && callbacks();
      return result;
    } catch (error: any) {
      console.log(`trigger error ${address} - ${functionSelector}`, error.message ? error.message : error);
      return {};
    }
  };

  call = async (address: any, functionSelector: any, parameters = [], options = {}, tronweb: any) => {
    try {
      const tronWeb = tronweb || (window as any).tronWeb;
      if (!tronWeb.defaultAddress) return;
      const result = await tronWeb.transactionBuilder.triggerSmartContract(
        address,
        functionSelector,
        { _isConstant: true, options },
        parameters
      );
      return result && result.result ? result.constant_result : [];
    } catch (error: any) {
      console.log(`view error ${address} - ${functionSelector}`, error.message ? error.message : error);
      return [];
    }
  };

  deploy = async (options: any, address: any, callbacks: () => any, tronweb: any) => {
    try {
      const tronWeb = tronweb || (window as any).tronWeb;
      if (!tronWeb.defaultAddress) return;
      const transaction = await tronWeb.transactionBuilder.createSmartContract(options, address);

      const signedTransaction = await this.sign(transaction, tronWeb);
      const result = await this.broadCast(signedTransaction, tronWeb);

      callbacks && callbacks();
      return result;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  sendTrx = async (toAddress: any, amount: any, fromAddress: any, options: any, callbacks: any, tronweb: any) => {
    try {
      const tronWeb = tronweb || (window as any).tronWeb;
      if (!tronWeb.defaultAddress) return;
      const tradeObj = await tronWeb.transactionBuilder.sendTrx(
        toAddress,
        amount,
        fromAddress,
        options
      );

      const signedTransaction = await this.sign(tradeObj, tronWeb);
      const result = await this.broadCast(signedTransaction, tronWeb);

      callbacks && callbacks();
      return result;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  sendToken = async (address: any, amount: any, tokenID: any, options: any, callbacks:any, tronweb: any) => {
    try {
      const tronWeb = tronweb || (window as any).tronWeb;
      if (!tronWeb.defaultAddress) return;
      const tradeObj = await tronWeb.trx.sendToken(address, amount, tokenID, tronWeb.defaultAddress.hex, options);

      const signedTransaction = await this.sign(tradeObj, tronWeb);
      const result = await this.broadCast(signedTransaction, tronWeb);

      callbacks && callbacks();
      return result;
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  }
}

export const ContractInteract = new Contract();
