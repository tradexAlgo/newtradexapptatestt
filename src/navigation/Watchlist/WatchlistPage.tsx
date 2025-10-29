import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Modal, ScrollView, Pressable } from 'react-native';
import Back from '../../../assets/svg/back';
import { getRequest, postRequest, baseURLExport, STOCK } from '../../utils/baseURL';
import { showToast } from '../../common/ToastService';

const WatchlistPage = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [userWatchlists, setUserWatchlists] = useState([]);
  const [userlist, setUserList] = useState([]);
  const [mcxFutures, setMcxFutures] = useState([]);

  const [optionsList, setOptionsList] = useState([]);
  const categories = ['NSE FUTURE', 'MCX FUTURE', 'OPTIONS'];

  const requiredSymbols = [
    'SILVERM', 'SILVERMIC', 'SILVER', 'CRUDEOILM', 'ZINC', 'LEAD', 'NATURALGAS', 'GOLDM'
  ];

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // BANKNIFTY_OPTIONS
        // Replace with your backend URL
        const res = await fetch(`${STOCK?.BANKNIFTY_OPTIONS}?atm=51500&range=500`);
        const data = await res.json();

        // console.log("Fetched BANKNIFTY options data:", data?.data);

        if (data?.status && Array.isArray(data.data)) {
          setOptionsList(data?.data); // symbols array
        } else {
          console.warn("No BANKNIFTY options returned", data);
        }
      } catch (err) {
        console.error("❌ Error fetching BANKNIFTY options:", err);
      }
    };

    fetchOptions();
  }, []);

  // console.log("optionsList", optionsList);

  // useEffect(() => {
  //   const fetchOptions = async () => {
  //     try {
  //       const res = await fetch("https://public.fyers.in/sym_details/NSE_FO_sym_master.json");
  //       const json = await res.json();

  //       const all = Object.values(json);

  //       // console.log("all options", all.length, all[0]);



  //       const optionSymbols = all.filter(
  //         o => o.underSym === "BANKNIFTY" && o.exInstType === 14
  //       );


  //       // console.log("optionSymbols", optionSymbols.length, optionSymbols[0]);
  //       if (!optionSymbols.length) return;

  //       // Nearest expiry
  //       const now = Math.floor(Date.now() / 1000);
  //       const nearestExpiry = [...new Set(optionSymbols.map(o => Number(o.expiryDate)))]
  //         .filter(exp => exp >= now)
  //         .sort((a, b) => a - b)[0];

  //       const currentExpiry = optionSymbols.filter(o => Number(o.expiryDate) === nearestExpiry);

  //       // ATM strike (closest to your range)
  //       const atm = 51500; // or dynamically detect LTP
  //       const strikes = currentExpiry.filter(
  //         o => Math.abs(o.strikePrice - atm) <= 1000
  //       );

  //       const formatted = strikes.map(o => ({
  //         symbol: o.exSymName,
  //         expiry: new Date(Number(o.expiryDate) * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
  //         name: `${o.optType} ${o.strikePrice}`
  //       }));

  //       // console.log("options formatted", formatted);
  //       setOptionsList(formatted);
  //     } catch (err) {
  //       console.error("Error loading options:", err);
  //     }
  //   };

  //   fetchOptions();
  // }, []);


  const nseFuturesBase = [
    { symbol: "NIFTY", name: "Nifty 50 Index" },
    { symbol: "BANKNIFTY", name: "Nifty Bank Index" },
    { symbol: "FINNIFTY", name: "Nifty Financial Services Index" },
    { symbol: "MIDCPNIFTY", name: "Nifty Midcap Select Index" },

    { symbol: "TATAMOTORS.NS", name: "Tata Motors Limited" },
    { symbol: "TATASTEEL.NS", name: "Tata Steel Limited" },
    { symbol: "RELIANCE.NS", name: "Reliance Industries Limited" },
    { symbol: "ITC.NS", name: "ITC Limited" },
    { symbol: "INFY.NS", name: "Infosys Limited" },
    { symbol: "TCS.NS", name: "Tata Consultancy Services Limited" },
    { symbol: "ICICIBANK.NS", name: "ICICI Bank Limited" },
    { symbol: "HDFCBANK.NS", name: "HDFC Bank Limited" },
    { symbol: "SBIN.NS", name: "State Bank of India" },
    { symbol: "BANKBARODA.NS", name: "Bank of Baroda" },
    { symbol: "ADANIPORTS.NS", name: "Adani Ports and Special Economic Zone Limited" },
    { symbol: "ADANIENT.NS", name: "Adani Enterprises Limited" },
    { symbol: "AMBUJACEM.NS", name: "Ambuja Cements Limited" },
    { symbol: "AXISBANK.NS", name: "Axis Bank Limited" },
    { symbol: "BAJFINANCE.NS", name: "Bajaj Finance Limited" },
    { symbol: "BPCL.NS", name: "Bharat Petroleum Corporation Limited" },
    { symbol: "BHARTIARTL.NS", name: "Bharti Airtel Limited" },
    { symbol: "INDUSINDBK.NS", name: "IndusInd Bank Limited" },
    { symbol: "LICI.NS", name: "Life Insurance Corporation of India" },
    { symbol: "SUNPHARMA.NS", name: "Sun Pharmaceutical Industries Limited" }
  ];


  // Calculate upcoming NSE expiry (last Thursday)
  const getUpcomingNseExpiry = () => {
    const today = new Date();
    let expiry = getLastThursday(today);

    // If expiry already passed, get last Thursday of next month
    if (expiry < today) {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      expiry = getLastThursday(nextMonth);
    }

    return expiry.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  function convertToFyersFutureSymbol(symbol, expiry) {
    const year = new Date().getFullYear().toString().slice(-2); // e.g., '25'
    const [day, mon] = expiry.split(" "); // e.g., "28 Oct"
    const monthCode = mon.toUpperCase();

    // Indexes (NIFTY, BANKNIFTY, etc.) don't have .NS
    if (!symbol.endsWith(".NS")) {
      return `NSE:${symbol}${year}${monthCode}FUT`;
    }

    // Stocks — remove ".NS"
    const base = symbol.replace(".NS", "");
    return `NSE:${base}${year}${monthCode}FUT`;
  }
  // Last Thursday of given month
  const getLastThursday = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const day = lastDay.getDay();
    const lastThursday = new Date(lastDay);
    lastThursday.setDate(lastDay.getDate() - ((day + 3) % 7));
    return lastThursday;
  };

  const upcomingExpiry = getUpcomingNseExpiry();

  const nseFutures = nseFuturesBase.map(item => ({
    ...item,
    symbol: convertToFyersFutureSymbol(item.symbol, upcomingExpiry),
    expiry: upcomingExpiry
  }));

  const getWatchlist = async () => {
    try {
      const response = await getRequest('/market/watchlists', {});
      // console.log("get WAtchlistResponse", response)
      const filtered = (response?.data || []).filter(item => item?.name);
      setUserWatchlists(filtered);
    } catch (error) {
      console.log("erroror of get watchlist", error)
    }
  };

  const getAllSymbolsByUser = async () => {
    try {
      const response = await getRequest('/market/watchlists/listbyuser', {});
      setUserList(response?.data || []);
      getWatchlist();
    } catch (error) { }
  };

  const addSymbolToWatchlist = async (symbol, id) => {
    try {
      const prefix = selectedCategory === 'MCX FUTURE' ? 'MCX:' : '';
      const payload = { watchlistId: id, symbol: `${prefix}${symbol}` };
      const response = await postRequest(`/market/watchlistst/symbol`, payload);
      // console.log("check is added", response);
      showToast(response?.data?.message || 'Symbol added to watchlist');
      getWatchlist();
    } catch (error) { }
  };

  const addSymbolToWatchlistOption = async (symbol, id) => {
    try {
      const prefix = selectedCategory === 'MCX FUTURE' ? 'MCX:' : 'NSE:';
      const payload = { watchlistId: id, symbol: `${prefix}${symbol}` };
      const response = await postRequest(`/market/watchlistst/symbol`, payload);
      // console.log("check is added", response);
      showToast(response?.data?.message || 'Symbol added to watchlist');
      getWatchlist();
    } catch (error) { }
  };

  useEffect(() => {
    getAllSymbolsByUser();
  }, []);

  useEffect(() => {
    const fetchFutures = async () => {
      try {
        const res = await fetch('https://public.fyers.in/sym_details/MCX_COM_sym_master.json');
        const json = await res.json();
        const grouped = {};
        Object.entries(json).forEach(([key, value]) => {
          if (value.exInstType !== 30) return;
          const symbol = value.exSymbol;
          const expiry = Number(value.expiryDate) * 1000;
          if (!grouped[symbol] || expiry < grouped[symbol].expiry) {
            grouped[symbol] = { symbol, expiry };
          }
        });
        const formatted = Object.values(grouped)
          .map(({ symbol, expiry }) => ({
            symbol,
            expiry: new Date(expiry).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          }))
          .filter(item => requiredSymbols.includes(item.symbol))
          .sort((a, b) => a.symbol.localeCompare(b.symbol));
        setMcxFutures(formatted);
      } catch (err) {
        console.error('Error loading MCX data:', err);
      }
    };
    fetchFutures();
  }, []);

  const renderCategoryView = () => (
    <>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ paddingTop: 10, paddingLeft: 15 }}
      >
        <Back />
      </TouchableOpacity>
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={styles.categoryText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </>
  );

  const renderList = (data) => {
    const filtered = data.filter(item =>
      item?.symbol?.toLowerCase().includes(search.toLowerCase()) ||
      (item.name && item.name.toLowerCase().includes(search.toLowerCase()))
    );
    return (
      <>
        <TouchableOpacity
          onPress={() => setSelectedCategory(null)}
          style={{ paddingTop: 10, paddingLeft: 15 }}
        >
          <Back />
        </TouchableOpacity>
        <TextInput
          placeholder="Search Symbol or Name"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <FlatList
          data={filtered}
          keyExtractor={(item, index) => item.symbol + index}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              {/* {console.log("ssssitem", item)} */}
              {/* {item.symbol} */}
              <Text style={[styles.symbolText, { width: '70%' }]}>
             {item.symbol} {item.name ? `- ${item.name}` : ''} ({item.expiry})
              </Text>
              <View style={{ borderRadius: 6, borderWidth: 1, borderColor: 'gray', padding: 4 }}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedSymbol(item.symbol);
                    setShowWatchlistModal(true);
                  }}
                  style={styles.addButton}
                >
                  <Text style={styles.addText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </>
    );
  };

  const renderListOption = (data) => {
    const filtered = data
      ?.map(item => {
        const symbol = item.replace(/^NSE:/i, ""); // remove 'NSE:' prefix
        return { original: item, symbol };
      })
      .filter(({ symbol }) =>
        symbol.toLowerCase().includes(search.toLowerCase())
      )
      .sort(({ symbol: a }, { symbol: b }) => {
        const searchLower = search.toLowerCase();
        const aStarts = a.toLowerCase().startsWith(searchLower);
        const bStarts = b.toLowerCase().startsWith(searchLower);

        // if a starts with search and b does not, a comes first
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return 0; // keep relative order otherwise
      })
      .map(item => item.original); // return original string

    return (
      <>
        <TouchableOpacity
          onPress={() => setSelectedCategory(null)}
          style={{ paddingTop: 10, paddingLeft: 15 }}
        >
          <Back />
        </TouchableOpacity>
        <TextInput
          placeholder="Search Symbol or Name"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <FlatList
          data={filtered}
          keyExtractor={(item, index) => item.symbol + index}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              {/* {console.log("ssssitem", item)} */}
              <Text style={[styles.symbolText, { width: '75%' }]}>
                {item}
                {/* {item.symbol} {item.name ? `- ${item.name}` : ''} ({item.expiry}) */}
              </Text>
              <View style={{ borderRadius: 6, borderWidth: 1, borderColor: 'gray', padding: 4 }}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedSymbol(item);
                    setShowWatchlistModal(true);
                  }}
                  style={styles.addButton}
                >
                  <Text style={styles.addText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      {/* {!selectedCategory
        ? renderCategoryView()
        : selectedCategory === 'MCX FUTURE'
          ? renderList(mcxFutures)
          : selectedCategory === 'NSE FUTURE'
            ? renderList(nseFutures)
            : null} */}

      {!selectedCategory
        ? renderCategoryView()
        : selectedCategory === 'MCX FUTURE'
          ? renderList(mcxFutures)
          : selectedCategory === 'NSE FUTURE'
            ? renderList(nseFutures)
            : selectedCategory === 'OPTIONS'
              ? renderListOption(optionsList)
              : null}
      <Modal
        visible={showWatchlistModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWatchlistModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ margin: 20, backgroundColor: 'black', borderRadius: 10, padding: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: 'white' }}>
              Select Watchlist
            </Text>
            <ScrollView>
              {userWatchlists.map((watchlist) => (
                <Pressable
                  key={watchlist._id}
                  style={{ paddingVertical: 10 }}
                  onPress={() => {
                    addSymbolToWatchlist(selectedSymbol, watchlist._id);
                    setShowWatchlistModal(false);
                    setSelectedSymbol(null);
                  }}
                >
                  <Text style={{ color: 'white' }}>{watchlist.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable onPress={() => setShowWatchlistModal(false)}>
              <Text style={{ color: 'red', marginTop: 10 }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  searchInput: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10
  },
  categoryButton: {
    backgroundColor: '#111',
    borderColor: '#555',
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
    borderRadius: 10
  },
  categoryText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    borderColor: 'gray',
    padding: 4,
    borderRadius: 6,
  },
  symbolText: { color: 'white', fontSize: 16 },
  addButton: {
    backgroundColor: 'red',
    width: 25,
    height: 25,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: { color: 'white', fontSize: 20, fontWeight: 'bold' }
});

export default WatchlistPage;
