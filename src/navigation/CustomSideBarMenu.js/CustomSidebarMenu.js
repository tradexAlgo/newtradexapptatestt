import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import {DrawerContentScrollView} from '@react-navigation/drawer';
import Mattie from '../../../assets/svg/mattie';
import {styles} from './styles';
import {font} from '../../common/Font';
import {color} from '../../common/color';
import Dashbord from '../../../assets/svg/dashbord';
import Matual from '../../../assets/svg/matual';
import Research from '../../../assets/svg/research';
import Price from '../../../assets/svg/price';
import Ipo from '../../../assets/svg/ipo';
import Calculator from '../../../assets/svg/calculator';
import Gold from '../../../assets/svg/gold';
import Signout from '../../../assets/svg/signout';
import Modal from 'react-native-modal';
import Modallog from '../../../assets/svg/modallog';
import useStore from '../../../store';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import StorageItems from '../../utils/StorageItems';

const CustomSidebarMenu = props => {
  const navigation = useNavigation();
  const {userProfileData} = useSelector(state => state.auth);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [focus, setFocus] = useState(true);
  const {press} = useStore();
  const toggleModal = () => {
    setFocus(true);
    setIsModalVisible(!isModalVisible);
  };

  const logout = () => {
    try {
      StorageItems.clearStorage();
      navigation.reset({
        routes: [{name: 'Auth'}],
      });
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.sideMenuContainer}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FastImage
            style={{height: 60, width: 60, borderRadius: 30}}
            source={{uri: userProfileData?.userPicture}}
          />

          <Text style={styles.profileHeaderText}>
            {userProfileData?.fullName}
          </Text>
        </View>
        <View style={styles.dashbordview}>
          <Dashbord />
          <Text style={styles.dashbord}>Dashboard</Text>
        </View>

        {/* <TouchableOpacity
          style={styles.dashbordview}
          onPress={() => navigation.navigate('MatualFundsScreen')}>
          <Matual />

          <Text style={styles.dashbord}>Matual Funds</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dashbordview}
          onPress={() => navigation.navigate('ResearchScreen')}>
          <Research />

          <Text style={styles.dashbord}>Research</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dashbordview}
          onPress={() => navigation.navigate('PriceAlertScreen')}>
          <Price />
          <Text style={styles.dashbord}>Price alert</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dashbordview}
          onPress={() => navigation.navigate('IpoScreen')}>
          <Ipo />
          <Text style={styles.dashbord}>IPO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dashbordview}
          onPress={() => navigation.navigate('MarginCalculatorScreen')}>
          <Calculator />
          <Text style={styles.dashbord}>Margin Calculator</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dashbordview}
          onPress={() => navigation.navigate('GoldBuyScreen')}>
          <Gold />
          <Text style={styles.dashbord}>Gold</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[styles.dashbordview, {paddingBottom: 20}]}
          onPress={toggleModal}>
          <Signout />
          <Text style={styles.dashbord}>Sign out</Text>
        </TouchableOpacity>

        <Modal
          isVisible={isModalVisible}
          animationIn={'fadeInDown'}
          animationOut={'fadeInDown'}
          backdropColor={color.color_black}
          backdropOpacity={0.5}>
          <View style={styles.mainview}>
            <View style={{alignSelf: 'center'}}>
              <Modallog />
            </View>
            <Text style={styles.suretext}>
              Are you sure you want to Logout?
            </Text>
            <View style={styles.rowview}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderWidth: 1,
                  paddingVertical: 7,
                  paddingHorizontal: 10,
                  borderRadius: 12,
                  backgroundColor: focus
                    ? color.color_white
                    : color.color_darkblue,
                  borderColor: focus ? color.color_black : color.color_darkblue,
                }}
                onPress={() => {
                  setFocus(false);
                  // press();
                  logout();
                }}>
                <Text
                  style={[
                    styles.yestext,
                    {color: focus ? color.color_black : color.color_white},
                  ]}>
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderWidth: 1,
                  paddingVertical: 7,
                  paddingHorizontal: 10,
                  marginLeft: 20,
                  borderRadius: 12,
                  backgroundColor: focus
                    ? color.color_darkblue
                    : color.color_white,
                  borderColor: focus ? color.color_darkblue : color.color_black,
                }}
                onPress={toggleModal}>
                <Text
                  style={[
                    styles.yestext,
                    {color: focus ? color.color_white : color.color_black},
                  ]}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomSidebarMenu;
