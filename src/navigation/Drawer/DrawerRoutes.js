import {View, Text} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import WatchlistScreen from '../Watchlist/WatchlistScreen';
import WatchlistPage from '../Watchlist/WatchlistPage';
import CustomSidebarMenu from '../CustomSideBarMenu.js/CustomSidebarMenu';
import SeeAll from '../../screen/SeeAll/SeeAll';
import OrderPlacementScreen from '../Watchlist/OrderPlacementScreen';
import ChartScreen from '../Watchlist/ChartScreen';
import OrderPlacementScreenOptionChain from '../Watchlist/OrderPlacementScreenOptionChain';
import CommodityOrderPlacementScreen from '../Watchlist/CommodityOrderPlacementScreen';

const DrawerRoutes = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator  drawerContent={props => <CustomSidebarMenu {...props} />}>
      <Drawer.Screen
        name="WatchlistScreen"
        component={WatchlistScreen}
        options={{headerShown: false}}
      />

       <Drawer.Screen
        name="WatchlistPage"
        component={WatchlistPage}
        options={{headerShown: false}}
      />
       <Drawer.Screen
        name="SeeAll"
        component={SeeAll}
        options={{headerShown: false}}
      />
     
       <Drawer.Screen
        name="OrderPlacementScreen"
        component={OrderPlacementScreen}
        options={{headerShown: false}}
      />
       <Drawer.Screen
        name="OrderPlacementScreenOptionChain"
        component={OrderPlacementScreenOptionChain}
        options={{headerShown: false}}
      />
       <Drawer.Screen
        name="CommodityOrderPlacementScreen"
        component={CommodityOrderPlacementScreen}
        options={{headerShown: false}}
      />
       <Drawer.Screen
        name="ChartScreen"
        component={ChartScreen}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerRoutes;
