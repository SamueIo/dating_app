<template>
  <div class="relative  bg-gray-900 rounded-xl text-white max-w-2xl mx-auto shadow-lg 
            space-y-6 overflow-hidden">
    <!-- Error / Loading -->
    <div v-if="error" class="text-sm text-center text-gray-400">
      <h1>No profile yet</h1>
    </div>
    <div v-else-if="loading" class="text-sm text-center text-gray-400">
      Loading...
    </div>

    <!-- Actual content -->
    <div v-else 
        >
      <!-- MAIN PHOTO -->
      <div v-if="mainPhoto" class="relative hide-scrollbar">
        <img :src="`${API_BASE_URL}/storage/${mainPhoto.file_name}`" 
        class="w-full rounded-lg mb-2 shadow-md" 
        @click="openPhotoModal(mainPhoto)"/>
        <p
          v-if="mainPhoto.description"
          class="absolute bottom-1 left-1 px-1 sm:px-2 py-0.5 sm:py-1 bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm rounded max-w-[90%]"
        >
          {{ mainPhoto.description }}
        </p>
      </div>

      <!-- NAME & AGE -->
      <div class="text-center">
        <h1 class="text-2xl sm:text-3xl font-bold">
          {{ data.name }}, <span class="text-gray-400 text-base sm:text-xl">{{ age }}</span>
        </h1>
      </div>

      <!-- BIO -->
      <div class="bg-gray-800 border border-gray-700 rounded-md p-3 sm:p-4 text-gray-300 text-center italic text-sm sm:text-base">
        {{ data.profile.bio || "This user hasn't added a bio yet." }}
      </div>

      <!-- SECOND PHOTO + INFO -->
      <div v-if="otherPhotos[0]" class="space-y-4">
        <div class="relative">
          <img 
            :src="`${API_BASE_URL}/storage/${otherPhotos[0].file_name}`" 
            @click="openPhotoModal(otherPhotos[0])"
            class="w-full object-cover" 
          />
          <p v-if="otherPhotos[0].description"
             class="absolute bottom-1 left-1 px-1 sm:px-2 py-0.5 sm:py-1 bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm rounded max-w-[90%]">
            {{ otherPhotos[0].description }}
          </p>
        </div>
      </div>
        <div class="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-200 pt-2">
          <div>📏 <strong>Height:</strong> {{ data.profile.height }} cm</div>
          <div>💼 <strong>Job:</strong> {{ capitalize(data.profile.job_title) }}</div>
          <div>🎓 <strong>Education:</strong> {{ capitalize(data.profile.education) }}</div>
          <div>📍 <strong>Location:</strong> {{ capitalize(data.profile.location) }}</div>
        </div>

      <!-- THIRD PHOTO + MORE INFO -->
      <div v-if="otherPhotos[1]" class="space-y-4">
        <div class="relative">
          <img :src="`${API_BASE_URL}/storage/${otherPhotos[1].file_name}`" 
          class="w-full rounded-md shadow-sm" 
          @click="openPhotoModal(otherPhotos[1])"/>
          <p v-if="otherPhotos[1].description"
             class="absolute bottom-1 left-1 px-1 sm:px-2 py-0.5 sm:py-1 bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm rounded max-w-[90%]">
            {{ otherPhotos[1].description }}
          </p>
        </div>
      </div>
        <div class="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-200 pt-2">
          <div>🚬 <strong>Smoking:</strong> {{ capitalize(data.profile.smoking) }}</div>
          <div>🍷 <strong>Drinking:</strong> {{ capitalize(data.profile.drinking) }}</div>
          <div>🐾 <strong>Pets:</strong> {{ capitalize(data.profile.pets) }}</div>
          <div>❤️ <strong>Interested In:</strong> {{ capitalize(data.profile.interested_in) }}</div>
        </div>

      <!-- EXTRA PHOTOS -->
      <div v-if="extraPhotos.length" class="pt-6 ">
        <h3 class="text-base sm:text-lg font-semibold mb-2 text-gray-100">📸 More Photos</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          <div v-for="(photo, index) in extraPhotos" :key="index" class="flex flex-col relative">
            <img
              :src="`${API_BASE_URL}/storage/${photo.file_name}`"
              @click="openPhotoModal(index)"
              class="rounded-md object-cover h-24 sm:h-32 w-full shadow-sm hover:scale-105 transition"
              alt="User photo"
            />
            <p
              v-if="photo.description"
              class="mt-1 text-xs text-gray-300 truncate absolute left-2 bottom-2"
              title="photo.description"
            >
              {{ photo.description }}
            </p>
          </div>
        </div>
      </div>

    </div>
      <PhotoModal
        v-if="isPhotoModalOpen"
        :images="currentAttachments"
        :startIndex="currentImageIndex"
        @close="isPhotoModalOpen = false"
      />
  </div>
</template>


<script setup>

import axiosClient from '../../axios';
import { ref, computed, onMounted } from 'vue';
import { API_BASE_URL } from '@/utils/constants';
import PhotoModal from '../modals/PhotoModal.vue';
import { useBottomNavStore } from '@/store/showBottomNavStore';

const bottomNavStore = useBottomNavStore()

const data = ref(null)
const loading = ref(true)
const error = ref(null)

// PhotoModal state
const isPhotoModalOpen = ref(false)
const currentAttachments = ref([])  // Array of photo objects { file_name, description }
const currentImageIndex = ref(0)


onMounted(() => {
    axiosClient.get('/api/profile')
    .then(response => {   
      data.value = response.data
      loading.value = false
    })
    .catch(err => {
        console.error('Error in loading profile', err)
        if(err.response.status == 404 ){
          error.value = 'No profile yet'
        }
    });
})

const mainPhoto = computed(() => {
    return data.value?.photos.find(photo => photo.is_main) || null
})
const otherPhotos = computed(() => {
    return data.value?.photos.filter(photo => !photo.is_main) || []
})
const extraPhotos = computed(() => otherPhotos.value.slice(2)) // všetky fotky po prvej a druhej
// 
// all photos from 
const allPhotos = computed(() => {return data.value?.photos || []})

/**
 * Open photo modal from allPhotos array
 * @param {Arrayr} clickedPhotos - All photos which can be listed
 */
const openPhotoModal = (clickedPhoto) => {  
  currentAttachments.value = allPhotos.value
  currentImageIndex.value = allPhotos.value.indexOf(clickedPhoto)
  isPhotoModalOpen.value = true
}


const birthDate = computed(() => data.value?.profile?.birth_date || null);

const age = computed(() => {
    if(!birthDate.value) return null
    const birth = new Date(birthDate.value);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    if(monthDiff <0 || (monthDiff === 0 && dayDiff < 0)){
        years--
    }
    return years
})

// Capitalize helper function
function capitalize(str) {
  if (!str) return '-'
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>