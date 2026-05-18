import { LogDebug } from './logger';

const TYPE_WEIGHTS = {
  'Placement': 3,
  'Result': 2,
  'Event': 1
};

export function parseTimestamp(timestampStr) {
  return new Date(timestampStr);
}

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

  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return timestamp.toLocaleDateString('en-US', options);
}

export function calculatePriority(notification) {
  const typeWeight = TYPE_WEIGHTS[notification.Type] || 0;
  const timestamp = parseTimestamp(notification.Timestamp);
  const timestampScore = timestamp.getTime();

  return typeWeight * 1000000000 + timestampScore;
}

export function getPriorityLabel(notification) {
  return TYPE_WEIGHTS[notification.Type] ? notification.Type : 'Other';
}

export function getTypeColor(type) {
  const colors = {
    'Placement': '#1976d2',
    'Result': '#d32f2f',
    'Event': '#388e3c'
  };
  return colors[type] || '#757575';
}

export function getTypeIcon(type) {
  const icons = {
    'Placement': '💼',
    'Result': '📊',
    'Event': '📅'
  };
  return icons[type] || '📢';
}

export function sortByPriority(notifications) {
  LogDebug('frontend', 'NotificationUtils', `Sorting ${notifications.length} notifications by priority`);

  const sorted = [...notifications].map((notif) => ({
    ...notif,
    priority: calculatePriority(notif)
  }));

  return sorted.sort((a, b) => b.priority - a.priority).map(({ priority, ...notif }) => notif);
}

export function getTopNotifications(notifications, topN = 10) {
  const sorted = sortByPriority(notifications);
  return sorted.slice(0, topN);
}

export function filterByType(notifications, type) {
  if (!type) return notifications;
  return notifications.filter((notif) => notif.Type === type);
}

export function filterByViewStatus(notifications, viewedSet, status) {
  if (status === 'all') return notifications;
  if (status === 'unread') return notifications.filter((notif) => !viewedSet.has(notif.ID));
  if (status === 'read') return notifications.filter((notif) => viewedSet.has(notif.ID));
  return notifications;
}

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
