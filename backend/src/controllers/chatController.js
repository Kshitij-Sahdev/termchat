const Chat = require('../models/Chat');
const Message = require('../models/Message');
const logger = require('../utils/logger');
const { handleAsync } = require('../utils/responses');

// Get all public chat rooms
exports.getPublicChats = handleAsync(async (req, res) => {
  const chats = await Chat.find({ type: 'public' })
    .select('name description participants')
    .populate('participants', 'username displayName');
  
  return res.status(200).json({ chats });
});

// Create a new chat room
exports.createChat = handleAsync(async (req, res) => {
  const { name, description, type } = req.body;
  
  const newChat = new Chat({
    name,
    description,
    type: type || 'public',
    participants: [req.user.id],
    createdBy: req.user.id,
  });
  
  await newChat.save();
  
  logger.info(`Chat room created: ${name} by ${req.user.username}`);
  
  return res.status(201).json({
    message: 'Chat room created successfully',
    chat: {
      id: newChat._id,
      name: newChat.name,
      description: newChat.description,
      type: newChat.type,
    }
  });
});

// Join a chat room
exports.joinChat = handleAsync(async (req, res) => {
  const { chatId } = req.params;
  
  const chat = await Chat.findById(chatId);
  
  if (!chat) {
    return res.status(404).json({ message: 'Chat room not found' });
  }
  
  // Check if user is already a participant
  if (chat.participants.includes(req.user.id)) {
    return res.status(400).json({ message: 'You are already a participant in this chat' });
  }
  
  // Add user to participants
  chat.participants.push(req.user.id);
  await chat.save();
  
  // Create a system message
  const systemMessage = new Message({
    chatId: chat._id,
    sender: req.user.id,
    content: `${req.user.username} has joined the chat`,
    type: 'system',
  });
  
  await systemMessage.save();
  
  logger.info(`User ${req.user.username} joined chat: ${chat.name}`);
  
  return res.status(200).json({
    message: 'Joined chat successfully',
    chat: {
      id: chat._id,
      name: chat.name,
      description: chat.description,
    }
  });
});

// Leave a chat room
exports.leaveChat = handleAsync(async (req, res) => {
  const { chatId } = req.params;
  
  const chat = await Chat.findById(chatId);
  
  if (!chat) {
    return res.status(404).json({ message: 'Chat room not found' });
  }
  
  // Check if user is a participant
  if (!chat.participants.includes(req.user.id)) {
    return res.status(400).json({ message: 'You are not a participant in this chat' });
  }
  
  // Remove user from participants
  chat.participants = chat.participants.filter(
    userId => userId.toString() !== req.user.id
  );
  await chat.save();
  
  // Create a system message
  const systemMessage = new Message({
    chatId: chat._id,
    sender: req.user.id,
    content: `${req.user.username} has left the chat`,
    type: 'system',
  });
  
  await systemMessage.save();
  
  logger.info(`User ${req.user.username} left chat: ${chat.name}`);
  
  return res.status(200).json({
    message: 'Left chat successfully'
  });
});

// Get messages for a chat room
exports.getMessages = handleAsync(async (req, res) => {
  const { chatId } = req.params;
  const { limit = 50, before } = req.query;
  
  const chat = await Chat.findById(chatId);
  
  if (!chat) {
    return res.status(404).json({ message: 'Chat room not found' });
  }
  
  // Check if user is a participant
  if (!chat.participants.includes(req.user.id)) {
    return res.status(403).json({ message: 'You are not authorized to view this chat' });
  }
  
  // Build query
  const query = { chatId };
  if (before) {
    query.createdAt = { $lt: new Date(before) };
  }
  
  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit, 10))
    .populate('sender', 'username displayName')
    .lean();
  
  return res.status(200).json({
    messages: messages.reverse(),
    hasMore: messages.length === parseInt(limit, 10)
  });
});

// Send a message to a chat room
exports.sendMessage = handleAsync(async (req, res) => {
  const { chatId } = req.params;
  const { content, type = 'text' } = req.body;
  
  const chat = await Chat.findById(chatId);
  
  if (!chat) {
    return res.status(404).json({ message: 'Chat room not found' });
  }
  
  // Check if user is a participant
  if (!chat.participants.includes(req.user.id)) {
    return res.status(403).json({ message: 'You are not authorized to send messages to this chat' });
  }
  
  const newMessage = new Message({
    chatId: chat._id,
    sender: req.user.id,
    content,
    type,
  });
  
  await newMessage.save();
  
  // Add message to chat
  chat.messages.push(newMessage._id);
  chat.updatedAt = new Date();
  await chat.save();
  
  // Get populated message
  const populatedMessage = await Message.findById(newMessage._id)
    .populate('sender', 'username displayName')
    .lean();
  
  return res.status(201).json({
    message: 'Message sent successfully',
    sentMessage: populatedMessage
  });
});