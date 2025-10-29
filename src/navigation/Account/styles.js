import { StyleSheet } from 'react-native';
import { font } from '../../common/Font';
import { color } from '../../common/color';

// export const styles = StyleSheet.create({
//    modalContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     margin: 0, // remove default margin
//   },
//   mainview: {
//     width: '85%',
//     backgroundColor: '#1e1e1e',
//     padding: 20,
//     borderRadius: 16,
//     alignItems: 'center',
//   },
//   suretext: {
//     color: 'white',
//     fontSize: 16,
//     marginTop: 15,
//     textAlign: 'center',
//   },
//   rowview: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   button: {
//     flex: 1,
//     borderWidth: 1,
//     paddingVertical: 7,
//     paddingHorizontal: 10,
//     borderRadius: 12,
//   },
//   yestext: {
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   container: { flex: 1, backgroundColor: color.color_black },
//   scrollview: { flexGrow: 1 },
//   subview: {
//     flex: 1,
//     borderTopRightRadius: 20,
//     borderTopLeftRadius: 20,
//     backgroundColor: '#1e1e1e',     // Slight contrast with full black background
//     paddingLeft: 15,
//     paddingRight: 15,
//     paddingTop: 15,
//     marginTop: 40,

//     // iOS shadow
//     shadowColor: '#ffffff20',
//     shadowOffset: { width: 0, height: -2 },  // shadow from top
//     shadowOpacity: 0.15,
//     shadowRadius: 6,

//     // Android elevation
//     elevation: 6,
//   },
//   imageview: { alignSelf: 'center' },
//   firsttext: {
//     fontSize: 19,
//     fontFamily: font.nunitoregular,
//     fontWeight: '600',
//     textAlign: 'center',
//     color: color.color_white,
//   },
//   touchview: {
//     flexDirection: 'row',
//     paddingVertical: 15,
//     justifyContent: 'space-between',
//     backgroundColor: color.color_black,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   touchText: {
//     fontSize: 19,
//     fontWeight: '600',
//     color: color.color_white,
//     fontFamily: font.nunitoregular,
//   },
//   settingtext: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: color.color_white,
//     fontFamily: font.nunitobold,
//     paddingTop: 20,
//   },
//   dashbord: {
//     color: color.color_white,
//     fontWeight: '600',
//     fontFamily: font.nunitoregular,
//     fontSize: 18,
//     alignSelf: 'flex-end',
//     paddingLeft: 20,
//   },
//   dashbordview: { flexDirection: 'row', paddingTop: 30 },
//   suretext: {
//     textAlign: 'center',
//     color: color.color_black,
//     fontSize: 14,
//     fontFamily: font.nunitoregular,
//     paddingTop: 20,
//   },
//   rowview: { flexDirection: 'row', marginTop: 25 },
//   yestext: { textAlign: 'center', fontSize: 18, fontFamily: font.nunitobold },
//   mainview: {
//     backgroundColor: 'black',
//     width: '90%',
//     alignSelf: 'center',
//     paddingVertical: 20,
//     paddingHorizontal: 15,
//     borderRadius: 15,
//     justifyContent:'center',
//     marginTop:'50%'
//   },
// });


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollview: {
    padding: 20,
  },
  subview: {
    padding: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
  },
  imageview: {
    alignItems: 'center',
    marginBottom: 16,
  },
  firsttext: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: font.nunitoregular,
  },
  touchview: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  touchText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EEEEEE',
    fontFamily: font.nunitoregular,
  },
  settingtext: {
    fontSize: 16,
    color: '#888',
    marginTop: 28,
    marginBottom: 12,
    fontFamily: font.nunitoregular,
  },
  dashbordview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  dashbord: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B6B',
    marginLeft: 12,
    fontFamily: font.nunitoregular,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainview: {
    width: '80%',
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  suretext: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
    color: '#FFFFFF',
    fontFamily: font.nunitoregular,
  },
  rowview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 12,
  },
  yestext: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: font.nunitoregular,
  },
});
