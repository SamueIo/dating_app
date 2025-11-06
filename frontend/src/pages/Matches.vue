<template>
  <div class="mx-auto max-w-6xl p-4 hide-scrollbar">
    <div v-if="MatchesStore.loading" class="fixed inset-0 flex justify-center items-center">
      <Spinner />
    </div>

    <div v-else>
      <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left text-white">
        Matches
      </h1>

      <div
        class="grid gap-3
               grid-cols-2 
               sm:grid-cols-2 
               md:grid-cols-2 
               lg:grid-cols-3"
      >
        <div
          v-for="(user, index) in matches"
          :key="user.id"
          @click="openUser(user.id)"
          :class="[
              'p-1 rounded-xl bg-white/20 backdrop-blur-sm shadow-md hover:shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer',
              (index === 0 && highlightLastMatch) ? 'highlighted' : ''
            ]" 
          >
          <img
            v-if="user.main_photo?.file_name"
            :src="`${API_BASE_URL}/storage/${user.main_photo.file_name}`"
            alt="User photo"
            class="rounded-lg object-cover h-60 w-full mb-3 shadow-sm"
          />
          <p class="font-semibold text-xl text-white">{{ user.name }}</p>
          <p class="text-sm text-white/80">Matched at: {{ formatDate(user.matched_at) }}</p>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div 
      v-if="selectedUserId" 
      class="fixed rounded-lg inset-0 flex items-start justify-center z-50 bg-black/50"
      @click="closeUser"
      @keydown.esc="closeUser"
    >

        <div 
          class="relative shadow-[0_0_40px_rgba(0,0,0,0.6)]  rounded-lg overflow-auto
                w-[95%] sm:w-[80%] md:w-[60%] max-w-[700px] hide-scrollbar"
          :style="{ maxHeight: `calc(100vh - ${bottomNavStore.height}px)`, width: '100%' }"
          @click.stop
        >
        <UserModal 
          :userId="selectedUserId"
          :visible="true"
          @close="closeUser"
        >
          <template #actions>
            <button 
              @click="closeUser" 
              class="absolute top-4 right-4 text-3xl font-bold text-white hover:text-gray-300 
                     bg-black/50 rounded-full w-10 h-10 flex items-center justify-center z-100 shadow-lg"
              aria-label="Close modal"
            >
              &times;
            </button>

                  <!-- Fixed buttons for start conversation -->
            <div 
              class="fixed bottom-20 left-1/2 transform -translate-x-1/2 gap-2 z-30 flex justify-around w-auto bg-white/20 rounded-full shadow-lg  backdrop-blur-sm"
            >
              <button 
                @click="() => startChat(selectedUserId)" 
                class="flex items-center justify-center space-x-2 px-3 py-1.5 rounded-full 
                       bg-purple-700 hover:bg-purple-800 text-white text-sm sm:text-base 
                       font-medium shadow-sm cursor-pointer transition-colors  duration-200 ease-in-out
                       focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-400"
              >
              <span class="select-none">Write a message</span>
            </button>



            </div>
          </template>
        </UserModal>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useMatchesStore } from '../store/matches';
import Spinner from '../ui/Spinner.vue';
import UserModal from '../components/modals/UserModal.vue';
import { API_BASE_URL } from '@/utils/constants';
import { useRoute, useRouter } from 'vue-router';
import { useSiblingsMatchesDataShareStore } from '@/store/siblingsMatchesDataShare';
import axiosClient from '../axios';
import { useBottomNavStore } from '../store/showBottomNavStore';

const route = useRoute();
const router = useRouter();
const MatchesStore = useMatchesStore();
const SiblingsMDSS = useSiblingsMatchesDataShareStore()
const bottomNavStore = useBottomNavStore()
const selectedUserId = ref(null);
const highlightLastMatch = ref(false);

const matches = computed(() => MatchesStore.matches)


function triggerHighlight() {
  highlightLastMatch.value = true;
  setTimeout(() => highlightLastMatch.value = false, 2500); // po 2.5s zmizne
}

function openUser(id) {
  selectedUserId.value = id;

  // fake history path for closeUser to not goint back in history, but to close modal first 
  history.pushState({ modal:true }, '', window.location.href)
}

function closeUser() {
  selectedUserId.value = null;

  if(history.state?.modal) {
    history.back()
  }
}

function handlePopState(e) {
  if(selectedUserId.value ){
    closeUser()
  }
}

async function startChat(selectedUserId) {
  try {
    const response = await axiosClient.post('/api/conversation', { user_id: selectedUserId });
    if (response && response.data) {
      const conversationData = response.data;
      SiblingsMDSS.startConversation(conversationData);
      router.push({name: 'Messages'})

    }
  } catch (err) {
    console.error('Error in creating conversation', err);
  }

  
}

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown date';
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

onMounted(async () => {
  await MatchesStore.fetchMatches();
  if(route.query.highlightMatch){
    triggerHighlight()
  }  
  window.addEventListener('popstate', handlePopState)
});
onUnmounted(() => {
  window.removeEventListener('popstate',handlePopState)
})
</script>

<style scoped>
/* Výška obrázka h-55 môžeš upraviť podľa potreby, napríklad: */
.h-55 {
  height: 220px;
}

.highlighted {
  background: linear-gradient(135deg, #ff7ce5, #9b59b6);
  animation: highlightPulse 1s ease-in-out 2;
  transition: background 0.5s ease;
}

@keyframes highlightPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}
</style>
