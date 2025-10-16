<template>
  <div v-if="MatchesStore.loading" class="flex items-center justify-center min-h-full">
    <Spinner />
  </div>
  <div v-else class="p-2 max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-3xl">
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
      
        <p class="text-sm text-gray-900 italic ml-auto whitespace-nowrap">
          Matched at: {{ item.matched_at }}
        </p>
      </div>

    </div>
  </div>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import { useMatchesStore } from '../store/matches';
import Spinner from '../ui/Spinner.vue';
import { API_BASE_URL } from '@/utils/constants';


const MatchesStore = useMatchesStore();
onMounted( async() => {
  await MatchesStore.fetchMatches();
  console.log(MatchesStore.matches)
})



</script>