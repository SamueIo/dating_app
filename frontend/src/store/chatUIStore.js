import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Chat UI Store
 * 
 * This store manages the state for the chat user interface, including:
 * - showing last messages in the main chat
 * - showing temporary message bubbles
 * - managing open and closed chats
 */
export const useChatUIStore = defineStore('chatUI', () => {

  /** 
   * Boolean to control whether the last message in the main chat should be shown 
   */
  const showLastMessageMainChat = ref(true);

  /** 
   * Object to track temporary message bubbles for each conversation.
   * Key: conversationId, Value: boolean (true if bubble is visible)
   */
  const showLastMessageBubbles = ref({});

  /** 
   * Array storing conversation IDs of currently open chats 
   */
  const openChats = ref([]);

  /** 
   * Array storing conversation IDs of currently closed chats 
   */
  const closedChats = ref([]);

  /**
   * Show a temporary message bubble for a specific conversation.
   * The bubble will automatically disappear after 5 seconds.
   * @param {string | number} conversationId - The ID of the conversation
   */
  function showBubleFor(conversationId) {
    showLastMessageBubbles.value[conversationId] = true;

    setTimeout(() => {
      delete showLastMessageBubbles.value[conversationId];
    }, 5000);
  }

  /**
   * Open a chat window by conversation ID.
   * Adds the chat to `openChats` and removes it from `closedChats`.
   * @param {string | number} conversationId - The ID of the conversation
   */
  function openChat(conversationId) {
    if (!openChats.value.includes(conversationId)) {
      openChats.value.push(conversationId);
    }
    closedChats.value = closedChats.value.filter(id => id !== conversationId);
  }

  /**
   * Close a chat window by conversation ID.
   * Removes the chat from `openChats` and adds it to `closedChats`.
   * @param {string | number} conversationId - The ID of the conversation
   */
  function closeChat(conversationId) {
    openChats.value = openChats.value.filter(id => id !== conversationId);
    if (!closedChats.value.includes(conversationId)) {
      closedChats.value.push(conversationId);
    }
  }

  /**
   * Reset the entire chat UI store to its default state.
   * Resets message display, open chats, and closed chats.
   */
  function reset() {
    showLastMessageMainChat.value = true;
    showLastMessageBubbles.value = {};
    openChats.value = [];
    closedChats.value = [];
  }

  return {
    showLastMessageMainChat,
    showLastMessageBubbles,
    openChats,
    closedChats,
    showBubleFor,
    openChat,
    closeChat,
    reset,
  };
});
