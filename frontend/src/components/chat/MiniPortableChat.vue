<template>
  <div
    class="fixed z-50 flex flex-col bg-black/50 backdrop-blur-2xl p-2 rounded-lg md:static md:h-[400px] md:rounded-lg md:w-[320px] md:shadow"
    :style="{
      height: windowWidth < 768 ? `calc(${viewportHeight}px - 80px)` : '',
      bottom: windowWidth < 768 ? 'env(safe-area-inset-bottom, 10px)' : '',
      top: windowWidth < 768 ? '70px' : '',
      left: windowWidth < 768 ? '10px' : '',
      right: windowWidth < 768 ? '10px' : ''
    }"
  >
    <!-- Close button -->
    <button
      @click="handleCloseChat"
      class="absolute top-1 right-4 text-gray-600 hover:text-red-500 z-10 text-xl"
    >
      ✕
    </button>

    <!-- Chat header showing the other user's name -->
    <div
      class="px-4 text-2xl font-extrabold text-transparent bg-clip-text
             bg-gradient-to-r from-pink-400 via-purple-500 to-pink-600
             drop-shadow-lg select-none"
      style="letter-spacing: 0.05em;"
    >
      {{ props.conversationData.other_user.name }}
    </div>

    <!-- Messages container -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto break-words border border-white/20 p-1 
             flex flex-col space-y-1 mb-2 rounded hide-scrollbar"
    >
      <template v-for="(item, index) in groupedMessages" :key="index">
        <!-- Date separator between messages -->
        <div v-if="item.type === 'date'" class="flex justify-center my-2">
          <span class="px-3 py-1 text-xs text-white/80 bg-white/10 rounded-full shadow">
            {{ formatDate(item.date) }}
          </span>
        </div>

        <!-- Individual message -->
        <div
          v-else-if="item.type === 'message'"
          :class="[
            'px-3 py-1 text-sm max-w-[75%] break-words rounded-lg shadow-sm',
            item.data.user_id === loggedUserId
              ? 'bg-blue-600 text-white self-end rounded-br-none'
              : 'bg-purple-200 text-gray-900 self-start rounded-bl-none'
          ]"
          style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"
        >
          {{ item.data.body }}

          <!-- Timestamp and seen status -->
          <div :class="['flex text-xs items-center', item.data.user_id == loggedUserId ? 'justify-end' : 'justify-start']">
            <div v-if="item.data.seen && item.data.user_id === loggedUserId" class="flex items-center">
              <CheckIcon class="w-4 h-4 text-black" title="Seen" />
            </div>
            <div :class="item.data.user_id == loggedUserId ? '-mr-2' : '-ml-2'">
              {{ formatTime(item.data.created_at) }}
            </div>
          </div>

          <!-- Attachments: only images and downloadable files -->
          <div v-if="item.data.attachments && item.data.attachments.length" class="mt-2">
            <template v-for="(attachment, index) in item.data.attachments" :key="index">
              <img
                v-if="attachment.type === 'image'"
                :src="`${API_BASE_URL}/storage/${attachment.url}`"
                alt="Image attachment"
                class="rounded cursor-pointer hover:opacity-80 h-40 w-40 object-cover"
                @click="openImageViewer(item.data.attachments, index)"
              />
              <a
                v-else
                :href="`/storage/${attachment.url}`"
                target="_blank"
                class="underline text-sm"
              >
                Download file
              </a>
            </template>
          </div>
        </div>
      </template>
    </div>

    <!-- Chat input component -->
    <ChatInput
      :conversationId="props.conversationData.id"
      @send="onSubmit"
      class="w-full"
      style="padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 10px);"
    />
  </div>

  <!-- Photo preview modal -->
  <PhotoModal
    v-if="isPhotoModalOpen"
    :images="currentAttachments"
    :startIndex="currentImageIndex"
    @close="isPhotoModalOpen = false"
  />
</template>

<script setup>
/**
 * ChatPanel.vue
 * 
 * This component renders a chat panel for a conversation, including:
 * - A header with the other user's name
 * - Scrollable messages grouped by date
 * - Image attachments with preview modal
 * - Chat input for sending messages
 */

import ChatInput from './ChatInput.vue';
import { useMessagesStore } from '../../store/messages';
import { useConversationStore } from '../../store/conversationsAndLastMessage';
import useUserStore from '../../store/user';
import axiosClient from '../../axios';
import { ref, computed } from 'vue';
import { CheckIcon } from '@heroicons/vue/24/solid';
import { API_BASE_URL } from '@/utils/constants';

import PhotoModal from '../modals/PhotoModal.vue';

import { useSendMessage } from '../../composable/useSendMessage';
import { useChatMessages } from '../../composable/useChatMessages';
import { useViewport } from '@/composable/useViewport';
import { groupMessagesByDate } from '@/composable/useMessagesGrouping';
import { usePhotoViewer } from '@/composable/usePhotoViewer';

import { formatDate } from '@/utils/date';

/** Stores */
const MessagesStore = useMessagesStore();
const conversationStore = useConversationStore();
const userStore = useUserStore();
const loggedUserId = ref(userStore.user.id);

/** Props */
const props = defineProps({
  conversationData: { type: Object, required: true }
});

/** Emits */
const emits = defineEmits(['close']);

/** Reactive state for grouped messages */
const { messages, messagesContainer, scrollToBottom, loading } = useChatMessages(
  props,
  MessagesStore,
  conversationStore,
  userStore,
  axiosClient,
  window.Echo
);
const groupedMessages = computed(() => groupMessagesByDate(messages.value));

/** Photo viewer composable */
const { currentAttachments, isPhotoModalOpen, currentImageIndex, openImageViewer } = usePhotoViewer(
  computed(() => groupMessagesByDate(messages.value))
);

/** Viewport tracking for responsive layout */
const { viewportHeight, windowWidth } = useViewport();

/** Send message composable */
const { sendLoading, error, handleSendMessage } = useSendMessage(
  MessagesStore,
  conversationStore,
  axiosClient,
  loggedUserId,
  scrollToBottom
);

/**
 * Sends a new message
 * @param {Object} formData - The message form data
 */
function onSubmit(formData) {
  handleSendMessage(formData, props.conversationData.id);
}

/**
 * Closes the chat panel
 */
function handleCloseChat() {
  emits('close');
}

/**
 * Formats a date string to HH:MM
 * @param {string} dateString 
 * @returns {string} formatted time
 */
function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
</script>
