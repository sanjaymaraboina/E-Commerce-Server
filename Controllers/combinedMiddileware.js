const jwt = require('jsonwebtoken');
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;
const USER_JWT_SECRET = process.env.USER_JWT_SECRET;

exports.combinedAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('Access denied');
  }

  const token = authHeader.split(' ')[1];

  try {
    let decoded;
    try {
      decoded = jwt.verify(token, ADMIN_JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      decoded = jwt.verify(token, USER_JWT_SECRET);
      req.user = decoded;
      next();
    }
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};

