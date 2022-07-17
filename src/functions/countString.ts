export const countString = (str: string) => {
  let len = 0;
  const strArr = str.split("");

  strArr.forEach((item) => {
    item.match(/[ -~]/) ? (len += 1) : (len += 2);
  });

  return len;
};
