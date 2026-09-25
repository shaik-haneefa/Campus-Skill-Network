const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  toggleUserRole,
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All admin routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

router.get('/reports', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.put('/users/:id/toggle-role', toggleUserRole);

// Locations admin endpoints
router.post('/locations', createLocation);
router.put('/locations/:id', updateLocation);
router.delete('/locations/:id', deleteLocation);

module.exports = router;
