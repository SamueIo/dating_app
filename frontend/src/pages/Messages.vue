<template>
  <div v-if="isChatOpen " class="flex-1">
    <Chat :conversationData="selectedConversation" @close="handleCloseChat" />
  </div>
  <div v-else>
    <!-- Prepínač medzi Matches a Messages -->
    <div class="flex justify-center gap-4 my-4">
      <button
        :class="[
          'w-full px-4 py-2 rounded font-semibold transition-all duration-200',
          currentView === 'messages' 
            ? 'bg-blue-500 text-white shadow-md' 
            : 'bg-white text-blue-500 border border-blue-500'
        ]"
        @click="currentView = 'messages'"
      >
        Messages
      </button>
    
      <button
        :class="[
          'w-full px-4 py-2 rounded font-semibold transition-all duration-200',
          currentView === 'matches' 
            ? 'bg-blue-500 text-white shadow-md' 
            : 'bg-white text-blue-500 border border-blue-500'
        ]"
        @click="currentView = 'matches'"
      >
        Matches
      </button>
    </div>

   
        <!-- Messages View -->
    <div v-if="currentView === 'messages'" class="p-4 mb-4 text-center ">
      <h2 class="text-xl font-semibold text-gray-800 mb-2">Messages</h2>
      <!-- <ChatList @select="handleStartConversation"/> -->
       <ConversationList
            :conversations="conversations"
            :loading="loading"
            :loggedUserId="userStore.user?.id ?? null"
            :showPhoto="true"
            :showName="true"
            :showLastMessage="true"
            @select="handleStartConversation"
          />

    </div>

    <!-- Matches View -->
    <div v-else class="p-4 mb-4 z-10">
      <MatchesList @startConversation="handleStartConversation" />
    </div>


  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import MatchesList from '@/components/matches/MatchesList.vue'
import Chat from '../components/chat/Chat.vue';
import { useConversationStore } from '../store/conversationsAndLastMessage';
import ConversationList from '../components/chat/ConversationList.vue';
import useUserStore from '../store/user';
import { useActiveConversationStore } from '../store/useActiveConversationStore';
import { useBottomNavStore } from '../store/showBottomNavStore';
import { onBeforeRouteLeave } from 'vue-router';
import { useSiblingsMatchesDataShareStore } from '../store/siblingsMatchesDataShare';


const userStore = useUserStore();
const BottomNavStore = useBottomNavStore();
const conversationStore = useConversationStore();
const SiblingsMDSS = useSiblingsMatchesDataShareStore();

const isChatOpen = ref(false);
const selectedConversation = ref(null);
const currentView = ref('messages'); // 'matches' | 'messages'

// Data for conversationList 
const loading = ref(false)
const conversations = ref([])

function handleStartConversation(conversation){
  selectedConversation.value =  conversation;  
  isChatOpen.value = true;

  BottomNavStore.hideBottomNav();
  conversationStore.markConversationAsSeen(conversation.id);
}
function handleCloseChat() {
  isChatOpen.value = false;
  currentView.value = 'messages'
  
  BottomNavStore.showBottomNavFn();
  const activeConversationStore = useActiveConversationStore();
  activeConversationStore.activeConversationID = null;
}

// This navigation guard runs every time the user tries to 
// navigate away from the current route.
// It can intercept both manual route changes (e.g. router.push()) 
// and browser actions (like the back button).

onBeforeRouteLeave((to, from, next) => {
  if (isChatOpen.value) {
    handleCloseChat();
    console.log('debug');

    BottomNavStore.showBottomNavFn();
    next(false);
  } else {
    next();
  }
});


onMounted(async () => {
  loading.value = true

  if (SiblingsMDSS.conversationData ) {
    handleStartConversation(SiblingsMDSS.conversationData);
    SiblingsMDSS.conversationData = null;
  }

  await conversationStore.fetchConversations()
  conversations.value = conversationStore.conversations
  loading.value = false
})

</script>
