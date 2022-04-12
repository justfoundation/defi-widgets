import axios from 'axios';
import _ from 'lodash';
import validator from 'validator';

const TOKENS_ELEMENT = {
  chainId: '',
  address: '',
  name: '',
  symbol: '',
  decimals: '',
  logoURI: ''
};

const JSON_ELEMENT = {
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

const getVersion = (v: { major?: 0 | undefined; minor?: 0 | undefined; patch?: 0 | undefined; }) => {
  try {
    const { major = 0, minor = 0, patch = 0 } = v;
    return String(major) + '.' + String(minor) + '.' + String(patch);
  } catch (err) {
    console.log(err);
    return '';
  }
};

const checkVersionLater = (o: any, n: any) => {
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

const checkTokenChanged = (o: any, n: any, maxTokens = 100) => {
  try {
    const res = {
      success: false,
      addTokens: [],
      delTokens: [],
      updateTokens: []
    };
    const oVersion = o.version;
    const nVersion = n.version;
    const isVersionLater = checkVersionLater(oVersion, nVersion);
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

const handleNotifiction = async (listsData: { byUrl: any; selectedListUrl: any; }, byUrlNew: { [x: string]: any; }) => {
  try {
    const { byUrl, selectedListUrl } = listsData;
    const o = byUrl[selectedListUrl];
    const n = byUrlNew[selectedListUrl];
    const oVersion = o.version;
    const nVersion = n.version;
    const { success = false, addTokens, delTokens, updateTokens } = checkTokenChanged(o, n);
    let notificationInfo = {};
    if (success) {
      notificationInfo = {
        addTokens,
        delTokens,
        updateTokens,
        versionOld: getVersion(oVersion),
        versionNew: getVersion(nVersion),
        categoryName: o.name,
      };
    }
    return notificationInfo;
  } catch (err) {
    console.log(err);
    return {};
  }
};

const isValidURL = (url: string) => {
  if (typeof url !== 'string') return false;
  return validator.isURL(url.toString(), {
    protocols: ['http', 'https'],
    require_tld: true,
    require_protocol: true
  });
};

const isListsOver = (lists = {}, maxLists = 20) => {
  return Object.keys(lists).length >= maxLists;
};

const isNotEmptyString = (str: string, tronweb = null) => {
  const tronWeb = tronweb || (window as any).tronWeb;
  return tronWeb.utils.isString(str) && str != '';
};

const isPositiveInteger = (num: number, tronweb = null) => {
  const tronWeb = tronweb || (window as any).tronWeb;
  return typeof num === 'number' && tronWeb.utils.isInteger(num) && num > 0;
};

const isTimestamp = (timestamp: number) => {
  return isPositiveInteger(timestamp) && String(timestamp).length === 13;
};

const hasSpace = (str: string) => {
  var reg = /(^\s+)|(\s+$)|\s+/g;

  return reg.test(str);
};

const tokensElementValidate: any = {
  chainId: (chainId: number) => {
    return isPositiveInteger(chainId) && chainId >= 1 && chainId <= 10; // Chainid ：需要是数字，1-10之间；
  },
  address: (address: any, tronweb = null) => {
    const tronWeb = tronweb || (window as any).tronWeb;
    return tronWeb.isAddress(address);
  },
  name: (name: string) => {
    return isNotEmptyString(name);
  },
  symbol: (symbol: string) => {
    return isNotEmptyString(symbol) && !hasSpace(symbol);
  },
  decimals: (decimals: number) => {
    return isGteZeroInteger(decimals) && decimals <= 256;
  },
  logoURI: (logoURI: string) => {
    return isValidURL(logoURI);
  }
};

const tokensValidate = (tokens: string | any[], tronweb = null) => {
    const tronWeb = tronweb || (window as any).tronWeb;
    if (!tronWeb.utils.isArray(tokens) || tokens.length === 0) {
    return false;
  }
  let flag = true;
  const len1 = tokens.length;
  for (let j = 0; j < len1; j++) {
    const t = tokens[j];
    const element = Object.assign({ ...TOKENS_ELEMENT }, t);
    const elementArr = Object.keys(element);
    const length = elementArr.length;
    for (let i = 0; i < length; i++) {
      const key = elementArr[i];
      const e = element[key];
      if ((tokensElementValidate[key] && !tokensElementValidate[key](e)) || !tokensElementValidate[key]) {
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

const isGteZeroInteger = (num: number, tronweb = null) => {
  const tronWeb = tronweb || (window as any).tronWeb;
  return typeof num === 'number' && tronWeb.utils.isInteger(num) && num >= 0;
};

const jsonValidate: any = {
  name: (name: any) => {
    return isNotEmptyString(name);
  },
  logoURI: (logoURI: string) => {
    return isValidURL(logoURI);
  },
  timestamp: (timestamp: any) => {
    return isTimestamp(timestamp);
  },
  tokens: (tokens: any) => {
    return tokensValidate(tokens);
  },
  version: (version: { major: any; minor: any; patch: any; }, tronweb = null) => {
  const tronWeb = tronweb || (window as any).tronWeb;
  return (
      tronWeb.utils.isObject(version) &&
      isGteZeroInteger(version.major) &&
      isGteZeroInteger(version.minor) &&
      isGteZeroInteger(version.patch)
    );
  }
};

const validateFunc = (target: any) => {
  const json = Object.assign({ ...JSON_ELEMENT }, target);

  const keysArr = Object.keys(json);
  const length = keysArr.length;
  const res = { key: '', valid: true };
  for (let i = 0; i < length; i++) {
    const key = keysArr[i];
    if ((jsonValidate[key] && !jsonValidate[key](json[key])) || (!jsonValidate[key] && key !== 'uri')) {
      // uri is added manually, without verification
      res.key = key;
      res.valid = false;
      break;
    }
  }
  return res;
};

const setTokensDataIntoLocal = (listsData: any) => {
  try {
    window.localStorage.setItem('simpleLists', JSON.stringify(listsData));
  } catch (err) {}
};

// Add tokenlist
export const addCustomTokens = async (customTokenUri: string, byUrl: any, maxLists = 20, maxTokens = 100) => {
  try {
    // 1. The address is invalid  2. The address already exists locally 3. The request returns an error code 4. The format of the returned data is incorrect
    if (!isValidURL(customTokenUri)) {
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
    if (isListsOver(byUrl)) {
      const errInfo = {
        success: false,
        msg: `You have more than ${maxLists} lists.The list cannot be added`
      }
      return errInfo;
    }
    const jsonData: any = await getTokenListJson(customTokenUri);
    const { tokens = [] } = jsonData;

    // Whether the number of tokens in the list exceeds 100
    if (tokens.length > maxTokens) {
      const errInfo = {
        success: false,
        msg: `The number of tokens in the list exceeds ${maxTokens}.The list cannot be added`
      }
      return errInfo;
    }

    const { key = '', valid = false } = validateFunc(jsonData);

    // JSON data field validation
    if (!valid) {
      const errInfo = {
        success: false,
        msg: `Invalid ${key}. The list cannot be added`
      }
      return errInfo;
    }
    updateTokensData(customTokenUri, { ...jsonData, uri: customTokenUri, rs: 0 });
    return {
      success: true,
    }
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

// Get tokens data from backend
export const getLastestTokenList = async (uri: string) => {
  try {
    const res = await axios.get(uri);
    const obj = res && res.data ? res.data : null;
    if (typeof obj !== 'object' || obj === null) {
      return null;
    }
    return { ...res.data, uri };
  } catch (err) {
    console.log(err);
    return null;
  }
};

// Get list data update information
export const getTokenListJson = async (tokens: any = [], { maxLists = 20 } = {}) => {
  try {
    // You need to get all the latest data, and compare it with the local cached version. If there is a version update, the information will be returned
    let listsData = getTokensDataFromLocal();
    const jsonPromises: any[] = [];
    tokens.map((item: any) => {
      item.uri = item.uri.trim();
      jsonPromises.push(getLastestTokenList(item.uri));
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
        setTokensDataIntoLocal(listsData);
      }
    });
    return handleNotifiction(listsData, byUrlNew);
  } catch (err) {
    console.log(err);
    return null;
  }
};

// Get tokens data from local cache
export const getTokensDataFromLocal = () => {
  try {
    if (!window.localStorage.getItem('simpleLists')) return;
    const simpleListsStr = window.localStorage.getItem('simpleLists') || '';
    const simpleLists = JSON.parse(simpleListsStr);
    const { byUrl = {}, selectedListUrl = '' } = simpleLists;
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
    return listsData;
  } catch (err) {
    console.log(err);
    return {};
  }
};

// Update list data
export const updateTokensData = (selectedListUrl: string | number, jsonData: { tm: number; }) => {
  try {
    let listsData = getTokensDataFromLocal();
    listsData.selectedListUrl = selectedListUrl;
    jsonData.tm = Date.now();
    listsData.byUrl[selectedListUrl] = jsonData;

    setTokensDataIntoLocal(listsData);
  } catch (err) {
    console.log(err);
  }
};

// Delete custom list
export const deleteByUrlById = (uri: string | number) => {
  let listsData = getTokensDataFromLocal();
  delete listsData.byUrl[uri];
  setTokensDataIntoLocal(listsData);
};