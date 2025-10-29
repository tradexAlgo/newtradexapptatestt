import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { styles } from './styles';
import { color } from '../../common/color';
import Appheader from '../../component/AppHeader/appheader';
import Dropdown from '../../../assets/svg/dropdown';
import PostAPI from '../../api/PostAPI';
import priceFormat from '../../utils/priceFormat';
import SimpleDropdown from '../../common/SimpleDropdown';
import Seperator from '../../component/Seperator/Seperator';
import Loader from '../../component/Loader/Loader';
import { showToast } from '../../common/ToastService';

const CommodityOrderPlacementScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const dropDownRef = useRef();

  const {
    maincolor,
    leadtext,
    commodity,
    symbol,
    commodityName,
    short_name,
  } = route.params || {};

  // console.log("routtttpram", route.params);


  const [stockType, setStockType] = useState('MKT');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState(Number(commodity) || 0);
  const [loader, setLoader] = useState(false);

  const totalAmount = Number(commodity) * Number(quantity);

  const handleTransaction = async () => {

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    // console.log("current ttttpi",price)


    // Market closes at 23:30 (11:30 PM)
    if (currentHour > 23 || (currentHour === 23 && currentMinute > 30)) {
      showToast('Market is Closed');
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      Alert.alert('Please select a valid quantity');
      return;
    }

    // console.log("chec price",price)
    if (!price || Number(price) <= 0) {
      Alert.alert('Please select a valid price');
      return;
    }

    try {
      const formdata = {
        commodityName,
        symbol,
        totalAmount,
        orderType: stockType,
        tradeType: 'commodity',
        quantity: Number(quantity),
        commodityPrice: commodity,
        stopLoss: null,
      };


      // console.log("chdk frommmdafta", formdata);

      setLoader(true);
      const response =
        leadtext === 'BUY'
          ? await PostAPI.buyCommodity(formdata)
          : await PostAPI.sellCommodity(formdata);
      setLoader(false);

      Alert.alert('Success!', response.message, [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      setLoader(false);
      Alert.alert('Error', error?.message || 'Something went wrong');
    }
  };

  const selectStockType = (index, item) => {
    setStockType(item);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f1115' }}>
      <Appheader onPress={() => navigation.goBack()} header="Commodity Order" />

      <ScrollView style={{ padding: 16 }}>
        {/* Commodity Header */}
        <Text style={{ color: '#00ff88', fontSize: 20, fontWeight: 'bold' }}>{short_name}</Text>
        <Text style={{ color: '#ccc', fontSize: 16, marginBottom: 10 }}>
          {symbol}
        </Text>
        <Text style={{ color: '#00ff88', fontSize: 18, marginBottom: 16 }}>
          ₹{priceFormat(commodity)}
        </Text>

        {/* Quantity Input */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#aaa' }}>Quantity</Text>
          <TextInput
            keyboardType="number-pad"
            value={quantity?.toString()}
            onChangeText={setQuantity}
            placeholder="Enter quantity"
            placeholderTextColor="#555"
            style={{
              backgroundColor: '#1c1e22',
              color: '#fff',
              borderRadius: 8,
              padding: 12,
              marginTop: 6,
            }}
          />
        </View>

        {/* Investment */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#aaa' }}>Investment</Text>
          <TextInput
            editable={false}
            value={priceFormat(totalAmount).toString()}
            style={{
              backgroundColor: '#1c1e22',
              color: '#fff',
              borderRadius: 8,
              padding: 12,
              marginTop: 6,
              textAlign: 'center',
            }}
          />
        </View>

        {/* Order Type */}
        {/* <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#aaa' }}>Order Type</Text>
          <Pressable
            onPress={() => dropDownRef.current?.show()}
            style={[
              styles.dropdownview,
              {
                backgroundColor: `${maincolor}`,
                marginTop: 8,
                padding: 12,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
            ]}>
            <SimpleDropdown
              ref={dropDownRef}
              onSelect={selectStockType}
              style={{width:'100%'}}
              ModalValue={['MKT', 'LMT']}
              DefaultValue={'MKT'}
            />
            <Dropdown />
          </Pressable>
        </View> */}
        <Pressable
          onPress={() => dropDownRef.current?.show()}
          style={{
            backgroundColor: maincolor,
            marginTop: 8,
            padding: 12,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <SimpleDropdown
            ref={dropDownRef}
            ModalValue={['MKT', 'LMT']}
            DefaultValue={'MKT'}
            onSelect={selectStockType}
          />
          <Dropdown />
        </Pressable>



        {/* Mode Info */}
        <View style={{ marginVertical: 20 }}>
          <Text style={styles.QuantityText}>Mode</Text>
          <Seperator />
          <Text
            style={{
              color: '#fff',
              fontSize: 14,
              marginTop: 10,
              paddingVertical: 6,
              backgroundColor: '#1c1e22',
              paddingHorizontal: 10,
              borderRadius: 6,
              width: 160,
              textAlign: 'center',
            }}>
            Future Commodity
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          disabled={loader}
          onPress={handleTransaction}
          style={{
            backgroundColor: maincolor,
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 32,
          }}>
          {loader ? (
            <Loader color={color.color_white} />
          ) : (
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {leadtext}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CommodityOrderPlacementScreen;
