import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import Appheader from '../../component/AppHeader/appheader';
import { font } from '../../common/Font';
import { color } from '../../common/color';
import CustomButton from '../../component/buttons/CustomButton';
import { useSelector } from 'react-redux';

const InformationScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [incomeRange, setIncomeRange] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const { userProfileData } = useSelector(state => state.auth);

  useEffect(() => {
    try {
      const fullName = userProfileData?.fullName?.split(' ') || [];
      setFirstName(fullName[0] || '');
      setLastName(fullName[1] || '');
      setFatherName(userProfileData?.fatherName || '');
      setDob(userProfileData?.dob || '');
      setGender(userProfileData?.gender || '');
      setIncomeRange(userProfileData?.incomeRange || '');
      setPanNumber(userProfileData?.panNumber || '');
    } catch (error) {}
  }, []);

  const renderLabelAndValue = (label, value) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        editable={false}
        value={value}
        underlineColorAndroid={color.color_gray}
        placeholderTextColor={color.color_white}
        style={styles.input}
      />
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appheader
        onPress={() => navigation.goBack()}
        header="Personal Information"
      />

      <ScrollView contentContainerStyle={styles.scrollview}>
        <Text style={styles.infoNote}>
          We get your personal information from the verification process. If you
          want to make changes on your personal information, contact our support.
        </Text>

        <View style={styles.subview}>
          {renderLabelAndValue('First Name', firstName)}
          {renderLabelAndValue('Last Name', lastName)}
          {renderLabelAndValue('Date of Birth', dob)}
          {renderLabelAndValue('Gender', gender)}
          {renderLabelAndValue('Mobile Number', `+91 ${userProfileData?.phoneNumber}`)}
          {renderLabelAndValue('Registered Email', userProfileData?.email)}
          {renderLabelAndValue('Father Name', fatherName)}
          {renderLabelAndValue('Pan Number', panNumber)}
          {renderLabelAndValue('Income Range', incomeRange)}

          <Text style={styles.warningNote}>
            If you want to change or update any details, please contact our support or email us.
          </Text>

          <View style={{ marginTop: 50,marginBottom:100 }}>
            <CustomButton textname="Back" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InformationScreen;
