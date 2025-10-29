const CalculatePercentage = ({initialValue, finalValue}) => {
  const difference = finalValue - initialValue;
  const percentage = (difference / Math.abs(initialValue)) * 100;

  return percentage.toFixed(2);
};

export default CalculatePercentage;
