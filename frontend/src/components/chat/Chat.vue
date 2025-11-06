<template>
<div
  class="flex flex-col px-2 pb-4  max-w-full border border-white/30 rounded shadow chat-container"
  :style="{ height: windowHeight + 'px' }"
>    <div class="flex items-center p-1 md:p-2 space-x-3 w-full">
      <img
        v-if="mainPhotoOfReceiver"
        :src="`${API_BASE_URL}/storage/${mainPhotoOfReceiver}`"
        alt="User photo"
        class="w-13 h-13 rounded-full object-cover border-2 border-purple-500 shadow"
      />
      <UserActivitiesList :conversationId="props.conversationData.id" />
      <button
        @click="handleCloseChat"
        class="ml-auto px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white shadow-lg hover:brightness-110 transition"
      >
        👋 Back
      </button>
    </div>

    <!-- Messages list-->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto border border-white/20 p-2 flex flex-col space-y-2 mb-4 hide-scrollbar "
    >
      <div v-if="loading && !loadedMessages" class="flex-1 flex flex-col justify-end items-center text-gray-500">
        <span class="text-sm">Loading...</span>
      </div>
    
      <div v-else-if="!loading && groupedMessages.length === 0" class="flex-1 flex flex-col justify-end items-center text-gray-500">
        <span class="text-sm">Write your first message</span>
      </div>
      
      <template v-else v-for="(item, index) in groupedMessages" :key="index">
        <!-- Dátumový oddelovač -->
        <div v-if="item.type === 'date'" class="flex justify-center my-2">
          <span class="px-3 py-1 text-xs text-white/80 bg-white/10 rounded-full shadow">
            {{ formatDate(item.date) }}
          </span>
        </div>

        <!-- Správa -->
        <div
          v-else-if="item.type === 'message'"
          :class="[
            'rounded-lg px-1 max-w-[65%] mb-0.5',
            item.data.user_id === loggedUserId
            ? 'message-sent ml-auto text-right'
            : 'message-received mr-auto text-left'
          ]"
        >
          <!-- Text správy -->
          <div v-if="item.data.body" class="break-words whitespace-pre-wrap">
            {{ item.data.body }}
          </div>

          <!-- Prílohy -->
          <div v-if="item.data.attachments && item.data.attachments.length" class="mt-2">
            <template v-if="item.data.attachments.length > 1">
              <div
                class="grid gap-1 "
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

          <!-- Čas a stav -->
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

    <!-- Input -->
    <ChatInput :conversationId="props.conversationData.id" @send="onSubmit" />
  </div>
    <PhotoModal v-if="isPhotoModalOpen"
    :images="currentAttachments"
    :startIndex="currentImageIndex"
    @close="isPhotoModalOpen = false"/>
</template>



<script setup>
import { defineProps, defineEmits } from 'vue';
import { useChatMessages } from '../../composable/useChatMessages';
import { useMessagesStore } from '../../store/messages';
import { useConversationStore } from '../../store/conversationsAndLastMessage';
import useUserStore from '../../store/user';
import axiosClient from '../../axios';
import ChatInput from './ChatInput.vue';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { CheckIcon } from '@heroicons/vue/24/solid'
import { useActiveConversationStore } from '../../store/useActiveConversationStore';
import UserActivitiesList from '../userActivity/UserActivitiesList.vue';
import { useSendMessage } from '../../composable/useSendMessage';
import { API_BASE_URL } from '@/utils/constants';
import PhotoModal from '../modals/PhotoModal.vue';



// Props emits
const props = defineProps({
  conversationData: {
    type: Object,
    required: true
  }
});
const emits = defineEmits(['close']);


const groupedMessages = computed(() => groupMessagesByDate(messages.value))
const loadedMessages = computed(() => groupedMessages.value.length > 0)

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
}
// Stores 
const MessagesStore = useMessagesStore();
const conversationStore = useConversationStore();
const userStore = useUserStore();
const ActiveConversationStore = useActiveConversationStore()

// Photo modal
const currentAttachments= ref([])
const isPhotoModalOpen= ref(false)
const currentImageIndex= ref(0)

// Id of logged user
const loggedUserId = ref(null)
loggedUserId.value = userStore.user.id



// Messages grouped by date 
function groupMessagesByDate(messages) {
  const grouped = [];
  let lastDate = null;

  messages.forEach(msg => {
    const msgDate = new Date(msg.created_at).toDateString();

    if (msgDate !== lastDate) {
      grouped.push({ type: 'date', date: msgDate });
      lastDate = msgDate;
    }

    grouped.push({ type: 'message', data: msg });
  });

  return grouped;
}


// Photo modal 
function openImageViewer(attachments, index){
    const img = attachments[index];
    const globalIndex = allImages.value.findIndex(a => a.url === img.url);

    currentAttachments.value = allImages.value;
    currentImageIndex.value = globalIndex;
    isPhotoModalOpen.value = true;
}
const allImages = computed(() => {
  return groupedMessages.value
    .filter(item => item.type === 'message' && item.data.attachments?.length)
    .flatMap(item => item.data.attachments.filter(a => a.type === 'image'));
})
const handleEsc = (e) => {
  if(e.key === 'Escape' && isPhotoModalOpen){
    isPhotoModalOpen.value = false
  }
}

// window.echo
const windowEcho = window.Echo;

// Composable
const { messages, messagesContainer, scrollToBottom, loading } = useChatMessages(
  props,
  MessagesStore,
  conversationStore,
  userStore,
  axiosClient,
  windowEcho
);

const { sendLoading, error, handleSendMessage } = useSendMessage(MessagesStore, conversationStore, axiosClient, loggedUserId, scrollToBottom);
function onSubmit(formData) {
  handleSendMessage(formData, props.conversationData.id);
  
}

const mainPhotoOfReceiver = computed(() => {
  return props.conversationData.other_user?.main_photo?.file_name || null
})

function handleCloseChat() {

  if(ActiveConversationStore.activeConversationID)ActiveConversationStore.clearActiveConversation()
  emits('close');
}

function formatTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}


// inner width 
const windowHeight = ref(window.innerHeight)
function updateHeight() {
  windowHeight.value = window.innerHeight
}

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
.chat-container {
  position: relative;
  background: 
    linear-gradient(
      to bottom right,
      rgb(120, 15, 70),    /* tmavá fialovo-ružová */
      rgb(90, 10, 110),    /* tmavá fialová */
      rgb(20, 18, 80)      /* tmavá modro-fialová */
    ),
    url('https://www.transparenttextures.com/patterns/soft-wallpaper.png');
  background-blend-mode: overlay; /* jemné prepojenie gradientu a textúry */
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  color: #fff;
}




.message-sent {
  background: linear-gradient(145deg, #7f3fbf 0%, #7c3cbf 100%);
  color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.message-received {
  background: linear-gradient(145deg, #71647f 0%, #726380 100%);
  color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}












@keyframes gradientShift {
  0% {background-position: 0% 50%;}
  50% {background-position: 100% 50%;}
  100% {background-position: 0% 50%;}
}
</style>
