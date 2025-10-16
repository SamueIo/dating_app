<template>
  <div class="mx-auto max-w-6xl p-4 .hide-scrollbar">
    <div v-if="MatchesStore.loading" class="fixed inset-0 flex justify-center items-center">
      <Spinner />
    </div>

    <div v-else>
      <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left text-white">
        Matches
      </h1>

      <div
        class="grid gap-6 
               grid-cols-1 
               sm:grid-cols-2 
               md:grid-cols-3 
               lg:grid-cols-4"
      >
        <div
          v-for="user in MatchesStore.matches"
          :key="user.id"
          @click="openUser(user.id)"
          class="p-1 rounded-xl bg-white/20 backdrop-blur-sm shadow-md hover:shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer"
        >
          <img
            v-if="user.main_photo?.file_name"
            :src="`${API_BASE_URL}/storage/${user.main_photo.file_name}`"
            alt="User photo"
            class="rounded-lg object-cover h-55 w-full mb-3 shadow-sm"
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
    >
<div 
  class="relative shadow-[0_0_40px_rgba(0,0,0,0.6)] p-2 rounded-lg overflow-auto
         w-[95%] sm:w-[80%] md:w-[60%] max-w-[700px] max-h-[calc(100vh-65px)]"
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
          </template>
        </UserModal>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useMatchesStore } from '../store/matches';
import Spinner from '../ui/Spinner.vue';
import UserModal from '../components/modals/UserModal.vue';
import { API_BASE_URL } from '@/utils/constants';


const MatchesStore = useMatchesStore();
const selectedUserId = ref(null);

onMounted(async () => {
  await MatchesStore.fetchMatches();
});

function openUser(id) {
  selectedUserId.value = id;
}

function closeUser() {
  selectedUserId.value = null;
}

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown date';
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}
</script>

<style scoped>
/* Výška obrázka h-55 môžeš upraviť podľa potreby, napríklad: */
.h-55 {
  height: 220px;
}
</style>
