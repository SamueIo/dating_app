// stores/conversationsAndLastMessage.js

import { defineStore } from "pinia";
import axiosClient from "../axios";
import useUserStore from "./user";

/**
 * Pinia store to manage chat conversations and related message state.
 * 
 * Provides methods to:
 * - Fetch all conversations from the backend.
 * - Update the last message of a conversation.
 * - Mark a conversation as "seen" on the backend and locally.
 */
export const useConversationStore = defineStore('conversations', {
  state: () => ({
    conversations: [],  // List of all user conversations
    loading: false,     // Indicates whether conversations are being fetched
    loaded: false       // Prevents redundant API calls if already loaded
  }),

  actions: {
    /**
     * Fetches all user conversations from the backend API.
     * Uses a caching flag (`loaded`) to prevent refetching unless explicitly forced.
     * 
     * @param {boolean} [allowReload=false] - Set to `true` to forcibly reload conversations even if already loaded.
     * @returns {Promise<void>}
     */
    async fetchConversations(allowReload = false) {
      if (this.loaded && !allowReload) return;

      this.loading = true;
      
      try {
        const response = await axiosClient.get(`/api/conversation`);
        this.conversations = response.data;
        this.loaded = true;
      } catch (err) {
        console.error('Error in fetching conversations:', err);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Updates the `last_message` of a conversation when a new message is received or sent.
     * Moves the updated conversation to the top of the list for recency.
     * 
     * @param {Object} message - The latest message object to update.
     */
    updateLastMessage(message) {
      const id = Number(message.conversation_id);
      const index = this.conversations.findIndex(conv => conv.id === id);

      console.log('updating last msg', message);
      
      if (index !== -1) {
        const conv = { ...this.conversations[index] };
        conv.last_message = message;
        conv.updated_at = message.created_at;

        this.conversations.splice(index, 1);
        this.conversations.unshift(conv);
      }
    },

    /**
     * Marks a conversation as "seen" both on the backend and in local state.
     * Prevents marking the message as seen if:
     * - The message is already seen
     * - The message was sent by the currently logged-in user
     * 
     * @param {number} conversationId - The ID of the conversation to mark as seen.
     * @returns {Promise<void>}
     */
    async markConversationAsSeen(conversationId) {
      const index = this.conversations.findIndex(c => c.id === conversationId);
      if (index === -1) return;

      const conversation = this.conversations[index];
      const userStore = useUserStore();
      const loggedUserId = userStore.user?.id;

      // Do not mark as seen if:
      // - No last message
      // - Already seen
      // - Message sent by current user
      if (
        !conversation?.last_message ||
        conversation.last_message.seen ||
        conversation.last_message.user_id === loggedUserId
      ) {
        return;
      }

      try {
        await axiosClient.post(`/api/conversation/${conversationId}/seen`);
        conversation.last_message.seen = true;
      } catch (err) {
        console.error('Failed to mark as seen', err);
      }
    }
  }
});
