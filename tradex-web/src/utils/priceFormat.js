const priceFormat = amount => {
  if (amount) {
    const price = new Intl.NumberFormat('en-US').format(amount);
    return price;
  }
  return 0;
};

export default priceFormat;
