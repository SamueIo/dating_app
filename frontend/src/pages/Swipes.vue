<template>
  <div class="mx-auto max-w-[100%] p-0 ">
    <div v-if="loading" class="fixed inset-0 flex justify-center items-center z-50 bg-black/10">
      <Spinner />
    </div>

    <div v-else class="relative overflow-hidden">
      <div v-if="users.length === 0 " class="h-screen flex items-center justify-center">
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
        >
              
          <div
            ref="cardRef"
            :key="currentUser ? currentUser.id : 'empty'"
            :class="['swipe-card', swipeState === 'like' ? 'swipe-like' : '', swipeState === 'dislike' ? 'swipe-dislike' : '']"
            :style="{ maxWidth: '700px', maxHeight: `calc(100vh - ${bottomNavStore.height}px)` }"
          >
            <UserModalSwipe :userData="currentUser" :visible="true" />
            <!-- <UserModal :userId="currentUser.id" :visible="true" /> -->
          </div>
        
        <!-- Fixed buttons for swipes -->
        <div
          class="fixed bottom-20 left-1/2 transform -translate-x-1/2 gap-2 z-30 flex justify-around w-auto bg-white/20 rounded-full shadow-lg p-2 backdrop-blur-sm"
        >
          <button 
            @click="() => swipe('dislike')" 
            class="flex items-center space-x-2 bg-red-600 hover:bg-red-700 transition-colors text-white px-5 py-3 rounded-full shadow-md text-lg font-semibold select-none"
          >
            <span class="text-2xl">👎</span>
          </button>
        
          <button 
            @click="() => swipe('like')" 
            class="flex items-center space-x-2 bg-green-600 hover:bg-green-700 transition-colors text-white px-5 py-3 rounded-full shadow-md text-lg font-semibold select-none"
          >
          <span class="text-2xl">👍</span>
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
const noMoreUsers = ref(false);
const filterStore = useFilterStore();

const limit = 2;

const bottomNavStore = useBottomNavStore()


// Swipe animation 
const cardRef = ref(null);
const swipeState = ref('');
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
  if (!currentUser.value) return;

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
      console.error("Nepodarilo sa swipe", err);
    }
  }, 100 );
}




function nextUser() {
  if (users.value.length === 0) {
    // loadUsers();
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