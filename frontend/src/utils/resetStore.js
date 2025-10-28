import { useChatUIStore } from "@/store/chatUIStore";
import { useConversationStore } from "@/store/conversationsAndLastMessage";
import { useFilterStore } from "@/store/filterStore";
import { useMatchesStore } from "@/store/matches";
import { useMessagesStore } from "@/store/messages";
import { useActiveConversationStore } from "@/store/useActiveConversationStore";
import useUserStore from "@/store/user";
import { useUserActivityStore } from "@/store/userActivity";



export function resetAllStores() {

    useChatUIStore().reset();

    useConversationStore().$reset();
    useFilterStore().$reset();
    useMatchesStore().$reset();
    useMessagesStore().$reset();
    useActiveConversationStore().$reset();
    useUserStore().$reset();
    useUserActivityStore().$reset();
}