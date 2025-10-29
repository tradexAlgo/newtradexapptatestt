import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { styles } from './styles';
import Appheader from '../../component/AppHeader/appheader';
import { font } from '../../common/Font';
import { color } from '../../common/color';
import CustomButton from '../../component/buttons/CustomButton';
import { STOCK } from '../../utils/baseURL';

const Deposit = ({ navigation }) => {
  const [firstname, setFirstName] = useState('');
  const [depositamount, setDepositAmount] = useState('1000');
  const [transactionId, setTransactionId] = useState('');
  const [currency, setCurrency] = useState('');
  const [upiId, setUpiId] = useState('');
  const [qrImage, setQrImage] = useState('');

  const { userProfileData, userProfileDataFailed } = useSelector(
    state => state.auth,
  );
  // console.log("sldfkjksdjfkjsdfbeti", userProfileData)

  useEffect(() => {
    // Fetch user profile data
    try {
      const fullName = userProfileData?.fullName.split(' ');
      setFirstName(fullName[0]);
      setLastName(fullName[1]);
    } catch (error) { }

    // Fetch payment info
    const fetchPaymentInfo = async () => {
      try {
        const response = await axios.get(STOCK.PAYMENT_INFO);
        if (response.data.code === 200) {
          const { data } = response.data;
          setCurrency(data?.currency);
          setUpiId(data?.UPIId);
          setQrImage(data?.QRImage);
        } else {
          Alert.alert('Error', 'Failed to fetch payment information.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch payment information.');
      }
    };

    fetchPaymentInfo();
  }, [userProfileData]);

  // console.log("userProfileDatauserProfileData", userProfileData)

  const handleSubmit = async () => {
    try {
      const response = await axios.post(STOCK.DEPOSIT, {
        userId: userProfileData?._id,
        amount: parseFloat(depositamount),
        transactionId,
        clientUp: upiId,
        currency,
      });

      if (response.data.code === 200) {

        if (userProfileData?.depositUrl) {
          navigation.navigate('PaymentWebView', {
            paymentUrl: userProfileData?.depositUrl,
          });
        } else {
          Alert.alert('Success', response.data.message);
        }


      } else {
        Alert.alert('Error', 'Something went wrong, please try again.');
      }
    } catch (error) {
      // console.log("chekkkkk", error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appheader onPress={() => navigation.goBack()} header="Deposit Checkout" />

      <ScrollView contentContainerStyle={styles.scrollview}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 14,
            fontFamily: font.nunitoregular,
            paddingLeft: 15,
            paddingRight: 15,
            color: color.color_white,
          }}>
          We get your personal information from the verification process. If you
          want to make changes on your personal information, contact our
          support.
        </Text>

        <FastImage
          style={{
            height: 150,
            width: 150,
            alignSelf: 'center',
            marginVertical: 20,
          }}
          source={{ uri: qrImage || 'placeholder_image_url' }} // Add a placeholder image URL if QRImage is empty
        />
        <View style={styles.subview}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: font.nunitoregular,
              color: color.color_white,
              paddingTop: 10,
            }}>
            Currency
          </Text>
          <TextInput
            editable={false}
            value={currency}
            underlineColorAndroid={color.color_white}
            placeholderTextColor={color.color_white}
            style={{ fontSize: 19, color: color.color_white }}
          />

          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: font.nunitoregular,
              color: color.color_white,
              paddingTop: 10,
            }}>
            USDT TRC20
          </Text>
          <TextInput
            editable={false}
            value={upiId}
            underlineColorAndroid={color.color_white}
            placeholderTextColor={color.color_white}
            style={{ fontSize: 19, color: color.color_white }}
          />
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: font.nunitoregular,
              color: color.color_white,
              paddingTop: 10,
            }}>
            Enter Deposit Amount
          </Text>
          <TextInput
            keyboardType="numeric"
            onChangeText={setDepositAmount}
            value={depositamount}
            underlineColorAndroid={color.color_white}
            placeholderTextColor={color.color_white}
            style={{ fontSize: 19, color: color.color_white }}
          />
          {/* <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: font.nunitoregular,
              color: color.color_white,
              paddingTop: 10,
            }}>
            Enter Deposit Transaction id
          </Text> */}
          {/* <TextInput
            onChangeText={setTransactionId}
            placeholder="Enter Transaction Id"
            value={transactionId}
            underlineColorAndroid={color.color_white}
            placeholderTextColor={color.color_white}
            style={{ fontSize: 19, color: color.color_white }}
          /> */}

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

export default Deposit;
