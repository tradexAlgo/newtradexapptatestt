import React from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import {color as colors} from '../../common/color';

const Loader = ({
  loading,
  size = 'large',
  color = colors.color_primary_green,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={color} size={size} animating={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;
