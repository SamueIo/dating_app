<template>
  <div class="relative flex overflow-hidden" :style="themeStyles">
    <!-- Background pattern -->
    <CirclesDesign />

    <!-- Mobile hamburger menu -->
    <MobileMenu
    v-if="showSidebar"
      :navName="navNameValue"
      :showDropdownButton="showDropdownButton"
      @open-sidebar="openSidebar"
    />

    <!-- Left Sidebar (Desktop) -->
    <LeftSidebar
      v-if="isMdUp"
      :isMobile="false"
      class="hide-scrollbar"
    />

    <!-- Left Sidebar (Mobile) -->
    <Transition name="slide">
      <div v-if="isLeftSidebarOpen  && !isMdUp " class="fixed inset-0 z-40">
        <!-- Backdrop -->
        <div @click="closeLeftSidebar" class="fixed inset-0 bg-black/50"></div>

        <!-- Sidebar panel -->
        <div
          class="relative max-w-[280px]
                 bg-gradient-to-b from-fuchsia-700 via-purple-800 to-indigo-900
                 p-5 shadow-[0_0_25px_rgba(0,0,0,0.4)]
                 rounded-r-2xl z-50 h-full flex flex-col
                 text-white border-r border-fuchsia-400/30"
        >
          <button
            @click="closeLeftSidebar"
            class="absolute w-7 h-7 top-1 right-1 text-white hover:text-red-500 transition-colors duration-300
                   bg-black/40 rounded-full p-1 shadow-lg focus:outline-none"
          >
            X
          </button>

          <LeftSidebar
            class="flex-grow overflow-y-auto hide-scrollbar"
            :isMobile="!isMdUp"
          />
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <main
      class="flex-1 min-h-0 overflow-y-auto border-l border-r border-l-[#953ea0] border-r-[#953ea0]
              shadow-2xl ring-1 ring-white/20 shadow-pink-500/30"
      :class="bottomNavStore.showBottomNav ? 'pb-4' : ''"
    >
      <RouterView />
    </main>

    <!-- Right Sidebar (Desktop only) -->
    <RightSidebar
      v-if="isMdUp"
      @select="openConversation"
    />

    <!-- Floating Chat Heads (Mobile only) -->
    <FloatingChatHeads
      v-else
      @select="openConversation"
      @close="closeBubble"
      @drag-start="dragStart"
      @drag-end="dragEnd"
      :isChatOpen="isChatOpen"
    />

    <!-- Mini Portable Chat -->
    <div class="fixed bottom-16 max-h-[500px] right-20 z-50">
      <MiniPortableChat
        v-if="isChatOpen && tempCloseChat"
        :conversationData="selectedConversation"
        @close="closeConversation"
      />
    </div>

    <!-- Bottom Navigation -->
    <div
      v-if="!(isChatOpen && !isMdUp) && bottomNavStore.showBottomNav"
      ref="bottomNavRef"
      class="max-h-[50px] sm:max-h-[60px] md:max-h-[70px] lg:max-h-[80px]"
    >
      <BottomNav />
    </div>
  </div>
</template>

<script setup>
/**
 * DefaultLayout.vue
 * -----------------
 * Main structural layout for the application.
 * 
 * RESPONSIBILITIES:
 * - Manages responsive layout (sidebar, right panel, chat, and bottom navigation)
 * - Handles window resize logic and theme adaptation
 * - Coordinates mobile/desktop differences in sidebar visibility
 * - Integrates the chat manager composable and conversation listeners
 * 
 * COMPONENT STRUCTURE:
 *  [Left Sidebar]  |  [Main Content + Chat Heads]  |  [Right Sidebar]
 * 
 * FEATURES:
 * - Responsive left sidebar (fixed on desktop, slide-in on mobile)
 * - Right sidebar visible only on md+ screens
 * - Floating chat heads on mobile
 * - Mini chat popup for active conversations
 * - Themed background using theme store
 * 
 * LIFECYCLE:
 * - Listens to window resize
 * - Initializes user and chat socket listeners
 * - Fetches conversations and starts heartbeat
 */

import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

// --- Layout Components ---
import CirclesDesign from '@/ui/CirclesDesign.vue'
import MobileMenu from '../mobileMenu/MobileMenu.vue'
import LeftSidebar from './layoutsComponents/LeftSidebar.vue'
import RightSidebar from './layoutsComponents/RightSidebar.vue'
import BottomNav from './BottomNav.vue'

// --- Chat Components ---
import FloatingChatHeads from '../chat/FloatingChatHeads.vue'
import MiniPortableChat from '../chat/MiniPortableChat.vue'

// --- Stores ---
import { useThemeStore } from '@/store/themeStore'
import { useBottomNavStore } from '@/store/showBottomNavStore'
import { useUserActivityStore } from '@/store/userActivity'
import { useConversationStore } from '@/store/conversationsAndLastMessage'
import { useMatchesStore } from '@/store/matches'
import { useToggleMobileMenuStore } from '@/store/ToggleMobileMenuStore'
import useUserStore from '@/store/user'

// --- Composables ---
import { useChatManagerMiniPortableChat } from '@/composable/useChatManagerMiniPortableChat'
import { useChatListener } from '@/composable/useChatListener'

// --- STORES ---
const route = useRoute()
const themeStore = useThemeStore()
const activityStore = useUserActivityStore()
const userStore = useUserStore()
const bottomNavStore = useBottomNavStore()
const conversationStore = useConversationStore()
const matchesStore = useMatchesStore()
const toggleMobileMenuStore = useToggleMobileMenuStore()

// --- STATE ---
const isMdUp = ref(window.innerWidth >= 768)
const isLeftSidebarOpen = ref(false)
const showDropdownButton = ref(true)
const loading = ref(false)

// --- COMPUTED VALUES ---
const userId = computed(() => userStore.user?.id)
const navNameValue = computed(() =>
  route.path.startsWith('/explore') || route.path.startsWith('/swipes')
    ? '🔍 Filter'
    : '⚙️ Profile navigation'
)
const showSidebar = computed(() => {
  const hiddenRoutes = ['/matches', '/messages']
  return !hiddenRoutes.some(path => route.path.startsWith(path))
})

const themeStyles = computed(() => ({
  backgroundColor: themeStore.themes[themeStore.currentTheme].bg,
  color: themeStore.themes[themeStore.currentTheme].text,
  height: isMdUp.value ? '100vh' : 'calc(var(--vh, 1vh) * 100)',
  transition: 'background-color 0.3s, color 0.3s'
}))

// --- CHAT MANAGER ---
const {
  isChatOpen,
  tempCloseChat,
  selectedConversation,
  openConversation,
  closeConversation,
  closeBubble,
  dragStart,
  dragEnd
} = useChatManagerMiniPortableChat()

// --- METHODS ---

/** Opens mobile sidebar */
function openSidebar() {
  isLeftSidebarOpen.value = true
  toggleMobileMenuStore.toggleMobileMenu()
  showDropdownButton.value = false
}

/** Closes mobile sidebar */
function closeLeftSidebar() {
  isLeftSidebarOpen.value = false
  showDropdownButton.value = true
}

/** Handles viewport resize and viewport height fix */
function handleResize() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
  isMdUp.value = window.innerWidth >= 768
}

// --- WATCHERS ---

/** React to user ID changes (attach/detach socket channels) */
watch(userId, (id, oldId) => {
  if (oldId) window.Echo.leave(`user.${oldId}`)
  if (id) {
    const { register } = useChatListener(id)
    register()
  }
})

// --- LIFECYCLE HOOKS ---

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize, { passive: true })
})

onMounted(async () => {
  loading.value = true
  activityStore.startHeartbeat()
  await conversationStore.fetchConversations()

  if (userId.value) {
    const { register } = useChatListener(userId.value)
    matchesStore.listenFroNewMatches(userId.value)
    register()
  }

  loading.value = false
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
