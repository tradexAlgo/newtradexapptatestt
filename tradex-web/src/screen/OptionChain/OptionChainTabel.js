import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {color} from '../../common/color';
import {styles} from './styles';
import {SelectList} from 'react-native-dropdown-select-list';
import HorizontalSeperator from '../MatualFunds/Components/HorizontalSeperator';
import Optionsmodel from './Optionsmodel';

const OptionChainTabel = ({data, symbol, navigation}) => {
  const number = -10;


  
  const textColor = number < 0 ? 'red' : 'green';
  const [date, setDate] = useState(data?.expiryDates[0]);
  const [groupedData, setGroupedData] = useState({});
  const [selectedData, setSelectedData] = useState([]);
  const expiryDates = data?.expiryDates;
  const [selected, setSelected] = useState(date);
  // console.log(`expiry date ${expiryDates}`);
  function changeExpiryDate(expiryDate) {
    setSelectedData(groupedData[expiryDate]);
  }
  // console.log(`date ${date}`);
  useEffect(() => {
    if (date) {
      changeExpiryDate(date);
    }
  }, [date]);
  function groupByExpiryDate(data) {
    const result = {};

    data.forEach(item => {
      const expiryDate = item.expiryDate;

      if (!result[expiryDate]) {
        result[expiryDate] = [];
      }

      result[expiryDate].push(item);
    });

    return result;
  }
  useEffect(() => {
    (async () => {
      const groupedData = groupByExpiryDate(data?.data);
      setGroupedData(groupedData);
      setSelectedData(groupedData[data?.expiryDates[0]]);
      //   console.log('selectedData :>> ', groupedData[data?.expiryDates[0]]);
    })();
  }, []);
  const handleChange = value => {
    console.log('Selected value:', value);
    setDate(value);
  };
  //   TEST

  // model
  const [isModalVisibleCE, setModalVisibleCE] = useState(false);

  const toggleModalCE = () => {
    setModalVisibleCE(!isModalVisibleCE);
    console.log(isModalVisibleCE);
  };
  return (
    <>
      <SelectList
        setSelected={val => handleChange(val)}
        data={expiryDates}
        save="value"
      />
      <HorizontalSeperator />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: color.color_white,
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}>
        <View>
          <Text
            style={{
              fontSize: 15,
              color: color.Default_TEXT,
              fontWeight: 600,
            }}>
            Call LTP
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: color.Default_TEXT,
              fontWeight: 500,
            }}>
            OI Crowd
          </Text>
        </View>
        <Text
          style={{fontSize: 15, color: color.Default_TEXT, fontWeight: 600}}>
          Strike
        </Text>
        <View>
          <Text
            style={{
              fontSize: 15,
              color: color.Default_TEXT,
              fontWeight: 600,
            }}>
            Put LTP
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: color.Default_TEXT,
              fontWeight: 500,
            }}>
            OI Crowd
          </Text>
        </View>
      </View>
      <HorizontalSeperator />
      <ScrollView>
        {selectedData.map((row, idx) => (
          <View
            style={{
              backgroundColor: color.color_white,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {/* <Optionsmodel
              isModalVisible={isModalVisibleCE}
              toggleModalCE={toggleModalCE}
              type="CE"
              symbol={symbol}
              expiryDate={row?.CE?.expiryDate}
              data={selectedData}
              price={row?.CE?.lastPrice}
              StrikePrice={row?.strikePrice}
            /> */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                paddingVertical: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 5,
                borderWidth: 1,
                borderColor: color.color_gray,
                width: '30%',
              }}
              onPress={() =>
                {

                  // {"CE": {"askPrice": 2323.5, "askQty": 45, "bidQty": 300, "bidprice": 2271.1, "change": -323.75, "changeinOpenInterest": 26, "expiryDate": "07-Aug-2024", "identifier": "OPTIDXBANKNIFTY07-08-2024CE47500.00", "impliedVolatility": 54.83, "lastPrice": 2322.1, "openInterest": 63, "pChange": -12.236143394372318, "pchangeinOpenInterest": 70.27027027027027, "strikePrice": 47500, "totalBuyQuantity": 2835, "totalSellQuantity": 2310, "totalTradedVolume": 95, "underlying": "BANKNIFTY", "underlyingValue": 49748.3}, "PE": {"askPrice": 7.8, "askQty": 1020, "bidQty": 720, "bidprice": 7, "change": -28, "changeinOpenInterest": 60796, "expiryDate": "07-Aug-2024", "identifier": "OPTIDXBANKNIFTY07-08-2024PE47500.00", "impliedVolatility": 43.41, "lastPrice": 7, "openInterest": 127835, "pChange": -80, "pchangeinOpenInterest": 90.68751025522457, "strikePrice": 47500, "totalBuyQuantity": 154860, "totalSellQuantity": 45585, "totalTradedVolume": 1470398, "underlying": "BANKNIFTY", "underlyingValue": 49748.3}, "expiryDate": "07-Aug-2024", "strikePrice": 47500}
                  // console.log("get me by row------------",row)
                  navigation.navigate('Optionchaindetail', {
                    symbol: symbol,
                    data: selectedData,
                    price: row?.CE?.lastPrice,
                    StrikePrice: row?.strikePrice,
                    expiryDate: row?.CE?.expiryDate,
                    identifier:row?.CE?.identifier,
                    optionChainType:'CE'
                  })
                }
              }>
              <Text>{row?.CE?.lastPrice}</Text>

              <Text
                style={[
                  styles.text,
                  {color: row?.CE?.change.toFixed(2) < 0 ? 'red' : 'green'},
                ]}>
                {row?.CE?.change.toFixed(2)}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: color.color_gray,
                flex: 1,
              }}>
              <Text>{row?.strikePrice}</Text>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                paddingVertical: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 5,
                borderWidth: 1,
                borderColor: color.color_gray,
                width: '30%',
              }}
              onPress={() =>
                navigation.navigate('Optionchaindetail', {
                  symbol: symbol,
                  data: selectedData,
                  price: row?.PE?.lastPrice,
                  StrikePrice: row?.strikePrice,
                  expiryDate: row?.PE?.expiryDate,
                  identifier:row?.PE?.identifier,
                  optionChainType:'PE'
                })
              }>
              <Text>{row?.PE?.lastPrice}</Text>

              <Text
                style={[
                  styles.text,
                  {color: row?.PE?.change.toFixed(2) < 0 ? 'red' : 'green'},
                ]}>
                {row?.PE?.change.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </>
  );
};

export default OptionChainTabel;
