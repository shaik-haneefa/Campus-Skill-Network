const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  getSessionById,
  completeSession,
  cancelSession,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSession);
router.get('/', protect, getSessions);
router.get('/:id', protect, getSessionById);
router.put('/:id/complete', protect, completeSession);
router.put('/:id/cancel', protect, cancelSession);

module.exports = router;
