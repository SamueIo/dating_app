<template>
  <form @submit.prevent="submit" class="flex flex-col gap-2 w-full">

    <!-- === IMAGE PREVIEWS === -->
    <!-- Displays a grid of uploaded image thumbnails before sending -->
    <div class="flex gap-2 flex-wrap mt-1" v-if="previews.length">
      <div
        v-for="(file, index) in previews"
        :key="index"
        class="relative w-16 h-16 border rounded overflow-hidden"
      >
        <!-- Show only image previews -->
        <img
          v-if="file.type.startsWith('image/')"
          :src="file.preview"
          class="object-cover w-full h-full"
        />
        <!-- Remove file button -->
        <button
          type="button"
          class="absolute top-0 right-0 bg-black/60 text-white text-xs px-1"
          @click.prevent="removeFile(index)"
        >
          ×
        </button>
      </div>
    </div>

    <!-- === MESSAGE INPUT AREA === -->
    <div class="flex gap-2">
      <!-- Text input for chat message -->
      <input
        ref="inputRef"
        type="search"
        name="chatMessage"
        inputmode="text"
        enterkeyhint="send"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="none"
        spellcheck="false"
        v-model="message"
        placeholder="Write a message..."
        class="flex-1 min-w-0 border border-white/80 text-white/90 rounded px-3 py-2"
      />

      <!-- Button to trigger image file picker -->
      <button
        type="button"
        @click="$refs.fileInput.click()"
        class="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
        title="Add image"
      >
        📎
      </button>

      <!-- Hidden file input (only allows image files) -->
      <input
        type="file"
        multiple
        ref="fileInput"
        accept="image/*"
        class="hidden"
        @change="handleFiles"
      />

      <!-- Submit / Send button -->
      <button
        type="submit"
        class="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 flex items-center justify-center"
        title="Send message"
      >
        <ChatBubbleOvalLeftEllipsisIcon class="w-5 h-5" />
      </button>
    </div>
  </form>
</template>

<script setup>
/**
 * Chat input component that allows users to send messages and image attachments.
 * - Users can type a text message.
 * - Users can upload one or multiple images (videos and other files are not allowed).
 * - Shows image previews before sending.
 * - Uses vue-toastification to warn when invalid file types are selected.
 */

import { ref, onMounted, nextTick } from 'vue'
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/vue/24/solid'
import { useToast } from 'vue-toastification'

/**
 * Props
 * @property {string|number} conversationId - ID of the active chat conversation.
 */
const props = defineProps({
  conversationId: {
    type: [String, Number],
    required: true
  }
})

/**
 * Emits
 * @emits send - Emits FormData containing message text and attachments when user sends.
 */
const emit = defineEmits(['send'])

// === Reactive State ===
const message = ref('')             // Chat message input
const attachments = ref([])         // Selected image files
const previews = ref([])            // Image preview data (for UI display)
const inputRef = ref(null)          // Input reference for focus management
const toast = useToast()            // Toast notification instance

/**
 * Submit the message and attachments.
 * Creates a FormData object containing the message body and image files.
 * Emits the data to the parent component for processing (e.g. API upload).
 */
function submit() {
  if (!message.value.trim() && attachments.value.length === 0) return

  const formData = new FormData()
  formData.append('body', message.value || '')
  formData.append('conversation_id', props.conversationId)

  for (const file of attachments.value) {
    formData.append('attachments[]', file)
  }

  emit('send', formData)

  // Reset form fields
  attachments.value = []
  previews.value = []
  message.value = ''
  inputRef.value?.focus()
}

/**
 * Handle file selection.
 * - Accepts only image files.
 * - Displays a toast warning if a non-image file is selected.
 * - Creates preview URLs for display.
 * @param {Event} event - File input change event
 */
function handleFiles(event) {
  const files = Array.from(event.target.files)

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      toast.warning(`Only images can be sent.`, {
        timeout: 4000,
        position: 'top-right'
      })
      continue // Skip invalid files
    }

    const previewUrl = URL.createObjectURL(file)
    attachments.value.push(file)
    previews.value.push({ file, preview: previewUrl, type: file.type })
  }
}

/**
 * Remove a selected file from the attachment and preview lists.
 * @param {number} index - Index of the file to remove
 */
function removeFile(index) {
  attachments.value.splice(index, 1)
  previews.value.splice(index, 1)
}

/**
 * Automatically focus the text input on component mount.
 */
onMounted(() => {
  nextTick(() => {
    inputRef.value?.focus()
  })
})
</script>
