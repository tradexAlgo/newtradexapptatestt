import axios from 'axios';
import StorageItems from '../utils/StorageItems';
import { STOCK } from '../utils/baseURL';
import checkInternet from '../utils/checkConnection';
import { fetchOptionChain } from '../utils/getNse';

const GetAPI = {
  getOneStockData: async ({ data, formattedObj = true }) => {
    return new Promise(async (resolve, reject) => {
      try {
        await checkInternet();

        // console.log("payload:::", data)
        const url = STOCK.GET_ONE_STOCK_DATA(data);
        const response = await axios.get(url);

        const results = response.data;
        const fullMetaObject = results?.chart?.result[0];

        if (!formattedObj) {
          resolve(fullMetaObject);
        }

        const filteredMetaObject = {
          currency: fullMetaObject?.meta.currency,
          symbol: fullMetaObject?.meta.symbol,
          exchangeName: fullMetaObject?.meta.exchangeName,
          regularMarketPrice: fullMetaObject?.meta.regularMarketPrice,
          previousClose: fullMetaObject?.meta.previousClose,
        };
        resolve(filteredMetaObject);
      } catch (error) {
        if (error?.response?.data?.message) {
          // console.log(error?.response?.data?.message);
          // console.log("error", error);
          reject(error.response.data);
          return;
        }
        // console.log(error);
        reject(error);
      }
    });
  },

  getOptoinData: async ({ param, optionType, expiryDate, identifier }) => {
    try {
      await checkInternet();
      const url = STOCK.GET_OPTION_DATA(param);
      // console.log("payload::", param, optionType, expiryDate, identifier, url);

      // const response = await axios.get(url);
      const result = await fetchOptionChain(param);

      // const results = response.data;

      const filteredData = result?.records?.data?.filter(option => {
        return option[optionType] &&
          option[optionType].expiryDate === expiryDate &&
          option[optionType].identifier === identifier;
      });


      const data = filteredData?.length > 0
        ? optionType === 'CE'
          ? filteredData[0]?.CE
          : filteredData[0]?.PE
        : undefined;

      // console.log("the result is ", data)

      return data || [];
    } catch (error) {
      // console.error("Error in getOptoinData:", error);
      throw error; // rethrow the error after logging
    }
  },
};

export default GetAPI;
