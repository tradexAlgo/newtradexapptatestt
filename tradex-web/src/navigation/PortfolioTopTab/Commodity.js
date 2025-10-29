import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { color } from '../../common/color';
import OptimizedFlatlist from '../../component/OptimizedFlatlist.js/OptimizedFlatlist';
import { useDispatch, useSelector } from 'react-redux';
import GetAPI from '../../api/GetAPI';
import { getMyCommodities, getMyStocks } from '../../redux/slice/StockDataSlice';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import priceFormat from '../../utils/priceFormat';
import SeperatorLine from '../../component/SeperatorLine';
import { useNavigation } from '@react-navigation/native';
const Commodity = () => {
   const navigation = useNavigation();
  const { myStocks, myCommodities } = useSelector(state => state.stockData);
  const [data, setData] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [focus, setFocus] = useState(1);
  const [todayPL, setTodayPL] = useState(0);
  const [todayPLc, setTodayPLc] = useState(0);
  const dispatch = useDispatch();
  const { userProfileData } = useSelector(state => state.auth);
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
    changeFocus()
  }, []);
  const addStockDifferencePrice = (data) => {
    // item.symbol
    return data.map(item => ({
      ...item,
      stockDifferencePrice: checkDifference(item?.symbol, item?.commodityPrice, item?.quantity) || 0,
      stockLivePrice: StockLive(item?.symbol, item?.commodityPrice, item?.quantity) || 0
    }));
  };
  const changeFocus = type => {
    if (type === 1) {
      setFocus(1);
      // //console.log("myCommodity123",myCommodities,myStocks)

      const updatedCommodityData = addStockDifferencePrice(myCommodities);

      const innerData = updatedCommodityData.filter(stock => stock.executed && !stock.squareOff)
      // console.log("updateme2233", innerData)
      setData(innerData);

      const totalDiff = data
        .filter(stock => Number.isFinite(stock.stockDifferencePrice?._j))
        .reduce((accumulator, stock) => accumulator + stock.stockDifferencePrice?._j, 0);

      // console.log('totalDiff', totalDiff);

      setTodayPLc(totalDiff);

    }
    if (type === 2) {
      dispatch(getMyStocks({ navigation }));

      setFocus(2);
      // setData(stocks);
    }
  };

  useEffect(() => {
    if (focus === 1) {
      // //console.log("myCommodity123",myCommodities,myStocks)
      const updatedCommodityData = addStockDifferencePrice(myCommodities);

      //console.log("Update CommodityData:: ",updatedCommodityData)
      const innerData = updatedCommodityData?.filter(stock => stock.executed && !stock.squareOff)
      // console.log("updateme2233", innerData)


      setData(innerData);
      // console.log("PRINT DATA", data)
      const totalDiff = data
        .filter(stock => Number.isFinite(stock.stockDifferencePrice?._j))
        .reduce((accumulator, stock) => accumulator + stock.stockDifferencePrice?._j, 0);

      // console.log('totalDiff', totalDiff, data);

      setTodayPLc(totalDiff);

    }
  }, [myCommodities]);


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
  console.log("dataISMMO o", stocks)
  useEffect(() => {
    //@ts-expect-error
    dispatch(getMyStocks({ navigation }));
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


  useEffect(() => {
    if (focus === 2) {
      setData([])
      setData(stocks);
    }
  }, [stocks]);




  const [liveData, setLiveData] = useState();

  // Function to fetch market data
  const fetchMarketData = async (payload: any) => {

    try {
      ////console.log("immmm", payload, STOCK.GET_QOUTES)
      const response = await axios.post(STOCK.GET_QOUTES, payload);

      if (response.data.code === 200 && response.data.status) {
        // Process the data in the background
        ////////console.log('Data:', response.data.data.d); // Handle the data as needed
        setLiveData(response.data.data.d)
        ////console.log("resllllll", liveData?.[0])
        return response.data.data.d;
      }
    } catch (error) {
      ////////console.error('Error fetching market data:', error);
    } finally {
    }
  };

  const checkDifference = async (itemSymbol, price, quantity) => {

    if (itemSymbol && price && quantity) {
      // console.log("Print checkDifference payload", itemSymbol, price, quantity)
      const marketData = await fetchMarketData({ symbols: [itemSymbol] });

      // console.log("The stock live", marketData);

      // {"n": "MCX:SILVERMIC25FEBFUT", "s": "ok", "v": {"ask": 86075, "bid": 86052, "ch": 437, "chp": 0.51, "description": "MCX:SILVERMIC25FEBFUT", "exchange": "MCX", "fyToken": "1120250228435357", "high_price": 86100, "low_price": 85000, "lp": 86077, "open_price": 85187, "original_name": "MCX:SILVERMIC25FEBFUT", "prev_close_price": 85640, "short_name": "SILVERMIC25FEBFUT", "spread": 23, "symbol": "MCX:SILVERMIC25FEBFUT", "tt": "1723420800", "volume": 917}}
      const marketPrice = marketData?.[0]?.v?.lp; // Assuming 'lp' is the correct key
      // console.log("______________", marketData?.[0])
      // const difference =
      // (regularMarketPrice - stockPrice) * stock.quantity;

      ////console.log("validalok",(marketPrice - price) * quantity)

      // console.log("Print checkDifference : - ", marketPrice, (marketPrice - price) * quantity)
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
    // { console.log("ittttemmmmm", item) }
    return (
      <Pressable
        onPress={() => navigation.navigate('Details', { data: item })}
        style={{
          borderWidth: 0.5,
          borderColor: color.Default_GREY,
          borderRadius: 9,
          padding: 14,
          backgroundColor: color.color_black,
          marginBottom: 10,
        }}>

        {/* Qty & Avg */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: color.Default_GREY, fontSize: 12 }}>
            Qty. {item.quantity}
          </Text>
          <Text style={{ color: color.Default_GREY, fontSize: 12 }}>
            Avg. {priceFormat(item.stockPrice)}
          </Text>
        </View>

        {/* Symbol */}
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginVertical: 4 }}>
          {item.symbol}
        </Text>

        {/* Profit/Loss */}
        <Text
          style={{
            color: item.difference < 0 ? color.color_red : color.Default_GREEN,
            fontSize: 14,
            fontWeight: '700',
          }}>
          {item.difference > 0 ? '+' : ''}
          {priceFormat(item.difference)}
        </Text>

        {/* Invested + LTP + % */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: color.Default_GREY, fontSize: 12 }}>
            Invested {priceFormat(item.totalAmount)}
          </Text>

          <Text style={{ color: color.Default_GREY, fontSize: 12 }}>
            LTP {priceFormat(item.stockPrice + item.difference)} (
            <Text
              style={{
                color: item.difference < 0 ? color.color_red : color.Default_GREEN,
              }}>
              {((item.difference / item.stockPrice) * 100).toFixed(2)}%
            </Text>
            )
          </Text>
        </View>
      </Pressable>

    );
  };

  // console.log("Commodity Data:", data);
  return (
    <SafeAreaView style={{ backgroundColor: color.color_black, flex: 1, paddingHorizontal: 16 }}>
      <OptimizedFlatlist
        style={{ marginBottom: '5%', marginTop: 20, backgroundColor: color.color_black }}
        contentContainerStyle={{ gap: 20 }}
        renderItem={renderItem}
        // renderItem={focus === 1 ? renderItem : renderItemPosition}
        data={data}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#1a1a1a',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderTopWidth: 0.5,
          borderColor: '#333',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#ccc',
              fontSize: 14,
              fontWeight: '500',
            }}
          >
            Today P&L
          </Text>

          <Text
            style={{
              color: todayPL < 0 ? 'red' : 'green',
              fontSize: 15,
              fontWeight: '600',
            }}
          >
            ₹{priceFormat(todayPL) || 0}
          </Text>
        </View>
      </View>

    </SafeAreaView>
  )
}

export default Commodity

const styles = StyleSheet.create({})