import axios from 'axios';
import _ from 'lodash';
import validator from 'validator';

export class TokenList {
  private TOKENS_ELEMENT = {
    chainId: '',
    address: '',
    name: '',
    symbol: '',
    decimals: '',
    logoURI: ''
  };

  private JSON_ELEMENT = {
    'name': '',
    'logoURI': '',
    'timestamp': '',
    'tokens': [],
    'version': {
      'major': '',
      'minor': '',
      'patch': ''
    }
  };

  private getVersion = (v: { major?: 0 | undefined; minor?: 0 | undefined; patch?: 0 | undefined; }) => {
    try {
      const { major = 0, minor = 0, patch = 0 } = v;
      return String(major) + '.' + String(minor) + '.' + String(patch);
    } catch (err) {
      console.log(err);
      return '';
    }
  };

  private checkVersionLater = (o: any, n: any) => {
    try {
      if (Number(n.major) > Number(o.major)) {
        return true;
      }
      if (Number(n.minor) > Number(o.minor)) {
        return true;
      }
      if (Number(n.patch) > Number(o.patch)) {
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  private checkTokenChanged = (o: any, n: any, maxTokens = 100) => {
    try {
      const res = {
        success: false,
        addTokens: [],
        delTokens: [],
        updateTokens: []
      };
      const oVersion = o.version;
      const nVersion = n.version;
      const isVersionLater = this.checkVersionLater(oVersion, nVersion);
      if (!isVersionLater) {
        return res;
      }
      // If the number of tokens exceeds 100, no prompt will be given
      if (n.tokens.length > maxTokens) {
        return res;
      }
      const oTokens = o.tokens.slice() || [];
      const delTokensInit = o.tokens.slice() || [];
      const nTokens = n.tokens.slice() || [];
      const addTokensInit = n.tokens.slice() || [];
      _.pullAllWith(delTokensInit, nTokens, _.isEqual);
      _.pullAllWith(addTokensInit, oTokens, _.isEqual);
      const updateTokens = _.intersectionBy(addTokensInit, delTokensInit, 'address');
      const addTokens = _.xorBy(addTokensInit, updateTokens, 'address');
      const delTokens = _.xorBy(delTokensInit, updateTokens, 'address');
      if (addTokens.length || delTokens.length || updateTokens.length) {
        return {
          success: true,
          addTokens,
          delTokens,
          updateTokens
        };
      }
      return res;
    } catch (err) {
      return {
        success: false
      };
    }
  };

  private handleNotifiction = async (listsData: { byUrl: any; selectedListUrl: any; }, byUrlNew: { [x: string]: any; }) => {
    try {
      const updateStatus = Object.keys(byUrlNew).length > 0;
      if (!updateStatus) {
        return {
          success: false,
          msg: 'No listings have updated content',
        }
      }
      const { byUrl, selectedListUrl } = listsData;
      const o = byUrl[selectedListUrl];
      const n = byUrlNew[selectedListUrl];
      const oVersion = o.version;
      const nVersion = n.version;
      const { success = false, addTokens, delTokens, updateTokens } = this.checkTokenChanged(o, n);
      let updateInfo = {};
      if (success) {
        updateInfo = {
          addTokens,
          delTokens,
          updateTokens,
          versionOld: this.getVersion(oVersion),
          versionNew: this.getVersion(nVersion),
          categoryName: o.name,
        };
      }
      return {
        success: true,
        updateInfo,
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        msg: err,
      };
    }
  };

  private isValidURL = (url: string) => {
    if (typeof url !== 'string') return false;
    return validator.isURL(url.toString(), {
      protocols: ['http', 'https'],
      require_tld: true,
      require_protocol: true
    });
  };

  private isListsOver = (lists = {}, maxLists = 20) => {
    return Object.keys(lists).length >= maxLists;
  };

  private isNotEmptyString = (str: string, tronweb = null) => {
    const tronWeb = tronweb || (window as any).tronWeb;
    return tronWeb.utils.isString(str) && str != '';
  };

  private isPositiveInteger = (num: number, tronweb = null) => {
    const tronWeb = tronweb || (window as any).tronWeb;
    return typeof num === 'number' && tronWeb.utils.isInteger(num) && num > 0;
  };

  private isTimestamp = (timestamp: number) => {
    return this.isPositiveInteger(timestamp) && String(timestamp).length === 13;
  };

  private hasSpace = (str: string) => {
    var reg = /(^\s+)|(\s+$)|\s+/g;

    return reg.test(str);
  };

  private tokensElementValidate: any = {
    chainId: (chainId: number) => {
      return this.isPositiveInteger(chainId) && chainId >= 1 && chainId <= 10; // Chainid ：It needs to be a number, between 1-10;
    },
    address: (address: any, tronweb = null) => {
      const tronWeb = tronweb || (window as any).tronWeb;
      return tronWeb.isAddress(address);
    },
    name: (name: string) => {
      return this.isNotEmptyString(name);
    },
    symbol: (symbol: string) => {
      return this.isNotEmptyString(symbol) && !this.hasSpace(symbol);
    },
    decimals: (decimals: number) => {
      return this.isGteZeroInteger(decimals) && decimals <= 256;
    },
    logoURI: (logoURI: string) => {
      return this.isValidURL(logoURI);
    }
  };

  private tokensValidate = (tokens: string | any[], tronweb = null) => {
      const tronWeb = tronweb || (window as any).tronWeb;
      if (!tronWeb.utils.isArray(tokens) || tokens.length === 0) {
      return false;
    }
    let flag = true;
    const len1 = tokens.length;
    for (let j = 0; j < len1; j++) {
      const t = tokens[j];
      const element = Object.assign({ ...this.TOKENS_ELEMENT }, t);
      const elementArr = Object.keys(element);
      const length = elementArr.length;
      for (let i = 0; i < length; i++) {
        const key = elementArr[i];
        const e = element[key];
        if ((this.tokensElementValidate[key] && !this.tokensElementValidate[key](e)) || !this.tokensElementValidate[key]) {
          flag = false;
          break;
        }
      }
      if (!flag) {
        break;
      }
    }
    return flag;
  };

  private isGteZeroInteger = (num: number, tronweb = null) => {
    const tronWeb = tronweb || (window as any).tronWeb;
    return typeof num === 'number' && tronWeb.utils.isInteger(num) && num >= 0;
  };

  private jsonValidate: any = {
    name: (name: any) => {
      return this.isNotEmptyString(name);
    },
    logoURI: (logoURI: string) => {
      return this.isValidURL(logoURI);
    },
    timestamp: (timestamp: any) => {
      return this.isTimestamp(timestamp);
    },
    tokens: (tokens: any) => {
      return this.tokensValidate(tokens);
    },
    version: (version: { major: any; minor: any; patch: any; }, tronweb = null) => {
    const tronWeb = tronweb || (window as any).tronWeb;
    return (
        tronWeb.utils.isObject(version) &&
        this.isGteZeroInteger(version.major) &&
        this.isGteZeroInteger(version.minor) &&
        this.isGteZeroInteger(version.patch)
      );
    }
  };

  private validateFunc = (target: any) => {
    const json = Object.assign({ ...this.JSON_ELEMENT }, target);

    const keysArr = Object.keys(json);
    const length = keysArr.length;
    const res = { key: '', valid: true };
    for (let i = 0; i < length; i++) {
      const key = keysArr[i];
      if ((this.jsonValidate[key] && !this.jsonValidate[key](json[key])) || (!this.jsonValidate[key] && key !== 'uri')) {
        // uri is added manually, without verification
        res.key = key;
        res.valid = false;
        break;
      }
    }
    return res;
  };

  private setTokensDataIntoLocal = (listsData: any) => {
    try {
      window.localStorage.setItem('simpleListsFromTron', JSON.stringify(listsData));
      return window.localStorage.getItem('simpleListsFromTron');
    } catch (err) {
      return false;
    }
  };

  private getDefaultListSet = async (tronweb = null) => {
    const tronWeb = tronweb || (window as any).tronWeb;
    const nodeRes = await tronWeb.fullNode;
    let url = `http://123.56.166.152:10088/swap/v2/defaultListSet`;
    if (nodeRes?.host === 'https://api.trongrid.io') url = `https://abc.ablesdxd.link/swap/v2/defaultListSet`;
    const res = await axios.get(url);
    if (res.data.code === 0) {
      return res.data.data.filter((item: any) => item.type !== 'list');
    } else {
      return [];
    }
  }

  // Get tokens data from backend
  getTokenListFromUri = async (uri: string) => {
    try {
      const res = await axios.get(uri);
      const obj = res && res.data ? res.data : null;
      if (typeof obj !== 'object' || obj === null) {
        return {
          success: false,
          msg: 'No data'
        };
      }
      return {
        success: true,
        listData: { ...res.data, uri },
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        msg: err
      };
    }
  };

  // Add tokenlist
  addTokenList = async (customTokenUri: string, maxLists = 20, maxTokens = 100) => {
    try {
      const simpleListsFromTronStr = window.localStorage.getItem('simpleListsFromTron') || '';
      const simpleListsFromTron = simpleListsFromTronStr ? JSON.parse(simpleListsFromTronStr) : {};
      const { byUrl = {} } = simpleListsFromTron;
      // The address is invalid
      if (!this.isValidURL(customTokenUri)) {
        const errInfo = {
          success: false,
          msg: 'The list cannot be added'
        }
        return errInfo;
      }

      // exists in the list
      if (byUrl[customTokenUri] && !byUrl[customTokenUri].rs) {
        // not deleted
        const errInfo = {
          success: false,
          msg: 'Already exists in the list'
        }
        return errInfo;
      }

      // Whether the number of lists exceeds 20
      if (this.isListsOver(byUrl)) {
        const errInfo = {
          success: false,
          msg: `You have more than ${maxLists} lists.The list cannot be added`
        }
        return errInfo;
      }
      
      return this.updateTokenList(customTokenUri, maxTokens);
    } catch (err) {
      // The request returns an error code
      const errInfo = {
        success: false,
        msg: 'Adding failed, please try again'
      }
      console.log(err);
      return errInfo;
    }
  };

  // Add default tokenlist
  addDefaultTokenList = async (tronweb = null) => {
    const tronWeb = tronweb || (window as any).tronWeb;
    const res = await tronWeb.fullNode;
    let uri = `http://123.56.166.152:10088/justswap.json`;
    if (res?.host === 'https://api.trongrid.io') uri = `https://list.justswap.link/justswap.json`;
    return this.addTokenList(uri);
  };

  // Get tokens data from local cache
  getTokenListFromLocal = () => {
    try {
      if (!window.localStorage.getItem('simpleListsFromTron')) return { byUrl: {} };
      const simpleListsFromTronStr = window.localStorage.getItem('simpleListsFromTron') || '';
      if (!simpleListsFromTronStr) {
        return {
          success: false,
          msg: 'TokenList does not exist',
        }
      }
      const simpleListsFromTron = JSON.parse(simpleListsFromTronStr);
      const { byUrl = {}, selectedListUrl = '' } = simpleListsFromTron;
      const keyArr = Object.keys(byUrl);
      let res: any = {};
      keyArr.map((item: any) => {
        if (byUrl[item].name !== 'JustSwap Default List') {
          res[item] = byUrl[item];
        }
      });
      let listsData: any = {};
      listsData.byUrl = res;

      if (!res[selectedListUrl]) {
        listsData.selectedListUrl = keyArr[0];
      } else {
        listsData.selectedListUrl = selectedListUrl;
      }
      return {
        success: true,
        listsData,
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        msg: err,
      };
    }
  };

  // Get list data update information
  getUpdateInfo = async ({ maxLists = 20 } = {}) => {
    try {
      const tokens = await this.getDefaultListSet();
      // You need to get all the latest data, and compare it with the local cached version. If there is a version update, the information will be returned
      let listsData: any = {};
      let localRes = this.getTokenListFromLocal();
      if (localRes.success) listsData = localRes.listsData;
      const jsonPromises: any[] = [];
      tokens.map((item: any) => {
        item.uri = item.uri.trim();
        const res: any = this.getTokenListFromUri(item.uri);
        if (res.success) jsonPromises.push(res.listData);
      });
      let res = await Promise.all(jsonPromises);
      const resObj: any = {};
      res.map(r => {
        resObj[r.uri] = { ...r };
      });
      const byUrlNew = resObj;
      tokens.map((item: any, i: number) => {
        const uri = item.uri;
        if (resObj[uri] && !listsData.byUrl[uri]) {
          // If there is no local cache, it is directly added, that is, the newly added list has no update prompt.
          if (Object.keys(listsData.byUrl).length < maxLists) {
            listsData.byUrl[uri] = { ...item, ...resObj[uri] };
            if (!listsData.selectedListUrl && Number(item.defaultList) === 1) {
              listsData.selectedListUrl = uri;
            }
          }
        }
        if (i === tokens.length - 1) {
          this.setTokensDataIntoLocal(listsData);
        }
      });
      return this.handleNotifiction(listsData, byUrlNew);
    } catch (err) {
      console.log(err);
      return {
        success: false,
        msg: err,
      };
    }
  };

  // Update list data
  updateTokenList = async (selectedListUrl: string, maxTokens = 100) => {
    try { 
      const res: any = await this.getTokenListFromUri(selectedListUrl);
      let jsonData: any = {};
      if (res.success) jsonData = res.listData;
      const { tokens = [] } = jsonData;

      // Whether the number of tokens in the list exceeds 100
      if (tokens.length > maxTokens) {
        const errInfo = {
          success: false,
          msg: `The number of tokens in the list exceeds ${maxTokens}.The list cannot be added`
        }
        return errInfo;
      }

      const { key = '', valid = false } = this.validateFunc(jsonData);

      // JSON data field validation
      if (!valid) {
        const errInfo = {
          success: false,
          msg: `Invalid ${key}. The list cannot be added`
        }
        return errInfo;
      }

      jsonData = { ...jsonData, uri: selectedListUrl, rs: 0 };

      let listsData: any = {};
      let localRes = this.getTokenListFromLocal();
      if (localRes.success) listsData = localRes.listsData;
      listsData.selectedListUrl = selectedListUrl;
      jsonData.tm = Date.now();
      listsData.byUrl[selectedListUrl] = jsonData;

      this.setTokensDataIntoLocal(listsData);
      return {
        success: true,
        listsData,
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        msg: err,
      };
    }
  };

  // Delete custom list
  deleteTokenList = (uri: string | number) => {
    let listsData: any = {};
    let localRes = this.getTokenListFromLocal();
    if (localRes.success) listsData = localRes.listsData;
    if (listsData?.byUrl[uri]) {
      delete listsData.byUrl[uri];
    } else {
      return {
        success: false,
        msg: 'The specified tokenlist does not exist or has been deleted',
      }
    }
    const res: any = this.setTokensDataIntoLocal(listsData);
    if (res?.byUrl?.uri) {
      return {
        success: false,
        msg: 'Delete specified tokenlist error'
      }
    } else {
      return {
        success: true,
      }
    }
  };
}

export const TokenListProvider = new TokenList();
