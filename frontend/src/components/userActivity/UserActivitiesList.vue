<template>
  <ul v-if="conversation" class="space-y-2">
    <li
      v-for="participant in filteredParticipants"
      :key="participant.user_id"
      class="flex items-start space-x-3 bg-black/10 p-3 rounded-3xl shadow text-sm"
    >
      <!-- Info o účastníkovi -->
      <div class="flex flex-col">
        <!-- Meno -->
        <span class="font-medium text-white">{{ participant.name }}</span>

        <!-- Stav s bodkou -->
        <div class="flex items-center text-xs text-gray-300 mt-1 space-x-1">
          <!-- Farebná bodka -->
          <span
            class="inline-block w-2 h-2 rounded-full"
            :class="participant.is_active ? 'bg-green-400' : 'bg-gray-500'"
            title="Status"
          ></span>

          <!-- Textový stav s plynulou šírkou -->
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

  <p v-else class="text-gray-400 italic text-sm">No participants found</p>
</template>


<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useUserActivityStore } from '../../store/userActivity';
import useUserStore from '../../store/user';

const userStore = useUserStore()
const props = defineProps({
  conversationId: Number,
});

const userActivityStore = useUserActivityStore();

// ✅ Získaj konkrétnu konverzáciu zo store
const conversation = computed(() =>
  userActivityStore.conversations.find(c => c.conversation_id === props.conversationId)
);

// ✅ Filtruj len druhého používateľa (nie aktuálne prihláseného)
const filteredParticipants = computed(() => {
  const currentUserId = userStore.user.id;
  
  if (!conversation.value) return [];
    let result = conversation.value.participants.filter(
    participant => participant.user_id !== currentUserId
  );
  
  return result
});


function formatDate(dateStr) {
  if (!dateStr) return 'offline';

  const inputDate = new Date(dateStr);
  const now = new Date();
  const diffMs = now - inputDate;
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  if (diffDays > 14) {
    // Offline príliš dlho – zobraz len "Offline"
    return '';
  }

  if (diffHours < 24) {
    // Menej než 24 hodín – zobraz iba čas
    return inputDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    // Viac než 24 hodín – zobraz dátum + čas
    return inputDate.toLocaleString([], {
      day: 'numeric',
      month: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}




// ✅ Realtime & heartbeat
let heartbeatInterval;
onMounted(() => {

  userActivityStore.fetchUserActivities();
  
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
