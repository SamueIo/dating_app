<template>
<div class="h-screen">
  <div v-if="photos.length === 0" class="text-white">No photos yet</div>
  <div v-else class="grid  grid-cols-4 grid-auto-rows-[150px] gap-4  grid-flow-dense">
    
    <!-- Main photo (dynamic) -->
    
      <div v-if="mainPhoto" class="col-span-2 row-span-2 group relative">
        <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
            bg-white bg-opacity-80 rounded w-6 h-6 flex items-center justify-center shadow-md">
          <button @click="toggleOptions(mainPhoto.id)" class="text-black font-bold cursor-pointer">...</button>
          <div v-if="showOptions" class="absolute right-0 top-6 w-35 bg-white text-black rounded shadow-lg u-10">
            <ul>
                <li @click="toggleEditDescription(mainPhoto)" class="px-2 py-1 hover:bg-gray-100 cursor-pointer">Edit description</li>
                <li @click="deletePhoto(mainPhoto.id)" class="px-2 py-1 hover:bg-gray-100 cursor-pointer">Delete</li>
            </ul>
            <!-- Textarea mimo <ul> -->
            <div v-if="showEditDescription === mainPhoto.id" class="px-2 py-1">
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
        <img :src="mainPhoto.url" alt="Main User photo" class="w-full rounded-lg h-full object-cover">
        <p v-if="mainPhoto.description" 
            class="text-white mt-2 absolute bottom-2 left-2 max-w-[90%] overflow-hidden line-clamp-2">
            {{ mainPhoto.description }}
        </p>
      </div>


    
    <!-- Other photos -->
     <div
      v-if="otherPhotos"
      v-for="photo in otherPhotos"
      class="col-span-1 group relative"
    >
        <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
            bg-white bg-opacity-80 rounded w-6 h-6 flex items-center justify-center shadow-md">
          <button @click="toggleOptions(photo.id)" class="text-black font-bold cursor-pointer">...</button>
          <div v-if="showOptions" class="absolute right-0 top-6 w-35 bg-white text-black rounded shadow-lg z-10">
          <ul>
            <li @click="makeMain(photo.id)" class="px-2 py-1 hover:bg-gray-100 cursor-pointer">Make main</li>
            <li @click="toggleEditDescription(photo)" class="px-2 py-1 hover:bg-gray-100 cursor-pointer">Edit description</li>
            <li @click="deletePhoto(photo.id)" class="px-2 py-1 hover:bg-gray-100 cursor-pointer">Delete</li>
          </ul>
      
          <!-- Textarea mimo <ul> -->
          <div v-if="showEditDescription === photo.id" class="px-2 py-1">
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
      <img :src="photo.url" alt="User photo" class="w-full rounded-lg h-full object-cover">
        <p v-if="photo.description" 
            class="text-white mt-2 absolute bottom-2 left-2 max-w-[90%] overflow-hidden line-clamp-2">
            {{ photo.description }}
        </p>
      
    </div>
    
    <div class="col-span-1 group relative">
        <!-- form -->
            <div class="bg-gray-400 w-auto h-auto   rounded-lg">
                  <form @submit.prevent="submit" enctype="multipart/form-data" 
                    class="w-full h-full flex flex-col justify-center items-center">
                        <input
                        id="photo-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        class="hidden"
                        @change="onFileChange"
                      />
                      <!-- Plus icon -->
                        <label v-if="!photosPreview.length" for="photo-upload" class="cursor-pointer">
                          <svg class="w-[100%] h-[100%] text-gray-700 hover:text-gray-900" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                          </svg>
                        </label>

                    <div v-if="photo && photo.length > 0" class="w-full p-2">
                          <!-- Photo preview -->
    
                      <div
                        v-if="photosPreview.length"
                        v-for="photo in photosPreview"
                        :key="photo.id"
                        class="col-span-1 group relative opacity-70"
                      >
                        <img :src="photo.url" alt="Preview photo" class="w-full rounded-lg h-full object-cover" />
                        <p v-if="photo.description" 
                            class="text-white mt-2 absolute bottom-2 left-2 max-w-[90%] min-w-[250px] overflow-hidden line-clamp-2">
                            {{ photo.description }}
                        </p>
                        <span class="absolute top-2 left-2 bg-black text-white text-xs px-1 rounded">Preview</span>
                        <span v-if="errorMessage">Errormessage{{ errorMessage }}</span>
                        <span v-else>Message{{ message }}</span>
                      </div>

                        <input
                          type="text"
                          v-model="description"
                          placeholder="Add description (optional)"
                          class="w-full mb-2 p-1 rounded text-sm bg-gray-200 text-black"
                        />
                        <div class="flex items-center gap-2 mb-2">
                          <input type="checkbox" v-model="is_main" id="is_main" />
                          <label for="is_main" class="text-sm text-black">Main photo</label>
                        </div>
                        <button
                          @click.prevent="submit"
                          class="bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold py-1 px-2 rounded w-full"
                        >
                          {{ submitValue}}
                        </button>
                    </div>
                </form>
            </div>
 
 
    </div>

  </div>
</div>


</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axiosClient from '../../axios';

const photo = ref([]);
const photosPreview = ref([]);
const description= ref('');
const submitValue = ref('submit')
const errorMessage = ref('')

const showOptions = ref(null); 
const showEditDescription = ref(null);
const newDescription = ref('');

const is_main = ref('')
const message = ref('');
const error = ref('');

//Fetching photos//
const photos= ref([]);


const fetchPhotos= async () => {
    try{
        const response = await axiosClient.get('/api/photos');
        photos.value = response.data;
    }catch(err){
        console.error(err,'Error fetching photos')
    }
}
onMounted(fetchPhotos);


//Uploading photos
const onFileChange = (e) => {
    photo.value = Array.from(e.target.files);

    photosPreview.value = photo.value.map(file => ({
        id: `tmp-${file.name}-${Date.now()}`,
        url: URL.createObjectURL(file),
        description: description.value,
        is_main: is_main.value,
        temp: true // označenie, že ide o lokálny náhľad
    }))
}

const submit = async () => {
    submitValue.value = 'Submitting'
    message.value = '';
    error.value = '';

    if (!photo.value || photo.value.length === 0) {
        error.value = 'Choose photo';
        return;
    }

    // Generovante local preview
    photosPreview.value = photo.value.map(file => ({
        id: `tmp-${file.name}-${Date.now()}`, 
        url: URL.createObjectURL(file),
        description: description.value,
        is_main: is_main.value,
        temp: true 
    }));

    const formData = new FormData();
    photo.value.forEach((file) => {
        formData.append('photos[]', file);
    });
    formData.append('description', description.value);
    formData.append('is_main', is_main.value ? 1 : 0);

    try {
        const response = await axiosClient.post('/api/photos', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        message.value = 'Photo successfully uploaded';

        // Obnovíme fotky zo servera, aby sa nahradili dočasné náhľady
        await fetchPhotos();

        // Vyčistíme lokálne dočasné náhľady a vstupné polia
        photo.value = [];
        photosPreview.value = [];
        description.value = '';
        is_main.value = false;
    } catch (err) {
        error.value = 'Problem with photo uploading';
        console.error(err);
        errorMessage.value= err 
    } finally{
      submitValue.value = 'Submit'
    }
};

//Displaying photos

const mainPhoto = computed (() => 
    Array.isArray(photos.value) ? photos.value.find(p => p.is_main): null
);
const otherPhotos = computed (() => 
    Array.isArray(photos.value) ? photos.value.filter(p => !p.is_main): null,

);



const  makeMain = async(id) => {
    try{   
        const response = await axiosClient.put(`/api/photos/${id}/main`);
        await fetchPhotos();
    }catch(err){
        console.error('Error in setting main', err)
    }
};

function toggleOptions(photoId) {
  if (showOptions.value === photoId) {
    showOptions.value = null;
  } else {
    showOptions.value = photoId;
  }
  showEditDescription.value = null;
}

function toggleEditDescription(photo) {
  showEditDescription.value = showEditDescription.value === photo.id ? null : photo.id;
  newDescription.value = photo.description || '';
}

const editDescription = async(id) => {
  try {
    const payload = { description: newDescription.value };
    await axiosClient.put(`/api/photos/${id}/description`, payload);
    await fetchPhotos();
    showEditDescription.value = null;
  } catch (err) {
    console.error('Error in editing description', err);
  }
}
const deletePhoto = async(id) => {
    try{
        const response = await axiosClient.delete(`/api/photos/${id}/destroy`)
        await fetchPhotos();
    }catch (err) {
        console.error('Error in deleting photos ', err);
    }
}
</script>