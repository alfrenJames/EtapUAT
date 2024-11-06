const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');  // Add this line

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the decoded token belongs to an admin or a user
    const admin = await Admin.findById(decoded.id).select('-password');
    const user = await User.findById(decoded.id).select('-password');

    if (admin) {
      req.admin = admin;
    } else if (user) {
      req.user = user;
    } else {
      throw new Error('User not found');
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
};

// New middleware to check if the authenticated user is an admin
exports.adminOnly = (req, res, next) => {
  if (req.admin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};