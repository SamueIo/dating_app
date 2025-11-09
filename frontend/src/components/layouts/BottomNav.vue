<template>
  <!-- Fixed bottom navigation bar -->
  <nav
    class="fixed bottom-0 left-0 right-0 z-30 bg-white/10 backdrop-blur-md border-t border-white/20 text-sm text-white"
  >
    <div class="flex justify-around items-center h-14 sm:h-16">
      
      <!-- Navigation links generated from router -->
      <RouterLink
        v-for="item in BottomNavLinks"
        :key="item.name"
        :to="{ name: item.name }"
        active-class="active-link"
        exact-active-class="active-link"
        class="flex flex-col items-center justify-center gap-0.5 hover:text-pink-300"
      >
        <!-- Dynamic icon component -->
        <component
          :is="item.icon"
          class="w-5 h-5"
          :class="{ 'active-icon': $route.name === item.name }"
        />
        <!-- Link label -->
        <span class="text-xs">{{ item.name }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
// Import router configuration and layout
import { routes } from '../../router';
import DefaultLayout from './DefaultLayout.vue';

/**
 * Get the route configuration for the default layout
 * (usually contains the child routes that should appear in bottom nav)
 */
const defaultLayoutRoute = routes.find(route => route.component === DefaultLayout);

/**
 * Generate navigation links for bottom nav:
 * - Filter children routes that have `meta.showInBottomNav` set to true
 * - Map to an object containing name and icon
 */
const BottomNavLinks = (defaultLayoutRoute?.children || [])
  .filter(route => route.meta?.showInBottomNav)
  .map(route => ({
    name: route.name,         // Route name used for link and label
    icon: route.meta.icon     // Icon component defined in route meta
  }));
</script>

<style scoped>
/* Active icon styling */
.active-icon {
  color: #ef4444; /* Red color for active icon */
  filter: drop-shadow(0 0 5px #fb923c); /* Orange glow */
  transition: color 0.3s ease;
}
</style>
