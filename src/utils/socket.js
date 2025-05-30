const logger = require('./logger');

module.exports = (io) => {
  // Store active connections
  const connections = new Map();

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Handle user authentication
    socket.on('authenticate', (data) => {
      if (data.userId) {
        // Store user connection
        connections.set(data.userId, socket.id);
        socket.userId = data.userId;
        socket.familyGroupId = data.familyGroupId;
        
        // Join family group room if available
        if (data.familyGroupId) {
          socket.join(`family-${data.familyGroupId}`);
          logger.info(`User ${data.userId} joined family group ${data.familyGroupId}`);
        }
        
        logger.info(`User authenticated: ${data.userId}`);
      }
    });

    // Handle shopping list updates
    socket.on('shopping-list-update', (data) => {
      if (socket.familyGroupId && data.listId) {
        // Broadcast to all family members except sender
        socket.to(`family-${socket.familyGroupId}`).emit('shopping-list-updated', {
          listId: data.listId,
          itemId: data.itemId,
          userId: socket.userId,
          update: data.update,
          timestamp: new Date(),
        });
        
        logger.debug(`Shopping list update broadcast to family ${socket.familyGroupId}`);
      }
    });

    // Handle pantry updates
    socket.on('pantry-update', (data) => {
      if (socket.familyGroupId) {
        socket.to(`family-${socket.familyGroupId}`).emit('pantry-updated', {
          itemId: data.itemId,
          userId: socket.userId,
          update: data.update,
          timestamp: new Date(),
        });
        
        logger.debug(`Pantry update broadcast to family ${socket.familyGroupId}`);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      if (socket.userId) {
        connections.delete(socket.userId);
        logger.info(`User disconnected: ${socket.userId}`);
      } else {
        logger.info(`Socket disconnected: ${socket.id}`);
      }
    });
  });

  // Utility function to send notification to specific user
  const sendNotification = (userId, notification) => {
    const socketId = connections.get(userId);
    if (socketId) {
      io.to(socketId).emit('notification', notification);
      logger.debug(`Notification sent to user ${userId}`);
      return true;
    }
    logger.debug(`User ${userId} not connected, notification not sent`);
    return false;
  };

  // Utility function to broadcast to family group
  const notifyFamilyGroup = (familyGroupId, notification) => {
    io.to(`family-${familyGroupId}`).emit('notification', notification);
    logger.debug(`Notification broadcast to family ${familyGroupId}`);
  };

  // Export utility functions
  return {
    sendNotification,
    notifyFamilyGroup,
  };
}; 