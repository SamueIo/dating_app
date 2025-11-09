<template>
  <!-- 
    Sidebar layout component.
    Displays different sidebar content depending on the current route.
    On /profile routes → shows Profile Settings menu.
    On /explore or /swipes routes → shows Filter component.
  -->
  <aside
    :class="{
      // Mobile layout: full width, shorter height (based on viewport height)
      'w-full p-1 bg-black/10 text-white border-r border-white/10 mt-2 overflow-y-auto h-[calc(var(--vh,1vh)*90)]': isMobile,

      // Desktop layout: fixed width (1/5), full height, scrollable
      'w-1/5 p-2 bg-black/10 text-white border-r border-white/10 max-h-screen z-10 overflow-y-auto': !isMobile
    }"
    :style="!isMobile ? { height: `calc(100vh - ${bottomNavStore.height}px)` } : ''"
  >
    <div>
      <!-- Profile Section -->
      <div v-if="route.path.startsWith('/profile')" class="w-full max-w-sm mx-auto flex flex-col gap-1">
        <!-- Toggle button for nested profile menu -->
        <button
          @click="showProfileMenu = !showProfileMenu"
          class="w-full flex items-center justify-between px-4 py-3 bg-black/30 text-white/70 font-semibold rounded-lg shadow hover:bg-black/40 transition"
        >
          Profile settings
          <span class="text-lg">{{ showProfileMenu ? '▼' : '▶' }}</span>
        </button>

        <!-- Collapsible Profile Menu -->
        <div
          v-if="showProfileMenu"
          class="bg-black/20 text-white rounded-lg shadow-inner py-2 px-2 space-y-1"
        >
          <router-link
            to="/profile/userProfile"
            class="block w-full px-4 py-2 rounded-md bg-black/10 hover:bg-pink-200 text-white/70 hover:text-black transition"
          >
            Your profile
          </router-link>

          <router-link
            to="/profile/photoUpload"
            class="block w-full px-4 py-2 rounded-md bg-black/10 hover:bg-pink-200 text-white/70 hover:text-black transition"
          >
            Your photos
          </router-link>

          <router-link
            to="/profile/publicProfileSettings"
            class="block w-full px-4 py-2 rounded-md bg-black/10 hover:bg-pink-200 text-white/70 hover:text-black transition"
          >
            Profile settings
          </router-link>
        </div>

        <!-- Blocked Users link -->
        <router-link
          to="/profile/blockedUsers"
          class="w-full flex items-center justify-between px-4 py-3 bg-black/30 text-white/70 font-semibold rounded-lg shadow hover:bg-black/40 transition"
        >
          <span>Blocked users</span>
          <span class="text-xl">🚫</span>
        </router-link>
      </div>

      <!-- Explore or Swipes Section -->
      <div v-else-if="route.path.startsWith('/explore') || route.path.startsWith('/swipes')">
        <Filter />
      </div>
    </div>
  </aside>
</template>

<script setup>
/**
 * LeftSidebar.vue
 * ----------------
 * A responsive sidebar component that changes content based on the current route.
 *
 * FEATURES:
 * - On mobile: takes full width and adjusts height dynamically using --vh.
 * - On desktop: fixed 1/5 width, full height minus bottom navigation height.
 * - Displays a collapsible menu for profile-related routes.
 * - Displays a Filter component for explore/swipes routes.
 *
 * PROPS:
 * - isMobile (Boolean): Indicates whether the layout is rendered for mobile view.
 *
 * DEPENDENCIES:
 * - vue-router: for route-based conditional rendering.
 * - useBottomNavStore(): provides the height of bottom navigation to adjust sidebar height.
 */

import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Filter from '../../Filter/Filter.vue'
import { useBottomNavStore } from '@/store/showBottomNavStore'

// --- Props ---
const props = defineProps({
  isMobile: { type: Boolean, default: false }
})

// --- Stores & Route ---
const bottomNavStore = useBottomNavStore()
const route = useRoute()

// --- Local state ---
const showProfileMenu = ref(false)
</script>

<style>
/**
 * Sidebar slide transition (optional use in parent with <Transition name="slide">)
 * Defines smooth slide-in and slide-out animations.
 */
.slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-enter-active {
  transition: all 0.3s ease;
}

.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-leave-active {
  transition: all 0.3s ease;
}
</style>
