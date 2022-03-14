import { Connector } from '../src';

const tronwebConnector = new Connector();

describe('Connector Test', () => {
  it('constructor', () => {
    expect(tronwebConnector).not.toBeFalsy();
  });

  it('handleTronWallet', async () => {
    const res = await tronwebConnector.handleTronWallet(null);
    expect(res.name).toEqual('error');
  });
});
