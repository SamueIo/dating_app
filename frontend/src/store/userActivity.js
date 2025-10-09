import { defineStore } from 'pinia';
import useUserStore from './user';
import axiosClient from "../axios";


export const useUserActivityStore = defineStore('userActivity', {
  state: () => ({
    conversations: [],
    manualStatus: false
  }),

  actions: {
    async fetchUserActivities() {
      try {
        const response = await axiosClient.get('/api/activity');
        
        this.conversations = response.data;
      } catch (error) {
        console.error('Chyba pri načítaní aktivít:', error);
      }
    },

    // Tu by si mohol pridať metódu, ktorá podľa user_id alebo conversation_id upraví status účastníka
    setUserActivity(userId, activity) {
      // Prejdeme všetky konverzácie a účastníkov, a ak nájdeme userId, upravíme jeho údaje
      this.conversations = this.conversations.map(conversation => {
        const updatedParticipants = conversation.participants.map(participant => {
          if (participant.user_id === userId) {
            return {
              ...participant,
              ...activity,
            };
          }
          return participant;
        });
        return {
          ...conversation,
          participants: updatedParticipants,
        };
      });
    },

    async updateUserActivity(isActive) {
      if(isActive == true && this.manualStatus == true) return

      try {
        await axiosClient.post('/api/activity', {
          is_active: isActive,
        });

        const userStore = useUserStore();        
        const currentUserId = userStore.user.id;

        this.setUserActivity(currentUserId, {
          is_active: isActive,
          last_active_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Error in updating activity:', err);
      }
    },

    toggleManualStatus() {
      this.manualStatus = !this.manualStatus;

      this.updateUserActivity(!this.manualStatus);
    },
  }
});

