<template>
  <!-- Main container -->
  <!-- <GuestLayout> --> <!-- Uncomment if using a layout wrapper -->
    <h2 class="text-center text-2xl/9 font-bold tracking-tight text-white">
      Create new account
    </h2>
    
    <!-- Display error messages -->
    <div v-if="errorMessage" class="py-2 px-3 rounded text-white bg-red-500">
      {{ errorMessage }}
    </div>

    <!-- Registration form -->
    <form @submit.prevent="submit" class="space-y-5 mt-6 w-full">
      <div>
        <!-- Nickname / Username input -->
        <label for="name" class="block text-left text-sm font-medium text-fuchsia-200 mb-2">
          Nickname
        </label>
        <input
          name="name"
          id="name"
          v-model="data.name"
          class="w-full mb-4 rounded-md bg-white/20 text-white placeholder-fuchsia-100 px-4 py-2
                 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/30 transition duration-300"
        />
        <!-- Display name field errors -->
        <p v-if="errors.name && errors.name.length" class="text-red-300 drop-shadow-md text-sm">
          {{ errors.name[0] }}
        </p>

        <!-- Email input -->
        <label for="email" class="block text-left text-sm font-medium text-fuchsia-200 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          v-model="data.email"
          autocomplete="username"
          class="w-full mb-4 rounded-md bg-white/20 text-white placeholder-fuchsia-100 px-4 py-2
                 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/30 transition duration-300"
        />
        <!-- Display email field errors -->
        <p v-if="errors.email && errors.email.length" class="text-red-300 drop-shadow-md text-sm">
          {{ errors.email[0] }}
        </p>

        <!-- Password input -->
        <label for="password" class="block text-left text-sm font-medium text-fuchsia-200 mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          autocomplete="current-password"
          id="password"
          v-model="data.password"
          class="w-full mb-4 rounded-md bg-white/20 text-white placeholder-fuchsia-100 px-4 py-2
                 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/30 transition duration-300"
        />
        <!-- Display password field errors -->
        <p v-if="errors.password && errors.password.length" class="text-red-300 drop-shadow-md text-sm">
          {{ errors.password[0] }}
        </p>

        <!-- Password confirmation input -->
        <label for="password_confirmation" class="block text-left text-sm font-medium text-fuchsia-200 mb-2">
          Repeat password
        </label>
        <input
          type="password"
          name="password"
          id="password_confirmation"
          v-model="data.password_confirmation"
          autocomplete="new-password"
          class="w-full mb-4 rounded-md bg-white/20 text-white placeholder-fuchsia-100 px-4 py-2
                 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/30 transition duration-300"
        />

        <!-- Submit button + spinner -->
        <div class="relative flex flex-row justify-between">
          <button
            type="submit"
            class="w-44 px-4 py-2 bg-white/20 backdrop-blur-md text-white font-semibold rounded-lg
                   border border-white/30 shadow-md hover:bg-white/30 hover:shadow-lg
                   transition duration-200 flex-nowrap"
          >
            Create an account
          </button>

          <!-- Loading spinner while submitting -->
          <div v-if="loading" class="absolute right-0 -top-4">
            <Spinner />
          </div>
        </div>

        <!-- Link to login page -->
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
import axiosClient from '../axios'; // Axios instance
import Spinner from '../ui/Spinner.vue'; // Loading spinner
import router from '../router'; // Vue Router
import { ref } from 'vue';

/* Reactive state */
const errorMessage = ref(''); // Holds general error messages
const loading = ref(false);   // Loading state for form submission

/* Form data */
const data = ref({
  name: '',                     // User nickname
  email: '',                    // User email
  password: '',                 // User password
  password_confirmation: '',    // Password confirmation
})

/* Validation errors */
const errors = ref({
  name: [],
  email: [],
  password: [],
})

/**
 * Submit registration form
 * - Fetches CSRF cookie (Laravel Sanctum)
 * - Sends POST request to /register endpoint
 * - On success, redirects user to PublicProfileSettings page
 * - On error, shows validation or general errors
 */
function submit() {
  loading.value = true
  errorMessage.value = '';
  errors.value = { name: [], email: [], password: [] }

  // Get CSRF cookie
  axiosClient.get('/sanctum/csrf-cookie', { withCredentials: true })
    .then(() => {
      // Send registration request
      return axiosClient.post("/register", data.value, { withCredentials: true })
        .then(() => {
          router.push({ name: 'PublicProfileSettings' }) // Redirect on success
        })
        .catch(error => {
          loading.value = false

          // Handle validation errors
          if (error.response?.data?.errors) {
            errors.value = error.response.data.errors
            errorMessage.value = error.response.data.errors
          } else {
            console.error('Registration error', error)
            errorMessage.value = error
          }
        })
    })
}
</script>

<style lang="scss" scoped>
/* Add any custom styles here */
</style>
