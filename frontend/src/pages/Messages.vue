<template>
  <div v-if="isChatOpen">
    <Chat :conversationData="selectedConversation" @close="handleCloseChat" />
  </div>
  <div v-else>
    <!-- Prepínač medzi Matches a Messages -->
    <div class="flex justify-center gap-4 my-4">
        <button
        :class="[
        'w-full px-4 py-2 rounded font-semibold transition',
        currentView === 'messages' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
        ]"
        @click="currentView = 'messages'"
        >
        Messages
        </button>
      <button
        :class="[
          'w-full px-4 py-2 rounded font-semibold transition',
          currentView === 'matches' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
        ]"
        @click="currentView = 'matches'"
      >
        Matches
      </button>
    </div>

   
        <!-- Messages View -->
    <div v-if="currentView === 'messages'" class="p-4 text-center">
      <h2 class="text-xl font-semibold text-gray-800 mb-2">Messages</h2>
      <!-- <ChatList @select="handleStartConversation"/> -->
       <ConversationList
            :conversations="conversations"
            :loading="loading"
            :loggedUserId="userStore.user.id"
            :showPhoto="true"
            :showName="true"
            :showLastMessage="true"
            @select="handleStartConversation"
          />

    </div>

    <!-- Matches View -->
    <div v-else class="p-2 max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-3xl">
      <MatchesList @startConversation="handleStartConversation" />
    </div>


  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import MatchesList from '@/components/matches/MatchesList.vue'
import Chat from '../components/chat/Chat.vue';
import { useConversationStore } from '../store/conversationsAndLastMessage';
import ConversationList from '../components/chat/ConversationList.vue';
import useUserStore from '../store/user';
import { useActiveConversationStore } from '../store/useActiveConversationStore';

const userStore = useUserStore();

const conversationStore = useConversationStore();

const isChatOpen = ref(false);
const selectedConversation = ref(null);
const currentView = ref('messages'); // 'matches' | 'messages'

function handleStartConversation(conversation){
  selectedConversation.value =  conversation;
  isChatOpen.value = true;

  conversationStore.markConversationAsSeen(conversation.id);
}
function handleCloseChat() {
  isChatOpen.value = false;
  currentView.value = 'messages'
  
  const activeConversationStore = useActiveConversationStore();
  activeConversationStore.activeConversationID = null;
}

// Data for conversationList 
const loading = ref(false)
const conversations = ref([])

onMounted(async () => {
  loading.value = true
  await conversationStore.fetchConversations()
  conversations.value = conversationStore.conversations
  loading.value = false
})

</script>
