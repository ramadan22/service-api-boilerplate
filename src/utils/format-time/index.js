const defaultFormatTime = (date) => {
  return date.toLocaleString('id-ID', { timeZone: 'UTC' });
};

module.exports = {
  defaultFormatTime,
};