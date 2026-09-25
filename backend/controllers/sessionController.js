const Session = require('../models/Session');
const MentorshipRequest = require('../models/MentorshipRequest');
const Availability = require('../models/Availability');
const User = require('../models/User');
const Feedback = require('../models/Feedback');
const { createNotification } = require('../services/notificationService');

// @desc    Schedule a new mentorship session
// @route   POST /api/sessions
// @access  Private
const createSession = async (req, res) => {
  try {
    const { mentorshipRequestId, slotId, date, startTime, endTime, location, notes } = req.body;
    const learnerId = req.user._id;

    if (!location) {
      return res.status(400).json({ message: 'Campus meeting location is required' });
    }

    let finalMentorId;
    let finalSkill;
    let finalDate = date;
    let finalStartTime = startTime;
    let finalEndTime = endTime;

    if (mentorshipRequestId) {
      const request = await MentorshipRequest.findById(mentorshipRequestId);
      if (!request) {
        return res.status(404).json({ message: 'Mentorship request not found' });
      }

      if (request.learner.toString() !== learnerId.toString()) {
        return res.status(403).json({ message: 'Only the requesting learner can schedule this session' });
      }

      if (request.status !== 'accepted') {
        return res.status(400).json({ message: 'Can only schedule sessions for accepted requests' });
      }

      finalMentorId = request.mentor;
      finalSkill = request.skill;
    } else {
      const { mentorId, skill } = req.body;
      if (!mentorId || !skill) {
        return res.status(400).json({ message: 'Mentor and skill are required' });
      }
      finalMentorId = mentorId;
      finalSkill = skill;
    }

    // If slotId is provided, get date and time from Availability
    if (slotId) {
      const slot = await Availability.findById(slotId);
      if (!slot) {
        return res.status(404).json({ message: 'Selected time slot not found' });
      }
      if (slot.isBooked) {
        return res.status(400).json({ message: 'This time slot has already been booked by another student' });
      }
      finalDate = slot.date;
      finalStartTime = slot.startTime;
      finalEndTime = slot.endTime;

      // Mark slot as booked
      slot.isBooked = true;
      await slot.save();
    }

    if (!finalDate || !finalStartTime || !finalEndTime) {
      return res.status(400).json({ message: 'Session date, start time, and end time are required' });
    }

    const session = await Session.create({
      learner: learnerId,
      mentor: finalMentorId,
      skill: finalSkill,
      date: finalDate,
      startTime: finalStartTime,
      endTime: finalEndTime,
      location,
      notes: notes || '',
      mentorshipRequestId: mentorshipRequestId || null,
      status: 'scheduled',
    });

    // Notify mentor
    await createNotification({
      userId: finalMentorId,
      title: 'Session Scheduled! 📅',
      message: `${req.user.name} scheduled your session for ${finalSkill} on ${finalDate} (${finalStartTime} - ${finalEndTime}) at ${location}.`,
      type: 'session',
      link: '/sessions',
    });

    const populated = await Session.findById(session._id)
      .populate('learner', 'name email profileImage department year')
      .populate('mentor', 'name email profileImage department year rating');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({ message: error.message || 'Error scheduling session' });
  }
};

// @desc    Get all sessions for current user (upcoming, completed, or cancelled)
// @route   GET /api/sessions
// @access  Private
const getSessions = async (req, res) => {
  try {
    const { status, role } = req.query;
    const userId = req.user._id;

    let query = {};

    if (role === 'mentor') {
      query.mentor = userId;
    } else if (role === 'learner') {
      query.learner = userId;
    } else {
      query.$or = [{ learner: userId }, { mentor: userId }];
    }

    if (status && status !== 'All') {
      query.status = status.toLowerCase();
    }

    const sessions = await Session.find(query)
      .populate('learner', 'name email profileImage department year college')
      .populate('mentor', 'name email profileImage department year college rating')
      .sort({ date: -1, startTime: -1 });

    // Also check which sessions already have feedback
    const sessionsWithFeedback = await Promise.all(
      sessions.map(async (sess) => {
        const hasFeedback = await Feedback.exists({ session: sess._id });
        return {
          ...sess.toObject(),
          hasFeedback: !!hasFeedback,
        };
      })
    );

    res.json(sessionsWithFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching sessions' });
  }
};

// @desc    Get session details by ID
// @route   GET /api/sessions/:id
// @access  Private
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('learner', 'name email profileImage department year college')
      .populate('mentor', 'name email profileImage department year college rating');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const userId = req.user._id.toString();
    if (session.learner._id.toString() !== userId && session.mentor._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this session' });
    }

    const feedback = await Feedback.findOne({ session: session._id });

    res.json({
      session,
      feedback,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching session' });
  }
};

// @desc    Complete a session
// @route   PUT /api/sessions/:id/complete
// @access  Private
const completeSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('learner', 'name email')
      .populate('mentor', 'name email');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const userId = req.user._id.toString();
    if (session.learner._id.toString() !== userId && session.mentor._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to complete this session' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ message: 'Session is already marked as completed' });
    }

    session.status = 'completed';
    await session.save();

    // Increment completed sessions count on both mentor and learner
    await User.findByIdAndUpdate(session.mentor._id, { $inc: { sessionsCompleted: 1 } });
    await User.findByIdAndUpdate(session.learner._id, { $inc: { sessionsCompleted: 1 } });

    // Notify learner to leave feedback
    await createNotification({
      userId: session.learner._id,
      title: 'Session Completed! Rate Your Experience ⭐',
      message: `Your session with ${session.mentor.name} on ${session.skill} is complete. Please share your rating & feedback!`,
      type: 'feedback',
      link: `/feedback/${session._id}`,
    });

    res.json({ message: 'Session marked as completed successfully', session });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error completing session' });
  }
};

// @desc    Cancel a session
// @route   PUT /api/sessions/:id/cancel
// @access  Private
const cancelSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const userId = req.user._id.toString();
    if (session.learner.toString() !== userId && session.mentor.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this session' });
    }

    session.status = 'cancelled';
    await session.save();

    const recipientId = session.learner.toString() === userId ? session.mentor : session.learner;
    await createNotification({
      userId: recipientId,
      title: 'Session Cancelled ⚠️',
      message: `${req.user.name} had to cancel the session scheduled for ${session.date}.`,
      type: 'session',
      link: '/sessions',
    });

    res.json({ message: 'Session cancelled successfully', session });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error cancelling session' });
  }
};

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  completeSession,
  cancelSession,
};
