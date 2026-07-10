const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id).select('isActive');
    if (!currentUser || !currentUser.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') 
    return res.status(403).json({ message: 'Admin access required' });
  next();
};

const isStoreOwner = (req, res, next) => {
  if (req.user.role !== 'store_owner') 
    return res.status(403).json({ message: 'Store owner access required' });
  next();
};

const isCustomer = (req, res, next) => {
  if (req.user.role !== 'customer') 
    return res.status(403).json({ message: 'Customer access required' });
  next();
};

const isCourier = (req, res, next) => {
  if (req.user.role !== 'courier') 
    return res.status(403).json({ message: 'Courier access required' });
  next();
};

module.exports = { auth, isAdmin, isStoreOwner, isCustomer };