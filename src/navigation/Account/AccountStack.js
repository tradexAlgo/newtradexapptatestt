import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AccountScreen from './AccountScreen';
import GenerateBill from '../../screen/Deposit/GenerateBill';
import Transactions from '../../screen/Deposit/Transactions';
import CustomerSupport from '../../screen/Deposit/CustomerSupport';
// import InformationScreen from "../../screen/Personalinformation/InformationScreen"




const AccountStack = () => {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={({navigation}) => ({})}>
    <Stack.Screen
      name="AccountScreen"
      component={AccountScreen}
      options={{
        headerShown: false,
      }}
    />
     <Stack.Screen
        name="GenerateBill"
        component={GenerateBill}
        options={{headerShown: false}}
      />
     <Stack.Screen
        name="Transactions"
        component={Transactions}
        options={{headerShown: false}}
      />
     
     <Stack.Screen
        name="CustomerSupport"
        component={CustomerSupport}
        options={{headerShown: false}}
      />
  </Stack.Navigator>
  )
}

export default AccountStack