import {Text, View, useWindowDimensions} from 'react-native';
import React from 'react';
import {font} from '../../common/Font';
import {color} from '../../common/color';
import Intraday from '../orderTopTab/Intraday';
import Delivery from '../orderTopTab/Delivery';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import Option from '../orderTopTab/Option';

const renderScene = SceneMap({
  intraday: Intraday,
  delivery: Delivery,
  optoin: Option,
});

const renderTabBar = props => {
  // const {colors} = useTheme();
  return (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: color.color_darkblue}}
      pressColor="transparent"
      style={{
        backgroundColor: color.color_lightblue,
      }}
      tabStyle={{}}
      renderLabel={({route, focused, color}) => (
        <View
          style={{
            backgroundColor: 'transparent',
          }}>
          <Text
            style={{
              color: focused ? '#2F80ED' : '#000000',
              fontSize: 15,
              fontFamily: font.nunitoregular,
            }}>
            {route.title}
          </Text>
        </View>
      )}
    />
  );
};

export default function TopTab() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    {key: 'Intraday', title: 'Intraday'},
    {key: 'Delivery', title: 'Delivery'},
  ]);
  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      renderTabBar={renderTabBar}
    />
  );
}
