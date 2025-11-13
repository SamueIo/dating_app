<template>
  <!-- Main container for the landing page -->
  <div class="flex flex-col overflow-y-auto">
    
    <!-- Main content area (split into left and right columns on desktop) -->
    <div class="flex md:flex-row flex-col flex-grow min-h-screen">

      <!-- LEFT COLUMN: Marketing / Hero Box -->
      <div 
        :class="[
          'md:w-1/2 w-full flex justify-center items-center p-8 bg-purple-900 relative overflow-hidden',
          boxState === 'center' ? 'h-screen' : ''
        ]"
      >
        <!-- Decorative circles -->
        <CirclesDesign />

        <!-- Hero box -->
        <div 
          :class="[
            'flex p-4 rounded-2xl bg-white/10 backdrop-blur-md shadow-2xl transition-all duration-500 w-full',
            boxState === 'center'
              ? 'flex-col justify-center items-center max-w-md md:max-w-lg animate-fade-in-center'
              : 'flex-col md:flex-row md:justify-between items-center animate-top-bar max-w-full'
          ]"
        >
          <!-- Heading -->
          <h1
            class="text-2xl md:text-4xl font-bold text-white leading-none transition-all duration-500 md:mb-0 md:mr-4 text-center md:text-left whitespace-nowrap"
            :class="boxState === 'top' ? 'text-xl md:text-3xl' : 'mb-4'"
          >
            Find Your Heart
          </h1>

          <!-- Subtext (visible only in center state) -->
          <p
            v-if="boxState === 'center'"
            class="text-lg md:text-xl text-gray-300 mb-8 max-w-sm mx-auto text-center transition-all duration-500"
          >
            Join our community and start meaningful connections today.
          </p>

          <!-- Buttons -->
          <div v-if="boxState === 'center' && isMobile" class="line-container">
            <div class="animated-line"></div>
          </div>
          <div v-else class="flex gap-2 flex-wrap md:flex-nowrap justify-center md:justify-end md:w-auto">
            <router-link
              :to="{ name: 'Login' }"
              class="bg-white text-purple-700 font-semibold rounded-full shadow-lg transform hover:scale-105 transition
                     py-2 px-4 text-sm sm:py-2 sm:px-5 sm:text-base md:py-3 md:px-6 md:text-lg whitespace-nowrap"
            >
              Log in
            </router-link>
            <router-link
              :to="{ name: 'SignUp' }"
              class="bg-white text-purple-700 font-semibold rounded-full shadow-lg transform hover:scale-105 transition
                     py-2 px-4 text-sm sm:py-2 sm:px-5 sm:text-base md:py-3 md:px-6 md:text-lg whitespace-nowrap"
            >
              Sign up
            </router-link>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Chat visualizations -->
      <div
        class="md:w-1/2 w-full h-screen md:flex flex-col justify-center items-center bg-gradient-to-br from-pink-500 via-purple-700 to-indigo-900 relative"
      >
        <CirclesDesign />

        <!-- Chat bubbles wrapper -->
        <div class="flex flex-col justify-between h-[80%] w-full px-4 md:px-0">
          
          <!-- ❤️ Top Heart Chat -->
          <div class="flex flex-col items-end space-y-1 md:absolute md:top-10 md:right-[8%]">
            <div class="text-3xl sm:text-4xl mb-1">❤️</div>
            <div class="bg-white text-black text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-lg max-w-[70%] animate-fade-in delay-200">
              "Hey, love your smile 😍"
            </div>
            <div class="bg-pink-100 text-black text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-lg max-w-[70%] self-end animate-fade-in delay-400">
              "Thanks! You're not so bad yourself 😉"
            </div>
          </div>

          <!-- 💬 Center Chat -->
          <div class="flex flex-col items-start space-y-1 md:absolute md:top-1/2 md:left-[8%] md:transform md:-translate-y-1/2">
            <div class="text-2xl sm:text-3xl mb-1">💬</div>
            <div class="bg-white text-black text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-lg max-w-[100%] animate-fade-in delay-600">
              "Wanna grab a coffee sometime? ☕"
            </div>
            <div class="bg-blue-100 text-black text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-lg max-w-[70%] animate-fade-in delay-900">
              "Sure, I know a cute café nearby 😏"
            </div>
          </div>

          <!-- ⭐ Bottom Star Chat -->
          <div class="flex flex-col items-end space-y-1 md:absolute md:bottom-10 md:right-[20%]">
            <div class="text-xl sm:text-2xl mb-1">⭐</div>
            <div class="bg-white text-black text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-lg max-w-[70%] animate-fade-in delay-1200">
              "You have an amazing sense of humor 😂"
            </div>
            <div class="bg-yellow-100 text-black text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-lg max-w-[70%] self-end animate-fade-in delay-1500">
              "Glad you noticed 😘"
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- FOOTER -->
    <footer class="bg-black/50 text-gray-300">
      <Footer />
    </footer>
  </div>
</template>

<script setup>
/**
 * Animated landing page with left box and right chat visuals.
 * Handles responsive layout, mobile animation delays, and state transitions.
 */

import { ref, onMounted, onUnmounted } from 'vue';
import CirclesDesign from '@/ui/CirclesDesign.vue';
import Footer from './Footer.vue';

// State for  box position: 'center' or 'top'
const boxState = ref('center');

// Detect mobile viewport
const isMobile = ref(false);

// Handle window resize (desktop auto moves box to top)
const handleResize = () => {
  if (window.innerWidth >= 768) {
    boxState.value = 'top';
  }
};

// Lifecycle hooks
onMounted(() => {
  document.body.classList.remove('main-container');

  // Mobile initial delay for top-bar animation
  if (window.innerWidth < 768) {
    isMobile.value = true;
    setTimeout(() => {
      boxState.value = 'top';
    }, 4000);
  }

  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  document.body.classList.add('main-container');
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
/* Fade in animations */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in-center {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in { animation: fade-in 0.6s ease forwards; }
.animate-fade-in-center { animation: fade-in-center 0.8s ease forwards; transform: translateY(0); }

/* Move hero box to top */
.animate-move-to-top { animation: move-to-top 0.5s ease forwards; }
@keyframes move-to-top { from { transform: translateY(50%); } to { transform: translateY(-50%); } }

/* Top bar animation */
.animate-top-bar {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

/* Animated line for mobile delay */
.line-container { display: flex; justify-content: center; margin: 20px 0; width: 100%; max-width: 300px; }
.animated-line { display: block; width: 100%; max-width: 300px; height: 4px; background-color: yellow; animation: shrinkLine 4s forwards; }
@keyframes shrinkLine { from { width: 100%; opacity: 1; } to { width: 0; opacity: 0.5; } }
</style>
