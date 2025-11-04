<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-30 bg-white/10 backdrop-blur-md border-t border-white/20 text-sm text-white"
  >
    <div class="flex justify-around items-center h-14 sm:h-16">
      <RouterLink
        v-for="item in BottomNavLinks"
        :key="item.name"
        :to="{ name : item.name}"
        active-class="active-link"
        exact-active-class="active-link"
        class="flex flex-col items-center justify-center gap-0.5 hover:text-pink-300"
      >
      <component :is="item.icon" class="w-5 h-5" :class="{ 'active-icon' :$route.name === item.name}"/>
      <span class="text-xs">{{ item.name }}</span>

      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { routes } from '../../router'
import DefaultLayout from './DefaultLayout.vue'


const defaultLayoutRoute = routes.find(route => route.component === DefaultLayout)
  const BottomNavLinks = (defaultLayoutRoute?.children || [])
  .filter( route => route.meta?.showInBottomNav)
  .map(route => ({
  name: route.name,
  icon: route.meta.icon
}))


</script>

<style scoped>
.active-icon {
  color: #ef4444; /* červená */
  filter: drop-shadow(0 0 5px #fb923c); /* oranžový tieň */
  transition: color 0.3s ease;
}
</style>