import api from '../api-service';

const messageAPI = {
  // Search users for messaging
  searchUsers: async params => {
    try {
      const response = await api.get('/messages/users/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  // Get inbox messages
  getInbox: async (params = {}) => {
    try {
      const response = await api.get('/messages/inbox', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching inbox:', error);
      throw error;
    }
  },

  // Get sent messages
  getSent: async (params = {}) => {
    try {
      const response = await api.get('/messages/sent', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sent messages:', error);
      throw error;
    }
  },

  // Get message statistics
  getStats: async () => {
    try {
      const response = await api.get('/messages/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching message stats:', error);
      throw error;
    }
  },

  // Get message by ID
  getMessage: async messageId => {
    try {
      const response = await api.get(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching message:', error);
      throw error;
    }
  },

  // Send new message
  sendMessage: async messageData => {
    try {
      const response = await api.post('/messages', messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Reply to message
  replyToMessage: async (messageId, content) => {
    try {
      const response = await api.post(`/messages/${messageId}/reply`, {
        content
      });
      return response.data;
    } catch (error) {
      console.error('Error replying to message:', error);
      throw error;
    }
  },

  // Mark message as read
  markAsRead: async messageId => {
    try {
      const response = await api.patch(`/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },

  // Archive message
  archiveMessage: async messageId => {
    try {
      const response = await api.patch(`/messages/${messageId}/archive`);
      return response.data;
    } catch (error) {
      console.error('Error archiving message:', error);
      throw error;
    }
  },

  // Flag message
  flagMessage: async messageId => {
    try {
      const response = await api.patch(`/messages/${messageId}/flag`);
      return response.data;
    } catch (error) {
      console.error('Error flagging message:', error);
      throw error;
    }
  },

  // Delete message
  deleteMessage: async messageId => {
    try {
      const response = await api.delete(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
};

export default messageAPI;
