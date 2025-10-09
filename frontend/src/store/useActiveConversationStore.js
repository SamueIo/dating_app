import { defineStore } from "pinia";

export const useActiveConversationStore = defineStore('activeConversation', {
  state: () => ({
    activeConversationID: null,
  }),
  actions: {
    setActiveConversation(id) {
      this.activeConversationID = id;
    },
    clearActiveConversation() {
      this.activeConversationID = null;
    }
  }
});
