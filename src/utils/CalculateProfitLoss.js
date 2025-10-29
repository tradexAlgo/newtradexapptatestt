import {StyleSheet, Text} from 'react-native';
import {color} from '../common/color';
import {font} from '../common/Font';

const CalculateProfitLoss = ({initialValue, finalValue}) => {
  const difference = finalValue - initialValue;
  const percentage = (difference / Math.abs(initialValue)) * 100;

  if (percentage > 0) {
    return (
      <Text
        style={[
          styles.price,
          {color: color.color_green},
        ]}>{`(${percentage.toFixed(2)}%)`}</Text>
    );
  } else if (percentage < 0) {
    return (
      <Text style={[styles.price, {color: color.color_red}]}>{`(${Math.abs(
        percentage,
      ).toFixed(2)}%)`}</Text>
    );
  } else {
    return <Text style={[styles.price, {color: color.color_black}]}>0</Text>;
  }
};

const styles = StyleSheet.create({
  price: {
    fontSize: 15,
    fontFamily: font.nunitoregular,
    fontWeight: '600',
    paddingTop: 2,
    textAlign: 'center',
  },
});

export default CalculateProfitLoss;
