import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import {color} from '../../common/color';

const Spinner = ({visible, text}) => {
  return (
    <SpinnerOverlay
      visible={visible}
      textContent={text}
      textStyle={styles.spinnerTextStyle}
      color={color.color_primary_green}
    />
  );
};

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: color.color_primary_green,
  },
});

export default Spinner;
