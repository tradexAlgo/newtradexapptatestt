import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import axios from 'axios';

import { color } from '../../common/color';
import OptimizedFlatlist from '../../component/OptimizedFlatlist.js/OptimizedFlatlist';
import GetAPI from '../../api/GetAPI';
import PostAPI from '../../api/PostAPI';
import { STOCK } from '../../utils/baseURL';
import priceFormat from '../../utils/priceFormat';
import SeperatorLine from '../../component/SeperatorLine';
import CustomAlert from '../../common/CustomAlert';
import { showToast } from '../../common/ToastService';

import {
  getMyCommodities,
  getMyStocks,
  getStockHistory,
  getWatchList,
} from '../../redux/slice/StockDataSlice';
import { userProfile } from '../../redux/slice/AuthSlice';

// ======= Memoized Row (prevents re-render unless props actually change) =======
const Row = React.memo(function Row({
  item,
  isLastItem,
  onPress,
  onSquareOff,
  onSquareOffCommodity,
}) {
  const isCommodity = !!item.commodityName;
  const statusColor = item.status === 'BUY' ? color.Default_GREEN : color.color_red;
  const profitLossColor = (item?.difference ?? 0) < 0 ? color.color_red : color.Default_GREEN;
  const profitLossColorC =
    (item?.stockDifferencePrice ?? 0) < 0 ? color.color_red : color.Default_GREEN;

  const orderDate = item.createdAt
    ? new Date(item.createdAt).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '';

  return (
    <Pressable
      onPress={() => onPress(item)}
      style={[
        styles.card,
        { marginBottom: isLastItem ? 100 : 12 },
      ]}
    >
      {/* Top line */}
      <View style={styles.topLine}>
        <View style={styles.topLeft}>
          <View style={[styles.badge, { backgroundColor: statusColor }]}>
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
          <Text style={styles.symbolText}>{item.symbol}</Text>
        </View>

        <TouchableOpacity
          onPress={() => (isCommodity ? onSquareOffCommodity(item) : onSquareOff(item))}
          disabled={item?.squareOff}
          style={[
            styles.squareBtn,
            { backgroundColor: item?.squareOff ? color.color_gray : color.color_darkblue },
          ]}
        >
          <Text style={{ color: item?.squareOff ? color.color_black : color.color_white, fontSize: 10 }}>
            {item?.squareOff ? 'Squared Off' : 'Square Off'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Qty + Order Price */}
      <View style={styles.rowBetween}>
        <Text style={styles.metaText}>
          {item.type?.toUpperCase()} : QTY {item.quantity}
        </Text>
        <Text style={styles.orderPriceText}>
          Order Price: {priceFormat(isCommodity ? item.commodityPrice : item.stockPrice)}
        </Text>
      </View>

      {/* Date + Active/Completed */}
      <View style={styles.rowBetween}>
        <Text style={styles.metaText}>{orderDate}</Text>
        <Text style={{ color: !item?.squareOff ? color.Default_GREEN : color.Default_GREY, fontSize: 12 }}>
          {item?.squareOff ? 'Completed' : 'Active'}
        </Text>
      </View>

      {/* P/L */}
      {!item?.squareOff ? (
        isCommodity ? (
          <Text style={[styles.plText, { color: profitLossColorC }]}>
            {(item?.stockDifferencePrice ?? 0) > 0 ? '+' : ''}
            {priceFormat(item?.stockDifferencePrice ?? 0)}
          </Text>
        ) : (
          <Text style={[styles.plText, { color: profitLossColor }]}>
            {(item?.difference ?? 0) > 0 ? '+' : ''}
            {priceFormat(item?.difference ?? 0)}
          </Text>
        )
      ) : (
        <Text
          style={[
            styles.plText,
            { color: (item?.netProfitAndLoss ?? 0) > 0 ? color.Default_GREEN : color.color_red },
          ]}
        >
          {(item?.netProfitAndLoss ?? 0) > 0 ? '+' : ''}
          {priceFormat(item?.netProfitAndLoss ?? 0)}
        </Text>
      )}
    </Pressable>
  );
});

const Equity = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { myStocks, myCommodities } = useSelector((state) => state.stockData);
  const { userProfileData } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);      // equities list for render
  const [commo, setCommo] = useState([]);    // commodities list for render
  const [stocks, setStocks] = useState([]);  // processed equities w/ P&L
  const [focus, setFocus] = useState(2);     // keep as-is (if you actually use elsewhere)
  const [todayPL, setTodayPL] = useState(0);
  const [todayPLc, setTodayPLc] = useState(0);
  const [loader, setLoader] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // live quotes cache (symbol -> ltp)
  const liveMapRef = useRef(new Map());
  const pollTimerRef = useRef(null);

  // ===== Focus updates (keep your original fetch-by-focus behavior) =====
  const changeFocus = useCallback(async (type) => {
    if (type === 1) {
      setFocus(1);
      // commodities tab — compute P&L using current liveMap
      const updated = await computeCommodityPL(myCommodities, liveMapRef.current);
      const innerData = updated.filter((x) => x.executed);
      setData(innerData);
      const total = innerData.reduce((acc, it) => acc + (it.stockDifferencePrice || 0), 0);
      setTodayPLc(total);
    }
    if (type === 2) {
      setFocus(2);
      dispatch(getMyStocks({ navigation }));
    }
  }, [dispatch, myCommodities, navigation]);

  // ===== Helpers =====
  const fetchMarketData = useCallback(async (symbols) => {
    if (!symbols?.length) return [];
    try {
      const payload = { symbols };
      const res = await axios.post(STOCK.GET_QOUTES, payload);
      if (res?.data?.status && Array.isArray(res?.data?.data)) {
        return res.data.data;
      }
    } catch (_) {}
    return [];
  }, []);

  const upsertLiveMap = useCallback((quoteArray) => {
    // Supports both shapes: { data: { lp/ltp }, n or symbol… }
    const map = liveMapRef.current;
    for (const q of quoteArray) {
      const sym = q?.n || q?.symbol || q?.data?.symbol;
      const ltp = q?.data?.lp ?? q?.data?.ltp ?? q?.v?.lp ?? q?.v?.ltp;
      if (sym && typeof ltp === 'number' && !Number.isNaN(ltp)) {
        map.set(sym, ltp);
      }
    }
  }, []);

  const computeCommodityPL = useCallback((list, liveMap) => {
    // one pass, pure, returns new array with stockDifferencePrice
    return list.map((item) => {
      if (!item?.symbol || !item?.commodityPrice || !item?.quantity) {
        return { ...item, stockDifferencePrice: 0 };
      }
      const ltp =
        liveMap.get(item.symbol) ??
        liveMap.get(item?.n) ??
        liveMap.get(item?.data?.symbol);
      const diff = ltp ? (ltp - item.commodityPrice) * item.quantity : 0;
      return { ...item, stockDifferencePrice: diff };
    });
  }, []);

  const computeEquityPL = useCallback(async (executedStocks) => {
    // fetch batched quotes for unique symbols not options (options handled via GetAPI)
    const normal = executedStocks.filter((s) => !(s?.optionType === 'CE' || s?.optionType === 'PE'));
    const opt = executedStocks.filter((s) => s?.optionType === 'CE' || s?.optionType === 'PE');

    // batch normal symbols
    const normalSymbols = Array.from(new Set(normal.map((s) => s.symbol).filter(Boolean)));
    const normalQuotes = await fetchMarketData(normalSymbols);
    upsertLiveMap(normalQuotes);

    // options: keep your existing call
    const optResults = await Promise.all(
      opt.map(async (s) => {
        try {
          const d = await GetAPI.getOptoinData({
            param: s?.symbol,
            optionType: s?.optionType,
            expiryDate: s?.expiryDate,
            identifier: s?.identifier,
          });
          const last = d?.lastPrice ?? d?.regularMarketPrice ?? 0;
          return { id: s._id, last };
        } catch {
          return { id: s._id, last: 0 };
        }
      })
    );
    const optMap = new Map(optResults.map((r) => [r.id, r.last]));

    // compute differences
    const updated = executedStocks.map((s) => {
      const marketPrice =
        s?.optionType === 'CE' || s?.optionType === 'PE'
          ? optMap.get(s._id) ?? 0
          : liveMapRef.current.get(s.symbol) ?? 0;

      const stockPrice = s.stockPrice ?? 0;
      const quantity = s.quantity ?? 0;
      const difference = (marketPrice - stockPrice) * quantity;
      return { ...s, lastPriceDifference: marketPrice, difference };
    });

    const total = updated
      .filter((x) => Number.isFinite(x.difference))
      .reduce((acc, x) => acc + x.difference, 0);

    setTodayPL(total);
    setStocks(updated);
  }, [fetchMarketData, upsertLiveMap]);

  // ===== Initial data load =====
  useEffect(() => {
    dispatch(getMyStocks({ navigation }));
    dispatch(getMyCommodities({ navigation }));
  }, [dispatch, navigation]);

  // ===== Recompute equities when myStocks changes =====
  useEffect(() => {
    const executed = (myStocks || []).filter((s) => s.executed);
    if (executed.length) {
      computeEquityPL(executed);
    } else {
      setStocks([]);
      setTodayPL(0);
    }
  }, [myStocks, computeEquityPL]);

  // ===== Live polling for commodities (batched symbols) =====
  useEffect(() => {
    // collect unique commodity symbols
    const symSet = new Set(
      (myCommodities || [])
        .filter((x) => x?.executed && x?.symbol)
        .map((x) => x.symbol)
    );
    const syms = Array.from(symSet);
    if (!syms.length) {
      setCommo([]);
      setTodayPLc(0);
      return;
    }

    const poll = async () => {
      const quotes = await fetchMarketData(syms);
      upsertLiveMap(quotes);

      const updated = computeCommodityPL(
        (myCommodities || []).filter((x) => x.executed),
        liveMapRef.current
      );
      setCommo(updated);

      const total = updated.reduce((acc, it) => acc + (it.stockDifferencePrice || 0), 0);
      setTodayPLc(total);
    };

    // start polling
    poll(); // immediate
    clearInterval(pollTimerRef.current);
    pollTimerRef.current = setInterval(poll, 2000);

    return () => {
      clearInterval(pollTimerRef.current);
    };
  }, [myCommodities, fetchMarketData, upsertLiveMap, computeCommodityPL]);

  // ===== Keep lists in local state for rendering when focus === 2 (your original logic) =====
  useEffect(() => {
    if (focus === 2) {
      setData(stocks);
    }
  }, [stocks, focus]);

  // ===== Square Off handlers =====
  const squareOff = useCallback((item) => {
    setSelectedItem(item);
    setShowAlert(true);
  }, []);

  const handleConfirmSquareOff = useCallback(async () => {
    setShowAlert(false);
    const item = selectedItem;
    if (!item) return;

    try {
      setLoader(true);
      if (!item?.identifier) {
        const resp = await GetAPI.getOneStockData({
          data: item?.stockName,
          formattedObj: false,
        });
        const formdata = {
          stockId: item._id,
          totalAmount: item?.totalAmount,
          stockPrice: item?.stockPrice,
          stockName: item?.stockName,
          latestPriceData: resp?.meta?.regularMarketPrice,
        };
        const r = await PostAPI.squareOff(formdata);
        showToast(r?.message || 'Squared off');
      } else {
        const result = await fetchOptionChain(item?.stockName);
        const optionData = result?.records?.data?.find((i) => i[item?.optionType]?.identifier === item?.identifier);
        if (!optionData) throw new Error('No option data found');
        const formdata = {
          stockId: item._id,
          totalAmount: item?.totalAmount,
          stockPrice: item?.stockPrice,
          stockName: item?.stockName,
          latestPriceData: optionData[item?.optionType].lastPrice,
        };
        const r = await PostAPI.squareOff(formdata);
        showToast(r?.message || 'Squared off');
      }

      dispatch(userProfile({ navigation }));
      dispatch(getWatchList({ navigation }));
      dispatch(getMyStocks({ navigation }));
      dispatch(getStockHistory({ navigation }));
    } catch (err) {
      showToast('Error squaring off position');
    } finally {
      setLoader(false);
    }
  }, [dispatch, navigation, selectedItem]);

  const squareOffCommodity = useCallback(
    (item) => {
      Alert.alert('Tradex Pro', 'Are you sure you want to square off your position?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              setLoader(true);
              // prefer cached LTP; if missing, fetch single
              let ltp = liveMapRef.current.get(item.symbol);
              if (typeof ltp !== 'number') {
                const q = await fetchMarketData([item.symbol]);
                upsertLiveMap(q);
                ltp = liveMapRef.current.get(item.symbol);
              }
              const formdata = {
                stockId: item._id,
                totalAmount: item?.totalAmount,
                stockPrice: item?.commodityPrice,
                latestPrice: ltp ?? 0,
              };
              const r = await PostAPI.squareOffCommodity(formdata);
              Alert.alert(r?.message || 'Squared off');
              dispatch(userProfile({ navigation }));
              dispatch(getWatchList({ navigation }));
              dispatch(getMyStocks({ navigation }));
              dispatch(getStockHistory({ navigation }));
              dispatch(getMyCommodities({ navigation }));
            } catch (e) {
              Alert.alert('Error squaring off');
            } finally {
              setLoader(false);
            }
          },
        },
      ]);
    },
    [dispatch, fetchMarketData, navigation, upsertLiveMap]
  );

  // ===== List data (sorted once via useMemo) =====
  const combinedSortedData = useMemo(() => {
    const arr = [...(data || []), ...(commo || [])];
    // avoid re-sort churn if empty
    if (!arr.length) return arr;
    return [...arr].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [data, commo]);

  // ===== Render item (memoized callbacks) =====
  const onPressRow = useCallback(
    (item) => {
      navigation.navigate('Details', { data: item });
    },
    [navigation]
  );

  const renderItemPosition = useCallback(
    ({ item, index }) => {
      const isLastItem = index === combinedSortedData.length - 1;
      return (
        <Row
          item={item}
          isLastItem={isLastItem}
          onPress={onPressRow}
          onSquareOff={squareOff}
          onSquareOffCommodity={squareOffCommodity}
        />
      );
    },
    [combinedSortedData.length, onPressRow, squareOff, squareOffCommodity]
  );

  const keyExtractor = useCallback((item) => `${item._id || item.symbol}-${item.createdAt}`, []);

  // ===== Refresh on focus =====
  useFocusEffect(
    useCallback(() => {
      dispatch(getMyStocks({ navigation }));
      dispatch(getMyCommodities({ navigation }));
    }, [dispatch, navigation])
  );

  // ===== UI =====
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      {/* Alert for Equity square off */}
      <CustomAlert
        visible={showAlert}
        onClose={() => setShowAlert(false)}
        onConfirm={handleConfirmSquareOff}
        message="Are you sure you want to square off your position?"
      />

      {combinedSortedData?.length ? (
        <OptimizedFlatlist
          style={{ marginBottom: '5%', marginTop: 20, backgroundColor: color.color_black }}
          contentContainerStyle={{ gap: 5 }}
          data={combinedSortedData}
          renderItem={renderItemPosition}
          keyExtractor={keyExtractor}
          initialNumToRender={14}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews
          getItemLayout={(_, index) => ({ length: 118, offset: 118 * index, index })} // row height ≈ card paddings
        />
      ) : (
        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <Text style={{ color: 'gray', fontSize: 16 }}>No data available</Text>
        </View>
      )}

      {/* Today P&L footer */}
      <View style={styles.footer}>
        <View style={styles.rowBetween}>
          <Text style={styles.footerLabel}>Today P&L</Text>
          <Text
            style={[
              styles.footerValue,
              { color: (todayPL + todayPLc) < 0 ? 'red' : 'green' },
            ]}
          >
            ₹{priceFormat((todayPL + todayPLc) || 0)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Equity;

// ===== Styles =====
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: color.color_black,
    borderRadius: 12,
    padding: 14,
    borderWidth: 0.5,
    borderColor: color.Default_GREY,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    color: color.color_white,
    fontSize: 12,
    fontWeight: '600',
  },
  symbolText: {
    color: color.color_white,
    fontSize: 14,
    fontWeight: '700',
  },
  squareBtn: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },
  metaText: {
    color: color.Default_GREY,
    fontSize: 12,
  },
  orderPriceText: {
    color: color.color_red_bg,
    fontSize: 12,
  },
  plText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#1a1a1a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
    borderColor: '#333',
  },
  footerLabel: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '500',
  },
  footerValue: {
    fontSize: 15,
    fontWeight: '600',
  },
});
