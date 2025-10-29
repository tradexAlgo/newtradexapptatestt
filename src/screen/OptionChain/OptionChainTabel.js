import React, { useEffect, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { color } from '../../common/color';
import { styles } from './styles';
import priceFormat from '../../utils/priceFormat';
import CalculatePercentage from '../../utils/CalculatePercentage';
const OptionChainTabel = ({ data, symbol, navigation }) => {
  const [date, setDate] = useState(data?.expiryDates[1]);
  const [groupedData, setGroupedData] = useState({});
  const [selectedData, setSelectedData] = useState([]);
  const expiryDates = data?.expiryDates;
  const [stockDetailModalVisible, setStockDetailModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);


  useEffect(() => {
    const groupByExpiryDate = (data) => {
      const result = {};
      data?.forEach(item => {
        const expiryDate = item.expiryDate;
        if (!result[expiryDate]) result[expiryDate] = [];
        result[expiryDate].push(item);
      });
      return result;
    };

    const grouped = groupByExpiryDate(data?.data);
    setGroupedData(grouped);
    setSelectedData(grouped[data?.expiryDates[0]]);
  }, []);
  useEffect(() => {
    if (!date) return;

    const timeout = setTimeout(() => {
      if (groupedData[date]) {
        setSelectedData(groupedData[date]);
      }
    }, 1200);

    return () => clearTimeout(timeout);
  }, [date, groupedData]);


  const handleChange = (value) => setDate(value);
  // console.log("checkkk the selected dat", selectedData)
  return (
    <>
      <Modal
        animationType="slide"
        visible={stockDetailModalVisible}
        onRequestClose={() => setStockDetailModalVisible(false)}
        transparent={true}
      >
        <TouchableWithoutFeedback onPress={() => setStockDetailModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <SafeAreaView style={{ backgroundColor: '#1e1e1e', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 10, maxHeight: '90%' }}>
                <ScrollView style={{ padding: 16 }}>

                  {/* Header */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                    <View style={{ marginBottom: 12 }}>
                      <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                        {selectedData?.shortName || selectedOption?.symbol}
                      </Text>
                      {/* <Text style={{ color: 'lightgray', marginTop: 4 }}>
                        {selectedData?.data} | {selectedData?.currency}
                      </Text> */}
                    </View>

                    <TouchableOpacity onPress={() => {
                      setStockDetailModalVisible(false)
                      navigation.navigate('ChartScreen', { symbol: selectedData?.symbol });
                    }} >

                      <Text style={{ color: color.color_bottomtab, fontSize: 14 }} >Chart 📈</Text>

                    </TouchableOpacity>
                  </View>

                  {/* Price Section */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Text style={{ fontSize: 22, color: '#00ff88' }}>
                      ₹{priceFormat(selectedOption?.price)}
                    </Text>
                    <Text style={{ color: '#00ff88' }}>
                      +{(selectedOption?.stock?.change)?.toFixed(2)} (
                      {CalculatePercentage({
                        initialValue: selectedOption?.stock?.bidprice,
                        finalValue: selectedOption?.price,
                      })}
                      %)
                    </Text>
                  </View>

                  {/* OHLC Data */}
                  {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View><Text style={styles.label}>OPEN</Text><Text style={styles.value}>{selectedData?.open}</Text></View>
                    <View><Text style={styles.label}>HIGH</Text><Text style={styles.value}>{selectedData?.regularMarketDayHigh}</Text></View>
                    <View><Text style={styles.label}>LOW</Text><Text style={styles.value}>{selectedData?.regularMarketDayLow}</Text></View>
                    <View><Text style={styles.label}>PREV. CLOSE</Text><Text style={styles.value}>{selectedData?.previousClose}</Text></View>
                  </View> */}




                </ScrollView>
                {/* stockData, action, expiryDate, optionType, identifier */}
                {/* Buy/Sell Footer Buttons */}
                <View style={styles.footer}>
                  <TouchableOpacity onPress={() => {
                    setStockDetailModalVisible(false)
                    navigation.navigate('OrderPlacementScreenOptionChain', {
                      stockData: selectedOption?.stockData,
                      selectedOption,
                      symbol,
                      action: 'BUY', // or 'SELL'
                      expiryDate: selectedOption?.expiryDate,
                      optionType: selectedOption?.optionChainType
                    });
                  }} style={styles.buyBtn}><Text style={styles.btnText}>BUY</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    // setStockDetailModalVisible(false)
                    // navigation.navigate('OrderPlacementScreenOptionChain', {
                    //   stockData: selectedData,
                    //   action: 'SELL', // or 'SELL'
                    // });
                    setStockDetailModalVisible(false)
                    navigation.navigate('OrderPlacementScreenOptionChain', {
                      stockData: selectedOption?.stockData,
                      selectedOption,
                      symbol,
                      action: 'SELL', // or 'SELL'
                      expiryDate: selectedOption?.expiryDate,
                      optionType: selectedOption?.optionChainType
                    });
                  }} style={styles.sellBtn}><Text style={styles.btnText}>SELL</Text></TouchableOpacity>
                </View>
              </SafeAreaView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>

        {/* <SelectList
          setSelected={handleChange}
          data={expiryDates}
          save="value"
          placeholder="Select Expiry"
          search={false}
          boxStyles={{
            backgroundColor: '#1a1a1a',
            borderColor: '#333',
            borderRadius: 8,
            marginBottom: 8,
            height: 40,
          }}
          dropdownStyles={{
            backgroundColor: '#1a1a1a',
            borderColor: '#333',
          }}
          inputStyles={{ color: '#fff', fontSize: 13 }}
          dropdownTextStyles={{ color: '#fff' }}
        /> */}
        <SelectList
          setSelected={handleChange}
          data={expiryDates}
          save="value"
          placeholder="Select Expiry"
          search={false}
          defaultOption={{ key: date, value: date }} // <-- this ensures selected value is shown
          boxStyles={{
            backgroundColor: '#1a1a1a',
            borderColor: '#333',
            borderRadius: 8,
            marginBottom: 8,
            height: 40,
          }}
          dropdownStyles={{
            backgroundColor: '#1a1a1a',
            borderColor: '#333',
          }}
          inputStyles={{ color: '#fff', fontSize: 13 }}
          dropdownTextStyles={{ color: '#fff' }}
        />

      </View>

      {/* Header row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#121212',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderTopWidth: 0.3,
          borderBottomWidth: 0.3,
          borderColor: '#333',
        }}>
        <Text style={{ flex: 1, color: '#aaa', fontSize: 12, textAlign: 'left' }}>Call LTP</Text>
        <Text style={{ flex: 1, color: '#aaa', fontSize: 12, textAlign: 'center' }}>Strike</Text>
        <Text style={{ flex: 1, color: '#aaa', fontSize: 12, textAlign: 'right' }}>Put LTP</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {selectedData?.map((row, idx) => (
          <View
            key={idx}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#1a1a1a',
              marginHorizontal: 12,
              paddingVertical: 10,
              borderBottomWidth: 0.4,
              borderColor: '#333',
              paddingHorizontal: 10,
              borderRadius: 1
            }}>
            {/* CE */}
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                // console.log("check the stock detai;slll", row?.CE)
                setSelectedOption({
                  symbol,
                  data: selectedData,
                  price: row?.CE?.lastPrice,
                  StrikePrice: row?.strikePrice,
                  expiryDate: row?.CE?.expiryDate,
                  identifier: row?.CE?.identifier,
                  stock: row?.CE,
                  optionChainType: 'CE',
                });
                setStockDetailModalVisible(true)


              }}>
              <Text style={{ fontSize: 13, color: '#fff' }}>{row?.CE?.lastPrice?.toFixed(2)}</Text>
              <Text style={{ fontSize: 11, color: row?.CE?.change < 0 ? 'red' : 'green' }}>
                {row?.CE?.change?.toFixed(2)}
              </Text>
            </TouchableOpacity>

            {/* Strike Price */}
            <View View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 13, fontWeight: '500', color: '#eee' }}>
                {row?.strikePrice}
              </Text>
            </View>

            {/* PE */}
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'flex-end' }}
              onPress={() =>
              {
                //   navigation.navigate('Optionchaindetail', {
                //   symbol,
                //   data: selectedData,
                //   price: row?.PE?.lastPrice,
                //   StrikePrice: row?.strikePrice,
                //   expiryDate: row?.PE?.expiryDate,
                //   identifier: row?.PE?.identifier,
                //   optionChainType: 'PE',
                // })
                // console.log("check the stock detai;slll", row?.CE)
                setSelectedOption({
                  symbol,
                  data: selectedData,
                  price: row?.PE?.lastPrice,
                  StrikePrice: row?.strikePrice,
                  expiryDate: row?.PE?.expiryDate,
                  identifier: row?.PE?.identifier,
                  stock: row?.PE,
                  optionChainType: 'PE',
                });
                setStockDetailModalVisible(true)
              }
              }>
              <Text style={{ fontSize: 13, color: '#fff' }}>{row?.PE?.lastPrice?.toFixed(2)}</Text>
              <Text style={{ fontSize: 11, color: row?.PE?.change < 0 ? 'red' : 'green' }}>
                {row?.PE?.change?.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View >
        ))}
      </ScrollView >
    </>
  );
};

export default OptionChainTabel;
