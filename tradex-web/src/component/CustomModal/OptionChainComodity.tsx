import React, { useState, useRef } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Pressable,
} from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './styles';
import { font } from '../../common/Font';
import { color } from '../../common/color';
import Cross from '../../../assets/svg/cross';
import Dropdown from '../../../assets/svg/dropdown';
import CustomDropDown from '../CustomDropDown/CustomDropDown';
import Loader from '../Loader/Loader';
import { useNavigation } from '@react-navigation/native';
import priceFormat from '../../utils/priceFormat';
import PostAPI from '../../api/PostAPI';
import Seperator from '../Seperator/Seperator';

const OptionChainCommodity = ({
    modalshow,
    onPressClose,
    maincolor,
    leadtext,
    commodity,
    price,
    getQuantity,
    quantity,
    onPriceChange,
    commodityName,
    symbol
}) => {
    const [stockType, setStockType] = useState('MKT');
    const [loader, setLoader] = useState(false);
    const dropDownRef = useRef();
    const navigation = useNavigation();

    const totalAmount = price * quantity;

    const handleTransaction = async () => {
        if (!quantity || quantity <= 0) {
            Alert.alert('Please select a valid quantity');
            return;
        }
        if (!price || price <= 0) {
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
                quantity,
                commodityPrice: price,
                stopLoss: null,
            };

            // console.log("chekckc", formdata)
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
        <Modal
            isVisible={modalshow}
            animationIn={'fadeInDown'}
            animationOut={'fadeInDown'}
            backdropColor={'black'}
            backdropOpacity={0.5}
            style={{ margin: 0 }}>
            <View
                style={{
                    backgroundColor: '#1e1e1e',
                    width: '90%',
                    alignSelf: 'center',
                    paddingVertical: 20,
                    paddingHorizontal: 15,
                    borderRadius: 15,
                }}>
                <TouchableOpacity
                    style={{ alignSelf: 'flex-end' }}
                    onPress={onPressClose}>
                    <Cross />
                </TouchableOpacity>

                <ScrollView>
                    <View style={styles.toptextview}>
                        <View style={styles.subview}>
                            <Text style={styles.modaltext}>{commodity}</Text>
                        </View>

                        <View style={styles.subview}>
                            <Text style={[styles.rupeemodal, { color: `${maincolor}` }]}>
                                ${priceFormat(price)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.horizontalline} />

                    <View style={styles.Quantityview}>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.QuantityText}>Quantity</Text>
                            <TextInput
                                keyboardType={'number-pad'}
                                onChangeText={getQuantity}
                                value={quantity.toString()}
                                placeholderTextColor={color.color_black}
                                style={styles.QuantitInput}
                            />
                        </View>

                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.QuantityText}>Investment</Text>
                            <TextInput
                                onChangeText={onPriceChange}
                                value={price?.toString() || 0}
                                editable={false}
                                style={styles.QuantityNumber}
                                keyboardType={'number-pad'}
                            />
                        </View>

                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.QuantityText}>Order Type</Text>
                            <Pressable
                                onPress={() => dropDownRef.current?.show()}
                                style={[
                                    styles.dropdownview,
                                    { backgroundColor: `${maincolor}` },
                                ]}>
                                <CustomDropDown
                                    ref={dropDownRef}
                                    onSelect={selectStockType}
                                    ModalValue={['MKT', 'LMT']}
                                    DefaultValue={'MKT'}
                                />
                                <Dropdown />
                            </Pressable>
                        </View>
                    </View>

                    <View style={styles.horizontalline} />

                    <View style={styles.modeview}>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.QuantityText}>Mode</Text>
                            <Seperator />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent:
                                        stockType === 'SL' ? 'space-between' : 'flex-start',
                                    width: '100%',
                                    gap: stockType === 'SL' ? 0 : 34,
                                }}>
                                <Text
                                    // onPress={() => setType('Options')}
                                    style={
                                        // type === 'Option'
                                            [styles.Intradaytext,{ fontSize: 12,alignItems:'center',width:120}]
                                            // : 
                                            // styles.Deliverytext
                                    }>
                                  {'Future Commodity'}  
                                </Text>
                            </View>
                        </View>

                        {/* <View style={{flexDirection: 'column'}}>
                <Text style={styles.QuantityText}>Validity</Text>
  
                <View
                  style={[
                    styles.dropdownview,
                    {backgroundColor: `${maincolor}`, marginTop: 10},
                  ]}>
                  <CustomDropDown
                    ModalValue={['DAY', 'SL', 'SLM']}
                    DefaultValue={'DAY'}
                  />
                  <Dropdown />
                </View>
              </View> */}
                    </View>

                    <TouchableOpacity
                        disabled={loader}
                        style={[styles.leadview, { backgroundColor: `${maincolor}` }]}
                        onPress={handleTransaction}>
                        {loader ? (
                            <Loader color={color.color_white} />
                        ) : (
                            <Text style={styles.leadtext}>{leadtext}</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    );
};

export default OptionChainCommodity;
