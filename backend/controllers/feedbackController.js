const Feedback = require('../models/Feedback');
const Session = require('../models/Session');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');

// @desc    Submit feedback and rating for a completed session
// @route   POST /api/feedback
// @access  Private
const createFeedback = async (req, res) => {
  try {
    const { sessionId, rating, comment } = req.body;
    const learnerId = req.user._id;

    if (!sessionId || !rating || !comment) {
      return res.status(400).json({ message: 'Session ID, rating, and comment are required' });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({ message: 'Feedback can only be provided for completed sessions' });
    }

    if (session.learner.toString() !== learnerId.toString()) {
      return res.status(403).json({ message: 'Only the learner can submit feedback for this session' });
    }

    // Check if feedback already exists for this session
    const existingFeedback = await Feedback.findOne({ session: sessionId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'You have already submitted feedback for this session' });
    }

    const feedback = await Feedback.create({
      session: sessionId,
      learner: learnerId,
      mentor: session.mentor,
      rating: numRating,
      comment: comment.trim(),
    });

    // Recalculate mentor's average rating
    const mentorFeedbacks = await Feedback.find({ mentor: session.mentor });
    const totalReviews = mentorFeedbacks.length;
    const sumRatings = mentorFeedbacks.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = Number((sumRatings / totalReviews).toFixed(1));

    await User.findByIdAndUpdate(session.mentor, {
      rating: averageRating,
      ratingsCount: totalReviews,
    });

    // Notify mentor of new rating
    await createNotification({
      userId: session.mentor,
      title: `New Review Received! (${numRating}★)`,
      message: `${req.user.name} reviewed your session on ${session.skill}: "${comment.substring(0, 45)}..."`,
      type: 'feedback',
      link: `/profile/${session.mentor}`,
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ message: error.message || 'Error submitting feedback' });
  }
};

// @desc    Get feedback/reviews for a specific mentor
// @route   GET /api/feedback/:mentorId
// @access  Public
const getMentorFeedback = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const feedbacks = await Feedback.find({ mentor: mentorId })
      .populate('learner', 'name profileImage department year')
      .populate('session', 'skill date')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching reviews' });
  }
};

module.exports = {
  createFeedback,
  getMentorFeedback,
};
