import React, { useEffect } from 'react';
import { BackHandler, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';

const PaymentWebView = ({ route, navigation }) => {
  const { paymentUrl } = route.params;

  // Navigate to Submited screen when hardware back is pressed
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.replace('Submited'); // ✅ Redirect to Submited
        return true; // Prevent default back action
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView source={{ uri: paymentUrl }} />
    </SafeAreaView>
  );
};

export default PaymentWebView;
