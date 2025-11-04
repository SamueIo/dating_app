<template>
    <!-- <GuestLayout> -->
        <h2 class=" text-center text-2xl/9 font-bold tracking-tight text-white">Create new account</h2>
        <div v-if="errorMessage" class="py-2 px-3 rounded text-white bg-red-500">{{ errorMessage }}</div>
        <form @submit.prevent="submit" class="space-y-5 mt-6 w-full">
        <div>
          <label for="name" class="block text-left text-sm font-medium text-fuchsia-200 mb-2">Nickname</label>
          <input
            name="name"
            id="name"
            v-model="data.name"
            class="w-full mb-4 rounded-md bg-white/20 text-white placeholder-fuchsia-100 px-4 py-2
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/30 transition duration-300"
          />
          <p v-if="errors.name && errors.name.length" class="text-red-300 drop-shadow-md text-sm">{{ errors.name[0] }}</p>
          <label for="email" class="block text-left text-sm font-medium text-fuchsia-200 mb-2">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            v-model="data.email"
            autocomplete="username"
            class="w-full mb-4 rounded-md bg-white/20 text-white placeholder-fuchsia-100 px-4 py-2
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/30 transition duration-300"
          />
          <p v-if="errors.email && errors.email.length" class="text-red-300 drop-shadow-md text-sm">{{ errors.email[0] }}</p>
          <label for="password" class="block text-left text-sm font-medium text-fuchsia-200 mb-2">Password</label>
          <input
            type="password"
            name="password"
            autocomplete="current-password"
            id="password"
            v-model="data.password"
            class="w-full mb-4 rounded-md bg-white/20 text-white placeholder-fuchsia-100 px-4 py-2
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/30 transition duration-300"
          />
          <p v-if="errors.password && errors.password.length"  class="text-red-300 drop-shadow-md text-sm">{{ errors.password[0] }}</p>
          <label for="password_confirmation" class="block text-left text-sm font-medium text-fuchsia-200 mb-2">Repeat password</label>
          <input
            type="password"
            name="password"
            id="password_confirmation"
            v-model="data.password_confirmation"
            autocomplete="new-password"
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
              Create an account
            </button>
            
              <div v-if="loading"
                    class="absolute right-0 -top-4  ">
                <Spinner />
              </div>
          </div>
          <p class="mt-10 text-center text-sm text-fuchsia-200">
            Already registered?
            <router-link
              :to="{ name: 'Login' }"
              class="font-semibold text-base text-pink-300 hover:text-white transition-colors duration-200"
            >
              Login here
            </router-link>
          </p>

        </div>
      </form>
    <!-- </GuestLayout> -->
</template>

<script setup>
    import axiosClient from '../axios';
    import Spinner from '../ui/Spinner.vue';
    import { ref } from 'vue';
    import router from '../router';

    const errorMessage = ref('');
    const loading = ref(false)

    const data = ref({
      name:'',
      email:'',
      password: '',
      password_confirmation: '', 
    })

    const errors = ref({
      name: [],
      email: [],
      password: [],
    })

    // post("/register") because its from laravel auth.php not frontend SignUp.vue
    function submit (){
      loading.value = true
      errorMessage.value = '';
      errors.value = {
      name: [],
      email: [],
      password: [],
    }
      axiosClient.get('/sanctum/csrf-cookie',{withCredentials: true})
      .then(response => {
        return axiosClient.post("/register", data.value, {withCredentials: true})
        .then(response => {
          router.push({name:'Explore'})
        })
        .catch(error => {
          if(error.response?.data?.errors) {
            loading.value= false
            errors.value=(error.response.data.errors)

          }
          
        })
});
    }
</script>

<style lang="scss" scoped>

</style>