import Storage from './Storage';

const storeUserToken = data => {
  return Storage.set('user_token', data);
};
const getUserToken = data => {
  return Storage.getString('user_token');
};
const clearStorage = data => {
  return Storage.clearAll();
};
const setRememberMeStatus = data => {
  return Storage.set('remember_me', data);
};
const getRememberMeStatus = data => {
  return Storage.getBoolean('remember_me');
};

const StorageItems = {
  storeUserToken,
  getUserToken,
  clearStorage,
  setRememberMeStatus,
  getRememberMeStatus,
};
export default StorageItems;
