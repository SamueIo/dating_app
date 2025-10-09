<template>
  <button
    @click.stop="toggleStatus"
    class="flex items-center justify-between w-full px-2 py-2 gap-2 hover:bg-pink-200 transition-colors duration-200"
  >
    <span class="whitespace-nowrap">Offline status</span>

    <!-- prepínač -->
    <span class="relative inline-block w-10 h-6">
      <!-- pozadie -->
      <span
        :class="[
          'absolute left-0 top-0 w-10 h-6 rounded-full transition-colors duration-300',
          isOffline ? 'bg-yellow-500' : 'bg-gray-300'
        ]"
      ></span>

      <!-- gulička -->
      <span
        :class="[
          'absolute left-0 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out',
          isOffline ? 'translate-x-5' : 'translate-x-0',
          'top-1/2 -translate-y-1/2'
        ]"
      ></span>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { useUserActivityStore } from '../../store/userActivity';
import { storeToRefs } from 'pinia';

const userActivityStore = useUserActivityStore();
const { manualStatus } = storeToRefs(userActivityStore);

const toggleStatus = () => {
  userActivityStore.toggleManualStatus();
};

const isOffline = computed(() => manualStatus.value);
</script>
