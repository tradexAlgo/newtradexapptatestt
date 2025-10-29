import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ColorPropType,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { styles } from './styles';
import { font } from '../../common/Font';
import { color } from '../../common/color';
import Drawer from '../../../assets/svg/drawer';
import CustomSearch from '../../component/CustomSearchview/CustomSearch';
import Portfoliotop from '../PortfolioTopTab/portfoliotop';
import priceFormat from '../../utils/priceFormat';
import { SafeAreaView } from 'react-native-safe-area-context';
const PortfolioScreen = ({ navigation }) => {




  const [topIndices, setTopIndices] = useState([]);


const indexSymbols = [
  // { name: 'SENSEX', symbol: 'SENSEX' },
  // { name: 'NIFTY', symbol: 'NIFTY' },
    { name: 'NSE:NIFTY25OCTFUT', symbol: 'NSE:NIFTY25OCTFUT' },
  { name: 'BANKNIFTY', symbol: 'BANKNIFTY' },
  { name: 'GOLD', symbol: 'GOLD' },
  { name: 'SILVER', symbol: 'SILVER' },

];


const getMarketIndicesData = async () => {
  try {
    const res = await fetch("https://backend-tradex.onrender.com/market/getQuotesV2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbols: indexSymbols.map(i => i.symbol)
      })
    });

    const json = await res.json();
    if (json.status && json.data) {
      return json.data.map((item) => {
        const meta = indexSymbols.find(s => s.symbol === item.symbol);
        const price = (item?.data?.ltp||item?.data?.lp) ?? 0;
        const change = item?.data?.ch ?? 0;
        return {
          name: meta?.name || item.symbol,
          price: parseFloat(price.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
        };
      });
    }
    return [];
  } catch (err) {
    console.error("Error fetching market indices:", err);
    return [];
  }
};

useEffect(() => {
  const loadIndices = async () => {
    const data = await getMarketIndicesData();
    setTopIndices(data);
  };

  loadIndices();
  const interval = setInterval(loadIndices, 2000); // refresh every 5 sec
  return () => clearInterval(interval);
}, []);


  const fetchIndexData = async (symbol) => {
    try {
      const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
      const json = await res.json();
      const chart = json.chart.result[0];
      const price = chart.meta.regularMarketPrice;
      const prev = chart.meta.previousClose;
      const change = price - prev;

      return { price, change };
    } catch (err) {
      console.error(`Failed to fetch index data for ${symbol}`, err);
      return null;
    }
  };

 

const prioritySymbols = ["NSE:NIFTY", "NSE:BANKNIFTY", "MCX:GOLD", "MCX:SILVER"];

const filteredTopIndices = prioritySymbols
  .map(sym => topIndices.find(item => item.name.startsWith(sym)))
  .filter(Boolean); // remove any that weren't found


  useEffect(() => {
    const loadIndices = async () => {
      const data = await getMarketIndicesData();
      setTopIndices(data);
    };
    loadIndices();
  }, []);
  return (
    <SafeAreaView
      // edges={['top']}
      style={{
        backgroundColor: 'black',
        flex: 1,
        // paddingVertical: 6,
        // paddingHorizontal: 10,
      }}
    // style={styles.container}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: 'black',
            paddingVertical: 6,
            paddingHorizontal: 10,
          }}
        >
           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{alignSelf:'center'}} >
                    {filteredTopIndices?.filter(item => item.price !== 0)?.map((item, index) => {
                      const isPositive = item.change >= 0;
                      const arrow = isPositive ? '▲' : '▼';
                      const changeColor = isPositive ? color.color_green : color.color_red;
          
                      return (
                        <View
                          key={index}
                          style={{
                            marginRight: 18,
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                          }}
                        >
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: '500',
                            }}
                          >
                             {item.name.replace(/^[A-Z]+:/, '') // remove exchange prefix
                        .replace(/\d.*$/, '')    // remove date & extra after numbers
            }
                          </Text>
                          <Text
                            style={{
                              color: changeColor,
                              fontSize: 11,
                              fontWeight: '600',
                            }}
                          >
                            {arrow} {priceFormat(item.price)}
                          </Text>
                        </View>
                      );
                    })}
                  </ScrollView>
        </View>
        <Portfoliotop />




      </View>
    </SafeAreaView>
  );
};

export default PortfolioScreen;
