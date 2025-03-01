const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const logger = require('./utils/logger');
const config = require('./config/environment');

// Routes
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');
const instagramRoutes = require('./routes/instagramRoutes');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: config.clientUrl,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect to MongoDB
mongoose.connect(config.mongodb.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  logger.info('Connected to MongoDB');
})
.catch((error) => {
  logger.error('MongoDB connection error:', error);
  process.exit(1);
});

// Middleware
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(rateLimiter);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/instagram', instagramRoutes);

// Socket.io for real-time chat
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);
  
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user_joined', { user: socket.id, time: new Date() });
    logger.info(`User ${socket.id} joined room ${roomId}`);
  });
  
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user_left', { user: socket.id, time: new Date() });
    logger.info(`User ${socket.id} left room ${roomId}`);
  });
  
  socket.on('send_message', (data) => {
    socket.to(data.roomId).emit('receive_message', {
      ...data,
      sender: socket.id,
      time: new Date()
    });
    logger.info(`Message sent in room ${data.roomId}`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// API health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: config.version });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.port || 3001;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = { app, server };