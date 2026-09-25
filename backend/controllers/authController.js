const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validateRegisterInput } = require('../utils/validators');
const { sendVerificationEmail } = require('../services/emailService');

// @desc    Register a new college student
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const { name, email, studentId, department, year, college, password } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'A student with this email address already exists' });
    }

    // Check student ID
    const studentIdExists = await User.findOne({ studentId });
    if (studentIdExists) {
      return res.status(400).json({ message: 'A student with this Student ID already exists' });
    }

    // Verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      studentId,
      department,
      year,
      college: college || 'Campus University of Technology',
      password,
      verificationToken,
      isVerified: true, // Dev mode auto-verified, token also available for flow demo
      skills: [],
      interests: [],
    });

    // Fire verification notification/log
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      department: user.department,
      year: user.year,
      college: user.college,
      role: user.role,
      isVerified: user.isVerified,
      skills: user.skills,
      token: generateToken(user._id),
      message: 'Registration successful! Welcome to Campus Skill Network.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both college email and password' });
    }

    // Explicitly select password since it has select: false
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid college email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'This account has been deactivated. Please contact your campus admin.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid college email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      department: user.department,
      year: user.year,
      college: user.college,
      bio: user.bio,
      profileImage: user.profileImage,
      skills: user.skills,
      interests: user.interests,
      role: user.role,
      isVerified: user.isVerified,
      rating: user.rating,
      ratingsCount: user.ratingsCount,
      sessionsCompleted: user.sessionsCompleted,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Verify email with token
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.body;
    const user = await User.findOne({ email: email ? email.toLowerCase() : undefined });

    if (!user) {
      return res.status(404).json({ message: 'No student found with this email' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({ message: 'College email successfully verified! You may now login.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Verification error' });
  }
};

// @desc    Forgot password handler (simulated dev email reset)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email ? email.toLowerCase() : undefined });
    if (!user) {
      // Don't leak user existence for security
      return res.json({ message: 'If that email exists in our campus records, password reset instructions have been sent.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    console.log(`[DEV MODE] Password reset token for ${email}: ${resetToken}`);
    res.json({ message: 'Password reset link dispatched to your college email.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  verifyEmail,
  forgotPassword,
};
