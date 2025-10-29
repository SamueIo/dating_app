<template>
    <div class="fixed inset-0 z-[9990] bg-black/70 
                backdrop-blur-sm flex items-center justify-center"
        @click.self="close">

        <!-- Close button -->
        <button class="absolute z-[9999] top-4 right-4 text-black bg-white/80 
                    w-8 h-8 rounded-full font-bold"
                    @click="close">
            X
        </button>

        <!-- Image -->
        <div class="relative w-full h-full flex items-center justify-center overflow-hidden"
           @touchstart.passive="onTouchstart"
           @touchmove.passive="onTouchMove"
           @touchend="onTouchEnd"
        >
           <Transition name="fade" mode="out-in">
               <img
                 :key="currentIndex"
                 v-if="images.length"
                 alt="clicked photo"
                 :src="`${API_BASE_URL}/storage/${images[currentIndex].url}`"
                 class="max-h-[95vh] max-w-[95vw] select-none object-contain transition-transform duration-300"
               />
           </Transition>
        </div>
             <!-- Navigation arrows -->
        <button
          v-if="images.length > 1"
          @click.stop="prevImage"
          class="absolute left-3 top-1/2 -translate-y-1/2 z-[9999] text-white text-5xl font-bold rounded-full select-none shadow-lg"
        >
          ‹
        </button>
        <button
          v-if="images.length > 1"
          @click.stop="nextImage"
          class="absolute right-3 top-1/2 -translate-y-1/2 z-[9999] text-white text-5xl font-bol  rounded-full select-none shadow-lg"
        >
          ›
        </button>

        <!-- Image counter -->
        <div
          v-if="images.length > 1"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full"
        >
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { API_BASE_URL } from '@/utils/constants';

const props = defineProps({
    images: {
        type: Array,
        required: true
    },
    startIndex: {
        type: Number,
        default: 0
    }
});
console.log('props.images',props.images);

const emits = defineEmits(['close'])

const currentIndex = ref(props.startIndex || 0);

function close(){
    emits('close')
}

function nextImage(){
    if(currentIndex.value < props.images.length -1) currentIndex.value++
    else currentIndex.value = 0
}

function prevImage(){
    if(currentIndex.value > 0) currentIndex.value--
    else currentIndex.value = props.images.length-1
}

// swipehandling
let startX = 0
let endX = 0

function onTouchstart(e) {
    startX = e.touches[0].clientX
} 
function onTouchMove(e) {
  endX = e.touches[0].clientX
}

function onTouchEnd() {
  const diff = startX - endX
  const swipeThreshold = 50 // px

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) nextImage()
    else prevImage()
  }

  startX = 0
  endX = 0
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>