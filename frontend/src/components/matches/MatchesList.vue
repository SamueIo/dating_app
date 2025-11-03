<template>
   <!-- Spinner -->
      <div v-if="MatchesStore.loading" class="flex items-center justify-center min-h-full">
        <Spinner />
      </div>
      <div v-else class="cursor-pointer">
        <h2 class="text-xl font-semibold text-gray-800 text-center mb-2">Matches</h2>
         <div
           v-for="item in MatchesStore.matches"
           :key="item.id"
           class="mb-2 "
         >
           <div
             class="flex items-center gap-4 border border-white-300 hover:border-blue-500 hover:shadow-md rounded-lg p-1 transition-colors"
           >
             <img
               :src="`${API_BASE_URL}/storage/${item.main_photo?.file_name}`"
               alt="main photo"
               class="w-14 h-14 rounded-full object-cover flex-shrink-0"
             />
   
             <div class="flex flex-col flex-grow">
               <h2 class="text-lg font-semibold text-gray-900">
                 {{ item.name }}
               </h2>
             </div>
   
             <p @click="createConversation(item.id)" class="text-sm text-gray-900 italic w-full text-right pr-2 whitespace-nowrap">
               Start conversation 
             </p>
           </div>
         </div>
      </div>

</template>
<script setup>
import Spinner from '../../ui/Spinner.vue';
import { onMounted } from 'vue';
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
      console.log('conversationData in createConversation',conversationData);
      
      emit('startConversation',conversationData)

    }
  } catch (err) {
    console.error('Error in creating conversation', err);
  }
}


</script>