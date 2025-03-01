const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const logger = require('../utils/logger');

class ChatService {
  async createChat(userId, chatData) {
    try {
      const { name, description, type } = chatData;
      
      const newChat = new Chat({
        name,
        description,
        type: type || 'public',
        participants: [userId],
        createdBy: userId
      });
      
      await newChat.save();
      logger.info(`Chat room created: ${name} (ID: ${newChat._id})`);
      
      return newChat;
    } catch (error) {
      logger.error('Error creating chat room:', error);
      throw error;
    }
  }
  
  async addUserToChat(chatId, userId) {
    try {
      const chat = await Chat.findById(chatId);
      
      if (!chat) {
        throw new Error('Chat room not found');
      }
      
      if (chat.participants.includes(userId)) {
        return chat; // User already in chat
      }
      
      chat.participants.push(userId);
      await chat.save();
      
      // Create system message about user joining
      const user = await User.findById(userId);
      if (user) {
        await this.createSystemMessage(chatId, `${user.username} has joined the chat`);
      }
      
      logger.info(`User ${userId} added to chat ${chatId}`);
      
      return chat;
    } catch (error) {
      logger.error('Error adding user to chat:', error);
      throw error;
    }
  }
  
  async removeUserFromChat(chatId, userId) {
    try {
      const chat = await Chat.findById(chatId);
      
      if (!chat) {
        throw new Error('Chat room not found');
      }
      
      if (!chat.participants.includes(userId)) {
        return chat; // User not in chat
      }
      
      chat.participants = chat.participants.filter(
        participantId => participantId.toString() !== userId.toString()
      );
      await chat.save();
      
      // Create system message about user leaving
      const user = await User.findById(userId);
      if (user) {
        await this.createSystemMessage(chatId, `${user.username} has left the chat`);
      }
      
      logger.info(`User ${userId} removed from chat ${chatId}`);
      
      return chat;
    } catch (error) {
      logger.error('Error removing user from chat:', error);
      throw error;
    }
  }
  
  async createMessage(chatId, userId, messageData) {
    try {
      const { content, type = 'text', metadata } = messageData;
      
      const chat = await Chat.findById(chatId);
      
      if (!chat) {
        throw new Error('Chat room not found');
      }
      
      if (!chat.participants.includes(userId)) {
        throw new Error('User is not a participant in this chat');
      }
      
      const newMessage = new Message({
        chatId,
        sender: userId,
        content,
        type,
        metadata
      });
      
      await newMessage.save();
      
      // Update chat's messages array and last activity time
      chat.messages.push(newMessage._id);
      chat.updatedAt = new Date();
      await chat.save();
      
      logger.info(`Message created in chat ${chatId} by user ${userId}`);
      
      return newMessage;
    } catch (error) {
      logger.error('Error creating message:', error);
      throw error;
    }
  }
  
  async createSystemMessage(chatId, content) {
    try {
      const systemUserId = await this.getSystemUserId();
      
      const newMessage = new Message({
        chatId,
        sender: systemUserId,
        content,
        type: 'system'
      });
      
      await newMessage.save();
      
      // Update chat's messages array
      const chat = await Chat.findById(chatId);
      if (chat) {
        chat.messages.push(newMessage._id);
        await chat.save();
      }
      
      return newMessage;
    } catch (error) {
      logger.error('Error creating system message:', error);
      throw error;
    }
  }
  
  async getSystemUserId() {
    // Get or create system user
    let systemUser = await User.findOne({ username: 'system' });
    
    if (!systemUser) {
      systemUser = new User({
        username: 'system',
        displayName: 'System',
        password: crypto.randomBytes(32).toString('hex'), // Random password
      });
      
      await systemUser.save();
    }
    
    return systemUser._id;
  }
  
  async getChatMessages(chatId, options = {}) {
    try {
      const { limit = 50, before, after } = options;
      
      const query = { chatId };
      
      if (before) {
        query.createdAt = { ...query.createdAt, $lt: new Date(before) };
      }
      
      if (after) {
        query.createdAt = { ...query.createdAt, $gt: new Date(after) };
      }
      
      const messages = await Message.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit, 10))
        .populate('sender', 'username displayName')
        .lean();
      
      return messages.reverse();
    } catch (error) {
      logger.error('Error getting chat messages:', error);
      throw error;
    }
  }
  
  async getChatsByUser(userId) {
    try {
      const chats = await Chat.find({ participants: userId })
        .select('name description type participants messages createdAt updatedAt')
        .sort({ updatedAt: -1 })
        .populate('participants', 'username displayName')
        .lean();
      
      return chats;
    } catch (error) {
      logger.error('Error getting user chats:', error);
      throw error;
    }
  }
}

module.exports = ChatService;