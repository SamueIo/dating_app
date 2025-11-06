<template>
  <div class="mx-auto h-screen max-w-6xl p-4 hide-scrollbar">
    <div v-if="loading" class="fixed inset-0 flex justify-center items-center">
      <Spinner />
    </div>

    <div
      v-else-if="noContentLoaded"
      class="flex items-center justify-center h-40 bg-gray-700 bg-opacity-60 rounded-lg"
    >
      <p class="text-white text-lg font-medium select-none">
        No blocked users found.
      </p>
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
          v-for="user in blockedUsers"
          :key="user.id"
          @click="openUser(user.id)"
          class="p-1 rounded-xl bg-white/20 backdrop-blur-sm shadow-md hover:shadow-xl hover:scale-101q transform transition duration-300 cursor-pointer"
        >
            <img
              v-if="user.main_photo"
              :src="`${API_BASE_URL}/storage/${user.main_photo.file_name}`"
              alt="User photo"
              class="rounded-lg object-cover h-55 w-full mb-3 shadow-sm"
            />

          <p class="font-semibold text-xl text-white">{{ user.name }}</p>
          <button @click.stop="unblockUser(user.id)"
            class="p-2 bg-indigo-950 cursor-pointer w-full">Unblock</button>
        </div>

      </div>
    </div>
    
    <div 
      v-if="selectedUserId" 
      class="fixed rounded-lg inset-0 flex items-start justify-center z-50"
      @click="closeUser"
    >
      <div 
        class="relative  p-2
               w-[95%] sm:w-[80%] md:w-[60%] max-w-[700px]
               max-h-[calc(100vh-60px)]"
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
              class="absolute top-4 right-4 text-3xl font-bold text-black hover:text-gray-600 
                     bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center z-100 shadow-lg"
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
import { ref, onMounted } from 'vue'
import axiosClient from '../../axios'
import Spinner from '../../ui/Spinner.vue'
import UserModal from '../modals/UserModal.vue'
import { useConversationStore } from '../../store/conversationsAndLastMessage'
import { API_BASE_URL } from '@/utils/constants';



const conversationStore = useConversationStore()
const blockedUsers = ref([])
const loading = ref(true)
const selectedUserId = ref(null)
const noContentLoaded = ref(false)

/**
 * Fetches the list of blocked users from the API and updates the reactive state.
 *
 * @param {boolean} [noLoad=false] - If true, disables the loading indicator during the fetch.
 * @returns {Promise<void>}
 */
const loadBlockedUsers = async (noLoad = false) => {
  if (!noLoad) loading.value = true;
  try {
    const response = await axiosClient.get('/api/blockedUsers');
    blockedUsers.value = response.data;
    
    noContentLoaded.value = response.data.length === 0;
    
  } catch (err) {
    console.error('Failed to load blocked users', err);
  } finally {
    loading.value = false;
  }
};




/**
 * Sends a request to unblock a user by their ID, then refreshes the conversation list.
 *
 * This function calls the API endpoint to unblock the user with the given ID.
 * If successful, it forces the conversation store to reload conversations,
 * ensuring the updated list reflects the unblocked user.
 * Finally, it refreshes the list of blocked users.
 *
 * @param {number|string} id - The ID of the user to unblock.
 * @returns {Promise<void>}
 */
const unblockUser = async (id) => {
  try {
    const response = await axiosClient.post(`/api/unblockUser/${id}`);

    // Reload conversations to reflect changes after unblocking
    if (response) {
      const allowReload = true;
      await conversationStore.fetchConversations(allowReload);
    }

  } catch (err) {
    console.error('Failed to unblock user', err);
  } finally {
    loadBlockedUsers(true);
  }
};


onMounted(() => {
  loadBlockedUsers()
})


const openUser = (id) => {
  selectedUserId.value = id
}

const closeUser = () => {
  selectedUserId.value = null
}
</script>
