<template>
  <!-- Component for password recovery email submission -->
  <h2 class="text-center text-2xl/9 font-bold tracking-tight text-white">
    Type recovery email
  </h2>

  <!-- Error message display -->
  <div v-if="errorMessage" class="py-2 px-3 rounded text-white bg-red-500">
    {{ errorMessage }}
  </div>

  <!-- Success message display -->
  <div v-if="submitMessage" class="py-2 px-3 rounded text-white bg-green-500">
    {{ submitMessage }}
  </div>

  <!-- Form to submit recovery email -->
  <form @submit.prevent="submit" class="space-y-5 mt-6 w-full">
    <div>
      <label for="email" class="block text-left text-sm font-medium text-fuchsia-200 mb-2">
        Email
      </label>
      <input
        type="email"
        name="email"
        id="email"
        required
        v-model="data.email"
        autocomplete="username"
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
          Submit
        </button>

        <!-- Loading spinner -->
        <div v-if="loading" class="absolute right-0 -top-4">
          <Spinner />
        </div>
      </div>

      <!-- Link to Sign Up page -->
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
</template>

<script setup>
/**
 * Component for submitting a password recovery email.
 * Handles form input, displays loading state, success and error messages.
 */

import axiosClient from '../axios';
import { ref } from 'vue';
import Spinner from '../ui/Spinner.vue';
import { resetAllStores } from '@/utils/resetStore';

// Reactive state
const loading = ref(false);            // Loading spinner flag
const data = ref({ email: '' });       // Form input data
const errorMessage = ref('');          // Error message text
const submitMessage = ref('');         // Success message text

/**
 * submit()
 * -----------
 * Handles the submission of the password recovery form.
 * 1. Resets previous state.
 * 2. Calls CSRF cookie endpoint.
 * 3. Posts recovery email to backend.
 * 4. Updates success or error message.
 */
async function submit() {  
  loading.value = true;
  errorMessage.value = '';
  submitMessage.value = '';
  resetAllStores();

  axiosClient.get('/sanctum/csrf-cookie')
    .then(() => {
      return axiosClient.post('/forgot-password', data.value)
        .then(() => {
          // Set success message
          submitMessage.value = 'Link sent to email';
        })
        .catch(error => {
          // Handle error response
          if (error.response) {
            console.log('❌ ERROR RESPONSE', error.response);
            errorMessage.value = error.response.data.message || 'Unknown error';
          } else {
            errorMessage.value = 'Error on server side';
          }
        })
        .finally(() => {
          loading.value = false;
        });
    });
}
</script>
