const checkNonEmpty = data => {
  if (Array.isArray(data) || typeof data === 'string') {
    return data.length > 0;
  } else if (typeof data === 'object' && data !== null) {
    return Object.keys(data).length > 0;
  } else {
    return false;
  }
};

export default checkNonEmpty;
