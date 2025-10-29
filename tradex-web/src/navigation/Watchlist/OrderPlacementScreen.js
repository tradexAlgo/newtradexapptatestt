import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    ScrollView,
    Alert,
} from 'react-native';
import Appheader from '../../component/AppHeader/appheader';
import { color } from '../../common/color';
import PostAPI from '../../api/PostAPI';
import { useSelector } from 'react-redux';
import { showToast } from '../../common/ToastService';
const OrderPlacementScreen = ({ route, navigation }) => {
    const { stockData, action } = route.params || {};
    const [lots, setLots] = useState('');
    const [price, setPrice] = useState(stockData?.regularMarketPrice || 0);
    const [orderType, setOrderType] = useState('LIMIT');
    const { userProfileData, userProfileDataFailed } = useSelector(
        state => state.auth,
    );


    const [type, setType] = useState('DELIVERY'); // Mode
    const [stockType, setStockType] = useState('MKT'); // Order Type (MKT / LMT / SL)
    const [stopLoss, setStopLoss] = useState('');
    const [loading, setLoading] = useState(false);

    const lotSize = 1; // Static for now, you can make dynamic

    const handleKeypadPress = (val) => {
        setLots(prev => prev + val);
    };

    const handleDelete = () => {
        setLots(prev => prev.slice(0, -1));
    };

    const placeOrder = async () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        if (currentHour > 15 || (currentHour === 15 && currentMinute >= 30)) {
            showToast('Market is Closed');
            return;
        }


        if (!lots) {
            Alert.alert('Please enter number of lots');
            return;
        }

        if (!price && stockType !== 'MKT') {
            Alert.alert('Please enter a price');
            return;
        }

        if (stockType === 'SL' && !stopLoss) {
            Alert.alert('Please enter stop loss value');
            return;
        }

        const quantity = parseInt(lots) * lotSize;
        const totalAmount = Number(price * quantity);
        // const broker = Number(userProfileData?.commision)
        // const totalAmount = amount + broker
        // console.log("stockkkkdata", stockData)
        // return
        let formdata =
            stockType === 'SL'
                ? {
                    stockName: stockData?.symbol,
                    symbol: stockData?.symbol,
                    totalAmount,
                    stockType,
                    type,
                    quantity,
                    stockPrice: price,
                    stopLoss,
                    expiryDate: '',
                    optionType: '',
                    identifier: '',
                }
                : {
                    stockName: stockData?.symbol,
                    symbol: stockData?.symbol,
                    totalAmount,
                    stockType,
                    type,
                    quantity,
                    stockPrice: price,
                    expiryDate: '',
                    optionType: '',
                    identifier: '',
                };

        try {

            // console.log("formdatapayload", formdata)
            setLoading(true);
            const response =
                action === 'BUY'
                    ? await PostAPI.buyStock(formdata)
                    : await PostAPI.sellStock(formdata);
            setLoading(false);

            showToast(response.message)
            navigation.goBack()

            // Alert.alert('Success!', response.message, [
            //     { text: 'OK', onPress: () => navigation.goBack() },
            // ]);
        } catch (error) {
            setLoading(false);
            showToast('Something went wrong')
            // Alert.alert('Error', error?.message || 'Something went wrong');
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0f1115' }}>
            <Appheader
                onPress={() => navigation.goBack()}
                header={''}
            />
            <ScrollView style={{ padding: 16 }} >

                {/* Header */}
                <Text style={{ color: '#00ff88', fontSize: 20, fontWeight: 'bold' }}>{stockData?.shortName}</Text>
                <Text style={{ color: '#ccc', fontSize: 14 }}>
                    {stockData?.symbol} | {stockData?.expiry}
                </Text>
                <Text style={{ color: '#00ff88', fontSize: 16, marginTop: 4 }}>
                    ₹{stockData?.regularMarketPrice} ({action})
                </Text>

                {/* Order Type */}
                {/* <View style={{ flexDirection: 'row', marginVertical: 16 }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: orderType === 'CARRY' ? '#00b894' : '#1c1e22',
                            padding: 12,
                            borderRadius: 8,
                            alignItems: 'center',
                        }}
                        onPress={() => setOrderType('CARRY')}>
                        <Text style={{ color: '#fff' }}>CARRY FORWARD</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: orderType === 'INTRADAY' ? '#00b894' : '#1c1e22',
                            padding: 12,
                            marginLeft: 8,
                            borderRadius: 8,
                            alignItems: 'center',
                        }}
                        onPress={() => setOrderType('INTRADAY')}>
                        <Text style={{ color: '#fff' }}>INTRADAY</Text>
                    </TouchableOpacity>
                </View> */}
                <View style={{ flexDirection: 'row', marginVertical: 16 }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: type === 'DELIVERY' ? '#00b894' : '#1c1e22',
                            padding: 12,
                            borderRadius: 8,
                            alignItems: 'center',
                        }}
                        onPress={() => setType('DELIVERY')}>
                        <Text style={{ color: '#fff' }}>DELIVERY</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: type === 'INTRADAY' ? '#00b894' : '#1c1e22',
                            padding: 12,
                            marginLeft: 8,
                            borderRadius: 8,
                            alignItems: 'center',
                        }}
                        onPress={() => setType('INTRADAY')}>
                        <Text style={{ color: '#fff' }}>INTRADAY</Text>
                    </TouchableOpacity>
                </View>


                {/* Lot Input */}
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ color: '#aaa' }}>No. of Lots</Text>
                    <TextInput
                        value={lots}
                        placeholder="0"
                        onChangeText={(num) => {
                            setLots(num)
                            if (num >= 1) {
                                setPrice(num * stockData?.regularMarketPrice)
                            } else {
                                setPrice(0)
                            }
                        }}
                        keyboardType="numeric"
                        placeholderTextColor="#555"
                        style={{
                            backgroundColor: '#1c1e22',
                            color: '#fff',
                            borderRadius: 8,
                            padding: 12,
                            marginTop: 6,
                        }}
                    />
                    <Text style={{ color: '#555', marginTop: 4 }}>1 Lot Size = {lotSize}</Text>
                </View>

                {/* Limit Price */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    {/* <TouchableOpacity
                        onPress={() => setPrice(p => (p - 0.05).toFixed(2))}
                        style={{ padding: 10, backgroundColor: '#1c1e22', borderRadius: 6 }}>
                        <Text style={{ color: '#fff' }}>-</Text>
                    </TouchableOpacity> */}

                    <TextInput
                        value={price?.toString()}
                        editable={false}
                        keyboardType="numeric"
                        onChangeText={(val) => setPrice(val)}
                        style={{
                            flex: 1,
                            marginHorizontal: 10,
                            backgroundColor: '#1c1e22',
                            borderRadius: 6,
                            color: '#fff',
                            padding: 10,
                            textAlign: 'center',
                        }}
                    />

                    {/* <TouchableOpacity
                        onPress={() => setPrice(p => (parseFloat(p) + 0.05).toFixed(2))}
                        style={{ padding: 10, backgroundColor: '#1c1e22', borderRadius: 6 }}>
                        <Text style={{ color: '#fff' }}>+</Text>
                    </TouchableOpacity> */}
                </View>

                {/* LIMIT / MARKET toggle */}
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                    <TouchableOpacity
                        onPress={() => setOrderType('LIMIT')}
                        style={{
                            flex: 1,
                            backgroundColor: orderType === 'LIMIT' ? color.color_green : '#1c1e22',
                            padding: 12,
                            borderRadius: 8,
                            alignItems: 'center',
                        }}>
                        <Text style={{ color: '#fff' }}>LIMIT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setOrderType('MARKET')}
                        style={{
                            flex: 1,
                            backgroundColor: orderType === 'MARKET' ? color.color_green : '#1c1e22',
                            padding: 12,
                            marginLeft: 8,
                            borderRadius: 8,
                            alignItems: 'center',
                        }}>
                        <Text style={{ color: '#fff' }}>MARKET</Text>
                    </TouchableOpacity>
                </View>

                {/* Order Summary */}
                <View
                    style={{
                        marginBottom: 16,
                        padding: 12,
                        backgroundColor: '#1c1e22',
                        borderRadius: 8,
                    }}>
                    <Text style={{ color: '#aaa' }}>Brokerage Fee</Text>
                    <Text style={{ color: '#fff' }}>{userProfileData?.commision ? `₹${userProfileData?.commision}` : `₹0.00`}</Text>
                    {/* 
                    <Text style={{ color: '#aaa' }}>Margin Required (Approx)</Text>
                    <Text style={{ color: '#fff' }}>₹0.00</Text>
{/* 
                    <Text style={{ color: '#aaa', marginTop: 12 }}>Available Margin</Text>
                    <Text style={{ color: '#fff' }}>₹0.18</Text> */}
                </View>

                {/* Place Order Button */}
                {/* <TouchableOpacity
                    style={{
                        backgroundColor: color.color_green,
                        padding: 16,
                        borderRadius: 8,
                        alignItems: 'center',
                        marginBottom: 24,
                    }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>PLACE {action} ORDER</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                    onPress={placeOrder}
                    disabled={loading}
                    style={{
                        backgroundColor: action === 'BUY' ? color.color_green : 'red',
                        padding: 16,
                        borderRadius: 8,
                        alignItems: 'center',
                        marginBottom: 24,
                    }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                        {loading ? 'Placing...' : `PLACE ${action} ORDER`}
                    </Text>
                </TouchableOpacity>


                {/* Numeric Keypad */}
                {/* <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {[...'123456789.0'].map((num, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => handleKeypadPress(num)}
              style={{
                width: '30%',
                marginVertical: 8,
                backgroundColor: '#1c1e22',
                padding: 16,
                borderRadius: 8,
                alignItems: 'center',
              }}>
              <Text style={{ color: '#fff', fontSize: 18 }}>{num}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={handleDelete}
            style={{
              width: '30%',
              backgroundColor: '#1c1e22',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              marginVertical: 8,
            }}>
            <Text style={{ color: '#fff', fontSize: 18 }}>⌫</Text>
          </TouchableOpacity>
        </View> */}
            </ScrollView>
        </SafeAreaView>
    );
};

export default OrderPlacementScreen;
