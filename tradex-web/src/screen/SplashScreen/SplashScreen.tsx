import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Image, Text, StyleSheet } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { styles } from './styles';
import AppLogo from '../../../assets/assets/logo.png';
import CustomButton from '../../component/buttons/CustomButton';
import Seperator from '../../component/Seperator/Seperator';
import StorageItems from '../../utils/StorageItems';
import IntroSlider from '../../component/IntroSlider';
import { STOCK } from '../../utils/baseURL';

const SplashScreen = ({ navigation }) => {
  const [showIntro, setShowIntro] = useState(false);
  const [introSlides, setIntroSlides] = useState([]);

  useEffect(() => {
    const fetchIntroSlides = async () => {
      try {
        const response = await fetch(STOCK?.INTRO);
        const data = await response.json();
        setIntroSlides(data);
      } catch (error) {
        console.error('Error fetching intro slides:', error);
      }
    };

    const checkUserToken = async () => {
      const isUser = await StorageItems.getUserToken();
      if (isUser) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Tabstack' }],
          })
        );
      } else {
        await fetchIntroSlides();
        setShowIntro(true);
      }
    };
    
    checkUserToken();
  }, [navigation]);

  const handleIntroDone = () => {
    setShowIntro(false);
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
