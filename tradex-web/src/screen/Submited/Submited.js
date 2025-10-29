import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import Appheader from '../../component/AppHeader/appheader';
import {font} from '../../common/Font';
import {color} from '../../common/color';
import CustomButton from '../../component/buttons/CustomButton';
import * as Progress from 'react-native-progress';
import Number from '../../../assets/svg/number';
import Welldone from '../../../assets/svg/welldone';
import {CommonActions} from '@react-navigation/native';

const Submited = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          marginTop: 20,
          paddingHorizontal: 20,
          flex: 1,
          marginBottom: 20,
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 14,
            fontFamily: font.nunitoregular,
            fontWeight: 'normal',
            color: color.color_lightblack,
          }}>
          Your Request is Submited !
        </Text>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <Welldone />
        </View>

        <CustomButton
          textname="Go to Home"
          onPress={() =>
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
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Submited;
