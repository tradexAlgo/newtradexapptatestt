import {StyleSheet} from 'react-native';
import {font} from '../../common/Font';
import {color} from '../../common/color';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: color.color_primary_green,
    borderColor: color.color_primary_green,
    borderWidth: 1,
    width: 201,
    height: 49,

    justifyContent: 'center',
    borderRadius: 100,
    alignSelf: 'center',
    shadowColor: color.color_primary_green,
    shadowOpacity: 1,
    shadowRadius: 8,

    elevation: 5,
  },
  buttonText: {
    fontFamily: font.nunitobold,
    fontSize: 19,
    color: color.color_white,
    textAlign: 'center',
    paddingBottom: 5,
  },
});
