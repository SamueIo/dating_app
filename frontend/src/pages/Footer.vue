<template>
  <footer class="bg-purple-900 text-gray-300 py-8 mt-1">
    <div class="max-w-6xl mx-auto px-4 md:flex md:justify-between md:items-center">
      
      <!-- Logo / Branding -->
      <div class="mb-6 md:mb-0 text-center md:text-left">
        <h2 class="text-white text-2xl font-bold">Samuel Janech</h2>
        <p class="text-gray-400 mt-1 text-sm">Connecting hearts and minds 💖</p>
      </div>

      <!-- Footer Links -->
      <div class="flex flex-col sm:flex-row gap-6 justify-center md:justify-end text-sm">
        <router-link to="/" class="hover:text-white transition">Linkedin</router-link>
        <router-link to="/about" class="hover:text-white transition">Cv</router-link>
        <router-link to="/contact" class="hover:text-white transition">Contact</router-link>
        <router-link to="/privacy" class="hover:text-white transition">Porfolio</router-link>
      </div>
    </div>

    <!-- Bottom copyright -->
    <div class="mt-6 border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
      &copy; {{ new Date().getFullYear() }} Samuel Janech. All rights reserved.
    </div>
  </footer>
</template>

<script setup>
// Footer is static, no logic needed for now
</script>

<style scoped>
footer a {
  transition: color 0.3s;
}
</style>
