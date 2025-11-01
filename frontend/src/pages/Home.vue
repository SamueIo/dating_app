<template>
  <div class="flex flex-col !overflow-auto !min-h-screen !h-screen ">
    <!-- Main content -->
    <div class="flex flex-col md:flex-row">
      <!-- Left column -->
      <div class="md:w-1/2 flex justify-center items-center p-8 bg-purple-900">
        <GuestLayout>
          <div class="text-center">
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">
              Find Someone Who Truly Gets You
            </h1>
            <p class="text-lg md:text-xl text-gray-300 mb-8 max-w-sm mx-auto">
              Join our community and start meaningful connections today.
            </p>
            <div class="flex justify-center gap-2">
              <router-link
                :to="{ name: 'Login' }"
                class="bg-white text-purple-700 font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition"
              >
                Log in
              </router-link>
              <router-link
                :to="{ name: 'SignUp' }"
                class="bg-white text-purple-700 font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition"
              >
                Sign up
              </router-link>
            </div>
          </div>
        </GuestLayout>
      </div>

      <!-- Right column -->
      <div class="md:w-1/2 flex flex-col justify-center items-center bg-gradient-to-br from-pink-500 via-purple-700 to-indigo-900 relative overflow-auto">
        <CirclesDesign/>

        <!-- Heart chat group -->
        <div class="absolute top-16 right-40 flex flex-col items-end space-y-1 z-10">
          <div class="text-4xl mb-1">❤️</div>
          <div class="bg-white text-black text-sm px-3 py-2 rounded-lg shadow-lg max-w-fit animate-fade-in delay-200">
            "Hey, love your smile 😍"
          </div>
          <div class="bg-pink-100 text-black text-sm px-3 py-2 rounded-lg shadow-lg max-w-fit self-start animate-fade-in delay-400">
            "Thanks! You're not so bad yourself 😉"
          </div>
        </div>

        <!-- Chat emoji group -->
        <div class="absolute bottom-32 left-10 flex flex-col items-start space-y-1 z-10">
          <div class="text-3xl mb-1">💬</div>
          <div class="bg-white text-black text-sm px-3 py-2 rounded-lg shadow-lg max-w-fit animate-fade-in delay-600">
            "Wanna grab a coffee sometime? ☕"
          </div>
          <div class="bg-blue-100 text-black text-sm px-3 py-2 rounded-lg shadow-lg max-w-fit animate-fade-in delay-900">
            "Sure, I know a cute café nearby 😏"
          </div>
        </div>

        <!-- Star chat group -->
        <div class="absolute top-1/2 right-1/3 flex flex-col items-end space-y-1 z-10">
          <div class="text-2xl mb-1">⭐</div>
          <div class="bg-white text-black text-sm px-3 py-2 rounded-lg shadow-lg max-w-fit animate-fade-in delay-1200">
            "You have an amazing sense of humor 😂"
          </div>
          <div class="bg-yellow-100 text-black text-sm px-3 py-2 rounded-lg shadow-lg max-w-fit self-start animate-fade-in delay-1500">
            "Glad you noticed 😘"
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-auto relative z-20 bg-black/50 text-gray-300">
      <Footer/>
    </footer>
  </div>
</template>




<script setup>
import GuestLayout from '../components/layouts/GuestLayout.vue';
import CirclesDesign from '@/ui/CirclesDesign.vue';
import Footer from './Footer.vue';
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.6s ease forwards;
}
</style>
