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
import { useSelector, useDispatch } from 'react-redux';
import { showToast } from '../../common/ToastService';
import { userProfile } from '../../redux/slice/AuthSlice';
import {
    getMyStocks,
    getWatchList,
    getStockHistory,
} from '../../redux/slice/StockDataSlice';
import priceFormat from '../../utils/priceFormat';

const OrderPlacementScreenOptionChain = ({ route, navigation }) => {
    const {
        stockData,
        action,
        expiryDate,
        optionType,
        identifier,
        selectedOption,
        symbol,
    } = route.params || {};

    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState(selectedOption?.price || 0);
    const [stockType, setStockType] = useState('MKT'); // MKT, LMT, SL
    const [stopLoss, setStopLoss] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const { userProfileData } = useSelector(state => state.auth);

    const totalAmount = priceFormat(price * quantity);

    const placeOrder = async () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        if (currentHour > 15 || (currentHour === 15 && currentMinute > 0)) {
            // Alert.alert('Market Closed', 'Orders cannot be placed after 3 PM');
            showToast('Orders cannot be placed after 3 PM');
            return;
        }
        if (!quantity) return Alert.alert('Please enter quantity');
        if (!price && stockType !== 'MKT') return Alert.alert('Please enter price');
        if (stockType === 'SL' && !stopLoss) return Alert.alert('Please enter stop loss');

        const formdata = {
            stockName: symbol,
            symbol: symbol,
            totalAmount: Number(price * quantity),
            stockType,
            type: action === 'BUY' ? 'DELIVERY' : 'INTRADAY',
            quantity,
            stockPrice: selectedOption?.price,
            stopLoss: stockType === 'SL' ? stopLoss : undefined,
            expiryDate: expiryDate || '',
            optionType: optionType || '',
            identifier: selectedOption?.identifier || '',
            stockDataFrom: 'NSE',
        };

        try {
            setLoading(true);
            const response =
                action === 'BUY'
                    ? await PostAPI.buyStock(formdata)
                    : await PostAPI.sellStock(formdata);
            setLoading(false);

            dispatch(userProfile({ navigation }));
            dispatch(getWatchList({ navigation }));
            dispatch(getMyStocks({ navigation }));
            dispatch(getStockHistory({ navigation }));

            showToast(response?.message);
            navigation.goBack();
        } catch (error) {
            setLoading(false);
            showToast("Error placing order");
            // Alert.alert('Error', error?.message || 'Something went wrong');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0f1115' }}>
            <Appheader onPress={() => navigation.goBack()} header="" />
            <ScrollView style={{ padding: 16 }}>
                {/* Header Info */}
                <Text style={{ color: '#00ff88', fontSize: 20, fontWeight: 'bold' }}>
                    {stockData?.shortName}
                </Text>
                <Text style={{ color: '#ccc', fontSize: 14 }}>
                    {symbol} | {selectedOption?.expiryDate}
                </Text>
                <Text style={{ color: '#00ff88', fontSize: 16, marginTop: 4 }}>
                    ₹{selectedOption?.price} ({action})
                </Text>

                {/* Order Type: MKT / LMT / SL */}
                <View style={{ flexDirection: 'row', marginVertical: 16 }}>
                    {['MKT', 'LMT', 'SL'].map(typeVal => (
                        <TouchableOpacity
                            key={typeVal}
                            onPress={() => setStockType(typeVal)}
                            style={{
                                flex: 1,
                                backgroundColor: stockType === typeVal ? color.color_green : '#1c1e22',
                                padding: 12,
                                marginLeft: typeVal !== 'MKT' ? 8 : 0,
                                borderRadius: 8,
                                alignItems: 'center',
                            }}>
                            <Text style={{ color: '#fff' }}>{typeVal}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Quantity Input */}
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ color: '#aaa' }}>Quantity</Text>
                    <TextInput
                        value={quantity}
                        onChangeText={setQuantity}
                        keyboardType="numeric"
                        placeholder="0"
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
                        value={totalAmount}
                        editable={false}
                        style={{
                            backgroundColor: '#1c1e22',
                            borderRadius: 6,
                            color: '#fff',
                            padding: 10,
                            textAlign: 'center',
                        }}
                    />
                </View>

                {/* Stop Loss Input */}
                {stockType === 'SL' && (
                    <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: '#aaa' }}>Stop Loss</Text>
                        <TextInput
                            value={stopLoss}
                            onChangeText={setStopLoss}
                            keyboardType="numeric"
                            placeholder="Enter stop loss"
                            placeholderTextColor="#555"
                            style={{
                                backgroundColor: '#1c1e22',
                                color: '#fff',
                                borderRadius: 8,
                                padding: 12,
                            }}
                        />
                    </View>
                )}

                {/* Mode Display */}
                <View
                    style={{
                        marginBottom: 16,
                        padding: 12,
                        backgroundColor: '#1c1e22',
                        borderRadius: 8,
                    }}>
                    <Text style={{ color: '#aaa' }}>Mode</Text>
                    <Text style={{ color: '#fff' }}>
                        {optionType === 'PE' ? 'Put Option' : 'Call Option'}
                    </Text>

                    <Text style={{ color: '#aaa', marginTop: 10 }}>Brokerage Fee</Text>
                    <Text style={{ color: '#fff' }}>
                        ₹{userProfileData?.commision ?? '0.00'}
                    </Text>
                </View>

                {/* Submit Button */}
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
            </ScrollView>
        </SafeAreaView>
    );
};

export default OrderPlacementScreenOptionChain;
