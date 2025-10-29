import { View, Text, FlatList, Pressable, Alert, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { font } from '../../common/Font';
import { color } from '../../common/color';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import OptimizedFlatlist from '../../component/OptimizedFlatlist.js/OptimizedFlatlist';
import Loader from '../../component/Loader/Loader';
import ErrorMessage from '../../component/ErrorMessage/ErrorMessage';
import {
  getMyStocks,
  getStockHistory,
  getWatchList,
} from '../../redux/slice/StockDataSlice';
import checkNonEmpty from '../../utils/checkNonEmpty';
import Pendingimage from '../../../assets/svg/pendingimage';
import { useNavigation } from '@react-navigation/native';
import priceFormat from '../../utils/priceFormat';
import SeperatorLine from '../../component/SeperatorLine';
import PostAPI from '../../api/PostAPI';
import { userProfile } from '../../redux/slice/AuthSlice';
import Spinner from '../../component/Spinner/Spinner';
import { fetchOptionChain } from '../../utils/getNse';
import GetAPI from '../../api/GetAPI';
import { showToast } from '../../common/ToastService';

const Executed = () => {
  const navigation = useNavigation();
  const { myStocks, myStocksFailed, loading, topTabStatus, myCommodities } = useSelector(
    state => state.stockData,
  );
  const [stocks, setStocks] = useState([]);
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // Add refreshing state
  const dispatch = useDispatch();

  useEffect(() => {
    const data = myStocks.filter(
      stock =>
        stock.executed &&
        (topTabStatus ? stock.type === 'INTRADAY' : stock.type === 'DELIVERY'),
    );

    setStocks(data);
  }, [myStocks, topTabStatus]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(getMyStocks({ navigation })),
        dispatch(getWatchList({ navigation })),
        dispatch(getStockHistory({ navigation })),
      ]);
    } catch (error) {
      // console.log(error);
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

  const squareOff = async item => {
    Alert.alert(
      'Tradex',
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

              // console.log(
              //   "itemitem", item
              // )
              // {"__v": 0, "_id": "67443501b91aae062bbbe1d0", "buyDate": "2024-11-25T08:27:45.674Z",
              //    "createdAt": "2024-11-25T08:27:45.681Z", "executed": true, "expiryDate": "", 
              //    "failed": false, "identifier": "", "intervalId": "1732523266010", "netProfitAndLoss": null, 
              //    "openCard": true, "optionType": "", "quantity": 5, "soldDate": null, "squareOff": false,
              //     "squareOffDate": null, "status": "BUY", "stockName": "SBIN.NS", "stockPrice": 845.85, "stockType": "MKT",
              //      "stopLoss": null, "symbol": "SBIN.NS", "targetPrice": null, "toSquareOffOn": "2024-11-29T18:30:00.000Z",
              //       "totalAmount": 4229.25, "type": "DELIVERY", "updatedAt": "2024-11-25T08:27:46.011Z", "userId": "673540aa09d32a20520d2308"}

              // {"__v": 0, "_id": "6736cf559766f3c8f33a2352", "buyDate": "2024-11-15T04:34:29.651Z", "createdAt": 
              //   "2024-11-15T04:34:29.652Z", "executed": true, "expiryDate": "14-Nov-2024", "failed": false, "identifier": 
              //   "OPTIDXNIFTY14-11-2024CE23150.00", "intervalId": "1731645270538", "netProfitAndLoss": null, "openCard": true, 
              //   "optionType": "CE", "quantity": 100, "soldDate": null, "squareOff": false, "squareOffDate": null, "status":
              //    "BUY", "stockName": "NIFTY", "stockPrice": 382, "stockType": "MKT", "stopLoss": null, "symbol": "NIFTY", 
              //    "targetPrice": null, "toSquareOffOn": "2024-11-20T00:00:00.000Z", "totalAmount": 38200, "type": "DELIVERY", 


              //    "updatedAt": "2024-11-15T04:34:30.539Z", "userId": "673540aa09d32a20520d2308"}
              //get latest price here and pass in the backend for easy 

              if (item?.identifier === '') {

                const response = await GetAPI.getOneStockData({
                  data: item?.stockName,
                  formattedObj: false,
                });
                console.log("hay ki nhi ", response?.meta?.regularMarketPrice)
                // console.log("get latest price ",item?.stockName)

                if (true) {
                  // Resolve the lastPrice of the filtered option
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
                  // console.log(response);
                  showToast(response.message);
                  dispatch(userProfile({ navigation }));
                  dispatch(getWatchList({ navigation }));
                  dispatch(getMyStocks({ navigation }));
                  dispatch(getStockHistory({ navigation }));
                  setLoader(false);
                } else {
                  // If no matching data found, resolve with an appropriate message
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
                  showToast(response.message);
                  dispatch(userProfile({ navigation }));
                  dispatch(getWatchList({ navigation }));
                  dispatch(getMyStocks({ navigation }));
                  dispatch(getStockHistory({ navigation }));
                  setLoader(false);
                } else {
                  // If no matching data found, resolve with an appropriate message
                  console.log(
                    `No data found for symbol: ${'symbol'}, optionType: ${item?.optionType}, identifier: ${item?.identifier}`
                  );
                }
              }


            } catch (error) {
              // console.log(error);
              setLoader(false);
              showToast('Error squaring off position');
            }
          },
        },
      ],
    );
  };
  // {"__v": 0, "_id": "66be7e5f4b0cf6d828e7ce60", "buyDate": "2024-08-15T22:17:03.746Z", "createdAt": "2024-08-15T22:17:03.747Z", "executed": true, "expiryDate": "", "failed": false, "identifier": "", "intervalId": "1723760224649", "netProfitAndLoss": null, "optionType": "", "quantity": 12, "soldDate": null, "squareOff": false, "squareOffDate": null, "status": "BUY", "stockName": "^NSEBANK", "stockPrice": 49727.3, "stockType": "MKT", "stopLoss": null, "symbol": "^NSEBANK", "targetPrice": null, "toSquareOffOn": "2024-08-20T00:00:00.000Z", "totalAmount": 596727.6000000001, "type": "DELIVERY", "updatedAt": "2024-08-15T22:17:04.649Z", "userId": "66abe016604155668c437d11"}

  const renderItem = ({ item }) => {
    const timeAgo = moment(item.updatedAt).fromNow();
    return (
      <Pressable onPress={() => card(item._id)}>
        <View
          style={{
            backgroundColor: '#1c1c1e',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            paddingVertical: 15,
            marginHorizontal: 10,
            marginTop: 10,

            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            borderBottomLeftRadius: item?.openCard ? 0 : 12,
            borderBottomRightRadius: item?.openCard ? 0 : 12,

            // Card-like shadow (iOS)
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,

            // Card-like elevation (Android)
            elevation: 4,
          }}>
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
              {item?.identifier === '' ? item?.stockName : item?.identifier}
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
              {priceFormat(item?.stockPrice)}
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

             
            <View style={{ flexDirection: 'row', gap: 5, }}>
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
            {/* <Text
            style={{
              fontSize: 8,
              fontFamily: font.nunitoregular,
              fontWeight: '600',
              color: color.color_limit,
              textAlign: 'center',
            }}>
            LTP
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontFamily: font.nunitoregular,
              fontWeight: '600',
              color: color.color_black,
              textAlign: 'center',
            }}>
            {item?.ltp}
          </Text> */}
          </View>
          <View
            style={{
              backgroundColor: color.color_primary_green,
              paddingVertical: 2,
              paddingHorizontal: 10,
              borderRadius: 6,
              position: 'absolute',
              right: 10,
              top: 10
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

        </View>
        {item?.openCard && (
          <View>
            <View
              style={{
                height: 0.5,
                backgroundColor: color.Default_GREY,
                width: '90%',
                alignSelf: 'center',
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                backgroundColor: '#1c1c1e',
                // borderRadius: 12,
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
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {myStocksFailed ? (
        <ErrorMessage />
      ) : (
        <FlatList
          data={stocks}
          style={{ marginBottom: 10 }}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[color.color_primary]}
            />
          }
        />
      )}
      {loader && <Spinner />}
      {loading && <Loader />}
    </View>
  );
};

export default Executed;
