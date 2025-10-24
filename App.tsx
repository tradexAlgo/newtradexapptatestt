/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { LogBox, StyleSheet, useColorScheme, View } from 'react-native';
import NavigationConst from './src/navigation/index';
import { NavigationContainer } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BootSplash from 'react-native-bootsplash';
import store from './src/redux/store';
import { Provider } from 'react-redux';
import 'react-native-gesture-handler';
import ToastModal from './src/common/ToastModal';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return <View style={styles.sectionContainer}>{children}</View>;
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      setTimeout(async () => {
        await BootSplash.hide({ fade: true });
      }, 3000);
    });
  }, []);

  return (
    <Provider store={store}>
      <ToastModal />
      <SafeAreaProvider edges={['top']}
        style={{
          backgroundColor: '#121212',
          flex: 1,
          paddingTop: 6,
          // paddingHorizontal: 10,
        }} >
        <NavigationContainer>
          <NavigationConst />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default App;
