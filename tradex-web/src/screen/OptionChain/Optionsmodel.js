import React, {useState} from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {color} from '../../common/color';
import HorizontalSeperator from '../MatualFunds/Components/HorizontalSeperator';
import {styles} from './styles';
const Optionsmodel = ({
  isModalVisible,
  toggleModal,
  CE,
  symbol,
  expiryDate,
  StrikePrice,
  data,
}) => {
  const name = 'TCS';

  const [iscolor, setIsColor] = useState('');
  const [istext, setIsText] = useState('BUY');
  const [isModalVisible2, setModalVisible2] = useState(false);
  const toggleModal2 = () => {
    setModalVisible2(!isModalVisible2);
  };
  return (
    <>
      <View>
        <Modal
          animationIn={'slideInUp'}
          isVisible={isModalVisible}
          backdropOpacity={100}
          backdropColor={color.color_white}>
          <View style={{flex: 1, width: '100%', padding: 0, margin: 0}}>
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
              <View style={{flexDirection: 'column'}}>
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
              <View style={{flexDirection: 'column'}}>
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

              <View style={{flexDirection: 'column'}}>
                <Text style={styles.bidtext}>Ask</Text>
                {data.slice(0, 8).map((row, idx) => (
                  <Text style={styles.bidred}>{row?.CE?.askPrice}</Text>
                ))}
              </View>
              <View style={{flexDirection: 'column'}}>
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
                  setModalVisible2(true),
                  setIsText('BUY');
              }}>
              <Text style={styles.sametext}>BUY</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.selltext}
              onPress={() => {
                setIsColor(color.color_red),
                  setModalVisible2(true),
                  setIsText('SELL');
              }}>
              <Text style={styles.sametext}>SELL</Text>
            </TouchableOpacity>
          </View>

          <Button title=" Close" onPress={toggleModal} />
        </Modal>
      </View>
    </>
  );
};

export default Optionsmodel;
