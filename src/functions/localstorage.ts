export const localstorageSave = (objectData: object) => {
  const objectKeys = Object.keys(objectData);
  const objectValues = Object.values(objectData);

  objectKeys.forEach((key, i) => {
    localStorage.setItem(key, objectValues[i]);
  });
};
