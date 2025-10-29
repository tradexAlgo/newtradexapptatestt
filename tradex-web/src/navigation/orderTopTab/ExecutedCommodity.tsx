import { View, Text, FlatList, Pressable, Alert, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { font } from '../../common/Font';
import { color } from '../../common/color';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Loader from '../../component/Loader/Loader';
import ErrorMessage from '../../component/ErrorMessage/ErrorMessage';
import {
  getMyCommodities,
  getMyStocks,
  getStockHistory,
  getWatchList,
} from '../../redux/slice/StockDataSlice';
import checkNonEmpty from '../../utils/checkNonEmpty';
import Pendingimage from '../../../assets/svg/pendingimage';
import { useNavigation } from '@react-navigation/native';
import priceFormat from '../../utils/priceFormat';
import PostAPI from '../../api/PostAPI';
import { userProfile } from '../../redux/slice/AuthSlice';
import Spinner from '../../component/Spinner/Spinner';
import axios from 'axios';
import { STOCK } from '../../utils/baseURL';
import GetAPI from '../../api/GetAPI';

const ExecutedCommodity = ({ }) => {
  const navigation = useNavigation();
  const { myStocks, myStocksFailed, loading, topTabStatus, myCommodities } = useSelector(
    state => state.stockData,
  );
  const [stocks, setStocks] = useState([]);
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // Added state for refreshing
  const dispatch = useDispatch();




  useEffect(() => {
    const updateData = () => {
      const data = myCommodities
        .filter(stock => stock.executed)
        .reverse();
      setStocks(data);
    };

    updateData(); // Initial call to populate the data

    // Set up interval to update data every 2 seconds
    const intervalId = setInterval(updateData, 5000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [myCommodities, topTabStatus]);

  useEffect(() => {
    dispatch(getMyCommodities({ navigation }));
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Call the API to fetch updated data
      dispatch(getMyCommodities({ navigation }));
    } catch (error) {
      // console.log('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const card = id => {
    setStocks(prev =>
      prev.map(res =>
        res._id === id ? { ...res, openCard: !res.openCard || false } : res,
      ),
    );
  };



  //forLivemoney
  // [69334, 431978, 296209, 182986, 139841, 97008, 4152095]
  const symbols = [
    "HG=F",   // Copper
    "CL=F",   // Crude Oil
    "B0=F",   // Crude Oil Mini
    "GC=F",   // Gold
    "MGC=F",  // Gold Mini
    "NG=F",   // Natural Gas
    "NG=F",   // Natural Gas (Same as above; only one symbol for Natural Gas)
    "SI=F",   // Silver
    "SIL=F",  // Silver Mini
    "ZN=F"    // Zinc
  ];
  const baseURL = "https://query1.finance.yahoo.com/v8/finance/chart/";
  const [volume, setVolumes] = useState(null);
  const fetchSymbolData = async (symbol) => {
    try {
      const response = await fetch(`${baseURL}${symbol}`);
      const data = await response.json();
      // Extract the regularMarketVolume
      const regularMarketVolume = data.chart.result[0].meta.regularMarketVolume;
      return regularMarketVolume;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };


  const [liveData, setLiveData] = useState();

  // Function to fetch market data
  const fetchMarketData = async (payload: any) => {

    try {
      const response = await axios.post(STOCK.GET_QOUTES, payload);
      // console.log("pritn rthe kkk", response)
      if (response.data.code === 200 && response.data.status) {
        // Process the data in the background
        ////console.log('Data:', response.data.data.d); // Handle the data as needed
        setLiveData(response.data.data.d)
        // console.log("resllllll", liveData?.[0])
        return response?.data?.data?.d
      }
    } catch (error) {
      ////console.error('Error fetching market data:', error);
    } finally {
    }
  };
  const fetchAllSymbolsData = async () => {
    const promises = symbols.map(fetchSymbolData);
    const volumes = await Promise.all(promises);
    return volumes;
  };

  // console.log('volume', volume)
  const getCommodityIndex = (commodityName) => {
    const index = commodities.indexOf(commodityName.toUpperCase());
    return index !== -1 ? index : 'Commodity not found';
  }
  const commodities = ['COPPER', 'CRUDEOIL', 'CRUDEOILM', 'GOLD', 'GOLDM', 'NATGASMINI', 'NATURALGAS', 'SILVER', 'SILVERM', 'ZINC'];
  useEffect(() => {
    const getData = async () => {
      const data = await fetchAllSymbolsData();

      setVolumes(data);
    };

    getData();
  }, []);




  const squareOff = async item => {
    Alert.alert(
      'Tradex Pro',
      'Are you sure you want to square off your position?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const marketData = await fetchMarketData({ symbols: [item?.symbol] });
              // fetchMarketData({ symbols: [item?.symbol] })

              // console.log("imaging", item)

              let formdata = {
                stockId: item._id,
                totalAmount: item?.totalAmount,
                stockPrice: item?.commodityPrice,
                latestPrice: liveData?.[0]?.v?.lp || marketData?.lp
              };


              setLoader(true);
              const response = await PostAPI.squareOffCommodity(formdata);
              // console.log("response-.>>", response);
              Alert.alert(response.message);
              //@ts-ignore
              dispatch(userProfile({ navigation }));
              //@ts-ignore
              dispatch(getWatchList({ navigation }));
              //@ts-ignore
              dispatch(getMyStocks({ navigation }));
              //@ts-ignore
              dispatch(getStockHistory({ navigation }));
              //@ts-ignore
              dispatch(getMyCommodities({ navigation }));
              setLoader(false);
            } catch (error) {
              // console.log(error);
              setLoader(false);
              //@ts-ignore
              Alert.alert(error?.message);
            }
          },
        },
      ],
    );
  };


  const renderItem = ({ item }) => {
    const timeAgo = moment(item.updatedAt).fromNow();
    return (
      <Pressable onPress={() => card(item._id)}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: '#1c1c1e',
            // borderRadius: 12,
            paddingHorizontal: 10,
            paddingVertical: 15,
            width: '95%',
            alignSelf: 'center',
            borderBottomLeftRadius: item?.openCard ? 0 : 12,
            borderBottomRightRadius: item?.openCard ? 0 : 12,
          }}>

          <View
            style={{
              backgroundColor: color.color_primary_green,
              paddingVertical: 2,
              paddingHorizontal: 10,
              borderRadius: 6,
              position: 'absolute',
              right: 10, top: 5
            }}>
            <Text
              style={{
                fontSize: 8,
                fontFamily: font.nunitoregular,
                fontWeight: '600',
                color: color.color_white,
                textAlign: 'center',
              }}>
              COMPLETED
            </Text>
          </View>
          {item?.squareOff && (
            <View
              style={{
                backgroundColor: color.color_red_bg,
                paddingVertical: 2,
                paddingHorizontal: 10,
                borderRadius: 6,
                position: 'absolute',
                right: 10, bottom: 5
              }}>
              <Text
                style={{
                  fontSize: 8,
                  fontFamily: font.nunitoregular,
                  fontWeight: '600',
                  color: color.color_white,
                  textAlign: 'center',
                }}>
                Squired off
              </Text>
            </View>
          )}

          <View
            style={{
              justifyContent: 'center',
              width: '33%',
              gap: 5,
            }}>
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  backgroundColor:
                    item?.status === 'BUY'
                      ? color.color_darkblue
                      : color.color_red,
                  paddingHorizontal: 15,
                  paddingVertical: 2,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    fontSize: 8,
                    fontFamily: font.nunitoregular,
                    fontWeight: '600',
                    color: color.color_white,
                  }}>
                  {item?.status}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 8,
                  fontFamily: font.nunitoregular,
                  fontWeight: '600',
                  color: color.color_white,
                  paddingLeft: 5,
                  alignSelf: 'center',
                }}>
                QTY:{item?.quantity}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 12,
                fontFamily: font.nunitoregular,
                fontWeight: '600',
                color: color.color_white,
              }}>

              {item?.stockName || item?.commodityName}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignSelf: 'flex-end',
              flex: 1,
            }}>
            <Text
              style={{
                fontSize: 8,
                fontFamily: font.nunitoregular,
                fontWeight: '600',
                color: color.color_white,
                textAlign: 'center',
              }}>
              Order Price
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: font.nunitoregular,
                fontWeight: '600',
                textAlign: 'center',
                color: color.color_white,
              }}>
              {priceFormat(item?.commodityPrice)}
            </Text>
            {item?.squareOff && (
              <>
                <Text
                  style={{
                    fontSize: 8,
                    fontFamily: font.nunitoregular,
                    fontWeight: '600',
                    color: color.color_white,
                    textAlign: 'center',
                    marginTop: 5
                  }}>
                  Profit/Loss
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: font.nunitoregular,
                    fontWeight: '600',
                    textAlign: 'center',
                    color: color.color_white,
                  }}>
                  {priceFormat(item?.netProfitAndLoss)}
                </Text></>
            )}

          </View>
          <View
            style={{
              justifyContent: 'center',
              width: '33%',
              gap: 5,
            }}>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <Text
                style={{
                  fontSize: 8,
                  fontFamily: font.nunitoregular,
                  fontWeight: '600',
                  color: color.color_white,
                  alignSelf: 'center',
                }}>
                {timeAgo}
              </Text>

            </View>
          </View>
        </View>
        {item?.openCard && (
          <>
            <View
              style={{
                height: 0.5,
                backgroundColor: color.color_black,
                width: '90%',
                alignSelf: 'center',
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                backgroundColor: '#1c1c1e',
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 15,
                width: '95%',
                alignSelf: 'center',
              }}>
              <Pressable
                onPress={() => squareOff(item)}
                disabled={item?.squareOff}
                style={{
                  backgroundColor: item?.squareOff ? color.color_red_bg : color.color_primary_green,
                  paddingHorizontal: 12,
                  borderRadius: 13,
                  paddingVertical: 5,
                }}>
                <Text style={{ color: item?.squareOff ? color.color_white : color.color_white }}>{item?.squareOff ? 'Squared Off' : 'Square Off'}</Text>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate('Details', { data: item })}
                style={{
                  backgroundColor: color.color_primary_green,
                  paddingHorizontal: 12,
                  borderRadius: 13,
                  paddingVertical: 5,
                }}>
                <Text style={{ color: color.color_white }}>Info</Text>
              </Pressable>
            </View>
          </>
        )}
      </Pressable>
    );
  };
  // console.log("stocksstocks",stocks)

  return (
    <>
      {loading ? (
        <Loader loading={loading} />
      ) : myStocksFailed ? (
        <ErrorMessage
          apiToCall={getMyStocks}
          message={myStocksFailed?.message}
        />
      ) : checkNonEmpty(stocks) ? (
        <View style={{ backgroundColor: 'black', flex: 1 }}>
          <Spinner visible={loader} text={'Squaring off the position...'} />
          <FlatList
            contentContainerStyle={{ gap: 12, paddingVertical: 20 }}
            renderItem={renderItem}
            data={stocks}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Pressable onPress={() => navigation.navigate('WatchlistScreen')}>
            <Pendingimage />
          </Pressable>
        </View>
      )}
    </>
  );
};

export default ExecutedCommodity;


