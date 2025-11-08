<template>
  <form @submit.prevent="submit">
    <div v-for="field in fields" :key="field.name" class="mb-4">
      <label class="block text-white mb-2 font-semibold">
        {{ field.label }}
      </label>

      <!-- RADIO -->
      <div v-if="field.type === 'radio'" class="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <label v-for="option in field.options" :key="option.value" class="flex items-center gap-2 text-white py-1 sm:py-0">
          <input
            type="radio"
            :name="field.name"
            :value="option.value"
            v-model="form[field.name]"
            class="form-radio text-pink-600"
          />
          {{ option.label }}
        </label>
      </div>

      <!-- TEXTAREA -->
      <textarea
        v-else-if="field.type === 'textarea'"
        :id="field.name"
        v-model="form[field.name]"
        :placeholder="field.placeholder"
        rows="3"
        class="w-full rounded-md bg-gray-700 text-white border border-gray-500 focus:border-pink-500 focus:ring-pink-600 focus:ring-opacity-50 p-2"
      ></textarea>  

      <!-- CITY AUTOCOMPLETE -->
      <CityAutocomplete
        v-else-if="field.name === 'location'"
        v-model="form.location"
        placeholder="Your location"
        @selectedLocationCoords="onSelectedLocationCoords"
      />

      <!-- DEFAULT INPUT -->
      <input
        v-else
        :type="field.type"
        :id="field.name"
        v-model="form[field.name]"
        :placeholder="field.placeholder"
        class="w-full rounded-md bg-gray-700 text-white border border-gray-500 focus:border-pink-500 focus:ring-pink-600 focus:ring-opacity-50 p-2"
      />
    </div>
    <button
      type="submit"
      class="mt-4 mb-4 w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <transition name="fade" mode="out-in">
        <span :key="buttonPlaceholder">{{ buttonPlaceholder }} {{ submitEmote }}</span>
      </transition>
    </button>

      </form>
    </template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import axiosClient from '../../axios'
import CityAutocomplete from './ProfileComponents/CityAutocomplete.vue'

const form = reactive({})
const originalData = reactive({})
const submitEmote = ref('')
const buttonPlaceholder = ref('Submit')


form.latitude = ''
form.longitude = ''

const fields = [
  { name: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Short bio about you' },
  { name: 'birth_date', label: 'Born date', type: 'date', placeholder: '' },
  {
    name: 'gender',
    label: 'Gender',
    type: 'radio',
    options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
    ],
  },
  { name: 'location', label: 'Location', type: 'text', placeholder: 'Your location' },
  { name: 'interested_in', label: 'Interested In', type: 'text', placeholder: 'Who you are interested in' },
  {
    name: 'relationship_type',
    label: 'Relationship Type',
    type: 'radio',
    options: [
      { label: 'Single', value: 'single' },
      { label: 'In a relationship', value: 'in_relationship' },
      { label: "Don't want to tell", value: 'dont_want_to_tell' },
      { label: "It's complicated", value: 'complicated' },
    ],
  },  { name: 'height', label: 'Height', type: 'number', placeholder: 'Your height in cm' },
  { name: 'education', label: 'Education', type: 'text', placeholder: 'Your education' },
  { name: 'job_title', label: 'Job Title', type: 'text', placeholder: 'Your job title' },
  {
    name: 'smoking',
    label: 'Smoking',
    type: 'radio',
    options: [
      { label: 'yes', value: 'yes' },
      { label: 'no', value: 'no' },
      { label: 'neutral', value: 'neutral' },
      { label: 'hate', value: 'hate' },
    ],
  },
  {
    name: 'drinking',
    label: 'Drinking',
    type: 'radio',
    options: [
      { label: 'yes', value: 'yes' },
      { label: 'no', value: 'no' },
      { label: 'neutral', value: 'neutral' },
      { label: 'hate', value: 'hate' },
    ],
  },
  { name: 'pets', label: 'Pets', type: 'text', placeholder: 'Pets preferences' },
]

fields.forEach(field => {
  form[field.name] = ''
})

function onSelectedLocationCoords(coords) {
  form.latitude = coords.lat
  form.longitude = coords.lon
}




onMounted(() => {
  axiosClient.get('/api/profile').then((response) => {
    const profile = response.data.profile
    fields.forEach(field => {
      if (profile[field.name] !== undefined && profile[field.name] != null) {
        form[field.name] = profile[field.name] ?? ''
        originalData[field.name] = profile[field.name] ?? ''
      }
    })
  })
})

function submit() {
  submitEmote.value= ''
  buttonPlaceholder.value = 'Submitting'
  const changedFields = {}
  Object.keys(form).forEach(key => {
    if (form[key] !== originalData[key]) {
      changedFields[key] = form[key]
    }
  })
  console.log('Changed fields:', changedFields);

  axiosClient.patch('/api/profile', changedFields)
    .then(response => {
        submitEmote.value = '✔️'  
        buttonPlaceholder.value = 'Submitted'

        setTimeout(() => {
        submitEmote.value = ''  
        buttonPlaceholder.value = 'Submit'
        }, 3000);
    })
    .catch(error => {
      console.log('Chyba pri aktualizácii profilu:', error)
      buttonPlaceholder.value = 'Try again'

    })
  }
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

</style>