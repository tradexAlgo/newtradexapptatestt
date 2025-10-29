import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import CalculatePercentage from '../../utils/CalculatePercentage';
import Heart from '../../../assets/Image/heart.png';
import CustomSearch from '../../component/CustomSearchview/CustomSearch';
import OptimizedFlatlist from '../../component/OptimizedFlatlist.js/OptimizedFlatlist';
import { useDispatch, useSelector } from 'react-redux';
import priceFormat from '../../utils/priceFormat';
import CalculateProfitLoss from '../../utils/CalculateProfitLoss';
import { color } from '../../common/color';
import { font } from '../../common/Font';
import Seperator from '../../component/Seperator/Seperator';
import ErrorMessage from '../../component/ErrorMessage/ErrorMessage';
import checkNonEmpty from '../../utils/checkNonEmpty';
import Loader from '../../component/Loader/Loader';
import Icon from 'react-native-vector-icons/AntDesign';
import PostAPI from '../../api/PostAPI';
import Icons from 'react-native-vector-icons/Entypo';
import { getWatchList } from '../../redux/slice/StockDataSlice';
import Spinner from '../../component/Spinner/Spinner';
import DeleteAPI from '../../api/DeleteAPI';
import { fill } from 'lodash';
import { Image } from 'react-native';
import { getRequest, postRequest } from '../../utils/baseURL';
import GetAPI from '../../api/GetAPI';
import { showToast } from '../../common/ToastService';

const SearchPage = ({ navigation }) => {
  const { watchList, searchedStocks, searchLoading, searchStocksFailed } =
    useSelector(state => state.stockData);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState(null);
  const [selectedStockData, setSelectedStockData] = useState(null);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockDetailModalVisible, setStockDetailModalVisible] = useState(false);
  // console.log("searchedStocdks", searchedStocks);
  // dispatch(searchStocks(text));
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [userWatchlists, setUserWatchlists] = useState([
  ]);
  const [userlist, setUserList] = useState([
  ]);
  useEffect(() => {
    getAllSymbolsByUser()
  }, []);


  const getWatchlist = async () => {
    try {
      const response = await getRequest('/market/watchlists', {});
      if (response?.length === 0) {
        return
      }

      const filteredWatchlists = (response?.data || []).filter(item => item?.name);

      setUserWatchlists(filteredWatchlists);
      // setUserWatchlists(response?.data || []);
    } catch (error) {
    }
  };

  const getAllSymbolsByUser = async () => {
    try {
      const response = await getRequest('/market/watchlists/listbyuser', {});
      // console.log("getAllSymbolsByUser response", response?.data);
      if (response?.length === 0) {
        return
      }
      setUserList(response?.data || []);
      getWatchlist()
    } catch (error) {
    }
  };

  const addSymbolToWatchlist = async (symbol, id) => {
    try {
      const payload = {
        watchlistId: id,
        symbol: symbol,
      }


      const response = await postRequest(`/market/watchlistst/symbol`, payload);

      // console.log("addSymbolToWatchlist response", response?.data?.message);
      if (response?.length === 0) {
        return
      }

      // Alert.alert('Success', response?.data?.message || 'Symbol added to watchlist');
         showToast(response?.data?.message||'Symbol added to watchlist');
      setUserWatchlists([])
      getWatchlist()
    } catch (error) {
    }
  };


  const getWatchlistIdBySymbol = (symbol) => {
    if (!symbol) return null;
    const cleanSymbol = symbol.trim().toUpperCase();
    // console.log("ddsfsdfsfsdfooo", userlist);
    for (const wl of userlist) {
      if (wl.symbols.some(s => s.trim().toUpperCase() === cleanSymbol)) {
        return wl.watchlistId;
      }
    }
    return null;
  };


  const removeSymbolToWatchlist = async (symbol) => {

    try {
      const watchlistId = await getWatchlistIdBySymbol(symbol);


      // console.log("removeSymbolToWatchlist payload", watchlistId, symbol);

      const response = await postRequest(`/market/watchlists/${watchlistId}/symbol/${symbol}`, {});

      // console.log("removesybmov watclldnlkj ", response?.message);
      if (response?.length === 0) {
        return
      }

      Alert.alert('Success', response?.message || 'Symbol removed from watchlist');
      setUserWatchlists([])
      getWatchlist();

    } catch (error) {
    }
  };

  const renderItem = ({ item, index }) => {
    const isPositive = item?.changePercent >= 0;
    const isPriceChanged = item?.regularMarketPrice > item?.previousClose;
    // const isUsed = watchList.find(res => res.symbol === item.symbol);
    const isUsed = userlist.some(wl => wl.symbols.includes(item.symbol));


    const addWatch = async symbol => {
      try {
        let data = {
          symbol,
        };
        setLoader(true);
        const res = await PostAPI.addToWatchList(data);
        // console.log(res);
        await dispatch(getWatchList({ navigation }));
        setLoader(false);
      } catch (error) {
        // console.log(error);
        Alert.alert(error?.message);
        setLoader(false);
      }
    };


    const removeWatch = async symbol => {
      try {
        setLoader(true);
        const res = await DeleteAPI.deleteWatchItem(symbol);
        // console.log(res);
        await dispatch(getWatchList({ navigation }));
        setLoader(false);
      } catch (error) {
        // console.log(error);
        Alert.alert(error?.message);
        setLoader(false);
      }
    };

    const fetchStockDetails = async (symbol) => {
      try {
        setStockLoading(true);
        const response = await GetAPI.getOneStockData({ data: symbol, formattedObj: false });
        setSelectedStockData(response?.meta);
        setStockLoading(false);
        // setStockDetailModalVisible(true);
      } catch (error) {
        console.error('Failed to fetch stock data', error);
        setStockLoading(false);
      }
    };

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
        // console.log(error);
        return 'NIFTY'; // fallback if anything fails
      }
    };
    return (
      <Pressable
        style={styles.itemContainer}
        onPress={async () => {

          // if (selectedWatchlistName === 'OPTION CHAIN') {

          //   let sy = await getSymboleName(item?.symbol)
          //   console.log("chekkkkkk", sy)
          //   navigation.navigate('OptionChain', {
          //     symbol: sy,
          //   })
          //   return
          // }


          setSelectedStockSymbol(item.symbol);
          fetchStockDetails(item.symbol);
          setStockDetailModalVisible(true);
        }
          // navigation.navigate('BankDetails', {
          //   symbol: item.symbol,
          // })
        }>
        {/* <View style={styles.iconContainer}>{item.icon}</View> */}
        <View style={styles.textContainer}>
          <Text style={styles.bankName}>{item.symbol}</Text>
          <Text style={styles.nse}>{item.name}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.price]}>
            {priceFormat(item.regularMarketPrice)}
          </Text>
          <View style={styles.resultContainer}>
            {item?.changePercent ? (
              <Text
                style={[
                  styles.price,
                  {
                    color: isPositive ? color.color_green : color.color_red,
                  },
                ]}>{`(${item?.changePercent.toFixed(2)}%)`}</Text>
            ) : (
              CalculateProfitLoss({
                initialValue: item?.previousClose,
                finalValue: item?.regularMarketPrice,
              })
            )}
          </View>
        </View>
        <Pressable
          //   disabled={isUsed}
          onPress={() => {
            if (isUsed) {
              Alert.alert(
                'Remove Symbol',
                'Are you sure you want to remove this symbol from your watchlist?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      removeSymbolToWatchlist(item?.symbol);
                      // removeSymbolToWatchlist(item?.symbol);
                    },
                  },
                ],
              );

            } else {
              setSelectedSymbol(item?.symbol);
              setShowWatchlistModal(true); // Show modal to choose watchlist
            }
          }

          }
          style={styles.priceContainer}>
          {/* <Text style={{fontSize: 30}}>+</Text> */}
          {/* <Icons name={isUsed ? 'heart' : 'heart'} size={22} /> */}
          <Image style={{ height: 25, width: 25, tintColor: isUsed ? 'red' : 'gray' }} source={Heart} resizeMode='' />
        </Pressable>
      </Pressable>
    );
  };
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        visible={stockDetailModalVisible}
        onRequestClose={() => setStockDetailModalVisible(false)}
        transparent={true}
      >
        <TouchableWithoutFeedback onPress={() => setStockDetailModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <SafeAreaView style={{ backgroundColor: '#1e1e1e', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 10, maxHeight: '90%' }}>
                <ScrollView style={{ padding: 16 }}>

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
                    }} >

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
                  {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View><Text style={styles.label}>OPEN</Text><Text style={styles.value}>{selectedStockData?.open}</Text></View>
                    <View><Text style={styles.label}>HIGH</Text><Text style={styles.value}>{selectedStockData?.regularMarketDayHigh}</Text></View>
                    <View><Text style={styles.label}>LOW</Text><Text style={styles.value}>{selectedStockData?.regularMarketDayLow}</Text></View>
                    <View><Text style={styles.label}>PREV. CLOSE</Text><Text style={styles.value}>{selectedStockData?.previousClose}</Text></View>
                  </View> */}

                  {/* Market Depth */}
                  {/* <Text style={{ color: '#ccc', marginTop: 16, marginBottom: 4 }}>Tap to select price</Text>
                        <FlatList
                          data={MarketDepthData}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item }) => (
                            <View style={styles.marketDepthRow}>
                              <Text style={styles.qty}>{item?.buyQty}</Text>
                              <Text style={styles.buyPrice}>₹{item?.buyPrice}</Text>
                              <Text style={styles.sellPrice}>₹{item?.sellPrice}</Text>
                              <Text style={styles.qty}>{item?.sellQty}</Text>
                            </View>
                          )}
                        /> */}

                  {/* Quantity Summary */}
                  {/* <View style={styles.quantitySummary}>
                          <Text style={styles.totalQtyLeft}>3815340</Text>
                          <Text style={styles.totalQtyLabel}>Total Quantity</Text>
                          <Text style={styles.totalQtyRight}>47660</Text>
                        </View> */}

                  {/* Charts Button */}
                  {/* <TouchableOpacity style={styles.chartsButton}>
                          <Text style={{ color: '#3f7fff' }}>📈 Charts</Text>
                        </TouchableOpacity> */}

                  {/* Add to Basket Button */}
                  {/* <TouchableOpacity style={styles.basketButton}>
                          <Text style={{ color: 'white' }}>ADD TO BASKET</Text>
                        </TouchableOpacity> */}
                </ScrollView>

                {/* Buy/Sell Footer Buttons */}
                <View style={styles.footer}>
                  <TouchableOpacity onPress={() => {
                    setStockDetailModalVisible(false)
                    navigation.navigate('OrderPlacementScreen', {
                      stockData: selectedStockData,
                      action: 'BUY', // or 'SELL'
                    });
                  }} style={styles.buyBtn}><Text style={styles.btnText}>BUY</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    setStockDetailModalVisible(false)
                    navigation.navigate('OrderPlacementScreen', {
                      stockData: selectedStockData,
                      action: 'SELL', // or 'SELL'
                    });
                  }} style={styles.sellBtn}><Text style={styles.btnText}>SELL</Text></TouchableOpacity>
                </View>
              </SafeAreaView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        visible={showWatchlistModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWatchlistModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ margin: 20, backgroundColor: 'black', borderRadius: 10, padding: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: 'white' }}>Select Watchlist</Text>
            <ScrollView>
              {userWatchlists.map((watchlist) => (
                <Pressable
                  key={watchlist._id}
                  style={{ paddingVertical: 10 }}
                  onPress={() => {
                    addSymbolToWatchlist(selectedSymbol, watchlist._id);
                    setShowWatchlistModal(false);
                    setSelectedSymbol(null);
                  }}
                >
                  <Text style={{ color: 'white' }} >{watchlist.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable onPress={() => setShowWatchlistModal(false)}>
              <Text style={{ color: 'red', marginTop: 10 }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <CustomSearch />
      <Spinner visible={loader} text={'Adding to watch list'} />
      <Seperator />
      {searchLoading ? (
        <Loader loading={searchLoading} />
      ) : searchStocksFailed ? (
        <ErrorMessage
          //   apiToCall={getWatchList}
          message={searchStocksFailed?.message}
        />
      ) : checkNonEmpty(searchedStocks) ? (
        <OptimizedFlatlist
          contentContainerStyle={{ gap: 10 }}
          renderItem={renderItem}
          data={searchedStocks}
        />
      ) : (
        <>
          <View style={{ width: '100%', height: '100%' }}>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 10,
                justifyContent: 'space-around',
              }}>
              {/* <TouchableOpacity
                style={{
                  borderColor: color.color_gray,

                  borderStyle: 'solid',
                  borderWidth: 1,
                  paddingVertical: 5,

                  width: '40%',
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                  flexDirection: 'row',
                }}
                onPress={() => navigation.navigate('OptionChain')}>
                <Icons name={'line-graph'} />
                <Text
                  style={{
                    fontSize: 18,
                  }}>
                  Options
                </Text>
              </TouchableOpacity> */}
              {/* <TouchableOpacity
                style={{
                  borderColor: color.color_gray,

                  borderStyle: 'solid',
                  borderWidth: 1,
                  paddingVertical: 5,

                  width: '40%',
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                  flexDirection: 'row',
                }}
                onPress={() => navigation.navigate('Futures')}>
                <Icons name={'line-graph'} />
                <Text
                  style={{
                    fontSize: 18,
                  }}>
                  Future
                </Text>
              </TouchableOpacity> */}
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 10,
                justifyContent: 'space-around',
              }}>
              {/* <TouchableOpacity
                style={{
                  borderColor: color.color_gray,
                  borderStyle: 'solid',
                  borderWidth: 1,
                  paddingVertical: 5,

                  // width: '40%',
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                  flexDirection: 'row',
                  paddingHorizontal: 20,
                }}
                onPress={() => navigation.navigate('MCXMaket')}>
                <Icons name={'line-graph'} />

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
              </TouchableOpacity> */}
              {/* <TouchableOpacity
                style={{
                  borderColor: color.color_gray,

                  borderStyle: 'solid',
                  borderWidth: 1,
                  paddingVertical: 5,

                  width: '50%',
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                  flexDirection: 'row',
                }}>
                <Icons name={'line-graph'} />
                <Text
                  style={{
                    fontSize: 18,
                  }}>
                  Future
                </Text>
              </TouchableOpacity> */}
            </View>
            <View
              style={[
                styles.container,
                { justifyContent: 'center', alignItems: 'center' },
              ]}>
              <Text>Search Something...</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
   footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    padding: 10,
  },
  buyBtn: {
    backgroundColor: '#00c98d',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  sellBtn: {
    backgroundColor: '#ff4d4f',
    padding: 15,
    borderRadius: 8,
    flex: 1,
  },
  btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  bankName: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 2,
  color:'white'
},

nse: {
  fontSize: 12,
  color: 'white',
},

price: {
  fontSize: 16,
  fontWeight: '600',
  color:'white'
},

  container: { flex: 1, backgroundColor: color.color_black, padding: 20 },
  containerSec: {
    backgroundColor: color.color_white,
    paddingHorizontal: 15,
    flex: 1,
    paddingVertical: 15,
    gap: 10,
    zIndex: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 18,
    fontFamily: font.nunitobold,
    color: color.color_white,
  },
  seeAllText: {
    fontSize: 15,
    fontFamily: font.nunitoregular,
    color: color.color_white,
  },
  itemContainer: {
    backgroundColor: '#1c1c1e', // a lighter black to contrast with black background
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    // Android elevation
    elevation: 4,

    // iOS shadow
    shadowColor: '#ffffff20',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3
  },
  iconContainer: {
    alignSelf: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
    paddingLeft: 10,
    alignSelf: 'center',
  },
  bankName: {
    fontSize: 14,
    fontFamily: font.nunitoregular,
    fontWeight: 'bold',
    paddingTop: 2,
    color: color.color_white,
  },
  nse: {
    fontSize: 13,
    fontFamily: font.nunitoregular,
    fontWeight: '600',
    color: color.color_limit,
  },
  priceContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    zIndex: 10,
  },
  price: {
    fontSize: 15,
    fontFamily: font.nunitoregular,
    fontWeight: '600',
    paddingTop: 2,
    textAlign: 'center',
    color: color.color_white,
  },
  resultContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  result: {
    fontSize: 13,
    fontFamily: font.nunitoregular,
    fontWeight: '600',
    color: color.color_black,
    textAlign: 'center',
  },
  ltp: {
    fontSize: 13,
    fontFamily: font.nunitoregular,
    fontWeight: '600',
    textAlign: 'center',
  },
  bracket: {
    fontSize: 13,
    fontFamily: font.nunitoregular,
    fontWeight: '600',
    color: color.color_black,
    textAlign: 'center',
  },
});

export default SearchPage;
