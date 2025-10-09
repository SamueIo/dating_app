// src/composables/useSendMessage.js
import { ref } from 'vue';

export function useSendMessage(MessagesStore, conversationStore, axiosClient, loggedUserId, scrollToBottom) {
  const sendLoading = ref(false);
  const error = ref(null);

  async function handleSendMessage(formData, conversationId) {
    sendLoading.value = true;
    error.value = null;

    try {
      // Optimistic update, temp ID
      const content = formData.get('body');
      const tempId = 'temp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

      formData.append('temp_id', tempId);

      const optimisticMessage = {
        id: tempId,
        user_id: loggedUserId.value,
        body: content,
        created_at: new Date().toISOString(),
        seen: false,

      };

      if (!MessagesStore.messagesByConversation[conversationId]) {
        MessagesStore.messagesByConversation[conversationId] = [];
      }

      MessagesStore.messagesByConversation[conversationId].push(optimisticMessage);      
      scrollToBottom();

      // Sedding message to server
      await axiosClient.post(`/api/conversation/${conversationId}/messages`, formData);


    } catch (e) {
      error.value = e;
      console.error('Failed to send message', e);
      // Tu môžeš riešiť rollback alebo notifikácie
    } finally {
      sendLoading.value = false;
    }
  }

  return {
    sendLoading,
    error,
    handleSendMessage
  };
}

