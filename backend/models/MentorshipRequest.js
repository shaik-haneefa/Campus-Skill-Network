const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema(
  {
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skill: {
      type: String,
      required: [true, 'Skill is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Request message is required'],
      trim: true,
    },
    preferredDate: {
      type: String,
      default: '',
    },
    preferredTime: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema);
