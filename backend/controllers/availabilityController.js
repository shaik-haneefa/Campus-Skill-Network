const Availability = require('../models/Availability');

// @desc    Add mentor availability slot
// @route   POST /api/availability
// @access  Private
const createAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;
    const mentorId = req.user._id;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ message: 'Date, start time, and end time are required' });
    }

    // Check for overlap or duplicate
    const existing = await Availability.findOne({
      mentor: mentorId,
      date,
      startTime,
      endTime,
    });

    if (existing) {
      return res.status(400).json({ message: 'You already added this time slot' });
    }

    const slot = await Availability.create({
      mentor: mentorId,
      date,
      startTime,
      endTime,
      isBooked: false,
    });

    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating availability slot' });
  }
};

// @desc    Get availability slots for a mentor (or current user)
// @route   GET /api/availability/:mentorId?
// @access  Public
const getMentorAvailability = async (req, res) => {
  try {
    const mentorId = req.params.mentorId || (req.user ? req.user._id : null);
    if (!mentorId) {
      return res.status(400).json({ message: 'Mentor ID is required' });
    }

    const { availableOnly } = req.query;
    let query = { mentor: mentorId };
    if (availableOnly === 'true') {
      query.isBooked = false;
    }

    const slots = await Availability.find(query).sort({ date: 1, startTime: 1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching availability' });
  }
};

// @desc    Delete an availability slot
// @route   DELETE /api/availability/:id
// @access  Private
const deleteAvailability = async (req, res) => {
  try {
    const slot = await Availability.findById(req.params.id);
    if (!slot) {
      return res.status(404).json({ message: 'Availability slot not found' });
    }

    if (slot.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to remove this slot' });
    }

    if (slot.isBooked) {
      return res.status(400).json({ message: 'Cannot delete a slot that is already booked for a session' });
    }

    await slot.deleteOne();
    res.json({ message: 'Availability slot removed' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error removing slot' });
  }
};

module.exports = {
  createAvailability,
  getMentorAvailability,
  deleteAvailability,
};
