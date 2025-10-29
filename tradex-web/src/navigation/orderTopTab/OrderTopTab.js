import * as React from 'react';
import {View, useWindowDimensions, Text} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {font} from '../../common/Font';
import {color} from '../../common/color';
import Pending from './Pending';
import Executed from './Executed';
import ExecutedCommodity from './ExecutedCommodity';
import Others from './Others';

const renderScene = SceneMap({
  pending: Pending,
  executed: Executed,
  others: Others,
});
const renderSceneCommodity = SceneMap({
  pending: Pending,
  executed: ExecutedCommodity,
  others: Others,
});

const renderTabBar = props => {
  // const {colors} = useTheme();
  return (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: color.color_darkblue}}
      pressColor="transparent"
      style={{
        backgroundColor: color.black,
      }}
      tabStyle={{}}
      renderLabel={({route, focused, color}) => (
        <View
          style={{
            backgroundColor: 'transparent',
          }}>
          <Text
            style={{
              color: focused ? '#2F80ED' : 'white',
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

export default function OrderTopTab({focus}:any) {
  // console.log("cheme",focus)
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    {key: 'pending', title: 'Pending'},
    {key: 'executed', title: 'Executed'},
    {key: 'others', title: 'Others'},
  ]);

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={ focus === 4?renderSceneCommodity: renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      renderTabBar={renderTabBar}
    />
  );
}
