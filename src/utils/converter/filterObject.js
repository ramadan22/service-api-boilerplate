const filter = (object, keyFilter) => {
  const objectUpdate = object;

  Object.keys(object).filter((item) => keyFilter.includes(item)).forEach((item) => {
    delete objectUpdate[item];
  });

  return objectUpdate;
};

module.exports = {
  filter,
};
