<template>
  <div class="mx-auto max-w-[100%] p-0 ">
    <div v-if="loading" class="fixed inset-0 flex justify-center items-center z-50 bg-black/10">
      <Spinner />
    </div>

    <div v-else class="relative overflow-hidden">
      <div v-if="users.length === 0 " class="flex items-center justify-center"
          :style="{height: `calc(100vh - ${bottomNavStore.height}px)` }"
          >
        <div 
          class="max-w-md p-8 rounded-xl bg-pink-400 shadow-lg text-center select-none"
          style="background: linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 50%, #f472b6 100%)"
        >
          <h1 class="text-4xl font-extrabold text-pink-800 mb-4 flex justify-center items-center space-x-3">
            <span>No more swipes</span> 
            <span class="text-5xl">😢</span>
          </h1>
          <p class="text-lg text-pink-700">
            Changing your filters might help you find more matches!
          </p>
        </div>
      </div>

      <div v-if="currentUser">
        <div
          class="relative top-0 shadow-[0_0_40px_rgba(0,0,0,0.6)] mx-auto mt-0"
          :style="{ maxWidth: '700px', backgroundColor: 'transparent', maxHeight: `calc(100vh - ${bottomNavStore.height}px)` }"
          @click.stop
          @touchstart.passive="onTouchStart"
          @touchmove.passive="onTouchMove"
          @touchend="onTouchEnd"
        >
              
          <div
            ref="cardRef"
            :key="currentUser ? currentUser.id : 'empty'"
            :class="['swipe-card', swipeState === 'like' ? 'swipe-like' : '', swipeState === 'dislike' ? 'swipe-dislike' : '']"
            :style="{ maxWidth: '700px', maxHeight: `calc(100vh - ${bottomNavStore.height}px)` }"
          >
            <UserModalSwipe :userData="currentUser" :visible="true" />
          </div>
        
        <!-- Fixed buttons for swipes -->
        <div
          class="fixed bottom-20 left-1/2 transform -translate-x-1/2  flex items-center justify-center gap-4 z-30"
        >
          <!-- Dislike -->
          <button
            @click="() => swipe('dislike')"
            class="w-16 h-16 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 active:scale-110 transition-transform duration-150 shadow-md hover:shadow-lg text-white text-2xl"
          >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6L18 18M6 18L18 6" />
          </svg>

          </button>
        
          <!-- Like (main) -->
          <button
            @click="() => swipe('like')"
            class="w-16 h-16 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 active:scale-110 transition-transform duration-150 shadow-xl hover:shadow-2xl text-white text-3xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
        </div>


      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import axiosClient from '../axios' 
import { useFilterStore } from '../store/filterStore'
import UserModalSwipe from '../components/modals/UserModalSwipe.vue'
import Spinner from '../ui/Spinner.vue'
import { useToast } from "vue-toastification";
import router from '../router'
import { useBottomNavStore } from '../store/showBottomNavStore'


const currentIndex = ref(0)
const offset = ref(0)
const loading = ref(true)
const users = ref([])
const isSwiping = ref(false)
const noMoreUsers = ref(false);
const filterStore = useFilterStore();

const limit = 2;

const bottomNavStore = useBottomNavStore()


// Swipe animation 
const cardRef = ref(null);
const swipeState = ref('');
let touchStartX = ref(0)
let touchEndX = ref(0)

const loadUsers = async () => {
  if (noMoreUsers.value) return;
  loading.value = true;
  try {
    const response = await axiosClient.get('/api/swipes', {
      params: filterStore.filters,
      offset: offset.value,
      excludeRated: true,
    });
    
    const newUsers = response.data.data ?? [];
    
    if (newUsers.length === 0) {
      noMoreUsers.value = true;
    }

    // Odstránime duplikáty na základe ID používateľov
    if (offset.value === 0) {
      users.value = newUsers;
    } else {
      // Pridáme iba používateľov, ktorí ešte nie sú v zozname
      users.value.push(...newUsers.filter(user => !users.value.some(existingUser => existingUser.id === user.id)));
    }

    offset.value += limit;

  } catch (err) {
    console.error('Failed to load users', err);
  } finally {
    loading.value = false;
  }
}


onMounted(async () => {
  try{
    if(filterStore.filtersLoaded){
      loadUsers()
    }else{
      await filterStore.fetchFilters();
      loadUsers()
    }
    
  }catch (err){
    console.error('Failed to fetch filters in onMounted:', err);
  }


  
})


// firstrun block first loading when filters are not loaded yet 

let firstRun = true;
watch(
  () => filterStore.filters,
  () => { 
    if(firstRun){
      firstRun= false 
      return
    } 
    offset.value = 0
    noMoreUsers.value = false
    users.value = []
    loadUsers(); 
  },
  { deep: true }
);


async function swipe(direction) {
  if (isSwiping.value || !currentUser.value) return;

  isSwiping.value = true;
  // spusti animáciu len pre odchádzajúcu kartu
  swipeState.value = direction;

  // počkaj 300ms kým sa animácia dokončí
  setTimeout(async () => {
    try {
      // pošleme swipe na server
      const response = await axiosClient.post('/api/swipes', {
        to_user_id: currentUser.value.id,
        direction: direction
      });
      // remove swiped user
      users.value.shift();
      

      if (response.data.match) {
        const toast = useToast();
        toast.success("🔥 Sparks flew! You have a mutual match!", {
          timeout: 5000,
          pauseOnHover: true,
          toastClassName: 'custom-toast',
          onClick: () => {
            router.push({ path: 'Matches', query: { highlightMatch: true } });
          }
        });
      }

      swipeState.value = '';


      nextUser()
    } catch (err) {
      console.error("Error in swipe", err);
    } finally{
      isSwiping.value = false
    }
  }, 100 );
}




function nextUser() {
  if (users.value.length === 0) {
    // loadUsers();
  }
}

// Handle touch start event
const onTouchStart = (event) => {
  touchStartX.value = event.touches[0].clientX
}

// Handle touch move event
const onTouchMove = (event) => {
  touchEndX.value = event.touches[0].clientX
}

// Handle touch end event
const onTouchEnd = () => {
  const swipeThreshold = 50
  const swipeDirection = touchEndX.value - touchStartX.value

  if (Math.abs(swipeDirection) > swipeThreshold) {
    if (swipeDirection > 0) {
      swipe('like')
    } else {
      swipe('dislike')
    }
  }
}


const currentUser = computed(() => users.value[0] || null);
// const currentUser = computed(() => users.value[currentIndex.value] || null)
</script>

<style scoped>
.swipe-card {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.swipe-like {
  transform: translateX(500px) rotate(15deg);
  opacity: 0;
}

.swipe-dislike {
  transform: translateX(-500px) rotate(-15deg);
  opacity: 0;
}
</style>