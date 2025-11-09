<template>
  <!-- === CHAT WINDOW CONTAINER === -->
  <div
    class="flex flex-col px-2 pb-4 max-w-full border border-white/30 rounded shadow chat-container"
    :style="{ height: windowHeight + 'px' }"
  >
    <!-- === CHAT HEADER === -->
    <div class="flex items-center p-1 md:p-2 space-x-3 w-full">
      <!-- Receiver’s profile picture -->
      <img
        v-if="mainPhotoOfReceiver"
        :src="`${API_BASE_URL}/storage/${mainPhotoOfReceiver}`"
        alt="User photo"
        class="w-13 h-13 rounded-full object-cover border-2 border-purple-500 shadow"
      />

      <!-- User activity indicator (status, last seen, etc.) -->
      <UserActivitiesList :conversationId="props.conversationData.id" />

      <!-- Close chat button -->
      <button
        @click="handleCloseChat"
        class="ml-auto px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white shadow-lg hover:brightness-110 transition"
      >
        👋 Back
      </button>
    </div>

    <!-- === MESSAGES LIST === -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto border border-white/20 p-2 flex flex-col space-y-2 mb-4 hide-scrollbar"
    >
      <!-- Loading state -->
      <div v-if="loading && !loadedMessages" class="flex-1 flex flex-col justify-end items-center text-gray-500">
        <span class="text-sm">Loading...</span>
      </div>

      <!-- Empty conversation -->
      <div v-else-if="!loading && groupedMessages.length === 0" class="flex-1 flex flex-col justify-end items-center text-gray-500">
        <span class="text-sm">Write your first message</span>
      </div>

      <!-- Render grouped messages -->
      <template v-else v-for="(item, index) in groupedMessages" :key="index">
        <!-- Date separator -->
        <div v-if="item.type === 'date'" class="flex justify-center my-2">
          <span class="px-3 py-1 text-xs text-white/80 bg-white/10 rounded-full shadow">
            {{ formatDate(item.date) }}
          </span>
        </div>

        <!-- Single message -->
        <div
          v-else-if="item.type === 'message'"
          :class="[
            'rounded-lg px-1 max-w-[65%] mb-0.5',
            item.data.user_id === loggedUserId
              ? 'message-sent ml-auto text-right'
              : 'message-received mr-auto text-left'
          ]"
        >
          <!-- Message text -->
          <div v-if="item.data.body" class="break-words whitespace-pre-wrap">
            {{ item.data.body }}
          </div>

          <!-- Message attachments (images, videos, audio, files) -->
          <div v-if="item.data.attachments && item.data.attachments.length" class="mt-2">
            <!-- Multiple image attachments in grid -->
            <template v-if="item.data.attachments.length > 1">
              <div
                class="grid gap-1"
                :class="{
                  'grid-cols-1': item.data.attachments.length === 1,
                  'grid-cols-2': item.data.attachments.length === 2,
                  'grid-cols-3': item.data.attachments.length >= 3
                }"
                :style="{
                  'justify-items': item.data.user_id == loggedUserId ? 'end' : 'start'
                }"
              >
                <template v-for="(attachment, index) in item.data.attachments" :key="index">
                  <img
                    v-if="attachment.type === 'image'"
                    :src="`${API_BASE_URL}/storage/${attachment.url}`"
                    alt="Image attachment"
                    class="rounded cursor-pointer hover:opacity-80 h-30 w-30 object-cover"
                    @click="openImageViewer(item.data.attachments, index)"
                  />
                </template>
              </div>
            </template>

            <!-- Single attachment display -->
            <template v-else>
              <template v-for="(attachment, index) in item.data.attachments" :key="index">
                <img
                  v-if="attachment.type === 'image'"
                  :src="`${API_BASE_URL}/storage/${attachment.url}`"
                  alt="Image attachment"
                  class="max-w-full rounded max-h-[450px]"
                  @click="openImageViewer(item.data.attachments, index)"
                />
                <video
                  v-else-if="attachment.type === 'video'"
                  controls
                  class="max-w-full rounded"
                >
                  <source :src="`${API_BASE_URL}/storage/${attachment.url}`" :type="attachment.mime_type" />
                </video>
                <audio
                  v-else-if="attachment.type === 'audio'"
                  controls
                  class="w-full"
                >
                  <source :src="`${API_BASE_URL}/storage/${attachment.url}`" :type="attachment.mime_type" />
                </audio>
                <a
                  v-else
                  :href="`/storage/${attachment.url}`"
                  target="_blank"
                  class="underline text-sm"
                >
                  Download file
                </a>
              </template>
            </template>
          </div>

          <!-- Message timestamp and seen status -->
          <div
            class="flex space-x-1 text-xs mt-1"
            :class="item.data.user_id.toString() === loggedUserId.toString() ? 'justify-end' : 'justify-start'"
          >
            <span class="text-xs italic text-white/50 font-mono">
              {{ formatTime(item.data.created_at) }}
            </span>
            <CheckIcon
              v-if="item.data.seen && item.data.user_id === loggedUserId"
              class="w-4 h-4 text-black"
              title="Seen"
            />
          </div>
        </div>
      </template>
    </div>

    <!-- === CHAT INPUT COMPONENT === -->
    <ChatInput :conversationId="props.conversationData.id" @send="onSubmit" />
  </div>

  <!-- === IMAGE VIEWER MODAL === -->
  <PhotoModal
    v-if="isPhotoModalOpen"
    :images="currentAttachments"
    :startIndex="currentImageIndex"
    @close="isPhotoModalOpen = false"
  />
</template>

<script setup>
/**
 * ChatWindow.vue
 * ------------------------
 * Full chat view for a single conversation.
 * Handles:
 * - Displaying messages and their attachments.
 * - Grouping messages by date.
 * - Automatic scroll to the newest message.
 * - Viewing images in a modal.
 * - Sending new messages.
 * - Listening for real-time message updates via Laravel Reverb.
 */

import { defineProps, defineEmits, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useChatMessages } from '../../composable/useChatMessages'
import { useMessagesStore } from '../../store/messages'
import { useConversationStore } from '../../store/conversationsAndLastMessage'
import useUserStore from '../../store/user'
import { useActiveConversationStore } from '../../store/useActiveConversationStore'
import { useSendMessage } from '../../composable/useSendMessage'
import axiosClient from '../../axios'
import ChatInput from './ChatInput.vue'
import { CheckIcon } from '@heroicons/vue/24/solid'
import UserActivitiesList from '../userActivity/UserActivitiesList.vue'
import PhotoModal from '../modals/PhotoModal.vue'
import { API_BASE_URL } from '@/utils/constants'

/* ------------------ PROPS & EMITS ------------------ */
const props = defineProps({
  conversationData: {
    type: Object,
    required: true
  }
})
const emits = defineEmits(['close'])

/* ------------------ STORES ------------------ */
const MessagesStore = useMessagesStore()
const conversationStore = useConversationStore()
const userStore = useUserStore()
const ActiveConversationStore = useActiveConversationStore()

/* ------------------ STATE ------------------ */
const currentAttachments = ref([])    // Currently viewed image set in modal
const isPhotoModalOpen = ref(false)   // Controls image modal visibility
const currentImageIndex = ref(0)      // Index of current image in viewer
const loggedUserId = ref(userStore.user.id) // ID of the logged-in user
const windowHeight = ref(window.innerHeight) // Dynamic chat container height

/* ------------------ COMPUTED ------------------ */
const groupedMessages = computed(() => groupMessagesByDate(messages.value))
const loadedMessages = computed(() => groupedMessages.value.length > 0)
const mainPhotoOfReceiver = computed(() =>
  props.conversationData.other_user?.main_photo?.file_name || null
)
const allImages = computed(() =>
  groupedMessages.value
    .filter(item => item.type === 'message' && item.data.attachments?.length)
    .flatMap(item => item.data.attachments.filter(a => a.type === 'image'))
)

/* ------------------ COMPOSABLES ------------------ */
// Handles fetching, scrolling, and real-time message updates
const windowEcho = window.Echo
const { messages, messagesContainer, scrollToBottom, loading } = useChatMessages(
  props,
  MessagesStore,
  conversationStore,
  userStore,
  axiosClient,
  windowEcho
)

// Handles sending messages and attachments
const { sendLoading, error, handleSendMessage } = useSendMessage(
  MessagesStore,
  conversationStore,
  axiosClient,
  loggedUserId,
  scrollToBottom
)

/* ------------------ FUNCTIONS ------------------ */

/**
 * Groups messages by their date for display.
 * @param {Array} messages - List of messages in the conversation.
 * @returns {Array} List of message/date group objects.
 */
function groupMessagesByDate(messages) {
  const grouped = []
  let lastDate = null

  messages.forEach(msg => {
    const msgDate = new Date(msg.created_at).toDateString()

    if (msgDate !== lastDate) {
      grouped.push({ type: 'date', date: msgDate })
      lastDate = msgDate
    }

    grouped.push({ type: 'message', data: msg })
  })

  return grouped
}

/**
 * Opens the photo viewer modal for a clicked image.
 * @param {Array} attachments - Array of image attachments in the message.
 * @param {number} index - Index of the selected image.
 */
function openImageViewer(attachments, index) {
  const img = attachments[index]
  const globalIndex = allImages.value.findIndex(a => a.url === img.url)

  currentAttachments.value = allImages.value
  currentImageIndex.value = globalIndex
  isPhotoModalOpen.value = true
}

/**
 * Handles the Escape key for closing the image modal.
 */
function handleEsc(e) {
  if (e.key === 'Escape' && isPhotoModalOpen.value) {
    isPhotoModalOpen.value = false
  }
}

/**
 * Sends a new chat message to the server.
 * @param {FormData} formData - Form data containing message body and attachments.
 */
function onSubmit(formData) {
  handleSendMessage(formData, props.conversationData.id)
}

/**
 * Handles closing of the current chat.
 * Clears the active conversation from the store and emits "close".
 */
function handleCloseChat() {
  if (ActiveConversationStore.activeConversationID)
    ActiveConversationStore.clearActiveConversation()
  emits('close')
}

/**
 * Formats a message timestamp to display time only.
 * @param {string} dateString - ISO date string.
 * @returns {string} Formatted time.
 */
function formatTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/**
 * Formats message date for date separators.
 * @param {string} dateString - Date to format.
 * @returns {string} Readable formatted date.
 */
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Updates the chat window height dynamically on window resize.
 */
function updateHeight() {
  windowHeight.value = window.innerHeight
}

/* ------------------ LIFECYCLE ------------------ */
onMounted(() => {
  window.addEventListener('resize', updateHeight)
  window.addEventListener('keydown', handleEsc)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeight)
  window.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
/* === CHAT CONTAINER BACKGROUND === */
.chat-container {
  position: relative;
  background: linear-gradient(
      to bottom right,
      rgb(120, 15, 70),
      rgb(90, 10, 110),
      rgb(20, 18, 80)
    ),
    url('https://www.transparenttextures.com/patterns/soft-wallpaper.png');
  background-blend-mode: overlay;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  color: #fff;
}

/* === MESSAGE STYLES === */
.message-sent {
  background: linear-gradient(145deg, #7f3fbf 0%, #7c3cbf 100%);
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.message-received {
  background: linear-gradient(145deg, #71647f 0%, #726380 100%);
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* Optional animated background effect */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
