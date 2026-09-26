import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare, ArrowLeft, Clock, ShieldCheck, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';

const Chat = () => {
  const { user, socket, onlineUsers } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // 1. Fetch conversations list
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await chatService.getConversations();
        setConversations(data);
        if (data.length > 0 && !selectedPeer) {
          setSelectedPeer(data[0].peer);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setLoadingConv(false);
      }
    };

    fetchConversations();
  }, []);

  // 2. Fetch messages when selectedPeer changes
  useEffect(() => {
    if (!selectedPeer) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const msgs = await chatService.getMessages(selectedPeer._id);
        setMessages(msgs);

        // Join conversation room via socket if connected
        if (socket && user?._id) {
          const ids = [user._id.toString(), selectedPeer._id.toString()].sort();
          const convId = `${ids[0]}_${ids[1]}`;
          socket.emit('joinConversation', convId);
        }
      } catch (err) {
        console.error('Error loading chat messages:', err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedPeer?._id, socket, user?._id]);

  // 3. Listen to incoming real-time socket messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      if (
        (msg.sender?._id === selectedPeer?._id && msg.receiver?._id === user?._id) ||
        (msg.sender?._id === user?._id && msg.receiver?._id === selectedPeer?._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }

      // Also update conversations preview
      setConversations((prev) => {
        const otherId = msg.sender?._id === user?._id ? msg.receiver?._id : msg.sender?._id;
        return prev.map((c) => {
          if (c.peer?._id === otherId) {
            return {
              ...c,
              lastMessage: msg.message,
              lastMessageDate: msg.createdAt,
            };
          }
          return c;
        });
      });
    };

    const handleUserTyping = ({ senderName }) => {
      setIsTyping(true);
    };

    const handleUserStopTyping = () => {
      setIsTyping(false);
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('incomingMessage', handleReceiveMessage);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStopTyping', handleUserStopTyping);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('incomingMessage', handleReceiveMessage);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStopTyping', handleUserStopTyping);
    };
  }, [socket, selectedPeer?._id, user?._id]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPeer) return;

    const text = newMessage.trim();
    setNewMessage('');

    if (socket && socket.connected) {
      socket.emit('sendMessage', {
        sender: user._id,
        receiver: selectedPeer._id,
        message: text,
        senderName: user.name,
      });
    } else {
      // Fallback to REST
      try {
        const sent = await chatService.sendMessage({
          receiverId: selectedPeer._id,
          message: text,
        });
        setMessages((prev) => [...prev, sent]);
      } catch (err) {
        console.error('REST message send failure:', err);
      }
    }
  };

  const isPeerOnline = selectedPeer && onlineUsers.includes(selectedPeer._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
          Peer Messages
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8]">
          Coordinate meeting timings, notes, and study resources with accepted mentors and learners
        </p>
      </div>

      <div className="bg-[#080B18]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden h-[75vh] flex">
        {/* Left Pane: Conversation List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col bg-[#0B1024]/40 ${
            selectedPeer ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-4 border-b border-white/10 bg-[#080B18]/80 backdrop-blur-md">
            <h3 className="text-sm font-bold text-[#F8FAFC]">Conversations</h3>
            <p className="text-[11px] text-[#94A3B8]">Accepted peer mentorship chats</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {loadingConv ? (
              <Loading size="sm" text="Loading conversations..." />
            ) : conversations.length > 0 ? (
              conversations.map((conv) => {
                const peerOnline = onlineUsers.includes(conv.peer?._id);
                const isSelected = selectedPeer?._id === conv.peer?._id;

                return (
                  <button
                    key={conv.conversationId}
                    type="button"
                    onClick={() => setSelectedPeer(conv.peer)}
                    className={`w-full text-left p-4 transition-all flex items-start gap-3 hover:bg-[#0B1024]/80 ${
                      isSelected ? 'bg-[#0B1024]/90 border-l-4 border-blue-500 shadow-md' : ''
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      {conv.peer?.profileImage ? (
                        <img
                          src={conv.peer.profileImage}
                          alt={conv.peer.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                          {conv.peer?.name ? conv.peer.name[0] : 'S'}
                        </div>
                      )}
                      {peerOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#080B18]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-sm font-bold text-[#F8FAFC] truncate">
                          {conv.peer?.name}
                        </span>
                        {conv.lastMessageDate && (
                          <span className="text-[10px] text-[#94A3B8] whitespace-nowrap">
                            {new Date(conv.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#94A3B8] truncate mb-1">
                        {conv.peer?.department}
                      </p>
                      <p className="text-xs text-[#CBD5E1] truncate font-medium">
                        {conv.lastMessage || 'Start conversation...'}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-xs">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-[#94A3B8] text-xs">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-[#60A5FA]/30" />
                <p className="font-semibold text-[#CBD5E1]">No active chats yet</p>
                <p className="mt-1">
                  Once a mentorship request is accepted, your chat thread opens here!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Chat Window */}
        <div className={`flex-1 flex flex-col bg-[#050713]/60 ${selectedPeer ? 'flex' : 'hidden md:flex'}`}>
          {selectedPeer ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#080B18]/90 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPeer(null)}
                    className="md:hidden p-1.5 rounded-lg hover:bg-white/5 text-[#94A3B8]"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative">
                    {selectedPeer.profileImage ? (
                      <img
                        src={selectedPeer.profileImage}
                        alt={selectedPeer.name}
                        className="w-10 h-10 rounded-xl object-cover border border-white/10"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                        {selectedPeer.name ? selectedPeer.name[0] : 'S'}
                      </div>
                    )}
                    {isPeerOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#080B18]" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-1.5">
                      {selectedPeer.name}
                      <span className="text-[10px] text-[#94A3B8] font-normal">
                        ({selectedPeer.department})
                      </span>
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                      <span className={`w-2 h-2 rounded-full ${isPeerOnline ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      <span>{isPeerOnline ? 'Online now' : 'Campus student'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 font-semibold border border-emerald-500/30 hidden sm:inline-block">
                    Verified Student Peer
                  </span>
                </div>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#050713]/40">
                {loadingMessages ? (
                  <Loading size="sm" text="Loading message history..." />
                ) : messages.length > 0 ? (
                  messages.map((msg, index) => {
                    const isMe = msg.sender?._id?.toString() === user?._id?.toString();

                    return (
                      <div
                        key={msg._id || index}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md ${
                            isMe
                              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none'
                              : 'bg-[#0B1024]/90 border border-white/10 text-[#F8FAFC] rounded-bl-none'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-[#94A3B8] px-1">
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && <CheckCheck className="w-3 h-3 text-[#60A5FA]" />}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-xs text-[#94A3B8]">
                    <p className="font-semibold text-[#CBD5E1]">Start the conversation</p>
                    <p className="mt-1">
                      Say hello, clarify topics for the session, or coordinate meeting spots!
                    </p>
                  </div>
                )}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-[#94A3B8] italic">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                    <span>{selectedPeer.name} is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-white/10 bg-[#080B18]/90 flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${selectedPeer.name}...`}
                  className="flex-1 rounded-xl border border-white/10 text-sm py-2.5 px-4 bg-[#0B1024]/90 text-[#F8FAFC] placeholder:text-[#94A3B8]/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <Button type="submit" size="md" icon={Send}>
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#94A3B8]">
              <MessageSquare className="w-12 h-12 text-[#60A5FA]/30 mb-3" />
              <h3 className="text-base font-bold text-[#F8FAFC]">No Conversation Selected</h3>
              <p className="text-xs text-[#94A3B8] mt-1 max-w-sm">
                Pick a peer from the left panel to begin discussing your learning session.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
