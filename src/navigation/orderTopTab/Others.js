import {View, Text, FlatList, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {font} from '../../common/Font';
import {color} from '../../common/color';
import {useSelector} from 'react-redux';
import moment from 'moment';
import OptimizedFlatlist from '../../component/OptimizedFlatlist.js/OptimizedFlatlist';
import checkNonEmpty from '../../utils/checkNonEmpty';
import Pendingimage from '../../../assets/svg/pendingimage';
import {useNavigation} from '@react-navigation/native';
import {getMyStocks} from '../../redux/slice/StockDataSlice';
import ErrorMessage from '../../component/ErrorMessage/ErrorMessage';
import Loader from '../../component/Loader/Loader';
import priceFormat from '../../utils/priceFormat';

const Others = () => {
  const navigation = useNavigation();
  const {myStocks, myStocksFailed, loading, topTabStatus} = useSelector(
    state => state.stockData,
  );
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const data = myStocks.filter(
      stock =>
        stock.failed &&
        !stock.squareOff &&
        (topTabStatus ? stock.type === 'INTRADAY' : stock.type === 'DELIVERY'),
    );

    setStocks(data);
  }, [myStocks, topTabStatus]);

  const renderItem = ({item}) => {
    const timeAgo = moment(item.updatedAt).fromNow();
    return (
      <View
        style={{
          backgroundColor: color.color_lightblue,
          borderRadius: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingVertical: 15,
          marginHorizontal: 10,
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
                backgroundColor: color.color_red,
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
                Failed
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
        <View style={{backgroundColor: '#ffffff', flex: 1}}>
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

export default Others;
