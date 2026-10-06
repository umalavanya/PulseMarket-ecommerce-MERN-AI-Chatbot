const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware that extracts user info from Bearer token if provided.
 * Does NOT reject requests without a token (unlike standard protect middleware).
 */
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecretjwtkey123456_ecommerce_app'
      );
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Invalid or expired token - proceed as unauthenticated user
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};

module.exports = { optionalAuth };
