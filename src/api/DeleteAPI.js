import axios from 'axios';
import StorageItems from '../utils/StorageItems';
import {STOCK} from '../utils/baseURL';
import checkInternet from '../utils/checkConnection';

const DeleteAPI = {
  deleteWatchItem: async data => {
    return new Promise(async (resolve, reject) => {
      try {
        await checkInternet();
        const config = {
          method: 'DELETE',
          url: STOCK.DELETE_WATCHLIST + data,
          headers: {
            Authorization: `Bearer ${StorageItems.getUserToken()}`,
          },
        };
        const results = await axios(config);
        // console.log(results.data);
        resolve(results.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          // consol/e.log(error?.response?.data?.message);
          reject(error.response.data);
          return;
        }
        // console.log(error);
        reject(error);
      }
    });
  },
  deleteStock: async data => {
    return new Promise(async (resolve, reject) => {
      try {
        await checkInternet();
        const config = {
          method: 'DELETE',
          url: STOCK.DELETE_STOCK + data,
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
        // conso/le.log(error);
        reject(error);
      }
    });
  },
};

export default DeleteAPI;
