import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import { font } from '../../common/Font';
import { color } from '../../common/color';
import Loginlogo from '../../../assets/assets/svg/loginlogo';
import Email from '../../../assets/assets/svg/email';
import Password from '../../../assets/assets/svg/password';
import CheckBox from '@react-native-community/checkbox';

import CustomTextinput from '../../component/TextInput/CustomTextinput';
import CustomButton from '../../component/buttons/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slice/AuthSlice';
import { CommonActions } from '@react-navigation/native';
import Spinner from '../../component/Spinner/Spinner';
import PostAPI from '../../api/PostAPI';

const LoginScreen = ({ props, navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [loading, setLoading] = useState(false);


  const registerNumber = async (email,userId,name) => {
    let data = {
      email: email,
      userId:userId,
      name:name
    };
    console.log(data);
    try {
      setLoading(true);
      await PostAPI.sendOtp(data);
      navigation.navigate('VerificationPinScreen', {email,userId,name});
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
  

  const userLogin = async () => {
    if (!email) {
      Alert.alert('Error', 'Email is required');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Password is required');
      return;
    }
    let data = {
      email: email,
      password: password,
    };
    try {
      setLoading(true);
      const results = await PostAPI.login(data, toggleCheckBox);
      if (!results.data.isProfileComplete) {
        console.log("result00",results?.data?._id)
        registerNumber(results?.data?.email,results?.data?._id,results?.data?.fullName)
        // navigation.navigate('VerifyNumberScreen',{id:results?.data?._id});
        // setLoading(false);
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Tabstack',
              },
            ],
          }),
        );
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      if (error?.message) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Something went wrong!');
      }
    }
  };

  // useEffect(() => {
  //   try {
  //     if (loginDataFailed) {
  //       Alert.alert('Error', loginDataFailed.message);
  //       return;
  //     }
  //     if (loginData) {
  //       if (!loginData.data.isProfileComplete) {
  //         navigation.navigate('VerificationPinScreen', {login: true});
  //       } else {
  //         navigation.dispatch(
  //           CommonActions.reset({
  //             index: 0,
  //             routes: [
  //               {
  //                 name: 'Tabstack',
  //               },
  //             ],
  //           }),
  //         );
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [loginData, loginDataFailed]);



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <Spinner visible={loading} text={'Loading....'} />
        <View style={styles.mainview}>
          <TouchableOpacity onPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'Tabstack',
                  },
                ],
              }),
            )
          }} >
            <Text style={styles.login}>Login</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 20 }}>
            <Loginlogo />
          </View>
        </View>
        <View style={styles.subview}>
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

          <View style={styles.checkboxview}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox
                disabled={false}
                value={toggleCheckBox}
                onValueChange={newValue => setToggleCheckBox(newValue)}
              />

              <Text
                style={{
                  // flex: 1,
                  fontFamily: font.montserratregular,
                  color: color.color_black,
                }}>
                Remember me
              </Text>
            </View>
            <Text
              style={styles.forgot}
              onPress={() => {
                navigation.navigate('ForgotPassword');
              }}>
              Forgot Password?
            </Text>
          </View>

          <View style={styles.subcontainer}>
            <CustomButton textname="Log In" onPress={userLogin} />
            <View style={styles.accountview}>
              <Text style={styles.account}>Don’t have an account? </Text>
              <Text
                style={styles.signup}
                onPress={() => {
                  navigation.navigate('SignUpScreen');
                }}>
                Sign Up
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
