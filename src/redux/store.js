import {configureStore} from '@reduxjs/toolkit';
import StockDataSlice from './slice/StockDataSlice';
import AuthSlice from './slice/AuthSlice';

const store = configureStore({
  reducer: {
    stockData: StockDataSlice,
    auth: AuthSlice,
  },
});

export default store;
