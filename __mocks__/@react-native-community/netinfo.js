import { jest } from '@jest/globals';

jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: () => ({
    type: 'unknown',
    isConnected: true,
    isInternetReachable: true,
    details: {
      isConnectionExpensive: false,
    },
  }),
}));
