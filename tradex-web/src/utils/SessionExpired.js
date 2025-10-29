import StorageItems from './StorageItems';

export default SessionExpired = ({error, navigation}) => {
  if (error?.response?.data?.message === 'User not found') {
    StorageItems.clearStorage();
    navigation.reset({
      routes: [{name: 'Auth'}],
    });
  }
};
