const Notification = require('../models/Notification');

let ioInstance = null;

const setSocketIO = (io) => {
  ioInstance = io;
};

/**
 * Create a new notification and push via Socket.io if recipient is online
 */
const createNotification = async ({ userId, title, message, type = 'system', link = '' }) => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      link,
    });

    if (ioInstance) {
      // Emit to the specific user's socket room: "user_<userId>"
      ioInstance.to(`user_${userId.toString()}`).emit('newNotification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};

module.exports = {
  setSocketIO,
  createNotification,
};
