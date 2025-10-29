import { StyleSheet } from 'react-native';
import { font } from '../../common/Font';
import { color } from '../../common/color';

export const styles = StyleSheet.create({

  label: { color: '#aaa', fontSize: 12 },
  value: { color: 'white', fontWeight: 'bold' },
  marketDepthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  qty: { color: '#aaa', width: 50 },
  buyPrice: { color: '#00ff88', width: 80, textAlign: 'right' },
  sellPrice: { color: '#ff5b5b', width: 80, textAlign: 'right' },
  quantitySummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#444',
  },
  totalQtyLeft: { color: 'white' },
  totalQtyLabel: { color: 'gray' },
  totalQtyRight: { color: 'white' },
  chartsButton: {
    padding: 10,
    marginTop: 10,
    backgroundColor: '#222',
    borderRadius: 6,
    alignItems: 'center',
  },
  basketButton: {
    padding: 12,
    marginTop: 10,
    backgroundColor: '#303030',
    borderRadius: 6,
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:color.black,
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

resultContainer: {
  marginTop: 4,
  color:'white'
},

  container: { flex: 1, backgroundColor: 'black' },
  containerSec: {
    backgroundColor: color.black,
    paddingHorizontal: 15,
    // flex: 1,
    // paddingVertical: 15,
    gap: 10,
    zIndex: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 18,
    fontFamily: font.nunitobold,
    color: color.color_black,
  },
  seeAllText: {
    fontSize: 15,
    fontFamily: font.nunitoregular,
    color: color.color_darkblue,
  },
  // itemContainer: {
  //   backgroundColor: color.black,
  //   borderRadius: 12,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   paddingHorizontal: 10,
  //   paddingVertical: 10,
  //   flex: 1,
  //   borderWidth: 0,
  //   borderColor: 'gray',

  //   // Android
  //   elevation: 6,

  //   // iOS (light shadow for dark background)
  //   shadowColor: '#ffffff30', // semi-transparent white
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 6,
  // },

  itemContainer: {
    backgroundColor: '#1c1c1e', // a lighter black to contrast with black background
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    // Android elevation
    elevation: 4,

    // iOS shadow
    shadowColor: '#ffffff20',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  iconContainer: {
    alignSelf: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
    paddingLeft: 10,
    alignSelf: 'center',
  },
  bankName: {
    fontSize: 14,
    fontFamily: font.nunitoregular,
    fontWeight: '600',
    paddingTop: 2,
    color: color.color_black,
  },
  nse: {
    fontSize: 13,
    fontFamily: font.nunitoregular,
    fontWeight: '600',
    color: color.color_limit,
  },
  priceContainer: {
    flexDirection: 'column',
  },
  price: {
    fontSize: 15,
    fontFamily: font.nunitoregular,
    fontWeight: '600',
    paddingTop: 2,
    textAlign: 'center',
    color:'white'
  },
  resultContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  result: {
    fontSize: 13,
    fontFamily: font.nunitoregular,
    fontWeight: '600',
    color: color.color_black,
    textAlign: 'center',
  },
  ltp: {
    fontSize: 13,
    fontFamily: font.nunitoregular,
    fontWeight: '600',
    textAlign: 'center',
  },
  bracket: {
    fontSize: 13,
    fontFamily: font.nunitoregular,
    fontWeight: '600',
    color: color.color_black,
    textAlign: 'center',
  },
});
