import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import Appheader from '../../component/AppHeader/appheader';
import {styles} from './styles';

const Futures = ({navigation}) => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Appheader onPress={() => navigation.goBack()} header="Futures" />
        <View />
      </SafeAreaView>
    </>
  );
};

export default Futures;
