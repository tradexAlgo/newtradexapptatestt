import {StyleSheet} from 'react-native';
import {font} from '../../common/Font';
import {color} from '../../common/color';

export const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: color.color_black},
  scrollview: {flexGrow: 1},
  subview: {
    flex: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: '#1e1e1e',     // Slight contrast with full black background
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    marginTop: 40,

    // iOS shadow
    shadowColor: '#ffffff20',
    shadowOffset: { width: 0, height: -2 },  // shadow from top
    shadowOpacity: 0.15,
    shadowRadius: 6,

    // Android elevation
    elevation: 6,
  },
});
