
import { ImageComponent, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screen/SplashScreen/SplashScreen';
import LoginScreen from '../screen/LoginScreen/LoginScreen';
import SignUpScreen from '../screen/SignUpScreen/SignUpScreen';
import ForgotPassword from '../screen/ForgotPassword/ForgotPassword';
import React, { useEffect } from 'react';
import EmailVarification from '../screen/EmailVarification/EmailVarification';
import VerificationPinScreen from '../screen/VerificationPin/VerificationPinScreen';
import ForgotPinScreen from '../screen/forgotpin/ForgotPinScreen';
import CreatePinScreen from '../screen/Createpin/CreatePinScreen';
import ConformPinscreen from '../screen/ConformPin/ConformPinscreen';
import EmailPasswordchange from '../screen/emailpasswordvarification/EmailPasswordchange';
import ChangePassword from '../screen/ChangePassword/ChangePassword';
import Tabstack from '../navigation/BottomTab/TabStack';
import DrawerRoutes from './Drawer/DrawerRoutes';
import InformationScreen from '../screen/Personalinformation/InformationScreen';
import VerifyNumberScreen from '../screen/VerifyNumber/VerifyNumberScreen';
import TabVarificationPin from '../screen/TabvarificationPin/TabVarificationPin';
import WellDone from '../screen/WellDone/WellDone';
import TabSecurity from '../screen/TabSecurity/TabSecurity';
import TabChangePassword from '../screen/TabChangePassword/TabChangePassword';
import SecurityWellDone from '../screen/SecurityWellDone/SecurityWellDone';
import EnterOldPinScreen from '../screen/Enteroldpin/EnterOldPinScreen';
import EnterNewPinScreen from '../screen/EnterNewPin/EnterNewPinScreen';
import SecurityConformPinScreen from '../screen/SecurityConformScreen/SecurityConformPinScreen';
import SecurityForgotPin from '../screen/SecurityForgotPin/SecurityForgotPin';
import SecurityEmailVarification from '../screen/SecurityEmailVarification/SecurityEmailVarification';
import NotificationScreen from '../screen/Notification/NotificationScreen';
import useStore from '../store';
// import SeeAll from '../screen/SeeAll/SeeAll';
import BankDetails from '../screen/BankDetailsScreen/BankDetails';
import MatualFundsScreen from '../screen/MatualFunds/MatualFundsScreen';
import AllMatualFundScreen from '../screen/AllMatualFunds/AllMatualFundScreen';
import FilterShortScreen from '../screen/FilterShort/FilterShortScreen';
import AxisBankDetailsScreen from '../screen/AxisBankDetails/AxisBankDetailsScreen';
import IpoScreen from '../screen/Ipo/IpoScreen';
import BankIpoScreen from '../screen/BankIpoDetailScreen/BankIpoScreen';
import PriceAlertScreen from '../screen/CreatePriceAlert/PriceAlertScreen';
import SearchPriceAlertScreen from '../screen/SearchPriceAlertList/SearchPriceAlertScreen';
import MarginCalculatorScreen from '../screen/MarginCalculator/MarginCalculatorScreen';
import ResearchScreen from '../screen/Research/ResearchScreen';
import GoldBuyScreen from '../screen/GoldBuy/GoldBuyScreen';
import StorageItems from '../utils/StorageItems';
import { useDispatch, useSelector } from 'react-redux';
import checkNonEmpty from '../utils/checkNonEmpty';
import { setStockListSocket } from '../redux/slice/StockDataSlice';
import Debounce from '../utils/Debounce';
import getSocketData from '../utils/getSocketData';
import SearchPage from './SearchPage/SearchPage';
import Details from './Fund/Details';
import OPtionChain from '../screen/OptionChain/OPtionChain';
import MCX from '../screen/MCX_Market/MCX';
import Futures from '../screen/Future/Future';
import Deposit from '../screen/Deposit/Deposit';
import Withdrawal from '../screen/Withdrawal/Withdrawal';
import Submited from '../screen/Submited/Submited';
import Chart from '../screen/Chart/Chart';
import OptionDetail from '../screen/OptionChain/OptionChianDetail';
import PaymentWebView from '../screen/PaymentWebView';

export const Auth = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />

      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen
        name="VerificationPinScreen"
        component={VerificationPinScreen}
      />
      <Stack.Screen name="EmailVarification" component={EmailVarification} />
      <Stack.Screen name="ForgotPinScreen" component={ForgotPinScreen} />
      <Stack.Screen name="CreatePinScreen" component={CreatePinScreen} />
      <Stack.Screen name="ConformPinscreen" component={ConformPinscreen} />
      <Stack.Screen
        name="EmailPasswordchange"
        component={EmailPasswordchange}
      />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
    </Stack.Navigator>
  );
};

export const MainStack = () => {
  const Stack = createNativeStackNavigator();

  const dispatch = useDispatch();
  const { watchList, watchListFailed, loading, stockListSocket } = useSelector(
    state => state.stockData,
  );

  useEffect(() => {
    if (checkNonEmpty(watchList)) {
      // setStockData(watchList);
      dispatch(setStockListSocket(watchList));
      const symbols = watchList.map(res => res.symbol);
      const ws = new WebSocket('wss://streamer.finance.yahoo.com');

      ws.onopen = function open() {
        // console.log('connected');
        ws.send(
          JSON.stringify({
            subscribe: [...symbols],
          }),
        );
      };

      ws.onclose = function close() {
        // console.log('disconnected');
      };

      ws.onmessage = async function incoming(message) {
        try {
          // const stockData = await getSocketData({ message, watchList });
          const stockData = await Debounce({
            func: async () => {
              const result = await getSocketData({ message, watchList });
              return result;
            },
            delay: 800,
          });
          dispatch(setStockListSocket(stockData));
          // setStockData(stockData);
        } catch (error) {
          // console.log(error);
        }
      };
    }
  }, [watchList]);

  const initialRouteName =
    StorageItems.getUserToken() && StorageItems.getRememberMeStatus()
      ? 'Tabstack'
      : 'Auth';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="Tabstack" component={Tabstack} />
      <Stack.Screen name="OptionChain" component={OPtionChain} />
      <Stack.Screen name="Chart" component={Chart} />
      

      <Stack.Screen name="MCXMaket" component={MCX} />
      <Stack.Screen name="Optionchaindetail" component={OptionDetail} />
      <Stack.Screen name="Submited" component={Submited} />

      <Stack.Screen name="Futures" component={Futures} />
      <Stack.Screen name="InformationScreen" component={InformationScreen} />
      <Stack.Screen name="Deposit" component={Deposit} />
      <Stack.Screen name="PaymentWebView" component={PaymentWebView} />

      <Stack.Screen name="Withdrawal" component={Withdrawal} />

      <Stack.Screen name="VerifyNumberScreen" component={VerifyNumberScreen} />
      <Stack.Screen name="TabVarificationPin" component={TabVarificationPin} />
      <Stack.Screen name="WellDone" component={WellDone} />

      <Stack.Screen name="TabSecurity" component={TabSecurity} />
      <Stack.Screen name="TabChangePassword" component={TabChangePassword} />
      <Stack.Screen name="SecurityWellDone" component={SecurityWellDone} />
      <Stack.Screen name="EnterOldPinScreen" component={EnterOldPinScreen} />
      <Stack.Screen name="EnterNewPinScreen" component={EnterNewPinScreen} />
      <Stack.Screen
        name="SecurityConformPinScreen"
        component={SecurityConformPinScreen}
      />
      <Stack.Screen name="SecurityForgotPin" component={SecurityForgotPin} />
      <Stack.Screen
        name="SecurityEmailVarification"
        component={SecurityEmailVarification}
      />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      {/* <Stack.Screen
        name="SeeAll"
        component={SeeAll}
      /> */}
      <Stack.Screen name="BankDetails" component={BankDetails} />
      <Stack.Screen name="MatualFundsScreen" component={MatualFundsScreen} />
      <Stack.Screen
        name="AllMatualFundScreen"
        component={AllMatualFundScreen}
      />
      <Stack.Screen name="FilterShortScreen" component={FilterShortScreen} />
      <Stack.Screen
        name="AxisBankDetailsScreen"
        component={AxisBankDetailsScreen}
      />
      <Stack.Screen name="IpoScreen" component={IpoScreen} />
      <Stack.Screen name="BankIpoScreen" component={BankIpoScreen} />
      <Stack.Screen name="PriceAlertScreen" component={PriceAlertScreen} />
      <Stack.Screen
        name="SearchPriceAlertScreen"
        component={SearchPriceAlertScreen}
      />
      <Stack.Screen
        name="MarginCalculatorScreen"
        component={MarginCalculatorScreen}
      />
      <Stack.Screen name="ResearchScreen" component={ResearchScreen} />
      <Stack.Screen name="GoldBuyScreen" component={GoldBuyScreen} />
      <Stack.Screen name="SearchPage" component={SearchPage} />
    </Stack.Navigator>
  );
};

export default MainStack;

const styles = StyleSheet.create({});
