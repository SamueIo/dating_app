<template>
  <div 
    class="relative max-w-2xl mx-auto bg-black/70 backdrop-blur-lg rounded-xl text-white shadow-xl border border-purple-600"
    style="max-height: calc(100vh - 60px); width: 100%;"
  >
    <div class="z-60">
      <slot name="actions"></slot>
    </div>
 
    <div 
      class="p-0 sm:p-4 pb-14 overflow-y-auto hide-scrollbar" 
      style="max-height: calc(100vh - 85px);"
    >
      <div v-if="loading" class="flex justify-center items-center py-6">
        <Spinner/>
      </div>
      <div v-else>
        <!-- MAIN PHOTO -->
        <div v-if="mainPhoto" class="relative rounded-lg overflow-hidden shadow-lg border border-purple-500 mb-4">
          <img :src="`/storage/${mainPhoto.file_name}`" class="w-full object-cover" />
          <p
            v-if="mainPhoto.description"
            class="absolute bottom-1 left-1 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs sm:text-sm rounded max-w-[90%] select-none"
          >
            {{ mainPhoto.description }}
          </p>
        </div>

        <!-- NAME & AGE -->
        <div class="text-center mb-4">
          <h1 class="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-500 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
            {{ userData.name }}, <span class="text-gray-400 text-base sm:text-xl">{{ calculateAge(birthDate) }}</span>
          </h1>
          <h2 class="text-gray-300">{{ userData.profile.gender }}</h2>
        </div>

        <!-- BIO -->
        <div class="bg-black/50 border border-purple-700 rounded-md p-4 text-gray-300 italic text-center text-sm sm:text-base mb-6">
          {{ userData.profile.bio || "This user hasn't added a bio yet." }}
        </div>

        <!-- SECOND PHOTO + INFO -->
        <div v-if="otherPhotos[0]" class="space-y-4 mb-6">
          <div class="relative rounded-md overflow-hidden shadow-md border border-purple-500">
            <img :src="`/storage/${otherPhotos[0].file_name}`" class="w-full object-cover" />
            <p v-if="otherPhotos[0].description"
               class="absolute bottom-1 left-1 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs sm:text-sm rounded max-w-[90%] select-none">
              {{ otherPhotos[0].description }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-200 mb-6">
          <div>📏 <strong>Height:</strong> {{ userData.profile.height }} cm</div>
          <div>💼 <strong>Job:</strong> {{ userData.profile.job_title }}</div>
          <div>🎓 <strong>Education:</strong> {{ userData.profile.education }}</div>
          <div>📍 <strong>Location:</strong> {{ userData.profile.location }}</div>
        </div>

        <!-- THIRD PHOTO + MORE INFO -->
        <div v-if="otherPhotos[1]" class="space-y-4 mb-6">
          <div class="relative rounded-md overflow-hidden shadow-md border border-purple-500">
            <img :src="`/storage/${otherPhotos[1].file_name}`" class="w-full object-cover" />
            <p v-if="otherPhotos[1].description"
               class="absolute bottom-1 left-1 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs sm:text-sm rounded max-w-[90%] select-none">
              {{ otherPhotos[1].description }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-200 mb-8">
          <div>🚬 <strong>Smoking:</strong> {{ userData.profile.smoking }}</div>
          <div>🍷 <strong>Drinking:</strong> {{ userData.profile.drinking }}</div>
          <div>🐾 <strong>Pets:</strong> {{ userData.profile.pets }}</div>
          <div>❤️ <strong>Interested In:</strong> {{ userData.profile.interested_in }}</div>
        </div>

        <!-- EXTRA PHOTOS -->
        <div v-if="extraPhotos.length" class="pt-6 pb-12">
          <h3 class="text-base sm:text-lg font-semibold mb-3 text-gray-100 drop-shadow-md">📸 More Photos</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div v-for="(photo, index) in extraPhotos" :key="index" class="relative flex flex-col rounded-md overflow-hidden shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105 border border-purple-600">
              <img
                :src="`/storage/${photo.file_name}`"
                class="object-cover h-24 sm:h-32 w-full"
                alt="User photo"
              />
              <p
                v-if="photo.description"
                class="absolute left-2 bottom-2 text-xs text-gray-300 truncate select-none"
                :title="photo.description"
              >
                {{ photo.description }}
              </p>
            </div>
          </div>
        </div>
        <div v-else class="pb-20">Medzera</div>

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

const props = defineProps({
    userId: Number,
    visible: Boolean
})

const emit = defineEmits(['close']);

const userData = ref(null);
const loading = ref(true);
const route = useRoute();

watch(
  () => props.userId,
  async (newId) => {
    if (!newId) return;
    loading.value = true;
    try {
      const response = await axiosClient.get(`/api/users/${newId}`);
      userData.value = response.data;
    } catch (err) {
      console.error('Failed to load user ', err);
    } finally {
      loading.value = false;
    }
  },
  { immediate: true }
);


const mainPhoto = computed(() => {
    return userData.value?.photos.find(photo => photo.is_main) || null
})
const otherPhotos = computed(() => {
    return userData.value?.photos.filter(photo => !photo.is_main) || []
})
const extraPhotos = computed(() => otherPhotos.value.slice(2)) // všetky fotky po prvej a druhej



const birthDate = computed(() => userData.value?.profile?.birth_date || null);
// calculateAge(birthDate)

const close = () => emit('close');

</script>



