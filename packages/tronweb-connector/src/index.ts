'use strict';

interface ResultType {
  msg: string;
  success: boolean;
}

export class Connector {
  [x: string]: any;
  public defaultAccount: any;

  private accountsChangedListener = (result: any) => {
    return result;
  };

  private chainChangedListener = (result: any) => {
    return result;
  };

  private disconnectListener = (result: any) => {
    return result;
  };

  private connectListener = (result: any) => {
    return result;
  };

  private errorMessage = (msg: string) => {
    const error: ResultType = { success: false, msg };
    return error;
  };

  handleTronWallet = async (tron: any) => {
    if (!tron) {
      return this.errorMessage(`error: tronweb not provided`);
    }
    if (tron?.defaultAddress?.base58) {
      this.defaultAccount = tron.defaultAddress.base58;
      return tron;
    }

    const tronLink = tron;
    if (tronLink.ready) {
      // Access the decentralized web!
      const tronWeb = tronLink.tronWeb;
      return tronWeb;
    } else {
      const res = await tronLink.request({ method: 'tron_requestAccounts' });
      if (res.code === 200) {
        const tronWeb = tronLink.tronWeb;
        return tronWeb;
      }
      if (res.code === 4001) {
        const error = this.errorMessage(`error: Current connection refused`);
        return error;
      }
    }
  };

  activate = async () => {
    try {
      const self = this;
      const tronlinkPromise = new Promise(reslove => {
        window.addEventListener(
          'tronLink#initialized',
          async () => {
            return reslove((window as any).tronLink);
          },
          {
            once: true,
          }
        );

        setTimeout(() => {
          if ((window as any).tronLink) {
            return reslove((window as any).tronLink);
          }
        }, 3000);
      });

      const appPromise = new Promise(resolve => {
        let timeCount = 0;
        const tmpTimer1 = setInterval(() => {
          timeCount++;
          if (timeCount > 8) {
            clearInterval(tmpTimer1);
            return resolve(false);
          }
          if ((window as any).tronLink) {
            clearInterval(tmpTimer1);
            if ((window as any).tronLink.ready) {
              return resolve((window as any).tronLink);
            }
          } else if (
            (window as any).tronWeb &&
            (window as any).tronWeb.defaultAddress &&
            (window as any).tronWeb.defaultAddress.base58
          ) {
            clearInterval(tmpTimer1);
            return resolve((window as any).tronWeb);
          }
        }, 1000);
      });

      const tron = Promise.race([tronlinkPromise, appPromise]).then(res => {
        return self.handleTronWallet(res);
      });

      this.on('accountsChanged', this.accountsChangedListener);
      this.on('chainChanged', this.chainChangedListener);
      this.on('disconnectWeb', this.disconnectListener);
      this.on('connectWeb', this.connectListener);
      return tron;
    } catch (e) {
      return this.errorMessage(`error: ${e}`);
    }
  };

  on = (_action: string, cb: any) => {
    let actionName = _action;
    if (_action === 'chainChanged') actionName = 'setNode';
    window.addEventListener('message', res => {
      if (res.data.message && res.data.message.action == actionName) {
        return cb & cb({...res.data.message, action: _action});
      } else {
        return false;
      }
    });
  };
}

export const TronWebConnector = new Connector();
