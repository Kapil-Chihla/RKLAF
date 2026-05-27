const crypto = require('crypto');

function signToken(payload) {
  const jwt = require('jsonwebtoken');
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
}

function inviteCode() {
  return crypto.randomBytes(24).toString('hex');
}

module.exports = { signToken, inviteCode };
