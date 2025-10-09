<template>

    <form @submit.prevent="submit">
      <div v-for="field in fields" :key="field.name" class="mb-4">
        <label class="block text-white mb-2 font-semibold">
          {{ field.label }}
        </label>

        <!-- Ak je field typu 'radio', zobraz radio buttony -->
        <div v-if="field.type === 'radio'" class="flex gap-4">
          <label v-for="option in field.options" :key="option.value" class="flex items-center gap-1 text-white">
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

        <!-- Pre textarea -->
        <textarea
          v-else-if="field.type === 'textarea'"
          :id="field.name"
          v-model="form[field.name]"
          :placeholder="field.placeholder"
          rows="3"
          class="w-full rounded-md bg-gray-700 text-white border border-gray-500 focus:border-pink-500 focus:ring-pink-600 focus:ring-opacity-50 p-2"
        ></textarea>

        <!-- Inak input -->
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
        class="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 rounded-md transition"
      >
        Submit
      </button>
    </form>

</template>

<script setup>
import { reactive, onMounted } from 'vue';
import axiosClient from '../../axios';

const originalData = reactive([])
onMounted( ()=>{ axiosClient.get('/api/profile') 
        .then((response) => { 
                const data = response.data 
                const profile = data.profile
                fields.forEach(field => {
                  if(profile[field.name] !== undefined && profile[field.name] != null){
                    form[field.name] = profile[field.name] ?? ''
                    originalData[field.name] = profile[field.name] ??  ''
                   
                  }
                });
        }) 
})

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
  { name: 'relationship_type', label: 'Relationship Type', type: 'text', placeholder: 'Type of relationship' },
  { name: 'height', label: 'Height', type: 'number', placeholder: 'Your height in cm' },
  { name: 'education', label: 'Education', type: 'text', placeholder: 'Your education' },
  { name: 'job_title', label: 'Job Title', type: 'text', placeholder: 'Your job title' },
  { name: 'smoking', label: 'Smoking', type: 'radio',  
    options: [
      { label: 'yes', value: 'yes'},
      { label: 'no', value: 'no'},
      { label: 'neutral', value: 'neutral'},
      { label: 'hate', value: 'hate'},
    ]},
    { name: 'drinking', label: 'Drinking', type: 'radio',  
    options: [
      { label: 'yes', value: 'yes'},
      { label: 'no', value: 'no'},
      { label: 'neutral', value: 'neutral'},
      { label: 'hate', value: 'hate'},
    ]},
  { name: 'pets', label: 'Pets', type: 'text', placeholder: 'Pets preferences' },
];


function submit() {
  const changedFields = {};


  Object.keys(form).forEach(key => {
    if(form[key] !== originalData[key]){
      changedFields[key] = form[key];
    }
  })
  axiosClient.patch('/api/profile', changedFields)
  .then(response =>{
    console.log('Profil bol aktualizovany:', response.data)
  })
  .catch(error => {
    console.log('Chyba pri aktualizacii prpfilu', error)
  })
}
const form = reactive({});
fields.forEach(field => {
  form[field.name] = '';
});
</script>



