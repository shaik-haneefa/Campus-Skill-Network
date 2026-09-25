const User = require('../models/User');
const Skill = require('../models/Skill');
const Session = require('../models/Session');
const MentorshipRequest = require('../models/MentorshipRequest');
const Location = require('../models/Location');
const Feedback = require('../models/Feedback');

// @desc    Get aggregate metrics and system reports
// @route   GET /api/admin/reports
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments();
    const totalMentors = await User.countDocuments({ 'skills.0': { $exists: true } });
    const totalSkills = await Skill.countDocuments();
    const totalSessions = await Session.countDocuments();
    const completedSessions = await Session.countDocuments({ status: 'completed' });
    const pendingRequests = await MentorshipRequest.countDocuments({ status: 'pending' });
    const totalLocations = await Location.countDocuments({ isActive: true });

    // Average platform rating
    const feedbacks = await Feedback.find();
    let averageRating = 5.0;
    if (feedbacks.length > 0) {
      const sum = feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
      averageRating = Number((sum / feedbacks.length).toFixed(1));
    }

    // Recent activity
    const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);
    const recentSessions = await Session.find()
      .populate('learner', 'name')
      .populate('mentor', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalStudents,
      totalMentors,
      totalSkills,
      totalSessions,
      completedSessions,
      pendingRequests,
      totalLocations,
      averageRating,
      recentUsers,
      recentSessions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching admin metrics' });
  }
};

// @desc    Get all users for admin management
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { search, role, status } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      const reg = new RegExp(search.trim(), 'i');
      query.$or = [{ name: reg }, { email: reg }, { studentId: reg }, { department: reg }];
    }

    if (role && role !== 'All') {
      query.role = role;
    }

    if (status && status !== 'All') {
      query.isActive = status === 'active';
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching users for admin' });
  }
};

// @desc    Activate or deactivate user account
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot deactivate your own admin account' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error toggling user status' });
  }
};

// @desc    Toggle user role (student <-> admin)
// @route   PUT /api/admin/users/:id/toggle-role
// @access  Private/Admin
const toggleUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot alter your own admin role' });
    }

    user.role = user.role === 'admin' ? 'student' : 'admin';
    await user.save();

    res.json({ message: `Role changed to ${user.role}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating user role' });
  }
};

// --- CAMPUS LOCATIONS MANAGEMENT ---

// @desc    Get all campus locations
// @route   GET /api/locations
// @access  Public
const getLocations = async (req, res) => {
  try {
    // If not admin, return only active
    const isAdmin = req.user && req.user.role === 'admin';
    const query = isAdmin ? {} : { isActive: true };
    const locations = await Location.find(query).sort({ name: 1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching locations' });
  }
};

// @desc    Create campus location
// @route   POST /api/locations
// @access  Private/Admin
const createLocation = async (req, res) => {
  try {
    const { name, building, description } = req.body;
    if (!name || !building) {
      return res.status(400).json({ message: 'Location name and building are required' });
    }

    const existing = await Location.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ message: 'A location with this name already exists' });
    }

    const location = await Location.create({
      name: name.trim(),
      building: building.trim(),
      description: description || '',
      isActive: true,
    });

    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating location' });
  }
};

// @desc    Update campus location
// @route   PUT /api/locations/:id
// @access  Private/Admin
const updateLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const { name, building, description, isActive } = req.body;
    if (name) location.name = name.trim();
    if (building) location.building = building.trim();
    if (description !== undefined) location.description = description;
    if (isActive !== undefined) location.isActive = isActive;

    await location.save();
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating location' });
  }
};

// @desc    Delete campus location
// @route   DELETE /api/locations/:id
// @access  Private/Admin
const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    await location.deleteOne();
    res.json({ message: 'Location removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting location' });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  toggleUserRole,
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
};
