import React from 'react';
import {Text, View} from 'react-native';
import {styles} from './styles';

const MarketDepth = ({symbol, data}) => {
  console.log(symbol);
  const result = symbol.replace(/\..*/, '');
  console.log(`data ${data.data}`);
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 12,
          paddingTop: 15,
        }}>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.bidtext}>Bid</Text>
          <Text style={styles.bidblue}>0.00</Text>
          <Text style={styles.bidblue}>0.00</Text>
          <Text style={styles.bidblue}>0.00</Text>
          <Text style={styles.bidblue}>0.00</Text>
          <Text style={styles.bidblue}>0.00</Text>
          <Text style={styles.bidblue}>Total</Text>
        </View>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.bidtext}>Offer</Text>
          <Text style={styles.bidblue}>0.00</Text>
          <Text style={styles.bidblue}>0.00</Text>
          <Text style={styles.bidblue}>0.00</Text>
          <Text style={styles.bidblue}>0.00</Text>
          <Text style={styles.bidblue}>0.00</Text>
        </View>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.bidtext}>Qty</Text>
          <Text style={styles.bidblue}>0.00</Text>
          <Text style={styles.bidblue}>0.00</Text>
          <Text style={styles.bidblue}>0.00</Text>
          <Text style={styles.bidblue}>0.00</Text>
          <Text style={styles.bidblue}>0.00</Text>
          <Text style={styles.bidblue}>0.00</Text>
        </View>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.bidtext}>Offer</Text>
          <Text style={styles.bidred}>0.00</Text>
          <Text style={styles.bidred}>0.00</Text>
          <Text style={styles.bidred}>0.00</Text>
          <Text style={styles.bidred}>0.00</Text>
          <Text style={styles.bidred}>0.00</Text>
          <Text style={styles.bidred}>Total</Text>
        </View>

        <View style={{flexDirection: 'column'}}>
          <Text style={styles.bidtext}>Order</Text>
          <Text style={styles.bidred}>0.00</Text>
          <Text style={styles.bidred}>0.00</Text>
          <Text style={styles.bidred}>0.00</Text>
          <Text style={styles.bidred}>0.00</Text>
          <Text style={styles.bidred}>0.00</Text>
        </View>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.bidtext}>Qty</Text>
          <Text style={styles.bidred}>0.00</Text>
          <Text style={styles.bidred}>0.00</Text>
          <Text style={styles.bidred}>0.00</Text>
          <Text style={styles.bidred}>0.00</Text>
          <Text style={styles.bidred}>0.00</Text>
          <Text style={styles.bidred}>0.00</Text>
        </View>
      </View>
    </>
  );
};

export default MarketDepth;
