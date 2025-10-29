import React, {memo} from 'react';
import {FlatList, View} from 'react-native';
import Refresh from '../Refresh/Refresh';

const OptimizedFlatlist = ({
  data,
  renderItem,
  contentContainerStyle,
  apiToRefresh,
  style,
}) => {
  return (
    <View style={{zIndex: 0, flex: 1}}>
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        removeClippedSubviews
        style={style}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        // refreshControl={<Refresh apiToRefresh={apiToRefresh} />}
      />
    </View>
  );
};

export default memo(OptimizedFlatlist);
