import {View, Text, SafeAreaView, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import NumberPad from '../../component/NumberPad/NumberPad';
import {styles} from './styles';
import Appheader from '../../component/AppHeader/appheader';
import useStore from '../../store';
import {useDispatch, useSelector} from 'react-redux';
import {sendOTP, verifyOTP} from '../../redux/slice/AuthSlice';
import Spinner from '../../component/Spinner/Spinner';
import StorageItems from '../../utils/StorageItems';
import {CommonActions} from '@react-navigation/native';
import PostAPI from '../../api/PostAPI';

const VerificationPinScreen = ({navigation, route}) => {
  const email = route?.params?.email;
  const userId = route?.params?.userId;
  const name = route?.params?.name;
  const [loading, setLoading] = useState(false);

  const ResendOTP = async () => {
    let data = {
      email: email,
      userId:userId,
      name:name
    };
    try {
      setLoading(true);
      await PostAPI.sendOtp(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error?.message) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Something went wrong!');
      }
    }
  };

  const verify = async pin => {
    const data = {
      otp: Number(pin),
    };

    try {
      setLoading(true);
      await PostAPI.verifyOtp(data);
      navigation.navigate('WellDone');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error?.message) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Something went wrong!');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Spinner text={'Verifying....'} visible={loading} />
      <Appheader
        onPress={() => navigation.goBack()}
        header="Phone Verification"
      />
      <NumberPad
        textfield={`Please enter the 4-digit code send to you at\n${email}`}
        accountText="Didn’t Receive the Code? "
        pinText="Resend Code"
        onPress={ResendOTP}
        onbutton={verify}
      />
    </SafeAreaView>
  );
};

export default VerificationPinScreen;
