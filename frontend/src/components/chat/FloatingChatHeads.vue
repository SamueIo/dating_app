<template>
  <div class="flex flex-row absolute gap-1">
    <div 
      v-for="conv in conversationsToRender" 
      :key="conv.id" 
      class="absolute cursor-grab z-50"
      :style="{ transform: `translate(${positions[conv.id]?.x}px, ${positions[conv.id]?.y}px)` }"
      @mousedown="onDragStart(conv.id, $event)"
      @touchstart.passive="onDragStart(conv.id, $event)"
      :ref="el => bubbleRefs[conv.id] = el"
    >
      <ChatHeadBubble
        :conversation="conv"
        :logged-user-id="loggedUserId"
        :show-messages="!props.isChatOpen"
        @select="handleSelect"
      />
    </div>

  </div>

  <div
    v-if="showTrash"
    ref="trashRef"
    class="fixed bottom-20 left-1/2 -translate-x-1/2 h-20 w-20 flex justify-center items-center z-40"
  >
    <div
      :class="[
        'w-20 h-20 flex justify-center items-center text-5xl rounded-full shadow-2xl transition-all duration-300',
        bubbleInTrash
          ? 'text-white scale-110 backdrop-blur-md shadow-red-900/70'
          : 'bg-black/20 text-white'
      ]"
      style="backdrop-filter: blur(8px);"
    >
      🗑️
    </div>
  </div>
</template>

<script setup>
import { watch, computed, reactive, ref } from 'vue';
import ChatHeadBubble from './ChatHeadBubble.vue';
import { useConversationStore } from '../../store/conversationsAndLastMessage';
import { useChatUIStore } from '@/store/chatUIStore';
// import { useChatUIStore } from '../../store/chatUIStore';
import useUserStore from '../../store/user';

const userStore = useUserStore();
const conversationStore = useConversationStore();
const chatUIStore = useChatUIStore();

const positions = reactive({});
const trashRef = ref(null);
const showTrash = ref(false);
const bubbleInTrash = ref(false);
const currentDraggingId = ref(null);
const lockBounds = ref(null);
const bubbleRefs = reactive({});
const idOpenChat = ref(0)

let hasMoved = false;


const loggedUserId = userStore.user?.id;

const props = defineProps({
  isChatOpen: { type: Boolean, default: false }
});
const emit = defineEmits(['select', 'close', 'drag-start', 'drag-end']);

const conversations = computed(() => conversationStore.conversations);


const conversationsToRender = computed(() => {
  const isOpen = props.isChatOpen;

  if (isOpen) {
    // Chat otvorený → všetky nevidené alebo otvorené, ktoré nie sú zavreté
    return conversations.value.filter(c => {
      const last = c.last_message;

      const isUnseenFromOthers =
        last &&
        last.user_id !== loggedUserId &&
        !last.seen;

      const isChatStillOpen = chatUIStore.openChats.includes(c.id);
      const isClosed = chatUIStore.closedChats.includes(c.id);

      return (isUnseenFromOthers || isChatStillOpen) && !isClosed;
    });
  } else {
    // Chat nie je otvorený → 1 nevidená správa (ak existuje), alebo posledná otvorená
    const unseen = conversations.value.filter(c => {
      const last = c.last_message;
      return (
        last &&
        last.user_id !== loggedUserId &&
        !last.seen &&
        !chatUIStore.closedChats.includes(c.id)
      );
    });

    // Zoradíme a zoberieme najnovšiu neprijatú
    const latestUnseen = unseen.sort((a, b) =>
      new Date(b.last_message.created_at || 0) - new Date(a.last_message.created_at || 0)
    )[0];

    if (latestUnseen) return [latestUnseen];

    // Inak fallback — zober poslednú z `openChats` (ak je)
    const lastOpenId = [...chatUIStore.openChats].reverse().find(id =>
      !chatUIStore.closedChats.includes(id)
    );

    const fallback = conversations.value.find(c => c.id === lastOpenId);

    return fallback ? [fallback] : [];
  }
});



watch(conversationsToRender, (newConvs) => {
  const BUBBLE_WIDTH = 64;
  const GAP = 5;
  const totalWidth = newConvs.length * (BUBBLE_WIDTH + GAP) - GAP;
  const startX = window.innerWidth - totalWidth;

  newConvs.forEach((conv, index) => {
    // VŽDY nastav pozície doprava hore — ignoruj predchádzajúce
    positions[conv.id] = {
      x: startX + index * (BUBBLE_WIDTH + GAP) ,
      y: 5
    };
  });
}, { immediate: true });


// Determine if we open chat and mark conversation as read, 
// or if its already opened, than close chat
function handleSelect(conversation) {
  if (isDragging.value || hasMoved) return;   

if(props.isChatOpen && idOpenChat.value == conversation.id ){    
    closeBubble(currentDraggingId.value);
    idOpenChat.value = 0
  }else{
    idOpenChat.value = conversation.id
    conversationStore.markConversationAsSeen(conversation.id);
    emit('select', conversation);
  }
}

// ** DRAG & DROP LOGIKA **

let isDragging = ref(false);
let dragStart = { x: 0, y: 0 };
let elementStart = { x: 0, y: 0 };
let pointerOffset = { x: 0, y: 0 };
let wasInTrash = false;

function getTrashRect() {
  return trashRef.value?.getBoundingClientRect() || null;
}

function onDragStart(id, event) {
  currentDraggingId.value = id;
  showTrash.value = true;
  hasMoved = false;
  emit('drag-start', id);

  isDragging.value = true;

  const e = event.type.startsWith('touch') ? event.touches[0] : event;

  dragStart.x = e.clientX;
  dragStart.y = e.clientY;

  elementStart.x = positions[id]?.x || 0;
  elementStart.y = positions[id]?.y || 0;

  pointerOffset = {
    x: e.clientX - elementStart.x,
    y: e.clientY - elementStart.y
  };

  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);
  window.addEventListener('touchmove', onDragMove, { passive: false });
  window.addEventListener('touchend', onDragEnd);
}

function onDragMove(event) {
  if (!isDragging.value) return;

  hasMoved = true;

  if (event.cancelable) event.preventDefault();

  const e = event.type.startsWith('touch') ? event.touches[0] : event;

  const clientX = e.clientX;
  const clientY = e.clientY;

  const trashRect = getTrashRect();
  if (!trashRect) return;

  const TRASH_PADDING = 5;
  const isNearBottom = clientY > window.innerHeight * 0.66;

  const pointerInTrashZone =
    isNearBottom &&
    clientX >= trashRect.left - TRASH_PADDING &&
    clientX <= trashRect.right + TRASH_PADDING &&
    clientY >= trashRect.top - TRASH_PADDING &&
    clientY <= trashRect.bottom + TRASH_PADDING;

  bubbleInTrash.value = pointerInTrashZone;

  if (pointerInTrashZone && !wasInTrash) {
    wasInTrash = true;

    // Get the actual bubble element to measure its size
    const bubbleEl = bubbleRefs[currentDraggingId.value];
    let bubbleWidth = 80;
    let bubbleHeight = 80;

    if (bubbleEl) {
      const rect = bubbleEl.getBoundingClientRect();
      bubbleWidth = rect.width;
      bubbleHeight = rect.height;
    }

    const centerX = trashRect.left + trashRect.width / 2 - bubbleWidth / 2;
    const centerY = trashRect.top + trashRect.height / 2 - bubbleHeight / 2;

    positions[currentDraggingId.value] = { x: centerX, y: centerY };

    lockBounds.value = {
      minX: centerX,
      maxX: centerX,
      minY: centerY,
      maxY: centerY,
    };
  } else if (!pointerInTrashZone && wasInTrash) {
    wasInTrash = false;
    lockBounds.value = null;
    updatePosition(clientX, clientY);
  } else {
    updatePosition(clientX, clientY);
  }
}


function updatePosition(clientX, clientY) {

  const maxX = window.innerWidth - 55;
  const maxY = window.innerHeight - 120;

  if (
    lockBounds.value &&
    lockBounds.value.minX === lockBounds.value.maxX &&
    lockBounds.value.minY === lockBounds.value.maxY
  ) {
    positions[currentDraggingId.value] = { x: lockBounds.value.minX, y: lockBounds.value.minY };
    return;
  }

  let newX = clientX - pointerOffset.x;
  let newY = clientY - pointerOffset.y;

  if (lockBounds.value) {
    newX = Math.max(lockBounds.value.minX, Math.min(newX, lockBounds.value.maxX));
    newY = Math.max(lockBounds.value.minY, Math.min(newY, lockBounds.value.maxY));
  } else {
    // Tu je úprava — nemôžeš dať x pod 0 ani nad maxX
    newX = Math.min(Math.max(newX, 0), maxX);
    newY = Math.min(Math.max(newY, 0), maxY);
  }

  positions[currentDraggingId.value] = { x: newX, y: newY };
}


function onDragEnd() {
  if (!isDragging.value) return;

  isDragging.value = false;

  if (hasMoved && bubbleInTrash.value) {
    closeBubble(currentDraggingId.value);
  }

  showTrash.value = false;
  bubbleInTrash.value = false;
  wasInTrash = false;
  currentDraggingId.value = null;

  lockBounds.value = null;   

  window.removeEventListener('mousemove', onDragMove);
  window.removeEventListener('mouseup', onDragEnd);
  window.removeEventListener('touchmove', onDragMove);
  window.removeEventListener('touchend', onDragEnd);

  emit('drag-end');
}


function closeBubble(id) {
  emit('close', id);
  idOpenChat.value = null
  delete positions[id];
}

</script>
