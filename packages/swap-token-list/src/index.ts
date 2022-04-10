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

export const setTokenList = async (type: number, cb = null) => {
  const isSwap = type === 1 || type === 2;
  try {
    const { byUrl = {}, selectedListUrl = '', solor = [] } = this;
    let allList = byUrl[selectedListUrl].tokens || [];
    const allListUnique = _.uniqBy(allList, 'address');
    if (allListUnique.length != allList.length) {
      allList = [];
    }
    let isToken = byUrl[selectedListUrl].isToken;
    if (isToken === undefined) {
      isToken = await ApiScanClient.isToken(allList.map(item => item.address));

      byUrl[selectedListUrl].isToken = Number(isToken);
      await this.updateByUrl(byUrl[selectedListUrl]);
    }
    if (Number(isToken) === 2) {
      allList = [];
    }
    const trxData = {
      tokenAddress: Config.trxFakeAddress,
      address: '',
      addressV1: '',
      addressV2: '',
      tokenSymbol: 'TRX',
      tokenLogoUrl: trxLogoUrl,
      tokenName: 'TRX',
      tokenDecimal: Config.trxDecimal,
      balance: this.rootStore.network.trxBalance
    };
    const { exchanges = {}, allExchanges = {} } = this;
    let list = [];
    let tokenData = {};
    if (isSwap) {
      tokenData = this.swapToken;
    } else {
      tokenData = this.liqToken;
    }
    allList.map(item => {
      if (item.address) {
        list.push({
          tokenAddress: item.address,
          address: exchanges[item.address] ? exchanges[item.address].e : null,
          addressV1:
            allExchanges && allExchanges[0] && allExchanges[0][item.address] ? allExchanges[0][item.address].e : null,
          addressV2:
            allExchanges && allExchanges[1] && allExchanges[1][item.address] ? allExchanges[1][item.address].e : null,
          tokenSymbol: item.symbol || '',
          tokenLogoUrl: item.logoURI || defaultLogoUrl,
          tokenName: item.name || '',
          tokenDecimal: item.decimals,
          // exchanges[item.address] && exchanges[item.address].d ? Number(exchanges[item.address].d) : item.decimals,
          balance: tokenData.tokenMap[item.address] ? tokenData.tokenMap[item.address].balance : '-'
        });
      }
    });
    const newSolor = solor.slice();
    // console.log(newSolor, allExchanges[1])
    solor.map(token => {
      const findIndex = _.findIndex(list, item => {
        return item.tokenAddress === token.tokenAddress;
      });
      if (findIndex >= 0) {
        _.remove(newSolor, itm => {
          return itm.tokenAddress === token.tokenAddress;
        });
      }
    });
    list = [trxData].concat(newSolor, list);
    const allTokenList = [];
    const tokenList = [];
    const tokenMap = {};
    list.map(token => {
      allTokenList.push(token);
      tokenList.push(token.tokenAddress);
      tokenMap[token.tokenAddress] = token;
    });

    if (isSwap) {
      this.swapToken.allTokenList = [...allTokenList];
      this.swapToken.tokenMap = { ...tokenMap };
      this.getTokenBalance(tokenList, this.swapToken.tokenMap);
    } else {
      this.liqToken.allTokenList = [...allTokenList];
      this.liqToken.tokenMap = { ...tokenMap };
      this.getTokenBalance(tokenList, this.liqToken.tokenMap);
    }
    this.searchTokenList(type);

    cb && cb();
  } catch (err) {
    console.log(err);
  }
};

export const getTokenListJson = async (tokens = []) => {
  try {
    const jsonPromises = [];
    tokens.map(item => {
      item.uri = item.uri.trim();
      jsonPromises.push(ApiScanClient.getTokenListJson(item.uri));
    });
    if (this.byUrl && Object.keys(this.byUrl).length > 0) {
      Object.keys(this.byUrl).map(key => {
        if (!!this.byUrl[key].cst) {
          jsonPromises.push(ApiScanClient.getTokenListJson(this.byUrl[key].uri));
        }
      });
    }
    let res = await Promise.all(jsonPromises);
    const resObj = {};
    res.map(r => {
      resObj[r.uri] = { ...r };
    });
    this.byUrlNew = resObj;
    tokens.map((item, i) => {
      const uri = item.uri;
      if (resObj[uri] && !this.byUrl[uri]) {
        if (Object.keys(this.byUrl).length < Config.maxLists) {
          this.byUrl[uri] = { ...item, ...resObj[uri] };
          if (!this.selectedListUrl && Number(item.defaultList) === 1) {
            this.selectedListUrl = uri;
          }
        }
      }
      if (i === tokens.length - 1) {
        this.setTokensDataIntoLocal();
      }
    });
    this.handleNotifiction();
  } catch (err) {
    console.log(err);
  }
};

export const getTokensDataFromLocal = () => {
  try {
    if (!window.localStorage.getItem('simpleLists')) return;
    const simpleListsStr = window.localStorage.getItem('simpleLists');
    const simpleLists = JSON.parse(simpleListsStr);
    const { byUrl = {}, selectedListUrl = '' } = simpleLists;
    const keyArr = Object.keys(byUrl);
    let res = {};
    keyArr.map(item => {
      if (byUrl[item].name !== 'JustSwap Default List') {
        res[item] = byUrl[item];
      }
    });
    // this.byUrl = byUrl;
    this.byUrl = res;

    // this.selectedListUrl = selectedListUrl;
    if (!res[selectedListUrl]) {
      this.selectedListUrl = keyArr[0];
    } else {
      this.selectedListUrl = selectedListUrl;
    }
    if (!window.localStorage.getItem('solor')) return;
    const solorStr = window.localStorage.getItem('solor');
    this.solor = JSON.parse(solorStr);
  } catch (err) {
    console.log(err);
  }
};

export const setTokensDataIntoLocal = () => {
  try {
    const simpleLists = {
      byUrl: this.byUrl,
      // lastInitializedList: this.lastInitializedList,
      selectedListUrl: this.selectedListUrl
    };
    window.localStorage.setItem('simpleLists', JSON.stringify(simpleLists));
  } catch (err) {}
};

export const updateTokensData = (selectedListUrl, jsonData) => {
  try {
    this.selectedListUrl = selectedListUrl;
    jsonData.cst = true;
    jsonData.tm = Date.now();
    this.byUrl[selectedListUrl] = jsonData;
    // this.lastInitializedList.push(selectedListUrl);
    this.setTokensDataIntoLocal();
  } catch (err) {
    console.log(err);
  }
};

export const updateByUrl = async item => {
  try {
    const oldItem = this.byUrl[item.uri];
    if (item.isToken === undefined) {
      item.isToken = await ApiScanClient.isToken(item.tokens.map(t => t.address));
    }
    this.byUrl[item.uri] = { ...oldItem, ...item };
    this.setTokensDataIntoLocal();
  } catch (err) {
    console.log(err);
  }
};

export const updateByUrlNew = n => {
  const on = this.byUrlNew[n.uri] || {};
  this.byUrlNew[n.uri] = { ...on, ...n };
};

export const deleteByUrlById = uri => {
  delete this.byUrl[uri];
  this.setTokensDataIntoLocal();
};