import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Pressable,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {styles} from './styles';
import {font} from '../../common/Font';
import {color} from '../../common/color';
import Modal from 'react-native-modal';
import Cross from '../../../assets/svg/cross';

import Dropdown from '../../../assets/svg/dropdown';
import CustomSwitch from '../CustomSwitch/CustomSwitch';
import CustomDropDown from '../CustomDropDown/CustomDropDown';
import {useNavigation} from '@react-navigation/native';
import priceFormat from '../../utils/priceFormat';
import PostAPI from '../../api/PostAPI';
import Seperator from '../Seperator/Seperator';
import Loader from '../Loader/Loader';
import {useDispatch} from 'react-redux';
import {userProfile} from '../../redux/slice/AuthSlice';
import {
  getMyStocks,
  getStockHistory,
  getWatchList,
} from '../../redux/slice/StockDataSlice';
import { showToast } from '../../common/ToastService';

const CustomSellModal = ({
  modalshow,
  onPressClose,
  maincolor,
  leadtext,
  symbol,
  price,
  percentage,
  getQuantity,
  quantity,
  onPriceChange,
  stockPrice,
}) => {
  const [focus, setFocus] = useState(true);
  const navigation = useNavigation();
  const [stopLoss, setStopLoss] = useState(0);
  const [target, setTarget] = useState(false);
  const [stockType, setStockType] = useState('MKT');
  const [type, setType] = useState('DELIVERY');
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const dropDownRef = useRef();

  const totalAmount = priceFormat(price * quantity);

  const buy = async () => {
    if (!quantity) {
      showToast('Please select a quantity');
      return;
    }
    if (!price) {
      showToast('Please select a price');
      return;
    }
    if (stockType === 'SL' && !stopLoss) {
      showToast('Please select a stop loss');
      return;
    }
    try {
      let formdata;

      formdata =
        stockType === 'SL'
          ? {
              stockName: symbol,
              symbol,
              totalAmount: Number(price * quantity),
              stockType,
              type,
              quantity,
              stockPrice: price,
              stopLoss,
              expiryDate:'',
              optionType:'',
              identifier:'',
            }
          : {
              stockName: symbol,
              symbol,
              totalAmount: Number(price * quantity),
              stockType,
              type,
              quantity,
              stockPrice: price,
              expiryDate:'',
              optionType:'',
              identifier:'',
            };
      setLoader(true);
      // console.log("payllllllllll",formdata)
      const response =
        leadtext === 'BUY'
          ? await PostAPI.buyStock(formdata)
          : await PostAPI.sellStock(formdata);
      setLoader(false);
      dispatch(userProfile({navigation}));
      dispatch(getWatchList({navigation}));
      dispatch(getMyStocks({navigation}));
      dispatch(getStockHistory({navigation}));
      showToast(response.message);
      navigation.goBack();
      // Alert.alert('Success!', response.message, [
      //   {
      //     text: 'OK',
      //     onPress: () => navigation.goBack(),
      //   },
      // ]);
    } catch (error) {
      setLoader(false);
      showToast('Error placing order');
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
      backdropColor={color.color_black}
      backdropOpacity={0.5}
      style={{margin: 0}}>
      <View
        style={{
          backgroundColor: color.color_white,
          width: '90%',
          alignSelf: 'center',
          paddingVertical: 20,
          paddingHorizontal: 15,
          borderRadius: 15,
        }}>
        <TouchableOpacity
          style={{alignSelf: 'flex-end'}}
          onPress={onPressClose}>
          <Cross />
        </TouchableOpacity>

        <ScrollView>
          <View style={styles.toptextview}>
            <View style={styles.subview}>
              <Text style={styles.modaltext}>{symbol}</Text>
              {/* <View style={styles.nseview}>
                <Text
                  style={[
                    styles.nseText,
                    {
                      color: !focus ? color.color_black : color.color_white,
                      backgroundColor: focus ? `${maincolor}` : '#C6C6C6',
                    },
                  ]}
                  onPress={() => setFocus(!false)}>
                  NSE
                </Text>
                <Text
                  style={[
                    styles.nseText,
                    {
                      color: focus ? color.color_black : color.color_white,
                      backgroundColor: focus ? '#C6C6C6' : `${maincolor}`,
                    },
                  ]}
                  onPress={() => setFocus(!true)}>
                  BSE
                </Text>
              </View> */}
            </View>

            <View style={styles.subview}>
              <Text style={[styles.rupeemodal, {color: `${maincolor}`}]}>
                ${priceFormat(stockPrice)}
              </Text>
              <View style={styles.precentageview}>
                <Text style={styles.baracketmodal}>(</Text>
                <Text style={[styles.percentagemodal, {color: `${maincolor}`}]}>
                  {percentage}%
                </Text>
                <Text style={styles.baracketmodal}>)</Text>
              </View>
            </View>
          </View>

          <View style={styles.horizontalline} />

          <View style={styles.Quantityview}>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.QuantityText}>Quantity</Text>
              <TextInput
                keyboardType={'number-pad'}
                onChangeText={getQuantity}
                value={quantity}
                placeholderTextColor={color.color_black}
                style={styles.QuantitInput}
              />
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.QuantityText}>Investment</Text>

              <TextInput
                onChangeText={text => onPriceChange(text)}
                value={totalAmount}
                editable={stockType !== 'MKT'}
                style={styles.QuantityNumber}
                keyboardType={'number-pad'}
              />
              {/* ${totalAmount} */}
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.QuantityText}>Order</Text>

              <Pressable
                onPress={() => {
                  if (dropDownRef?.current) {
                    dropDownRef?.current?.show();
                  }
                }}
                style={[
                  styles.dropdownview,
                  {backgroundColor: `${maincolor}`},
                ]}>
                <CustomDropDown
                  ref={dropDownRef}
                  onSelect={selectStockType}
                  ModalValue={['MKT', 'LMT', 'SL']}
                  DefaultValue={'MKT'}
                />
                <Dropdown />
              </Pressable>
            </View>
          </View>

          <View style={styles.modeview}>
            <View style={{flexDirection: 'column'}}>
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
                  onPress={() => setType('INTRADAY')}
                  style={
                    type === 'INTRADAY'
                      ? styles.Intradaytext
                      : styles.Deliverytext
                  }>
                  INTRADAY
                </Text>

                <Text
                  onPress={() => setType('DELIVERY')}
                  style={
                    type === 'DELIVERY'
                      ? styles.Intradaytext
                      : styles.Deliverytext
                  }>
                  DELIVERY
                </Text>
                {stockType === 'SL' && (
                  <View style={{flexDirection: 'column'}}>
                    {/* <Text style={styles.QuantityText}>Quantity</Text> */}
                    <TextInput
                      onChangeText={setStopLoss}
                      value={stopLoss}
                      placeholder="Stop Loss"
                      style={styles.QuantitInput}
                    />
                  </View>
                )}
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
          {/* {stockType === 'SL' && (
            <>
              <View style={styles.horizontalline} />
              <View style={{flexDirection: 'row', marginTop: 15}}>
                <Text style={styles.Stoploss}>Set Stoploss</Text>

                <CustomSwitch
                  onValueChange={() => setTarget(!target)}
                  value={target}
                  MainColor={maincolor}
                />
              </View>
            </>
          )}
          {(stockType === 'SL' || stockType === 'LMT') && (
            <>
              <View style={styles.horizontalline} />

              <View style={{flexDirection: 'row', marginTop: 15}}>
                <Text style={[styles.Stoploss, {paddingRight: 40}]}>
                  Set target
                </Text>

                <CustomSwitch
                  onValueChange={() => setStopLoss(!stopLoss)}
                  value={stopLoss}
                  MainColor={maincolor}
                />
              </View>
            </>
          )} */}

          <View style={styles.horizontalline} />

          <TouchableOpacity
            disabled={loader}
            style={[styles.leadview, {backgroundColor: `${maincolor}`}]}
            onPress={buy}>
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

export default CustomSellModal;
