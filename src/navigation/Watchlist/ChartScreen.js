import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import Appheader from '../../component/AppHeader/appheader';
const ChartScreen = ({ route,navigation }) => {
  const { symbol } = route.params;

  const mapSymbolForTradingView = (symbol) => {
  const mapping = {
    '^NSEI': 'NSE:NIFTY',
    '^NSEBANK': 'NSE:BANKNIFTY',
    '^BSESN': 'BSE:SENSEX',
    '^DJI': 'DJ:DJI',
    '^IXIC': 'NASDAQ:IXIC',
  };

  return mapping[symbol] || symbol.replace(/\..*/, '');
};

const tradingViewSymbol = mapSymbolForTradingView(symbol);


  const chartHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <style>
          html, body {
            margin: 0;
            padding: 0;
            background-color: #000;
            height: 100%;
            width: 100%;
            overflow: hidden;
          }
          #tradingview_widget {
            height: 100vh;
            width: 100vw;
          }
        </style>
      </head>
      <body>
        <div id="tradingview_widget"></div>
        <script src="https://s3.tradingview.com/tv.js"></script>
        <script>
          new TradingView.widget({
            autosize: true,
            symbol: "${tradingViewSymbol}",
            interval: "D",
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            toolbar_bg: "#000",
            enable_publishing: false,
            hide_top_toolbar: false,
            withdateranges: true,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            container_id: "tradingview_widget"
          });
        </script>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
       <Appheader
            onPress={() => navigation.goBack()}
            header={tradingViewSymbol}
          />
      <WebView
        originWhitelist={['*']}
        source={{ html: chartHtml }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        scalesPageToFit={false}
        style={styles.webview}
      />
    </SafeAreaView>
  );
};

export default ChartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
});
