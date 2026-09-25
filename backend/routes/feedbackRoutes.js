const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getMentorFeedback,
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createFeedback);
router.get('/:mentorId', getMentorFeedback);

module.exports = router;
