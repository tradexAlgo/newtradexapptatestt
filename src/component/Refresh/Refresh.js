import React, {useCallback, useState} from 'react';
import {RefreshControl} from 'react-native';
import {color} from '../../common/color';
import {useDispatch} from 'react-redux';

const Refresh = ({apiToRefresh}) => {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(apiToRefresh());
    setRefreshing(false);
  }, []);
  return (
    <RefreshControl
      tintColor={color.color_primary_green}
      title="Refreshing"
      refreshing={refreshing}
      onRefresh={onRefresh}
      titleColor={color.color_primary_green}
      style={{backgroundColor: color.color_primary_green}}
    />
  );
};

export default Refresh;
