import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { color } from '../../common/color';
import SeperatorLine from '../../component/SeperatorLine';
import Appheader from '../../component/AppHeader/appheader';
import { useSelector } from 'react-redux';
import moment from 'moment';
import priceFormat from '../../utils/priceFormat';
import axios from 'axios';
import { STOCK } from '../../utils/baseURL';
import PostAPI from '../../api/PostAPI';

const Details = ({ navigation, route }) => {
  const data = route?.params?.data;

  const [nsePrice, setNsePrice] = useState('')
  // console.log("chekckkkk The DATA", data)





  // {"__v": 0, "_id": "66b9ba7719509ce3bfab7441", "buyDate": "2024-08-12T07:32:07.361Z", "createdAt": "2024-08-12T07:32:07.366Z", "executed": true, "expiryDate": "", "failed": false, "identifier": "", "intervalId": "1723447928292", "netProfitAndLoss": -10.879999999999995, "openCard": true, "optionType": "", "quantity": 1, "soldDate": null, "squareOff": true, "squareOffDate": "2024-08-15T02:23:52.291Z", "status": "BUY", "stockName": "RELINFRA.NS", "stockPrice": 218.55, "stockType": "MKT", "stopLoss": null, "symbol": "RELINFRA.NS", "targetPrice": null, "toSquareOffOn": "2024-08-17T00:00:00.000Z", "totalAmount": 218.55, "type": "DELIVERY", "updatedAt": "2024-08-15T02:23:52.291Z", "userId": "66abe016604155668c437d11"}

  const [liveData, setLiveData] = useState();

  const fetchMarketData = async (payload: any) => {
    try {
      const response = await axios.post(STOCK.GET_QOUTES, payload);
      // console.log("Print the response:", response);
      if (response.data.code === 200 && response.data.status) {
        // Process the data
        setLiveData(response.data.data.d);
        // console.log("Live Data:", response.data.data.d?.[0]);
        return response?.data?.data?.d;
      }
    } catch (error) {
      // console.error('Error fetching market data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (data?.symbol && data?.commodityName) {
        const marketData = await fetchMarketData({ symbols: [data.symbol] });
      } else {
        // symbol, optionType, identifier
        const formdata = {
          stockId: data?._id
        }
        // console.log("payload;;;", formdata)
        const response = await PostAPI.getNSELatestPrice(formdata);
        setNsePrice(response?.latestPrice)
        // console.log("checkTTHTTHTHresposne", response, response?.latestPrice)
      }

    };

    fetchData();
  }, []); // You can add other dependencies as needed
  // squareOff



  // LOG  chekckkkk The DATA {"__v": 0, "_id": "66bd5d7ee8ca51901e9e28f5", "buyDate": "2024-08-15T01:44:30.773Z", "commodityName": "GOLDGUINEA24NOVFUT", "commodityPrice": 59399, "createdAt": "2024-08-15T01:44:30.775Z", "executed": true, "failed": false, "intervalId": null, "netProfitAndLoss": 0, "openCard": true, "quantity": 1, "sellDate": null, "squareOff": true, "squareOffDate": "2024-08-15T02:01:43.175Z", "status": "BUY", "stopLoss": null, "symbol": "MCX:GOLDGUINEA24NOVFUT", "targetPrice": null, "toSquareOffOn": "2024-08-20T00:00:00.000Z", "totalAmount": 59399, "type": "BUY", "updatedAt": "2024-08-15T02:01:43.176Z", "userId": "66abe016604155668c437d11"}

  // {"__v": 0, "_id": "66becc8484bbe246b73b7cc0", "buyDate": "2024-08-16T03:50:28.499Z", "createdAt": "2024-08-16T03:50:28.500Z", "executed": true, "expiryDate": "21-Aug-2024", "failed": false, "identifier": "OPTIDXBANKNIFTY21-08-2024CE50000.00", "intervalId": "1723780229385", "netProfitAndLoss": 2079.9999999999927, "openCard": true, "optionType": "CE", "quantity": 100, "soldDate": null, "squareOff": true, "squareOffDate": "2024-08-16T03:54:33.344Z", "status": "BUY", "stockName": "BANKNIFTY", "stockPrice": 535.75, "stockType": "MKT", "stopLoss": null, "symbol": "BANKNIFTY", "targetPrice": null, "toSquareOffOn": "2024-08-21T00:00:00.000Z", "totalAmount": 53575, "type": "DELIVERY", "updatedAt": "2024-08-16T03:54:33.344Z", "userId": "66abe016604155668c437d11"}
  const arr = [
    { type: 'Туре', details: data?.status },
    { type: 'Instrument', details: data?.symbol },
    { type: 'Entry Price', details: priceFormat(data?.stockPrice) || data?.commodityPrice || 0 },
    { type: 'Price@Trade', details: priceFormat(data?.lastPriceDifference) || data?.stockLivePrice?._j || liveData?.[0]?.v?.lp || (data?.squareOff === true ? priceFormat((data?.stockPrice + (data?.netProfitAndLoss / data?.quantity))) : nsePrice) || 0 },
    { type: 'Target Price', details: priceFormat(data?.targetPrice) || 0 },
    { type: 'Stop Price', details: priceFormat(data?.stopLoss) || 0 },
    {
      type: 'Valid Till',
      details:
        moment(data?.buyDate).format('MMM DD, YYYY h:mm A') ||
        moment(data?.soldDate).format('MMM DD, YYYY h:mm A'),
    },
    {
      type: 'Margin',
      details: `${priceFormat(data?.totalAmount)} for ${data?.quantity} QTY`,
    },
  ];
  return (
    <View style={styles.container}>
      <Appheader onPress={() => navigation.goBack()} header="Details" />
      <View style={styles.secContainer}>
        {arr.map(res => (
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 3 }}>
              <Text style={{ color: color.Default_GREY }}>{res.type}</Text>
            </View>
            <View style={{ flex: 3.5 }}>
              <Text style={{ fontWeight: '500', color: color.color_white }}>{res.details}</Text>
            </View>
          </View>
        ))}
        <SeperatorLine />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 3 }}>
            <Text style={{ color: color.Default_GREY }}>Net P&L</Text>
          </View>
          <View style={{ flex: 3.5 }}>
            <Text style={{ fontWeight: '500',color: color.color_white }}>
              ₹{priceFormat(data?.difference) || data?.stockDifferencePrice?._j || priceFormat(data?.netProfitAndLoss) || 0}
            </Text>
          </View>
        </View>
        <SeperatorLine />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: color.color_black,
  },
  secContainer: {
    borderWidth: 0.5,
    borderColor: color.Default_GREY,
    padding: 16,
    width: '90%',
    borderRadius: 12,
    gap: 10,
    backgroundColor: color.color_black,
  },
});

export default Details;
