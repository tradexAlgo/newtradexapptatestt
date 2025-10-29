import { StyleSheet } from 'react-native';
import { font } from '../../common/Font';
import { color } from '../../common/color';

export const styles = StyleSheet.create({
  container: { flexDirection: 'row', paddingLeft: 15, paddingVertical: 10,color:'black' },
  headerText: {
    fontSize: 20,
    fontFamily: font.nunitobold,
    color: color.color_white,
    textAlign: 'center',
    flex: 1,
    right: 35
  },
  icons: {
    right: 20,
    tintColor:'white'
  }
});
