import {Switch} from 'react-native-switch';
import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {font} from '../../common/Font';
import {color} from '../../common/color';

const CustomSwitch = ({MainColor, value, onValueChange}) => {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      circleSize={22}
      barHeight={25}
      circleBorderWidth={1}
      activeText={'    '}
      inActiveText={'    '}
      circleBorderActiveColor={color.color_white}
      circleBorderInactiveColor={color.color_white}
      backgroundActive={MainColor}
      backgroundInactive={color.color_gray}
      circleActiveColor={color.color_white}
      circleInActiveColor={color.color_white}
      switchLeftPx={200}
      switchRightPx={200}
    />
  );
};

export default CustomSwitch;
