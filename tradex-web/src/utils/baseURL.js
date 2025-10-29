
import axios from "axios";
import StorageItems from "./StorageItems";


// live
const baseURL = 'https://backend-tradex.onrender.com';
export const baseURLExport = 'https://backend-tradex.onrender.com';

// const baseURL = 'http://172.20.10.10:5001';
// export const baseURLExport = 'http://172.20.10.10:5001';
// const baseURL = 'http://10.18.203.64:5001';
// export const baseURLExport = 'http://10.18.203.64:5001';

export const AUTH = {
  REGISTER: `${baseURL}/user/register`,
  LOGIN: `${baseURL}/user/login`,
  SEND_OTP: `${baseURL}/user/sendotp`,
  VERIFY_OTP: `${baseURL}/user/verifyotp`,
  USER_PROFILE: `${baseURL}/user/getuserprofile`,
};

export const STOCK = {
  GET_WATCHLIST_LIST: `${baseURL}/market/watchlists`,
  WATCH_LIST: `${baseURL}/market/getwatchlist/`,
  ADD_WATCHLIST: `${baseURL}/market/addtowatchlist`,
  DELETE_WATCHLIST: `${baseURL}/market/removewatchlistitem/`,
  BUY_STOCK: `${baseURL}/market/buy`,
  BUY_COMMODITY: `${baseURL}/market/buyCommodity`,
  SELL_STOCK: `${baseURL}/market/sell`,
  SELL_COMMODITY: `${baseURL}/market/sellCommodity`,
  STOCK_HISTORY: `${baseURL}/market/getmystockhistory`,
  MY_STOCKS: `${baseURL}/market/getmystocks`,
  MY_STOCKS_Comm: `${baseURL}/market/getmystocksCommodity`,
  DECODE_STOCK_DATA: `${baseURL}/market/decodestockdata`,
  SQUARE_OFF: `${baseURL}/market/squareoff`,
  GET_NSE_LATEST_PRICE: `${baseURL}/market/getNSELatestPrice`,
  SQUARE_OFF_Commodity: `${baseURL}/market/squareOffCommodity`,
  DELETE_STOCK: `${baseURL}/market/deletestock/`,
  GET_QOUTES: `${baseURL}/market/getQuotesV2`,
  BANKNIFTY_OPTIONS: `${baseURL}/market/banknifty-options`,
  GET_QOUTES_OLD: `${baseURL}/market/getQuotes`,
  INTRO: `${baseURL}/admin/intro`,
  WITHDRAW: `${baseURL}/user/withdraw`,
  PAYMENT_INFO: `${baseURL}/user/payment-info`,
  DEPOSIT: `${baseURL}/user/deposit`,
  GET_OPTION_DATA: symbol =>
    `https://option-chain-data.onrender.com/chain?index=${symbol}`,
  GET_ONE_STOCK_DATA: symbol =>
    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
  SEARCH_STOCKS: symbol =>
    `https://query2.finance.yahoo.com/v1/finance/search?q=${symbol}&lang=en-US&region=IN&quotesCount=3&newsCount=0&listsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query&multiQuoteQueryId=multi_quote_single_token_query&enableCb=false&enableNavLinks=false&enableEnhancedTrivialQuery=false&enableResearchReports=false&enableCulturalAssets=false&enableLogoUrl=false&researchReportsCount=0`,
};






// Function to handle POST requests
export const postRequest = async (endpoint, data) => {
  try {
    const STATIC_BEARER_TOKEN = StorageItems.getUserToken()

    const response = await axios.post(`${baseURL}${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STATIC_BEARER_TOKEN}`, // Add the Authorization header
      },
    });
    return response.data; // Return the response data
  } catch (error) {
    // if (error.response?.status === 401 || error.response?.status === 403) {

    //   setItem('LoginData', '');
    //   setItem('fcmToken', '');
    //   setItem('token', '');

    //   clearAll()
    //   showToast("error", 'Error', "Please re-login as your session is expired!")
    //   navigation.dispatch(
    //     CommonActions.reset({
    //       index: 0,
    //       routes: [{ name: 'Start' }],
    //     })
    //   );
    // }
    return error.response?.data || { message: error.message, status: false };
  }
};


export const getRequest = async (endpoint, params = {}) => {
  try {
    const STATIC_BEARER_TOKEN = StorageItems.getUserToken()

    // console.log("thisiisiis klsd",STATIC_BEARER_TOKEN)

    const response = await axios.get(`${baseURL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STATIC_BEARER_TOKEN}`,
      },
      params,
    });
    // console.log("Response from getRequest:", response.data);
    return response.data;
  } catch (error) {
    // console.log("Error in getRequest:", error);
    // if (error.response?.data?.message === "Unauthorized!") {
    //   setItem('LoginData', '');
    //   setItem('fcmToken', '');
    //   setItem('token', '');

    //   clearAll()
    //   console.log("herecommming")
    //   showToast("error", 'Error', "Please re-login as your session is expired!")
    //   navigation.dispatch(
    //     CommonActions.reset({
    //       index: 0,
    //       routes: [{ name: 'Start' }],
    //     })
    //   );
    // }
    // throw error.response?.data || error.message; // Throw error for the caller to handle
  }
};