/**
 * User Controller
 *
 * Handles all user-related operations:
 * - User authentication (login)
 * - User registration with password hashing
 * - Profile retrieval and updates
 * - Password reset functionality
 * - User role management
 *
 * Each function corresponds to a specific API endpoint and implements
 * the business logic for that operation, including validation and error handling.
 */
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.fullname,
        email: user.email,
        isAdmin: user.isAdmin,        
        role: user.role, 
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      fullname: name,
      email,
      password,
      phone,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.fullname,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.fullname,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/users/doctors
// @access  Public
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find(
      { isDoctor: true },
      { fullname: 1, email: 1, _id: 1 } // only return necessary fields
    );

    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching doctors' });
  }
};

// @desc    Get all patients
// @route   GET /api/users/patients
// @access  Public
const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find(
      { isDoctor: false }, // Only non-doctors (patients)
      { fullname: 1, email: 1, phone: 1, _id: 1 } // Return only necessary fields
    );

    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Server error fetching patients' });
  }
};

export {
  authUser,
  registerUser,
  getUserProfile,
  getAllDoctors,
  getAllPatients,
};
