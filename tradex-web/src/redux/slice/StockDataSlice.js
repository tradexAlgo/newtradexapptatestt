import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { STOCK } from '../../utils/baseURL';
import StorageItems from '../../utils/StorageItems';
import checkInternet from '../../utils/checkConnection';
import GetAPI from '../../api/GetAPI';
import SessionExpired from '../../utils/SessionExpired';
import checkNonEmpty from '../../utils/checkNonEmpty';

// Initial State
const initialState = {
  watchList: [],
  watchListFailed: null,
  stockHistory: [],
  stockHistoryFailed: null,
  myStocks: [],
  myStocksFailed: null,
  myCommodities: [], // Add this for commodities
  myCommoditiesFailed: null, // Add this for commodities
  searchedStocks: [],
  searchStocksFailed: null,
  loading: false,
  stockListSocket: [],
  searchLoading: false,
  topTabStatus: true,
};

// Thunks
export const getWatchList = createAsyncThunk(
  'stock/getWatchList',
  async ({ data, navigation }, { rejectWithValue }) => {
    try {
      await checkInternet();
      const config = {
        method: 'GET',
        url: STOCK.WATCH_LIST,
        headers: {
          Authorization: `Bearer ${StorageItems.getUserToken()}`,
        },
      };
      const response = await axios(config);
      
      const results = await Promise.all(
        response.data.data.map(async res => {
          const stockData = await GetAPI.getOneStockData({ data: res.symbol });
          return { ...stockData, id: res._id };
        })
      );
      return results;
    } catch (error) {
      if (error?.response?.data?.message) {
        SessionExpired({ error, navigation });
        // console.log(error?.response?.data?.message);
        return rejectWithValue(error.response.data);
      }
      // console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const getStockHistory = createAsyncThunk(
  'stock/getStockHistory',
  async (_, { rejectWithValue }) => {
    try {
      await checkInternet();
      const config = {
        method: 'GET',
        url: STOCK.STOCK_HISTORY,
        headers: {
          Authorization: `Bearer ${StorageItems.getUserToken()}`,
        },
      };
      const results = await axios(config);
      // console.log(results.data);
      return results.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        // console.log(error?.response?.data?.message);
        return rejectWithValue(error.response.data);
      }
      // console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const getMyStocks = createAsyncThunk(
  'stock/getMyStocks',
  async ({ _, navigation }, { rejectWithValue }) => {
    try {
      await checkInternet();
      const config = {
        method: 'GET',
        url: STOCK.MY_STOCKS,
        headers: {
          Authorization: `Bearer ${StorageItems.getUserToken()}`,
        },
      };
      const results = await axios(config);
      // console.log("check the res", results.data);
      return results.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        SessionExpired({ error, navigation });
        // console.log(error?.response?.data?.message);
        return rejectWithValue(error.response.data);
      }
      // console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const getMyCommodities = createAsyncThunk(
  'commodity/getMyCommodities',
  async ({ _, navigation }, { rejectWithValue }) => {
    try {
      await checkInternet(); // Ensure there's internet connectivity
      const config = {
        method: 'GET',
        url: STOCK.MY_STOCKS_Comm, // Endpoint URL for commodities
        headers: {
          Authorization: `Bearer ${StorageItems.getUserToken()}`, // Authentication
        },
      };
      const results = await axios(config); // Make the API request
      return results.data; // Return the data on success
    } catch (error) {
      if (error?.response?.data?.message) {
        SessionExpired({ error, navigation }); // Handle session expiration
        // console.log(error?.response?.data?.message);
        return rejectWithValue(error.response.data); // Return the error
      }
      // console.log(error);
      return rejectWithValue(error); // Return a generic error
    }
  }
);

export const searchStocks = createAsyncThunk(
  'stock/searchStocks',
  async (data, { rejectWithValue }) => {
    try {
      await checkInternet();
      const config = STOCK.SEARCH_STOCKS(data);
      const response = await fetch(config);
      const results = await response.json();
      if (checkNonEmpty(results.quotes)) {
        const res = await Promise.all(
          results.quotes.map(async res => {
            const stockData = await GetAPI.getOneStockData({
              data: res.symbol,
            });
            return { ...stockData, id: res._id, name: res?.exchDisp };
          })
        );

        return res;
      } else {
        return [];
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        // console.log(error?.response?.data?.message);
        return rejectWithValue(error.response.data);
      }
      // console.log(error);
      return rejectWithValue(error);
    }
  }
);

// Slice
const StockDataSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStockListSocket(state, action) {
      state.stockListSocket = action.payload;
    },
    changeTopTabStatus(state, action) {
      state.topTabStatus = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getWatchList.pending, state => {
        state.loading = true;
      })
      .addCase(getWatchList.fulfilled, (state, action) => {
        state.loading = false;
        state.watchList = action.payload;
        state.watchListFailed = null;
      })
      .addCase(getWatchList.rejected, (state, action) => {
        state.loading = false;
        state.watchListFailed = action.payload;
      })
      .addCase(getStockHistory.pending, state => {
        state.loading = true;
      })
      .addCase(getStockHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.stockHistory = action.payload.data;
        state.stockHistoryFailed = null;
      })
      .addCase(getStockHistory.rejected, (state, action) => {
        state.loading = false;
        state.stockHistoryFailed = action.payload;
      })
      .addCase(getMyStocks.pending, state => {
        state.loading = true;
      })
      .addCase(getMyStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.myStocks = action.payload.data;
        state.myStocksFailed = null;
      })
      .addCase(getMyStocks.rejected, (state, action) => {
        state.loading = false;
        state.myStocksFailed = action.payload;
      })
      .addCase(getMyCommodities.pending, state => {
        state.loading = true;
      })
      .addCase(getMyCommodities.fulfilled, (state, action) => {
        state.loading = false;
        state.myCommodities = action.payload.data; // Adjust if the data format is different
        state.myCommoditiesFailed = null;
      })
      .addCase(getMyCommodities.rejected, (state, action) => {
        state.loading = false;
        state.myCommoditiesFailed = action.payload;
      })
      .addCase(searchStocks.pending, state => {
        state.searchLoading = true;
      })
      .addCase(searchStocks.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchedStocks = action.payload;
        state.searchStocksFailed = null;
      })
      .addCase(searchStocks.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchStocksFailed = action.payload;
      });
  },
});

export const { setStockListSocket, changeTopTabStatus } = StockDataSlice.actions;

export default StockDataSlice.reducer;
