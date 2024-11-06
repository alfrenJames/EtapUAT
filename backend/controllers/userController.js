const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation
const dotenv = require('dotenv');
dotenv.config();

// Function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30m',
  });
};

exports.createUser = async (req, res) => {
  try {
    const {
      lastName,
      firstName,
      course,
      section,
      emailAddress,
      contactNumber,
      idUrl,
      password,
      creditAmount,
      creditTime,
      status,
    } = req.body;

    const newUser = new User({
      lastName,
      firstName,
      course,
      section,
      emailAddress,
      contactNumber,
      idUrl,
      password,
      creditAmount,
      creditTime,
      status,
      createdBy: req.admin._id,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select('-password');
//     res.json(users);
//   } catch (error) {
//     console.error('Get all users error:', error);
//     res.status(500).json({ message: 'Error fetching users', error: error.message });
//   }
// };
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('createdBy', 'username').select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
      const user = await User.findById(req.params.id).select('-password'); // Exclude password
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

exports.deactivateUser = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status: 'inactive' },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'User deactivated successfully', user });
    } catch (error) {
      console.error('Deactivate user error:', error);
      res.status(500).json({ message: 'Error deactivating user', error: error.message });
    }
  };

  exports.activateUser = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status: 'active' },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'User activated successfully', user });
    } catch (error) {
      console.error('Activate user error:', error);
      res.status(500).json({ message: 'Error activating user', error: error.message });
    }
  };

  exports.updateUser = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  };

  exports.getUserCounts = async (req, res) => {
    try {
      const counts = await User.aggregate([
        {
          $group: {
            _id: null,
            active: {
              $sum: {
                $cond: [{ $eq: ["$status", "active"] }, 1, 0]
              }
            },
            inactive: {
              $sum: {
                $cond: [{ $eq: ["$status", "inactive"] }, 1, 0]
              }
            },
            suspended: {
              $sum: {
                $cond: [{ $eq: ["$status", "suspended"] }, 1, 0]
              }
            }
          }
        }
      ]);
  
      const result = counts.length > 0 ? counts[0] : { active: 0, inactive: 0, suspended: 0 };
      delete result._id;
  
      res.json(result);
    } catch (error) {
      console.error('Error getting user counts:', error);
      res.status(500).json({ message: 'Error getting user counts', error: error.message });
    }
  };

  // Update user credit information
exports.updateCredits = async (req, res) => {
  const { creditAmount, creditTime } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.creditAmount = creditAmount;
    user.creditTime = creditTime;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user credits', error });
  }
};

// Login function
exports.login = async (req, res) => {
  const { emailAddress, password } = req.body;

  try {
    const user = await User.findOne({ emailAddress });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if user status is active
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account is not active. Please contact an administrator.' });
    }

    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      res.json({
        _id: user._id,
        lastName: user.lastName,
        firstName: user.firstName,
        emailAddress: user.emailAddress,
        token: generateToken(user._id),
      });
      console.log('Login successful for user:', emailAddress);
    } else {
      console.log('Password mismatch for user:', emailAddress);
      res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register function
exports.register = async (req, res) => {
  const { lastName, firstName, course, section, emailAddress, contactNumber, idUrl, password, status } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ emailAddress });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      lastName,
      firstName,
      course,
      section,
      emailAddress,
      contactNumber,
      idUrl,
      password,
      status, // Set default status to active
      creditAmount: 0, // Set default credit amount
      creditTime: 0, // Set default credit time
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        lastName: user.lastName,
        firstName: user.firstName,
        emailAddress: user.emailAddress,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};
