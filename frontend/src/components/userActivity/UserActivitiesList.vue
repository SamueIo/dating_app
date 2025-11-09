<template>
  <!-- Participants list -->
  <ul v-if="conversation" class="space-y-2">
    <li
      v-for="participant in filteredParticipants"
      :key="participant.user_id"
      class="flex items-start space-x-3 bg-black/10 p-3 rounded-3xl shadow text-sm"
    >
      <!-- User info -->
      <div class="flex flex-col">
        <!-- Name -->
        <span class="font-medium text-white">{{ participant.name }}</span>

        <!-- Status -->
        <div class="flex items-center text-xs text-gray-300 mt-1 space-x-1">
          <!-- Online/offline dot -->
          <span
            class="inline-block w-2 h-2 rounded-full"
            :class="participant.is_active ? 'bg-green-400' : 'bg-gray-500'"
            title="Status"
          ></span>

          <!-- Text status with dynamic width -->
          <span
            class="inline-block whitespace-nowrap overflow-hidden transition-[width] duration-300"
            :class="participant.is_active ? 'w-[3.5rem]' : 'w-[10rem]'"
          >
            <span v-if="participant.is_active">Online</span>
            <span v-else>Offline • {{ formatDate(participant.last_active_at) }}</span>
          </span>
        </div>
      </div>
    </li>
  </ul>

  <!-- No participants message -->
  <p v-else class="text-gray-400 italic text-sm">
    {{ loading ? 'Loading...' : 'No participants found' }}
  </p>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useUserActivityStore } from '../../store/userActivity';
import useUserStore from '../../store/user';

// --- Stores ---
const userStore = useUserStore();
const userActivityStore = useUserActivityStore();

// --- Props ---
const props = defineProps({
  conversationId: Number,
});

// --- Reactive state ---
const loading = ref(true);

// --- Computed: current conversation ---
const conversation = computed(() =>
  userActivityStore.conversations.find(c => c.conversation_id === props.conversationId)
);

// --- Computed: filter participants excluding current user ---
const filteredParticipants = computed(() => {
  if (!conversation.value) return [];
  const currentUserId = userStore.user.id;
  return conversation.value.participants.filter(p => p.user_id !== currentUserId);
});

// --- Format last active date/time ---
function formatDate(dateStr) {
  if (!dateStr) return 'offline';

  const inputDate = new Date(dateStr);
  const now = new Date();
  const diffMs = now - inputDate;
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  if (diffDays > 14) return ''; // offline for too long
  if (diffHours < 24) return inputDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return inputDate.toLocaleString([], { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// --- Realtime updates (Echo) ---
let heartbeatInterval;

onMounted(async () => {
  // Initial fetch
  await userActivityStore.fetchUserActivities();
  loading.value = false;

  // Listen to user activity events
  window.Echo.private('user-activity-all')
    .listen('.UserActivityUpdated', (event) => {
      userActivityStore.setUserActivity(event.user_id, {
        last_active_at: event.last_active_at,
        is_active: event.is_active,
      });
    });
});

onUnmounted(() => {
  clearInterval(heartbeatInterval);
});
</script>
