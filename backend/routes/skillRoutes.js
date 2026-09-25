const express = require('express');
const router = express.Router();
const {
  getSkills,
  getCategories,
  createSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getSkills);
router.get('/categories', getCategories);
router.post('/', protect, createSkill);
router.put('/:id', protect, adminOnly, updateSkill);
router.delete('/:id', protect, adminOnly, deleteSkill);

module.exports = router;
