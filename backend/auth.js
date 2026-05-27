const jwt = require('jsonwebtoken');
const { User } = require('./models');

const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EDITOR: 'editor',
};

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const user = await User.findOne({ id: decoded.id }).lean();
    if (!user || user.status === 'disabled') {
      return res.status(401).json({ message: 'Account inactive or not found' });
    }
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid' });
  }
};

const requireRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You do not have permission for this action' });
  }
  next();
};

const superAdminOnly = requireRoles(ROLES.SUPER_ADMIN);
const contentManagers = requireRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR);
const adminOrSuper = requireRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN);

const adminOnly = adminOrSuper;

module.exports = {
  ROLES,
  protect,
  requireRoles,
  superAdminOnly,
  contentManagers,
  adminOrSuper,
  adminOnly,
};
