import {View, Text, SafeAreaView, ScrollView, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from './styles';
import Appheader from '../../component/AppHeader/appheader';
import {font} from '../../common/Font';
import {color} from '../../common/color';
import CustomButton from '../../component/buttons/CustomButton';
import {useSelector} from 'react-redux';

const InformationScreen = ({navigation}) => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [citizenship, setcitizenship] = useState('');
  const {userProfileData, userProfileDataFailed} = useSelector(
    state => state.auth,
  );

  useEffect(() => {
    try {
      const fullName = userProfileData?.fullName.split(' ');
      setFirstName(fullName[0]);
      setLastName(fullName[1]);
    } catch (error) {}
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Appheader
        onPress={() => navigation.goBack()}
        header="Personal Information"
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
          want to make changes on your personal information, contact our
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
            First name
          </Text>
          <TextInput
            editable={false}
            onChangeText={setFirstName}
            value={firstname}
            underlineColorAndroid={color.color_gray}
            placeholderTextColor={color.color_lightblack}
            style={{fontSize: 19, color: color.color_lightblack}}
          />

          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: font.nunitoregular,
              color: color.color_lightblack,
              paddingTop: 10,
            }}>
            Last name
          </Text>
          <TextInput
            editable={false}
            onChangeText={setLastName}
            value={lastname}
            underlineColorAndroid={color.color_gray}
            placeholderTextColor={color.color_lightblack}
            style={{fontSize: 19, color: color.color_lightblack}}
          />
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: font.nunitoregular,
              color: color.color_lightblack,
              paddingTop: 10,
            }}>
            Email
          </Text>
          <TextInput
            editable={false}
            onChangeText={setLastName}
            value={userProfileData?.email}
            underlineColorAndroid={color.color_gray}
            placeholderTextColor={color.color_lightblack}
            style={{fontSize: 19, color: color.color_lightblack}}
          />
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: font.nunitoregular,
              color: color.color_lightblack,
              paddingTop: 10,
            }}>
            Phone Number
          </Text>
          <TextInput
            editable={false}
            onChangeText={setLastName}
            value={`+91 ${String(userProfileData?.phoneNumber)}`}
            underlineColorAndroid={color.color_gray}
            placeholderTextColor={color.color_lightblack}
            style={{fontSize: 19, color: color.color_lightblack}}
          />

          {/* <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: font.nunitoregular,
              color: color.color_lightblack,
              paddingTop: 10,
            }}>
            Street address
          </Text>
          <TextInput
            placeholder="Enter Your Address"
            onChangeText={setAddress}
            value={address}
            underlineColorAndroid={color.color_gray}
            placeholderTextColor={color.color_lightblack}
            style={{fontSize: 19, color: color.color_lightblack}}
          />

          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: font.nunitoregular,
              color: color.color_lightblack,
              paddingTop: 10,
            }}>
            City
          </Text>
          <TextInput
            placeholder="Enter Your City Name"
            onChangeText={setCity}
            value={city}
            underlineColorAndroid={color.color_gray}
            placeholderTextColor={color.color_lightblack}
            style={{fontSize: 19, color: color.color_lightblack}}
          />

          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: font.nunitoregular,
              color: color.color_lightblack,
              paddingTop: 10,
            }}>
            ZIP/Area code
          </Text>
          <TextInput
            placeholder="Enter Your Area Pincode"
            onChangeText={setZipcode}
            value={zipcode}
            underlineColorAndroid={color.color_gray}
            placeholderTextColor={color.color_lightblack}
            style={{fontSize: 19, color: color.color_lightblack}}
          />

          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: font.nunitoregular,
              color: color.color_lightblack,
              paddingTop: 10,
            }}>
            Citizenship
          </Text>
          <TextInput
            placeholder="Enter your Citizenship"
            onChangeText={setcitizenship}
            value={citizenship}
            underlineColorAndroid={color.color_gray}
            placeholderTextColor={color.color_lightblack}
            style={{fontSize: 19, color: color.color_lightblack}}
          /> */}
          <View style={{marginTop: 50}}>
            <CustomButton textname="Back" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InformationScreen;
