<template>
  <div class="mx-auto max-w-6xl p-0">
    <div v-if="loading" class="fixed inset-0 flex justify-center items-center z-50 bg-black/10">
      <Spinner />
    </div>

    <div v-else class="relative">
<div class="h-screen flex items-center justify-center">
  <div 
    v-if="users.length === 0" 
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
      class="relative top-0 py-1 shadow-[0_0_40px_rgba(0,0,0,0.6)]  mx-auto mt-0"
      style="max-width: 700px; background-color: transparent; max-height: calc(100vh - 60px);"
      @click.stop
      >
      <UserModal :userId="currentUser.id" :visible="true" />
      
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
import Filter from '../components/Filter/Filter.vue'
import { useFilterStore } from '../store/filterStore'
import { calculateAge } from '../utils/age'
import UserModal from '../components/modals/UserModal.vue'
import Spinner from '../ui/Spinner.vue'

const currentIndex = ref(0)
const offset = ref(0)
const loading = ref(true)
const users = ref([])
const noMoreUsers = ref(false);
const filterStore = useFilterStore();

const limit = 2;



const loadUsers = async () => {
  if (noMoreUsers.value) return;
  loading.value = true
  try{

    const response = await axiosClient.get('/api/swipes', {
      params: filterStore.filters,
      offset: offset,
    excludeRated: true,
    })

    const newUsers = response.data.data ?? []
    
    if(newUsers.length ===0){
      noMoreUsers.value = true;
    }
    if(offset.value ===0){
      users.value = newUsers;
    } else {
      users.value.push(...newUsers);
    }
    offset.value += limit;
  }catch (err){
    console.error('Failed to load users', err);
  }finally {
    loading.value = false
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


function calculateUserAge (user){
  if(!user.profile?.birth_date) return null
  return calculateAge(user.profile.birth_date)
}


async function swipe(direction) {
  if(!currentUser.value) return;

  try{
    const response =  await axiosClient.post('/api/swipes', {
      to_user_id: currentUser.value.id,
      direction: direction
    });
    if(response.data.match){
      alert('match');
    }

    // Delete user locally from list cuz of duplicite swiping option
    users.value = users.value.filter(user => user.id !== currentUser.value.id);

    nextUser();
  }catch (err){
    console.error('Failed to swipe user', err);
  }
}


function nextUser()
{
  if(currentIndex.value < users.value.length - 1){
    currentIndex.value ++
  }else{
    console.log('No more users')
    loadUsers();
  }
}



const currentUser = computed(() => users.value[currentIndex.value] || null)
</script>

