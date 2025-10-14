<template>
  <div class="mx-auto max-w-6xl p-4 .hide-scrollbar">
    <div v-if="loading" class="fixed inset-0 flex justify-center items-center">
      <Spinner />
    </div>
    
    <div v-else>
      <div
        class="grid gap-6 
               grid-cols-1 
               sm:grid-cols-2 
               md:grid-cols-3 
               lg:grid-cols-4"
      >
        <div
          v-for="user in users"
          :key="user.id"
          @click="openUser(user.id)"
          class="p-1 rounded-xl bg-white/20 backdrop-blur-sm shadow-md hover:shadow-xl hover:scale-101q  transform transition duration-300 cursor-pointer"
        >
       
        
          <img
            v-if="user.photos && user.photos.length"
            :src="`/storage/${user.photos.find(photo => photo.is_main == 1)?.file_name}`"
            alt="User photo"
            class="rounded-lg object-cover h-55 w-full mb-3 shadow-sm"
          />
          <p class="font-semibold text-xl text-white">{{ user.name }}</p>
          <p class="text-sm text-white/80">{{ calculateUserAge(user) ?? 'Age unknown' }}</p>
        </div>
      </div>

    </div>
    
    
<div 
  v-if="selectedUserId" 
  class="fixed rounded-lg inset-0 flex items-start justify-center z-50"
  @click="closeUser"
>
  <div 
    class="relative shadow-[0_0_40px_rgba(0,0,0,0.6)] p-2
           w-[95%] sm:w-[80%] md:w-[60%] max-w-[700px]
           max-h-[calc(100vh-60px)]"
    style="background-color: transparent;"
    @click.stop
  >

    <UserModal 
      :userId="selectedUserId"
      :visible="true"
      @close="closeUser"
    >
      <template #actions>
        <button 
          @click="closeUser" 
          class="absolute top-4 right-4 text-3xl font-bold text-white hover:text-gray-300 
                 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center z-100 shadow-lg"
          aria-label="Close modal"
        >
          &times;
        </button>
      </template>
    </UserModal>
  </div>
</div>




</div>



</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axiosClient from '../axios' 
import { useFilterStore } from '../store/filterStore'
import { calculateAge } from '../utils/age'
import UserModal from '../components/modals/UserModal.vue'
import Spinner from '../ui/Spinner.vue'
import { useUserActivityStore } from '../store/userActivity'

const userActivityStore = useUserActivityStore()
const users = ref([])
const loading = ref(true)
const page = ref(1)

const selectedUserId = ref(null);
const filterStore = useFilterStore();


const loadUsers = async () => {
  loading.value = true
  try{
    const response = await axiosClient.get('/api/explore', {
      params: filterStore.filters
    })
    users.value = response.data.data ?? []
  }catch (err){
    console.error('Failed to load users', err);
  }finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUsers()
  userActivityStore.updateUserActivity(true)
})

watch(
  () => filterStore.filters,
  () => loadUsers(),
  {deep: true}
)

function calculateUserAge (user){
  if(!user.profile?.birth_date) return null
  return calculateAge(user.profile.birth_date)
}


const openUser = (id) => {
  selectedUserId.value = id;
};

const closeUser = () => {
  selectedUserId.value = null;
};
</script>

