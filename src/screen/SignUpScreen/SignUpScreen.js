import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import Email from '../../../assets/svg/email';
import Password, { BrokerCodeIcon, DateOfBirthIcon, GenderIcon, IncomeRangeIcon, PanNumberIcon } from '../../../assets/svg/password';
import CustomTextinput from '../../component/TextInput/CustomTextinput';
import CustomButton from '../../component/buttons/CustomButton';
import Appheader from '../../component/AppHeader/appheader';
import Signup from '../../../assets/svg/signup';
import User from '../../../assets/svg/user';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import Spinner from '../../component/Spinner/Spinner';
import { register } from '../../redux/slice/AuthSlice';
import PostAPI from '../../api/PostAPI';

const SignUpScreen = ({ props, navigation }) => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [brokerCode, setBrokerCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [incomeRange, setIncomeRange] = useState('');
  const [gender, setGender] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const registerNumber = async (email, userId, name) => {
    let data = {
      email: email,
      userId: userId,
      name: name
    };
    // console.log(data);
    try {
      setLoading(true);
      await PostAPI.sendOtp(data);
      navigation.navigate('VerificationPinScreen', { email, userId, name });
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
  const userRegister = async () => {
    if (!firstname) {
      Alert.alert('Error', 'Please enter your first name');
      return;
    }
    if (!lastname) {
      Alert.alert('Error', 'Please enter your last name');
      return;
    }
    if (!email) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    let data = {
      fullName: firstname + ' ' + lastname,
      email,
      password,
      brokerCode,
      dob,
      incomeRange,
      gender,
      panNumber
    };

    try {
      setLoading(true);
      const response = await PostAPI.register(data);
      // console.log("checkres", response?.data)
      registerNumber(response?.data?.email, response?.data?._id, response?.data?.fullName)
      //  navigation.navigate('VerifyNumberScreen',{id:response?.data?._id});
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
      <Appheader
        onPress={() => navigation.navigate('LoginScreen')}
        header="Create Account"
      />
      <Spinner visible={loading} text={'Loading...'} />
      <ScrollView contentContainerStyle={styles.scrollview}>
        <View style={styles.mainview}>
          <View style={{ marginTop: 20 }}>
            <Signup />
          </View>
        </View>
        <CustomTextinput
          placeholder="Broker Code"
          onChangeText={newText => setBrokerCode(newText)}
          defaultValue={brokerCode}
          svg={BrokerCodeIcon}
        />
        <View style={styles.subview}>
          <CustomTextinput
            placeholder="FirstName"
            onChangeText={newText => setFirstName(newText)}
            defaultValue={firstname}
            svg={User}
          />
          <CustomTextinput
            placeholder="LastName"
            onChangeText={newText => setLastName(newText)}
            defaultValue={lastname}
            svg={User}
          />
          <CustomTextinput
            keyboardType="email-address"
            placeholder="Email"
            onChangeText={newText => setEmail(newText)}
            defaultValue={email}
            svg={Email}
          />
          <CustomTextinput
            placeholder="Password"
            onChangeText={newText => setPassword(newText)}
            defaultValue={password}
            svg={Password}
          />

          <CustomTextinput
            placeholder="Date of Birth"
            onChangeText={newText => setDob(newText)}
            defaultValue={dob}
            svg={DateOfBirthIcon}
          />

          <CustomTextinput
            placeholder="Income Range"
            onChangeText={newText => setIncomeRange(newText)}
            defaultValue={incomeRange}
            svg={IncomeRangeIcon}
          />
          <CustomTextinput
            placeholder="Gender"
            onChangeText={newText => setGender(newText)}
            defaultValue={gender}
            svg={GenderIcon}
          />


          <CustomTextinput
            placeholder="Pan Number"
            onChangeText={newText => setPanNumber(newText)}
            defaultValue={panNumber}
            svg={PanNumberIcon}
          />



          <View style={styles.subcontainer}>
            <CustomButton textname="Sign Up" onPress={userRegister} />
            <View style={styles.accountview}>
              <Text style={styles.account}>Already have an account? </Text>
              <Text
                style={styles.signup}
                onPress={() => {
                  navigation.navigate('LoginScreen');
                }}>
                Login
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
