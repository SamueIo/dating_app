import { defineStore } from "pinia";
import { ref } from "vue";

export const useSiblingsMatchesDataShareStore = defineStore('chat', () => {
    const conversationData = ref(null);
    const matchesChatOpen = ref(false);

    function startConversation(conversation){
        conversationData.value = conversation;
        matchesChatOpen.value = true;
    }

    function closeChat() {
        conversationData.value = (null);
        matchesChatOpen.value = false;
    }

    return { conversationData, matchesChatOpen, startConversation, closeChat };
});
