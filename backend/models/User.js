const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    default: 'Other',
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate',
  },
  description: {
    type: String,
    default: '',
  },
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide college email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Do not expose password hashes in general queries
    },
    studentId: {
      type: String,
      required: [true, 'Please provide Student ID'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Please provide Department'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Please provide Year of study'],
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'],
      default: '2nd Year',
    },
    college: {
      type: String,
      default: 'Campus University of Technology',
      trim: true,
    },
    bio: {
      type: String,
      default: 'Passionate student eager to learn and share skills with peers.',
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    skills: [skillSchema],
    interests: [{
      type: String,
      trim: true,
    }],
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    isVerified: {
      type: Boolean,
      default: true, // Configured for immediate student onboarding in local dev
    },
    verificationToken: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    sessionsCompleted: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
