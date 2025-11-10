<template>
  <div @click.close="closeAllOptions"
   class="min-h-screen">

    <!-- Message when no photos exist -->
    <div v-if="photos.length === 0" class="text-white">No photos yet</div>

    
    <!-- Grid of photos -->
    <div  v-else-if="photosPreview.length === 0" class="grid grid-cols-3 grid-auto-rows-[200px] gap-4 grid-flow-dense">

      <!-- Main photo (larger, dynamic) -->
      <div v-if="mainPhoto" class="col-span-2 row-span-2 group relative">
        
        <!-- Options button (Edit/Delete) -->
        <div class="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-white/30 bg-opacity-80 rounded w-6 h-6 flex items-center justify-center shadow-md">
          <button @click="toggleOptions(mainPhoto.id)" class="text-black font-bold cursor-pointer">...</button>

          <!-- Dropdown menu for main photo -->
          <div v-if="showOptions[mainPhoto.id]" class="absolute min-w-[100px] right-0 top-6 w-35 bg-white/30 text-black rounded shadow-lg u-10">
            <ul v-if="!showEditDescription">
              <li @click.stop="toggleEditDescription(mainPhoto)" class="px-2 py-1 hover:bg-gray-100 cursor-pointer">Edit description</li>
              <li @click="deletePhoto(mainPhoto.id)" class="px-2 py-1 hover:bg-gray-100 cursor-pointer">Delete</li>
            </ul>

            <!-- Edit description input -->
            <div @click.stop v-if="showEditDescription === mainPhoto.id" class="px-2 py-1">
              <textarea
                v-model="newDescription"
                rows="2"
                class="w-full rounded border text-black p-1 text-sm"
                placeholder="Edit description"
              ></textarea>
              <button @click="editDescription(mainPhoto.id)" class="bg-blue-500 text-white px-2 py-1 rounded mt-1 text-sm">
                Save
              </button>
            </div>
          </div>
        </div>

        <!-- Main photo image and description -->
        <img :src="mainPhoto.url" alt="Main User photo" class="w-full rounded-lg h-full object-cover">
        <p v-if="mainPhoto.description" class="text-white mt-2 absolute bottom-2 left-2 max-w-[90%] overflow-hidden line-clamp-2">
          {{ mainPhoto.description }}
        </p>
      </div>

      <!-- Other photos -->
      <div v-if="otherPhotos" v-for="photo in otherPhotos" :key="photo.id" class="col-span-1 group relative">

        <!-- Options button (Make main/Edit/Delete) -->
        <div class="absolute top-2 right-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-80 rounded w-6 h-6 flex items-center justify-center shadow-md">
          <button @click="toggleOptions(photo.id)" class="text-black font-bold cursor-pointer">...</button>

          <!-- Dropdown menu -->
          <div v-if="showOptions[photo.id]" class="absolute right-0 top-6 w-35 bg-white text-black rounded shadow-lg z-10">
            <ul>
              <li @click="makeMain(photo.id)" class="px-2 py-1 hover:bg-gray-100 cursor-pointer">Make main</li>
              <li @click.stop="toggleEditDescription(photo)" class="px-2 py-1 hover:bg-gray-100 cursor-pointer">Edit description</li>
              <li @click="deletePhoto(photo.id)" class="px-2 py-1 hover:bg-gray-100 cursor-pointer">Delete</li>
            </ul>

            <!-- Edit description input -->
            <div @click.stop v-if="showEditDescription === photo.id" class="px-2 py-1">
              <textarea
                v-model="newDescription"
                rows="2"
                class="w-full rounded border text-black p-1 text-sm"
                placeholder="Edit description"
              ></textarea>
              <button @click="editDescription(photo.id)" class="bg-blue-500 text-white px-2 py-1 rounded mt-1 text-sm">
                Save
              </button>
            </div>
          </div>
        </div>

        <!-- Photo image and description -->
        <img :src="photo.url" alt="User photo" class="w-full rounded-lg h-full object-cover">
        <p v-if="photo.description" class="text-white mt-2 absolute bottom-2 left-2 max-w-[90%] overflow-hidden line-clamp-2">
          {{ photo.description }}
        </p>
      </div>

      
      <!-- Photo upload section -->
      <div class="col-span-1 group relative">
        <div  class="bg-gray-400 w-auto h-auto rounded-lg">
          <form @submit.prevent="submit" enctype="multipart/form-data" class="w-full h-full flex flex-col justify-center items-center">
            
            <!-- Hidden file input -->
            <input id="photo-upload" type="file" multiple accept="image/*" class="hidden" @change="onFileChange" />

            <!-- Plus icon to add photo -->
            <label for="photo-upload" class="cursor-pointer flex flex-col items-center justify-center">
              <svg 
                class="w-12 h-12 text-gray-700 hover:text-gray-900 transition-all duration-300" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="1.5" 
                viewBox="0 0 24 24">
                <path class="w-[50%] h-[50%]" stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              <p class="mt-2 text-sm text-gray-700">Add photo</p>
            </label>

          </form>
        </div>
      </div>
    </div>
<!-- Preview and input fields when photos are selected -->
<div v-if="photo && photo.length > 0" class="w-full p-2 bg-white/45">



  <!-- LOCAL PREVIEW – RESPONSÍVNE -->
  <div class="flex flex-wrap gap-2 justify-center sm:justify-start -mx-1">
    <div
      v-for="photo in photosPreview"
      :key="photo.id"
      class="relative group opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
      :class="previewItemClass"
    >
    <div class="border border-red-50">
            <!-- Description input -->
      <input
        type="text"
        v-model="descriptions[photo.id]"
        placeholder="Add description (optional)"
        class="w-full mb-2 p-1 rounded text-sm bg-gray-200 text-black"
      />

      <!-- Checkbox to mark as main photo -->
      <div class="flex items-center gap-2 mb-2">
        <input type="checkbox" v-model="isMainPerPhoto[photo.id]" id="is_main" />
        <label for="is_main" class="text-sm text-black">Main photo</label>
      </div>
      <img
        :src="photo.url"
        alt="Preview photo"
        class="w-full h-full object-cover rounded-lg shadow-sm"
      />
      <p
        v-if="photo.description"
        class="absolute bottom-1 left-1 right-1 text-white text-xs bg-black bg-opacity-70 px-1 py-0.5 rounded line-clamp-2"
      >
        {{ photo.description }}
      </p>
      <span class="absolute bottom-1 left-1 bg-black text-white text-xs px-1 rounded">Preview</span>

      <!-- Odstrániť preview (voliteľné) -->
      <button
        @click="removePreview(photo.id)"
        class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ×
      </button>
    </div>

    </div>
  </div>

  <!-- Submit button -->
  <button
    @click.prevent="submit"
    class="mt-3 bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold py-1 px-2 rounded w-full"
  >
    {{ submitValue }}
  </button>
</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axiosClient from '../../axios';
import { useToast } from "vue-toastification";

// Toast notifications
const toast = useToast();

// Reactive references for photos
const photo = ref([]); // Selected files
const photosPreview = ref([]); // Local preview of photos
const descriptions = ref({}); // Photo description
const submitValue = ref('Submit'); // Button text

// Photo options (edit/delete)
const showOptions = ref({})
const showEditDescription = ref(null);
const newDescription = ref(''); // Description being edited

const isMainPerPhoto = ref({}) // Checkbox for main photo


// Array of photos fetched from server
const photos = ref([]);

const previewItemClass = computed(() => {
  const count = photosPreview.value.length;

  if (count === 1) {
    return 'w-full max-w-md'; // 1 fotka → celá šírka
  }

  // Mobil: min 2, max 3
  // Desktop: max 3
  return 'w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.5rem)] max-w-xs';
});

function removePreview(id){
  const index = photosPreview.value.findIndex(p => p.id === id);
  if(index !== -1){
    photosPreview.value.splice(index,1);
    photo.value.splice(index, 1);
  }
}
// Fetch photos from server
const fetchPhotos = async () => {
  try {
    const response = await axiosClient.get('/api/photos');
    photos.value = response.data;
  } catch (err) {
    console.error(err, 'Error fetching photos');
  }
};
onMounted(fetchPhotos);

// Handle file input change
const onFileChange = (e) => {
  photo.value = Array.from(e.target.files);

  photosPreview.value = photo.value.map((file, index) => ({
      id: index, // index namiesto "tmp-${file.name}-${Date.now()}"
      url: URL.createObjectURL(file),
      description: descriptions.value[index] || '',
      is_main: isMainPerPhoto.value[index] || false,
      temp: true

  }));
};

// Submit photos to server
const submit = async () => {
  if (!photo.value || photo.value.length === 0) {
    toast.error("Please choose a photo");
    return;
  }

  submitValue.value = "Submitting";

  // Generate local preview
  photosPreview.value = photo.value.map(file => ({
    id: `tmp-${file.name}-${Date.now()}`,
    url: URL.createObjectURL(file),
    description: descriptions.value[file.id],
    is_main: isMainPerPhoto.value[file.id],
    temp: true
  }));

  const formData = new FormData();


  photo.value.forEach((file, index) => {
      formData.append("photos[]", file);
      formData.append(`description[${index}]`, descriptions.value[index] || '');
      formData.append(`is_main[${index}]`, isMainPerPhoto.value[index] ? 1 : 0);
  });

  

  try {
    await axiosClient.post("/api/photos", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    toast.success("Photo successfully uploaded");

    await fetchPhotos();

    // Clear local input
    photo.value = [];
    photosPreview.value = [];
    descriptions.value = {};
    isMainPerPhoto.value = {};
     } catch (err) {
      console.error(err);
      // Laravel validation errors
      if (err.response && err.response.status === 422) {
        const errors = err.response.data.errors;

        // Skús zobraziť konkrétne chyby pre fotky
        if (errors && errors["photos.0"]) {
          toast.error("Maximum size of single photo is 3MB");
        } else {
          // Všeobecná chyba
          toast.error(err.response.data.message || "Validation failed");
        }
      } else {
        // Iné chyby
        toast.error(err.message || "Something went wrong");
      }
    } finally {
      photo.value = [];
      submitValue.value = "Submit";
    }
}

// Computed main and other photos
const mainPhoto = computed(() => Array.isArray(photos.value) ? photos.value.find(p => p.is_main) : null);
const otherPhotos = computed(() => Array.isArray(photos.value) ? photos.value.filter(p => !p.is_main) : null);

// Set photo as main
const makeMain = async (id) => {
  try {
    await axiosClient.put(`/api/photos/${id}/main`);
    await fetchPhotos();
  } catch (err) {
    console.error('Error in setting main photo', err);
  }
};

// Toggle options dropdown
function toggleOptions(photoId) {
  const isOpen = showOptions.value[photoId];

  // close all toggleoptions 
  showOptions.value = {};

  if (!isOpen) {
    showOptions.value[photoId] = true;
  }

}

function closeAllOptions(e){
  if(e.target.textContent === '...') return
  showOptions.value = {}
  showEditDescription.value = null
}

// Toggle edit description input
function toggleEditDescription(photo) {
  
  showEditDescription.value = showEditDescription.value === photo.id ? null : photo.id;
  newDescription.value = photo.description || '';
}

// Edit photo description
const editDescription = async (id) => {
  try {
    const payload = { description: newDescription.value };
    await axiosClient.put(`/api/photos/${id}/description`, payload);
    await fetchPhotos();
    showEditDescription.value = null;
  } catch (err) {
    console.error('Error in editing description', err);
  }
}

// Delete a photo
const deletePhoto = async (id) => {
  try {
    await axiosClient.delete(`/api/photos/${id}/destroy`);
    await fetchPhotos();
  } catch (err) {
    console.error('Error in deleting photo', err);
  }
};
</script>
