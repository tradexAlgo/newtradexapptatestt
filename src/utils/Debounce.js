let stockTimer;

const Debounce = ({func, delay}) => {
  return new Promise(resolve => {
    clearTimeout(stockTimer);

    stockTimer = setTimeout(async () => {
      const data = await func();
      resolve(data);
    }, delay);
  });
};

export default Debounce;
