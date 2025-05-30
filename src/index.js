require('dotenv').config();
const http = require('http');
const app = require('./app');
const { sequelize } = require('./models');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Setup Socket.IO
require('./utils/socket')(io);

// Test database connection
async function testDbConnection() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    return true;
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    return false;
  }
}

// Start server
async function startServer() {
  const dbConnected = await testDbConnection();
  
  if (dbConnected || process.env.NODE_ENV === 'test') {
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } else {
    logger.error('Server not started due to database connection failure');
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

startServer(); 