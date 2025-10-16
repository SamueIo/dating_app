<template>
  <div v-if="loading && showName" class="flex justify-center items-center h-64">
    <Spinner />
  </div>
  <div v-else :class="[
  'flex max-w-full mx-auto gap-2 ',
  isChatOpen ? 'flex-row-reverse flex-nowrap' : 'flex-col'
]">
    <div
      v-for="item in conversationsToRender"
      :key="item.id"
       @mouseenter="hoveredChat = item.id"
      @mouseleave="hoveredChat = null"
      @click="$emit('select', item)"
      :class="[
        ' cursor-pointer rounded-lg border shadow-sm transition-all duration-200 flex items-center gap-4 p-1 max-w-full ',
        item.last_message && !item.last_message.seen && item.last_message.user_id !== loggedUserId
          ? 'bg-white/10 border-white/40 shadow-md'
          : 'border-gray-300 hover:border-blue-500 hover:shadow-md'
      ]"
    >
      <!-- Mini bublina -->
      <template v-if="!showLastMessage && !showName">
        <div class="relative flex items-center justify-end w-fit">
        
          <!-- MINI SPRÁVA / BUBLINA -->
          <div
            v-if="showLastMessageBubbles[item.id] && item.last_message?.user_id !== loggedUserId && !isChatOpen"
            class="absolute right-16 top-1/2 -translate-y-1/2 bg-white/70 text-black shadow-md px-3 
            rounded-xl max-w-[240px] w-fit text-sm z-10 line-clamp-2"
          >
            <p
              v-if="item.last_message?.body"
              :class="[
                'break-words whitespace-normal leading-snug',
                item.last_message.user_id !== loggedUserId && !item.last_message.seen
                  ? 'font-medium'
                  : 'text-gray-600'
              ]"
            >
              {{ item.last_message.body }}
            </p>
          
            <!-- Typ správy: image/video/audio -->
            <p v-else-if="item.last_message?.attachments?.[0]?.type === 'image'" class="text-gray-500 italic">📷 image</p>
            <p v-else-if="item.last_message?.attachments?.[0]?.type === 'video'" class="text-gray-500 italic">🎥 video</p>
            <p v-else-if="item.last_message?.attachments?.[0]?.type === 'audio'" class="text-gray-500 italic">🎵 audio</p>
          
            <!-- Default message -->
            <p v-else class="text-gray-400 italic">Write your first message</p>
          </div>
        
          <!-- AVATAR -->
          <div class="relative w-14 h-14 flex-shrink-0">
            <img
              v-if="showPhoto && item.other_user.main_photo"
              :src="`${API_BASE_URL}/storage/${item.other_user.main_photo.file_name}`"
              alt="user photo"
              class="w-14 h-14 rounded-full object-cover"
              draggable="false"
            />
            <div v-else class="w-14 h-14  rounded-full object-cover flex-shrink-0 bg-black/20"></div>

            <span
              v-if="item.last_message?.user_id !== loggedUserId && item.last_message?.seen !== 1"
              class="absolute top-[-3px] right-[-3px] block w-3 h-3 bg-red-500 rounded-full border-2 border-white"
              title="New message"
            ></span>
          
            <!-- ZAVRIEŤ TLAČIDLO -->
            <button
              v-if="showCloseButton && hoveredChat === item.id"
              @click.stop="closeChat(item.id)"
              class="absolute -top-2 -left-2 w-6 h-6 flex items-center justify-center text-xs font-bold text-white bg-black/60 rounded-full hover:bg-red-600 hover:text-white shadow-md z-50 transition-all duration-200"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
        </div>
      </template>



      <!-- Štandardné zobrazenie -->
      <template v-else>
        <img
          v-if="showPhoto && item.other_user.main_photo"
          :src="`${API_BASE_URL}/storage/${item.other_user.main_photo.file_name}`"
          alt="user photo"
          class="w-14 h-14  rounded-full object-cover flex-shrink-0"
        />
        <div v-else class="w-14 h-14  rounded-full object-cover flex-shrink-0 bg-black/20"></div>
        <h2 v-if="showName" class="text-lg font-semibold text-gray-900">
          {{ item.other_user?.name }}
        </h2>
        <div v-if="showLastMessage || showLastMessageBubbles[item.id]" class="w-full">
          <p
            v-if="item.last_message?.body"
            :class="[
              'text-sm sm:text-base truncate text-left max-w-[70%]',
              item.last_message.user_id !== loggedUserId && !item.last_message.seen
                ? 'text-white'
                : 'text-black/80'
            ]"
          >
            {{ item.last_message.body }}
          </p>
          <p v-else-if="item.last_message?.attachments?.[0]?.type === 'image'" class="text-sm text-black/60 max-w-[70%]">
            image
          </p>
          <p v-else-if="item.last_message?.attachments?.[0]?.type === 'video'" class="text-sm text-black/60 max-w-[70%]">
            video
          </p>
          <p v-else-if="item.last_message?.attachments?.[0]?.type === 'audio'" class="text-sm text-black/60 max-w-[70%]">
            audio
          </p>
          <p v-else class="text-white/40 italic text-left max-w-[70%]">
            Write your first message
          </p>
        </div>
    <!-- Obal okolo tlačidla a rolety -->
        <div class="relative">
          <!-- Button pre zobrazenie nastavení -->
          <button
            @click.stop="showChatOptions(item.id)"
            class="text-xl text-white cursor-pointer select-none hover:text-pink-300 transition p-2 "
          >
            ...
          </button>
        
          <!-- Roleta s nastaveniami -->
          <div
            v-if="activeChatOptions === item.id"
            class="absolute right-0 top-full bg-white/10 backdrop-blur-sm text-white p-2 rounded-lg shadow-xl mt-1 z-20 min-w-[160px] whitespace-nowrap border border-white/20"
          >
            <ul>
              <li
                class="py-2 px-4 rounded hover:bg-white/20 hover:text-pink-300 cursor-pointer transition-all duration-150"
                @click.stop="openChatElsewhere(item.id)"
              >
                💬 Open chat bubble
              </li>
              <!-- <li
                class="py-2 px-4 rounded hover:bg-white/20 hover:text-indigo-300 cursor-pointer transition-all duration-150"
                @click.stop="clearConversation(item.id)"
              >
                🧹 Clear conversation
              </li> -->
              <li
                class="py-2 px-4 rounded hover:bg-white/20 hover:text-indigo-300 cursor-pointer transition-all duration-150"
                @click.stop="blockUser(item.other_user.id)"
              >
                🚫 Block user
              </li>

            </ul>
          </div>
        </div>

     
      </template>
    </div>
  </div>
</template>

<script setup>
/**
 * ConversationList Component
 * 
 * Displays a list of chat conversations with configurable UI options.
 * 
 * Features:
 * - Shows loading spinner while loading data.
 * - Displays each conversation as a clickable item.
 * - Supports showing/hiding user photo, user name, last message text, and close button.
 * - Highlights conversations with unread messages.
 * - Emits events for conversation selection and drag start.
 * - Supports hover effects and touch events for mobile drag start.
 * 
 * Props:
 * - loading (Boolean): Controls loading state and spinner visibility.
 * - loggedUserId (Number | String): ID of the current logged-in user, used to check message ownership and read status.
 * - showPhoto (Boolean, default: true): Whether to display user's avatar photo.
 * - showName (Boolean, default: true): Whether to display the other user's name.
 * - showEveryChat (Boolean, default: true): If false, filters the conversation list to show only open or unread chats.
 * - showLastMessage (Boolean, default: true): Toggles display of the last message text.
 * - showCloseButton (Boolean, default: true): Toggles display of the close button on hovered chat items.
 * - showLastMessageBubbles (Object, default: {}): Controls showing last message bubble style per conversation ID.
 * 
 * Emits:
 * - select (Conversation): Emitted when a conversation is clicked/selected.
 * - dragStart (conversationId): Emitted when dragging of a conversation starts (mousedown or touchstart).
 * 
 * Reactive Data:
 * - hoveredChat (ref): Tracks currently hovered conversation ID to show/hide close button.
 * - conversations (computed): All conversations from the global store.
 * - visibleConversations (computed): Filtered conversations based on open chats and unread status.
 * - conversationsToRender (computed): Final list of conversations to display based on props.showEveryChat.
 * 
 * Methods:
 * - closeChat(chatId): Closes the chat by updating the chat UI store.
 * 
 * Usage:
 * This component is ideal for showing a sidebar or a panel with all chat conversations.
 * It allows user interaction with each chat through selection, drag-and-drop, and closing.
 */


import { computed, ref, watch } from 'vue';
import Spinner from '../../ui/Spinner.vue';
import { useConversationStore } from '../../store/conversationsAndLastMessage';
import { useChatUIStore } from '@/store/chatUIStore';
// import { useChatUIStore } from '../../store/chatUIStore';
import { useRoute, useRouter } from 'vue-router';
import axiosClient from '../../axios';
import { API_BASE_URL } from '@/utils/constants';


const router = useRouter();
const route = useRoute();

const props = defineProps({
  loading: Boolean,
  loggedUserId: [Number, String],
  conversations: { type: Array, default: () => [] },
  isChatOpen: { type:Boolean, default: false}, 
  // Konfigurácia zobrazenia
  showPhoto: { type: Boolean, default: true },
  showName: { type: Boolean, default: true },
  showEveryChat: { type: Boolean, default: true },
  showLastMessage: { type: Boolean, default: true },
  showCloseButton: { type: Boolean, default: true },
  showLastMessageBubbles: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['select','dragStart']);

const hoveredChat = ref(null);
const activeChatOptions = ref(null);

const conversationStore = useConversationStore();
const chatUIStore = useChatUIStore();

// ✅ Reaktívne získavanie konverzácií priamo zo store
const conversations = computed(() => conversationStore.conversations);

// 🔍 Filtrovanie na otvorené alebo neprečítané
const visibleConversations = computed(() => {
  return conversations.value.filter((c) => {
    const isOpen = chatUIStore.openChats.includes(c.id);
    const isClosed = chatUIStore.closedChats.includes(c.id);
    const hasUnread =
      c.last_message &&
      !c.last_message.seen &&
      c.last_message.user_id !== props.loggedUserId;

    return isOpen || (hasUnread && !isClosed);
  });
});


function closeChat(chatId) {
  chatUIStore.closeChat(chatId);
}


const openConversations = computed(() => {
  const openIds = chatUIStore.openChats.value; // ← správne!
  return conversations.value.filter(c => openIds.includes(c.id));
});

const conversationsToRender = computed(() => {
  
  if (props.isChatOpen || props.showCloseButton) {    
    return props.showEveryChat ? conversations.value : visibleConversations.value;
  } 
  // else {
  //   const openChats = openConversations.value;
  //   if (openChats.length > 0) {
  //     return [openChats[0]];
  //   }
  //   return lastConversation.value ? [lastConversation.value] : [];
  // }
    
});

function showChatOptions(chatId) {
  // Prepína zobrazenie roletky pre kliknutý chat
  activeChatOptions.value = activeChatOptions.value === chatId ? null : chatId;
}

function openChatElsewhere(chatId) {
  const isInMessagesPage = route.path === '/messages';

  if (isInMessagesPage) {
    // 1. Presmeruj napríklad do /swipes
    router.push('/swipes');

    // 2. Počkáj chvíľku a otvor chat
    setTimeout(() => {
      chatUIStore.openChat(chatId);
    }, 300); // záleží na animácii/prechode stránky
  } else {
    chatUIStore.openChat(chatId);
  }
}
async function blockUser(id) {
  // Closing option menu 
  activeChatOptions.value = null;

  try {
    const response = await axiosClient.post(`/api/blockUser/${id}`);
    if (response) {
      conversationStore.conversations = conversationStore.conversations.filter(c => c.other_user.id !== id)
    }
  } catch (err) {
    console.log('Error in blocking user:', err);
  }
}





</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>