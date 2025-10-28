// useChatListener.js
// import { useChatUIStore } from "../store/chatUIStore";
import { useConversationStore } from "../store/conversationsAndLastMessage";
import { useChatUIStore } from '@/store/chatUIStore';
import { useActiveConversationStore } from "../store/useActiveConversationStore";
import axiosClient from "../axios";


let isRegistered = false;

export function useChatListener(userId) {
  const conversationStore = useConversationStore();
  const chatUIStore = useChatUIStore();
  const activeConversationStore = useActiveConversationStore();

  function register() {
    if (!userId || isRegistered) return;
    isRegistered = true;

    if (!conversationStore.messagesByConversation) {
      conversationStore.messagesByConversation = {};
    }

    const channel = window.Echo.private(`user.${userId}`)

      channel.listen('.message.sent',async (event) => {
        
        const message = event.message;
        
        const convId = message.conversation_id;

        const activeId = typeof activeConversationStore.activeConversationID === 'function'
          ? activeConversationStore.activeConversationID()
          : activeConversationStore.activeConversationID;

        if(!chatUIStore.openChats.includes(convId)){
          chatUIStore.openChat(convId)          
        }

        // Creating conversation if its not active
        if (!conversationStore.conversations.some(c => c.id === convId)) {
          await conversationStore.fetchConversations(true);
        }



        if (!conversationStore.messagesByConversation[convId]) {
          conversationStore.messagesByConversation[convId] = [];
        }

        const exists = conversationStore.messagesByConversation[convId].some(m => m.id === message.id);
        if (!exists && convId !== activeId) {
          conversationStore.messagesByConversation[convId].push(message);
          chatUIStore.showBubleFor(convId);
        }

        conversationStore.updateLastMessage(message);
      });
  }

  return { register };
}
