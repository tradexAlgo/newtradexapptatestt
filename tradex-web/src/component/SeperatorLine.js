import React from 'react';
import {View, StyleSheet} from 'react-native';
import {color} from '../common/color';

const SeperatorLine = ({width = '100%'}) => {
  return <View style={styles.container(width)} />;
};

const styles = StyleSheet.create({
  container: width => ({
    backgroundColor: color.Default_GREY,
    height: 0.4,
    width: width,
    marginVertical: 10,
  }),
});

export default SeperatorLine;
