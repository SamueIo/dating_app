<template>
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-200 ease-in"
    enter-from-class="max-h-0 opacity-0 overflow-hidden"
    enter-to-class="max-h-96 opacity-100"
    leave-from-class="max-h-96 opacity-100"
    leave-to-class="max-h-0 opacity-0 overflow-hidden"
  >
    <div v-if="show" class="flex flex-col space-y-2 overflow-hidden max-h-96 backdrop-blur-2xl rounded shadow-md p-2">
      <div
        v-for="item in conversations"
        :key="item.id"
        class="flex items-center gap-3 p-2 bg-gray-300 rounded cursor-pointer hover:bg-pink-100 transition"
        @click="$emit('select', item)"
      >
      <!-- Img or heart -->
        <div class="w-14 h-14 rounded-full flex items-center justify-center bg-pink-200">
          <template v-if="item.other_user?.main_photo?.file_name">
            <img
              :src="`${API_BASE_URL}/storage/${item.other_user.main_photo.file_name}`"
              alt="user photo"
              class="w-14 h-14 rounded-full object-cover"
            />
          </template>
          <template v-else>
            <span class="text-white text-xl">❤️</span>
          </template>
        </div>

        <div class="w-full">
          <p class="font-semibold text-gray-800">{{ item.other_user.name }}</p>
          <p
            :class="item.last_message?.seen && item.other_user.id
              ? 'font-semibold text-sm text-gray-500'
              : 'font-semibold text-sm text-white'"
          >
            {{ item.last_message?.body }}
          </p>          
          <p class="text-xs text-right text-gray-500">{{ formatTime(item.last_message?.created_at) }}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { API_BASE_URL } from '@/utils/constants';


const props = defineProps({
  show: Boolean,
  conversations: Array,
})

const emit = defineEmits(['select'])

function formatTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
