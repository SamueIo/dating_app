import { defineStore } from "pinia";
import axiosClient from "../axios";

/**
 * Messages Store
 * 
 * This store manages messages for conversations.
 * Features include:
 * - fetching messages from the server
 * - storing messages by conversation ID
 * - handling loading states for initial and paginated messages
 */
export const useMessagesStore = defineStore('messages', {

    /**
     * State of the messages store
     */
    state: () => ({
        /** Object storing messages grouped by conversation ID */
        messagesByConversation: {},

        /** Loading state for initial fetch */
        loading: true,

        /** Loading state for fetching additional messages (pagination) */
        loadingMore: false,
    }),

    /**
     * Actions for managing messages
     */
    actions: {

        /**
         * Fetch messages for a specific conversation.
         * Supports pagination via offset and limit.
         * 
         * @param {number|string} conversationId - ID of the conversation
         * @param {number} [offset=0] - Number of messages to skip (for pagination)
         * @param {number} [limit=20] - Number of messages to fetch
         * @returns {Array} - Array of fetched messages
         */
        async fetchMessages(conversationId, offset = 0, limit = 20) {
            this.loading = false;
            this.loadingMore = true;

            try {
                const response = await axiosClient.get(`/api/conversation/${conversationId}/messages`, {
                    params: { offset, limit: 20 }
                });

                const newMessages = response.data;

                if (offset === 0) {
                    // Initial load: replace messages
                    this.messagesByConversation[conversationId] = newMessages;
                } else {
                    // Pagination: prepend new messages
                    const existingMessages = this.messagesByConversation[conversationId] || [];
                    this.messagesByConversation[conversationId] = [
                        ...newMessages,
                        ...existingMessages
                    ];
                }

                return newMessages;

            } catch (err) {
                console.error("Failed to fetch messages", err);
                this.messagesByConversation[conversationId] = [];
                return [];

            } finally {
                this.loading = false;
                this.loadingMore = false;
            }
        },
    }
});
