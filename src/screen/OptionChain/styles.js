import {StyleSheet} from 'react-native';
import {font} from '../../common/Font';
import {color} from '../../common/color';

export const styles = StyleSheet.create({
    footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    padding: 10,
  },
  buyBtn: {
    backgroundColor: '#00c98d',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  sellBtn: {
    backgroundColor: '#ff4d4f',
    padding: 15,
    borderRadius: 8,
    flex: 1,
  },
  btnText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  bankName: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 2,
  color:'white'
},

nse: {
  fontSize: 12,
  color: 'white',
},

price: {
  fontSize: 16,
  fontWeight: '600',
  color:'white'
},

  container: {flex: 1, backgroundColor: color.color_black},
  mainscroll: {backgroundColor: color.color_white, marginTop: -25},
  toptextview: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  numbertext: {
    fontFamily: font.nunitobold,
    fontSize: 18,
    color: color.color_green,
  },
  subview: {flexDirection: 'column',backgroundColor:'black'},
  rupeetext: {
    fontSize: 18,
    fontFamily: font.nunitobold,
    color: color.color_black,
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  nseview: {
    flexDirection: 'row',
    borderRadius: 57,
    backgroundColor: 'black',
    marginTop: 10,
  },
  nseText: {
    fontSize: 10,
    fontFamily: font.nunitoregular,
    fontWeight: '600',
    paddingVertical: 3,
    flex: 1,
    textAlign: 'center',
    borderRadius: 56,
    color:'white'
  },
  precentageview: {flexDirection: 'row'},
  baracket: {
    fontSize: 18,
    fontFamily: font.nunitoregular,
    color: color.color_black,
  },
  percentagetext: {
    fontFamily: font.nunitoregular,
    fontSize: 18,
    color: color.color_green,
  },
  horizontalline: {
    borderBottomColor: color.color_bankhorizontal,
    borderBottomWidth: 3,
    marginTop: 20,
  },
  charttext: {
    fontSize: 18,
    fontFamily: font.nunitobold,
    color: color.color_white,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  marketview: {flexDirection: 'row', height: 325, paddingHorizontal: 10},
  bidtext: {
    fontSize: 13,
    fontFamily: font.nunitoregular,
    color: color.color_white,
  },
  bidblue: {
    color: color.color_darkblue,
    fontSize: 10,
    fontFamily: font.nunitoregular,
  },
  bidred: {
    color: color.color_red,
    fontSize: 10,
    fontFamily: font.nunitoregular,
  },
  buttonmain: {
    flexDirection: 'row',
    paddingTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  buytext: {
    borderRadius: 100,
    backgroundColor: color.color_darkblue,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
    marginRight: 20,
  },
  selltext: {
    borderRadius: 100,
    backgroundColor: color.color_red,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  sametext: {
    color: color.color_white,
    fontFamily: font.nunitobold,
    fontSize: 19,
    textAlign: 'center',
  },
  modaltext: {
    fontFamily: font.nunitobold,
    fontSize: 18,
    color: color.color_black,
  },
  rupeemodal: {
    fontSize: 18,
    fontFamily: font.nunitobold,
    color: color.color_bottomtab,
  },
  baracketmodal: {
    fontSize: 13,
    fontFamily: font.nunitoregular,
    color: color.color_black,
  },
  percentagemodal: {
    fontFamily: font.nunitoregular,
    fontSize: 13,
    color: color.color_bottomtab,
  },
});
