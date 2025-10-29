import {StyleSheet} from 'react-native';
import {font} from '../../common/Font';
import {color} from '../../common/color';

export const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15},
  button: {
    backgroundColor: color.color_primary_green,
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  text: {
    color: color.color_white,
    fontWeight: 'bold',
  },
  messageText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
