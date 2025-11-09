<template>
  <!-- Loading spinner while matches are being fetched -->
  <div v-if="MatchesStore.loading" class="flex items-center justify-center min-h-full">
    <Spinner />
  </div>

  <!-- Matches list -->
  <div v-else class="cursor-pointer">
    <!-- Section title -->
    <h2 class="text-xl font-semibold text-gray-800 text-center mb-2">Matches</h2>

    <!-- Iterate over matches -->
    <div
      v-for="item in MatchesStore.matches"
      :key="item.id"
      class="mb-2"
    >
      <div
        class="flex items-center gap-4 border border-white-300 hover:border-blue-500 hover:shadow-md rounded-lg p-1 transition-colors"
      >
        <!-- User main photo -->
        <img
          :src="`${API_BASE_URL}/storage/${item.main_photo?.file_name}`"
          alt="main photo"
          class="w-14 h-14 rounded-full object-cover flex-shrink-0"
        />

        <!-- User name -->
        <div class="flex flex-col flex-grow">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ item.name }}
          </h2>
        </div>

        <!-- Start conversation button -->
        <p
          @click="createConversation(item.id)"
          class="text-sm text-gray-900 italic w-full text-right pr-2 whitespace-nowrap"
        >
          Start conversation 
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * MatchesComponent
 * 
 * - Fetches the list of matches from the store on mount
 * - Displays a loading spinner while matches are loading
 * - Displays each match with photo and name
 * - Allows starting a conversation with a match
 */

import Spinner from '../../ui/Spinner.vue';
import { onMounted, defineEmits } from 'vue';
import { useMatchesStore } from '../../store/matches';
import axiosClient from '../../axios';
import { API_BASE_URL } from '@/utils/constants';

// Event emitter to notify parent component when a conversation starts
const emit = defineEmits(['startConversation']);

// Reactive store for matches
const MatchesStore = useMatchesStore();

// Fetch matches on component mount
onMounted(async () => {
  await MatchesStore.fetchMatches();
});

/**
 * Start a conversation with the given user ID
 * - Sends a POST request to create a conversation
 * - Emits 'startConversation' event with the conversation data
 */
async function createConversation(id) {
  try {
    const response = await axiosClient.post('/api/conversation', { user_id: id });
    if (response && response.data) {
      const conversationData = response.data;
      console.log('conversationData in createConversation', conversationData);

      // Emit event to parent component
      emit('startConversation', conversationData);
    }
  } catch (err) {
    console.error('Error in creating conversation', err);
  }
}
</script>
