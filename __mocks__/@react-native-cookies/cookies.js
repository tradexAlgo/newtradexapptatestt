import { jest } from '@jest/globals';

jest.mock('@react-native-cookies/cookies', () => ({
  // Mock methods as needed
  set: jest.fn(),
  get: jest.fn(),
  clearAll: jest.fn(),
}));
