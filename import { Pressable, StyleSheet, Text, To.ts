import { Pressable, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { color } from '../../common/color';
import OptimizedFlatlist from '../../component/OptimizedFlatlist.js/OptimizedFlatlist';
import { useDispatch, useSelector } from 'react-redux';
import GetAPI from '../../api/GetAPI';
import { getMyCommodities, getMyStocks, getStockHistory, getWatchList } from '../../redux/slice/StockDataSlice';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import priceFormat from '../../utils/priceFormat';
import SeperatorLine from '../../component/SeperatorLine';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { userProfile } from '../../redux/slice/AuthSlice';
import { fetchOptionChain, fetchOptionChainOLD } from '../../utils/getNse';
import PostAPI from '../../api/PostAPI';
import CustomAlert from '../../common/CustomAlert';
import { showToast } from '../../common/ToastService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STOCK } from '../../utils/baseURL';
import axios from 'axios';
const Equity = () => {
  const navigation = useNavigation();
  const { myStocks, myCommodities } = useSelector(state => state.stockData);
  const [data, setData] = useState([]);
  const [comdata, setComData] = useState([]);
  const [commo, setCommo] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [focus, setFocus] = useState(2);
  const [todayPL, setTodayPL] = useState(0);
  const [todayPLc, setTodayPLc] = useState(0);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const { userProfileData } = useSelector(state => state.auth);
  const [commodityArray, setCommodityArray] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // console.log("datammdmee", commo)

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
  }, []);

  // const addStockDifferencePrice = (data) => {
  //   // item.symbol
  //   return data.map(async item => ({
  //     ...item,
  //     stockDifferencePrice: await checkDifference(item?.symbol, item?.commodityPrice, item?.quantity) || 0,
  //     // stockLivePrice: StockLive(item?.symbol, item?.commodityPrice, item?.quantity) || 0
  //   }));
  // };

  const addStockDifferencePrice = async (data) => {
    return Promise.all(
      data.map(async item => ({
        ...item,
        stockDifferencePrice: await checkDifference(item?.symbol, item?.commodityPrice, item?.quantity) || 0,
        // stockLivePrice: await StockLive(item?.symbol, item?.commodityPrice, item?.quantity) || 0
      }))
    );
  };


  const changeFocus = type => {
    if (type === 1) {
      setFocus(1);
      // //console.log("myCommodity123",myCommodities,myStocks)

      const updatedCommodityData = addStockDifferencePrice(myCommodities);

      const innerData = updatedCommodityData.filter(stock => stock.executed)
      // const innerData = updatedCommodityData.filter(stock => stock.executed && !stock.squareOff)
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
  // console.log("heyd", commo)

  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedCommodityData = await addStockDifferencePrice(myCommodities);

      // console.log("Update CommodityData:: ", updatedCommodityData)

      const innerData = updatedCommodityData?.filter(stock => stock.executed);


      // console.log("check me the orderdata", innerData, innerData?.length);

      // setCommo(innerData);

      // const innerData = updatedCommodityData?.filter(stock => {
      //   const diff = stock?.stockDifferencePrice?._j;
      //   return stock.executed && diff !== null && diff !== undefined && diff !== 0;
      // });

      // if (innerData?.length > 0) {
      setCommo(innerData);
      // }
      const totalDiff = innerData
        ?.filter(stock => Number.isFinite(stock.stockDifferencePrice))
        ?.reduce((accumulator, stock) => accumulator + stock.stockDifferencePrice, 0);

      // console.log('totalDiff', totalDiff, data);

      setTodayPLc(totalDiff);
    }, 2000); // every 2 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [myCommodities]);

  // useEffect(() => {
  //   // if (focus === 1) {
  //   // //console.log("myCommodity123",myCommodities,myStocks)
  //   const updatedCommodityData = addStockDifferencePrice(myCommodities);

  //   //console.log("Update CommodityData:: ",updatedCommodityData)
  //   const innerData = updatedCommodityData?.filter(stock => stock.executed)
  //   // const innerData = updatedCommodityData?.filter(stock => stock.executed && !stock.squareOff)
  //   // console.log("updateme2233", innerData)


  //   console.log("check me the orderdata", innerData, innerData?.length)
  //   // setData(innerData);
  //   setCommo(innerData);
  //   // console.log("PRINT DATA", data)
  //   const totalDiff = commo
  //     .filter(stock => Number.isFinite(stock.stockDifferencePrice?._j))
  //     .reduce((accumulator, stock) => accumulator + stock.stockDifferencePrice?._j, 0);

  //   console.log('totalDiff', totalDiff, data);

  //   setTodayPLc(totalDiff);

  //   // }
  // }, [myCommodities]);


  useEffect(() => {
    const fetch = async () => {
      try {
        // Filter stocks that are executed but not yet squared off
        const data = myStocks?.filter((stock: any) => stock.executed);
        // const data = myStocks?.filter((stock: any) => stock.executed && !stock.squareOff);

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

              // console.log("basera", stockData?.lastPrice, stockData?.regularMarketPrice)

              const lastPriceDifference = (stockData?.lastPrice) || stockData?.regularMarketPrice || 0;
              // console.log("check the last priceddd", lastPriceDifference)

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


  // console.log("dataISMMO o", stocks)

  useEffect(() => {
    //@ts-expect-error
    dispatch(getMyStocks({ navigation }));
    dispatch(getMyCommodities({ navigation }));
  }, [navigation]);

  //   useEffect(() => {
  //   const interval = setInterval(() => {
  //     //@ts-expect-error
  //     dispatch(getMyStocks({ navigation }));
  //     dispatch(getMyCommodities({ navigation }));
  //   }, 3000); // 1000 ms = 1 sec

  //   return () => clearInterval(interval); // cleanup on unmount
  // }, [navigation]);

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

  useEffect(() => {
    if (focus === 2) {
      setComData([])
      setComData(commo);
    }
  }, [commo]);




  const [liveData, setLiveData] = useState();

  // Function to fetch market data
  const fetchMarketData = async (payload: any) => {

    try {
      // console.log("dsfsfoosdfoofds", payload, STOCK.GET_QOUTES)
      const response = await axios.post(STOCK.GET_QOUTES, payload);

      // console.log("Response from market dadtdda:", response?.data?.status);
      if (response.data.status) {
        // Process the data in the background
        // console.log("response?.data?.data?s.data",response?.data?.data)
        ////////console.log('Data:', response.data.data.d); // Handle the data as needed
        setLiveData(response?.data?.data)
        ////console.log("resllllll", liveData?.[0])
        return response?.data?.data;
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


      // {"n": "MCX:SILVERMIC25FEBFUT", "s": "ok", "v": {"ask": 86075, "
      // bid": 86052, "ch": 437, "chp": 0.51, "description": "MCX:SILVERMIC25FEBFUT", "exchange": "MCX", "fyToken": "1120250228435357", "high_price": 86100, "low_price": 85000, "lp": 86077, "open_price": 85187, "original_name": "MCX:SILVERMIC25FEBFUT", "prev_close_price": 85640, "short_name": "SILVERMIC25FEBFUT", "spread": 23, "symbol": "MCX:SILVERMIC25FEBFUT", "tt": "1723420800", "volume": 917}}
      const marketPrice = (marketData?.[0]?.data?.lp || marketData?.[0]?.data?.ltp); // Assuming 'lp' is the correct key

      // console.log("The stock live", (marketPrice - price) * quantity);

      // console.log("helloo mmmmm",marketData)
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
      // console.log("check the payload firstll", itemSymbol, price, quantity);
      const marketData = await fetchMarketData({ symbols: [itemSymbol] });


      // console.log("The stock live", marketData);

      // Access the live market price
      const marketPrice = marketData?.[0]?.v?.lp; // Assuming 'lp' is the correct key

      // console.log("Calculated value:", marketPrice, (marketPrice - price) * quantity);

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

  const squareOff = (item) => {
    setSelectedItem(item);
    setShowAlert(true);
  };



  const handleConfirmSquareOff = async async => {
    setShowAlert(false);
    const item = selectedItem;
    try {

      // console.log(
      //   "itemitem", item
      // )

      if (item?.identifier === '') {

        const response = await GetAPI.getOneStockData({
          data: item?.stockName,
          formattedObj: false,
        });

        if (true) {
          // console.log("latest price ",optionData[item?.optionType].lastPrice);
          let formdata = {
            stockId: item._id,
            totalAmount: item?.totalAmount,
            stockPrice: item?.stockPrice,
            stockName: item?.stockName,
            latestPriceData: response?.meta?.regularMarketPrice
          };
          setLoader(true);
          const response = await PostAPI.squareOff(formdata);
          // console.log("YEs thisiiiiii", response);
          showToast(response.message);
          dispatch(userProfile({ navigation }));
          dispatch(getWatchList({ navigation }));
          dispatch(getMyStocks({ navigation }));
          dispatch(getStockHistory({ navigation }));
          setLoader(false);
        } else {
          // console.log(
          //   `No data found for symbol: ${symbol}, optionType: ${item?.optionType}, identifier: ${item?.identifier}`
          // );
        }
      } else {
        // console.log("get latest price f", item)

        const result = await fetchOptionChain(item?.stockName);

        const optionData = result?.records?.data?.find((i) => {

          return i[item?.optionType]?.identifier === item?.identifier;
        });

        if (optionData) {
          // Resolve the lastPrice of the filtered option
          // console.log("latest price ",optionData[item?.optionType].lastPrice);
          let formdata = {
            stockId: item._id,
            totalAmount: item?.totalAmount,
            stockPrice: item?.stockPrice,
            stockName: item?.stockName,
            latestPriceData: optionData[item?.optionType].lastPrice
          };
          setLoader(true);
          const response = await PostAPI.squareOff(formdata);
          // console.log(response);
          // Alert.alert(response.message);
          showToast(response?.message);
          dispatch(userProfile({ navigation }));
          dispatch(getWatchList({ navigation }));
          dispatch(getMyStocks({ navigation }));
          dispatch(getStockHistory({ navigation }));
          setLoader(false);
        } else {
          // If no matching data found, resolve with an appropriate message
          // console.log(
          //   `No data found for symbol: ${'symbol'}, optionType: ${item?.optionType}, identifier: ${item?.identifier}`
          // );
        }
      }


    } catch (error) {
      // console.log(error);
      setLoader(false);
      showToast('Error squaring off position');
    }
  };
  // const renderItemPosition = ({ item }) => {
  //   { console.log("ittttemmmmm", item) }
  //   return (
  //     <Pressable
  //       onPress={() => navigation.navigate('Details', { data: item })}
  //       style={{
  //         borderWidth: 0.5,
  //         borderColor: color.Default_GREY,
  //         borderRadius: 9,
  //         padding: 14,
  //         backgroundColor: color.color_black,
  //         marginBottom: 10,
  //       }}>

  //       {/* Qty & Avg */}
  //       <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  //         <Text style={{ color: color.Default_GREY, fontSize: 12 }}>
  //           Qty. {item.quantity}
  //         </Text>
  //         <Text style={{ color: color.Default_GREY, fontSize: 12 }}>
  //           Avg. {priceFormat(item.stockPrice)}
  //         </Text>
  //       </View>

  //       {/* Symbol */}
  //       <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginVertical: 4 }}>
  //         {item.symbol}
  //       </Text>

  //       {/* Profit/Loss */}
  //       <Text
  //         style={{
  //           color: item.difference < 0 ? color.color_red : color.Default_GREEN,
  //           fontSize: 14,
  //           fontWeight: '700',
  //         }}>
  //         {item.difference > 0 ? '+' : ''}
  //         {priceFormat(item.difference)}
  //       </Text>

  //       {/* Invested + LTP + % */}
  //       <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  //         <Text style={{ color: color.Default_GREY, fontSize: 12 }}>
  //           Invested {priceFormat(item.totalAmount)}
  //         </Text>

  //         <Text style={{ color: color.Default_GREY, fontSize: 12 }}>
  //           LTP {priceFormat(item.stockPrice + item.difference)} (
  //           <Text
  //             style={{
  //               color: item.difference < 0 ? color.color_red : color.Default_GREEN,
  //             }}>
  //             {((item.difference / item.stockPrice) * 100).toFixed(2)}%
  //           </Text>
  //           )
  //         </Text>
  //       </View>
  //     </Pressable>

  //   );
  // };

  // const renderItemPosition = ({ item, index }) => {
  //   console.log("checkkkkksdkk", item, index)
  //   const isLastItem = index === [...data, ...commo].length - 1;
  //   return (
  //     <Pressable
  //       onPress={() => navigation.navigate('Details', { data: item })}
  //       style={{
  //         flexDirection: 'row',
  //         borderWidth: 0.5,
  //         borderColor: color.Default_GREY,
  //         borderRadius: 9,
  //         padding: 14,
  //         backgroundColor: color.color_black,
  //         marginBottom: isLastItem ? 100 : 10,
  //         alignItems: 'flex-start',
  //         position: 'relative', // enable absolute children positioning
  //       }}
  //     >

  //       {/* Square Off Button - Top Right */}
  //       <TouchableOpacity
  //         onPress={() => squareOff(item)}
  //         disabled={item?.squareOff}
  //         style={{
  //           position: 'absolute',
  //           top: 8,
  //           right: 8,
  //           backgroundColor: item?.squareOff ? color.color_gray : color.color_darkblue,
  //           borderRadius: 6,
  //           paddingHorizontal: 10,
  //           paddingVertical: 4,
  //         }}
  //       >
  //         <Text style={{ color: item?.squareOff ? color.color_white : color.color_white }}>{item?.squareOff ? 'Squared Off' : 'Square Off'}</Text>
  //       </TouchableOpacity>

  //       {/* Main Content */}
  //       <View style={{ flex: 1 }}>
  //         {/* Qty & Avg */}
  //         <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
  //           <Text style={{ color: color.Default_GREY, fontSize: 12 }}>
  //             Qty. {item.quantity}
  //           </Text>
  //           <Text style={{ color: color.Default_GREY, fontSize: 12 }}>
  //             Avg. {priceFormat(item.stockPrice)}
  //           </Text>
  //         </View>

  //         {/* Symbol */}
  //         <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginVertical: 4 }}>
  //           {item.symbol}
  //         </Text>

  //         {/* Profit/Loss */}
  //         <Text
  //           style={{
  //             color: item.difference < 0 ? color.color_red : color.Default_GREEN,
  //             fontSize: 14,
  //             fontWeight: '700',
  //           }}
  //         >
  //           {item.difference > 0 ? '+' : ''}
  //           {priceFormat(item.difference)}
  //         </Text>

  //         {/* Invested + LTP + % */}
  //         <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  //           <Text style={{ color: color.Default_GREY, fontSize: 12 }}>
  //             Invested {priceFormat(item.totalAmount)}
  //           </Text>
  //           <Text style={{ color: color.Default_GREY, fontSize: 12 }}>
  //             LTP {priceFormat(item.stockPrice + item.difference)} (
  //             <Text
  //               style={{
  //                 color: item.difference < 0 ? color.color_red : color.Default_GREEN,
  //               }}
  //             >
  //               {((item.difference / item.stockPrice) * 100).toFixed(2)}%
  //             </Text>
  //             )
  //           </Text>
  //         </View>
  //       </View>
  //     </Pressable>
  //   );
  // };


  // console.log(
  //   "Equity Data:---", commo
  // )


  const renderItemPosition = ({ item, index }) => {

    // console.log("itttmtmmtmtm", item?.symbol, item?.commodityPrice, item?.quantity)

    // console.log("itemf?.stockDifferencePrice?._j",checkDifference(item?.symbol, item?.commodityPrice, item?.quantity))
    const isLastItem = index === [...data, ...commo].length - 1;
    const isCommodity = !!item.commodityName;

    // console.log("clllggggg-", item)
    // Status color
    const statusColor = item.status === 'BUY' ? color.Default_GREEN : color.color_red;
    const profitLossColor = item.difference < 0 ? color.color_red : color.Default_GREEN;
    const profitLossColorC = item.stockDifferencePrice < 0 ? color.color_red : color.Default_GREEN;

    // Date display
    const orderDate = item.createdAt
      ? new Date(item.createdAt).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      : '';


    const squareOffCommodity = async item => {
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

                console.log("marketData", marketData)


                let formdata = {
                  stockId: item._id,
                  totalAmount: item?.totalAmount,
                  stockPrice: item?.commodityPrice,
                  latestPrice: (liveData?.[0]?.v?.lp || liveData?.[0]?.v?.ltp) || (marketData[0]?.data?.lp || marketData[0]?.data?.ltp),
                };

                // console.log("squire of commiii payload . ", formdata)
                // Alert.alert("Payload", JSON.stringify(formdata, null, 2))

                // return
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

    return (
      <Pressable
        onPress={() => navigation.navigate('Details', { data: item })}
        style={{
          backgroundColor: color.color_black,
          borderRadius: 12,
          padding: 14,
          marginBottom: isLastItem ? 100 : 12,
          borderWidth: 0.5,
          borderColor: color.Default_GREY,
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        {/* Top Row: BUY/SELL + Symbol + Square Off */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: statusColor,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 4,
                marginRight: 8,
              }}
            >
              <Text style={{ color: color.color_white, fontSize: 12, fontWeight: '600' }}>
                {item.status}
              </Text>
            </View>
            <Text style={{ color: color.color_white, fontSize: 14, fontWeight: '700' }}>
              {item.symbol}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {

              if (isCommodity) {
                squareOffCommodity(item)
              } else {
                squareOff(item)
              }

            }
            }
            disabled={item?.squareOff}
            style={{
              backgroundColor: item?.squareOff ? color.color_gray : color.color_darkblue,
              borderRadius: 6,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text style={{ color: item?.squareOff ? color.color_black : color.color_white, fontSize: 10 }}>
              {item?.squareOff ? 'Squared Off' : 'Square Off'}
            </Text>
          </TouchableOpacity>
        </View>

        // {console.log("mmeiid", item)}
        {/* Type + Quantity */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={{ color: color.Default_GREY, fontSize: 12 }}>
            {item.type?.toUpperCase()} : QTY {item.quantity}
          </Text>
          {isCommodity ? (
            <Text style={{ color: color.color_red_bg, fontSize: 12 }}>
              Order Price: {priceFormat(item.commodityPrice)}
            </Text>
          ) : (
            <Text style={{ color: color.color_red_bg, fontSize: 12 }}>
              Order Price: {priceFormat(item.stockPrice)}
            </Text>
          )}

        </View>

        {/* Order Date and Status */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
          <Text style={{ color: color.Default_GREY, fontSize: 12 }}>{orderDate}</Text>
          <Text style={{ color: !item?.squareOff ? color.Default_GREEN : color.Default_GREY, fontSize: 12 }}>
            {item?.squareOff ? 'Completed' : 'Active'}
          </Text>
        </View>

        {/* Profit / Loss */}

        {!item?.squareOff && (
          <>
            {isCommodity ? (
              <Text
                style={{
                  marginTop: 12,
                  fontSize: 20,
                  fontWeight: '700',
                  color: profitLossColorC,
                }}
              >
                {item?.stockDifferencePrice > 0 ? '+' : ''}
                {item?.stockDifferencePrice || 0}
                {/* {((item.difference / item.commodityPrice) * 100).toFixed(2)}% */}
              </Text>
            ) : (
              <Text
                style={{
                  marginTop: 12,
                  fontSize: 16,
                  fontWeight: '700',
                  color: profitLossColor,
                }}
              >
                {item.difference > 0 ? '+' : ''}
                {item?.difference}
                {/* {((item.difference / item.commodityPrice) * 100).toFixed(2)}% */}
              </Text>
            )}</>
        )}

        {item?.squareOff && (
          <Text
            style={{
              marginTop: 12,
              fontSize: 16,
              fontWeight: '700',
              color: item?.netProfitAndLoss > 0 ? color.Default_GREEN : color.color_red,
            }}
          >
            {item?.netProfitAndLoss > 0 ? '+' : ''}
            {priceFormat(item?.netProfitAndLoss)}
          </Text>
        )}



        {/* Bottom S: / C: row */}
        {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 }}>
        <Text style={{ color: color.Default_GREY, fontSize: 12 }}>
          S : {priceFormat(item.stockPrice)} → C : {item.squareOff ? priceFormat(item.soldPrice || '--') : '--'}
        </Text>
      </View> */}
      </Pressable>
    );
  };



  useFocusEffect(
    useCallback(() => {
      // This will run every time the screen comes into focus
      dispatch(getMyStocks({ navigation }));
      dispatch(getMyCommodities({ navigation }));
    }, [navigation])
  );


  // console.log("Commodity Data:", data);
  return (
    <SafeAreaView
      edges={['top']}
      style={{
        // backgroundColor: 'black',
        flex: 1,
        // paddingVertical: 6,
        paddingHorizontal: 10,
      }}>
      <CustomAlert
        visible={showAlert}
        onClose={() => setShowAlert(false)}
        onConfirm={handleConfirmSquareOff}
        message="Are you sure you want to square off your position?"
      />

      {(data?.length > 0 || commo?.length > 0) ? (
        <OptimizedFlatlist
          style={{ marginBottom: '5%', marginTop: 20, backgroundColor: color.color_black }}
          contentContainerStyle={{ gap: 5 }}
          renderItem={renderItemPosition}
          // data={[...data].reverse()}
          data={[...data, ...commo].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )}
        />
      ) : (
        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <Text style={{ color: 'gray', fontSize: 16 }}>No data available</Text>
        </View>
      )}

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
              color: (todayPL + todayPLc) < 0 ? 'red' : 'green',
              fontSize: 15,
              fontWeight: '600',
            }}
          >
            ₹{priceFormat((todayPL + todayPLc)) || 0}
          </Text>
        </View>
      </View>

    </SafeAreaView>
  )
}

export default Equity

const styles = StyleSheet.create({})