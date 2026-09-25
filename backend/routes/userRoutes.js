const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateProfile,
  addSkill,
  removeSkill,
  updateInterests,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/profile', protect, updateProfile);
router.post('/skills', protect, addSkill);
router.delete('/skills/:skillName', protect, removeSkill);
router.put('/interests', protect, updateInterests);

module.exports = router;
