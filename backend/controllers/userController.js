const User = require('../models/User');
const Feedback = require('../models/Feedback');

// @desc    Get all students/mentors with search and filtering
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
  try {
    const { search, skill, category, department, year, sort } = req.query;
    let query = { isActive: true };

    // Search keyword across name, bio, department, skills
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { bio: searchRegex },
        { department: searchRegex },
        { 'skills.name': searchRegex },
      ];
    }

    // Filter by specific skill
    if (skill && skill.trim() !== '') {
      query['skills.name'] = new RegExp(skill.trim(), 'i');
    }

    // Filter by skill category
    if (category && category !== 'All') {
      query['skills.category'] = category;
    }

    // Filter by department
    if (department && department !== 'All') {
      query.department = department;
    }

    // Filter by year
    if (year && year !== 'All') {
      query.year = year;
    }

    // Sorting
    let sortOption = { rating: -1, sessionsCompleted: -1, createdAt: -1 };
    if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'sessions') {
      sortOption = { sessionsCompleted: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const users = await User.find(query)
      .select('-password')
      .sort(sortOption);

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message || 'Server error fetching students' });
  }
};

// @desc    Get user profile by ID with reviews
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Get feedback/reviews received by this user as a mentor
    const reviews = await Feedback.find({ mentor: user._id })
      .populate('learner', 'name profileImage department year')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching student profile' });
  }
};

// @desc    Update current user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, bio, department, year, college, profileImage } = req.body;

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (department) user.department = department;
    if (year) user.year = year;
    if (college) user.college = college;
    if (profileImage !== undefined) user.profileImage = profileImage;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error updating profile' });
  }
};

// @desc    Add a skill to current student profile
// @route   POST /api/users/skills
// @access  Private
const addSkill = async (req, res) => {
  try {
    const { name, category, level, description } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Skill name is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if skill already offered
    const alreadyExists = user.skills.some(
      (s) => s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (alreadyExists) {
      return res.status(400).json({ message: 'You have already added this skill to your profile' });
    }

    user.skills.push({
      name: name.trim(),
      category: category || 'Programming',
      level: level || 'Intermediate',
      description: description || '',
    });

    await user.save();
    res.status(201).json(user.skills);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error adding skill' });
  }
};

// @desc    Remove a skill from current student profile
// @route   DELETE /api/users/skills/:skillName
// @access  Private
const removeSkill = async (req, res) => {
  try {
    const skillName = req.params.skillName;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.skills = user.skills.filter(
      (s) => s.name.toLowerCase() !== decodeURIComponent(skillName).toLowerCase()
    );

    await user.save();
    res.json(user.skills);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error removing skill' });
  }
};

// @desc    Update skills the student wants to learn (interests)
// @route   PUT /api/users/interests
// @access  Private
const updateInterests = async (req, res) => {
  try {
    const { interests } = req.body;
    if (!Array.isArray(interests)) {
      return res.status(400).json({ message: 'Interests must be an array of skill names' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.interests = interests.map((i) => i.trim()).filter((i) => i.length > 0);
    await user.save();

    res.json(user.interests);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating learning interests' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateProfile,
  addSkill,
  removeSkill,
  updateInterests,
};
