<template>
  <!-- Scrollable container for user grid -->
  <div 
    ref="scrollContainer"
    class="mx-auto max-w-5xl p-4 hide-scrollbar"
    :style="{ 
      maxHeight: `calc(100vh - ${bottomNavStore.height}px)`,
      overflowY: 'auto',
      paddingBottom: `${bottomNavStore.height}px`
    }"
  >
    <!-- Spinner overlay while loading initial users -->
    <div v-if="loading" class="fixed inset-0 flex justify-center items-center">
      <Spinner />
    </div>
    <div v-else-if="users.length === 0 " class="flex items-center justify-center"
          :style="{height: `calc(100vh - ${bottomNavStore.height}px)` }"
          >
        <div 
          class="max-w-md p-8 rounded-xl bg-pink-400 shadow-lg text-center select-none"
          style="background: linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 50%, #f472b6 100%)"
        >
          <h1 class="text-4xl font-extrabold text-pink-800 mb-4 flex justify-center items-center space-x-3">
            <span>No-one in this area</span> 
            <span class="text-5xl">😢</span>
          </h1>
          <p class="text-lg text-pink-700">
            Changing your filters might help you find more people!
          </p>
        </div>
      </div>
    <!-- User grid -->
    <div v-else>
      <div class="grid gap-3 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 hide-scrollbar">
        <div
          v-for="user in users"
          :key="user.id"
          @click="openUser(user.id)"
          class="p-1 rounded-xl bg-white/20 backdrop-blur-sm shadow-md hover:shadow-xl hover:scale-101 transform transition duration-300 cursor-pointer"
        >
          <img
            v-if="user.photos && user.photos.length"
            :src="`${API_BASE_URL}/storage/${user.photos.find(photo => photo.is_main == 1)?.file_name}`"
            alt="User photo"
            class="rounded-lg object-cover h-[250px] w-full mb-3 shadow-sm"
          />
          <p class="font-semibold text-center text-xl text-white">
            {{ user.name }} - {{ calculateUserAge(user) ?? 'Age unknown' }}
          </p>
        </div>
      </div>
    </div>

    <!-- User modal -->
    <div v-if="selectedUserId" class="fixed rounded-lg inset-0 flex items-start justify-center z-50" @click="closeUser">
      <div
        class="relative shadow-[0_0_40px_rgba(0,0,0,0.6)] w-[95%] sm:w-[80%] md:w-[60%] max-w-[700px]"
        :style="{ backgroundColor: 'transparent', height: `calc(100vh - ${bottomNavStore.height}px)` }"
        @click.stop
      >
        <UserModal :userId="selectedUserId" :visible="true" @close="closeUser">
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
import { ref, onMounted, onUnmounted, watch } from 'vue'
import axiosClient from '../axios' 
import { useFilterStore } from '../store/filterStore'
import { calculateAge } from '../utils/age'
import UserModal from '../components/modals/UserModal.vue'
import Spinner from '../ui/Spinner.vue'
import { useUserActivityStore } from '../store/userActivity'
import { API_BASE_URL } from '@/utils/constants'
import { useBottomNavStore } from '../store/showBottomNavStore'

/** Stores */
const userActivityStore = useUserActivityStore()
const bottomNavStore = useBottomNavStore()
const filterStore = useFilterStore()

/** Refs and reactive state */
const users = ref([])                // List of loaded users
const loading = ref(true)            // True while loading initial users
const loadingMore = ref(false)       // True while loading additional users
const hasMore = ref(true)            // Whether there are more users to fetch
const limit = 9                       // Number of users per request
const scrollContainer = ref(null)     // Scrollable container reference
const selectedUserId = ref(null)      // Currently selected user for modal

/**
 * Fetch users from API
 * @param {boolean} append - If true, append to existing users; otherwise, replace
 */
const loadUsers = async (append = false) => {
  if (loadingMore.value) return

  append ? loadingMore.value = true : loading.value = true

  try {
    const response = await axiosClient.get('/api/explore', {
      params: {
        ...filterStore.filters,
        offset: append ? users.value.length : 0,
        limit
      }
    })

    const newUsers = response.data.data ?? []
    users.value = append ? [...users.value, ...newUsers] : newUsers
    hasMore.value = newUsers.length === limit
  } catch (err) {
    console.error('Failed to load users', err)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

/**
 * Calculate age from user profile
 * @param {Object} user
 * @returns {number|null} Age or null if birth date not available
 */
function calculateUserAge(user) {
  if (!user.profile?.birth_date) return null
  return calculateAge(user.profile.birth_date)
}

/**
 * Open modal for selected user
 * @param {number|string} id
 */
const openUser = (id) => {
  selectedUserId.value = id
  history.pushState({ modal: true }, '', window.location.href)
}

/**
 * Close user modal
 */
const closeUser = () => {
  selectedUserId.value = null
  if (history.state?.modal) history.back()
}

/**
 * Handle browser back/forward to close modal
 */
function handlePopState() {
  if (selectedUserId.value) closeUser()
}

/**
 * Infinite scroll handler
 * @param {Event} e
 */
const handleScroll = (e) => {
  const el = e.target
  const bottomReached = el.scrollTop + el.clientHeight >= el.scrollHeight - 200
  if (bottomReached && hasMore.value && !loadingMore.value) {
    loadUsers(true)
  }
}

/** Lifecycle hooks */
onMounted(() => {
  loadUsers()
  userActivityStore.updateUserActivity(true)
  scrollContainer.value?.addEventListener('scroll', handleScroll)
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
  scrollContainer.value?.removeEventListener('scroll', handleScroll)
})

/** Watch for filter changes */
watch(
  () => filterStore.filters,
  () => loadUsers(),
  { deep: true }
)
</script>
