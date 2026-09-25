const Skill = require('../models/Skill');
const User = require('../models/User');

const CATEGORIES = [
  'Programming',
  'Web Development',
  'Data Science',
  'AI/ML',
  'Aptitude',
  'Communication',
  'Sports',
  'Music',
  'Arts',
  'Other',
];

// @desc    Get all skills from catalog with mentor counts
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { name: new RegExp(search.trim(), 'i') },
        { description: new RegExp(search.trim(), 'i') },
      ];
    }

    const skills = await Skill.find(query).sort({ name: 1 });

    // Aggregate mentors count for each skill
    const skillsWithMentorCount = await Promise.all(
      skills.map(async (sk) => {
        const mentorCount = await User.countDocuments({
          'skills.name': { $regex: new RegExp(`^${sk.name}$`, 'i') },
          isActive: true,
        });
        return {
          ...sk.toObject(),
          mentorCount,
        };
      })
    );

    res.json(skillsWithMentorCount);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching skills' });
  }
};

// @desc    Get all skill categories
// @route   GET /api/skills/categories
// @access  Public
const getCategories = (req, res) => {
  res.json(CATEGORIES);
};

// @desc    Create a new skill
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res) => {
  try {
    const { name, category, description } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Skill name is required' });
    }

    const existingSkill = await Skill.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (existingSkill) {
      return res.status(400).json({ message: 'A skill with this name already exists' });
    }

    const skill = await Skill.create({
      name: name.trim(),
      category: category || 'Other',
      description: description || '',
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating skill' });
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private/Admin
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const { name, category, description } = req.body;
    if (name) skill.name = name.trim();
    if (category) skill.category = category;
    if (description !== undefined) skill.description = description;

    const updatedSkill = await skill.save();
    res.json(updatedSkill);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating skill' });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    await skill.deleteOne();
    res.json({ message: 'Skill removed from catalog' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting skill' });
  }
};

module.exports = {
  getSkills,
  getCategories,
  createSkill,
  updateSkill,
  deleteSkill,
};
