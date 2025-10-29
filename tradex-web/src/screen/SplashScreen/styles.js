import {StyleSheet} from 'react-native';
import {color} from '../../common/color';
import {font} from '../../common/Font';
export const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: color.color_lightblue},
  mainview: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  welcome: {
    fontFamily: font.nunitosemibold,
    fontSize: 21,
    fontWeight: 'normal',
    color: color.color_black,
    paddingTop: 5,
  },
  money: {
    fontFamily: font.nunitobold,
    fontSize: 29,
    fontWeight: 'normal',
    color: color.color_black,
  },
  subcontainer: {
    marginBottom: 70,
  },
  account: {
    fontFamily: font.nunitoregular,
    fontSize: 15,
    fontWeight: 'normal',
    color: color.color_black,
  },
  signup: {
    fontFamily: font.nunitoregular,
    fontSize: 15,
    fontWeight: '600',
    color: color.color_primary_green,
  },
  accountview: {flexDirection: 'row', alignSelf: 'center', paddingTop: 10},
});
