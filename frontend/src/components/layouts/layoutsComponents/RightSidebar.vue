<template>
  <aside class="w-1/5 p-2 bg-black/10 text-white border-l border-white/10 relative flex flex-col">

    <!-- User profile avatar with dropdown menu -->
    <UserAvatarMenu/>

    <!-- Plus button to toggle chat dropdown -->
    <div v-if="showAddBubbles" class="flex justify-end mt-6">
      <button
        @click="toggleDropdown"
        class="
          w-12 h-12
          flex items-center justify-center
          text-2xl font-bold
          rounded-full
          bg-white/10 text-white
          border border-white/30
          shadow-md mb-1
          hover:bg-pink-600 hover:shadow-lg
          transition-all duration-200
        "
        aria-label="Open chat list"
      >
        +
      </button>
    </div>

    <!-- Conversation dropdown menu -->
    <ConversationDropdown
      :show="showDropdown"
      :conversations="conversations"
      @select="openConversation"
    />

    <!-- Conversation list with scrolling -->
    <div v-if="!route.path.startsWith('/messages')" class="flex-1 mt-4 overflow-y-auto">
      <ConversationList
        :conversations="conversations"
        :loading="loading"
        :loggedUserId="userStore.user?.id ?? null"
        :showPhoto="true"
        :showLastMessage="false"
        :showLastMessageBubbles="chatUIStore.showLastMessageBubbles"
        :showName="false"
        :showEveryChat="false"
        :showCloseButton="true"
        @select="openConversation"
        class="flex flex-col items-end pt-10"
      />
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watchEffect, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import ConversationDropdown from '../../chat/ConversationDropdown.vue';
import ConversationList from '../../chat/ConversationList.vue';
import { useChatUIStore } from '@/store/chatUIStore';
import useUserStore from '../../../store/user';
import { useConversationStore } from '../../../store/conversationsAndLastMessage';
import { useActiveConversationStore } from '../../../store/useActiveConversationStore';
import UserAvatarMenu from '../../profile/ProfileComponents/UserAvatarMenu.vue';
import { useChatManagerMiniPortableChat } from '@/composable/useChatManagerMiniPortableChat';

// Router instance
const route = useRoute();

// Stores
const chatUIStore = useChatUIStore();
const userStore = useUserStore();
const conversationStore = useConversationStore();
const activeConversationStore = useActiveConversationStore();

// Local reactive states
const loading = ref(false);                // Loading state for conversations
const showDropdown = ref(false);           // Toggle state for chat dropdown
const showAddBubbles = ref(false);         // Show "plus" bubble button

// Emits
const emit = defineEmits(['select']);

// Computed list of conversations
const conversations = computed(() => conversationStore.conversations);

// Import chat management composable
const {
  handleClosePlusBubble,
  toggleDropdown,
  openConversation,
  closeConversation
} = useChatManagerMiniPortableChat(emit, showDropdown);

// Watch route changes to handle chat visibility
watch(
  () => route.path,
  (newPath) => {
    if (newPath && newPath.startsWith('/messages')) {
      closeConversation();      // Close current conversation
      handleClosePlusBubble();  // Hide "plus" bubble button
    } else {
      showAddBubbles.value = true; // Show "plus" bubble button
    }
  },
  { immediate: true }
);

// Bottom navigation reference for positioning chat
const bottomNavRef = ref(null);
const chatOffset = ref(75);

// Update chat offset dynamically based on bottom nav height
watchEffect(() => {
  if (bottomNavRef.value) {
    const rect = bottomNavRef.value.getBoundingClientRect();
    chatOffset.value = rect.height;
  }
});

// Clean up active conversation on component unmount
onUnmounted(async () => {
  if (activeConversationStore.activeConversationID) {
    activeConversationStore.clearActiveConversation();
  }
});
</script>
