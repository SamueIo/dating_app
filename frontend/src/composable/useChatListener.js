// useChatListener.js
// import { useChatUIStore } from "../store/chatUIStore";
import { useConversationStore } from "../store/conversationsAndLastMessage";
import { useChatUIStore } from '@/store/chatUIStore';
import { useActiveConversationStore } from "../store/useActiveConversationStore";


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

    window.Echo.private(`user.${userId}`)
      .listen('.message.sent', (event) => {
        
        const message = event.message;
        console.log('message',message);
        
        const convId = message.conversation_id;

        const activeId = typeof activeConversationStore.activeConversationID === 'function'
          ? activeConversationStore.activeConversationID()
          : activeConversationStore.activeConversationID;

        if(!chatUIStore.openChats.includes(convId)){
          chatUIStore.openChat(convId)          
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
