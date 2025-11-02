<template>
  <div class="flex p-2 items-center justify-center w-screen h-screen !overflow-auto  bg-purple-900">

    <CirclesDesign/>
    <div
      class="flex flex-col items-center justify-center p-2 sm:p-4 md:p-10 lg:p-14
        rounded-2xl border border-pink-400/30 bg-white/10 backdrop-blur-md shadow-2xl
        ring-1 ring-white/20 transition-all duration-500 hover:shadow-pink-500/30
        w-full max-w-md md:max-w-lg "  
    >
      <RouterView />
      <slot></slot>
    </div>
  </div>
</template>
<script setup>
import CirclesDesign from '@/ui/CirclesDesign.vue';
</script>