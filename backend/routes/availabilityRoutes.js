const express = require('express');
const router = express.Router();
const {
  createAvailability,
  getMentorAvailability,
  deleteAvailability,
} = require('../controllers/availabilityController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createAvailability);
router.get('/:mentorId?', getMentorAvailability);
router.delete('/:id', protect, deleteAvailability);

module.exports = router;
