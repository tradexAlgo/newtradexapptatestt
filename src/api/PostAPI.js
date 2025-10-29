import axios from 'axios';
import StorageItems from '../utils/StorageItems';
import {AUTH, STOCK} from '../utils/baseURL';
import checkInternet from '../utils/checkConnection';
import messages from '../constants/helpers';

const PostAPI = {
  login: async (data, remember) => {
    return new Promise(async (resolve, reject) => {
      try {
        await checkInternet();
        const config = {
          method: 'POST',
          url: AUTH.LOGIN,
          data,
        };
        const results = await axios(config);
        if (remember) {
          StorageItems.setRememberMeStatus(remember);
        }
        StorageItems.storeUserToken(results.data.token);
        // console.log(results.data);
        resolve(results.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          // console.log(error?.response?.data?.message);
          reject(error.response.data);
          return;
        }
        // console.log(error);
        reject(error);
      }
    });
  },

  register: async data => {
    return new Promise(async (resolve, reject) => {
      try {
        await checkInternet();
        const config = {
          method: 'POST',
          url: AUTH.REGISTER,
          data,
        };
        const results = await axios(config);
        StorageItems.storeUserToken(results.data.token);
        // console.log(results.data);
        resolve(results.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          // console.log(error?.response?.data?.message);
          reject(error.response.data);
          return;
        }
        // console.log(error);
        reject(error);
      }
    });
  },
  sendOtp: async data => {
    return new Promise(async (resolve, reject) => {
      try {
        await checkInternet();
        const config = {
          method: 'POST',
          url: AUTH.SEND_OTP,
          data,
          headers: {
            Authorization: `Bearer ${StorageItems.getUserToken()}`,
          },
        };
        const results = await axios(config);
        // console.log(results.data);
        resolve(results.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          // console.log(error?.response?.data?.message);
          reject(error.response.data);
          return;
        }
        // console.log(error);
        reject(error);
      }
    });
  },
  verifyOtp: async data => {
    return new Promise(async (resolve, reject) => {
      try {
        await checkInternet();
        const config = {
          method: 'POST',
          url: AUTH.VERIFY_OTP,
          data,
          headers: {
            Authorization: `Bearer ${StorageItems.getUserToken()}`,
          },
        };
        const results = await axios(config);
        StorageItems.storeUserToken(results.data.token);
        StorageItems.setRememberMeStatus(true);
        // console.log(results.data);
        resolve(results.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          // console.log(error?.response?.data?.message);
          reject(error.response.data);
          return;
        }
        // console.log(error);
        reject(error);
      }
    });
  },
  addToWatchList: async data => {
    return new Promise(async (resolve, reject) => {
      try {
        await checkInternet();
        const config = {
          method: 'POST',
          url: STOCK.ADD_WATCHLIST,
          data,
          headers: {
            Authorization: `Bearer ${StorageItems.getUserToken()}`,
          },
        };
        const results = await axios(config);
        // console.log(results.data);
        resolve(results.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          // console.log(error?.response?.data?.message);
          reject(error.response.data);
          return;
        }
        // console.log(error);
        reject(error);
      }
    });
  },
  buyStock: async data => {
    return new Promise(async (resolve, reject) => {
      try {
        await checkInternet();
        const config = {
          method: 'POST',
          url: STOCK.BUY_STOCK,
          data,
          headers: {
            Authorization: `Bearer ${StorageItems.getUserToken()}`,
          },
        };
        const results = await axios(config);
        // console.log(results.data);
        resolve(results.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          // console.log(error?.response?.data?.message);
          reject(error.response.data);
          return;
        }
        // console.log(error);
        reject(error);
      }
    });
  },
  sellStock: async data => {
    return new Promise(async (resolve, reject) => {
      try {
        await checkInternet();
        const config = {
          method: 'POST',
          url: STOCK.SELL_STOCK,
          data,
          headers: {
            Authorization: `Bearer ${StorageItems.getUserToken()}`,
          },
        };
        const results = await axios(config);
        // console.log(results.data);
        resolve(results.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          // console.log(error?.response?.data?.message);
          reject(error.response.data);
          return;
        }
        // console.log(error);
        reject(error);
      }
    });
  },
  buyCommodity: async (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        await checkInternet();
        const config = {
          method: 'POST',
          url: STOCK.BUY_COMMODITY,
          data,
          headers: {
            Authorization: `Bearer ${StorageItems.getUserToken()}`,
          },
        };
        const results = await axios(config);
       
        resolve(results.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          // console.log(error?.response?.data?.message);
          reject(error.response.data);
          return;
        }
        // console.log(error);
        reject(error);
      }
    });
  },
  
  sellCommodity: async (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        await checkInternet();
        const config = {
          method: 'POST',
          url: STOCK.SELL_COMMODITY,
          data,
          headers: {
            Authorization: `Bearer ${StorageItems.getUserToken()}`,
          },
        };
        const results = await axios(config);
        // console.log(results.data);
        resolve(results.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          // console.log(error?.response?.data?.message);
          reject(error.response.data);
          return;
        }
        // console.log(error);
        reject(error);
      }
    });
  },
  
  decodeStockData: async data => {
    return new Promise(async (resolve, reject) => {
      try {
        await checkInternet();
        const config = {
          method: 'POST',
          url: STOCK.DECODE_STOCK_DATA,
          data,
          headers: {
            Authorization: `Bearer ${StorageItems.getUserToken()}`,
          },
        };
        const results = await axios(config);
        resolve(results.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          // console.log(error?.response?.data?.message);
          reject(error.response.data);
          return;
        }
        // console.log(error);
        reject(error);
      }
    });
  },
  squareOff: async data => {
    return new Promise(async (resolve, reject) => {
      try {
        await checkInternet();

        // console.log("squareOff - payload:",data)
      
        const config = {
          method: 'POST',
          url: STOCK.SQUARE_OFF,
          data,
          headers: {
            Authorization: `Bearer ${StorageItems.getUserToken()}`,
          },
        };
        const results = await axios(config);
        // console.log(results.data);
        resolve(results.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          // conso/le.log(error?.response?.data?.message);
          reject(error.response.data);
          return;
        }
        // console.log(error);
        reject(error);
      }
    });
  },
  getNSELatestPrice: async data => {
    return new Promise(async (resolve, reject) => {
      try {
        await checkInternet();

      
        const config = {
          method: 'POST',
          url: STOCK.GET_NSE_LATEST_PRICE,
          data,
          headers: {
            Authorization: `Bearer ${StorageItems.getUserToken()}`,
          },
        };
        const results = await axios(config);
        // console.log(results.data);
        resolve(results.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          // console.log(error?.response?.data?.message);
          reject(error.response.data);
          return;
        }
        // console.log(error);
        reject(error);
      }
    });
  },
  squareOffCommodity: async data => {
    return new Promise(async (resolve, reject) => {
      try {
        await checkInternet();
        const config = {
          method: 'POST',
          url: STOCK.SQUARE_OFF_Commodity,
          data,
          headers: {
            Authorization: `Bearer ${StorageItems.getUserToken()}`,
          },
        };
        const results = await axios(config);
        // console.log(results.data);
        resolve(results.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          // console.log(error?.response?.data?.message);
          reject(error.response.data);
          return;
        }
        // console.log(error);
        reject(error);
      }
    });
  },
  

};

export default PostAPI;
