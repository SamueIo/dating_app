
import { useConversationStore } from "../store/conversationsAndLastMessage";
import { useChatUIStore } from "@/store/chatUIStore";
import { useActiveConversationStore } from "../store/useActiveConversationStore";
import axiosClient from "../axios";

// Flag to prevent duplicate registration
let isRegistered = false;

/**
 * useChatListener
 * Registers a real-time listener for incoming chat messages for the given user.
 *
 * @param {number|string} userId - The currently logged-in user's ID.
 * @returns {object} - { register: function } to start the listener.
 */
export function useChatListener(userId) {
  const conversationStore = useConversationStore();
  const chatUIStore = useChatUIStore();
  const activeConversationStore = useActiveConversationStore();

  /**
   * Registers the chat listener via Laravel Echo.
   * Ensures messages are pushed to the conversation store and notifications are shown.
   */
  function register() {
    // Do not register if no userId or already registered
    if (!userId || isRegistered) return;
    isRegistered = true;

    // Ensure messagesByConversation object exists
    if (!conversationStore.messagesByConversation) {
      conversationStore.messagesByConversation = {};
    }

    // Subscribe to the private Echo channel for this user
    const channel = window.Echo.private(`user.${userId}`);

    channel.listen(".message.sent", async (event) => {
      const message = event.message;
      const convId = message.conversation_id;

      // Determine active conversation ID (function or value)
      const activeId =
        typeof activeConversationStore.activeConversationID === "function"
          ? activeConversationStore.activeConversationID()
          : activeConversationStore.activeConversationID;

      // Open the chat window if it's not already open
      if (!chatUIStore.openChats.includes(convId)) {
        chatUIStore.openChat(convId);
      }

      // Fetch conversation if it does not exist
      if (!conversationStore.conversations.some((c) => c.id === convId)) {
        await conversationStore.fetchConversations(true);
      }

      // Ensure message array exists
      if (!conversationStore.messagesByConversation[convId]) {
        conversationStore.messagesByConversation[convId] = [];
      }

      // Add message if it doesn't already exist and conversation is not active
      const exists = conversationStore.messagesByConversation[convId].some(
        (m) => m.id === message.id
      );
      if (!exists && convId !== activeId) {
        conversationStore.messagesByConversation[convId].push(message);
        chatUIStore.showBubleFor(convId);
      }

      // Update last message in conversation store
      conversationStore.updateLastMessage(message);
    });
  }

  return { register };
}
