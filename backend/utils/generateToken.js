const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey123456_ecommerce_app', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
