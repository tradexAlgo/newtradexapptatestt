import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import Appheader from '../../component/AppHeader/appheader';
import {WebView} from 'react-native-webview';
import {styles} from './styles';

const Chart = ({navigation, route}) => {
  const symbol = route?.params?.symbol;
  const resuly = symbol.replace(/\..*/, '');
  console.log(`https://www.tradingview.com/chart/?symbol=${resuly}`);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Appheader onPress={() => navigation.goBack()} header="Chart" />
        <WebView
          source={{uri: `https://www.tradingview.com/chart/?symbol=${resuly}`}}
        />
      </SafeAreaView>
    </>
  );
};

export default Chart;
