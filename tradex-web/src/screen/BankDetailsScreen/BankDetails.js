import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ColorPropType,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useMemo} from 'react';
import {styles} from './styles';
import {font} from '../../common/Font';
import {color} from '../../common/color';

import Appheader from '../../component/AppHeader/appheader';
import BankTopTab from '../../navigation/BankDetailsTopTab/BankTopTab';
import Chandlechart from '../../../assets/svg/chandlechart';
import Linechartlogo from '../../../assets/svg/linechartlogo';
import Download from '../../../assets/svg/download';
import useStore from '../../../store';
import CustomSellModal from '../../component/CustomModal/CustomSellModal';
import GetAPI from '../../api/GetAPI';
import Loader from '../../component/Loader/Loader';
import checkNonEmpty from '../../utils/checkNonEmpty';
import ErrorMessage from '../../component/ErrorMessage/ErrorMessage';
import CalculatePercentage from '../../utils/CalculatePercentage';
import {useSelector} from 'react-redux';
import getSocketData from '../../utils/getSocketData';
import Debounce from '../../utils/Debounce';
import priceFormat from '../../utils/priceFormat';
import {createChart} from 'lightweight-charts';
import {black} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import MarketDepth from './MarketDepth';
import MarketDepthData from './Marketdepthdata';
import WebView from 'react-native-webview';
import HorizontalSeperator from '../MatualFunds/Components/HorizontalSeperator';

const BankDetails = ({navigation, route}) => {
  const [symbol, setSymbol] = useState(route?.params?.symbol);
  useEffect(() => {
    const symbolMapping = {
      '^NSEI': 'NIFTY',
      '^NSEBANK': 'BANKNIFTY',
      'NIFTY_FIN_SERVICE.NS': 'FINNIFTY ',
    };
    if (symbol in symbolMapping) {
      setSymbol(symbolMapping[symbol]);
    }
  }, [symbol]);
  console.log(`test ${symbol}`);

  const viewMode = route?.params?.viewMode;
  const resuly = symbol.replace(/\..*/, '');
  const {show} = useStore();
  const [isModalVisible, setModalVisible] = useState(false);
  const [iscolor, setIsColor] = useState('');
  const [istext, setIsText] = useState('BUY');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [allData, setAllData] = useState([]);
  const {watchList, watchListFailed, stockListSocket} = useSelector(
    state => state.stockData,
  );

  console.log(allData);
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);

        console.log("mioTTT",symbol)
        const response = await GetAPI.getOneStockData({
          data: symbol,
          formattedObj: false,
        });
        setData(response?.meta);
        console.log(data);
        setPrice(response?.meta?.regularMarketPrice);
        setAllData(response);
        setLoading(false);
      } catch (error) {
        setData([]);
        console.log(error);
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const fetchStock = async () => {
    try {
      setLoading(true);
      const response = await GetAPI.getOneStockData({
        data: symbol,
        formattedObj: false,
      });
      setData(response?.meta);

      setPrice(response?.meta?.regularMarketPrice);
      setAllData(response);
      setLoading(false);
    } catch (error) {
      setData([]);

      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const ws = new WebSocket('wss://streamer.finance.yahoo.com');

    ws.onopen = function open() {
      console.log('connected details');
      ws.send(
        JSON.stringify({
          subscribe: [symbol],
        }),
      );
    };

    ws.onclose = function close() {
      console.log('disconnected details');
    };

    ws.onmessage = async function incoming(message) {
      try {
        const stockData = await Debounce({
          func: async () => {
            const result = await getSocketData({message});
            return result;
          },
          delay: 800,
        });
        setData(stockData[0]);
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      {loading ? (
        <Loader loading={loading} />
      ) : checkNonEmpty(data) ? (
        <SafeAreaView style={styles.container}>
          <Appheader
            onPress={() => navigation.goBack()}
            header={data?.symbol}
          />

          <View style={styles.toptextview}>
            <View style={styles.subview}>
              <Text style={styles.numbertext}>
                ₹{priceFormat(data?.regularMarketPrice)}
              </Text>
              {/* <View style={styles.nseview}>
                  <Text
                    style={[
                      styles.nseText,
                      {
                        color: !focus ? color.color_black : color.color_white,
                        backgroundColor: focus ? color.color_green : '#C6C6C6',
                      },
                    ]}
                    onPress={() => setFocus(!false)}>
                    NSE
                  </Text>
                  <Text
                    style={[
                      styles.nseText,
                      {
                        color: focus ? color.color_black : color.color_white,
                        backgroundColor: focus ? '#C6C6C6' : color.color_green,
                      },
                    ]}
                    onPress={() => setFocus(!true)}>
                    BSE
                  </Text>
                </View> */}
            </View>

            <View style={styles.subview}>
              {/* <Text style={styles.rupeetext}>+30.00</Text> */}
              <View style={styles.precentageview}>
                <Text style={styles.baracket}>(</Text>
                <Text
                  style={[
                    styles.percentagetext,
                    {
                      color: data?.changePercent
                        ? data?.changePercent < 0
                          ? color.color_red
                          : color.color_green
                        : CalculatePercentage({
                            initialValue: data?.previousClose,
                            finalValue: data?.regularMarketPrice,
                          }) < 0
                        ? color.color_red
                        : color.color_green,
                    },
                  ]}>
                  {data?.changePercent
                    ? `${data?.changePercent.toFixed(2)}`
                    : CalculatePercentage({
                        initialValue: data?.previousClose,
                        finalValue: data?.regularMarketPrice,
                      })}
                  %
                </Text>
                <Text style={styles.baracket}>)</Text>
              </View>
            </View>
          </View>

          {/* <View style={styles.horizontalline} />

          <Text style={styles.charttext}>Chart</Text>

          <View style={styles.horizontalline} /> */}
          {/* <TouchableOpacity
            style={{
              backgroundColor: color.FACEBOOK_BLUE,
              borderRadius: 100,
              marginHorizontal: 10,
              marginVertical: 15,
            }}
            onPress={() =>
              navigation.navigate('Chart', {
                symbol: symbol,
              })
            }>
            <Text
              style={{
                color: color.color_white,
                fontFamily: font.nunitobold,
                fontSize: 18,
                padding: 10,
                textAlign: 'center',
              }}>
              Chart
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{
              backgroundColor: color.FACEBOOK_BLUE,
              borderRadius: 100,
              marginHorizontal: 10,
              marginVertical: 15,
            }}
            onPress={() =>
              navigation.navigate('OptionChain', {
                symbol: symbol,
              })
            }>
            <Text
              style={{
                color: color.color_white,
                fontFamily: font.nunitobold,
                fontSize: 18,
                padding: 10,
                textAlign: 'center',
              }}>
              Option Chain
            </Text>
          </TouchableOpacity>
          {/* <View style={styles.horizontalline} />

          <Text
            style={{
              fontSize: 18,
              fontFamily: font.nunitobold,
              color: color.color_black,
              paddingHorizontal: 12,
              paddingTop: 5,
            }}>
            Market Depth
          </Text>

          <View style={styles.horizontalline} /> */}

          <CustomSellModal
            quantity={quantity}
            percentage={
              data?.changePercent
                ? `${data?.changePercent.toFixed(2)}`
                : CalculatePercentage({
                    initialValue: data?.previousClose,
                    finalValue: data?.regularMarketPrice,
                  })
            }
            symbol={data?.symbol}
            stockPrice={data?.regularMarketPrice}
            price={price}
            getQuantity={setQuantity}
            modalshow={isModalVisible}
            onPressClose={toggleModal}
            maincolor={iscolor}
            leadtext={istext}
            onPriceChange={setPrice}
          />
          <HorizontalSeperator />
          <WebView
            source={{
              uri: `https://www.tradingview.com/chart/?symbol=${resuly}`,
            }}
          />
          {!viewMode && (
            <View style={styles.buttonmain}>
              <TouchableOpacity
                style={styles.buytext}
                onPress={() => {
                  setIsColor(color.color_darkblue),
                    setModalVisible(true),
                    setIsText('BUY');
                }}>
                <Text style={styles.sametext}>BUY</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.selltext}
                onPress={() => {
                  setIsColor(color.color_red),
                    setModalVisible(true),
                    setIsText('SELL');
                }}>
                <Text style={styles.sametext}>SELL</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      ) : (
        <ErrorMessage onPress={fetchStock} message={'Something went wrong!'} />
      )}
    </>
  );
};

export default BankDetails;
