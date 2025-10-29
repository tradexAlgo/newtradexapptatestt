import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import shopping from '../../../assets/shopping.png';
import GetAPI from '../../api/GetAPI';
import { color } from '../../common/color';
import CustomSearch from '../../component/CustomSearchview/CustomSearch';
import ErrorMessage from '../../component/ErrorMessage/ErrorMessage';
import Loader from '../../component/Loader/Loader';
import OptimizedFlatlist from '../../component/OptimizedFlatlist.js/OptimizedFlatlist';
import StockItem from '../../component/StockItem';
import { getWatchList } from '../../redux/slice/StockDataSlice';
import CalculatePercentage from '../../utils/CalculatePercentage';
import { getRequest, postRequest, STOCK } from '../../utils/baseURL';
import checkNonEmpty from '../../utils/checkNonEmpty';
import priceFormat from '../../utils/priceFormat';
import { styles } from './styles';


interface Watchlist {
  _id: string;
  name: string;
  symbol?: string;
}

interface StockData {
  id: string;
  [key: string]: any; // depends on your API structure
}


const WatchlistScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [selectedStockSymbol, setSelectedStockSymbol] = useState(null);
  const [selectedStockData, setSelectedStockData] = useState(null);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockDetailModalVisible, setStockDetailModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [iscolor, setIsColor] = useState('');
  const [istext, setIsText] = useState('BUY');

  const [watchList, setWatchList] = useState([]);
  const [watchListFailed, setWatchListFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stockListSocket, setStockListSocket] = useState([]);


  const [userWatchlists, setUserWatchlists] = useState([
    // { id: 'default', name: 'My Watchlist' },
  ]);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState();

  const [selectedWatchlistId, setSelectedWatchlistId] = useState();
  const [selectedWatchlistName, setSelectedWatchlistName] = useState();

  const [showStockInfoModal, setShowStockInfoModal] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [topIndices, setTopIndices] = useState([]);
  const [error, setError] = useState<string | null>(null);


  console.log("topinddd",topIndices)
  const indexSymbols = [
     { name: 'NSE:NIFTY25OCTFUT', symbol: 'NSE:NIFTY25OCTFUT' },
    // { name: 'NIFTY', symbol: 'NIFTY' },
    { name: 'BANKNIFTY', symbol: 'BANKNIFTY' },
    { name: 'GOLD', symbol: 'GOLD' },
    { name: 'SILVER', symbol: 'SILVER' },

  ];


 // -------- get watchlists once --------
  const getWatchlist = async () => {
    try {
      const response = await getRequest("/market/watchlists", {});
      console.log("try the reponse of",response?.data)
      const filtered: Watchlist[] = (response?.data || []).filter(
        (item: Watchlist) => item?.name
      );

      setUserWatchlists(filtered);

      if (filtered.length > 0 && !selectedWatchlistId) {
        setSelectedWatchlistId(filtered[0]._id);
        await getWatchlistSymbols(filtered[0]._id);
      }
    } catch (err: any) {
      console.error("getWatchlist error:", err?.message || err);
      setError(err?.message || "Failed to fetch watchlist");
    }
  };

  // -------- get symbols for selected watchlist --------
  const getWatchlistSymbols = async (id: string) => {
    try {
      const response = await getRequest(`/market/watchlists/${id}/items`, {});

      if (!response?.data || response.data.length === 0) {
        setStockListSocket([]);
        setWatchList([]);
        return;
      }

      const results: StockData[] = await Promise.all(
        response.data.map(async (res: any) => {
          let stockData: any = {};

          if (res.symbol.startsWith("MCX:")) {
            const symbolWithoutPrefix = res.symbol.split("MCX:")[1];
            const marketData = await fetchMarketData({
              symbols: [symbolWithoutPrefix],
            });
            stockData = marketData || {};
          } else if (res.symbol.startsWith("NSE:")) {
            const afterColon = res.symbol.split(":")[1];
            const upcomingExpiry = getUpcomingNseExpiry();

            // You can generate fyers symbol if needed:
            // const fyersSymbol = getFyersNseFutureSymbol(afterColon, upcomingExpiry);

            const marketData = await fetchMarketData({ symbols: [res.symbol] });
            stockData = marketData || {};
          } else {
            stockData = await GetAPI.getOneStockData({ data: res.symbol });
          }

          return { ...stockData, id: res._id };
        })
      );

      setStockListSocket(results || []);
      setWatchList(results || []);
    } catch (err: any) {
      console.error("getWatchlistSymbols error:", err?.message || err);
      setError(err?.message || "Failed to fetch symbols");
    }
  };

  // -------- load watchlist on mount --------
  useEffect(() => {
    getWatchlist();
  }, []);

  // -------- poll symbols every 2s --------
  useEffect(() => {
    if (!selectedWatchlistId) return;

    // fetch immediately
    getWatchlistSymbols(selectedWatchlistId);

    const interval = setInterval(() => {
      getWatchlistSymbols(selectedWatchlistId);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedWatchlistId]);




console.log("STOCK?.GET_QOUTES",STOCK?.GET_QOUTES)



  const getMarketIndicesData = async () => {
    try {
      const res = await fetch(`${STOCK?.GET_QOUTES}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbols: indexSymbols.map(i => i.symbol)
        })
      });



      const json = await res.json();

      console.log("check this point ---_>",json)
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
    const interval = setInterval(loadIndices, 2000); 
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const loadIndices = async () => {
      const data = await getMarketIndicesData();
      setTopIndices(data);
    };
    loadIndices();
  }, []);




  useEffect(() => {
    getWatchlist();
  }, [])


  // step one: get watchlist
  // useEffect(() => {
  //   let interval: NodeJS.Timeout | undefined;

  //   if (selectedWatchlistName === "My Watchlist") {
  //     getWatchlist();

  //     interval = setInterval(() => {
  //       getWatchlist();
  //     }, 1000);
  //   } else if (selectedWatchlistName) {
  //     getWatchlist();
  //   }

  //   return () => {
  //     if (interval) clearInterval(interval);
  //   };
  // }, []);



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

    if (expiry < today) {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      expiry = getLastThursday(nextMonth);
    }

    return expiry.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  function getFyersNseFutureSymbol(baseSymbolWithNS, expiryDate) {
    const baseSymbol = baseSymbolWithNS.replace(".NS", "");
    const [day, month] = expiryDate.split(" ");

    const year = new Date().getFullYear().toString().slice(-2);

    return `NSE:${baseSymbol}${year}${month.toUpperCase()}FUT`;
  }


  const fetchStockDetails = async (symbol) => {
    try {
      setStockLoading(true);

      let response;

      if (symbol?.startsWith("MCX")) {
        const mcxResponse = await fetch(`${STOCK?.GET_QOUTES}`, {
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

        const mcxResponse = await fetch(`${STOCK?.GET_QOUTES}`, {
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

// step two: get symbols of that watchlist
  // const getWatchlist = async () => {
  //   try {
  //     const response = await getRequest('/market/watchlists', {});
  //     console.log("--------------------------------------")
  //     console.log("---response",response)
  //     if (response?.length === 0) {
  //       return
  //     }

  //     const filteredWatchlists = (response?.data || []).filter(item => item?.name);

  //     setUserWatchlists(filteredWatchlists);

  //     if (filteredWatchlists.length > 0) {
  //       setSelectedWatchlistId(filteredWatchlists[0]?._id);
  //       console.log("filteredWatchlists[0]?._id:", filteredWatchlists[0]?._id);
  //       getWatchlistSymbols(filteredWatchlists[0]?._id);
  //     }

  //   } catch (error) {
  //   }
  // };

  const fetchMarketData = async (payload: any) => {
    try {
      const response = await axios.post(STOCK.GET_QOUTES, payload);
      if (response.data.data) {
        return response?.data?.data;
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

//step three : get symbols of that watchlist
  // const getWatchlistSymbols = async (id: any) => {
  //   try {
  //     const response = await getRequest(`/market/watchlists/${id}/items`, {});
  //     if (response?.length === 0) {
  //       setStockListSocket([]);
  //       setWatchList([]);
  //       return
  //     }
  //     const results = await Promise.all(
  //       response?.data?.map(async (res) => {
  //         let stockData;

  //         if (res.symbol.startsWith("MCX:")) {
  //           const symbolWithoutPrefix = res.symbol.split("MCX:")[1];
  //           const marketData = await fetchMarketData({ symbols: [symbolWithoutPrefix] });
  //           stockData = marketData || {}; // Adjust depending on marketData format
  //         } else if (res.symbol.startsWith("NSE:")) {
  //           const afterColon = res.symbol.split(":")[1];
  //           const upcomingExpiry = getUpcomingNseExpiry(); // e.g. "28 Aug"

  //           // const fyersSymbol = getFyersNseFutureSymbol(afterColon, upcomingExpiry);
  //           // console.log("fyersSymbol fyersSymbol fyersSymbol:", fyersSymbol);

  //           const marketData = await fetchMarketData({ symbols: [res.symbol] });
  //           stockData = marketData || {}; // Adjust depending on marketData format
  //         } else {
  //           stockData = await GetAPI.getOneStockData({ data: res.symbol });
  //         }

  //         return { ...stockData, id: res._id };
  //       })
  //     );


  //     setStockListSocket(results || []);
  //     setWatchList(results || []);
  //   } catch (error) {
  //   }
  // };

  const createNewWatchlist = async (name: any) => {
    try {
      const payload = {
        name
      }

      const response = await postRequest('/market/watchlists', payload);
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

      const response = await postRequest(`/market/watchlists/${id}`, {});
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


  const getSymboleName = async (symbol) => {
    try {
      const response = await GetAPI.getOneStockData({
        data: symbol,
        formattedObj: false,
      });

      const rawSymbol = response?.meta?.symbol;

      const symbolMapping = {
        '^NSEI': 'NIFTY',
        '^NSEBANK': 'BANKNIFTY',
        'NIFTY_FIN_SERVICE.NS': 'FINNIFTY',
      };

      return symbolMapping[rawSymbol] || rawSymbol || 'NIFTY';

    } catch (error) {
      return 'NIFTY'; 
    }
  };


 
  const prioritySymbols = ["NSE:NIFTY", "NSE:BANKNIFTY", "MCX:GOLD", "MCX:SILVER"];

  const filteredTopIndices = prioritySymbols
    .map(sym => topIndices.find(item => item.name.startsWith(sym)))
    .filter(Boolean); 



  return (
    <SafeAreaView
      style={{
        backgroundColor: '#121212',
        flex: 1,
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
             
              <SafeAreaView style={{ backgroundColor: '#1e1e1e', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 10, maxHeight: '90%' }}>
                <ScrollView style={{ padding: 16 }}>

                  {selectedStockData?.symbol?.startsWith("MCX") || selectedStockData?.symbol?.startsWith("NSE") ? (
                    <>
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

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                        <Text style={{ fontSize: 22, color: '#00ff88' }}>
                          ₹{priceFormat(selectedStockData?.data?.lp || selectedStockData?.data?.ltp)}
                        </Text>
                        <Text style={{ color: '#00ff88' }}>
                          +{(selectedStockData?.data?.ch)?.toFixed(2)} ({selectedStockData?.data?.chp}%)
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <View><Text style={styles.label}>HIGH</Text><Text style={styles.value}>{selectedStockData?.data?.high_price}</Text></View>
                        <View><Text style={styles.label}>LOW</Text><Text style={styles.value}>{selectedStockData?.data?.low_price}</Text></View>
                        <View><Text style={styles.label}>PREV. CLOSE</Text><Text style={styles.value}>{selectedStockData?.data?.prev_close_price}</Text></View>
                      </View>
                      <View style={{ marginTop: 10 }}>
                        <Text style={styles.label}>VOLUME</Text>
                        <Text style={styles.value}>{selectedStockData?.data?.volume || selectedStockData?.data?.vol_traded_today}</Text>
                      </View>

                      <View style={styles.footer}>
                        <TouchableOpacity onPress={() => {
                          setStockDetailModalVisible(false)
                          setIsColor(color.color_darkblue),
                            setIsText('BUY');
                          setIsColor(color.color_darkblue);
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
                    <>
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


              </SafeAreaView>

            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>





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
                    createNewWatchlist(newWatchlistName?.trim())
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
                  {item.name.replace(/^[A-Z]+:/, '') 
                    .replace(/\d.*$/, '')   
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
          {userWatchlists?.map((watchlist, index) => (

            <TouchableOpacity
              key={watchlist._id}
              onPress={() => {

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

      </View>

      {loading ? (
        <Loader loading={loading} />
      ) : watchListFailed ? (
        <ErrorMessage apiToCall={getWatchList} message={watchListFailed?.message} />
      ) : checkNonEmpty(watchList) ? (
        <SafeAreaView style={[styles.container, { backgroundColor: '#121212' }]}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[color.color_green]} />
            }
          >


            <View style={styles.containerSec}>
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


