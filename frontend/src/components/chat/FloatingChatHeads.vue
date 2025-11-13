<template>
  <!-- Container for chat head bubbles -->
  <div class="flex flex-row absolute gap-1">
    <!-- Render each conversation as a draggable bubble -->
    <div 
      v-for="conv in conversationsToRender" 
      :key="conv.id" 
      class="absolute cursor-grab z-50 select-none pointer-events-auto"
      :style="{ transform: `translate(${positions[conv.id]?.x}px, ${positions[conv.id]?.y}px)` }"
      @contextmenu.prevent
      @mousedown="onDragStart(conv.id, $event)"
      @touchstart.passive="onDragStart(conv.id, $event)"
      :ref="el => bubbleRefs[conv.id] = el"
      draggable="false"
    >
      <!-- Chat head component -->
      <ChatHeadBubble
        :conversation="conv"
        :logged-user-id="loggedUserId"
        :show-messages="!props.isChatOpen"
        @select="handleSelect"
      />
    </div>
  </div>

<!-- Trash bin for dragging bubbles into -->
<transition name="fade-scale">
  <TrashBin 
    v-show="showTrash" 
    :bubble-in-trash="bubbleInTrash" 
    ref="trashRef" 
  />
</transition>

</template>

<script setup>
import { watch, computed, reactive, ref } from 'vue';
import ChatHeadBubble from './ChatHeadBubble.vue';
import { useConversationStore } from '../../store/conversationsAndLastMessage';
import { useChatUIStore } from '@/store/chatUIStore';
import useUserStore from '../../store/user';
import { useDraggableBubbles } from '@/composable/useDraggableBubbles';
import TrashBin from './TrashBin.vue';

/**
 * Stores and reactive references
 */
const userStore = useUserStore();
const conversationStore = useConversationStore();
const chatUIStore = useChatUIStore();

const trashRef = ref(null);                 // Ref for trash bin element
const bubbleRefs = reactive({});            // Reactive object storing refs to bubble DOM elements
const idOpenChat = ref(0);                  // Currently open chat ID
const positions = reactive({});             // Reactive positions of bubbles
let hasMoved = false;                       // Tracks if a bubble has been dragged

const loggedUserId = userStore.user?.id;

/**
 * Component props and emits
 */
const props = defineProps({
  isChatOpen: { type: Boolean, default: false }   // Whether the chat window is open
});
const emit = defineEmits(['select', 'close', 'drag-start', 'drag-end']); // Event emits

/**
 * Computed: all conversations
 */
const conversations = computed(() => conversationStore.conversations);

/**
 * Computed: conversations to render as bubbles
 * - If chat is open: show all unseen messages or open chats not closed
 * - If chat is closed: show only latest unseen message or last opened chat
 */
const conversationsToRender = computed(() => {
  const isOpen = props.isChatOpen;

  if (isOpen) {
    // Show all unseen or open chats that are not closed
    return conversations.value.filter(c => {
      const last = c.last_message;
      const isUnseenFromOthers = last && last.user_id !== loggedUserId && !last.seen;
      const isChatStillOpen = chatUIStore.openChats.includes(c.id);
      const isClosed = chatUIStore.closedChats.includes(c.id);
      return (isUnseenFromOthers || isChatStillOpen) && !isClosed;
    });
  } else {
    // Chat closed → show 1 latest unseen or last opened chat
    const unseen = conversations.value.filter(c => {
      const last = c.last_message;
      return last && last.user_id !== loggedUserId && !last.seen && !chatUIStore.closedChats.includes(c.id);
    });

    const latestUnseen = unseen.sort((a, b) =>
      new Date(b.last_message.created_at || 0) - new Date(a.last_message.created_at || 0)
    )[0];

    if (latestUnseen) return [latestUnseen];

    const lastOpenId = [...chatUIStore.openChats].reverse().find(id => !chatUIStore.closedChats.includes(id));
    const fallback = conversations.value.find(c => c.id === lastOpenId);
    return fallback ? [fallback] : [];
  }
});

/**
 * Initializes bubble positions for rendering
 * @param {Array} conversations - Array of conversation objects to position
 */
function initializeBubblePositions(conversations) {
  const BUBBLE_WIDTH = 64;
  const GAP = 5;
  const totalWidth = conversations.length * (BUBBLE_WIDTH + GAP) - GAP;
  const startX = window.innerWidth - totalWidth;

  conversations.forEach((conv, index) => {
    positions[conv.id] = {
      x: startX + index * (BUBBLE_WIDTH + GAP),
      y: 5
    };
  });
}

/**
 * Watch for changes in conversationsToRender and reinitialize bubble positions
 */
watch(conversationsToRender, (newConvs) => {
  initializeBubblePositions(newConvs);
}, { immediate: true });

/**
 * Handle bubble click/select
 * - Opens chat if not already open
 * - Marks conversation as seen
 * - Closes bubble if already open
 * @param {Object} conversation - Selected conversation object
 */
function handleSelect(conversation) {
  if (isDragging.value || hasMoved) return;

  if (props.isChatOpen && idOpenChat.value == conversation.id) {
    closeBubble(currentDraggingId.value);
    idOpenChat.value = 0;
  } else {
    idOpenChat.value = conversation.id;
    conversationStore.markConversationAsSeen(conversation.id);
    emit('select', conversation);
  }
}

/**
 * Initialize draggable bubble logic
 */
const {
  onDragStart,
  bubbleInTrash,
  showTrash,
  currentDraggingId,
  isDragging
} = useDraggableBubbles(trashRef, bubbleRefs, positions, emit, closeBubble);

/**
 * Close a bubble and remove its position
 * @param {Number} id - Conversation ID of the bubble to close
 */
function closeBubble(id) {
  emit('close', id);
  idOpenChat.value = null;
  delete positions[id];
}
</script>
