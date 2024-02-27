const defaultResponse = ({ res, status, message = null, messageUser = null, data = null, meta = null }) => {
  const payload = {
    status,
    message,
    messageUser,
    data,
  }

  if (meta !== null) payload.meta = meta;

  res.status(status).json(payload);
}

const responseLocal = ({ status, message, messageUser = '' }) => {
  return {
    status,
    message,
    messageUser,
    data: null,
  };
}

const responseErrorServer = (res, error) => {
  res.status(500).json({
    message: 'Server Error',
    serverMessage: error,
  });
};

module.exports = {
  responseErrorServer,
  responseLocal,
  defaultResponse,
};
