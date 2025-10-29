import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {AUTH} from '../../utils/baseURL';
import StorageItems from '../../utils/StorageItems';
import checkInternet from '../../utils/checkConnection';
import messages from '../../constants/helpers';
import SessionExpired from '../../utils/SessionExpired';

const initialState = {
  userProfileData: null,
  userProfileDataFailed: null,
  loading: false,
};

export const userProfile = createAsyncThunk(
  'auth/userProfile',
  async ({_, navigation}, {rejectWithValue}) => {
    try {
      // console.log("----Payload--",AUTH.USER_PROFILE)
      await checkInternet();
      const config = {
        method: 'GET',
        url: AUTH.USER_PROFILE,
        headers: {
          Authorization: `Bearer ${StorageItems.getUserToken()}`,
        },
      };
      const results = await axios(config);
      // console.log("resssss",results?.data);
      return results.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        SessionExpired({error, navigation});
        // console.log(error?.response?.data?.message);
        return rejectWithValue(error.response.data);
      }
      // console.log(error);
      return rejectWithValue(error);
    }
  },
);

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(userProfile.pending, state => {
        state.loading = true;
      })
      .addCase(userProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfileData = action.payload.data;
        state.userProfileDataFailed = null;
      })
      .addCase(userProfile.rejected, (state, action) => {
        state.loading = false;
        state.userProfileDataFailed = action.payload;
      });
  },
});

export default AuthSlice.reducer;
