import React, { useEffect } from 'react';
import { InteractionManager, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Image,
} from 'react-native';
// import WatchlistStack from '../Watchlist/WatchlistStack';
// import OrderScreen from '../Order/OrderScreen';
import PortfolioScreen from '../Portfolio/PortfolioScreen';
import FundScreen from '../Fund/FundScreen';
import { font } from '../../common/Font';
import { color } from '../../common/color';
import Watchlist from '../../../assets/svg/watchlist';
import Order from '../../../assets/svg/order';
import Portfolio from '../../../assets/svg/portfolio';
import Fund from '../../../assets/svg/fund';
import { styles } from './styles';
import Usertab from '../../../assets/svg/usertab';
import AccountStack from '../Account/AccountStack';
import DrawerRoutes from '../Drawer/DrawerRoutes';
import DrawerOrder from '../Drawer/DrawerOrder';
import DrawerPortFolio from '../Drawer/DrawerPortFolio';
import { useDispatch } from 'react-redux';
import { userProfile } from '../../redux/slice/AuthSlice';
import BookMark from '../../../assets/Image/bookmark.png';
import ORDER from '../../../assets/Image/order-delivery.png';
import STOCK from '../../../assets/Image/stock.png';

import {
  getMyCommodities,
  getMyStocks,
  getStockHistory,
  getWatchList,
} from '../../redux/slice/StockDataSlice';

const Tabstack = ({ navigation }) => {
  const Tab = createBottomTabNavigator();
  const dispatch = useDispatch();

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      dispatch(userProfile({ navigation }));
      dispatch(getWatchList({ navigation }));
      dispatch(getMyStocks({ navigation }));
      dispatch(getMyCommodities({ navigation }));
      dispatch(getStockHistory({ navigation }));
    });
  }, []);

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.color_primary_green,
        tabBarInactiveTintColor: color.color_bottominactive,
        tabBarLabelStyle: {
          fontWeight: '400',
          fontSize: 10,
          fontFamily: font.nunitoregular,
        },
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}>
      <Tab.Screen
        name="DrawerRoutes"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ opacity: 1 }}>

              <Image style={{
                height: 25, width: 25, tintColor: focused
                  ? color.color_primary_green
                  : color.color_bottominactive
              }} source={BookMark} resizeMode='' />
              {/* <Watchlist
                active={
                  focused
                    ? color.color_primary_green
                    : color.color_bottominactive
                }
              /> */}
            </View>
          ),
          tabBarLabel: ({ focused }) =>
            // focused ? (
            <Text
              style={{
                fontSize: 10,
                color: focused
                  ? color.color_primary_green
                  : color.color_bottominactive,
              }}>
              Watchlist
            </Text>
          // ) : null,
        }}
        component={DrawerRoutes}
      />
      <Tab.Screen
        name="DrawerPortFolio"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ opacity: 1 }}>

              <Image style={{
                height: 25, width: 25, tintColor: focused
                  ? color.color_primary_green
                  : color.color_bottominactive
              }} source={STOCK} resizeMode='' />
              {/* <Watchlist
                active={
                  focused
                    ? color.color_primary_green
                    : color.color_bottominactive
                }
              /> */}
            </View>
          ),
          tabBarLabel: ({ focused }) =>
            // focused ? (
            <Text
              style={{
                fontSize: 10,
                color: focused
                  ? color.color_primary_green
                  : color.color_bottominactive,
              }}>
              Portfolio
            </Text>
          // ) : null,
        }}
        component={DrawerPortFolio}
      />

      <Tab.Screen
        name="DrawerOrder"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ opacity: 1 }}>
              {/* <Order
                active={
                  focused
                    ? color.color_primary_green
                    : color.color_bottominactive
                }
              /> */}
              <Image style={{
                height: 25, width: 25, tintColor: focused
                  ? color.color_primary_green
                  : color.color_bottominactive
              }} source={ORDER} resizeMode='' />
            </View>
          ),
          tabBarLabel: ({ focused }) =>
            // focused ? (
            <Text
              style={{
                fontSize: 10,
                color: focused
                  ? color.color_primary_green
                  : color.color_bottominactive,
              }}>
              Order
            </Text>
          // ) : null,
        }}
        component={DrawerOrder}
      />
      {/* <Tab.Screen
        name="DrawerPortFolio"
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{opacity: 0.5}}>
              <Portfolio
                active={
                  focused
                    ? color.color_primary_green
                    : color.color_bottominactive
                }
              />
            </View>
          ),
          tabBarLabel: ({focused}) =>
            focused ? (
              <Text
                style={{
                  fontSize: 10,
                  color: focused
                    ? color.color_primary_green
                    : color.color_bottominactive,
                }}>
                Portfolio
              </Text>
            ) : null,
        }}
        component={DrawerPortFolio}
      /> */}
      <Tab.Screen
        name="FundScreen"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ opacity: 1 }}>
              <Fund
                active={
                  focused
                    ? color.color_primary_green
                    : color.color_bottominactive
                }
              />
            </View>
          ),
          tabBarLabel: ({ focused }) =>
            // focused ? (
            <Text
              style={{
                fontSize: 10,
                color: focused
                  ? color.color_primary_green
                  : color.color_bottominactive,
              }}>
              Fund
            </Text>
          // ) : null,
        }}
        component={FundScreen}
      />

      <Tab.Screen
        name="AccountStack"
        options={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <View style={{ opacity: 1 }}>
              <Usertab
                active={
                  focused ? color.color_primary_green : color.color_bottominactive
                }
              />
            </View>
          ),
          tabBarLabel: ({ focused }) =>
            // focused ? (
            <Text
              style={{
                fontSize: 10,
                color: focused
                  ? color.color_primary_green
                  : color.color_bottominactive,
              }}>
              Account
            </Text>
          // ) : null,
        })}
        component={AccountStack}
      />
    </Tab.Navigator>
  );
};

export default Tabstack;
