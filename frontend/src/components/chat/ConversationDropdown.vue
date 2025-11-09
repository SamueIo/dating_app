<template>
  <!-- === CONVERSATION LIST (WITH TRANSITION) === -->
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-200 ease-in"
    enter-from-class="max-h-0 opacity-0 overflow-hidden"
    enter-to-class="max-h-96 opacity-100"
    leave-from-class="max-h-96 opacity-100"
    leave-to-class="max-h-0 opacity-0 overflow-hidden"
  >
    <!-- Show list only when 'show' is true -->
    <div
      v-if="show"
      class="flex flex-col space-y-2 overflow-hidden max-h-96 backdrop-blur-2xl rounded shadow-md p-2"
    >
      <!-- === INDIVIDUAL CONVERSATION ITEM === -->
      <div
        v-for="item in conversations"
        :key="item.id"
        class="flex items-center gap-3 p-2 bg-gray-300 rounded cursor-pointer hover:bg-pink-100 transition"
        @click="$emit('select', item)"
      >
        <!-- === USER PHOTO OR DEFAULT ICON === -->
        <div class="w-14 h-14 rounded-full flex items-center justify-center bg-pink-200">
          <template v-if="item.other_user?.main_photo?.file_name">
            <img
              :src="`${API_BASE_URL}/storage/${item.other_user.main_photo.file_name}`"
              alt="User photo"
              class="w-14 h-14 rounded-full object-cover"
            />
          </template>
          <template v-else>
            <span class="text-white text-xl">❤️</span>
          </template>
        </div>

        <!-- === CONVERSATION DETAILS === -->
        <div class="w-full">
          <!-- Receiver name -->
          <p class="font-semibold text-gray-800">
            {{ item.other_user.name }}
          </p>

          <!-- Last message -->
          <p
            :class="item.last_message?.seen && item.other_user.id
              ? 'font-semibold text-sm text-gray-500'
              : 'font-semibold text-sm text-white'"
          >
            {{ item.last_message?.body }}
          </p>

          <!-- Message time -->
          <p class="text-xs text-right text-gray-500">
            {{ formatTime(item.last_message?.created_at) }}
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
/**
 * ConversationList.vue
 * ---------------------------------------------
 * This component renders a list of chat conversations with transition effects.
 * Each conversation shows:
 *  - User profile picture (or a ❤️ icon if missing)
 *  - The other user's name
 *  - The last message content
 *  - The time of the last message
 * 
 * Props:
 *  - show (Boolean): controls whether the list is visible
 *  - conversations (Array): list of conversation objects
 * 
 * Emits:
 *  - select (Object): emits the selected conversation when clicked
 */

import { defineProps, defineEmits } from 'vue'
import { API_BASE_URL } from '@/utils/constants'

/* ------------------ PROPS ------------------ */
const props = defineProps({
  /**
   * Whether the conversation list should be visible
   */
  show: Boolean,

  /**
   * Array of conversation objects to display
   * Each item should contain:
   *  - id: conversation ID
   *  - other_user: user data (name, main_photo)
   *  - last_message: message object (body, created_at, seen)
   */
  conversations: Array
})

/* ------------------ EMITS ------------------ */
const emit = defineEmits(['select'])

/**
 * Formats a date string to a short time format (HH:MM)
 * Used for displaying the time of the last message.
 * 
 * @param {string} dateString - Date string of the message
 * @returns {string} Formatted time (e.g. "14:32")
 */
function formatTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
