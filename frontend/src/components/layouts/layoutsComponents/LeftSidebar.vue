<template>
    <aside
      :class="{
        'w-full p-1 bg-black/10 text-white border-r border-white/10 mt-2  overflow-y-auto h-[calc(var(--vh,1vh)*90)]' : isMobile,
        'w-1/5 p-2 bg-black/10 text-white border-r border-white/10 max-h-screen z-10 overflow-y-auto': !isMobile
      }"
      :style="!isMobile ? { height: `calc(100vh - ${bottomNavStore.height}px)` } : ''"
    >
        <div v-if="route.path.startsWith('/profile')" class="w-full max-w-sm mx-auto  flex flex-col gap-1">
            <!-- Tlačidlo na otvorenie submenu -->
            <div>
                 <button
                   @click="showProfileMenu = !showProfileMenu"
                   class="w-full flex items-center justify-between px-4 py-3 bg-black/30 text-white/70 font-semibold rounded-lg shadow hover:bg-black/40 transition"
                 >
                   Profile settings
                   <span class="text-lg">{{ showProfileMenu ? '▼' : '▶' }}</span>
                 </button>
             
                 <!-- Podmenu -->
                <div
                  v-if="showProfileMenu"
                  class="bg-black/20 text-white rounded-lg shadow-inner py-2 px-2 space-y-1 "
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

            </div>
            <div>
              <router-link
                to="/profile/blockedUsers"
                class="w-full flex items-center justify-between px-4 py-3 bg-black/30 text-white/70 font-semibold rounded-lg shadow hover:bg-black/40 transition"
              >
                <span>Blocked users</span>
                <span class="text-xl">🚫</span>
              </router-link>


            </div>
        </div>
        <div v-else-if="route.path.startsWith('/explore') || route.path.startsWith('/swipes')">
            <Filter />
        </div>

        
    </aside>
</template>  

<script setup>
import { useRoute } from 'vue-router';
import Filter from '../../Filter/Filter.vue';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useBottomNavStore } from '@/store/showBottomNavStore';

const bottomNavStore = useBottomNavStore()

const showProfileMenu = ref(false)

const props = defineProps({
    isMobile: {type: Boolean, default: false}
})

const isMobile = ref(props.isMobile);

function handleResize() {
  console.log('Resizing...');
  isMobile.value = window.innerWidth < 768;
}

onMounted(() => {
  if (isMobile.value) {
    window.addEventListener('resize', handleResize);
  }
});

watch(isMobile, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    window.addEventListener('resize', handleResize);
  } else if (!newVal && oldVal) {
    window.removeEventListener('resize', handleResize);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
const route = useRoute();
</script>