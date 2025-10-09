import { defineStore } from "pinia";
import axiosClient from "../axios";

export const useMessagesStore = defineStore('messages',{
    state:() => ({
        messagesByConversation: {},
        loading: true,
        loadingMore: false,
    }),
    actions: {
        async fetchMessages(conversationId, offset = 0, limit = 20) {
            this.loading = false
            this.loadingMore = true
            try {
                const response = await axiosClient.get(`/api/conversation/${conversationId}/messages`,{
                    params: { offset, limit: 20}
                });
                const newMessages = response.data
                if(offset == 0 ){
                    this.messagesByConversation[conversationId] = newMessages

                }else{
                    const existingMessages = this.messagesByConversation[conversationId] || [];
                    this.messagesByConversation[conversationId] = [
                      ...newMessages,
                      ...existingMessages
                    ];
                }
            return newMessages
            } catch (err) {
              console.error("Failed to fetch messages", err);
              this.messagesByConversation[conversationId] = [];
              return []
            } finally {
              this.loading = false;
              this.loadingMore = false;
            }
        },
    }
})