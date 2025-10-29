
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import { G, Path, Svg } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import GetAPI from '../../api/GetAPI';
import { color } from '../../common/color';
import Seperator from '../../component/Seperator/Seperator';
import SeperatorLine from '../../component/SeperatorLine';
import { userProfile } from '../../redux/slice/AuthSlice';
import { getMyCommodities, getMyStocks } from '../../redux/slice/StockDataSlice';
import { STOCK } from '../../utils/baseURL';
import checkNonEmpty from '../../utils/checkNonEmpty';
import Debounce from '../../utils/Debounce';
import getSocketData from '../../utils/getSocketData';
import priceFormat from '../../utils/priceFormat';
import LinearGradient from 'react-native-linear-gradient';


const FundScreen = ({ navigation }) => {
  const { userProfileData } = useSelector(state => state.auth);
  const { myStocks, myCommodities } = useSelector(state => state.stockData);
  const [stocks, setStocks] = useState([]);
  const [focus, setFocus] = useState(1);
  const [data, setData] = useState([]);
  const [todayPL, setTodayPL] = useState(0);
  const [todayPLc, setTodayPLc] = useState(0);
  const dispatch = useDispatch();
  const [commodityArray, setCommodityArray] = useState([]);
  const staticExpDates = {
    COPPER: '21AUG2024',
    CRUDEOIL: '14AUG2024',
    CRUDEOILM: '14AUG2024',
    GOLD: '24SEP2024',
    GOLDM: '27AUG2024',
    NATGASMINI: '23AUG2024',
    NATURALGAS: '23AUG2024',
    SILVER: '27AUG2024',
    SILVERM: '21AUG2024',
    ZINC: '21AUG2024',
  };

  const fetchCommodityData = async () => {
    try {
      const response = await axios.get('https://www.nseindia.com/api/refrates?index=commodityspotrates', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      const data = response.data.data;
      const extractedData = data.map(item => ({
        symbol: item.symbol,
        lastSpotPrice: item.lastSpotPrice,
        updatedDate: item.updatedDate.replace(/-/g, ''), // Removes dashes
        expDate: staticExpDates[item.symbol] || 'N/A'
      }));

      setCommodityArray(extractedData);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchCommodityData();
  }, []);


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
      ////console.error('Error fetching data:', error);
      return null;
    }
  };

  const fetchAllSymbolsData = async () => {
    const promises = symbols.map(fetchSymbolData);
    const volumes = await Promise.all(promises);
    return volumes;
  };

  useEffect(() => {
    const getData = async () => {
      const data = await fetchAllSymbolsData();

      setVolumes(data);
    };

    getData();
  }, []);


  useEffect(() => {
    const data = myStocks.filter(stock => stock.executed && !stock.squareOff);
    if (checkNonEmpty(data)) {
      const symbols = data.map(res => res.symbol);
      const ws = new WebSocket('wss://streamer.finance.yahoo.com');

      ws.onopen = function open() {
        ws.send(
          JSON.stringify({
            subscribe: symbols,
          }),
        );
      };

      ws.onclose = function close() {
      };

      ws.onmessage = async function incoming(message) {
        try {
          const socketData = await Debounce({
            func: async () => {
              const result = await getSocketData({ message });
              return result;
            },
            delay: 800,
          });

        } catch (error) {
        }
      };
    }
  }, [myStocks]);

  const addStockDifferencePrice = (data) => {
    // item.symbol
    return data.map(item => ({
      ...item,
      stockDifferencePrice: checkDifference(item?.symbol, item?.commodityPrice, item?.quantity) || 0,
      stockLivePrice: StockLive(item?.symbol, item?.commodityPrice, item?.quantity) || 0
    }));
  };

  useEffect(() => {
    let intervalId;

    const fetchStocks = () => {
      dispatch(getMyStocks({ navigation }));
    };

    const startInterval = () => {
      intervalId = setInterval(fetchStocks, 2000);
    };

    const stopInterval = () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };

    const unsubscribeFocus = navigation.addListener('focus', () => {
      startInterval();
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      stopInterval();
    });

    return () => {
      stopInterval();
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);


  useEffect(() => {
    if (focus === 1) {
      const updatedCommodityData = addStockDifferencePrice(myCommodities);

      const innerData = updatedCommodityData?.filter(stock => stock.executed && !stock.squareOff)


      setData(innerData);
      const totalDiff = data
        .filter(stock => Number.isFinite(stock.stockDifferencePrice?._j))
        .reduce((accumulator, stock) => accumulator + stock.stockDifferencePrice?._j, 0);


      setTodayPLc(totalDiff);

    }
  }, [myCommodities]);

  useEffect(() => {
    if (focus === 2) {
      setData([])
      setData(stocks);
    }
  }, [stocks]);

  // console.log("dataISMMO", stocks)




  useEffect(() => {
    const fetch = async () => {
      try {
        // Filter stocks that are executed but not yet squared off
        const data = myStocks?.filter((stock: any) => stock.executed && !stock.squareOff);

        if (data && data.length > 0) {
          // Fetch price data based on the presence of optionType
          const results = await Promise.all(
            data.map(async (stock: any) => {
              let stockData = {};

              if (stock?.optionType === 'CE' || stock?.optionType === 'PE') {
                //console.log("Fetching option data:", stock?.symbol, stock?.optionType, stock?.expiryDate, stock?.identifier);
                stockData = await GetAPI.getOptoinData({
                  param: stock?.symbol,
                  optionType: stock?.optionType,
                  expiryDate: stock?.expiryDate,
                  identifier: stock?.identifier,
                });

                // console.log("stock Dataym", stockData, stock)
              } else {
                // Fetch regular stock data
                //console.log("Fetching regular stock data:", stock?.symbol);
                stockData = await GetAPI.getOneStockData({ data: stock.symbol });
              }


              const lastPriceDifference = (stockData?.lastPrice) || stockData?.regularMarketPrice || 0;

              return { ...stock, lastPriceDifference };
            })
          );

          // Calculate price difference and update stocks
          const updatedStocks = results.map((stock) => {
            //console.log("check the stock ... --",stock.symbol ,"::",stock?.lastPriceDifference,stock.regularMarketPrice,stock?.stockName)

            const marketPrice = stock.lastPriceDifference;
            const stockPrice = stock.stockPrice;
            // //console.log("check the value for difference --",marketPrice,stockPrice,stock.quantity)
            const difference = (marketPrice - stockPrice) * stock.quantity;

            return { ...stock, difference };
          });

          // Calculate total difference
          const totalDiff = updatedStocks
            .filter((stock) => Number.isFinite(stock.difference))
            .reduce((accumulator, stock) => accumulator + stock.difference, 0);

          // Update state
          setTodayPL(totalDiff);
          setStocks(updatedStocks);
          // console.log(
          //     "my1111",
          //     updatedStocks
          //   )
        }
      } catch (error) {
        //console.error("Error fetching stock data:", error);
      }
    };

    fetch();
  }, [myStocks]);




  useEffect(() => {
    //@ts-expect-error
    dispatch(getMyCommodities({ navigation }));
  }, [navigation]);

  const onRefresh = async () => {
    try {
      //@ts-ignore
      dispatch(getMyCommodities({ navigation }));
      // @ts-ignore
      dispatch(getMyStocks({ navigation }));
    } catch (error) {
      //console.log('Error refreshing data:', error);
    } finally {
    }
  };


  const [liveData, setLiveData] = useState();

  const fetchMarketData = async (payload: any) => {

    try {
      const response = await axios.post(STOCK.GET_QOUTES, payload);

      if (response.data.code === 200 && response.data.status) {
        setLiveData(response.data.data.d)
        return response.data.data.d;
      }
    } catch (error) {
    } finally {
    }
  };

  const checkDifference = async (itemSymbol, price, quantity) => {

    if (itemSymbol && price && quantity) {
      const marketData = await fetchMarketData({ symbols: [itemSymbol] });

      const marketPrice = marketData?.[0]?.v?.lp; // Assuming 'lp' is the correct key
      return (marketPrice - price) * quantity
    }


  }
  const StockLive = async (itemSymbol, price, quantity) => {
    if (itemSymbol && price && quantity) {
      //console.log("The Stock live Payload", itemSymbol, price, quantity);

      // Wait for the market data to be fetched
      const marketData = await fetchMarketData({ symbols: [itemSymbol] });

      //console.log("The stock live", marketData);

      // Access the live market price
      const marketPrice = marketData?.[0]?.v?.lp; // Assuming 'lp' is the correct key

      //console.log("Calculated value:", (marketPrice - price) * quantity);

      return marketPrice ? marketPrice : 0;
    }
  };


  const refresh = () => {
    dispatch(userProfile({ navigation }));
  }



  const renderItem = ({ item }) => {
    return (
      <Pressable
        onPress={() => navigation.navigate('Details', { data: item })}
        style={{
          borderWidth: 0.5,
          borderColor: color.Default_GREY,
          borderRadius: 9,
          padding: 14,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{ flexDirection: 'row', width: '100%', gap: 10 }}>
          <FastImage
            style={{
              height: 48,
              width: 48,
              borderRadius: 8,
              alignSelf: 'flex-start',
              alignItems: 'center',
            }}
            source={{ uri: userProfileData?.userPicture }}
          />
          <View>
            <Text style={{ fontWeight: '600' }}>{userProfileData?.fullName}</Text>
            <Text style={{ fontWeight: '600', color: color.Default_GREY }}>
              {moment(item?.buyDate).format('DD MMM')}
            </Text>
          </View>
        </View>
        <SeperatorLine />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center',
          }}>

          <Text style={{ fontSize: 12 }}>{item?.symbol}</Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              alignSelf: 'flex-end',
              color: (
                focus === 1 ? item?.stockDifferencePrice?._j < 0 : item?.difference < 0
              )
                ? color.color_red
                : color.Default_GREEN,
              position: 'absolute',
              right: 5,
            }}>
            ₹
            {priceFormat(
              focus === 1 ? item?.stockDifferencePrice?._j : item?.difference,
            ) || 0}
          </Text>
        </View>
        <Text style={{ fontSize: 12, color: color.Default_GREY }}>
          {item?.quantity} QTY
        </Text>
        <SeperatorLine />
      </Pressable>
    );
  };
  const renderItemPosition = ({ item }) => {
    return (
      <Pressable
        onPress={() => navigation.navigate('Details', { data: item })}
        style={{
          borderWidth: 0.5,
          borderColor: color.Default_GREY,
          borderRadius: 9,
          padding: 14,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{ flexDirection: 'row', width: '100%', gap: 10 }}>
          <FastImage
            style={{
              height: 48,
              width: 48,
              borderRadius: 8,
              alignSelf: 'flex-start',
              alignItems: 'center',
            }}
            source={{ uri: userProfileData?.userPicture }}
          />
          <View>
            <Text style={{ fontWeight: '600' }}>{userProfileData?.fullName}</Text>
            <Text style={{ fontWeight: '600', color: color.Default_GREY }}>
              {moment(item?.buyDate).format('DD MMM')}
            </Text>
          </View>
        </View>
        <SeperatorLine />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center',
          }}>
          <Text style={{ fontSize: 12 }}>{item?.symbol}</Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              alignSelf: 'flex-end',
              color: (
                focus === 1 ? item?.netProfitAndLoss < 0 : item?.difference < 0
              )
                ? color.color_red
                : color.Default_GREEN,
              position: 'absolute',
              right: 5,
            }}>
            ₹
            {priceFormat(
              focus === 1 ? item?.netProfitAndLoss : item?.difference,
            ) || 0}
          </Text>
        </View>
        <Text style={{ fontSize: 12, color: color.Default_GREY }}>
          {item?.quantity} QTY
        </Text>
        <SeperatorLine />
      </Pressable>
    );
  };

  // return (
  //   <View style={styles.container}>
  //     <Seperator seperate={10} />
  //     <View style={styles.walletBox}>
  //       <Text style={styles.walletAmountText}>
  //         ₹{priceFormat(userProfileData?.wallet)}
  //       </Text>
  //       <Text style={styles.walletStaticText}>Available Fund</Text>
  //     </View>
  //     <TouchableOpacity style={{position:'absolute',top:40,right:40}} onPress={refresh} >
  //     <Svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 40 40" width="30px" height="30px"><Path fill="#dff0fe" d="M4.207,35.5l2.573-2.574l-0.328-0.353C3.259,29.143,1.5,24.677,1.5,20C1.5,9.799,9.799,1.5,20,1.5 c0.776,0,1.598,0.062,2.5,0.19v4.032C21.661,5.575,20.823,5.5,20,5.5C12.005,5.5,5.5,12.005,5.5,20 c0,3.578,1.337,7.023,3.765,9.701l0.353,0.389l2.883-2.883V35.5H4.207z"/><Path fill="#4788c7" d="M20,2c0.627,0,1.287,0.042,2,0.129v3.009C21.33,5.046,20.661,5,20,5C11.729,5,5,11.729,5,20 c0,3.702,1.383,7.267,3.894,10.037l0.705,0.778l0.743-0.743L12,28.414V35H5.414l1.379-1.379l0.682-0.682l-0.657-0.706 C3.711,28.895,2,24.551,2,20C2,10.075,10.075,2,20,2 M20,1C9.507,1,1,9.507,1,20c0,4.994,1.934,9.527,5.086,12.914L3,36h10V26 l-3.365,3.365C7.387,26.885,6,23.612,6,20c0-7.732,6.268-14,14-14c1.031,0,2.033,0.119,3,0.33V1.259C22.02,1.104,21.023,1,20,1 L20,1z"/><G><Path fill="#dff0fe" d="M20,38.5c-0.776,0-1.598-0.062-2.5-0.19v-4.032c0.839,0.147,1.677,0.222,2.5,0.222 c7.995,0,14.5-6.505,14.5-14.5c0-3.583-1.336-7.03-3.761-9.706l-0.353-0.389L27.5,12.793V4.5h8.293l-2.581,2.582l0.328,0.354 C36.738,10.872,38.5,15.334,38.5,20C38.5,30.201,30.201,38.5,20,38.5z"/><Path fill="#4788c7" d="M34.586,5l-1.387,1.387l-0.682,0.682l0.657,0.706C36.286,11.119,38,15.461,38,20 c0,9.925-8.075,18-18,18c-0.627,0-1.287-0.042-2-0.129v-3.009C18.67,34.954,19.339,35,20,35c8.271,0,15-6.729,15-15 c0-3.708-1.381-7.274-3.89-10.041l-0.705-0.778l-0.743,0.743L28,11.586V5H34.586 M37,4H27v10l3.369-3.369 C32.618,13.111,34,16.388,34,20c0,7.732-6.268,14-14,14c-1.031,0-2.033-0.119-3-0.33v5.071C17.98,38.896,18.977,39,20,39 c10.493,0,19-8.507,19-19c0-4.993-1.942-9.519-5.094-12.906L37,4L37,4z"/></G></Svg>
  //     </TouchableOpacity>
  //     <View style={styles.AvailableMarginBox}>
  //       <View style={styles.AvailableMarginLeft}>
  //         <Text style={styles.AvailableMarginAmountText}>
  //           ₹{priceFormat(userProfileData?.wallet)}
  //         </Text>
  //         <Text style={styles.AvailableMarginStaticText}>Unlimited</Text>
  //       </View>
  //       <View style={styles.InvestedAmountLeft}>
  //         <Text style={styles.InvestedAmountText}>
  //           ₹{priceFormat(userProfileData?.totalInvested)}
  //         </Text>
  //         <Text style={styles.InvestedAmountStaticText}>Invested Amount</Text>
  //       </View>
  //     </View>
  //     <View style={styles.ProftAndLossBox}>
  //       <View style={styles.PastProfitAndLossBox}>
  //         <Text style={styles.ProfitAndLossStatictext}>Past P&L</Text>
  //         <Text
  //           style={{
  //             color: userProfileData?.overallProfit < 0 ? 'red' : 'green',
  //             fontSize: 15,
  //             fontWeight: '600',
  //           }}>
  //           ₹{priceFormat(userProfileData?.overallProfit) || 0}
  //         </Text>
  //       </View>
  //       <View style={styles.PastProfitAndLossBox}>
  //         <Text style={styles.ProfitAndLossStatictext}>Today P&L</Text>
  //         <Text
  //           style={{
  //             color: todayPL < 0 ? 'red' : 'green',
  //             fontSize: 15,
  //             fontWeight: '600',
  //           }}>
  //           ₹{priceFormat(todayPL) || 0}
  //         </Text>
  //       </View>
  //       <View style={styles.PastProfitAndLossBox}>
  //         <Text style={styles.ProfitAndLossStatictext}>Commodity Today P&L</Text>
  //         <Text
  //           style={{
  //             color: todayPLc < 0 ? 'red' : 'green',
  //             fontSize: 15,
  //             fontWeight: '600',
  //           }}>
  //           ₹{todayPLc || 0}
  //         </Text>
  //       </View>
  //     </View>
  //     <Seperator />
  //   </View>
  // );

  return (
    <View style={styles.darkBackground}>
      <View style={styles.safeContainer}>
        <View style={styles.bigDarkCard}>
          <Text style={styles.title}>Available Fund</Text>
          <Text style={styles.fundAmount}>₹ {priceFormat(userProfileData?.wallet) || 0}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Unlimited</Text>
            <Text style={styles.sectionValue}>₹ {priceFormat(userProfileData?.wallet) || 0}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Invested Amount</Text>
            <Text style={styles.sectionValue}>₹ {priceFormat(userProfileData?.totalInvested) || 0}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Past P&L</Text>
            <Text style={[
              styles.sectionValue,
              { color: userProfileData?.overallProfit < 0 ? '#FF6B6B' : '#4CAF50' }
            ]}>
              ₹ {priceFormat(userProfileData?.overallProfit) || 0}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Today P&L</Text>
            <Text style={{
              ...styles.sectionValue,
              color: todayPL < 0 ? '#FF6B6B' : '#4CAF50'
            }}>
              ₹ {priceFormat(todayPL) || 0}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Commodity Today P&L</Text>
            <Text style={{
              ...styles.sectionValue,
              color: todayPLc < 0 ? '#FF6B6B' : '#4CAF50'
            }}>
              ₹ {priceFormat(todayPLc) || 0}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );



};

export default FundScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//     backgroundColor: color.color_black,
//   },
//   headerContainer: {
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     flexDirection: 'row',
//     paddingVertical: 10,
//     marginBottom: 10,
//     // paddingHorizontal: 20,
//   },
//   headerText: {
//     fontSize: 20,
//     // fontFamily: 'Inter-Black',
//     lineHeight: 20 * 1.4,
//     // width: display.setWidth(0),
//     textAlign: 'center',
//     color:'white'
//   },
//   walletBox: {
//     borderRadius: 20,
//     borderWidth: 0.5,
//     borderColor: color.Default_GREY,
//     alignItems: 'center',
//     gap: 7,
//     paddingVertical: 30,
//   },
//   walletAmountText: {
//     fontSize: 25,
//     fontWeight: '700',
//     color:'white'
//   },
//   walletStaticText: {
//     fontSize: 18,
//     color: color.color_white,
//     marginVertical: 5,
//   },
//   AvailableMarginBox: {
//     // gap: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginVertical: 10,
//   },
//   AvailableMarginLeft: {
//     backgroundColor: color.Default_GREEN,
//     width: '48%',
//     borderRadius: 15,
//     paddingVertical: 20,
//     alignItems: 'center',
//     gap: 8,
//   },
//   AvailableMarginAmountText: {
//     fontSize: 18,
//     color: color.color_white,
//     fontWeight: '800',
//   },
//   AvailableMarginStaticText: {
//     fontSize: 15,
//     fontWeight: '400',
//     color: color.color_white,
//   },
//   InvestedAmountLeft: {
//     backgroundColor: color.TEXT_BLUE,
//     width: '48%',
//     borderRadius: 15,
//     paddingVertical: 20,
//     alignItems: 'center',
//     gap: 8,
//   },
//   InvestedAmountText: {
//     fontSize: 18,
//     color: color.color_white,
//     fontWeight: '800',
//   },
//   InvestedAmountStaticText: {
//     fontWeight: '400',
//     fontSize: 15,
//     color: color.color_white,
//   },
//   ProftAndLossBox: {
//     borderRadius: 16,
//     borderWidth: 0.5,
//     borderColor: color.color_white,

//     alignItems: 'center',
//     gap: 7,
//     paddingVertical: 10,
//   },
//   PastProfitAndLossBox: {
//     justifyContent: 'space-between',
//     // alignItems: "center",
//     width: '100%',
//     paddingHorizontal: 10,
//     flexDirection: 'row',
//   },
//   ProfitAndLossStatictext: {
//     fontWeight: '500',
//     fontSize: 16,
//     color:'white'
//   },
//   topTabView: focus => ({
//     width: '50%',
//     borderBottomWidth: 2,
//     borderBottomColor: focus ? color.color_green : color.color_gray,
//     justifyContent: 'center',
//     alignItems: 'center',
//   }),
//   topTabText: focus => ({ color: focus ? color.color_green : color.color_black }),
// });


const styles = StyleSheet.create({
  darkBackground: {
    flex: 1,
    backgroundColor: '#121212',
  },
  safeContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  bigDarkCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  fundAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#BB86FC',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CCCCCC',
  },
  sectionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});


