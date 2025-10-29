import { StyleSheet } from 'react-native';
import { font } from '../../common/Font';
import { color } from '../../common/color';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.color_black },
  scrollview: { flexGrow: 1 },
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
  label: {
  fontSize: 15,
  fontWeight: '600',
  fontFamily: font.nunitoregular,
  color: color.color_white,
  paddingTop: 12,
},

input: {
  fontSize: 18,
  color: color.color_white,
  paddingVertical: 6,
},

infoNote: {
  textAlign: 'center',
  fontSize: 14,
  fontFamily: font.nunitoregular,
  paddingHorizontal: 15,
  color: color.color_white,
  marginBottom: 10,
},

warningNote: {
  textAlign: 'center',
  fontSize: 13,
  color: '#aaaaaa',
  marginTop: 30,
  paddingHorizontal: 10,
}


});
