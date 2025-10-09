<template>
    <aside class="w-1/5 p-2  bg-black/10 text-white border-l border-white/10 relative flex flex-col">

        <!-- Profile photo w ith dropdown menu -->
        <UserAvatarMenu/>
    
        <!-- Plus button to create chat bubble -->
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
    
        <ConversationDropdown
          :show="showDropdown"
          :conversations="conversations"
          @select="handleStartConversation"
        />
    
        <!-- Conversation list with margin top and scroll -->
        <div v-if="!route.path.startsWith('/messages')" class="flex-1 mt-4 overflow-y-auto">
          <ConversationList
            :conversations="conversations"
            :loading="loading"
            :loggedUserId="userStore.user.id"
            :showPhoto="true"
            :showLastMessage="false"
            :showLastMessageBubbles="chatUIStore.showLastMessageBubbles"
            :showName="false"
            :showEveryChat="false"
            :showCloseButton="true"
            @select="handleStartConversation"
            class="flex flex-col items-end pt-18"
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
// import { useChatUIStore } from '../../../store/chatUIStore';

const route = useRoute();
const chatUIStore = useChatUIStore();
const userStore = useUserStore();
const conversationStore = useConversationStore();
const activeConversationStore = useActiveConversationStore();

const loading = ref(false);
const showDropdown = ref(false);
const isChatOpen  = ref(false)
const showAddBubbles = ref(false)
const currentConversationId = ref(null)


const emit= defineEmits(['select'])
const conversations = computed(() => conversationStore.conversations);


function toggleDropdown (){
    showDropdown.value = !showDropdown.value
}


function handleCloseChat() {
  activeConversationStore.clearActiveConversation()
  chatUIStore.closeChat(currentConversationId.value)
  chatUIStore.isChatOpen = false; 
  isChatOpen.value = false;
}

function handleStartConversation(conversation) {
  activeConversationStore.setActiveConversation(conversation.id);
  chatUIStore.openChat(conversation.id);
  currentConversationId.value = (conversation.id)

  isChatOpen.value = true
  conversationStore.markConversationAsSeen(conversation.id);
  showDropdown.value = false
  emit('select', conversation)
}
function handleClosePlusBubble(){
  showAddBubbles.value = false
}


watch(
  () => route.path,
  (newPath) => {
    if (newPath && newPath.startsWith('/messages')) {
      handleCloseChat();
      handleClosePlusBubble();
    } else {
      showAddBubbles.value = true;
    }
  },
  { immediate: true }
);


// For right positioning miniportablechat 
const bottomNavRef = ref(null)
const chatOffset = ref(75) //

watchEffect(() => {
  if (bottomNavRef.value) {
    const rect = bottomNavRef.value.getBoundingClientRect()
    chatOffset.value = rect.height
  }
})

onUnmounted(async () => {

  if(activeConversationStore.activeConversationID){
    activeConversationStore.clearActiveConversation()
  }

})
</script>