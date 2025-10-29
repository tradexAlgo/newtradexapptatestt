import React, { useEffect, useState, useCallback, useRef, memo } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Appheader from '../../component/AppHeader/appheader';
import axios from 'axios';
import { color } from '../../common/color';
import OptionChainComodity from '../../component/CustomModal/OptionChainComodity';
import { font } from '../../common/Font';
import { STOCK } from '../../utils/baseURL';
import DisplayShowDetails from '../../component/CustomModal/DisplayShowDetails';
import SearchableDataList from '../../component/CustomSearchview/SearchableDataList';

const MCX = ({ navigation }: any) => {
  const [commodityArray, setCommodityArray] = useState([]);
  const staticExpDates = {
    COPPER: '21AUG2024',
    CRUDEOIL: '14AUG2024',
    CRUDEOILM: '14AUG2024',
    GOLD: '24SEP2024',
    GOLDM: '27AUG2024',
    NATGASMINI: '23AUG2024',
    NATURALGAS: '23AUG2024',
    SILVER: '27AUG2024',
    SILVERM: '21AUG2024',
    ZINC: '21AUG2024',
  } as any;
  const [commodity, setCommodity] = useState('');
  const [exp, setExp] = useState('');
  const [marketData, setMarketData] = useState<any[]>([]);
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [selectedExpiry, setSelectedExpiry] = useState('21AUG2024');
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [iscolor, setIsColor] = useState('');
  const [rePrice, setRePrice] = useState('');
  const [istext, setIsText] = useState('BUY');
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [commodityData, setCommodityData] = useState<any>(null);
  const [isOptionShow, setIsOption] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [liveData, setLiveData] = useState();

  // Function to handle item selection
  const handleItemSelect = (selectedItem: any) => {
    // You can do whatever you need with the selected item data
    // Alert.alert('Selected Item', JSON.stringify(selectedItem, null, 2));
    // You can also navigate to another screen or pass this data to a parent component
    // {"asmGsmVal": "", "currencyCode": "INR", "exInstType": 30, "exSeries": "XX", "exSymName": "GOLD25JUNFUT", "exSymbol": "GOLD", "exToken": 435697, "exchange": 11, "exchangeName": "MCX", "expiryDate": "1749146400", "faceValue": 0, "fyToken": "1120250605435697", "is_mtf_tradable": 0, "isin": "", "lastUpdate": "2024-08-06", "lowerPrice": 0, "minLotSize": 1, "mtf_margin": 0, "optType": "XX", "originalExpDate": "1749146400", "previousClose": 67893, "previousOi": 0, "qtyFreeze": "", "qtyMultiplier": 100, "segment": 20, "stream": "", "strikePrice": -1, "symDetails": "GOLD 25 Jun 05 FUT", "symTicker": "MCX:GOLD25JUNFUT", "symbolDesc": "GOLD 25 Jun 05 FUT", "tickSize": 1, "tradeStatus": 1, "tradingSession": "0900-2330|1815-1915:", "underFyTok": "1120000000114", "underSym": "GOLD", "upperPrice": 0}
    setCommodityData(selectedItem)
    setSelectedCommodity(selectedItem?.exSymName)
    setPayload({ symbols: [selectedItem?.symTicker] });

    fetchMarketData({ symbols: [selectedItem?.symTicker] })
    console.log(selectedItem)

  };
  const symbols = [
    "HG=F",   // Copper
    "CL=F",   // Crude Oil
    "B0=F",   // Crude Oil Mini
    "GC=F",   // Gold
    "MGC=F",  // Gold Mini
    "NG=F",   // Natural Gas
    "NG=F",   // Natural Gas (Same as above; only one symbol for Natural Gas)
    "SI=F",   // Silver
    "SIL=F",  // Silver Mini
    "ZN=F"    // Zinc
  ];
  // [69334, 431978, 40, 296209, 182986, 139841, 139841, 97008, 29186, 4152095]

  const commodities = ['COPPER', 'CRUDEOIL', 'CRUDEOILM', 'GOLD', 'GOLDM', 'NATGASMINI', 'NATURALGAS', 'SILVER', 'SILVERM', 'ZINC'];

  const baseURL = "https://query1.finance.yahoo.com/v8/finance/chart/";
  const [volume, setVolumes] = useState(null) as any;
  const fetchSymbolData = async (symbol: any) => {
    try {
      const response = await fetch(`${baseURL}${symbol}`);
      const data = await response.json();
      // Extract the regularMarketVolume
      const regularMarketVolume = data.chart.result[0].meta.regularMarketVolume;
      return regularMarketVolume;
    } catch (error) {
      //////console.error('Error fetching data:', error);
      return null;
    }
  };
  const [price, setPrice] = useState(0) as any;

  const fetchAllSymbolsData = async () => {
    const promises = symbols.map(fetchSymbolData);
    const volumes = await Promise.all(promises);
    return volumes;
  };



  // useEffect(() => {
  //   let commodity =''
  //   let exp =''
  //   if(liveData){
  //      commodity = extractBeforeNumber(liveData?.[0]?.v?.short_name);
  //     exp = staticExpDates[commodity];
  //     setCommodity(commodity);
  //     setExp(exp);
  //     // callApi(commodity,exp);
  //   }

  //   // fetchCommodityData();

  //   const interval = setInterval(() => callApi(commodity, exp), 5000);
  //   return () => clearInterval(interval);
  // }, [liveData]);

  const apiCall = async (url: string, data: any) => {
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      //console.log(response)
      return response.data;
    } catch (error) {
      //console.error('Error in API call:', error);
      throw error;
    }
  };
  const extractBeforeNumber = (str: any) => {
    if (typeof str !== 'string') return '';

    // Regular expression to match all characters before the first number
    const match = str.match(/^[^\d]*/);
    return match ? match[0] : '';
  };



  const onRefresh = useCallback(() => {
    setRefreshing(true);

    if (liveData) {
      const commodity = extractBeforeNumber(liveData?.[0]?.v?.short_name);
      const exp = staticExpDates[commodity];

      setCommodity(commodity);
      setExp(exp);
      // callApi(commodity,exp);
    }

  }, [selectedExpiry]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleBuySell = (option: any, action: 'BUY' | 'SELL') => {
    setSelectedOption(option);
    setPrice(action === 'BUY' ? option.CE_LTP : option.PE_LTP);
    setIsColor(action === 'BUY' ? color.color_darkblue : color.color_red);
    setIsText(action);
    setModalVisible(true);
  };

  const getTextStyle = (value: number | string | null) => {
    if (value === null || value === undefined) return {};
    const numericValue = parseFloat(value as string);
    return numericValue > 0
      ? { color: 'green' }
      : numericValue < 0
        ? { color: 'red' }
        : {};
  };



  const renderItem = ({ item }: { item: any }) => (
    <View style={tableStyles.row}>
      <TouchableOpacity onPress={() => handleBuySell(item, 'BUY')} style={tableStyles.cellContainer}>
        <Text style={tableStyles.cell}>
          {item.CE_LTP ?? 'N/A'} <Text style={[tableStyles.smallText, getTextStyle(item.CE_AbsoluteChange)]}>  {item.CE_AbsoluteChange ?? 'N/A'}</Text>
        </Text>
      </TouchableOpacity>
      <Text style={tableStyles.cell}>{item.CE_StrikePrice ?? 'N/A'}</Text>
      <TouchableOpacity onPress={() => handleBuySell(item, 'SELL')} style={tableStyles.cellContainer}>
        <Text style={tableStyles.cell}>
          {item.PE_LTP ?? 'N/A'} <Text style={[tableStyles.smallText, getTextStyle(item.PE_AbsoluteChange)]}>  {item.PE_AbsoluteChange ?? 'N/A'}</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );


  const [payload, setPayload] = useState(null); // State to manage payload
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);


  //IMPR
  const fetchMarketData = async (payload:any) => {
    if (!payload) {
      return;
    }
    try {
      setLoading(true);
      console.log("payload - ", payload,payload?.symbols)
      if(payload?.symbols === undefined){
        return
      }
      const response = await axios.post(STOCK.GET_QOUTES, payload);
      console.log(response)
      if (response.data.code === 200 && response.data.status) {
        //console.log('Data:', response.data.data.d); // Handle the data as needed
        setLiveData(response.data.data.d)
        console.log("chek", liveData?.[0]?.v?.lp)
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   // Set up polling every 1 second (1000 ms) or 2 seconds (2000 ms)
  //   intervalRef.current = setInterval(fetchMarketData, 10000); // Adjust to 2000 for 2 seconds

  //   // Clean up interval on component unmount
  //   return () => clearInterval(intervalRef.current);
  // }, [commodityData]); 


  // Simulate payload update (for demonstration purposes)
  // useEffect(() => {
  //   // Example payload update (replace with actual logic)
  //   const timer = setTimeout(() => {
  //     setPayload({ symbols: [commodityData?.symTicker] });
  //   }, 1000); // Simulate payload availability after 5 seconds

    // Clean up timer
  //   return () => clearTimeout(timer);
  // }, [commodityData?.symTicker]);



  // Define the fetchMarketData function to accept a parameter


useEffect(() => {
  // Define a function that will call fetchMarketData with a specific value
  const intervalFunc = () => fetchMarketData(payload);

  // Set up polling every 1 second (1000 ms) or 2 seconds (2000 ms)
  intervalRef.current = setInterval(intervalFunc, 10000); // Adjust to 2000 for 2 seconds

  // Clean up interval on component unmount
  return () => clearInterval(intervalRef.current);
}, [commodityData]); // Dependencies here


  console.log("selected Commodity ---- ", commodityData?.symTicker)

  const getPriceChangeText = (lp: any, open_price: any) => {
    const change = lp - open_price;
    const percentChange = ((change / open_price) * 100).toFixed(2);
    const color = change > 0 ? 'green' : 'red';
    // Return the text with color styling
    return (
      <Text style={[{
        fontSize: 16,
        fontWeight: 'bold',
      }, { color }]}>
        {`${change.toFixed(2)} (${percentChange}%)`}
      </Text>
    );
  };



  return (
    <ScrollView style={styles.container}>
      <Appheader onPress={() => navigation.goBack()} header="MCX Market" />

      <SearchableDataList
        apiUrl="https://public.fyers.in/sym_details/MCX_COM_sym_master.json"
        searchKey="exSymbol"
        displayFields={[
          { key: 'symTicker', label: 'Symbol Ticker' },
          // { key: 'symbolDesc', label: 'Description' },
          { key: 'expiryDate', label: 'Expiry Date', format: (value) => new Date(value * 1000).toLocaleDateString() },
          { key: 'symTicker', label: 'Symbol Ticker' }
          // Added symTicker to display fields
        ]}
        onItemSelect={handleItemSelect}
      />

      {commodityData && liveData && <View>
        {/* The ommodity details... */}
        <Text style={[styles.headerText, { color: 'black', fontWeight: '600' }]}>{commodityData?.exSymName}</Text>
        <Text style={[styles.headerText, { fontSize: 12, color: color.Default_TEXT, marginTop: 10 }]}>{commodityData?.symTicker} · {commodityData?.exchangeName}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>

          {liveData && (
            <Text style={[styles.headerText, { fontSize: 20, color: color.Default_TEXT, fontWeight: 'bold' }]}>{liveData[0]?.v?.lp ? liveData[0]?.v?.lp : ''}</Text>
          )}
          {liveData[0] && getPriceChangeText(liveData[0]?.v?.lp, liveData[0]?.v?.open_price)}
        </View>


        {liveData && <DisplayShowDetails data={liveData[0]?.v} />}

      </View>}

      {/* <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCommodity}
          style={styles.picker}
          onValueChange={(itemValue, index) => {
            setSelectedCommodity(itemValue)
            setRePrice(commodityArray[index]?.lastSpotPrice)
            setSelectedExpiry(commodityArray[index]?.expDate)
          }}
        >
          {commodityArray?.map((commodity) => (
            <Picker.Item key={commodity?.symbol} label={commodity?.symbol} value={commodity?.symbol} />
          ))}
        </Picker>

      </View> */}
      {/* {error && <Text style={styles.errorText}>{error}</Text>} */}
      {/* <Text style={styles.headerText}>Price : {rePrice}</Text> */}
      {/* <Text style={styles.headerText}>Price - {marketData?.[0]?.UnderlyingValue}</Text> */}

      {commodityData && liveData && (
        <>
          <View style={styles.buttonmain}>
            <TouchableOpacity
              style={styles.buytext}
              onPress={() => {
                setIsColor(color.color_darkblue),
                  setModalVisible(true),
                  setIsText('BUY');
                setPrice(liveData[0]?.v?.lp);
                setIsColor(color.color_darkblue);
              }}>
              <Text style={styles.sametext}>BUY</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.selltext}
              onPress={() => {
                setIsColor(color.color_red),
                  setModalVisible(true),
                  setPrice(liveData[0]?.v?.lp);
                setIsText('SELL');
              }}>
              <Text style={styles.sametext}>SELL</Text>
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity
            style={{
              backgroundColor: color.FACEBOOK_BLUE,
              borderRadius: 100,
              marginHorizontal: 10,
              marginVertical: 15,
            }}
            onPress={() => {
              setIsOption(!isOptionShow)

            }
            }>
            <Text
              style={{
                color: color.color_white,
                fontFamily: font.nunitobold,
                fontSize: 18,
                padding: 10,
                textAlign: 'center',
              }}>
              Option Chain
            </Text>
          </TouchableOpacity> */}
     </> 
  )}



      {/* {isOptionShow &&(
          <View>
             <Picker
          selectedValue={selectedExpiry}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedExpiry(itemValue)}
        >
          {expiryDates.map((date) => (
            <Picker.Item key={date} label={date} value={date} />
          ))}
        </Picker> 
          </View>
      )} */}

      {/* {isOptionShow && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View style={tableStyles.tableContainer}>
            <View style={[tableStyles.row, tableStyles.header]}>
              <Text style={[tableStyles.headerCell, tableStyles.headerCell1]}>
                Call LTP <Text style={[tableStyles.headerCell, { fontSize: 10 }]}>{`\nAbsoluteChange`}</Text>
              </Text>
              <Text style={[tableStyles.headerCell, tableStyles.headerCell2]}>Strike Price</Text>
              <Text style={[tableStyles.headerCell, tableStyles.headerCell3]}>
                Put LTP <Text style={[tableStyles.headerCell, { fontSize: 10 }]}>{`\nAbsoluteChange`}</Text>
              </Text>
            </View>
            <FlatList
              data={marketData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={tableStyles.listContainer}
              initialNumToRender={10}
              windowSize={5}
            />
          </View>
        </ScrollView>
      )} */}


      <OptionChainComodity
        quantity={quantity}
        symbol={liveData?.[0]?.n}
        stockPrice={price}
        price={price}
        getQuantity={setQuantity}
        modalshow={isModalVisible}
        onPressClose={toggleModal}
        maincolor={iscolor}
        leadtext={istext}
        onPriceChange={price}
        commodityName={selectedCommodity}

      />
    </ScrollView>
  );
};

const tableStyles = StyleSheet.create({
  tableContainer: {
    width: '100%',
  },
  listContainer: {
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 20,
    fontFamily: font.nunitobold,
    color: color.color_black,
    textAlign: 'center',
    flex: 1,
    right: 35
  },
  header: {
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  cellContainer: {
    flex: 1,
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 10,
    fontSize: 14,
    textAlignVertical: 'center',
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: color.Default_TEXT,
  },
  headerCell1: {
    flex: 2,
  },
  headerCell2: {
    flex: 1,
  },
  headerCell3: {
    flex: 2,
  },
  smallText: {
    fontSize: 10,
    color: '#666',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  headerText: {
    fontSize: 16,
    fontFamily: font.nunitosemibold,
    color: color.color_green,
    textAlign: 'left',
    paddingHorizontal: 15
  },
  buttonmain: {
    flexDirection: 'row',
    paddingTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  buytext: {
    borderRadius: 100,
    backgroundColor: color.color_darkblue,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
    marginRight: 20,
  },
  selltext: {
    borderRadius: 100,
    backgroundColor: color.color_red,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  sametext: {
    color: color.color_white,
    fontFamily: font.nunitobold,
    fontSize: 19,
    textAlign: 'center',
  },
});

export default MCX;
