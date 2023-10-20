const jwt = require('jsonwebtoken');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }

    if (!decodedToken.id) {
      return next(403);
    }

    req.user = decodedToken;
    next();
  });
};

module.exports.isAuthenticated = (req) => {
  if (req.user) {
    return true;
  }

  return false;
};

module.exports.isRole = (role, req) => (req.user.role === role);

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req, resp))
    ? next(401)
    : next()
);

module.exports.requireRole = (role) => (req, resp, next) => {
  if (!module.exports.isAuthenticated(req, resp)) {
    return next(401);
  }

  if (!module.exports.isRole(role, req)) {
    return next(403);
  }

  next();
};
