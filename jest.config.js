module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '@react-native-community/netinfo': '<rootDir>/__mocks__/@react-native-community/netinfo.js',
    '@react-native-cookies/cookies': '<rootDir>/__mocks__/@react-native-cookies/cookies.js',
    'react-native-fs': '<rootDir>/__mocks__/react-native-fs.js',
    'react-native-share': '<rootDir>/__mocks__/react-native-share.js',
    'react-native-gesture-handler': '<rootDir>/__mocks__/react-native-gesture-handler.js'
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-app-intro-slider|react-native-loading-spinner-overlay|react-redux|@react-native-cookies/cookies|react-native-fs|react-native-vector-icons|react-native-reanimated|react-native-linear-gradient|react-native-modal)/)',
  ],
};
