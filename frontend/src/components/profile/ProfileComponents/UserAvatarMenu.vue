<template>
<!-- Profile photo w ith dropdown menu -->
<div class="relative " @click="toggleMenu">
    <div v-if="props.openFromList" class="flex items-center space-x-2 px-2 py-1 cursor-pointer hover:bg-pink-100 rounded-md">
      <span class="text-xl">👤</span> 
      <p>User menu</p>
    </div>
    <div v-else>
      <img
      :src="userStore.user?.main_photo 
        ? `${API_BASE_URL}/storage/${userStore.user.main_photo.file_name}` 
        : 'https://picsum.photos/100/100'"
      class="w-14 h-14 ml-auto justify-end rounded-full object-cover cursor-pointer"
      alt="Profile photo"
      />
    </div>

    <!-- Dropdown menu -->
    <div v-if="showMenu"
        class="absolute right-0 mt-1 w-40 bg-white/50 text-black rounded-md shadow-md backdrop-blur-sm z-10">
    
    <ManualToggleStatus/>  

    <RouterLink to="/profile"
    class="block w-full text-left px-4 py-2 hover:bg-pink-200 transition-colors duration-200">
    Settings
    </RouterLink>
    <button @click="logout"
            class="block w-full text-left px-4 py-2 hover:bg-pink-200 transition-colors duration-200">
        Log out
    </button>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import useUserStore from '../../../store/user';
import ManualToggleStatus from '../../chat/ManualToggleStatus.vue';
import axiosClient from '../../../axios';
import { useUserActivityStore } from '../../../store/userActivity';
import { RouterLink, useRouter } from 'vue-router';
import { API_BASE_URL } from '@/utils/constants';


const userStore = useUserStore();
const userActivityStore = useUserActivityStore();
const router = useRouter();

const showMenu = ref(false);

const props = defineProps({
  openFromList:Boolean, default: false
})
function toggleMenu(){
  showMenu.value = !showMenu.value  
}

function eraseAllCookies() {
  document.cookie.split(";").forEach(cookie => {
    const name = cookie.split("=")[0].trim();

    // Delete cookies for root
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;

    // Delete cookies for domain
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.${location.hostname}`;
  });
}

function logout() {
  console.log('logout first test');
  
  // userActivityStore.updateUserActivity(false);

  axiosClient.post('/logout')
    .then(() => {
      eraseAllCookies();
      console.log('pushing login page');
      router.push({ name: 'Login' });
    })
    .catch(error => {
      console.error('Logout error', error);
      eraseAllCookies();
      router.push({ name: 'Login' });
    });
}

</script>