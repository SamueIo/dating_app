<template>
  <div 
    class="relative  max-w-2xl mx-auto bg-black/70 backdrop-blur-lg rounded-xl text-white shadow-xl border border-purple-600"
    :style="{ maxHeight: `calc(100vh - ${bottomNavStore.height}px)`, width: '100%' }"
  >

    <div class="z-60">
      <slot name="actions"></slot>
    </div>
 
      <div 
        class="p-0 pb-14 overflow-y-auto hide-scrollbar"
        :style="{ maxHeight: `calc(100vh - ${bottomNavStore.height}px)` }"
      >

      <div v-if="loading" class="flex justify-center items-center py-6">
        <Spinner/>
      </div>
      <div v-else>
        <!-- MAIN PHOTO -->
        <div v-if="mainPhoto" class="relative rounded-lg overflow-hidden shadow-lg mb-4">
          <img :src="`${API_BASE_URL}/storage/${mainPhoto.file_name}`" class="w-full object-cover z-60" />
          <div class="absolute inset-0 pointer-events-none">
            <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          </div>
          <!-- Other unformations -->
          <div class="absolute inset-x-0 bottom-12 flex flex-col items-center px-4 select-none">
            <h1 class="text-2xl sm:text-3xl font-extrabold bg-white bg-clip-text text-transparent drop-shadow-2xl text-center">
              {{ props.userData.name }}, <span class="text-white text-base sm:text-xl drop-shadow-2xl">{{ calculateAge(birthDate) }}</span>
            </h1>
            <div class="text-white text-sm sm:text-base drop-shadow-2xl">{{ props.userData.profile.location }}</div>
          </div>
        
          <!-- Photo description -->
          <p 
            v-if="mainPhoto.description" 
            class="absolute bottom-1 left-1 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs sm:text-sm rounded max-w-[90%] select-none .accent"
          >
            {{ mainPhoto.description }}
          </p>
        </div>

        <div class="relative z-70 p-4">
          <h2 class="ml-2 pb-1">About:</h2>
          <div class="bg-black/50  rounded-md p-4 text-gray-300 italic text-center text-sm sm:text-base mb" >
            {{ props.userData.profile.bio || "This user hasn't added a bio yet." }}
          </div>

          <!-- SECOND PHOTO + INFO -->
          <div v-if="otherPhotos[0]" class="space-y-4 mb-6">
            <div class="relative rounded-md overflow-hidden shadow-md border border-purple-500">
              <img :src="`${API_BASE_URL}/storage/${otherPhotos[0].file_name}`" class="w-full object-cover" />
              <p v-if="otherPhotos[0].description"
                 class="absolute bottom-1 left-1 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs sm:text-sm rounded max-w-[90%] select-none .accent">
                {{ otherPhotos[0].description }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-200 mb-6">
            <div>📏 <strong>Gender:</strong> {{  props.userData.profile.gender  }} cm</div>
            <div>📏 <strong>Height:</strong> {{ props.userData.profile.height }} cm</div>
            <div>💼 <strong>Job:</strong> {{ props.userData.profile.job_title }}</div>
            <div>🎓 <strong>Education:</strong> {{ props.userData.profile.education }}</div>
          </div>

          <!-- THIRD PHOTO + MORE INFO -->
          <div v-if="otherPhotos[1]" class="space-y-4 mb-6">
            <div class="relative rounded-md overflow-hidden shadow-md border border-purple-500">
              <img :src="`${API_BASE_URL}/storage/${otherPhotos[1].file_name}`" class="w-full object-cover" />
              <p v-if="otherPhotos[1].description"
                 class="absolute bottom-1 left-1 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs sm:text-sm rounded max-w-[90%] select-none .accent">
                {{ otherPhotos[1].description }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-200 mb-8">
            <div>🚬 <strong>Smoking:</strong> {{ props.userData.profile.smoking }}</div>
            <div>🍷 <strong>Drinking:</strong> {{ props.userData.profile.drinking }}</div>
            <div>🐾 <strong>Pets:</strong> {{ props.userData.profile.pets }}</div>
            <div>❤️ <strong>Interested In:</strong> {{ props.userData.profile.interested_in }}</div>
          </div>

          <!-- EXTRA PHOTOS -->
          <div v-if="extraPhotos.length" class="pt-6 pb-12">
            <h3 class="text-base sm:text-lg font-semibold mb-3 text-gray-100 drop-shadow-md">📸 More Photos</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div v-for="(photo, index) in extraPhotos" :key="index" class="relative flex flex-col rounded-md overflow-hidden shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105 border border-purple-600">
                <img
                  :src="`${API_BASE_URL}/storage/${photo.file_name}`"
                  class="object-cover h-24 sm:h-32 w-full"
                  alt="User photo"
                />
                <p
                  v-if="photo.description"
                  class="absolute left-2 bottom-2 text-xs text-gray-300 truncate select-none .accent"
                  :title="photo.description"
                >
                  {{ photo.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
        

      </div>
    </div>
  </div>
</template>



<script setup>

import axiosClient from '../../axios';
import { ref, computed, onMounted, watch } from 'vue';
import { calculateAge } from '../../utils/age';
import Spinner from '../../ui/Spinner.vue';
import { useRoute } from 'vue-router';
import { API_BASE_URL } from '@/utils/constants';
import { useBottomNavStore } from '@/store/showBottomNavStore';

const props = defineProps({
    userData: Object,
    visible: Boolean
})

const emit = defineEmits(['close']);

const loading = ref(false);
const route = useRoute();

const bottomNavStore = useBottomNavStore()



const mainPhoto = computed(() => props.userData?.photos.find(photo => photo.is_main) || null)
const otherPhotos = computed(() => props.userData?.photos.filter(photo => !photo.is_main) || [])
const extraPhotos = computed(() => otherPhotos.value.slice(2))
const birthDate = computed(() => props.userData?.profile?.birth_date || null)

// calculateAge(birthDate)

const close = () => emit('close');

</script>



