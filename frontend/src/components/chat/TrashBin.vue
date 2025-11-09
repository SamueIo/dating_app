<template>
  <div
    ref="trashRef"
    class="fixed bottom-20 left-1/2 -translate-x-1/2 h-20 w-20 flex justify-center items-center z-40"
  >
    <div
      :class="[
        'w-20 h-20 flex justify-center items-center text-5xl rounded-full shadow-2xl transition-all duration-300',
        bubbleInTrash
          ? 'text-white scale-110 backdrop-blur-md shadow-red-900/70'
          : 'bg-black/20 text-white'
      ]"
      style="backdrop-filter: blur(8px);"
    >
      🗑️
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  bubbleInTrash: Boolean
});

const trashRef = ref(null);
defineExpose({ trashRef });
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>