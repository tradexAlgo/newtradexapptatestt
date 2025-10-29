import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import priceFormat from '../utils/priceFormat';
import { color } from '../common/color';
import { styles } from '../navigation/Watchlist/styles';
import CalculateProfitLoss from '../utils/CalculateProfitLoss';
import moment from 'moment';

const StockItem = ({ item, onPress, selectedWatchlistName, getSymboleName, navigation }) => {
  const [prevPrice, setPrevPrice] = useState(item[0]?.data?.ltp || item[0]?.data?.lp || item?.regularMarketPrice);
  const [priceDirection, setPriceDirection] = useState(null); // "up" or "down"
  const blinkOpacity = useRef(new Animated.Value(1)).current;

  // Current price for both NSE & MCX
  const currentPrice = item[0]?.data?.ltp || item[0]?.data?.lp || item?.regularMarketPrice;

  // ---- Index Map ----
  const indexMap = [
    { name: 'NIFTY', symbol: '^NSEI' },
    { name: 'BANKNIFTY', symbol: '^NSEBANK' },
    { name: 'SENSEX', symbol: '^BSESN' },
    { name: 'MIDCAP', symbol: '^NSEMDCP50' },
  ];

  const getIndexNameBySymbol = (symbol) => {
    const match = indexMap.find(i => i.symbol === symbol);
    return match ? match.name : symbol;
  };

  // ---- Watch for price change ----
  useEffect(() => {
    if (prevPrice !== undefined && currentPrice !== undefined && prevPrice !== currentPrice) {
      // Set direction
      if (currentPrice > prevPrice) {
        setPriceDirection("up");
      } else {
        setPriceDirection("down");
      }

      // Trigger blink
      blinkOpacity.setValue(0.3);
      Animated.timing(blinkOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Update previous price
      setPrevPrice(currentPrice);
    }
  }, [currentPrice]);

  // ---- Colors ----
  const dynamicColor =
    priceDirection === "up"
      ? color.color_green
      : priceDirection === "down"
      ? color.color_red
      : "gray";

  const PriceBlock = ({ label, value }) => (
    <Animated.View
      style={{
        backgroundColor: dynamicColor,
        paddingHorizontal: 6,
        borderRadius: 4,
        opacity: blinkOpacity,
      }}
    >
      <Text style={{ color: 'white' }}>{label}: {priceFormat(value)}</Text>
    </Animated.View>
  );

  // ---- Handle press ----
  const handlePress = async (itm) => {
    if (selectedWatchlistName === 'OPTION CHAIN') {
      let sy = await getSymboleName(itm?.symbol);
      navigation.navigate('OptionChain', { symbol: sy });
      return;
    }
    onPress(itm.symbol);
  };

  return (
    <View style={{
      backgroundColor: '#1c1c1e',
      borderRadius: 12,
      padding: 12,
      marginVertical: 6,
      elevation: 4,
      shadowColor: '#ffffff20',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      alignItems: 'center',
    }}>
      <View style={{ padding: 10 }}>
        {item?.currency ? (
          // ---------- For NSE / Index ----------
          <TouchableOpacity
            onPress={() => handlePress(item)}
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View style={styles.textContainer}>
              <Text style={[styles.bankName, { color: 'white' }]}>
                {getIndexNameBySymbol(item?.symbol)}
              </Text>
              <Text style={[styles.nse, { color: 'white' }]}>NSE</Text>
            </View>

            <View style={styles.priceContainer}>
              <Animated.View
                style={{
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  opacity: blinkOpacity,
                }}
              >
                <Text style={[styles.price, { color: dynamicColor }]}>
                  {priceFormat(currentPrice)}
                </Text>
              </Animated.View>

              <View style={styles.resultContainer}>
                {item?.previousClose ? (
                  <Text style={[styles.price, { color: dynamicColor }]}>
                    {(
                      ((currentPrice - item?.previousClose) / item?.previousClose) *
                      100
                    ).toFixed(2)}%
                  </Text>
                ) : (
                  CalculateProfitLoss({
                    initialValue: item?.previousClose,
                    finalValue: currentPrice,
                  })
                )}
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          // ---------- For MCX / Commodities ----------
          <TouchableOpacity
            onPress={() => {
              const extractedSymbol = item[0]?.data?.symbol;
              handlePress({ symbol: extractedSymbol });
            }}
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View style={{ position: 'absolute' }}>
              {item[0]?.lastUpdated && (
                <Animated.View style={{ opacity: blinkOpacity }}>
                  <Text style={{ color: 'white', fontSize: 10, top: -15 }}>
                    Updated: {moment(item[0].lastUpdated).format('HH:mm:ss')}
                  </Text>
                </Animated.View>
              )}
            </View>

            <View>
              <Text style={{ color: 'white' }}>
                {(item[0]?.data?.symbol || '').split(':').pop()}
              </Text>
              <Text style={{ color: 'white' }}>
                {item[0]?.data?.symbol?.toUpperCase()?.startsWith("NSE") ? "NSE" : "MCX"}
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Animated.View
                style={{
                  backgroundColor: dynamicColor,
                  paddingHorizontal: 8,
                  borderRadius: 4,
                  opacity: blinkOpacity,
                }}
              >
                <Text style={{ color: 'white' }}>{priceFormat(currentPrice)}</Text>
              </Animated.View>

              <Text style={{ color: dynamicColor, marginTop: 2 }}>
                {/* {item[0]?.data?.pc ? item[0]?.data?.pc.toFixed(2) : ''}% */}
                ({item[0]?.data?.chp.toFixed(2)}%)
              </Text>

              <View style={{ flexDirection: 'row', marginTop: 4, gap: 10 }}>
                <PriceBlock label="L" value={item[0]?.data?.low_price} />
                <PriceBlock label="H" value={item[0]?.data?.high_price} />
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default StockItem;
