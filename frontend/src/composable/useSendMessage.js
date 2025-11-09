import { ref } from 'vue';

/**
 * useSendMessage
 * Handles sending messages with optimistic updates.
 */
export function useSendMessage(MessagesStore, conversationStore, axiosClient, loggedUserId, scrollToBottom) {
  const sendLoading = ref(false);
  const error = ref(null);

  async function handleSendMessage(formData, conversationId) {
    sendLoading.value = true;
    error.value = null;

    try {
      // Optimistic update with temp ID
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

      // Send message to server
      await axiosClient.post(`/api/conversation/${conversationId}/messages`, formData);

    } catch (e) {
      error.value = e;
      console.error('Failed to send message', e);
      // Optional: handle rollback or notifications here
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
