// ToastService.js
let toastRef = null;

export const setToastRef = (ref) => {
  toastRef = ref;
};

export const showToast = (message) => {
  if (toastRef) {
    toastRef(message);
  }
};
