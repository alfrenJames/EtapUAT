const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Login admin
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    const isMatch = await admin.matchPassword(password);

    if (isMatch) {
      res.json({
        _id: admin._id,
        username: admin.username,
        avatar_url: admin.avatar_url,
        token: generateToken(admin._id),
      });
      console.log('Login successful for user:', username);
    } else {
      console.log('Password mismatch for user:', username);
      res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register admin
exports.register = async (req, res) => {
  const { username, avatar_url, password, secretKey } = req.body;


  try {
    // Check if the secret key is correct
    if (secretKey === process.env.ADMIN_SECRET_KEY) {
      console.log('Invalid secret key provided');
      return res.status(401).json({ message: 'Invalid secret key' });
    }

    // Check if admin already exists
    const adminExists = await Admin.findOne({ username });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create new admin
    const admin = await Admin.create({
      username,
      password,
      avatar_url,
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        username: admin.username,
        avatar_url: admin.avatar_url,
        token: generateToken(admin._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find(); // Retrieve all admin documents
    res.json(admins);
  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Function to update admin details
exports.updateAdmin = async (req, res) => {
  try {
    const adminId = req.params.id; // Get admin ID from request parameters
    const updatedData = req.body; // Get updated data from request body
    const admin = await Admin.findByIdAndUpdate(adminId, updatedData, { new: true });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add other admin controller functions here (e.g., getAllBikes, getAllTransactions, etc.)