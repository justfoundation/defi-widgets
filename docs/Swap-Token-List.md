# Swap Token List


## Introduction
As the Crypto space continues to evolve, we continue to see exponential growth in the number of tokens being issued. This maturation reflects the success of permissionless innovation, a trend we expect will only accelerate in the future: everything of value will be tokenized.

As the rate of token issuance accelerates, it has become increasingly difficult for users to filter out high quality, legitimate tokens from scams, fakes, and duplicates. Across the space, projects are managing and maintaining rapidly growing token lists. The end result is a lot of wasted time, slow listing processes and scammed users. In addition, builders should spend their time building, not deciding which tokens are legitimate and which are scams, fakes or duplicates.

Token List is a community-led initiative to improve discoverability and trust in a manner that is inclusive, transparent, and decentralized. By following a standard JSON schema and can be hosted publicly on ENS, IPFS, and HTTPS.


## Available functions
  1. [getTokenListFromUri](#gettokenlistfromuri)
  2. [addTokenList](#addtokenlist)
  3. [addDefaultTokenList](#adddefaulttokenlist)
  4. [getTokenListFromLocal](#getTokenListFromLocal)
  5. [getUpdateInfo](#getupdateinfo)
  6. [updateTokenList](#updatetokenlist)
  7. [deleteTokenList](#deletetokenlist)


## Implementation tips
  Clone the repo or copy "~/packages/swap-token-list/" and import it as local dependency with the preferred name "@widgets/swap-token-list" in package.json.
  ```
  "dependencies": {
    ...
    "@widgets/swap-token-list": "file:../packages/swap-token-list/",
    ...
  }
  ```

  Import it at the top of your code.
  ```
  import { TokenListProvider } from "@widgets/swap-token-list";
  ```

  Token list URI for testing
  ```
  const testTokenListUri = "https://raw.githubusercontent.com/BlackChar92/tokenlist/main/testlist.json";
  ```

  SunSwap Default List
  ```
  const sunSwapDefaultListUri = "https://list.justswap.link/justswap.json"
  ```

  All functions are [asynchronous](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) and the await keyword is permitted within it. The return type is [Promise object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).\

  Return response type in Promise:
  ```
  interface ResultType {
    success: boolean;
    msg?: string;
    data?: any;
  }
  ```

  ResultType.success indicates the status of the executing the function.

  Check "~/defi-demo/src/routes/tokenList.js" for real world implementation.

  Check "~/packages/swap-token-list/src/index.ts" or "~/packages/swap-token-list/dist/index.d.ts" for code source.


## Time to BUIDL!

## getTokenListFromUri
  ### parameters:
  ```
  (uri: string)
  ```

  ### example:
  ```
  const response = await TokenListProvider.getTokenListFromUri(testTokenListUri);
  ```

  ### response:
  ```
  {
    "success": true,
    "data": {
        "name": "BTC-Chain",
        "logoURI": "https://nile.tronscan.org/upload/logo/1000193.png",
        "timestamp": 1600222146000,
        "tokens": [
            {
                "chainId": 1,
                "address": "TAjuAs2WWtyR6mQrpaxHYCpvVYaC2KwGAK",
                "name": "BitCoin",
                "symbol": "BTC",
                "decimals": 8,
                "logoURI": "https://coin.top/production/logo/TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9.png"
            }
        ],
        "version": {
            "major": 1,
            "minor": 0,
            "patch": 0
        },
        "uri": "https://raw.githubusercontent.com/BlackChar92/tokenlist/main/testlist.json"
    }
  }
  ```

## addTokenList
  ### parameters:
  ```
  (customTokenUri: string, maxLists?: number, maxTokens?: number)
  ```

  ### example:
  ```
  const response = await TokenListProvider.addTokenList(testTokenListUri);
  ```

  ### response:
  ```
  {
    "success": true,
    "data": {
        "byUrl": {
            "https://list.justswap.link/justswap.json": {
                "name": "SunSwap Default List",
                "tokens": [
                    {
                        "symbol": "USDC",
                        "address": "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "USD Coin",
                        "logoURI": "https://coin.top/production/upload/logo/TEkxiTehnzSmSe2XqrBj4w32RUN966rdz81.png"
                    },
                    {
                        "symbol": "SUN",
                        "address": "TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "SUN",
                        "logoURI": "https://coin.top/production/logo/TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S.png"
                    },
                    {
                        "symbol": "BTT",
                        "address": "TAFjULxiVgT4qWk6UZwjqwZXTSaGaqnVp4",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "BitTorrent",
                        "logoURI": "https://coin.top/production/logo/1002000.png"
                    },
                    {
                        "symbol": "SUNOLD",
                        "address": "TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "SUNOLD",
                        "logoURI": "https://coin.top/production/logo/SUNLogo.178d4636.png"
                    },
                    {
                        "symbol": "NFT",
                        "address": "TFczxzPhnThNSqr5by8tvxsdCFRRz6cPNq",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "APENFT",
                        "logoURI": "https://coin.top/production/upload/logo/TFczxzPhnThNSqr5by8tvxsdCFRRz6cPNq.png"
                    },
                    {
                        "symbol": "BTC",
                        "address": "TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9",
                        "chainId": 1,
                        "decimals": 8,
                        "name": "Bitcoin",
                        "logoURI": "https://coin.top/production/logo/TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9.png"
                    },
                    {
                        "symbol": "WBTC",
                        "address": "TXpw8XeWYeTUd4quDskoUqeQPowRh4jY65",
                        "chainId": 1,
                        "decimals": 8,
                        "name": "Wrapped BTC",
                        "logoURI": "https://coin.top/production/logo/TXpw8XeWYeTUd4quDskoUqeQPowRh4jY65.png"
                    },
                    {
                        "symbol": "ETH",
                        "address": "THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "Ethereum",
                        "logoURI": "https://coin.top/production/logo/THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF.png"
                    },
                    {
                        "symbol": "WETH",
                        "address": "TXWkP3jLBqRGojUih1ShzNyDaN5Csnebok",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "Wrapped ETH",
                        "logoURI": "https://coin.top/production/logo/TXWkP3jLBqRGojUih1ShzNyDaN5Csnebok.png"
                    },
                    {
                        "symbol": "WBTT",
                        "address": "TKfjV9RNKJJCqPvBtK8L7Knykh7DNWvnYt",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "Wrapped BitTorrent",
                        "logoURI": "https://coin.top/production/logo/TKfjV9RNKJJCqPvBtK8L7Knykh7DNWvnYt.png"
                    },
                    {
                        "symbol": "WTRX",
                        "address": "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "Wrapped TRX",
                        "logoURI": "https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png"
                    },
                    {
                        "symbol": "JST",
                        "address": "TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "JUST GOV v1.0",
                        "logoURI": "https://coin.top/production/logo/just_icon.png"
                    },
                    {
                        "symbol": "WIN",
                        "address": "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "WINK",
                        "logoURI": "https://coin.top/profile_images/JKtJTydD_400x400.jpg"
                    },
                    {
                        "symbol": "DICE",
                        "address": "TKttnV3FSY1iEoAwB4N52WK2DxdV94KpSd",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "TRONbetDice",
                        "logoURI": "https://coin.top/production/logo/TKttnV3FSY1iEoAwB4N52WK2DxdV94KpSd.jpg"
                    },
                    {
                        "symbol": "LIVE",
                        "address": "TVgAYofpQku5G4zenXnvxhbZxpzzrk8WVK",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "TRONbetLive",
                        "logoURI": "https://coin.top/production/upload/logo/TVgAYofpQku5G4zenXnvxhbZxpzzrk8WVK.png"
                    },
                    {
                        "symbol": "USDT",
                        "address": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "Tether USD",
                        "logoURI": "https://coin.top/production/logo/usdtlogo.png"
                    },
                    {
                        "symbol": "USDJ",
                        "address": "TMwFHYXLJaRUPeW6421aqXL4ZEzPRFGkGT",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "JUST Stablecoin v1.0",
                        "logoURI": "https://coin.top/production/logo/usdj.png"
                    },
                    {
                        "symbol": "TUSD",
                        "address": "TUpMhErZL2fhh4sVNULAbNKLokS4GjC1F4",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "TrueUSD",
                        "logoURI": "https://coin.top/production/logo/TUpMhErZL2fhh4sVNULAbNKLokS4GjC1F4.png"
                    },
                    {
                        "symbol": "LTC",
                        "address": "TR3DLthpnDdCGabhVDbD3VMsiJoCXY3bZd",
                        "chainId": 1,
                        "decimals": 8,
                        "name": "Litecoin",
                        "logoURI": "https://coin.top/production/logo/TR3DLthpnDdCGabhVDbD3VMsiJoCXY3bZd.png"
                    },
                    {
                        "symbol": "HT",
                        "address": "TDyvndWuvX5xTBwHPYJi7J3Yq8pq8yh62h",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "HuobiToken",
                        "logoURI": "https://coin.top/production/logo/TDyvndWuvX5xTBwHPYJi7J3Yq8pq8yh62h.png"
                    },
                    {
                        "symbol": "USDD",
                        "address": "TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "Decentralized USD",
                        "logoURI": "https://coin.top/production/upload/logo/TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn.svg"
                    }
                ],
                "logoURI": "https://sun.io/favicon.ico",
                "version": {
                    "patch": 0,
                    "major": 1,
                    "minor": 7
                },
                "timestamp": 1651744145000,
                "uri": "https://list.justswap.link/justswap.json",
                "rs": 0,
                "tm": 1653491480499
            },
            "https://raw.githubusercontent.com/BlackChar92/tokenlist/main/testlist.json": {
                "name": "BTC-Chain",
                "logoURI": "https://nile.tronscan.org/upload/logo/1000193.png",
                "timestamp": 1600222146000,
                "tokens": [
                    {
                        "chainId": 1,
                        "address": "TAjuAs2WWtyR6mQrpaxHYCpvVYaC2KwGAK",
                        "name": "BitCoin",
                        "symbol": "BTC",
                        "decimals": 8,
                        "logoURI": "https://coin.top/production/logo/TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9.png"
                    }
                ],
                "version": {
                    "major": 1,
                    "minor": 0,
                    "patch": 0
                },
                "uri": "https://raw.githubusercontent.com/BlackChar92/tokenlist/main/testlist.json",
                "rs": 0,
                "tm": 1653493660450
            }
        },
        "selectedListUrl": "https://raw.githubusercontent.com/BlackChar92/tokenlist/main/testlist.json"
    }
  }
  ```

## addDefaultTokenList
  ### parameters:
  ```
  ()  // no parameter is needed
  ```

  ### example:
  ```
  const response = await TokenListProvider.addDefaultTokenList();
  ```

  ### response (success):
  ```
  {
    "success": true,
    "data": {
        "byUrl": {
            "https://list.justswap.link/justswap.json": {
                "name": "SunSwap Default List",
                "tokens": [
                    {
                        "symbol": "USDC",
                        "address": "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "USD Coin",
                        "logoURI": "https://coin.top/production/upload/logo/TEkxiTehnzSmSe2XqrBj4w32RUN966rdz81.png"
                    },
                    {
                        "symbol": "SUN",
                        "address": "TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "SUN",
                        "logoURI": "https://coin.top/production/logo/TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S.png"
                    },
                    {
                        "symbol": "BTT",
                        "address": "TAFjULxiVgT4qWk6UZwjqwZXTSaGaqnVp4",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "BitTorrent",
                        "logoURI": "https://coin.top/production/logo/1002000.png"
                    },
                    {
                        "symbol": "SUNOLD",
                        "address": "TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "SUNOLD",
                        "logoURI": "https://coin.top/production/logo/SUNLogo.178d4636.png"
                    },
                    {
                        "symbol": "NFT",
                        "address": "TFczxzPhnThNSqr5by8tvxsdCFRRz6cPNq",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "APENFT",
                        "logoURI": "https://coin.top/production/upload/logo/TFczxzPhnThNSqr5by8tvxsdCFRRz6cPNq.png"
                    },
                    {
                        "symbol": "BTC",
                        "address": "TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9",
                        "chainId": 1,
                        "decimals": 8,
                        "name": "Bitcoin",
                        "logoURI": "https://coin.top/production/logo/TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9.png"
                    },
                    {
                        "symbol": "WBTC",
                        "address": "TXpw8XeWYeTUd4quDskoUqeQPowRh4jY65",
                        "chainId": 1,
                        "decimals": 8,
                        "name": "Wrapped BTC",
                        "logoURI": "https://coin.top/production/logo/TXpw8XeWYeTUd4quDskoUqeQPowRh4jY65.png"
                    },
                    {
                        "symbol": "ETH",
                        "address": "THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "Ethereum",
                        "logoURI": "https://coin.top/production/logo/THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF.png"
                    },
                    {
                        "symbol": "WETH",
                        "address": "TXWkP3jLBqRGojUih1ShzNyDaN5Csnebok",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "Wrapped ETH",
                        "logoURI": "https://coin.top/production/logo/TXWkP3jLBqRGojUih1ShzNyDaN5Csnebok.png"
                    },
                    {
                        "symbol": "WBTT",
                        "address": "TKfjV9RNKJJCqPvBtK8L7Knykh7DNWvnYt",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "Wrapped BitTorrent",
                        "logoURI": "https://coin.top/production/logo/TKfjV9RNKJJCqPvBtK8L7Knykh7DNWvnYt.png"
                    },
                    {
                        "symbol": "WTRX",
                        "address": "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "Wrapped TRX",
                        "logoURI": "https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png"
                    },
                    {
                        "symbol": "JST",
                        "address": "TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "JUST GOV v1.0",
                        "logoURI": "https://coin.top/production/logo/just_icon.png"
                    },
                    {
                        "symbol": "WIN",
                        "address": "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "WINK",
                        "logoURI": "https://coin.top/profile_images/JKtJTydD_400x400.jpg"
                    },
                    {
                        "symbol": "DICE",
                        "address": "TKttnV3FSY1iEoAwB4N52WK2DxdV94KpSd",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "TRONbetDice",
                        "logoURI": "https://coin.top/production/logo/TKttnV3FSY1iEoAwB4N52WK2DxdV94KpSd.jpg"
                    },
                    {
                        "symbol": "LIVE",
                        "address": "TVgAYofpQku5G4zenXnvxhbZxpzzrk8WVK",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "TRONbetLive",
                        "logoURI": "https://coin.top/production/upload/logo/TVgAYofpQku5G4zenXnvxhbZxpzzrk8WVK.png"
                    },
                    {
                        "symbol": "USDT",
                        "address": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "Tether USD",
                        "logoURI": "https://coin.top/production/logo/usdtlogo.png"
                    },
                    {
                        "symbol": "USDJ",
                        "address": "TMwFHYXLJaRUPeW6421aqXL4ZEzPRFGkGT",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "JUST Stablecoin v1.0",
                        "logoURI": "https://coin.top/production/logo/usdj.png"
                    },
                    {
                        "symbol": "TUSD",
                        "address": "TUpMhErZL2fhh4sVNULAbNKLokS4GjC1F4",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "TrueUSD",
                        "logoURI": "https://coin.top/production/logo/TUpMhErZL2fhh4sVNULAbNKLokS4GjC1F4.png"
                    },
                    {
                        "symbol": "LTC",
                        "address": "TR3DLthpnDdCGabhVDbD3VMsiJoCXY3bZd",
                        "chainId": 1,
                        "decimals": 8,
                        "name": "Litecoin",
                        "logoURI": "https://coin.top/production/logo/TR3DLthpnDdCGabhVDbD3VMsiJoCXY3bZd.png"
                    },
                    {
                        "symbol": "HT",
                        "address": "TDyvndWuvX5xTBwHPYJi7J3Yq8pq8yh62h",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "HuobiToken",
                        "logoURI": "https://coin.top/production/logo/TDyvndWuvX5xTBwHPYJi7J3Yq8pq8yh62h.png"
                    },
                    {
                        "symbol": "USDD",
                        "address": "TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "Decentralized USD",
                        "logoURI": "https://coin.top/production/upload/logo/TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn.svg"
                    }
                ],
                "logoURI": "https://sun.io/favicon.ico",
                "version": {
                    "patch": 0,
                    "major": 1,
                    "minor": 7
                },
                "timestamp": 1651744145000,
                "uri": "https://list.justswap.link/justswap.json",
                "rs": 0,
                "tm": 1653494173286
            }
        },
        "selectedListUrl": "https://list.justswap.link/justswap.json"
    }
  }
  ```

  ### response (fail):
  ```
  {
    "success": false,
    "msg": "error: Already exists in the list"
  }
  ```

## getTokenListFromLocal
  ### parameters:
  ```
  ()  // no parameter is needed
  ```

  ### example:
  ```
  const response = await TokenListProvider.getTokenListFromLocal();
  ```

  ### response:
  ```
  {
    "success": true,
    "data": {
        "byUrl": {
            "https://list.justswap.link/justswap.json": {
                "name": "SunSwap Default List",
                "tokens": [
                    {
                        "symbol": "USDC",
                        "address": "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "USD Coin",
                        "logoURI": "https://coin.top/production/upload/logo/TEkxiTehnzSmSe2XqrBj4w32RUN966rdz81.png"
                    },
                    {
                        "symbol": "SUN",
                        "address": "TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "SUN",
                        "logoURI": "https://coin.top/production/logo/TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S.png"
                    },
                    {
                        "symbol": "BTT",
                        "address": "TAFjULxiVgT4qWk6UZwjqwZXTSaGaqnVp4",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "BitTorrent",
                        "logoURI": "https://coin.top/production/logo/1002000.png"
                    },
                    {
                        "symbol": "SUNOLD",
                        "address": "TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "SUNOLD",
                        "logoURI": "https://coin.top/production/logo/SUNLogo.178d4636.png"
                    },
                    {
                        "symbol": "NFT",
                        "address": "TFczxzPhnThNSqr5by8tvxsdCFRRz6cPNq",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "APENFT",
                        "logoURI": "https://coin.top/production/upload/logo/TFczxzPhnThNSqr5by8tvxsdCFRRz6cPNq.png"
                    },
                    {
                        "symbol": "BTC",
                        "address": "TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9",
                        "chainId": 1,
                        "decimals": 8,
                        "name": "Bitcoin",
                        "logoURI": "https://coin.top/production/logo/TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9.png"
                    },
                    {
                        "symbol": "WBTC",
                        "address": "TXpw8XeWYeTUd4quDskoUqeQPowRh4jY65",
                        "chainId": 1,
                        "decimals": 8,
                        "name": "Wrapped BTC",
                        "logoURI": "https://coin.top/production/logo/TXpw8XeWYeTUd4quDskoUqeQPowRh4jY65.png"
                    },
                    {
                        "symbol": "ETH",
                        "address": "THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "Ethereum",
                        "logoURI": "https://coin.top/production/logo/THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF.png"
                    },
                    {
                        "symbol": "WETH",
                        "address": "TXWkP3jLBqRGojUih1ShzNyDaN5Csnebok",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "Wrapped ETH",
                        "logoURI": "https://coin.top/production/logo/TXWkP3jLBqRGojUih1ShzNyDaN5Csnebok.png"
                    },
                    {
                        "symbol": "WBTT",
                        "address": "TKfjV9RNKJJCqPvBtK8L7Knykh7DNWvnYt",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "Wrapped BitTorrent",
                        "logoURI": "https://coin.top/production/logo/TKfjV9RNKJJCqPvBtK8L7Knykh7DNWvnYt.png"
                    },
                    {
                        "symbol": "WTRX",
                        "address": "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "Wrapped TRX",
                        "logoURI": "https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png"
                    },
                    {
                        "symbol": "JST",
                        "address": "TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "JUST GOV v1.0",
                        "logoURI": "https://coin.top/production/logo/just_icon.png"
                    },
                    {
                        "symbol": "WIN",
                        "address": "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "WINK",
                        "logoURI": "https://coin.top/profile_images/JKtJTydD_400x400.jpg"
                    },
                    {
                        "symbol": "DICE",
                        "address": "TKttnV3FSY1iEoAwB4N52WK2DxdV94KpSd",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "TRONbetDice",
                        "logoURI": "https://coin.top/production/logo/TKttnV3FSY1iEoAwB4N52WK2DxdV94KpSd.jpg"
                    },
                    {
                        "symbol": "LIVE",
                        "address": "TVgAYofpQku5G4zenXnvxhbZxpzzrk8WVK",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "TRONbetLive",
                        "logoURI": "https://coin.top/production/upload/logo/TVgAYofpQku5G4zenXnvxhbZxpzzrk8WVK.png"
                    },
                    {
                        "symbol": "USDT",
                        "address": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "Tether USD",
                        "logoURI": "https://coin.top/production/logo/usdtlogo.png"
                    },
                    {
                        "symbol": "USDJ",
                        "address": "TMwFHYXLJaRUPeW6421aqXL4ZEzPRFGkGT",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "JUST Stablecoin v1.0",
                        "logoURI": "https://coin.top/production/logo/usdj.png"
                    },
                    {
                        "symbol": "TUSD",
                        "address": "TUpMhErZL2fhh4sVNULAbNKLokS4GjC1F4",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "TrueUSD",
                        "logoURI": "https://coin.top/production/logo/TUpMhErZL2fhh4sVNULAbNKLokS4GjC1F4.png"
                    },
                    {
                        "symbol": "LTC",
                        "address": "TR3DLthpnDdCGabhVDbD3VMsiJoCXY3bZd",
                        "chainId": 1,
                        "decimals": 8,
                        "name": "Litecoin",
                        "logoURI": "https://coin.top/production/logo/TR3DLthpnDdCGabhVDbD3VMsiJoCXY3bZd.png"
                    },
                    {
                        "symbol": "HT",
                        "address": "TDyvndWuvX5xTBwHPYJi7J3Yq8pq8yh62h",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "HuobiToken",
                        "logoURI": "https://coin.top/production/logo/TDyvndWuvX5xTBwHPYJi7J3Yq8pq8yh62h.png"
                    },
                    {
                        "symbol": "USDD",
                        "address": "TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "Decentralized USD",
                        "logoURI": "https://coin.top/production/upload/logo/TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn.svg"
                    }
                ],
                "logoURI": "https://sun.io/favicon.ico",
                "version": {
                    "patch": 0,
                    "major": 1,
                    "minor": 7
                },
                "timestamp": 1651744145000,
                "uri": "https://list.justswap.link/justswap.json",
                "rs": 0,
                "tm": 1653494173286
            }
        },
        "selectedListUrl": "https://list.justswap.link/justswap.json"
    }
  }
  ```

## getUpdateInfo
  ### parameters:
  ```
  ({ maxLists }?: { maxLists?: number | undefined; })
  ```

  ### example:
  ```
  const response = await TokenListProvider.getUpdateInfo();
  ```

  ### response (fail due to no data updated):
  ```
  {
    "success": false,
    "msg": "error: No listings have updated content"
  }
  ```

## updateTokenList
  ### parameters:
  ```
  (selectedListUrl: string, maxTokens?: number)
  ```

  ### example:
  ```
  const response = await TokenListProvider.updateTokenList(testTokenListUri);
  ```

  ### response:
  ```
  {
    "success": true,
    "data": {
        "byUrl": {
            "https://list.justswap.link/justswap.json": {
                "name": "SunSwap Default List",
                "tokens": [
                    {
                        "symbol": "USDC",
                        "address": "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "USD Coin",
                        "logoURI": "https://coin.top/production/upload/logo/TEkxiTehnzSmSe2XqrBj4w32RUN966rdz81.png"
                    },
                    {
                        "symbol": "SUN",
                        "address": "TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "SUN",
                        "logoURI": "https://coin.top/production/logo/TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S.png"
                    },
                    {
                        "symbol": "BTT",
                        "address": "TAFjULxiVgT4qWk6UZwjqwZXTSaGaqnVp4",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "BitTorrent",
                        "logoURI": "https://coin.top/production/logo/1002000.png"
                    },
                    {
                        "symbol": "SUNOLD",
                        "address": "TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "SUNOLD",
                        "logoURI": "https://coin.top/production/logo/SUNLogo.178d4636.png"
                    },
                    {
                        "symbol": "NFT",
                        "address": "TFczxzPhnThNSqr5by8tvxsdCFRRz6cPNq",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "APENFT",
                        "logoURI": "https://coin.top/production/upload/logo/TFczxzPhnThNSqr5by8tvxsdCFRRz6cPNq.png"
                    },
                    {
                        "symbol": "BTC",
                        "address": "TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9",
                        "chainId": 1,
                        "decimals": 8,
                        "name": "Bitcoin",
                        "logoURI": "https://coin.top/production/logo/TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9.png"
                    },
                    {
                        "symbol": "WBTC",
                        "address": "TXpw8XeWYeTUd4quDskoUqeQPowRh4jY65",
                        "chainId": 1,
                        "decimals": 8,
                        "name": "Wrapped BTC",
                        "logoURI": "https://coin.top/production/logo/TXpw8XeWYeTUd4quDskoUqeQPowRh4jY65.png"
                    },
                    {
                        "symbol": "ETH",
                        "address": "THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "Ethereum",
                        "logoURI": "https://coin.top/production/logo/THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF.png"
                    },
                    {
                        "symbol": "WETH",
                        "address": "TXWkP3jLBqRGojUih1ShzNyDaN5Csnebok",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "Wrapped ETH",
                        "logoURI": "https://coin.top/production/logo/TXWkP3jLBqRGojUih1ShzNyDaN5Csnebok.png"
                    },
                    {
                        "symbol": "WBTT",
                        "address": "TKfjV9RNKJJCqPvBtK8L7Knykh7DNWvnYt",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "Wrapped BitTorrent",
                        "logoURI": "https://coin.top/production/logo/TKfjV9RNKJJCqPvBtK8L7Knykh7DNWvnYt.png"
                    },
                    {
                        "symbol": "WTRX",
                        "address": "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "Wrapped TRX",
                        "logoURI": "https://coin.top/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png"
                    },
                    {
                        "symbol": "JST",
                        "address": "TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "JUST GOV v1.0",
                        "logoURI": "https://coin.top/production/logo/just_icon.png"
                    },
                    {
                        "symbol": "WIN",
                        "address": "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "WINK",
                        "logoURI": "https://coin.top/profile_images/JKtJTydD_400x400.jpg"
                    },
                    {
                        "symbol": "DICE",
                        "address": "TKttnV3FSY1iEoAwB4N52WK2DxdV94KpSd",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "TRONbetDice",
                        "logoURI": "https://coin.top/production/logo/TKttnV3FSY1iEoAwB4N52WK2DxdV94KpSd.jpg"
                    },
                    {
                        "symbol": "LIVE",
                        "address": "TVgAYofpQku5G4zenXnvxhbZxpzzrk8WVK",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "TRONbetLive",
                        "logoURI": "https://coin.top/production/upload/logo/TVgAYofpQku5G4zenXnvxhbZxpzzrk8WVK.png"
                    },
                    {
                        "symbol": "USDT",
                        "address": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
                        "chainId": 1,
                        "decimals": 6,
                        "name": "Tether USD",
                        "logoURI": "https://coin.top/production/logo/usdtlogo.png"
                    },
                    {
                        "symbol": "USDJ",
                        "address": "TMwFHYXLJaRUPeW6421aqXL4ZEzPRFGkGT",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "JUST Stablecoin v1.0",
                        "logoURI": "https://coin.top/production/logo/usdj.png"
                    },
                    {
                        "symbol": "TUSD",
                        "address": "TUpMhErZL2fhh4sVNULAbNKLokS4GjC1F4",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "TrueUSD",
                        "logoURI": "https://coin.top/production/logo/TUpMhErZL2fhh4sVNULAbNKLokS4GjC1F4.png"
                    },
                    {
                        "symbol": "LTC",
                        "address": "TR3DLthpnDdCGabhVDbD3VMsiJoCXY3bZd",
                        "chainId": 1,
                        "decimals": 8,
                        "name": "Litecoin",
                        "logoURI": "https://coin.top/production/logo/TR3DLthpnDdCGabhVDbD3VMsiJoCXY3bZd.png"
                    },
                    {
                        "symbol": "HT",
                        "address": "TDyvndWuvX5xTBwHPYJi7J3Yq8pq8yh62h",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "HuobiToken",
                        "logoURI": "https://coin.top/production/logo/TDyvndWuvX5xTBwHPYJi7J3Yq8pq8yh62h.png"
                    },
                    {
                        "symbol": "USDD",
                        "address": "TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn",
                        "chainId": 1,
                        "decimals": 18,
                        "name": "Decentralized USD",
                        "logoURI": "https://coin.top/production/upload/logo/TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn.svg"
                    }
                ],
                "logoURI": "https://sun.io/favicon.ico",
                "version": {
                    "patch": 0,
                    "major": 1,
                    "minor": 7
                },
                "timestamp": 1651744145000,
                "uri": "https://list.justswap.link/justswap.json",
                "rs": 0,
                "tm": 1653494173286
            },
            "https://raw.githubusercontent.com/BlackChar92/tokenlist/main/testlist.json": {
                "name": "BTC-Chain",
                "logoURI": "https://nile.tronscan.org/upload/logo/1000193.png",
                "timestamp": 1600222146000,
                "tokens": [
                    {
                        "chainId": 1,
                        "address": "TAjuAs2WWtyR6mQrpaxHYCpvVYaC2KwGAK",
                        "name": "BitCoin",
                        "symbol": "BTC",
                        "decimals": 8,
                        "logoURI": "https://coin.top/production/logo/TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9.png"
                    }
                ],
                "version": {
                    "major": 1,
                    "minor": 0,
                    "patch": 0
                },
                "uri": "https://raw.githubusercontent.com/BlackChar92/tokenlist/main/testlist.json",
                "rs": 0,
                "tm": 1653494738098
            }
        },
        "selectedListUrl": "https://raw.githubusercontent.com/BlackChar92/tokenlist/main/testlist.json"
    }
  }
  ```

## deleteTokenList
  ### parameters:
  ```
  (uri: string | number)
  ```

  ### example:
  ```
  const response = await TokenListProvider.deleteTokenList(testTokenListUri);
  ```

  ### response (success):
  ```
  {
    "success": true
  }
  ```

  ### response (fail):
  ```
  {
    "success": false,
    "msg": "error: The specified tokenlist does not exist or has been deleted"
  }  
  ```


reference:

[uniswap](#https://uniswap.org/blog/token-lists)
