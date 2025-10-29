import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Animated
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import shopping from '../../../assets/shopping.png';
import GetAPI from '../../api/GetAPI';
import { color } from '../../common/color';
import CustomSearch from '../../component/CustomSearchview/CustomSearch';
import StockItem from '../../component/StockItem';
import ErrorMessage from '../../component/ErrorMessage/ErrorMessage';
import Loader from '../../component/Loader/Loader';
import OptimizedFlatlist from '../../component/OptimizedFlatlist.js/OptimizedFlatlist';
import { getWatchList } from '../../redux/slice/StockDataSlice';
import CalculatePercentage from '../../utils/CalculatePercentage';
import CalculateProfitLoss from '../../utils/CalculateProfitLoss';
import { getRequest, postRequest } from '../../utils/baseURL';
import checkNonEmpty from '../../utils/checkNonEmpty';
import priceFormat from '../../utils/priceFormat';
import { styles } from './styles';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { STOCK } from '../../utils/baseURL';

import { useCallback } from 'react';
const WatchlistScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  // const { watchList, watchListFailed, loading, stockListSocket } = useSelector(state => state.stockData);

  const [selectedStockSymbol, setSelectedStockSymbol] = useState(null);
  const [selectedStockData, setSelectedStockData] = useState(null);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockDetailModalVisible, setStockDetailModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [iscolor, setIsColor] = useState('');
  const [rePrice, setRePrice] = useState('');
  const [istext, setIsText] = useState('BUY');

  const [watchList, setWatchList] = useState([]);
  const [watchListFailed, setWatchListFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stockListSocket, setStockListSocket] = useState([]);


  const [userWatchlists, setUserWatchlists] = useState([
    // { id: 'default', name: 'My Watchlist' },
  ]);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  //console.log("watchlist - - - - - //...", userWatchlists)
  const [newWatchlistName, setNewWatchlistName] = useState();

  const [selectedWatchlistId, setSelectedWatchlistId] = useState();
  const [selectedWatchlistName, setSelectedWatchlistName] = useState();

  const [showStockInfoModal, setShowStockInfoModal] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [topIndices, setTopIndices] = useState([]);

  console.log("selectedWatchlistName", selectedWatchlistName)
  // const indexMap = [
  //   { name: 'NIFTY', symbol: '^NSEI' },
  //   { name: 'BANKNIFTY', symbol: '^NSEBANK' },
  //   { name: 'SENSEX', symbol: '^BSESN' },
  //   // { name: 'FINNIFTY', symbol: '^NSEFIN' }, // If this doesn't work, try a fallback or remove
  //   { name: 'MIDCAP', symbol: '^NSEMDCP50' }
  // ];


  const indexSymbols = [
    // { name: 'SENSEX', symbol: 'SENSEX' },
    { name: 'NIFTY', symbol: 'NIFTY' },
    { name: 'BANKNIFTY', symbol: 'BANKNIFTY' },
    { name: 'GOLD', symbol: 'GOLD' },
    { name: 'SILVER', symbol: 'SILVER' },

  ];

  const getMarketIndicesData = async () => {
    try {
      const res = await fetch("https://backend-tradex.onrender.com/market/getQuotesV2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbols: indexSymbols.map(i => i.symbol)
        })
      });

      const json = await res.json();
      if (json.status && json.data) {
        return json.data.map((item) => {
          const meta = indexSymbols.find(s => s.symbol === item.symbol);
          const price = (item?.data?.ltp || item?.data?.lp) ?? 0;
          const change = item?.data?.ch ?? 0;
          return {
            name: meta?.name || item.symbol,
            price: parseFloat(price.toFixed(2)),
            change: parseFloat(change.toFixed(2)),
          };
        });
      }
      return [];
    } catch (err) {
      console.error("Error fetching market indices:", err);
      return [];
    }
  };

  useEffect(() => {
    const loadIndices = async () => {
      const data = await getMarketIndicesData();
      setTopIndices(data);
    };

    loadIndices();
    const interval = setInterval(loadIndices, 2000); // refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  const getIndexNameBySymbol = (symbol) => {
    const match = indexMap.find(item => item.symbol === symbol);
    return match ? match.name : symbol; // fallback to symbol if not found
  };

  const fetchIndexData = async (symbol) => {
    try {
      const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
      const json = await res.json();
      const chart = json.chart.result[0];
      const price = chart.meta.regularMarketPrice;
      const prev = chart.meta.previousClose;
      const change = price - prev;

      return { price, change };
    } catch (err) {
      console.error(`Failed to fetch index data for ${symbol}`, err);
      return null;
    }
  };

  // const getMarketIndicesData = async () => {
  //   const results = await Promise.all(
  //     indexMap.map(async ({ name, symbol }) => {
  //       const data = await fetchIndexData(symbol);
  //       if (data) {
  //         return {
  //           name,
  //           price: parseFloat(data.price.toFixed(2)),
  //           change: parseFloat(data.change.toFixed(2)),
  //         };
  //       } else {
  //         return null;
  //       }
  //     })
  //   );

  //   return results.filter(Boolean); // Remove failed/null entries
  // };


  useEffect(() => {
    const loadIndices = async () => {
      const data = await getMarketIndicesData();
      setTopIndices(data);
    };
    loadIndices();
  }, []);

  console.log("check the top indices data", topIndices)


  useFocusEffect(
    useCallback(() => {
      // getWatchlist();
    }, [])
  );


  useEffect(() => {
    if (selectedWatchlistName === undefined || selectedWatchlistName === 'My Watchlist') {
      getWatchlist();

      const interval = setInterval(() => {
        getWatchlist();
      }, 1000);

      return () => clearInterval(interval);
    }

    return () => { };
  }, [selectedWatchlistName]);
  useEffect(() => {
    getWatchlist();
  }, [])



  // const fetchStockDetails = async (symbol) => {
  //   try {
  //     setStockLoading(true);
  //     const response = await GetAPI.getOneStockData({ data: symbol, formattedObj: false });
  //     setSelectedStockData(response?.meta);
  //     setStockLoading(false);
  //     // setStockDetailModalVisible(true);
  //   } catch (error) {
  //     console.error('Failed to fetch stock data', error);
  //     setStockLoading(false);
  //   }
  // };

  // Calculate upcoming NSE expiry (last Thursday)


  // Last Thursday of given month

  const getLastThursday = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const day = lastDay.getDay();
    const lastThursday = new Date(lastDay);
    lastThursday.setDate(lastDay.getDate() - ((day + 3) % 7));
    return lastThursday;
  };
  const getUpcomingNseExpiry = () => {
    const today = new Date();
    let expiry = getLastThursday(today);

    // If expiry already passed, get last Thursday of next month
    if (expiry < today) {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      expiry = getLastThursday(nextMonth);
    }

    return expiry.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  function getFyersNseFutureSymbol(baseSymbolWithNS, expiryDate) {
    // Remove .NS suffix
    const baseSymbol = baseSymbolWithNS.replace(".NS", "");

    // Parse expiry date (e.g., "28 Aug")
    const [day, month] = expiryDate.split(" ");

    // Get current year last 2 digits
    const year = new Date().getFullYear().toString().slice(-2);

    return `NSE:${baseSymbol}${year}${month.toUpperCase()}FUT`;
  }


  const fetchStockDetails = async (symbol) => {
    try {
      setStockLoading(true);

      let response;

      if (symbol?.startsWith("MCX")) {
        // Fetch MCX data
        const mcxResponse = await fetch("https://backend-tradex.onrender.com/market/getQuotesV2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbols: [symbol] })
        });

        const mcxData = await mcxResponse.json();

        if (mcxData?.status && mcxData?.data?.length > 0) {
          response = mcxData.data[0]; // First matching MCX symbol
        } else {
          throw new Error("No MCX data found");
        }
      } else if (symbol?.startsWith("NSE")) {

        // const afterColon = symbol.split(":")[1];
        // const upcomingExpiry = getUpcomingNseExpiry(); // e.g. "28 Aug"
        // const fyersSymbol = getFyersNseFutureSymbol(afterColon, upcomingExpiry);
        // console.log("is commmkkd",symbol,fyersSymbol)

        const mcxResponse = await fetch("https://backend-tradex.onrender.com/market/getQuotesV2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbols: [symbol] })
        });

        const mcxData = await mcxResponse.json();

        if (mcxData?.status && mcxData?.data?.length > 0) {
          response = mcxData.data[0]; // First matching MCX symbol
        } else {
          throw new Error("No MCX data found");
        }
      } else {
        // Fetch normal stock data
        response = await GetAPI.getOneStockData({ data: symbol, formattedObj: false });
        response = response?.meta;
      }

      setSelectedStockData(response);
    } catch (error) {
      console.error("Failed to fetch stock data", error);
    } finally {
      setStockLoading(false);
    }
  };


  const getWatchlist = async () => {
    try {
      const response = await getRequest('/market/watchlists', {});
      //console.log("getWatchlidst response", response?.data);
      if (response?.length === 0) {
        return
      }

      // console.log("yessllslsl", response?.data)
      // setUserWatchlists(response?.data || []);
      // //console.log("check the get UnreadPostCount", response)
      // setSelectedWatchlistId(response?.data[0]?._id);
      // console.log("check the selected watchlist id", response?.data[0]?._id)
      // getWatchlistSymbols(response?.data[0]?._id)

      const filteredWatchlists = (response?.data || []).filter(item => item?.name);

      console.log("fillltechekc", filteredWatchlists)

      setUserWatchlists(filteredWatchlists);

      if (filteredWatchlists.length > 0) {
        setSelectedWatchlistId(filteredWatchlists[0]?._id);
        getWatchlistSymbols(filteredWatchlists[0]?._id);
      }


    } catch (error) {
    }
  };

  const fetchMarketData = async (payload: any) => {
    try {
      const response = await axios.post(STOCK.GET_QOUTES, payload);
      console.log("Print tshe responfse:", payload, response?.data?.data);
      if (response.data.data) {
        // Process the data
        // setLiveData(response.data.data.d);
        console.log("Live Daddtasds:", response.data.data);
        return response?.data?.data;
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };
  const getWatchlistSymbols = async (id: any) => {
    try {
      const response = await getRequest(`/market/watchlists/${id}/items`, {});
      //console.log("checdsk selected watchlist symboless response", response?.data);
      if (response?.length === 0) {
        setStockListSocket([]);
        setWatchList([]);
        return
      }
      // console.log("check the selected watchlist symboless response", response?.data);
      // const results = await Promise.all(
      //   response?.data
      //     ?.filter(res => !res.symbol.startsWith("MCX:")) // skip MCX symbols
      //     .map(async res => {
      //       const stockData = await GetAPI.getOneStockData({ data: res.symbol });
      //       return { ...stockData, id: res._id };
      //     })
      // );

      const results = await Promise.all(
        response?.data?.map(async (res) => {
          let stockData;

          if (res.symbol.startsWith("MCX:")) {
            // Use fetchMarketData for MCX symbols
            const symbolWithoutPrefix = res.symbol.split("MCX:")[1];
            const marketData = await fetchMarketData({ symbols: [symbolWithoutPrefix] });
            // console.log("Market Data for MCX Symbol:", marketData);
            stockData = marketData || {}; // Adjust depending on marketData format
          } else if (res.symbol.startsWith("NSE:")) {
            const afterColon = res.symbol.split(":")[1];
            const upcomingExpiry = getUpcomingNseExpiry(); // e.g. "28 Aug"
            const fyersSymbol = getFyersNseFutureSymbol(afterColon, upcomingExpiry);
            const marketData = await fetchMarketData({ symbols: [fyersSymbol] });
            // console.log("Market Data for MCX Symbol:", marketData);
            stockData = marketData || {}; // Adjust depending on marketData format
          } else {
            // Use GetAPI for non-MCX symbols
            stockData = await GetAPI.getOneStockData({ data: res.symbol });
          }

          return { ...stockData, id: res._id };
        })
      );


      // console.log("check the results in watchlist", results)
      setStockListSocket(results || []);
      setWatchList(results || []);
    } catch (error) {
    }
  };

  const createNewWatchlist = async (name: any) => {
    try {
      const payload = {
        name
      }

      const response = await postRequest('/market/watchlists', payload);
      //console.log("create payload responselll", response?.data);
      if (response?.length === 0) {
        return
      }


      setNewWatchlistName('');
      setIsAddModalVisible(false);
      getWatchlist()


    } catch (error) {
    }
  };

  const deleteWatchlist = async (id: any) => {
    try {

      //console.log("delete watchlist id", id)
      const response = await postRequest(`/market/watchlists/${id}`, {});
      //console.log("delete payload responselll", response);
      if (response?.length === 0) {
        return
      }

      if (response?.code === 200) {
        Alert.alert("Watchlist Deleted", "The watchlist has been successfully deleted.");
      }
      getWatchlist()

    } catch (error) {
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStockInfoModal(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getWatchlist()
    dispatch(getWatchList()).finally(() => setRefreshing(false));
  };

  // const renderItem = ({ item }) => {
  //   const isPositive = item?.changePercent >= 0;
  //   return (
  //     <TouchableOpacity
  //       style={styles.itemContainer}
  //       onPress={() => navigation.navigate('BankDetails', { symbol: item.symbol })}
  //     >
  //       <View style={styles.textContainer}>
  //         <Text style={[styles.bankName, { color: 'white' }]}>{item.symbol}</Text>
  //         <Text style={[styles.nse, { color: 'white' }]}>NSE</Text>
  //       </View>
  //       <View style={styles.priceContainer}>
  //         <Text style={[styles.price, { color: 'white' }]}>
  //           {priceFormat(item.regularMarketPrice)}
  //         </Text>
  //         <View style={styles.resultContainer}>
  //           {item?.changePercent ? (
  //             <Text
  //               style={[
  //                 styles.price,
  //                 {
  //                   color: isPositive ? color.color_green : color.color_red,
  //                 },
  //               ]}
  //             >{`(${item?.changePercent.toFixed(2)}%)`}</Text>
  //           ) : (
  //             CalculateProfitLoss({
  //               initialValue: item?.previousClose,
  //               finalValue: item?.regularMarketPrice,
  //             })
  //           )}
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  const getSymboleName = async (symbol) => {
    try {
      const response = await GetAPI.getOneStockData({
        data: symbol,
        formattedObj: false,
      });

      const rawSymbol = response?.meta?.symbol;

      // Mapping table
      const symbolMapping = {
        '^NSEI': 'NIFTY',
        '^NSEBANK': 'BANKNIFTY',
        'NIFTY_FIN_SERVICE.NS': 'FINNIFTY',
      };

      // If found in mapping, return mapped value; otherwise fallback to raw symbol
      return symbolMapping[rawSymbol] || rawSymbol || 'NIFTY';

    } catch (error) {
      console.log(error);
      return 'NIFTY'; // fallback if anything fails
    }
  };


  const getCleanSymbolName = (fullSymbol: string) => {
    if (!fullSymbol) return '';
    const namePart = fullSymbol.split(':')[1]; // "ALUMINI25AUGFUT"
    const match = namePart?.match(/[A-Z]+/);  // Extract only the initial alphabets
    return match ? match[0] : namePart;
  };



  const CommodityRow = ({ item }) => {
    const prevHigh = useRef(item[0]?.data?.high_price);
    const prevLow = useRef(item[0]?.data?.low_price);

    const highAnim = useRef(new Animated.Value(0)).current;
    const lowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (item[0]?.data?.high_price !== prevHigh.current) {
        blink(highAnim);
        prevHigh.current = item[0]?.data?.high_price;
      }
      if (item[0]?.data?.low_price !== prevLow.current) {
        blink(lowAnim);
        prevLow.current = item[0]?.data?.low_price;
      }
    }, [item]);

    const blink = (anim) => {
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    };

    return (
      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        {/* Low Price */}
        <Animated.View
          style={{
            backgroundColor: lowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['transparent', 'red'],
            }),
            borderRadius: 4,
            paddingHorizontal: 6,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: 'white' }}>
            L: {priceFormat(item[0]?.data?.low_price)}
          </Text>
        </Animated.View>

        <View style={{ width: 10 }} />

        {/* High Price */}
        <Animated.View
          style={{
            backgroundColor: highAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['transparent', 'green'],
            }),
            borderRadius: 4,
            paddingHorizontal: 6,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: 'white' }}>
            H: {priceFormat(item[0]?.data?.high_price)}
          </Text>
        </Animated.View>
      </View>
    );
  };




  // const renderItem = ({ item }) => {
  //   const isPositive = item?.changePercent >= 0;

  //   return (
  //     <TouchableOpacity
  //       style={styles.itemContainer}
  //       onPress={async () => {

  //         if (selectedWatchlistName === 'OPTION CHAIN') {

  //           let sy = await getSymboleName(item?.symbol)
  //           console.log("chekkkkkk", sy)
  //           navigation.navigate('OptionChain', {
  //             symbol: sy,
  //           })
  //           return
  //         }


  //         setSelectedStockSymbol(item.symbol);
  //         fetchStockDetails(item.symbol);
  //         setStockDetailModalVisible(true);
  //       }}
  //     >

  //       {item?.currency ? (<>
  //         <View style={styles.textContainer}>
  //           <Text style={[styles.bankName, { color: 'white' }]}>{getIndexNameBySymbol(item.symbol)}</Text>
  //           <Text style={[styles.nse, { color: 'white' }]}>NSE</Text>
  //         </View>
  //         <View style={styles.priceContainer}>
  //           <Text style={[styles.price, { color: 'white' }]}>
  //             {priceFormat(item.regularMarketPrice)}
  //           </Text>
  //           <View style={styles.resultContainer}>
  //             {item?.changePercent ? (
  //               <Text
  //                 style={[
  //                   styles.price,
  //                   {
  //                     color: isPositive ? color.color_green : color.color_red,
  //                   },
  //                 ]}
  //               >{`(${item?.changePercent.toFixed(2)}%)`}</Text>
  //             ) : (
  //               CalculateProfitLoss({
  //                 initialValue: item?.previousClose,
  //                 finalValue: item?.regularMarketPrice,
  //               })
  //             )}
  //           </View>
  //         </View>
  //       </>) : (
  //         <>

  //           <View style={styles.textContainer}>
  //             <Text style={[styles.bankName, { color: 'white' }]}>
  //               {getIndexNameBySymbol(item[0]?.data?.symbol || '')}
  //             </Text>
  //             <Text style={[styles.nse, { color: 'white' }]}>
  //               {item[0]?.data?.exchange || 'MCX'}
  //             </Text>
  //           </View>

  //           <View style={styles.priceContainer}>
  //             <Text style={[styles.price, {  color: item[0]?.data?.chp >= 0 ? color.color_green : color.color_red, }]}>
  //               {priceFormat(item[0]?.data?.lp)}
  //             </Text>

  //             <View style={styles.resultContainer}>
  //               {item[0]?.data?.chp ? (
  //                 <Text
  //                   style={[
  //                     styles.price,
  //                     {
  //                       color: item[0]?.data?.chp >= 0 ? color.color_green : color.color_red,
  //                     },
  //                   ]}
  //                 >
  //                   ({item[0]?.data?.chp.toFixed(2)}%)
  //                 </Text>
  //               ) : (
  //                 CalculateProfitLoss({
  //                   initialValue: item[0]?.data?.prev_close_price,
  //                   finalValue: item[0]?.data?.lp,
  //                 })
  //               )}
  //             </View>

  //             <View style={{ flexDirection: 'row', marginTop: 4 }}>
  //               <Text style={[styles.lowHighLabel, { color: 'white' }]}>
  //                 L: {priceFormat(item[0]?.data?.low_price)}
  //               </Text>
  //               <Text style={[styles.lowHighLabel, { color: 'white', marginLeft: 10 }]}>
  //                 H: {priceFormat(item[0]?.data?.high_price)}
  //               </Text>
  //             </View>
  //           </View>


  //         </>
  //       )}

  //     </TouchableOpacity>
  //   );
  // };

  const prioritySymbols = ["NSE:NIFTY", "NSE:BANKNIFTY", "MCX:GOLD", "MCX:SILVER"];

  const filteredTopIndices = prioritySymbols
    .map(sym => topIndices.find(item => item.name.startsWith(sym)))
    .filter(Boolean); // remove any that weren't found



  return (
    <SafeAreaView
      // edges={['top']}
      style={{
        backgroundColor: '#121212',
        flex: 1,
        // paddingTop: 6,
        // paddingHorizontal: 10,
      }}
    >
      <Modal
        animationType="slide"
        visible={stockDetailModalVisible}
        onRequestClose={() => setStockDetailModalVisible(false)}
        transparent={true}
      >
        <TouchableWithoutFeedback onPress={() => {
          setSelectedStockData(null)
          setStockDetailModalVisible(false)
        }

        }>
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback onPress={() => { }}>
              {/* <SafeAreaView style={{ backgroundColor: '#1e1e1e', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 10, maxHeight: '90%' }}>
                <ScrollView style={{ padding: 16 }}>
                
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                    <View style={{ marginBottom: 12 }}>
                      <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                        {selectedStockData?.shortName || selectedStockData?.symbol}
                      </Text>
                      <Text style={{ color: 'lightgray', marginTop: 4 }}>
                        {selectedStockData?.symbol} | {selectedStockData?.currency}
                      </Text>
                    </View>

                    <TouchableOpacity onPress={() => {
                      setStockDetailModalVisible(false)
                      navigation.navigate('ChartScreen', { symbol: selectedStockData?.symbol });
                    }} >

                      <Text style={{ color: color.color_bottomtab, fontSize: 14 }} >Chart 📈</Text>

                    </TouchableOpacity>
                  </View>

                
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Text style={{ fontSize: 22, color: '#00ff88' }}>
                      ₹{priceFormat(selectedStockData?.regularMarketPrice)}
                    </Text>
                    <Text style={{ color: '#00ff88' }}>
                      +{(selectedStockData?.regularMarketPrice - selectedStockData?.previousClose).toFixed(2)} (
                      {CalculatePercentage({
                        initialValue: selectedStockData?.previousClose,
                        finalValue: selectedStockData?.regularMarketPrice,
                      })}
                      %)
                    </Text>
                  </View>

                 
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                   
                    <View><Text style={styles.label}>HIGH</Text><Text style={styles.value}>{selectedStockData?.regularMarketDayHigh}</Text></View>
                    <View><Text style={styles.label}>LOW</Text><Text style={styles.value}>{selectedStockData?.regularMarketDayLow}</Text></View>
                    <View><Text style={styles.label}>PREV. CLOSE</Text><Text style={styles.value}>{selectedStockData?.previousClose}</Text></View>
                  </View>

              
                </ScrollView>

          
                <View style={styles.footer}>
                  <TouchableOpacity onPress={() => {
                    setStockDetailModalVisible(false)
                    navigation.navigate('OrderPlacementScreen', {
                      stockData: selectedStockData,
                      action: 'BUY', 
                    });
                  }} style={styles.buyBtn}><Text style={styles.btnText}>BUY</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    setStockDetailModalVisible(false)
                    navigation.navigate('OrderPlacementScreen', {
                      stockData: selectedStockData,
                      action: 'SELL', 
                    });
                  }} style={styles.sellBtn}><Text style={styles.btnText}>SELL</Text></TouchableOpacity>
                </View>
              </SafeAreaView> */}
              <SafeAreaView style={{ backgroundColor: '#1e1e1e', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 10, maxHeight: '90%' }}>
                <ScrollView style={{ padding: 16 }}>
                  {/* {console.log("selectedStockData", selectedStockData)} */}

                  {selectedStockData?.symbol?.startsWith("MCX") || selectedStockData?.symbol?.startsWith("NSE") ? (
                    // 🔹 MCX UI Layout
                    <>
                      {/* Header */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ marginBottom: 12 }}>
                          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                            {selectedStockData?.data?.short_name || selectedStockData?.symbol}
                          </Text>
                          <Text style={{ color: 'lightgray', marginTop: 4 }}>
                            {selectedStockData?.symbol} | {selectedStockData?.data?.exchange}
                          </Text>
                        </View>
                      </View>

                      {/* MCX Price Section */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                        <Text style={{ fontSize: 22, color: '#00ff88' }}>
                          ₹{priceFormat(selectedStockData?.data?.lp || selectedStockData?.data?.ltp)}
                        </Text>
                        <Text style={{ color: '#00ff88' }}>
                          +{(selectedStockData?.data?.ch)?.toFixed(2)} ({selectedStockData?.data?.chp}%)
                        </Text>
                      </View>

                      {/* MCX OHLC */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <View><Text style={styles.label}>HIGH</Text><Text style={styles.value}>{selectedStockData?.data?.high_price}</Text></View>
                        <View><Text style={styles.label}>LOW</Text><Text style={styles.value}>{selectedStockData?.data?.low_price}</Text></View>
                        <View><Text style={styles.label}>PREV. CLOSE</Text><Text style={styles.value}>{selectedStockData?.data?.prev_close_price}</Text></View>
                      </View>

                      {/* Extra MCX Data */}
                      <View style={{ marginTop: 10 }}>
                        <Text style={styles.label}>VOLUME</Text>
                        <Text style={styles.value}>{selectedStockData?.data?.volume || selectedStockData?.data?.vol_traded_today}</Text>
                      </View>

                      <View style={styles.footer}>
                        <TouchableOpacity onPress={() => {
                          setStockDetailModalVisible(false)
                          // navigation.navigate('CommodityOrderPlacementScreen', {
                          //   stockData: selectedStockData,
                          //   action: 'BUY',
                          // });
                          console.log("check the seledctt", (selectedStockData?.data?.lp || selectedStockData?.data?.ltp))
                          setIsColor(color.color_darkblue),
                            //   setModalVisible(true),
                            setIsText('BUY');
                          // setPrice(liveData[0]?.v?.lp);
                          setIsColor(color.color_darkblue);
                          console.log(" heck mmmm selecteddd", selectedStockData)
                          // return
                          navigation.navigate('CommodityOrderPlacementScreen', {
                            maincolor: color.color_darkblue,
                            leadtext: istext,
                            commodity: (selectedStockData?.data?.lp || selectedStockData?.data?.ltp),
                            symbol: selectedStockData?.data?.symbol, // Or however you're identifying the commodity
                            commodityName: selectedStockData?.data?.symbol || 'Commodity',
                            short_name: selectedStockData?.data?.symbol,
                          });
                        }} style={styles.buyBtn}><Text style={styles.btnText}>BUY</Text></TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                          setStockDetailModalVisible(false)
                          // navigation.navigate('CommodityOrderPlacementScreen', {
                          //   stockData: selectedStockData,
                          //   action: 'SELL',
                          // });
                          setIsText('SELL');

                          navigation.navigate('CommodityOrderPlacementScreen', {
                            maincolor: color.color_red,
                            leadtext: istext,
                            commodity: (selectedStockData?.data?.lp || selectedStockData?.data?.ltp),
                            symbol: selectedStockData?.data?.symbol, // Or however you're identifying the commodity
                            commodityName: selectedStockData?.data?.symbol || 'Commodity',
                            short_name: selectedStockData?.data?.symbol,
                          });
                        }} style={styles.sellBtn}><Text style={styles.btnText}>SELL</Text></TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    // 🔹 Existing Non-MCX Layout
                    <>
                      {/* Header */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                        <View style={{ marginBottom: 12 }}>
                          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                            {selectedStockData?.shortName || selectedStockData?.symbol}
                          </Text>
                          <Text style={{ color: 'lightgray', marginTop: 4 }}>
                            {selectedStockData?.symbol} | {selectedStockData?.currency}
                          </Text>
                        </View>

                        <TouchableOpacity onPress={() => {
                          setStockDetailModalVisible(false)
                          navigation.navigate('ChartScreen', { symbol: selectedStockData?.symbol });
                        }}>
                          <Text style={{ color: color.color_bottomtab, fontSize: 14 }} >Chart 📈</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Price Section */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                        <Text style={{ fontSize: 22, color: '#00ff88' }}>
                          ₹{priceFormat(selectedStockData?.regularMarketPrice)}
                        </Text>
                        <Text style={{ color: '#00ff88' }}>
                          +{(selectedStockData?.regularMarketPrice - selectedStockData?.previousClose).toFixed(2)} (
                          {CalculatePercentage({
                            initialValue: selectedStockData?.previousClose,
                            finalValue: selectedStockData?.regularMarketPrice,
                          })}
                          %)
                        </Text>
                      </View>

                      {/* OHLC Data */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <View><Text style={styles.label}>HIGH</Text><Text style={styles.value}>{selectedStockData?.regularMarketDayHigh}</Text></View>
                        <View><Text style={styles.label}>LOW</Text><Text style={styles.value}>{selectedStockData?.regularMarketDayLow}</Text></View>
                        <View><Text style={styles.label}>PREV. CLOSE</Text><Text style={styles.value}>{selectedStockData?.previousClose}</Text></View>
                      </View>
                      <View style={styles.footer}>
                        <TouchableOpacity onPress={() => {
                          setStockDetailModalVisible(false)
                          navigation.navigate('OrderPlacementScreen', {
                            stockData: selectedStockData,
                            action: 'BUY',
                          });
                        }} style={styles.buyBtn}><Text style={styles.btnText}>BUY</Text></TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                          setStockDetailModalVisible(false)
                          navigation.navigate('OrderPlacementScreen', {
                            stockData: selectedStockData,
                            action: 'SELL',
                          });
                        }} style={styles.sellBtn}><Text style={styles.btnText}>SELL</Text></TouchableOpacity>
                      </View>
                    </>
                  )}
                </ScrollView>

                {/* Buy/Sell Footer Buttons */}

              </SafeAreaView>

            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>





      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showStockInfoModal}
        onRequestClose={() => setShowStockInfoModal(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}
        >
          <View
            style={{
              width: '85%',
              backgroundColor: '#1e1e1e',
              borderRadius: 20,
              padding: 25,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 6,
              elevation: 10,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#fff' }}>
              📊 Welcome
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#ccc',
                marginBottom: 20,
                textAlign: 'center',
              }}
            >
              Monitor live stock data and trends. Tap on any stock to explore details.
            </Text>
            <Pressable
              onPress={() => setShowStockInfoModal(false)}
              style={{
                backgroundColor: color.color_green,
                paddingVertical: 10,
                paddingHorizontal: 25,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Got It</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={isAddModalVisible}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#1e1e1e',
              width: '85%',
              padding: 20,
              borderRadius: 15,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, color: '#fff', marginBottom: 15, fontWeight: '600' }}>
              Create New Watchlist
            </Text>
            <TextInput
              placeholder="Enter watchlist name"
              placeholderTextColor="#999"
              style={{
                backgroundColor: '#2c2c2c',
                width: '100%',
                borderRadius: 10,
                paddingHorizontal: 15,
                paddingVertical: 10,
                color: '#fff',
                marginBottom: 20,
              }}
              value={newWatchlistName}
              onChangeText={setNewWatchlistName}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={() => {
                  if (newWatchlistName.trim()) {
                    const newId = `watchlist_${Date.now()}`;

                    //console.log("newwatchlist name ok ", newWatchlistName.trim());
                    // setUserWatchlists(prev => [
                    //   ...prev,
                    //   { id: newId, name: newWatchlistName.trim() },
                    // ]);
                    createNewWatchlist(newWatchlistName?.trim())
                    // setSelectedWatchlistId(newId);

                  }
                }}
                style={{
                  backgroundColor: color.color_green,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Create</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setNewWatchlistName('');
                  setIsAddModalVisible(false);
                }}
                style={{
                  backgroundColor: '#444',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View
        style={{
          backgroundColor: '#121212',
          paddingVertical: 6,
          paddingHorizontal: 10,
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ alignSelf: 'center' }} >
          {filteredTopIndices?.filter(item => item.price !== 0)?.map((item, index) => {
            const isPositive = item.change >= 0;
            const arrow = isPositive ? '▲' : '▼';
            const changeColor = isPositive ? color.color_green : color.color_red;

            return (
              <View
                key={index}
                style={{
                  marginRight: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: '500',
                  }}
                >
                  {item.name.replace(/^[A-Z]+:/, '') // remove exchange prefix
                    .replace(/\d.*$/, '')    // remove date & extra after numbers
                  }
                </Text>
                <Text
                  style={{
                    color: changeColor,
                    fontSize: 11,
                    fontWeight: '600',
                  }}
                >
                  {arrow} {priceFormat(item.price)}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View
        style={{
          height: 30,
          backgroundColor: '#1a1a1a',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          WELCOME TO FINOVATE
        </Text>
      </View>






      <View style={{ height: 60, backgroundColor: '#121212', paddingRight: 20 }} >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingVertical: 10, paddingLeft: 10, backgroundColor: '#121212' }}
        >
          {userWatchlists.map((watchlist, index) => (

            <TouchableOpacity
              key={watchlist._id}
              onPress={() => {

                console.log("watclisisii", watchlist?.name)
                if (watchlist?.name === 'MCX') {
                  navigation.navigate('MCXMaket')
                  return
                }


                // if(watchList?.name)
                // MCXMaket
                setSelectedWatchlistId(watchlist._id)
                setSelectedWatchlistName(watchlist.name)
                getWatchlistSymbols(watchlist._id)


              }}
              onLongPress={() => {
                if (index === 0) return;
                Alert.alert(
                  'Remove Watchlist',
                  `Are you sure you want to delete "${watchlist.name}"?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => {

                        deleteWatchlist(watchlist._id);
                        setUserWatchlists(prev => prev.filter(w => w._id !== watchlist._id));
                        if (selectedWatchlistId === watchlist._id) {
                          setSelectedWatchlistId(selectedWatchlistId);
                        }
                      },
                    },
                  ]
                );
              }}
              style={{
                marginRight: 10,
                paddingVertical: 8,
                paddingHorizontal: 15,
                borderRadius: 20,
                height: 40,
                backgroundColor:
                  selectedWatchlistId === watchlist._id ? color.color_green : '#1e1e1e',
              }}
            >

              <Text style={{ color: '#fff', fontWeight: '500' }}>{watchlist.name}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => setIsAddModalVisible(true)}
            style={{
              backgroundColor: '#333',
              paddingVertical: 8,
              paddingHorizontal: 15,
              borderRadius: 20,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: color.color_green, fontSize: 18 }}>＋</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={{ flexDirection: 'row', backgroundColor: 'black', alignSelf: 'flex-start' }}>
        <TouchableOpacity onPress={() => navigation.navigate('SearchPage')} style={{ flex: 1, width: '70%' }}>
          <CustomSearch editable={false} />
        </TouchableOpacity>

        {/* <View>
                <TouchableOpacity
                  style={{
                    borderColor: color.color_gray,
                    borderWidth: 0.5,
                    paddingVertical: 5,

                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    backgroundColor: color.color_green,
                    marginRight: 10,
                    marginTop: 5
                  }}
                  onPress={() => navigation.navigate('MCXMaket')}>
              

                  <Text
                    style={{
                      fontSize: 18,
                      color: color.color_white,
                      fontFamily: font.nunitoregular,
                      fontWeight: '600',
                      textAlign: 'center',
                    }}>
                    MCX
                  </Text>
                </TouchableOpacity>
              </View> */}
      </View>

      {loading ? (
        <Loader loading={loading} />
      ) : watchListFailed ? (
        <ErrorMessage apiToCall={getWatchList} message={watchListFailed?.message} />
      ) : checkNonEmpty(watchList) ? (
        <SafeAreaView style={[styles.container, { backgroundColor: '#121212' }]}>
          {/* <Seperator seperate={15} /> */}
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[color.color_green]} />
            }
          >


            <View style={styles.containerSec}>
              {/* <OptimizedFlatlist contentContainerStyle={{ gap: 10 }} renderItem={renderItem} data={stockListSocket} /> */}
              <OptimizedFlatlist
                data={stockListSocket}
                keyExtractor={(item, index) => item?.symbol || index.toString()}
                renderItem={({ item }) => (
                  <StockItem
                    item={item}
                    selectedWatchlistName={selectedWatchlistName}
                    getSymboleName={getSymboleName}
                    navigation={navigation}
                    onPress={(symbol) => {
                      console.log("checkkkkkk", symbol)
                      setSelectedStockSymbol(symbol);
                      fetchStockDetails(symbol);
                      setStockDetailModalVisible(true);

                    }}
                  />
                )}
              />

            </View>
          </ScrollView>
        </SafeAreaView>
      ) : (
        <LinearGradient
          colors={['#1e1e1e', '#121212']}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View
            style={{
              height: 250,
              width: 250,
              borderRadius: 30,
              backgroundColor: '#1f1f1f',
              shadowColor: '#000',
              shadowOffset: { width: 4, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FastImage
              style={{
                height: 220,
                width: 220,
                borderRadius: 20,
              }}
              source={shopping}
            />
          </View>
          <Text
            style={{
              marginTop: 20,
              fontSize: 18,
              color: '#fff',
              textAlign: 'center',
              paddingHorizontal: 20,
              fontWeight: 'bold',
              backgroundColor: '#1f1f1f',
              paddingVertical: 10,
              borderRadius: 15,
              shadowColor: '#000',
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 8,
              overflow: 'hidden',
            }}
          >
            Add Stock In Watchlist to see!!
          </Text>
        </LinearGradient>
      )}
    </SafeAreaView>
  );
};
export default WatchlistScreen;


