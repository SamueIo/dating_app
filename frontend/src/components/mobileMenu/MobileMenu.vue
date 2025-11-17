<template>
  <div class="md:hidden fixed top-2 left-2 z-50">
    <div class="relative">
      <button v-if="props.showDropdownButton" @click="toggleMobileMenu"
              class="p-2 bg-white/60 shadow-md rounded-md"
              aria-label="Open menu">
        ☰
      </button>

      <div v-if="isMobileMenuOpen"
           class="absolute left-0 mt-2 w-auto min-w-[180px]  bg-white/60 backdrop-blur-sm text-black shadow-lg rounded-md z-50">
        <ul class="flex flex-col">
          <li>
            <button @click="handleOpenSidebar"
                    class="w-full text-left px-4 py-2 hover:bg-gray-100 whitespace-nowrap">
              {{ navName }}
            </button>
          </li>
          <li>
            <UserAvatarMenu :openFromList="true" />
          </li>

        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import UserAvatarMenu from '../profile/ProfileComponents/UserAvatarMenu.vue';
import { useToggleMobileMenuStore } from '@/store/ToggleMobileMenuStore';


const props = defineProps({
    showDropdownButton:{ type: Boolean, default: true},
    navName: {
      type: String,
      default: '' 
    }
});

const emit = defineEmits(['open-sidebar']); // <- tu definujeme emit

const toggleMobileMenuStore = useToggleMobileMenuStore();


const isMobileMenuOpen = computed(() => toggleMobileMenuStore.isMobileMenuOpen);

function toggleMobileMenu() {
  toggleMobileMenuStore.toggleMobileMenu();
}

function handleOpenSidebar() {

  emit('open-sidebar'); // emitujeme udalosť rodičovi
}

</script>


