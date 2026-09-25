const express = require('express');
const router = express.Router();
const { getLocations } = require('../controllers/adminController');

// Public route to fetch active campus locations for scheduling sessions
router.get('/', getLocations);

module.exports = router;
