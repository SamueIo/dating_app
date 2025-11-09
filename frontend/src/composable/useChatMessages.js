import { ref, onMounted, watch, computed, nextTick, onUnmounted } from 'vue';
import debounce from 'lodash/debounce';

/**
 * useChatMessages
 * Handles fetching, scrolling, and real-time updates for a chat conversation.
 */
export function useChatMessages(props, MessagesStore, conversationStore, userStore, axiosClient, windowEcho) {
  const messagesContainer = ref(null);
  const offset = ref(0);
  const loggedUserId = ref(null);
  const loading = ref(true);
  let cleanupEcho = null;

  const messages = computed(() => MessagesStore.messagesByConversation[props.conversationData.id] || []);
  const firstScrollToBottom = ref(true);
  const isUserAtBottom = ref(true);

  // Fetch messages from store or server
  async function fetchMessages(initial = true) {
    if (!props.conversationData.id || !messagesContainer.value) return;
    loading.value = true;

    const convMessages = MessagesStore.messagesByConversation[props.conversationData.id] || [];

    if (initial && convMessages.length > 0) {
      loading.value = false;
      scrollToBottom();
      return;
    }

    const container = messagesContainer.value;
    const previousScrollHeight = container.scrollHeight;
    const previousScrollTop = container.scrollTop;

    const newMessages = await MessagesStore.fetchMessages(props.conversationData.id, offset.value);

    // Handle initial load with existing messages
    if (MessagesStore.messagesByConversation[props.conversationData.id]?.length > 0 && initial) {
      offset.value += newMessages.length;
      loading.value = false;
      await nextTick();

      await waitForImagesToLoad(container);
      scrollToBottom();
    } else {
      if (newMessages && newMessages.length > 0) {
        offset.value += newMessages.length;
        await nextTick();

        if (firstScrollToBottom.value) {
          scrollToBottom();
        } else {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - previousScrollHeight + previousScrollTop;
        }
        loading.value = false;
      }
    }

    firstScrollToBottom.value = false;
    loading.value = false;
  }

  // Scroll container to bottom
  function scrollToBottom() {
    nextTick(() => {
      if (messagesContainer.value && messagesContainer.value.scrollHeight > 20) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    });
  }

  function isScrolledToBottom() {
    if (!messagesContainer.value) return false;
    const el = messagesContainer.value;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distanceFromBottom < 200;
  }

  // Scroll handling with debounce
  const handleScroll = debounce(() => {
    const currentlyAtBottom = isScrolledToBottom();
    const el = messagesContainer.value;

    // Fetch older messages when scrolled near top
    if (el && el.scrollTop < 50) {
      fetchMessages(false);
    }

    if (!isUserAtBottom.value && currentlyAtBottom) {
      isUserAtBottom.value = true;

      if (messages.value.some(msg => !msg.seen && msg.user_id !== loggedUserId.value)) {
        conversationStore.markConversationAsSeen(props.conversationData.id);
      }
    } else {
      isUserAtBottom.value = currentlyAtBottom;
    }
  }, 200);

  // Setup real-time Echo listeners for chat
  function setupEchoListeners() {
    const conversationId = props.conversationData?.id;
    if (!conversationId) return;

    const channel = window.Echo.private(`chat.${conversationId}`);

    channel.listen('.message.sent', (event) => {
      if (!MessagesStore.messagesByConversation[conversationId]) {
        MessagesStore.messagesByConversation[conversationId] = [];
      }

      const existingMessages = MessagesStore.messagesByConversation[conversationId];

      // Replace temp messages if matched
      const index = existingMessages.findIndex(msg =>
        typeof msg.id === 'string' &&
        msg.id.startsWith('temp-') &&
        msg.user_id === event.message.user_id &&
        msg.id === event.temp_id
      );

      if (index !== -1) {
        existingMessages.splice(index, 1, event.message);
      } else {
        const messageExists = existingMessages.some(msg => msg.id === event.message.id);
        if (!messageExists) {
          existingMessages.push(event.message);
        }
      }

      conversationStore.updateLastMessage(event.message);

      if (isUserAtBottom.value || event.message.user_id === loggedUserId.value) {
        scrollToBottom();

        if (event.message.user_id !== loggedUserId.value && !event.message.seen) {
          conversationStore.markConversationAsSeen(conversationId);
        }
      }
    });

    channel.listen('.message.seen', (event) => {
      const messagesList = MessagesStore.messagesByConversation[conversationId] || [];

      const updatedMessages = messagesList.map(msg => ({
        ...msg,
        seen: true
      }));

      MessagesStore.$patch(state => {
        state.messagesByConversation[conversationId] = updatedMessages;
      });
    });

    return () => {
      window.Echo.leave(`chat.${conversationId}`);
    };
  }

  function cleanupEchoListeners() {
    if (messagesContainer.value) {
      messagesContainer.value.removeEventListener('scroll', handleScroll);
    }
    if (cleanupEcho) {
      cleanupEcho();
      cleanupEcho = null;
    }
  }

  // Lifecycle hooks
  onMounted(async () => {
    await userStore.fetchUser();
    loggedUserId.value = userStore.user.id;
    await fetchMessages();
    await nextTick();
    scrollToBottom();

    if (messagesContainer.value) {
      messagesContainer.value.addEventListener('scroll', handleScroll);
    }

    cleanupEcho = setupEchoListeners();

    if (isScrolledToBottom() &&
        messages.value.some(msg => !msg.seen && msg.user_id !== loggedUserId.value)) {
      conversationStore.markConversationAsSeen(props.conversationData.id);
    }
  });

  onUnmounted(() => {
    cleanupEchoListeners();
  });

  watch(() => props.conversationData?.id, async (newId, oldId) => {
    cleanupEchoListeners();

    if (oldId && messagesContainer.value) {
      windowEcho.leave(`chat.${oldId}`);
      messagesContainer.value.removeEventListener('scroll', handleScroll);
    }

    if (newId) {
      await fetchMessages();
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.addEventListener('scroll', handleScroll);
        }
      });
      cleanupEcho = setupEchoListeners();
    }
  });

  // Wait for all images in container to load before scrolling
  function waitForImagesToLoad(container) {
    const images = container.querySelectorAll('img');
    const promises = [];

    images.forEach(img => {
      if (!img.complete) {
        promises.push(new Promise(resolve => {
          img.onload = img.onerror = resolve;
        }));
      }
    });

    return Promise.all(promises);
  }

  return {
    messages,
    messagesContainer,
    scrollToBottom,
    loading
  };
}
