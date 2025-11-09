// utils/date.js

/**
 * Format a date string into a human-readable format (e.g., "Mon, Jan 1, 2025")
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format a date string to time (e.g., "14:30")
 * @param {string} dateString
 * @returns {string}
 */
export function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
