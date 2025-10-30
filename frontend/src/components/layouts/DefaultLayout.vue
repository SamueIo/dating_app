<template>
  <div class="relative flex  overflow-hidden "
    :style="{ height: isMobile ? 'calc(var(--vh, 1vh) * 100)' : '100vh' }"
  >
    <!-- Hamburger button visible only on small screens -->
    <div v-if="showSidebar">

      <!-- Hlavné tlačidlo s dropdown menu (mobil only) -->
      <div class="md:hidden fixed top-2 left-2 z-50">
        <div class="relative">
          <!-- Toggle button -->
          <button v-if="showDropdownButton" @click="toggleMobileMenu"
                  class="p-2 bg-white/60 shadow-md rounded-md"
                  aria-label="Otvoriť menu">
            ☰
          </button>
        
          <!-- Dropdown menu -->
          <div v-if="isMobileMenuOpen"
               class="absolute left-0 mt-2 w-40 bg-white/70 shadow-lg rounded-md  z-50">
            <ul class="flex flex-col">
              <li>
                <button @click="openSidebar"
                        class="w-full text-left px-4 py-2 hover:bg-gray-100">
                  📂 Menu
                </button>
              </li>
                <button @click="openUserMenu">
                </button>
              <li v-if="openUserMenu">
                <UserAvatarMenu :openFromList="true"/>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
     <!-- Left sidebar desktop -->
    <LeftSidebar class="hidden md:block"/>

    <!-- left sidebar mobile -->
    <Transition name="slide">
      <div v-if="isLeftSidebarOpen" class="fixed inset-0 z-40 md:hidden">
        <!-- Backdrop -->
        <div @click="closeLeftSidebar" class="fixed inset-0 bg-black/50"></div>

         <!-- Sidebar content -->
        <div class="relative max-w-[280px] bg-fuchsia-500 p-5 shadow-lg rounded-r-xl z-50 h-full flex flex-col">
          <button 
            @click="closeLeftSidebar" 
            class="absolute top-2 right-0 text-gray-500 hover:text-red-500 transition-colors duration-300 focus:outline-none"
            aria-label="Close menu"
          >
            <!-- jednoduchá SVG ikona krížika -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
            <div v-if="showSidebar ">
            <LeftSidebar :isMobile="true" class="flex-grow overflow-y-auto .hide-scrollbar" />
          </div>
        </div>
      </div>
    </Transition>
                      
    <div v-if="isLeftSidebarOpen"
    class="ml-auto">
      <UserAvatarMenu/>
    </div>


    <!-- Middle pannel -->
    <main 
      class="flex-1 min-h-0 overflow-y-auto "
      :class="bottomNavStore.showBottomNav ? 'pb-4' : ''"
    >
        <RouterView></RouterView>
    </main>

    <!-- Right pannel -->


    <RightSidebar v-if="isMdUp" @select="handleStartConversation" />
    

    <!-- Mobilné chatové hlavičky -->
    <FloatingChatHeads v-else @select="handleStartConversation" 
                              @close="closeChatBubble"
                              @drag-start="handleDragStart"
                              @drag-end="handleDragEnd"
                              :isChatOpen="isChatOpen"  />

    <div class="fixed bottom-16 max-h-[500px] right-20 z-50">
      <MiniPortableChat v-if="isChatOpen && tempCloseChat" :conversationData="selectedConversation" @close="handleCloseChat" />
    </div>


    <!-- Bottom navigation -->
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
 * Layout component that manages the main application structure.
 * 
 * Features:
 * - Responsive left sidebar (hamburger menu on mobile, always visible on desktop)
 * - Right sidebar visible on medium+ screen sizes
 * - Floating chat heads on smaller screens
 * - Mini portable chat window that opens when a chat is active
 * - Bottom navigation bar fixed to the bottom of the screen
 * 
 * Reactive states:
 * - isLeftSidebarOpen: boolean controlling visibility of mobile sidebar
 * - isMdUp: boolean flag for screen size (>= 768px)
 * - isChatOpen: boolean flag for mini chat visibility
 * 
 * Key methods:
 * - toggleLeftSidebar(): toggles mobile sidebar visibility
 * - closeLeftSidebar(): closes mobile sidebar
 * - handleStartConversation(conversation): opens chat with selected conversation
 * - closeChatBubble(conversationID): closes chat bubble by ID
 * - handleCloseChat(): closes active chat and clears state
 * 
 * Lifecycle:
 * - Registers and unregisters window resize event listener
 * - Watches userId for socket channel subscriptions
 * - Fetches conversations on mount
 */

import LeftSidebar from './layoutsComponents/LeftSidebar.vue';
import RightSidebar from './layoutsComponents/RightSidebar.vue';
import BottomNav from './BottomNav.vue';
import FloatingChatHeads from '../chat/FloatingChatHeads.vue';
import UserAvatarMenu from '../profile/ProfileComponents/UserAvatarMenu.vue';

import { useBottomNavStore } from '@/store/showBottomNavStore';
import { ref, computed, onMounted, watch, onUnmounted  } from 'vue';
import useUserStore from './../../store/user';
import { useChatListener } from '../../composable/useChatListener';
import { useConversationStore } from '../../store/conversationsAndLastMessage';
import MiniPortableChat from '../chat/MiniPortableChat.vue';
import { useChatUIStore } from '@/store/chatUIStore';
import { useMatchesStore } from '@/store/matches';

import { useActiveConversationStore } from '../../store/useActiveConversationStore';
import { useRoute } from 'vue-router';

const route = useRoute();

const userStore = useUserStore();
const bottomNavStore = useBottomNavStore()
const conversationStore = useConversationStore();
const matchesStore = useMatchesStore();
const isChatOpen = ref(false)
const showDropdownButton = ref(true)

const userId = computed(() => userStore.user?.id);
const loading = ref(false);
const tempCloseChat = ref(true)
const chatUIStore = useChatUIStore();
// const isChatOpen = computed(() => chatUIStore.isChatOpen);


const isMobileMenuOpen = ref(false);
const isUserMenuOpen = ref(false);

const isMobile = ref(window.matchMedia('(max-width: 768px)').matches)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;

}

function openSidebar() {
  isLeftSidebarOpen.value = true;
  isMobileMenuOpen.value = false;
  showDropdownButton.value = false
}


function openUserMenu() {
  isUserMenuOpen.value = true;
  isMobileMenuOpen.value = false;
}

// Register if id exists
watch(userId, (id, oldId) => {
  if (oldId) {
    window.Echo.leave(`user.${oldId}`);
  }
  if (id) {
    const { register } = useChatListener(id);
    register();
  }
});


const activeConversationStore = useActiveConversationStore();
const selectedConversation = ref(null)

function closeChatBubble(conversationID) {
  activeConversationStore.clearActiveConversation();
  chatUIStore.closeChat(conversationID);
  chatUIStore.isChatOpen = false; 
  isChatOpen.value = false  
}

function handleCloseChat() {
  activeConversationStore.clearActiveConversation();
  chatUIStore.isChatOpen = false; 
  isChatOpen.value = false
}

function handleStartConversation(conversation){
  activeConversationStore.setActiveConversation(conversation.id) 
  selectedConversation.value = conversation;
  isChatOpen.value = true;
  
  chatUIStore.openChat(conversation.id);
  conversationStore.markConversationAsSeen(conversation.id);
}

function handleDragStart(conversationID){
  tempCloseChat.value = false
  
}
function handleDragEnd(){
  tempCloseChat.value = true
}


const isLeftSidebarOpen = ref(false) 
function toggleLeftSidebar(){
  isLeftSidebarOpen.value = !isLeftSidebarOpen.value
}
function closeLeftSidebar() {
  isLeftSidebarOpen.value = false;
  showDropdownButton.value = true

}

const isMdUp = ref(window.innerWidth >= 768);

function onResize() {
  isMdUp.value = window.innerWidth >= 768;
}

const showSidebar = computed(() => {
  // cesty, kde nechceš sidebar
  const hideOn = ['/matches', '/messages'];
  
  // ak niektorá z ciest začína aktuálnu cestu -> skryť sidebar
  return !hideOn.some(path => route.path.startsWith(path));
});




onUnmounted(() => {
  window.removeEventListener('resize', onResize);
});
// Fetch conversations
onMounted(async () => {
  
  isMobile.value = window.matchMedia('(max-width: 768px)').matches
  loading.value = true;
  window.addEventListener('resize', onResize, { passive: true });
  await conversationStore.fetchConversations();
  
  if (userId.value) {
    const { register } = useChatListener(userId.value);
    matchesStore.listenFroNewMatches(userId.value);
    register();
  }
  
  loading.value = false;
});
</script>


