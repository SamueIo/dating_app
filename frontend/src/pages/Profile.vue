<template>
<div class="p-1 sm:p-4 mb-6 bg-gray-900 rounded-xl text-white max-w-2xl mx-auto shadow-lg space-y-6 overflow-y-auto hide-scrollbar"
:style="{ maxHeight: `calc(100vh - ${bottomNavStore.height}px)` }">
  <router-view></router-view>
</div>
</template>

<script setup>
import { useBottomNavStore } from '../store/showBottomNavStore';
const bottomNavStore = useBottomNavStore()
</script>
