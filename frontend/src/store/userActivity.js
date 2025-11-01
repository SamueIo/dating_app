import { defineStore } from 'pinia';
import useUserStore from './user';
import axiosClient from "../axios";

/**
 * UserActivityStore
 * 
 * Manages online/offline status for users.
 * Includes:
 * - fetching all user activities
 * - updating a user’s activity manually or automatically
 * - a heartbeat mechanism to mark users inactive after inactivity
 * - auto-handling browser tab visibility changes and tab close events
 */
export const useUserActivityStore = defineStore('userActivity', {
  state: () => ({
    conversations: [],       // Array of conversations with participants and their activity
    manualStatus: false,     // If true, user manually set status to offline, prevent auto-updates
    heartbeatInterval: null, // Reference to the heartbeat interval timer
    lastActiveAt: null,      // Last timestamp of user activity
  }),

  actions: {

    /**
     * Fetch all user activities from the server
     */
    async fetchUserActivities() {
      try {
        const response = await axiosClient.get('/api/activity');
        this.conversations = response.data;        
      } catch (error) {
        console.error('Error fetching user activities:', error);
      }
    },

    /**
     * Update a specific user's activity locally in the store
     * @param {string} userId - The ID of the user
     * @param {object} activity - Object containing activity properties, e.g. { is_active, last_active_at }
     */
    setUserActivity(userId, activity) {
      this.conversations = this.conversations.map(conversation => {
        const updatedParticipants = conversation.participants.map(participant => {
          if (participant.user_id === userId) {
            return { ...participant, ...activity };
          }
          return participant;
        });
        return { ...conversation, participants: updatedParticipants };
      });
    },

    /**
     * Update user activity on the server and locally
     * @param {boolean} isActive - Whether the user is active or not
     */
    updateUserActivity(isActive) {
      // Respect manual status override
      if (isActive && this.manualStatus) return;

      // Send activity to server
      axiosClient.post('/api/activity', { is_active: isActive })
        .catch(err => console.error('Error updating activity', err));

      // Update local store
      const userStore = useUserStore();
      const currentUserId = userStore.user.id;

      this.setUserActivity(currentUserId, {
        is_active: isActive,
        last_active_at: new Date().toISOString(),
      });

      this.lastActiveAt = new Date();
    },

    /**
     * Toggle manual offline/online status for the current user
     */
    toggleManualStatus() {
      this.manualStatus = !this.manualStatus;
      this.updateUserActivity(!this.manualStatus);
    },

    /**
     * Start heartbeat mechanism
     * Automatically marks user offline if inactive for >5 minutes
     * Pings every 30 seconds and handles tab visibility/unload events
     */
    startHeartbeat() {
      console.log('new heartbeat');
      
      if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

      this.heartbeatInterval = setInterval(() => {
        const now = new Date();
        const diff = this.lastActiveAt ? (now - new Date(this.lastActiveAt)) / 1000 : 0;

        if (diff > 300) { // 5 minutes
          this.updateUserActivity(false);
          console.log('new heartbeat updateUserActivity(false)');
        } else {
        console.log('new heartbeat updateUserActivity(true)');
          this.updateUserActivity(true);
        }
      }, 30000); // every 30s

      // Initial ping
      this.updateUserActivity(true);

      // Handle tab close / page unload
        window.addEventListener('beforeunload', () => {
          const userStore = useUserStore();
          const data = JSON.stringify({ is_active: false });
          navigator.sendBeacon('/api/activity', data);
        });

      // Handle tab visibility change
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) this.updateUserActivity(true);
      });
    },

    /**
     * Stop the heartbeat mechanism
     */
    stopHeartbeat() {
      if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    },
  }
});
