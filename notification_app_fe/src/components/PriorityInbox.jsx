import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Alert
} from '@mui/material';
import NotificationCard from './NotificationCard';
import { getTopNotifications } from '../utils/notificationUtils';
import { LogInfo } from '../utils/logger';

export default function PriorityInbox({
  notifications,
  viewedNotifications,
  onViewNotification
}) {
  const priorityNotifs = getTopNotifications(notifications, 10);

  useEffect(() => {
    LogInfo(
      'frontend',
      'PriorityInbox',
      `Displaying ${priorityNotifs.length} priority notifications`
    );
  }, [priorityNotifs.length]);

  if (priorityNotifs.length === 0) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          📌 Priority Inbox
        </Typography>
        <Alert severity="info">No priority notifications at this time</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Card sx={{ mb: 3, backgroundColor: '#f0f7ff', border: '2px solid #1976d2' }}>
        <CardContent>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            📌 Priority Inbox
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="caption" color="textSecondary">
            Top {priorityNotifs.length} notifications sorted by importance and recency
          </Typography>
        </CardContent>
      </Card>

      <Box>
        {priorityNotifs.map((notif) => (
          <NotificationCard
            key={notif.ID}
            notification={notif}
            isViewed={viewedNotifications.has(notif.ID)}
            onView={onViewNotification}
            isPriority={true}
          />
        ))}
      </Box>
    </Box>
  );
}
