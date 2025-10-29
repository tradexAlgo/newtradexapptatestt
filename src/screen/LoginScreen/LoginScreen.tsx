import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import AppLogo from '../../../assets/logo.png';
import { font } from '../../common/Font';
import { color } from '../../common/color';
import Email from '../../../assets/svg/email';
import Password from '../../../assets/svg/password';
import Spinner from '../../component/Spinner/Spinner';
import CustomTextinput from '../../component/TextInput/CustomTextinput';
import CustomButton from '../../component/buttons/CustomButton';
import PostAPI from '../../api/PostAPI';
import { CommonActions } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [loading, setLoading] = useState(false);

  const registerNumber = async (email, userId, name) => {
    const data = { email, userId, name };
    try {
      setLoading(true);
      await PostAPI.sendOtp(data);
      navigation.navigate('VerificationPinScreen', { email, userId, name });
    } catch (error) {
      Alert.alert('Error', error?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const userLogin = async () => {
    if (!email) return Alert.alert('Error', 'Email is required');
    if (!password) return Alert.alert('Error', 'Password is required');

    const data = { email, password };
    try {
      setLoading(true);
      const results = await PostAPI.login(data, toggleCheckBox);
      if (!results.data.isProfileComplete) {
        registerNumber(results?.data?.email, results?.data?._id, results?.data?.fullName);
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Tabstack' }],
          }),
        );
      }
    } catch (error) {
      Alert.alert('Error', error?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <Spinner visible={loading} text={'Loading...'} />

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to your account</Text>

        <View style={styles.formWrapper}>
          {/* Floating Logo */}
          <View style={styles.logoWrapper}>
            <Image source={AppLogo} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Login Form Box */}
          <View style={styles.formBox}>
            <CustomTextinput
              keyboardType="email-address"
              placeholder="Enter Email Address"
              onChangeText={setEmail}
              defaultValue={email}
              svg={Email}
            />
            <CustomTextinput
              placeholder="Enter Password"
              secureTextEntry
              onChangeText={setPassword}
              defaultValue={password}
              svg={Password}
            />

            <View style={styles.rowBetween}>
              <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
                <Text style={styles.signup}>Register</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgot}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <CustomButton textname="Log In" onPress={userLogin} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.color_black,
  },
  scrollview: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  title: {
    fontFamily: font.montserratbold,
    fontSize: 24,
    color: color.color_white,
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontFamily: font.montserratregular,
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 30,
  },

  formWrapper: {
    position: 'relative',
    marginTop: 40,
  },

  logoWrapper: {
    position: 'absolute',
    top: -50,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#1c1c1c',
    borderRadius: 50,
    padding: 10,
    alignSelf: 'center',
    zIndex: 10,
    elevation: 5,
  },

  logo: {
    width: 80,
    height: 80,
  },

  formBox: {
    backgroundColor: '#1c1c1c',
    padding: 20,
    borderRadius: 15,
    paddingTop: 60, // space for floating logo
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginTop: 10,
  },

  forgot: {
    color: '#1e90ff',
    fontSize: 14,
  },

  signup: {
    color: '#1e90ff',
    fontSize: 14,
  },
});
