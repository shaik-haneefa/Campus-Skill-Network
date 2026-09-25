const Message = require('../models/Message');
const User = require('../models/User');
const MentorshipRequest = require('../models/MentorshipRequest');
const Session = require('../models/Session');
const { createNotification } = require('../services/notificationService');

// @desc    Get all conversations for current user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // 1. Find all distinct users with whom there are messages
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    }).sort({ createdAt: -1 });

    const peerMap = new Map();

    for (const msg of messages) {
      const isSender = msg.sender.toString() === currentUserId.toString();
      const peerId = isSender ? msg.receiver.toString() : msg.sender.toString();

      if (!peerMap.has(peerId)) {
        peerMap.set(peerId, {
          lastMessage: msg.message,
          lastMessageDate: msg.createdAt,
          unreadCount: 0,
        });
      }

      if (!isSender && !msg.read) {
        peerMap.get(peerId).unreadCount += 1;
      }
    }

    // 2. Also check if user has accepted requests or scheduled sessions with users who have not messaged yet
    const requests = await MentorshipRequest.find({
      $or: [
        { learner: currentUserId, status: 'accepted' },
        { mentor: currentUserId, status: 'accepted' },
      ],
    });

    for (const reqItem of requests) {
      const isLearner = reqItem.learner.toString() === currentUserId.toString();
      const peerId = isLearner ? reqItem.mentor.toString() : reqItem.learner.toString();
      if (!peerMap.has(peerId)) {
        peerMap.set(peerId, {
          lastMessage: `Mentorship accepted for ${reqItem.skill}. Start chatting!`,
          lastMessageDate: reqItem.updatedAt,
          unreadCount: 0,
        });
      }
    }

    // 3. Populate peer details
    const peerIds = Array.from(peerMap.keys());
    const peers = await User.find({ _id: { $in: peerIds } }).select(
      'name email profileImage department year college rating'
    );

    const conversations = peers.map((peer) => {
      const meta = peerMap.get(peer._id.toString());
      const conversationId = Message.getConversationId(currentUserId, peer._id);
      return {
        peer,
        conversationId,
        lastMessage: meta ? meta.lastMessage : '',
        lastMessageDate: meta ? meta.lastMessageDate : null,
        unreadCount: meta ? meta.unreadCount : 0,
      };
    }).sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));

    res.json(conversations);
  } catch (error) {
    console.error('Error in getConversations:', error);
    res.status(500).json({ message: error.message || 'Error fetching conversations' });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
const getMessages = async (req, res) => {
  try {
    let { conversationId } = req.params;
    const currentUserId = req.user._id;

    // If param is a 24-character hex ObjectId, it's a peerId
    if (conversationId.length === 24 && !conversationId.includes('_')) {
      conversationId = Message.getConversationId(currentUserId, conversationId);
    }

    const messages = await Message.find({ conversationId })
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage')
      .sort({ createdAt: 1 });

    // Mark unread messages sent to current user as read
    await Message.updateMany(
      { conversationId, receiver: currentUserId, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching messages' });
  }
};

// @desc    Send message (REST API fallback)
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !message || message.trim() === '') {
      return res.status(400).json({ message: 'Receiver and message text are required' });
    }

    const conversationId = Message.getConversationId(senderId, receiverId);

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: message.trim(),
      conversationId,
    });

    const populated = await Message.findById(newMessage._id)
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage');

    // Notify receiver
    await createNotification({
      userId: receiverId,
      title: `New message from ${req.user.name}`,
      message: message.length > 50 ? `${message.substring(0, 47)}...` : message,
      type: 'chat',
      link: '/chat',
    });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error sending message' });
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
};
