// composables/useViewport.js
import { ref, onMounted, onBeforeUnmount } from 'vue';

/**
 * Tracks viewport height and width, updating on resize
 */
export function useViewport() {
  const viewportHeight = ref(window.visualViewport?.height || window.innerHeight);
  const windowWidth = ref(window.innerWidth);

  function updateViewportHeight() {
    viewportHeight.value = window.visualViewport?.height || window.innerHeight;
  }

  function handleResize() {
    windowWidth.value = window.innerWidth;
  }

  onMounted(() => {
    window.visualViewport?.addEventListener('resize', updateViewportHeight);
    window.addEventListener('resize', handleResize, { passive: true });
  });

  onBeforeUnmount(() => {
    window.visualViewport?.removeEventListener('resize', updateViewportHeight);
    window.removeEventListener('resize', handleResize);
  });

  return { viewportHeight, windowWidth };
}
