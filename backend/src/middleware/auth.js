const jwt = require('jsonwebtoken');

function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  
  const token = authHeader.substring(7);
  const secret = process.env.JWT_SECRET;
  
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

function generateToken(payload) {
  const secret = process.env.JWT_SECRET;
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

module.exports = {
  verifyToken,
  generateToken
};
