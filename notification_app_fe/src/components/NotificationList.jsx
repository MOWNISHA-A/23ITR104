import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import NotificationCard from './NotificationCard';
import { applyFilters, getNotificationStats } from '../utils/notificationUtils';
import { LogDebug } from '../utils/logger';

export default function NotificationList({
  notifications,
  viewedNotifications,
  onViewNotification,
  filters = {},
  isLoading = false,
  error = null
}) {
  const filteredNotifications = applyFilters(notifications, {
    ...filters,
    viewedSet: viewedNotifications
  });

  const stats = getNotificationStats(notifications);

  useEffect(() => {
    LogDebug(
      'frontend',
      'NotificationList',
      `Displaying ${filteredNotifications.length} of ${notifications.length} notifications (filter: ${JSON.stringify(filters)})`
    );
  }, [filteredNotifications.length, filters, notifications.length]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        <strong>Error loading notifications:</strong> {error}
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Please check your API token and try again.
        </Typography>
      </Alert>
    );
  }

  if (notifications.length === 0) {
    return (
      <Alert severity="info">
        No notifications available. Check back later for updates!
      </Alert>
    );
  }

  return (
    <Box>
      {/* Statistics Bar */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
          Statistics
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip
            label={`Total: ${stats.total}`}
            variant="outlined"
            size="small"
          />
          <Chip
            label={`💼 Placement: ${stats.byType['Placement']}`}
            variant="filled"
            size="small"
            sx={{ backgroundColor: '#1976d2', color: '#fff' }}
          />
          <Chip
            label={`📊 Result: ${stats.byType['Result']}`}
            variant="filled"
            size="small"
            sx={{ backgroundColor: '#d32f2f', color: '#fff' }}
          />
          <Chip
            label={`📅 Event: ${stats.byType['Event']}`}
            variant="filled"
            size="small"
            sx={{ backgroundColor: '#388e3c', color: '#fff' }}
          />
        </Stack>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Filtered Results Count */}
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Showing {filteredNotifications.length} notification
        {filteredNotifications.length !== 1 ? 's' : ''}
      </Typography>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Alert severity="info">
          No notifications match the selected filters. Try adjusting your filters.
        </Alert>
      ) : (
        <Box>
          {filteredNotifications.map((notif) => (
            <NotificationCard
              key={notif.ID}
              notification={notif}
              isViewed={viewedNotifications.has(notif.ID)}
              onView={onViewNotification}
              isPriority={false}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
