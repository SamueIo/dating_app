import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBottomNavStore = defineStore('ui', () => {
  const showBottomNav = ref(true);

  function hideBottomNav() { showBottomNav.value = false }
  function showBottomNavFn() { showBottomNav.value = true }

  return { showBottomNav, hideBottomNav, showBottomNavFn };
});
