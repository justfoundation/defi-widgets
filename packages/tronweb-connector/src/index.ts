'use strict';

export class Connector {
  [x: string]: any;

  handleTronWallet = async (tron: any) => {
    if (!tron) {
      return `error: Didn't get tronweb`;
    }
    if (tron && tron.defaultAddress && tron.defaultAddress.base58) {
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
        return `error: Current connection refused`;
      }
    }
  };

  initTronLinkWallet = () => {
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
      return tron;
    } catch (e) {
      return `error: ${e}`;
    }
  };
}

export const tronWebConnector = new Connector();
