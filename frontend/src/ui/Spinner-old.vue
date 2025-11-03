<template>
  <div class="relative w-10 h-10">
    <!-- Big spinner -->
    <div class="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    <!-- Small spinner -->
    <div class="absolute inset-2 border-2 border-pink-500 border-b-transparent rounded-full animate-spin-reverse"></div>
  </div>
</template>

<style scoped>
@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.animate-spin-reverse {
  animation: spin-reverse 3s linear infinite;
}
</style>