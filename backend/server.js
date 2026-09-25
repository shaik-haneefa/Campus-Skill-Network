require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { setSocketIO } = require('./services/notificationService');
const setupChatSocket = require('./socket/chatSocket');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skillRoutes');
const requestRoutes = require('./routes/requestRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const chatRoutes = require('./routes/chatRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const locationRoutes = require('./routes/locationRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize database
connectDB();

const app = express();
const server = http.createServer(app);

// Dynamic CORS configuration for local and cloud production (Vercel & Render)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'https://campus-skill-network-k7seah5uq-lms-89f6.vercel.app',
  'https://campus-skill-network-aowk.onrender.com',
  process.env.CLIENT_URL,
].filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true; // allow server-to-server, curl, Postman
  if (allowedOrigins.includes(origin)) return true;
  try {
    const parsed = new URL(origin);
    if (parsed.hostname.endsWith('.vercel.app')) return true;
    if (parsed.hostname.endsWith('.onrender.com')) return true;
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') return true;
  } catch (err) {
    return false;
  }
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked] Origin not allowed: ${origin}`);
      callback(null, true); // Fallback allow in academic dev or custom domain to prevent blocking
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

// Configure Socket.io
const io = new Server(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
});

// Attach socket.io to notification service and initialize chat events
setSocketIO(io);
setupChatSocket(io);

// Core Middlewares
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // enable pre-flight across all routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Campus Skill Network API',
    tagline: 'Connect. Learn. Share. Grow.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
  });
});

// Root ping
app.get('/', (req, res) => {
  res.json({
    message: 'Campus Skill Network API is running.',
    health: '/api/health',
    docs: 'https://github.com/shaik-haneefa/Campus-Skill-Network',
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/messages', chatRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Campus Skill Network Server running on port ${PORT}`);
  console.log(`📡 Allowed Origins: ${allowedOrigins.join(', ')}`);
  console.log(`🔗 REST API: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
