import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Pendingimage from '../../../assets/svg/pendingimage';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {font} from '../../common/Font';
import {color} from '../../common/color';
import OptimizedFlatlist from '../../component/OptimizedFlatlist.js/OptimizedFlatlist';
import Loader from '../../component/Loader/Loader';
import ErrorMessage from '../../component/ErrorMessage/ErrorMessage';
import {
  getMyStocks,
  getStockHistory,
  getWatchList,
} from '../../redux/slice/StockDataSlice';
import checkNonEmpty from '../../utils/checkNonEmpty';
import priceFormat from '../../utils/priceFormat';
import DeleteAPI from '../../api/DeleteAPI';
import {userProfile} from '../../redux/slice/AuthSlice';
import Spinner from '../../component/Spinner/Spinner';

const Pending = ({}) => {
  const navigation = useNavigation();
  const {myStocks, myStocksFailed, loading, topTabStatus} = useSelector(
    state => state.stockData,
  );
  const dispatch = useDispatch();
  const [stocks, setStocks] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const data = myStocks.filter(
      stock =>
        !stock.executed &&
        !stock.squareOff &&
        (topTabStatus ? stock.type === 'INTRADAY' : stock.type === 'DELIVERY'),
    );
    setStocks(data);
  }, [myStocks, topTabStatus]);

  const card = id => {
    setStocks(prev =>
      prev.map(res =>
        res._id === id ? {...res, openCard: !res.openCard || false} : res,
      ),
    );
  };

  const cancelStock = async item => {
    Alert.alert('Trustfx', 'Are you sure you want to cancel this stock?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            setLoader(true);
            const response = await DeleteAPI.deleteStock(item?._id);
            // console.log(response);
            Alert.alert(response.message);
            dispatch(userProfile({navigation}));
            dispatch(getWatchList({navigation}));
            dispatch(getMyStocks({navigation}));
            dispatch(getStockHistory({navigation}));
            setLoader(false);
          } catch (error) {
            // console.log(error);
            setLoader(false);
            Alert.alert(error?.message);
          }
        },
      },
    ]);
  };

  const renderItem = ({item}) => {
    const timeAgo = moment(item.updatedAt).fromNow();
    return (
      <Pressable onPress={() => card(item._id)}>
        <View
          style={{
            backgroundColor: color.color_lightblue,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            paddingVertical: 15,
            marginHorizontal: 10,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            borderBottomLeftRadius: item?.openCard ? 0 : 12,
            borderBottomRightRadius: item?.openCard ? 0 : 12,
          }}>
          <View
            style={{
              justifyContent: 'center',
              width: '33%',
              gap: 5,
            }}>
            <View style={{flexDirection: 'row'}}>
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
                  color: color.color_limit,
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
                color: color.color_black,
              }}>
              {item?.stockName}
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
                color: color.color_limit,
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
                color: color.color_black,
              }}>
              {priceFormat(item?.totalAmount)}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              width: '33%',
              gap: 5,
            }}>
            <View style={{flexDirection: 'row', gap: 5}}>
              <Text
                style={{
                  fontSize: 8,
                  fontFamily: font.nunitoregular,
                  fontWeight: '600',
                  color: color.color_limit,
                  alignSelf: 'center',
                }}>
                {timeAgo}
              </Text>
              <View
                style={{
                  backgroundColor:
                    item?.status === 'BUY'
                      ? color.color_darkblue
                      : color.color_red,
                  paddingVertical: 2,
                  paddingHorizontal: 10,
                  borderRadius: 6,
                }}>
                <Text
                  style={{
                    fontSize: 8,
                    fontFamily: font.nunitoregular,
                    fontWeight: '600',
                    color: color.color_white,
                    textAlign: 'center',
                  }}>
                  PENDING
                </Text>
              </View>
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
        </View>
        {item?.openCard && (
          <>
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
                backgroundColor: color.black,
                // borderRadius: 12,
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 15,
                width: '95%',
                alignSelf: 'center',
              }}>
              <Pressable
                onPress={() => cancelStock(item)}
                style={{
                  backgroundColor: color.color_red,
                  paddingHorizontal: 12,
                  borderRadius: 13,
                  paddingVertical: 5,
                }}>
                <Text style={{color: color.color_white}}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  navigation.navigate('BankDetails', {
                    symbol: item?.symbol,
                  })
                }
                style={{
                  backgroundColor: color.color_primary_green,
                  paddingHorizontal: 12,
                  borderRadius: 13,
                  paddingVertical: 5,
                }}>
                <Text style={{color: color.color_white}}>Info</Text>
              </Pressable>
            </View>
          </>
        )}
      </Pressable>
    );
  };
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
        <View style={{backgroundColor: 'black', flex: 1}}>
          <Spinner visible={loader} text={'Cancelling...'} />
          <OptimizedFlatlist
            contentContainerStyle={{gap: 12, paddingVertical: 20}}
            renderItem={renderItem}
            data={stocks}
          />
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Pressable onPress={() => navigation.navigate('WatchlistScreen')}>
            <Pendingimage />
          </Pressable>
        </View>
      )}
    </>
  );
};

export default Pending;
