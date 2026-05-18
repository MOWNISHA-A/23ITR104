/**
 * Utility functions for notification processing
 */

import { LogDebug } from './logger';

// Type weights for priority
const TYPE_WEIGHTS = {
  'Placement': 3,
  'Result': 2,
  'Event': 1
};

/**
 * Parse timestamp from "YYYY-MM-DD HH:mm:ss" format
 */
export function parseTimestamp(timestampStr) {
  return new Date(timestampStr);
}

/**
 * Format timestamp for display
 */
export function formatTime(timestamp) {
  if (typeof timestamp === 'string') {
    timestamp = parseTimestamp(timestamp);
  }

  const now = new Date();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  // Format as readable date
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return timestamp.toLocaleDateString('en-US', options);
}

/**
 * Calculate priority score for a notification
 */
export function calculatePriority(notification) {
  const typeWeight = TYPE_WEIGHTS[notification.Type] || 0;
  const timestamp = parseTimestamp(notification.Timestamp);
  const timestampScore = timestamp.getTime();

  return typeWeight * 1000000000 + timestampScore;
}

/**
 * Get priority label for badge
 */
export function getPriorityLabel(notification) {
  return TYPE_WEIGHTS[notification.Type] ? notification.Type : 'Other';
}

/**
 * Get color for notification type badge
 */
export function getTypeColor(type) {
  const colors = {
    'Placement': '#1976d2', // Blue
    'Result': '#d32f2f', // Red
    'Event': '#388e3c' // Green
  };
  return colors[type] || '#757575'; // Gray for unknown
}

/**
 * Get icon for notification type
 */
export function getTypeIcon(type) {
  const icons = {
    'Placement': '💼',
    'Result': '📊',
    'Event': '📅'
  };
  return icons[type] || '📢';
}

/**
 * Sort notifications by priority (high to low)
 */
export function sortByPriority(notifications) {
  LogDebug('frontend', 'NotificationUtils', `Sorting ${notifications.length} notifications by priority`);

  const sorted = [...notifications].map((notif) => ({
    ...notif,
    priority: calculatePriority(notif)
  }));

  return sorted.sort((a, b) => b.priority - a.priority).map(({ priority, ...notif }) => notif);
}

/**
 * Get top N notifications
 */
export function getTopNotifications(notifications, topN = 10) {
  const sorted = sortByPriority(notifications);
  return sorted.slice(0, topN);
}

/**
 * Filter notifications by type
 */
export function filterByType(notifications, type) {
  if (!type) return notifications;
  return notifications.filter((notif) => notif.Type === type);
}

/**
 * Filter by view status
 */
export function filterByViewStatus(notifications, viewedSet, status) {
  if (status === 'all') return notifications;
  if (status === 'unread') return notifications.filter((notif) => !viewedSet.has(notif.ID));
  if (status === 'read') return notifications.filter((notif) => viewedSet.has(notif.ID));
  return notifications;
}

/**
 * Apply multiple filters
 */
export function applyFilters(notifications, filters) {
  let filtered = notifications;

  if (filters.type) {
    filtered = filterByType(filtered, filters.type);
  }

  if (filters.viewStatus) {
    filtered = filterByViewStatus(filtered, filters.viewedSet, filters.viewStatus);
  }

  return filtered;
}

/**
 * Get statistics about notifications
 */
export function getNotificationStats(notifications) {
  const stats = {
    total: notifications.length,
    byType: {
      'Placement': 0,
      'Result': 0,
      'Event': 0
    }
  };

  notifications.forEach((notif) => {
    if (stats.byType[notif.Type] !== undefined) {
      stats.byType[notif.Type]++;
    }
  });

  return stats;
}

export default {
  parseTimestamp,
  formatTime,
  calculatePriority,
  getPriorityLabel,
  getTypeColor,
  getTypeIcon,
  sortByPriority,
  getTopNotifications,
  filterByType,
  filterByViewStatus,
  applyFilters,
  getNotificationStats
};
