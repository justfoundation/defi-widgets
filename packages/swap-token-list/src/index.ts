import axios from 'axios';
import _ from 'lodash';
import BigNumber from 'bignumber.js';

export const getKeys = (byUrl: { [x: string]: { name: number; }; }) => {
  try {
    const keys = Object.keys(byUrl);
    const keysArr = keys.sort((a, b) => {
      return byUrl[a].name > byUrl[b].name ? 1 : -1;
    });
    return keysArr;
  } catch (err) {
    return [];
  }
};

export const randomSleep = (time = 1000) => {
  return new Promise<void>((reslove) => {
    const timeout = parseInt((Math.random() * time).toString());
    setTimeout(() => {
      reslove();
    }, timeout);
  });
};

export const reTry: any = async (func: any) => {
  try {
    await randomSleep(1000);
    return await func();
  } catch (error) {
    console.log(error);
    await randomSleep(3000);
    return await reTry(func);
  }
};

export const isToken = async (tokens: any[], tronweb = null) => {
  const tronWeb = tronweb || (window as any).tronWeb;
  const res = await tronWeb.fullNode;
  const { host } = res;
  const apiUrl = host === 'https://api.trongrid.io' ? 'https://abc.ablesdxd.link/swap' : 'http://123.56.166.152:10088/swap';

  const _getData = async () => {
    const res = await axios.get(`${apiUrl}${isToken}`, { params: { addrs: tokens.join(',') } });
    if (res.data.code === 0) {
      const data = res.data.data || {};
      const arr = Object.keys(data);
      return arr.some(item => !data[item]) ? 2 : 1;
    } else {
      return 1;
    }
  };
  return reTry(_getData);
}

export const getTrxBalance = async (address: string, tronweb = null) => {
  try {
    const tronWeb = tronweb || (window as any).tronWeb;
    const balance = await tronWeb.trx.getBalance(address);
    return new BigNumber(balance).div(1e6);
  } catch (err) {
    console.log(`getTrxBalance: ${err}`, address);
    return '--';
  }
};

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

export const updateByUrl = async (item: any) => {
  try {
    let listsData = getTokensDataFromLocal();
    const oldItem = listsData.byUrl[item.uri];
    if (item.isToken === undefined) {
      item.isToken = await isToken(item.tokens.map((t: { address: any; }) => t.address));
    }
    listsData.byUrl[item.uri] = { ...oldItem, ...item };
    setTokensDataIntoLocal(listsData);
  } catch (err) {
    console.log(err);
  }
};

export const getVersion = (v: { major?: 0 | undefined; minor?: 0 | undefined; patch?: 0 | undefined; }) => {
  try {
    const { major = 0, minor = 0, patch = 0 } = v;
    return String(major) + '.' + String(minor) + '.' + String(patch);
  } catch (err) {
    console.log(err);
    return '';
  }
};

export const checkVersionLater = (o: any, n: any) => {
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

export const checkTokenChanged = (o: any, n: any, maxTokens = 100) => {
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

export const handleNotifiction = async (listsData: { byUrl: any; selectedListUrl: any; }, byUrlNew: { [x: string]: any; }) => {
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

export const getTokenListJson = async (tokens = [], { maxLists = 20 }) => {
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
    tokens.map((item: any, i) => {
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
    handleNotifiction(listsData, byUrlNew);
  } catch (err) {
    console.log(err);
  }
};

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

export const setTokensDataIntoLocal = (listsData: any) => {
  try {
    window.localStorage.setItem('simpleLists', JSON.stringify(listsData));
  } catch (err) {}
};

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

export const deleteByUrlById = (uri: string | number) => {
  let listsData = getTokensDataFromLocal();
  delete listsData.byUrl[uri];
  setTokensDataIntoLocal(listsData);
};