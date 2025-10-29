import { useState } from 'react';
import {
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import Modallog from '../../../assets/svg/modallog';
import Right from '../../../assets/svg/right';
import Signout from '../../../assets/svg/signout';
import { color } from '../../common/color';
import { font } from '../../common/Font';
import ErrorMessage from '../../component/ErrorMessage/ErrorMessage';
import Loader from '../../component/Loader/Loader';
import { userProfile } from '../../redux/slice/AuthSlice';
import StorageItems from '../../utils/StorageItems';
import { styles } from './styles';
// import { Modal } from 'react-native-paper';

const AccountScreen = ({ navigation }) => {
  const { userProfileData, userProfileDataFailed, loading } = useSelector(
    state => state.auth,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [focus, setFocus] = useState(true);
  const toggleModal = () => {
    setFocus(true);
    setIsModalVisible(!isModalVisible);
  };

  const logout = () => {
    try {
      StorageItems.clearStorage();
      navigation.reset({
        routes: [{ name: 'Auth' }],
      });
    } catch (error) {
      // console.log(error);
    }
  };
  // return (
  //   <>
  //     <Modal
  //       visible={isModalVisible}
  //       transparent={true}
  //       animationType="fade" // supported values: 'none', 'slide', 'fade'
  //       onRequestClose={toggleModal} // required for Android back button
  //     >
  //       <View style={styles.modalOverlay}>
  //         <View style={styles.mainview}>
  //           <View style={{ alignSelf: 'center' }}>
  //             <Modallog />
  //           </View>
  //           <Text style={[styles.suretext, { color: 'white' }]}>
  //             Are you sure you want to Logout?
  //           </Text>
  //           <View style={styles.rowview}>
  //             <TouchableOpacity
  //               style={[
  //                 styles.button,
  //                 {
  //                   backgroundColor: focus ? color.color_white : color.color_darkblue,
  //                   borderColor: focus ? color.color_black : color.color_darkblue,
  //                 },
  //               ]}
  //               onPress={() => {
  //                 setFocus(false);
  //                 logout();
  //               }}>
  //               <Text
  //                 style={[
  //                   styles.yestext,
  //                   { color: focus ? color.color_black : color.color_white },
  //                 ]}>
  //                 Yes
  //               </Text>
  //             </TouchableOpacity>

  //             <TouchableOpacity
  //               style={[
  //                 styles.button,
  //                 {
  //                   marginLeft: 20,
  //                   backgroundColor: focus ? color.color_darkblue : color.color_white,
  //                   borderColor: focus ? color.color_darkblue : color.color_black,
  //                 },
  //               ]}
  //               onPress={toggleModal}>
  //               <Text
  //                 style={[
  //                   styles.yestext,
  //                   { color: focus ? color.color_white : color.color_black },
  //                 ]}>
  //                 No
  //               </Text>
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //       </View>
  //     </Modal>

  //     {userProfileData ? (
  //       <SafeAreaView style={styles.container}>

  //         <ScrollView contentContainerStyle={styles.scrollview}>

  //           <View style={styles.subview}>
  //             <View style={styles.imageview}>
  //               <FastImage
  //                 style={{ height: 60, width: 60, borderRadius: 30 }}
  //                 source={{ uri: userProfileData?.userPicture }}
  //               />
  //             </View>
  //             <Text style={styles.firsttext}>{userProfileData?.fullName}</Text>
  //             <TouchableOpacity
  //               style={styles.touchview}
  //               onPress={() => {
  //                 navigation.navigate('InformationScreen');
  //               }}>
  //               <Text
  //                 style={{
  //                   fontSize: 19,
  //                   fontWeight: '600',
  //                   color: color.color_white,
  //                   fontFamily: font.nunitoregular,
  //                 }}>
  //                 Personal information
  //               </Text>
  //               <Right />
  //             </TouchableOpacity>

  //             <TouchableOpacity
  //               style={styles.touchview}
  //               onPress={() => {
  //                 navigation.navigate('GenerateBill');
  //               }}>
  //               <Text
  //                 style={{
  //                   fontSize: 19,
  //                   fontWeight: '600',
  //                   color: color.color_white,
  //                   fontFamily: font.nunitoregular,
  //                 }}>
  //                 Generate Bill
  //               </Text>
  //               <Right />
  //             </TouchableOpacity>
  //             <TouchableOpacity
  //               style={styles.touchview}
  //               onPress={() => {
  //                 navigation.navigate('Transactions');
  //               }}>
  //               <Text
  //                 style={{
  //                   fontSize: 19,
  //                   fontWeight: '600',
  //                   color: color.color_white,
  //                   fontFamily: font.nunitoregular,
  //                 }}>
  //                 Transactions
  //               </Text>
  //               <Right />
  //             </TouchableOpacity>
  //             <TouchableOpacity
  //               style={styles.touchview}
  //               onPress={() => {
  //                 navigation.navigate('Deposit');
  //               }}>
  //               <Text
  //                 style={{
  //                   fontSize: 19,
  //                   fontWeight: '600',
  //                   color: color.color_white,
  //                   fontFamily: font.nunitoregular,
  //                 }}>
  //                 Deposit
  //               </Text>
  //               <Right />
  //             </TouchableOpacity>
  //             <TouchableOpacity
  //               style={styles.touchview}
  //               onPress={() => {
  //                 navigation.navigate('Withdrawal');
  //               }}>
  //               <Text
  //                 style={{
  //                   fontSize: 19,
  //                   fontWeight: '600',
  //                   color: color.color_white,
  //                   fontFamily: font.nunitoregular,
  //                 }}>
  //                 withdrawal
  //               </Text>
  //               <Right />
  //             </TouchableOpacity>
  //             {/* 
  //         <TouchableOpacity style={styles.touchview}  onPress={() => {
  //             navigation.navigate('VerifyNumberScreen');
  //           }}>
  //           <Text style={styles.touchText}>Phone number verification</Text>
  //           <Right />
  //         </TouchableOpacity> */}

  //             <Text style={styles.settingtext}>Settings</Text>

  //             <TouchableOpacity
  //               style={styles.touchview}
  //               onPress={() => {
  //                 navigation.navigate('TabSecurity');
  //               }}>
  //               <Text style={styles.touchText}>Security</Text>
  //               <Right />
  //             </TouchableOpacity>
  //             <TouchableOpacity
  //               style={styles.touchview}
  //               onPress={() => {
  //                 navigation.navigate('CustomerSupport');
  //               }}>
  //               <Text style={styles.touchText}>Customer Support</Text>
  //               <Right />
  //             </TouchableOpacity>
  //             <TouchableOpacity
  //               style={styles.touchview}
  //               onPress={() => {
  //                 Linking.openURL('https://finovate.ltd/');
  //               }}>
  //               <Text style={styles.touchText}>Refer and Earn</Text>
  //               <Right />
  //             </TouchableOpacity>

  //             <View style={{ marginBottom: 20 }} >


  //               <TouchableOpacity
  //                 style={[styles.dashbordview, { paddingBottom: 20 }]}
  //                 onPress={toggleModal}>
  //                 <Signout />
  //                 <Text style={styles.dashbord}>Sign out</Text>
  //               </TouchableOpacity>

  //             </View>

  //             {/* <TouchableOpacity style={styles.touchview}>
  //               <Text style={styles.touchText}>{'Help & Support'}</Text>
  //               <Right />
  //             </TouchableOpacity>

  //             <TouchableOpacity style={styles.touchview}>
  //               <Text style={styles.touchText}>Legal</Text>
  //               <Right />
  //             </TouchableOpacity> */}
  //           </View>
  //         </ScrollView>
  //         {/* <Modal
  //           isVisible={isModalVisible}
  //           animationIn={'fadeInDown'}
  //           animationOut={'fadeInDown'}
  //           backdropColor="black"
  //           backdropOpacity={0}
  //         >
  //           <View style={styles.mainview}>
  //             <View style={{ alignSelf: 'center' }}>
  //               <Modallog />
  //             </View>
  //             <Text style={styles.suretext}>
  //               Are you sure you want to Logout?
  //             </Text>
  //             <View style={styles.rowview}>
  //               <TouchableOpacity
  //                 style={{
  //                   flex: 1,
  //                   borderWidth: 1,
  //                   paddingVertical: 7,
  //                   paddingHorizontal: 10,
  //                   borderRadius: 12,
  //                   backgroundColor: focus
  //                     ? color.color_white
  //                     : color.color_darkblue,
  //                   borderColor: focus ? color.color_black : color.color_darkblue,
  //                 }}
  //                 onPress={() => {
  //                   setFocus(false);
  //                   // press();
  //                   logout();
  //                 }}>
  //                 <Text
  //                   style={[
  //                     styles.yestext,
  //                     { color: focus ? color.color_black : color.color_white },
  //                   ]}>
  //                   Yes
  //                 </Text>
  //               </TouchableOpacity>
  //               <TouchableOpacity
  //                 style={{
  //                   flex: 1,
  //                   borderWidth: 1,
  //                   paddingVertical: 7,
  //                   paddingHorizontal: 10,
  //                   marginLeft: 20,
  //                   borderRadius: 12,
  //                   backgroundColor: focus
  //                     ? color.color_darkblue
  //                     : color.color_white,
  //                   borderColor: focus ? color.color_darkblue : color.color_black,
  //                 }}
  //                 onPress={toggleModal}>
  //                 <Text
  //                   style={[
  //                     styles.yestext,
  //                     { color: focus ? color.color_white : color.color_black },
  //                   ]}>
  //                   No
  //                 </Text>
  //               </TouchableOpacity>
  //             </View>
  //           </View>
  //         </Modal> */}


  //       </SafeAreaView>

  //     ) : userProfileDataFailed ? (
  //       <ErrorMessage
  //         apiToCall={userProfile}
  //         message={userProfileDataFailed?.message}
  //       />
  //     ) : (
  //       loading && <Loader loading={loading} />
  //     )}
  //   </>
  // );

  return (
  <>
    <Modal
      visible={isModalVisible}
      transparent
      animationType="fade"
      onRequestClose={toggleModal}>
      <View style={styles.modalOverlay}>
        <View style={styles.mainview}>
          <Modallog />
          <Text style={styles.suretext}>Are you sure you want to Logout?</Text>
          <View style={styles.rowview}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: focus ? '#FFFFFF' : '#BB86FC',
                  borderColor: focus ? '#000000' : '#BB86FC',
                },
              ]}
              onPress={() => {
                setFocus(false);
                logout();
              }}>
              <Text
                style={[
                  styles.yestext,
                  { color: focus ? '#000000' : '#FFFFFF' },
                ]}>
                Yes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: focus ? '#BB86FC' : '#FFFFFF',
                  borderColor: focus ? '#BB86FC' : '#000000',
                },
              ]}
              onPress={toggleModal}>
              <Text
                style={[
                  styles.yestext,
                  { color: focus ? '#FFFFFF' : '#000000' },
                ]}>
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    {userProfileData ? (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollview}>
          <View style={styles.subview}>
            <View style={styles.imageview}>
              <FastImage
                style={{ height: 80, width: 80, borderRadius: 40 }}
                source={{ uri: userProfileData?.userPicture }}
              />
            </View>
            <Text style={styles.firsttext}>{userProfileData?.fullName}</Text>

            <TouchableOpacity
              style={styles.touchview}
              onPress={() => navigation.navigate('InformationScreen')}>
              <Text style={styles.touchText}>Personal Information</Text>
              <Right />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.touchview}
              onPress={() => navigation.navigate('GenerateBill')}>
              <Text style={styles.touchText}>Generate Bill</Text>
              <Right />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.touchview}
              onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.touchText}>Transactions</Text>
              <Right />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.touchview}
              onPress={() => navigation.navigate('Deposit')}>
              <Text style={styles.touchText}>Deposit</Text>
              <Right />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.touchview}
              onPress={() => navigation.navigate('Withdrawal')}>
              <Text style={styles.touchText}>Withdrawal</Text>
              <Right />
            </TouchableOpacity>

            <Text style={styles.settingtext}>Settings</Text>

            <TouchableOpacity
              style={styles.touchview}
              onPress={() => navigation.navigate('TabSecurity')}>
              <Text style={styles.touchText}>Security</Text>
              <Right />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.touchview}
              onPress={() => navigation.navigate('CustomerSupport')}>
              <Text style={styles.touchText}>Customer Support</Text>
              <Right />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.touchview}
              onPress={() => Linking.openURL('https://finovate.ltd/')}>
              <Text style={styles.touchText}>Refer and Earn</Text>
              <Right />
            </TouchableOpacity>

            <View style={styles.dashbordview}>
              <Signout />
              <TouchableOpacity onPress={toggleModal}>
                <Text style={styles.dashbord}>Sign out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    ) : userProfileDataFailed ? (
      <ErrorMessage
        apiToCall={userProfile}
        message={userProfileDataFailed?.message}
      />
    ) : (
      loading && <Loader loading={loading} />
    )}
  </>
);

};

export default AccountScreen;
