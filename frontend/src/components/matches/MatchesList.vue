<template>
   <!-- Spinner -->
      <div v-if="MatchesStore.loading" class="flex items-center justify-center min-h-full">
        <Spinner />
      </div>
      <div v-else>
        <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
           Matches
         </h1>
   
         <div
           v-for="item in MatchesStore.matches"
           :key="item.id"
           class="mb-2 sm:mb-4"
         >
           <div
             class="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-md p-2 transition-colors"
           >
             <img
               :src="`${API_BASE_URL}/storage/${item.main_photo.file_name}`"
               alt="main photo"
               class="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
             />
   
             <div class="flex flex-col flex-grow">
               <h2 class="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                 {{ item.name }}
               </h2>
             </div>
   
             <p @click="createConversation(item.id)" class="text-sm text-gray-900 italic  whitespace-nowrap">
               Start conversation 
             </p>
           </div>
         </div>
      </div>

</template>
<script setup>
import Spinner from '../../ui/Spinner.vue';
import { onMounted, ref } from 'vue';
import { defineEmits } from 'vue';

import { useMatchesStore } from '../../store/matches';
import axiosClient from '../../axios';
import { API_BASE_URL } from '@/utils/constants';


const emit = defineEmits(['startConversation'])
const MatchesStore = useMatchesStore();

onMounted(async () => {
  await MatchesStore.fetchMatches();
});

async function createConversation(id) {
  try {
    const response = await axiosClient.post('/api/conversation', { user_id: id });
    if (response && response.data) {

      const conversationData = response.data;
      emit('startConversation',conversationData)

    }
  } catch (err) {
    console.error('Error in creating conversation', err);
  }
}


</script>