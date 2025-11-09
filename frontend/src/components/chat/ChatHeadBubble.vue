<template>
  <!-- === CONVERSATION AVATAR COMPONENT === -->
  <div 
    @click="onClick"
    class="relative w-14 h-14 flex-shrink-0"
  >
    <!-- === USER PHOTO OR DEFAULT ICON === -->
    <div class="w-14 h-14 rounded-full flex items-center justify-center bg-pink-200">
      <template v-if="conversation.other_user?.main_photo?.file_name">
        <img
          :src="`${API_BASE_URL}/storage/${conversation.other_user.main_photo.file_name}`"
          alt="User photo"
          class="w-14 h-14 rounded-full object-cover"
        />
      </template>
      <template v-else>
        <span class="text-white text-xl">❤️</span>
      </template>
    </div>

    <!-- === LAST MESSAGE PREVIEW (BUBBLE) === -->
    <div
      v-if="showMessages && chatUIStore.showLastMessageBubbles[conversation.id] && conversation.last_message?.user_id !== loggedUserId"
      class="absolute right-16 top-1/2 -translate-y-1/2 bg-white/70 text-black shadow-md px-3 
             rounded-xl max-w-[240px] w-fit text-sm z-10 line-clamp-2"
    >
      <p class="break-words whitespace-normal leading-snug">
        {{ conversation.last_message.body || 'New message...' }}
      </p>
    </div>

    <!-- === UNREAD MESSAGE DOT === -->
    <span
      v-if="conversation.last_message && conversation.last_message?.user_id !== loggedUserId && conversation.last_message?.seen !== 1"
      class="absolute top-[-3px] right-[-3px] block w-3 h-3 bg-red-500 rounded-full border-2 border-white"
      title="New message"
    ></span>
  </div>
</template>

<script setup>
/**
 * ConversationAvatar.vue
 * ---------------------------------
 * This component displays:
 *  - The avatar (profile image) of the other conversation participant.
 *  - A small preview bubble of their latest message (if enabled).
 *  - A red notification dot for unread messages.
 * 
 * Emits:
 *  - 'select' → when the user clicks on the avatar, to open the conversation.
 */

import { useChatUIStore } from '@/store/chatUIStore'
import { API_BASE_URL } from '@/utils/constants'

/* ------------------ PROPS ------------------ */
const props = defineProps({
  /**
   * The conversation object containing:
   *  - other_user: object with user info and main_photo
   *  - last_message: last sent message object
   *  - id: conversation ID
   */
  conversation: Object,

  /**
   * ID of the currently logged-in user
   * Used to determine whether the last message is incoming or outgoing
   */
  loggedUserId: [Number, String],

  /**
   * Whether to show the last message preview bubble
   */
  showMessages: {
    type: Boolean,
    default: true
  }
})

/* ------------------ EMITS ------------------ */
const emit = defineEmits(['select'])

/* ------------------ STORES ------------------ */
const chatUIStore = useChatUIStore()

/* ------------------ METHODS ------------------ */
/**
 * Emits the "select" event when the avatar is clicked.
 * Used by parent components to open or focus a conversation.
 */
function onClick() {
  emit('select', props.conversation)
}
</script>
