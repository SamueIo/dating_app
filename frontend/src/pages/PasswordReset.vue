<template>
  <!-- Main container -->
  <!-- <GuestLayout> --> <!-- Uncomment if using a layout wrapper -->
    <h2 class="text-center text-2xl/9 font-bold tracking-tight text-white">
      Create new account
    </h2>
    
    <!-- Display error or success messages -->
    <div v-if="errorMessage" class="py-2 px-3 rounded text-white bg-red-500">
      {{ errorMessage }}
    </div>
    <div v-if="submitMessage" class="py-2 px-3 rounded text-white bg-green-500">
      {{ submitMessage }}
    </div>

    <!-- Reset password form -->
    <form @submit.prevent="submit" class="space-y-5 mt-6 w-full">
      <div>

        <!-- Hidden email input to satisfy Google's autofill -->
        <input type="email" name="email" autocomplete="username" v-model="data.email" style="display:none" />

        <!-- Email errors -->
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
        <!-- Password errors -->
        <p v-if="errors.password && errors.password.length" class="text-red-300 drop-shadow-md text-sm">
          {{ errors.password[0] }}
        </p>

        <!-- Password confirmation input -->
        <label for="password_confirmation" class="block text-left text-sm font-medium text-fuchsia-200 mb-2">
          Repeat password
        </label>
        <input
          type="password"
          name="password_confirmation"
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
            Reset Password
          </button>

          <!-- Loading spinner while submitting -->
          <div v-if="loading" class="absolute right-0 -top-4">
            <Spinner />
          </div>
        </div>

        <!-- Link to login page -->
        <p class="mt-10 text-center text-sm text-fuchsia-200">
          Back to login page
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

/* Reactive state variables */
const errorMessage = ref('');           // Stores error messages from API
const submitMessage = ref('');          // Stores success message
const loading = ref(false);             // Loading state for form submission

/* Vue Router route */
const route = useRoute();

/* Form data */
const data = ref({
  token: '',                   // Token from password reset email link
  email: '',                   // User email
  password: '',                // New password
  password_confirmation: ''    // Password confirmation
});

/* Validation errors */
const errors = ref({
  password: [],                // Password field errors
  email: []                    // Email field errors
});

/* Submit form to reset password */
async function submit() {
  loading.value = true;
  errorMessage.value = '';
  submitMessage.value = '';
  errors.value = { password: [], email: [] };

  try {
    // Get CSRF cookie for Laravel Sanctum
    await axiosClient.get('/sanctum/csrf-cookie', { withCredentials: true });

    // Submit password reset request
    await axiosClient.post('/reset-password', data.value, { withCredentials: true });

    submitMessage.value = 'Password successfully changed';
  } catch (error) {
    // Handle validation errors
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = error.response?.data?.message || 'Unknown error';
    }
  } finally {
    loading.value = false;
  }
}

/* Set token and email from route params/query on mount */
onMounted(() => {
  data.value.token = route.params.token || '';
  data.value.email = route.query.email || '';
});
</script>

<style lang="scss" scoped>
/* Add any custom styles here */
</style>
