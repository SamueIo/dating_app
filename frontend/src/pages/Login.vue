<template>
        <!-- <GuestLayout> -->
        <h2 class=" text-center text-2xl/9 font-bold tracking-tight text-white">Log in to your account</h2>
        <div v-if="errorMessage" class="py-2 px-3 rounded text-white bg-red-500">{{ errorMessage }}</div>
 
        <form @submit.prevent="submit" class="space-y-5 mt-6 w-full">
        <div>
          <label for="email" class="block text-left text-sm font-medium text-fuchsia-200 mb-2">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            v-model = "data.email"
            autocomplete="username"
            class="w-full mb-4 rounded-md bg-white/20 text-white placeholder-fuchsia-100 px-4 py-2
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/30 transition duration-300"
          />
          <label for="password" class="block text-left text-sm font-medium text-fuchsia-200 mb-2">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            autocomplete="current-password"
            required
            v-model="data.password"
            class="w-full mb-4 rounded-md bg-white/20 text-white placeholder-fuchsia-100 px-4 py-2
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/30 transition duration-300"
          />
          <div class="relative flex flex-row justify-between">
            <button
              type="submit"
              class="w-44 px-4 py-2 bg-white/20 backdrop-blur-md text-white font-semibold rounded-lg
                     border border-white/30 shadow-md hover:bg-white/30 hover:shadow-lg
                     transition duration-200 flex-nowrap" 
            >
              Log in
            </button>
              <div v-if="loading"
                    class="absolute right-0 -top-4  ">
                <Spinner />
              </div>
          </div>
          <p class="mt-10 text-center text-sm text-fuchsia-200">
            Not a member?
            <router-link
              :to="{ name: 'SignUp' }"
              class="font-semibold text-base text-pink-300 hover:text-white transition-colors duration-200"
            >
              Sign up here
            </router-link>
          </p>

        </div>
      </form>

        <!-- </GuestLayout> -->
</template>

<script setup>
import axiosClient from '../axios';
// import GuestLayout from '../components/GuestLayout.vue';
import { ref } from 'vue';
import router from '../router';
import Spinner from '../ui/Spinner.vue';
import { resetAllStores } from '@/utils/resetStore';

const loading = ref(false)

const data= ref({
  email: '',
  password:'',
})

const errorMessage = ref('')


// async function submit() {  
//   loading.value = true
//   errorMessage.value = ''
//   axiosClient.get( '/sanctum/csrf-cookie')
//   .then(response => {
//     return axiosClient.post('/login', data.value)
//     .then(response =>{
//       router.push({ name:'Explore'})
      
//     })
//     .catch (error => {
//       if(error.response){
//         loading.value = false
//         console.log(error.response)
//         errorMessage.value= error.response.data.message || 'Uknown error'
//        console.log(errorMessage)

//       }else{
//         loading.value = false
//         errorMessage.value = 'Error on server side'
//       }
//     })
//   })
// }
async function submit() {  
  loading.value = true;
  errorMessage.value = '';
  resetAllStores();
  axiosClient.get('/sanctum/csrf-cookie')
    .then(response => {
      const loginUrl = axiosClient.defaults.baseURL + '/login';

      return axiosClient.post('/login', data.value)
        .then(response => {
          router.push({ name: 'Explore' });
        })
        .catch(error => {
          loading.value = false;
          if (error.response) {
            console.log('❌ ERROR RESPONSE', error.response);
            errorMessage.value = error.response.data.message || 'Unknown error';
          } else {
            errorMessage.value = 'Error on server side';
          }
        });
    });
}

</script>

