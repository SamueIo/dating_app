<template>
    <aside
      :class="{
        'w-full p-2 bg-black/10 text-white border-r border-white/10  overflow-y-auto' : isMobile,
        'w-1/5 p-2 bg-black/10 text-white border-r border-white/10 max-h-screen  overflow-y-auto': !isMobile
      }"
    >
        <div v-if="route.path.startsWith('/profile')" class="w-full max-w-sm mx-auto mt-4 flex flex-col gap-1">
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
import { ref } from 'vue';
const showProfileMenu = ref(false)

const props = defineProps({
    isMobile: {type: Boolean, default: false}
})

const route = useRoute();
</script>