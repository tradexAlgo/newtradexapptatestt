import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { styles } from './styles';
import Appheader from '../../component/AppHeader/appheader';
import { font } from '../../common/Font';
import { color } from '../../common/color';
import CustomButton from '../../component/buttons/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import priceFormat from '../../utils/priceFormat';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { userProfile } from '../../redux/slice/AuthSlice';
import { STOCK } from '../../utils/baseURL';

const Withdrawal = ({ navigation }) => {
  const [withdrawamount, setWithdrawAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const dispatch = useDispatch();
  const { userProfileData } = useSelector(state => state.auth);

  console.log("userProfillll",userProfileData)
  

  useEffect(() => {
    // Set user profile data if necessary
    dispatch(userProfile({navigation}));
  }, []);

  const handleSubmit = async () => {
    if (!withdrawamount || !transactionId) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      const response = await axios.post(STOCK.WITHDRAW, {
        currency: 'INR',
        gateway: 'UPI',
        amount: parseFloat(withdrawamount),
        upiId: transactionId,
        userId: userProfileData._id, // Ensure you pass the correct user ID
      });

      if (response.data.code === 200) {
        // Alert.alert('Success', response.data.message);
        navigation.navigate('Submited');
      } else {
        Alert.alert('Error', 'Something went wrong, please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit withdrawal request.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appheader
        onPress={() => navigation.goBack()}
        header="Withdraw Confirm"
      />

      <ScrollView contentContainerStyle={styles.scrollview}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 14,
            fontFamily: font.nunitoregular,
            paddingLeft: 15,
            paddingRight: 15,
            color: color.color_gettext,
          }}>
          We get your personal information from the verification process. If you
          want to make changes to your personal information, contact our
          support.
        </Text>

        <View style={styles.subview}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: font.nunitoregular,
              color: color.color_lightblack,
              paddingTop: 10,
            }}>
            Currency
          </Text>
          <TextInput
            editable={false}
            value={'INR'}
            underlineColorAndroid={color.color_gray}
            placeholderTextColor={color.color_lightblack}
            style={{ fontSize: 19, color: color.color_lightblack }}
          />

          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: font.nunitoregular,
              color: color.color_lightblack,
              paddingTop: 10,
            }}>
            Gateway
          </Text>
          <TextInput
            editable={false}
            value={'UPI'}
            underlineColorAndroid={color.color_gray}
            placeholderTextColor={color.color_lightblack}
            style={{ fontSize: 19, color: color.color_lightblack }}
          />

          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: font.nunitoregular,
              color: color.color_lightblack,
              paddingTop: 10,
            }}>
            Enter Withdraw Amount
          </Text>
          <TextInput
            keyboardType="numeric"
            onChangeText={setWithdrawAmount}
            value={withdrawamount}
            underlineColorAndroid={color.color_gray}
            placeholderTextColor={color.color_lightblack}
            style={{ fontSize: 19, color: color.color_lightblack }}
          />
          
          <Text>
            Available Fund{' '}
            <Text style={{ fontSize: 16, color: 'green' }}>
              ₹{priceFormat(userProfileData?.wallet)}
            </Text>
          </Text>

          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: font.nunitoregular,
              color: color.color_lightblack,
              paddingTop: 10,
            }}>
            Enter Your UPI ID
          </Text>
          <TextInput
            onChangeText={setTransactionId}
            placeholder="Enter Your UPI ID"
            value={transactionId}
            underlineColorAndroid={color.color_gray}
            placeholderTextColor={color.color_lightblack}
            style={{ fontSize: 19, color: color.color_lightblack }}
          />

          <View style={{ marginTop: 50, marginBottom: 50 }}>
            <CustomButton
              textname="Submit Request"
              onPress={handleSubmit}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Withdrawal;
