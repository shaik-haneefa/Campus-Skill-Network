const Message = require('../models/Message');
const { createNotification } = require('../services/notificationService');

const onlineUsers = new Map(); // userId -> Set of socketIds

const setupChatSocket = (io) => {
  io.on('connection', (socket) => {
    // 1. User registers their socket
    socket.on('registerUser', (userId) => {
      if (!userId) return;
      socket.userId = userId;
      socket.join(`user_${userId}`);

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);

      // Broadcast online status
      io.emit('onlineUsersList', Array.from(onlineUsers.keys()));
    });

    // 2. Join a specific conversation room
    socket.on('joinConversation', (conversationId) => {
      if (conversationId) {
        socket.join(`conv_${conversationId}`);
      }
    });

    // 3. Leave a specific conversation room
    socket.on('leaveConversation', (conversationId) => {
      if (conversationId) {
        socket.leave(`conv_${conversationId}`);
      }
    });

    // 4. Send Message via socket
    socket.on('sendMessage', async (data) => {
      try {
        const { sender, receiver, message, senderName } = data;
        if (!sender || !receiver || !message) return;

        const conversationId = Message.getConversationId(sender, receiver);

        // Save message to database
        const newMessage = await Message.create({
          sender,
          receiver,
          message: message.trim(),
          conversationId,
        });

        const populatedMessage = await Message.findById(newMessage._id)
          .populate('sender', 'name profileImage')
          .populate('receiver', 'name profileImage');

        // Emit message to conversation room and to receiver's user channel
        io.to(`conv_${conversationId}`).emit('receiveMessage', populatedMessage);
        io.to(`user_${receiver}`).emit('incomingMessage', populatedMessage);

        // Trigger notification for the receiver
        await createNotification({
          userId: receiver,
          title: `New message from ${senderName || 'a student'}`,
          message: message.length > 50 ? `${message.substring(0, 47)}...` : message,
          type: 'chat',
          link: '/chat',
        });
      } catch (err) {
        console.error('Socket sendMessage error:', err);
        socket.emit('messageError', { error: 'Failed to send message' });
      }
    });

    // 5. Typing indicators
    socket.on('typing', ({ conversationId, senderName }) => {
      socket.to(`conv_${conversationId}`).emit('userTyping', { conversationId, senderName });
    });

    socket.on('stopTyping', ({ conversationId }) => {
      socket.to(`conv_${conversationId}`).emit('userStopTyping', { conversationId });
    });

    // 6. Handle disconnect
    socket.on('disconnect', () => {
      if (socket.userId && onlineUsers.has(socket.userId)) {
        const userSockets = onlineUsers.get(socket.userId);
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(socket.userId);
        }
        io.emit('onlineUsersList', Array.from(onlineUsers.keys()));
      }
    });
  });
};

module.exports = setupChatSocket;
