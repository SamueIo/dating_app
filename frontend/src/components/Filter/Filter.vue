<template>
  <aside class="w-full h-full p-4 text-white bg-opacity-50 backdrop-blur-sm bg-black/10">
    <h2 class="text-xl font-semibold mb-4">Filters</h2>

    <!-- Gender -->
    <div class="mb-4">
      <label class="block mb-1 font-medium">Gender:</label>
      <select v-model="filters.gender" class="w-full p-2 rounded bg-white/10 text-white border border-white/20">
        <option value="" class="text-black">Both</option>
        <option value="male" class="text-black">Male</option>
        <option value="female" class="text-black">Female</option>
      </select>
    </div>

    <!-- Age -->
    <div class="mb-4">
      <label class="block mb-1 font-medium">Age Range:</label>
      <div class="flex space-x-2">
        <input
          type="number"
          v-model.number="filters.ageFrom"
          placeholder="From"
          class="w-1/2 p-2 rounded bg-white/10 text-white border border-white/20"
        />
        <input
          type="number"
          v-model.number="filters.ageTo"
          placeholder="To"
          class="w-1/2 p-2 rounded bg-white/10 text-white border border-white/20"
        />
      </div>
    </div>

    <!-- Location -->
    <div class="mb-4 relative">
      <label class="block mb-1 font-medium">Location:</label>
      <CityAutocomplete v-model="filters.location" 
        @selectedLocationCoords="onSelectedLocationCoords" />
    </div>

    <!-- Radius in kilometers -->
    <div class="mb-4" v-if="filters.location">
      <label class="block mb-1 font-medium">Radius (km):</label>
      <input
        type="number"
        min="5"
        v-model.number="filters.radiusKm"
        placeholder="Radius in kilometers"
        class="w-full p-2 rounded bg-white/10 text-white border border-white/20"
      />
    </div>

    <!-- Height -->
    <div class="mb-4">
      <label class="block mb-1 font-medium">Height Range (cm):</label>
      <div class="flex space-x-2">
        <input
          type="number"
          v-model.number="filters.heightFrom"
          placeholder="Min"
          class="w-1/2 p-2 rounded bg-white/10 text-white border border-white/20"
        />
        <input
          type="number"
          v-model.number="filters.heightTo"
          placeholder="Max"
          class="w-1/2 p-2 rounded bg-white/10 text-white border border-white/20"
        />
      </div>
    </div>

    <!-- Online only -->
    <div class="mb-4 flex items-center space-x-2">
      <input
        type="checkbox"
        v-model="filters.onlyOnline"
        id="onlyOnline"
        class="form-checkbox text-pink-500"
      />
      <label for="onlyOnline" class="font-medium">Only Online</label>
    </div>

    <!-- With photo -->
    <div class="mb-4 flex items-center space-x-2">
      <input
        type="checkbox"
        v-model="filters.withPhoto"
        id="withPhoto"
        class="form-checkbox text-pink-500"
      />
      <label for="withPhoto" class="font-medium">Only with Photo</label>
    </div>

    <!-- Apply button -->
    <button
      @click="applyFilters"
      class="w-full py-2 mt-2 bg-pink-600 hover:bg-pink-700 rounded font-semibold transition-colors"
    >
      Apply Filters
    </button>
  </aside>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useFilterStore } from '../../store/filterStore'
import CityAutocomplete from '../profile/ProfileComponents/CityAutocomplete.vue'

const filters = reactive({
  gender: '',
  ageFrom: null,
  ageTo: null,
  location: '',
  radiusKm: 5,
  heightFrom: null,
  heightTo: null,
  onlyOnline: false,
  withPhoto: false,
  latitude: null,
  longitude: null,
})

const filterStore = useFilterStore()

function onSelectedLocationCoords(coords) {

  filters.latitude = coords.lat
  filters.longitude = coords.lon

  if(filters.latitude && filters.radiusKm == 0){
    filters.radiusKm = 5
  }
}


onMounted(async () => {
  await filterStore.fetchFilters()
  Object.assign(filters, filterStore.filters)

  if(filters.longitude && filters.radiusKm == 0){
    filters.radiusKm = 5    
  }
  
})

const applyFilters = async () => {
  if(!filters.location){
    filters.latitude = null
    filters.longitude = null
    filters.radiusKm = 0
  }
  filterStore.setFilters(filters)
  await filterStore.saveFilters()  
}
</script>
