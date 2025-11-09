<template>
  <div 
    class="relative w-full" 
    @keydown.down.prevent="onArrowDown" 
    @keydown.up.prevent="onArrowUp" 
    @keydown.enter.prevent="onEnter"
  >
    <!-- Input field -->
    <input
      type="text"
      v-model="search"
      @input="onInput"
      placeholder="City"
      class="w-full rounded-md bg-white/10 text-white focus:border-pink-500 focus:ring-pink-600 focus:ring-opacity-50 p-2"
      ref="inputEl"
    />

    <!-- Suggestions dropdown -->
    <ul
      v-if="suggestions.length"
      class="absolute bg-white border w-full max-h-60 overflow-y-auto z-10 text-black"
    >
      <li
        v-for="(item, index) in suggestions"
        :key="index"
        @click="selectCity(item)"
        :class="[
          'p-2 cursor-pointer',
          highlightedIndex === index ? 'bg-pink-100' : 'hover:bg-gray-100'
        ]"
      >
        {{ item.properties.city || item.properties.formatted }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import debounce from 'lodash.debounce';

// --- Props ---
const props = defineProps({
  modelValue: String,
});

// --- Emits ---
const emit = defineEmits(['update:modelValue', 'selectedLocationCoords']);

// --- Reactive state ---
const search = ref(props.modelValue || '');
const suggestions = ref([]);
const highlightedIndex = ref(-1);
const inputEl = ref(null);

// --- Watch prop changes ---
watch(() => props.modelValue, (val) => {
  if (val !== search.value) search.value = val;
});

// --- API key ---
const API_KEY = '911c2fcfded94b25997737732df531c0';

// --- Fetch suggestions (debounced) ---
const fetchSuggestions = debounce(async () => {
  if (search.value.length < 2) {
    suggestions.value = [];
    highlightedIndex.value = -1;
    return;
  }

  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
    search.value
  )}&type=city&lang=sk&limit=5&apiKey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    suggestions.value = data.features || [];
    highlightedIndex.value = -1;
  } catch (error) {
    console.error('Geoapify API error:', error);
    suggestions.value = [];
  }
}, 300);

// --- Input handler ---
function onInput() {
  fetchSuggestions();
  emit('update:modelValue', search.value);
}

// --- Select a city from suggestions ---
function selectCity(city) {
  const name = city.properties.city || city.properties.formatted;
  const lat = city.properties.lat;
  const lon = city.properties.lon;

  search.value = name;
  emit('update:modelValue', name);
  emit('selectedLocationCoords', { lat, lon });

  suggestions.value = [];
  highlightedIndex.value = -1;
}

// --- Keyboard navigation ---
function onArrowDown() {
  if (suggestions.value.length === 0) return;
  highlightedIndex.value =
    highlightedIndex.value < suggestions.value.length - 1
      ? highlightedIndex.value + 1
      : 0;
}

function onArrowUp() {
  if (suggestions.value.length === 0) return;
  highlightedIndex.value =
    highlightedIndex.value > 0
      ? highlightedIndex.value - 1
      : suggestions.value.length - 1;
}

function onEnter() {
  if (highlightedIndex.value >= 0 && suggestions.value[highlightedIndex.value]) {
    selectCity(suggestions.value[highlightedIndex.value]);
  }
}
</script>
