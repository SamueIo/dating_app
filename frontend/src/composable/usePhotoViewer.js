// composables/usePhotoViewer.js
import { ref, computed } from 'vue';

/**
 * Composable to handle opening and closing photo viewer modal
 */
export function usePhotoViewer(groupedMessages) {
  const currentAttachments = ref([]);
  const isPhotoModalOpen = ref(false);
  const currentImageIndex = ref(0);

  // Flatten all images in groupedMessages for global indexing
  const allImages = computed(() =>
    groupedMessages.value
      .filter(item => item.type === 'message' && item.data.attachments?.length)
      .flatMap(item => item.data.attachments.filter(a => a.type === 'image'))
  );

  /**
   * Open photo viewer modal at a specific image
   * @param {Array} attachments - attachments of the clicked message
   * @param {number} index - index of the clicked attachment in the message
   */
  function openImageViewer(attachments, index) {
    const img = attachments[index];
    const globalIndex = allImages.value.findIndex(a => a.url === img.url);

    currentAttachments.value = allImages.value;
    currentImageIndex.value = globalIndex;
    isPhotoModalOpen.value = true;
  }

  return {
    currentAttachments,
    isPhotoModalOpen,
    currentImageIndex,
    openImageViewer
  };
}
