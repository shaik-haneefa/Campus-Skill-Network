const MentorshipRequest = require('../models/MentorshipRequest');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');

// @desc    Send a new mentorship request
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res) => {
  try {
    const { mentorId, skill, message, preferredDate, preferredTime } = req.body;
    const learnerId = req.user._id;

    if (!mentorId || !skill || !message) {
      return res.status(400).json({ message: 'Mentor, skill, and message are required' });
    }

    if (mentorId.toString() === learnerId.toString()) {
      return res.status(400).json({ message: 'You cannot send a mentorship request to yourself' });
    }

    const mentor = await User.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Check if an active/pending request already exists between them for this skill
    const existing = await MentorshipRequest.findOne({
      learner: learnerId,
      mentor: mentorId,
      skill,
      status: { $in: ['pending', 'accepted'] },
    });

    if (existing) {
      return res.status(400).json({
        message: `You already have an active or pending request with ${mentor.name} for ${skill}`,
      });
    }

    const request = await MentorshipRequest.create({
      learner: learnerId,
      mentor: mentorId,
      skill,
      message,
      preferredDate: preferredDate || '',
      preferredTime: preferredTime || '',
      status: 'pending',
    });

    // Notify mentor
    await createNotification({
      userId: mentorId,
      title: 'New Mentorship Request',
      message: `${req.user.name} sent you a mentorship request for ${skill}.`,
      type: 'request',
      link: '/requests',
    });

    const populated = await MentorshipRequest.findById(request._id)
      .populate('mentor', 'name profileImage department year rating')
      .populate('learner', 'name profileImage department year rating');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: error.message || 'Error sending mentorship request' });
  }
};

// @desc    Get requests sent by current user
// @route   GET /api/requests/sent
// @access  Private
const getSentRequests = async (req, res) => {
  try {
    const requests = await MentorshipRequest.find({ learner: req.user._id })
      .populate('mentor', 'name email profileImage department year college rating')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching sent requests' });
  }
};

// @desc    Get requests received by current user as a mentor
// @route   GET /api/requests/received
// @access  Private
const getReceivedRequests = async (req, res) => {
  try {
    const requests = await MentorshipRequest.find({ mentor: req.user._id })
      .populate('learner', 'name email profileImage department year college rating')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching received requests' });
  }
};

// @desc    Accept a mentorship request (by mentor)
// @route   PUT /api/requests/:id/accept
// @access  Private
const acceptRequest = async (req, res) => {
  try {
    const request = await MentorshipRequest.findById(req.params.id)
      .populate('learner', 'name email')
      .populate('mentor', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.mentor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the requested mentor can accept this request' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: `Request is already ${request.status}` });
    }

    request.status = 'accepted';
    await request.save();

    // Notify learner
    await createNotification({
      userId: request.learner._id,
      title: 'Mentorship Request Accepted! 🎉',
      message: `${req.user.name} accepted your request for ${request.skill}. You can now schedule a session!`,
      type: 'request',
      link: '/schedule/' + request._id,
    });

    res.json({ message: 'Request accepted successfully', request });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error accepting request' });
  }
};

// @desc    Reject a mentorship request (by mentor)
// @route   PUT /api/requests/:id/reject
// @access  Private
const rejectRequest = async (req, res) => {
  try {
    const request = await MentorshipRequest.findById(req.params.id).populate('learner', 'name');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the requested mentor can reject this request' });
    }

    request.status = 'rejected';
    await request.save();

    // Notify learner
    await createNotification({
      userId: request.learner,
      title: 'Mentorship Request Update',
      message: `${req.user.name} was unable to accept your request for ${request.skill} at this time.`,
      type: 'request',
      link: '/requests',
    });

    res.json({ message: 'Request rejected', request });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error rejecting request' });
  }
};

// @desc    Cancel a mentorship request (by learner)
// @route   PUT /api/requests/:id/cancel
// @access  Private
const cancelRequest = async (req, res) => {
  try {
    const request = await MentorshipRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.learner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the learner can cancel this request' });
    }

    request.status = 'cancelled';
    await request.save();

    res.json({ message: 'Request cancelled successfully', request });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error cancelling request' });
  }
};

module.exports = {
  createRequest,
  getSentRequests,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
};
