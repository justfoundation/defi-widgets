'use strict';

interface Error {
  name: string;
  message: string;
  stack?: string;
}

export class Connector {
  [x: string]: any;
  public defaultAccount: any;

  private accountsChangedListener = () => {
    window.location.reload();
  };

  private setAccountListener = () => {
    window.location.reload();
  };

  private chainChangedListener = () => {
    window.location.reload();
  };

  private disconnectListener = () => {
    window.location.reload();
  };

  private connectListener = () => {
    window.location.reload();
  };

  errorMessage = (error: Error) => {
    return error;
  };

  handleTronWallet = async (tron: any, login?: boolean) => {
    if (!tron) {
      const error = this.errorMessage({
        message: `error: tronweb not provided`,
        name: 'error',
      });
      return error;
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
    } else if (login){
      const res = await tronLink.request({ method: 'tron_requestAccounts' });
      if (res.code === 200) {
        const tronWeb = tronLink.tronWeb;
        return tronWeb;
      }
      if (res.code === 4001) {
        const error = this.errorMessage({
          message: `error: Current connection refused`,
          name: 'error',
        });
        return error;
      }
    }
  };

  initTronLinkWallet = async (login?: boolean) => {
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
        return self.handleTronWallet(res, login);
      });

      this.on('accountsChanged', this.accountsChangedListener);
      this.on('setAccount', this.setAccountListener);
      this.on('setNode', this.chainChangedListener);
      this.on('disconnectWeb', this.disconnectListener);
      this.on('connectWeb', this.connectListener);
      return tron;
    } catch (e) {
      return `error: ${e}`;
    }
  };

  on = (_action: string, cb: any) => {
    window.addEventListener('message', res => {
      if (res.data.message && res.data.message.action == _action) {
        if (_action == 'setAccount') {
          if (
            (window as any).tronWeb &&
            !(window as any).tronLink &&
            res.data.message.data.address !== this.defaultAccount
          ) {
            cb & cb();
          }
        } else {
          cb & cb();
        }
      }
    });
  };

  activate = async () => {
    return await this.initTronLinkWallet(true);
  }
}

export const TronWebConnector = new Connector();
