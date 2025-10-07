import api from '../api-service';

const conversationAPI = {
  // Get all conversations for the current user
  getConversations: async (params = {}) => {
    try {
      const response = await api.get('/conversations', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  // Get a specific conversation by ID
  getConversation: async conversationId => {
    try {
      const response = await api.get(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },

  // Get messages in a conversation
  getConversationMessages: async (conversationId, params = {}) => {
    try {
      const response = await api.get(
        `/conversations/${conversationId}/messages`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      throw error;
    }
  },

  // Send a message in a conversation
  sendMessageInConversation: async (conversationId, messageData) => {
    try {
      const response = await api.post(
        `/conversations/${conversationId}/messages`,
        messageData
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Start a new conversation or get existing one
  startConversation: async ({
    recipientId,
    subject,
    content,
    priority,
    category
  }) => {
    try {
      const response = await api.post('/conversations/start', {
        recipientId,
        subject,
        content,
        priority,
        category
      });
      return response.data;
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  },

  // Archive/unarchive a conversation
  toggleArchive: async conversationId => {
    try {
      const response = await api.patch(
        `/conversations/${conversationId}/archive`
      );
      return response.data;
    } catch (error) {
      console.error('Error archiving conversation:', error);
      throw error;
    }
  },

  // Pin/unpin a conversation
  togglePin: async conversationId => {
    try {
      const response = await api.patch(`/conversations/${conversationId}/pin`);
      return response.data;
    } catch (error) {
      console.error('Error pinning conversation:', error);
      throw error;
    }
  },

  // Delete a conversation
  deleteConversation: async conversationId => {
    try {
      const response = await api.delete(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }
};

export default conversationAPI;
