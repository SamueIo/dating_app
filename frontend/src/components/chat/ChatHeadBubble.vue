<template>


  <div @click="onClick" 
    class="relative w-14 h-14 flex-shrink-0">
    <img
      :src="`/storage/${conversation.other_user.main_photo.file_name}`"
      alt="user photo"
      class="w-14 h-14 rounded-full object-cover"
      draggable="false"
    />

    <!-- Mini správa -->
    <div
      v-if="showMessages && chatUIStore.showLastMessageBubbles[conversation.id] && conversation.last_message?.user_id !== loggedUserId"
      class="absolute right-16 top-1/2 -translate-y-1/2 bg-white/70 text-black shadow-md px-3 
             rounded-xl max-w-[240px] w-fit text-sm z-10 line-clamp-2"
    >
      <p class="break-words whitespace-normal leading-snug">
        {{ conversation.last_message.body || 'New message...' }}
      </p>
    </div>

    <!-- Notifikačná bodka -->
    <span
      v-if="conversation.last_message && conversation.last_message?.user_id !== loggedUserId && conversation.last_message?.seen !== 1"
      class="absolute top-[-3px] right-[-3px] block w-3 h-3 bg-red-500 rounded-full border-2 border-white"
      title="New message"
      ></span>
    </div>
</template>

<script setup>
import { useChatUIStore } from '@/store/chatUIStore';
// import { useChatUIStore } from '../../store/chatUIStore';

const props = defineProps({
  conversation: Object,
  loggedUserId: [Number, String],
  showMessages: {
    type: Boolean,
    default: true,
  },
});


const emit= defineEmits(['select'])

function onClick(){
  emit('select', props.conversation)
}
const chatUIStore = useChatUIStore();
</script>
