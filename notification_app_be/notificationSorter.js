const TYPE_WEIGHTS = {
  'Placement': 3,
  'Result': 2,
  'Event': 1
};

function parseTimestamp(timestampStr) {
  return new Date(timestampStr);
}

function calculatePriority(notification) {
  const typeWeight = TYPE_WEIGHTS[notification.Type] || 0;
  const timestamp = parseTimestamp(notification.Timestamp);
  const timestampScore = timestamp.getTime();

  return typeWeight * 1000000000 + timestampScore;
}

export function getPriorityNotifications(notifications, topN = 10) {
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return [];
  }

  const notificationsWithPriority = notifications.map(notif => ({
    ...notif,
    priority: calculatePriority(notif)
  }));

  const sorted = notificationsWithPriority.sort((a, b) => b.priority - a.priority);

  return sorted.slice(0, topN).map(({ priority, ...notif }) => notif);
}

export function filterByType(notifications, type) {
  return notifications.filter(n => n.Type === type);
}

export function getNotificationStats(notifications) {
  const stats = {
    total: notifications.length,
    byType: {}
  };

  TYPE_WEIGHTS.forEach(type => {
    stats.byType[type] = filterByType(notifications, type).length;
  });

  return stats;
}

export default {
  getPriorityNotifications,
  filterByType,
  getNotificationStats,
  TYPE_WEIGHTS
};
