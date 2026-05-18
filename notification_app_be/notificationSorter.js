/**
 * Notification Sorting Algorithm - Stage 1
 * 
 * Priority Logic:
 * 1. Type Weight: Placement (3) > Result (2) > Event (1)
 * 2. Recency: Latest timestamp first
 * 
 * Returns top 10 notifications based on priority
 */

/**
 * Define type weights for priority
 */
const TYPE_WEIGHTS = {
  'Placement': 3,
  'Result': 2,
  'Event': 1
};

/**
 * Parse timestamp string to Date object
 * Format: "2026-04-22 17:51:30"
 */
function parseTimestamp(timestampStr) {
  return new Date(timestampStr);
}

/**
 * Calculate priority score for a notification
 * Higher score = higher priority
 * 
 * @param {Object} notification - Notification object
 * @param {string} notification.Type - Type: Placement, Result, or Event
 * @param {string} notification.Timestamp - ISO format or "YYYY-MM-DD HH:mm:ss"
 * @returns {number} Priority score
 */
function calculatePriority(notification) {
  const typeWeight = TYPE_WEIGHTS[notification.Type] || 0;
  const timestamp = parseTimestamp(notification.Timestamp);
  const timestampScore = timestamp.getTime(); // Higher for recent = higher priority

  // Combined score: type weight (multiplied for higher impact) + timestamp
  // This ensures type takes precedence but recency acts as tiebreaker
  return typeWeight * 1000000000 + timestampScore;
}

/**
 * Sort notifications by priority and return top N
 * 
 * @param {Array} notifications - Array of notification objects
 * @param {number} topN - Number of top notifications to return (default: 10)
 * @returns {Array} Top N notifications sorted by priority
 */
export function getPriorityNotifications(notifications, topN = 10) {
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return [];
  }

  // Calculate priority for each notification
  const notificationsWithPriority = notifications.map(notif => ({
    ...notif,
    priority: calculatePriority(notif)
  }));

  // Sort by priority (descending) - highest priority first
  const sorted = notificationsWithPriority.sort((a, b) => b.priority - a.priority);

  // Return top N, removing the priority score from response
  return sorted.slice(0, topN).map(({ priority, ...notif }) => notif);
}

/**
 * Filter notifications by type
 */
export function filterByType(notifications, type) {
  return notifications.filter(n => n.Type === type);
}

/**
 * Get statistics about notifications
 */
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
