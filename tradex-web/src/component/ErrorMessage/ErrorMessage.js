import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {styles} from './styles';
import {color} from '../../common/color';
import {useDispatch} from 'react-redux';

const ErrorMessage = ({
  message = 'Something went wrong!',
  apiToCall,
  onPress,
}) => {
  const dispatch = useDispatch();

  const retry = () => {
    if (typeof apiToCall === 'function') {
      dispatch(apiToCall());
    }
    if (typeof onPress === 'function') {
      onPress();
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.messageText}>{message}</Text>
      <TouchableOpacity onPress={retry} style={styles.button}>
        <Text style={styles.text}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorMessage;
