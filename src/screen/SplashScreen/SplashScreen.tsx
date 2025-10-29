import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Image, Text, Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { styles } from './styles';
import AppLogo from '../../../assets/logo.png';
import CustomButton from '../../component/buttons/CustomButton';
import Seperator from '../../component/Seperator/Seperator';
import StorageItems from '../../utils/StorageItems';
import IntroSlider from '../../component/IntroSlider';
import { STOCK } from '../../utils/baseURL';
import ReactNativeBiometrics from 'react-native-biometrics';

const SplashScreen = ({ navigation }) => {
  const [showIntro, setShowIntro] = useState(false);
  const [introSlides, setIntroSlides] = useState([]);
  const rnBiometrics = new ReactNativeBiometrics();
  useEffect(() => {
    const runBiometricPrompt = async () => {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();


      const userToken = await StorageItems.getUserToken();

      if (!userToken) {
        navigation.navigate('LoginScreen')
        return
      }
      // console.log('Biometric Check:', { available, biometryType });

      // console.log('biometryType:', biometryType); // likely 'Biometrics' or 'Fingerprint'
      // console.log('Constant:', ReactNativeBiometrics.Biometrics); // what does this print?

      if (available) {
        const { success } = await rnBiometrics.simplePrompt({
          promptMessage: 'Login with Fingerprint',
        });

        if (success) {
          // Alert.alert('Authenticated ✅');
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Tabstack' }],
            })
          );
        } else {
          Alert.alert('Authentication Failed ❌');
        }
      } else {
        Alert.alert('Biometric authentication not available');
      }

    };

    runBiometricPrompt();
  }, []);


  const handleIntroDone = () => {
    setShowIntro(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      })
    );
  };

  if (showIntro) {
    return <IntroSlider slides={introSlides} onDone={handleIntroDone} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainview}>
        <Text style={styles.welcome}>Welcome to</Text>
        <Seperator seperate={10} />
        <Image style={{ height: 150, width: 367 }} source={AppLogo} resizeMode='contain' />
      </View>
      <View style={styles.subcontainer}>
        <CustomButton
          textname="Login"
          onPress={() => navigation.navigate('LoginScreen')}
        />
        <View style={styles.accountview}>
          <Text style={styles.account}>Don’t have an account? </Text>
          <Text
            style={styles.signup}
            onPress={() => navigation.navigate('SignUpScreen')}
          >
            Sign Up
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
