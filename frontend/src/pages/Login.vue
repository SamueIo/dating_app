<template>
  <!-- Login Form Component -->

  <!-- Page heading -->
  <h2 class="text-center text-2xl/9 font-bold tracking-tight text-white">
    Log in to your account
  </h2>

  <!-- Error message -->
  <div v-if="errorMessage" class="py-2 px-3 rounded text-white bg-red-500">
    {{ errorMessage }}
  </div>

  <!-- Login form -->
  <form @submit.prevent="submit" class="space-y-5 mt-6 w-full">

    <!-- Email input -->
    <div>
      <label for="email" class="block text-left text-sm font-medium text-fuchsia-200 mb-2">
        Email
      </label>
      <input
        type="email"
        id="email"
        required
        v-model="data.email"
        autocomplete="username"
        class="w-full mb-4 rounded-md bg-white/20 text-white placeholder-fuchsia-100 px-4 py-2
               focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/30 transition duration-300"
      />

      <!-- Password input -->
      <label for="password" class="block text-left text-sm font-medium text-fuchsia-200 mb-2">
        Password
      </label>
      <input
        type="password"
        id="password"
        required
        v-model="data.password"
        autocomplete="current-password"
        class="w-full mb-4 rounded-md bg-white/20 text-white placeholder-fuchsia-100 px-4 py-2
               focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/30 transition duration-300"
      />

      <!-- Submit button + loading spinner -->
      <div class="relative flex flex-row justify-between">
        <button
          type="submit"
          class="w-44 px-4 py-2 bg-white/20 backdrop-blur-md text-white font-semibold rounded-lg
                 border border-white/30 shadow-md hover:bg-white/30 hover:shadow-lg
                 transition duration-200 flex-nowrap"
        >
          Log in
        </button>

        <!-- Spinner appears when loading -->
        <div v-if="loading" class="absolute right-0 -top-4">
          <Spinner />
        </div>
      </div>

      <!-- Signup link -->
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

    <!-- Forgot password link -->
    <p class="text-left">
      <router-link
        :to="{ name: 'ForgotPassword' }"
        class="font-semibold text-xs text-pink-300 hover:text-white transition-colors duration-200"
      >
        Forgot password
      </router-link>
    </p>
  </form>
</template>

<script setup>
/**
 * LoginForm.vue
 * ---------------
 * Simple login form using Vue 3 + Composition API.
 * - Handles email/password input with v-model.
 * - Shows loading spinner during API call.
 * - Displays server-side error messages.
 * - Resets stores on login attempt.
 * - Uses axios for HTTP requests (with CSRF protection via Sanctum).
 */

import { ref } from 'vue';
import axiosClient from '../axios';
import router from '../router';
import Spinner from '../ui/Spinner.vue';
import { resetAllStores } from '@/utils/resetStore';

// Reactive variables
const loading = ref(false);
const errorMessage = ref('');
const data = ref({
  email: '',
  password: '',
});

// Submit login form
async function submit() {
  loading.value = true;
  errorMessage.value = '';

  // Reset all stores (optional, based on app logic)
  resetAllStores();

  // Get CSRF cookie for Laravel Sanctum
  axiosClient.get('/sanctum/csrf-cookie')
    .then(() => {
      // Post login data
      return axiosClient.post('/login', data.value)
        .then(() => {
          // Navigate to Explore page on success
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
