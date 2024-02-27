const validApiKeys = [process.env.X_API_KEY];

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.get('x-api-key');

  if (!apiKey || !validApiKeys.includes(apiKey)) {
    return res.status(401).json({ error: 'Unauthorized - Invalid API key' });
  }

  next();
};

module.exports = apiKeyMiddleware;