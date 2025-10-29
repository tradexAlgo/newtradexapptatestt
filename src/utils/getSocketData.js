import PostAPI from '../api/PostAPI';

const getSocketData = async ({message, watchList = []}) => {
  try {
    const body = {stockData: message.data};
    const response = await PostAPI.decodeStockData(body);
    const responseData = response.data;
    const newSymbol = responseData?.id;

    let arr = [...watchList];

    const existingIndex = arr.findIndex(item => item.symbol === newSymbol);

    const filteredMetaObject = {
      currency: responseData?.currency,
      symbol: responseData?.id,
      exchangeName: responseData?.exchange,
      changePercent: responseData?.changePercent,
      change: responseData?.change,
      previousClose: responseData?.openPrice,
      regularMarketPrice: responseData?.price,
    };

    if (existingIndex !== -1) {
      arr[existingIndex] = {
        ...arr[existingIndex],
        ...filteredMetaObject,
      };
    } else {
      arr.push(filteredMetaObject);
    }

    return arr;
  } catch (error) {
    // console.log(error);
    return watchList;
  }
};

export default getSocketData;
