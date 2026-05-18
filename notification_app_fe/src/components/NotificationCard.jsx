/**
 * NotificationCard Component
 * Displays a single notification with type, message, and metadata
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Typography,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { getTypeColor, formatTime, getTypeIcon } from '../utils/notificationUtils';
import { LogDebug } from '../utils/logger';

export default function NotificationCard({
  notification,
  isViewed,
  onView,
  isPriority = false
}) {
  const handleClick = () => {
    LogDebug(
      'frontend',
      'NotificationCard',
      `User clicked notification: ${notification.ID}`
    );
    onView(notification.ID);
  };

  const typeColor = getTypeColor(notification.Type);
  const icon = getTypeIcon(notification.Type);

  return (
    <Card
      onClick={handleClick}
      sx={{
        mb: 2,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundColor: isViewed ? '#f5f5f5' : '#ffffff',
        border: isPriority ? `2px solid ${typeColor}` : '1px solid #e0e0e0',
        borderLeft: isPriority ? `5px solid ${typeColor}` : 'none',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)'
        },
        opacity: isViewed ? 0.7 : 1
      }}
    >
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <span style={{ fontSize: '1.2em' }}>{icon}</span>
            <Typography
              variant="h6"
              sx={{
                fontWeight: isViewed ? 400 : 600,
                fontSize: '0.95rem',
                color: '#333'
              }}
            >
              {notification.Message}
            </Typography>
          </Box>
        }
        action={
          <Box display="flex" alignItems="center" gap={1}>
            {!isViewed && (
              <Tooltip title="Mark as read">
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: typeColor,
                    animation: 'pulse 2s infinite'
                  }}
                />
              </Tooltip>
            )}
            <Chip
              label={notification.Type}
              size="small"
              sx={{
                backgroundColor: typeColor,
                color: '#fff',
                fontWeight: 600
              }}
            />
          </Box>
        }
        sx={{ pb: 1 }}
      />

      <CardContent sx={{ pt: 0 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="textSecondary">
            {formatTime(notification.Timestamp)}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              color: '#999',
              fontSize: '0.7rem'
            }}
          >
            ID: {notification.ID.substring(0, 8)}...
          </Typography>
        </Box>
      </CardContent>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Card>
  );
}
