import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBottomNavStore = defineStore('ui', () => {
  const showBottomNav = ref(true);
  const height = ref(window.innerWidth >= 640 ? 64 : 56);

  function hideBottomNav() { showBottomNav.value = false }
  function showBottomNavFn() { showBottomNav.value = true }

  return { showBottomNav, height, hideBottomNav, showBottomNavFn };
});
