import NetInfo from '@react-native-community/netinfo';
import messages from '../constants/helpers';

const checkInternet = async () => {
  const errorObj = {
    response: {
      data: {
        message: messages.CONNECTION_ERROR,
      },
    },
  };
  return new Promise(async (resolve, reject) => {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      reject(errorObj);
    }
    resolve(state.isConnected);
  });
};

export default checkInternet;
