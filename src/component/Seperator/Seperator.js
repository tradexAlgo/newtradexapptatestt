import React from 'react';
import {View} from 'react-native';

const Seperator = ({seperate = 5}) => {
  return <View style={{marginVertical: seperate}} />;
};

export default Seperator;
