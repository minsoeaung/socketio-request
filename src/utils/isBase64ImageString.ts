const isBase64ImageString = (str: unknown): boolean => {
  if (typeof str === 'string') {
    return /data:image\/[^;]+;base64[^"]+/i.test(str);
  } else {
    return false;
  }
}

export default isBase64ImageString;
