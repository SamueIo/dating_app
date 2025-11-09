
import { ref } from 'vue';
import { useActiveConversationStore } from '@/store/useActiveConversationStore';
import { useChatUIStore } from '@/store/chatUIStore';
import { useConversationStore } from '@/store/conversationsAndLastMessage';

/**
 * useChatManagerMiniPortableChat
 * Provides state and methods for managing a portable mini chat interface.
 *
 * @param {Function} emit - Optional Vue emit function to notify parent component.
 * @param {Ref<Boolean>} showDropdown - Optional ref controlling dropdown visibility.
 * @returns {object} - Reactive state and chat control functions.
 */
export function useChatManagerMiniPortableChat(emit, showDropdown) {
  const activeConversationStore = useActiveConversationStore();
  const chatUIStore = useChatUIStore();
  const conversationStore = useConversationStore();

  // Reactive states
  const isChatOpen = ref(false);          // Is the mini chat open
  const tempCloseChat = ref(true);        // Temporary flag for drag events
  const selectedConversation = ref(null); // Currently selected conversation object
  const showAddBubbles = ref(true);       // Whether to show the "add chat" bubbles
  const currentConversationId = ref(null);// ID of the currently active conversation

  /**
   * Opens a conversation in the mini chat
   * @param {object} conversation - Conversation object
   */
  function openConversation(conversation) {
    activeConversationStore.setActiveConversation(conversation.id);
    chatUIStore.openChat(conversation.id);
    selectedConversation.value = conversation;
    isChatOpen.value = true;
    currentConversationId.value = conversation.id;

    // Mark conversation as seen
    conversationStore.markConversationAsSeen(conversation.id);

    // Optional UI behavior
    if (showDropdown?.value !== undefined) showDropdown.value = false;
    if (emit) emit('select', conversation);
  }

  /**
   * Closes the currently open conversation
   */
  function closeConversation() {
    activeConversationStore.clearActiveConversation();
    isChatOpen.value = false;
    chatUIStore.isChatOpen = false;
    selectedConversation.value = null;
  }

  /**
   * Closes a chat bubble by conversation ID
   * @param {number|string} conversationID
   */
  function closeBubble(conversationID) {
    activeConversationStore.clearActiveConversation();
    chatUIStore.closeChat(conversationID);
    isChatOpen.value = false;
  }

  /**
   * Call when starting to drag the chat
   */
  function dragStart() {
    tempCloseChat.value = false;
  }

  /**
   * Call when ending a drag event
   */
  function dragEnd() {
    tempCloseChat.value = true;
  }

  /**
   * Toggles visibility of the dropdown
   */
  function toggleDropdown() {
    if (showDropdown) showDropdown.value = !showDropdown.value;
  }

  /**
   * Hides the "add chat" bubbles
   */
  function handleClosePlusBubble() {
    showAddBubbles.value = false;
  }

  return {
    isChatOpen,
    tempCloseChat,
    selectedConversation,
    currentConversationId,
    showAddBubbles,
    openConversation,
    closeConversation,
    closeBubble,
    dragStart,
    dragEnd,
    toggleDropdown,
    handleClosePlusBubble,
  };
}
