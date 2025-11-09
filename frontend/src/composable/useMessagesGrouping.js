// composables/useMessagesGrouping.js
/**
 * Groups messages by date, inserting "date separators" in the list
 * @param {Array} messages - list of message objects
 * @returns {Array} grouped messages with date separators
 */
export function groupMessagesByDate(messages) {
  const grouped = [];
  let lastDate = null;

  messages.forEach(msg => {
    const msgDate = new Date(msg.created_at).toDateString();

    if (msgDate !== lastDate) {
      grouped.push({ type: 'date', date: msgDate });
      lastDate = msgDate;
    }

    grouped.push({ type: 'message', data: msg });
  });

  return grouped;
}
