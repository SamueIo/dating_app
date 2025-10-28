<template>
  <form @submit.prevent="submit" class="flex flex-col gap-2 w-full">


    <!-- Views -->
    <div class="flex gap-2 flex-wrap mt-1" v-if="previews.length">
      <div
        v-for="(file, index) in previews"
        :key="index"
        class="relative w-16 h-16 border rounded overflow-hidden"
      >
        <img
          v-if="file.type.startsWith('image/')"
          :src="file.preview"
          class="object-cover w-full h-full"
        />
        <video
          v-else-if="file.type.startsWith('video/')"
          :src="file.preview"
          class="object-cover w-full h-full"
          muted
        />
        <span
          v-else
          class="text-[10px] block p-1 truncate text-center"
        >
          {{ file.file.name }}
        </span>

        <button
          class="absolute top-0 right-0 bg-black/60 text-white text-xs px-1"
          @click.prevent="removeFile(index)"
        >
          ×
        </button>
      </div>
    </div>
        <!-- Messages-->
    <div class="flex gap-2">
    <input
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
      class="flex-1 border border-white/80 text-white/90 rounded px-3 py-2"
    />

      <!-- Upload button -->
      <button
        type="button"
        @click="$refs.fileInput.click()"
        class="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
        title="Pridať prílohy"
      >
        📎
      </button>

      <input
        type="file"
        multiple
        ref="fileInput"
        class="hidden"
        @change="handleFiles"
      />

    <button
      type="submit"
      class="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 flex items-center justify-center"
      title="Odoslať správu"
    >
      <ChatBubbleOvalLeftEllipsisIcon class="w-5 h-5" />
    </button>
    </div>

  </form>
</template>

<script setup>

import { ref } from 'vue';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  conversationId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['send']);
const message = ref('');
const attachments = ref([]);
const previews = ref([]);

function submit() {

  if (!message.value.trim() && attachments.value.length === 0 ) return

  const formData= new FormData();

  formData.append('body', message.value || '')
  formData.append('conversation_id', props.conversationId)

  for( const file of attachments.value) {
    formData.append('attachments[]', file);
  }
  emit('send', formData) 

  // reset
  attachments.value = [];
  previews.value = [];
  message.value = ''
}


function handleFiles(event){
  const files = Array.from(event.target.files);
  for( const file of files) {
    const previewUrl = URL.createObjectURL(file);
    attachments.value.push(file);
    previews.value.push({ file, preview : previewUrl , type: file.type})
  }
}

function removeFile(index) {
  attachments.value.splice(index, 1)
  previews.value.splice(index, 1)
}
</script>