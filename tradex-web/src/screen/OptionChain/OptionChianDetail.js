import { Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { styles } from './styles';

import { color } from '../../common/color';

import Appheader from '../../component/AppHeader/appheader';

import HorizontalSeperator from '../MatualFunds/Components/HorizontalSeperator';
import OptionChainbuy from '../../component/CustomModal/OptionChainbuy';

const OptionDetail = ({ navigation, route }) => {
  const symbol = route?.params?.symbol;
  const StrikePrice = route?.params?.StrikePrice;
  const expiryDate = route?.params.expiryDate;
  const identifier = route?.params.identifier;
  const optionChainType = route?.params.optionChainType;
  const data = route?.params.data;
  const price = route?.params.price;
  console.log(`symbol 9998 ${symbol},MINNNN`);
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [iscolor, setIsColor] = useState('');
  const [istext, setIsText] = useState('BUY');
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // expiryDate: row?.CE?.expiryDate,
  // identifier:row?.CE?.identifier,
  // optionChainType:'CE'
  // console.log("io777jjdj",JSON.parse(data))
  return (
    <SafeAreaView style={styles.container}>
      <Appheader onPress={() => navigation.goBack()} header={symbol} />
      <View style={{ flex: 1, width: '100%', padding: 0, margin: 0 }}>
        <HorizontalSeperator />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 600,
          }}>
          {`${symbol} `}
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 600,
            paddingVertical: 10,
            backgroundColor: color.color_green,
            color: color.color_white,
            paddingHorizontal: 10,
            textAlign: 'center',
            borderRadius: 100,
          }}>
          StrikePrice ({StrikePrice})
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: color.color_darkblue,
          }}>
          {expiryDate}
        </Text>

        <Text>lastPrice </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            paddingTop: 15,
          }}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.bidtext}>Bid</Text>
            {data.slice(0, 8).map((row, idx) => (
              <Text style={styles.bidblue}>{row?.CE?.bidprice}</Text>
            ))}
          </View>
          {/* <View style={{flexDirection: 'column'}}>
                <Text style={styles.bidtext}>Offer</Text>
                <Text style={styles.bidblue}>0.00</Text>
                <Text style={styles.bidblue}>0.00</Text>
                <Text style={styles.bidblue}>0.00</Text>
                <Text style={styles.bidblue}>0.00</Text>
                <Text style={styles.bidblue}>0.00</Text>
              </View> */}
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.bidtext}>Qty</Text>
            {data.slice(0, 8).map((row, idx) => (
              <Text style={styles.bidblue}>{row?.CE?.bidQty}</Text>
            ))}
          </View>
          {/* <View style={{flexDirection: 'column'}}>
                <Text style={styles.bidtext}>Offer</Text>
                <Text style={styles.bidred}>0.00</Text>
                <Text style={styles.bidred}>0.00</Text>
                <Text style={styles.bidred}>0.00</Text>
                <Text style={styles.bidred}>0.00</Text>
                <Text style={styles.bidred}>0.00</Text>
                <Text style={styles.bidred}>Total</Text>
              </View> */}

          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.bidtext}>Ask</Text>
            {data.slice(0, 8).map((row, idx) => (
              <Text style={styles.bidred}>{row?.CE?.askPrice}</Text>
            ))}
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.bidtext}>Qty</Text>
            {data.slice(0, 8).map((row, idx) => (
              <Text style={styles.bidred}>{row?.CE?.askQty}</Text>
            ))}
          </View>
        </View>
      </View>
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

    { console.log("identifier=====>",quantity,symbol,StrikePrice,price,setQuantity,isModalVisible,toggleModal,iscolor,istext,price,expiryDate,optionChainType,identifier)}
      <OptionChainbuy
        quantity={quantity}
        symbol={symbol}
        stockPrice={StrikePrice}
        price={price}
        getQuantity={setQuantity}
        modalshow={isModalVisible}
        onPressClose={toggleModal}
        maincolor={iscolor}
        leadtext={istext}
        onPriceChange={price}
        expiryDate={expiryDate}
        optionType={optionChainType}
        identifier={identifier}
      />
    </SafeAreaView>
  );
};

export default OptionDetail;
