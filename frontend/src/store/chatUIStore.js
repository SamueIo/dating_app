import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChatUIStore = defineStore('chatUI', () => {
  const showLastMessageMainChat = ref(true);
  const showLastMessageBubbles = ref({});
  
  // Pole na uloženie otvorených chatov
  const openChats = ref([]);
  const closedChats = ref([]);

  function showBubleFor(conversationId) {
    showLastMessageBubbles.value[conversationId] = true;

    setTimeout(() => {
      delete showLastMessageBubbles.value[conversationId];
    }, 5000);
  }

  // Pridaj chat do otvorených
  function openChat(conversationId) {
    if (!openChats.value.includes(conversationId)) {
      openChats.value.push(conversationId);
      
    }
    closedChats.value = closedChats.value.filter(id => id !== conversationId);
  }

  // Zatvor chat
  function closeChat(conversationId) {
    
    openChats.value = openChats.value.filter(id => id !== conversationId);
    if (!closedChats.value.includes(conversationId)) {
      closedChats.value.push(conversationId);
    }
  }

  return {
    showLastMessageMainChat,
    showLastMessageBubbles,
    openChats,
    closedChats,
    showBubleFor,
    openChat,
    closeChat,
  };
});
