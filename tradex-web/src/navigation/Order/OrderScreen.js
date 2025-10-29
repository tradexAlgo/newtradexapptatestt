import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { color } from '../../common/color';
import Drawer from '../../../assets/svg/drawer';
import CustomSearch from '../../component/CustomSearchview/CustomSearch';
import OrderTopTab from '../orderTopTab/OrderTopTab';
import { useDispatch } from 'react-redux';
import { changeTopTabStatus } from '../../redux/slice/StockDataSlice';

const OrderScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [focus, setFocus] = useState(1);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Drawer and Search */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => navigation.openDrawer()}
        >
          <Drawer />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('SearchPage')}
          style={styles.searchButton}
        >
          <CustomSearch editable={false} />
        </TouchableOpacity>
      </View>

    <View>
    <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        <TouchableOpacity
          onPress={() => {
            setFocus(1);
            dispatch(changeTopTabStatus(true));
          }}
          style={style.topTabView(focus === 1)}
        >
          <Text style={style.topTabText(focus === 1)}>Intraday</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setFocus(2);
            dispatch(changeTopTabStatus(false));
          }}
          style={style.topTabView(focus === 2)}
        >
          <Text style={style.topTabText(focus === 2)}>Delivery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setFocus(3);
            dispatch(changeTopTabStatus(false));
          }}
          style={style.topTabView(focus === 3)}
        >
          <Text style={style.topTabText(focus === 3)}>Options</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setFocus(4);
            dispatch(changeTopTabStatus(false));
          }}
          style={style.topTabView(focus === 4)}
        >
          <Text style={style.topTabText(focus === 4)}>Commodity</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>

      {/* Content Area */}
      <View style={styles.content}>
        <OrderTopTab focus={focus} />
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  topTabView: focus => ({
    width: 100, // Adjust width as needed
    borderBottomWidth: 2,
    borderBottomColor: focus ? color.color_green : color.color_gray,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 5, 
      backgroundColor:'black',
  }),
  topTabText: focus => ({
    color: focus ? color.color_green : color.color_white,
    fontSize: 14, // Adjust font size as needed
  }),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10, // Reduced padding
    alignItems: 'center',
    color:'white'
  },
  
  drawerButton: {
    paddingRight: 10, // Adjusted padding
  },
  searchButton: {
    flex: 1,
    marginLeft: 10, // Adjusted margin
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10, // Added horizontal padding
  },
  content: {
    flex: 1,
  },
});

export default OrderScreen;
