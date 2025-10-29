import { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native';
import Appheader from '../../component/AppHeader/appheader';
import Loader from '../../component/Loader/Loader';
import checkNonEmpty from '../../utils/checkNonEmpty';
import { fetchOptionChain } from '../../utils/getNse';
import OptionChainTabel from './OptionChainTabel';
import { styles } from './styles';
const OPtionChain = ({ navigation, route }) => {
  const symbol = route?.params?.symbol;
  const resuly = symbol.replace(/\..*/, '');
  // console.log(`symbol ${resuly}`);
  const indexes = ['NIFTY', 'FINNIFTY', 'BANKNIFTY', 'MIDCPNIFTY'];
  const number = -10;
  const textColor = number < 0 ? 'red' : 'green';

  const [date, setDate] = useState(new Date());
  const firstSymbol = 'Choose symbol';
  const [initialSymbols, setInitialSymbols] = useState([firstSymbol]);
  const [symbols, setSymbols] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState(resuly);
  const [instrumentData, setInstrumentData] = useState({});
  const isInitialRender = useRef(true);
  const [selected, setSelected] = useState('');
  // const getSymbols = async () => {
  //   try {
  //     const res = await fetch(
  //       `https://option-chain-data.onrender.com/symbols`,
  //       {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       },
  //     );

  //     if (!res.ok) {
  //       throw new Error(`HTTP error! Status: ${res.status}`);
  //     }

  //     const data = await res.json();
  //     return data;
  //   } catch (error) {
  //     console.error('Error fetching symbol list:', error);
  //   }
  // };

  const getSymbols = async () => {
    try {
      const res = await fetch(`https://option-chain-data.onrender.com/symbols`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const text = await res.text();

      const data = JSON.parse(text);
      return data;

    } catch (error) {
      console.error('Error fetching symbol list:', error);
    }
  };




  const getInstrumentData = async (instrument, type) => {
    try {

      // console.log("mee---->>>",instrument,symbol)
      // const res = await fetch(
      //   // `https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY`,
      //   `http://192.168.1.14:5000/market/chain?index=${instrument}`,
      //   // `https://option-chain-data.onrender.com/chain?${type}=${instrument}`,
      //   // `https://option-chain-data.onrender.com/chain?${type}=NIFTY`,

      //   {
      //     method: 'GET',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   },
      // );

      // if (!res.ok) {
      //   throw new Error(`HTTP error! Status: ${res.status}`);
      // }

      // const data = await res.json();
      // console.log("resss",data)

      const result = await fetchOptionChain(symbol);
      // setData(result);

      return result;
    } catch (error) {
      console.error('Error fetching index or symbol detail:', error);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true)
      const instrumentRes = await getInstrumentData(
        selectedInstrument,
        'index',
      );
      setLoading(false)
      setInstrumentData(instrumentRes);

      const res = await getSymbols();
      setInitialSymbols([...res]);
      setSymbols([firstSymbol, ...res]);
      // console.log('symbols :>> ', res);
    })();
  }, []);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    (async () => {
      const isIndexSelected = indexes.includes(selectedInstrument);
      if (isIndexSelected) {
        setSymbols([firstSymbol]);
      }
      setLoading(true)
      const instrumentRes = await getInstrumentData(
        selectedInstrument,
        isIndexSelected ? 'index' : 'symbol',
      );
      setLoading(false)
      setInstrumentData(instrumentRes);
      // it is written again to reset the symbol if index is selected
      if (isIndexSelected) {
        setSymbols([firstSymbol, ...initialSymbols]);
      }
    })();
  }, [selectedInstrument]);
  const [loading, setLoading] = useState(false);

  // console.log("instrumentData?.records",instrumentData?.records)
  return (

    <SafeAreaView style={styles.container}>
      
      <Appheader onPress={() => navigation.goBack()} header="Option Chain" />
      {/* <HorizontalSeperator /> */}
      {/* <HorizontalSeperator /> */}
      {loading ? (
        <Loader loading={loading} />
      ) : checkNonEmpty(instrumentData) ? (
        <OptionChainTabel
          symbol={resuly}
          data={instrumentData?.records}
          navigation={navigation}
        />
      ) : (
        <Loader />
      )}
    </SafeAreaView>
  );
};
export default OPtionChain;
