import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { LogInfo } from '../utils/logger';

export default function NotificationFilter({
  selectedType,
  onTypeChange,
  viewStatus,
  onViewStatusChange,
  onAuthTokenSubmit,
  onUseMockChange
}) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [token, setToken] = React.useState('');
  const [mockEnabled, setMockEnabled] = React.useState(false);

  const handleTypeChange = (event, newType) => {
    LogInfo('frontend', 'NotificationFilter', `User changed type filter to: ${newType}`);
    onTypeChange(newType);
  };

  const handleViewStatusChange = (event, newStatus) => {
    LogInfo('frontend', 'NotificationFilter', `User changed view status filter to: ${newStatus}`);
    onViewStatusChange(newStatus);
  };

  const handleTokenSubmit = () => {
    if (token.trim()) {
      LogInfo('frontend', 'NotificationFilter', 'API token configured by user');
      onAuthTokenSubmit(token);
      setToken('');
      setOpenDialog(false);
    }
  };

  const toggleMock = () => {
    const next = !mockEnabled;
    setMockEnabled(next);
    LogInfo('frontend', 'NotificationFilter', `Mock mode ${next ? 'enabled' : 'disabled'}`);
    if (onUseMockChange) onUseMockChange(next);
  };

  return (
    <Card sx={{ mb: 3, backgroundColor: '#fafafa' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          🔍 Filters
        </Typography>

        <Stack spacing={2}>
          {/* Type Filter */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Notification Type
            </Typography>
            <ToggleButtonGroup
              value={selectedType}
              exclusive
              onChange={handleTypeChange}
              fullWidth
            >
              <ToggleButton value={null} sx={{ fontSize: '0.9rem' }}>
                All Types
              </ToggleButton>
              <ToggleButton value="Placement" sx={{ fontSize: '0.9rem' }}>
                💼 Placement
              </ToggleButton>
              <ToggleButton value="Result" sx={{ fontSize: '0.9rem' }}>
                📊 Result
              </ToggleButton>
              <ToggleButton value="Event" sx={{ fontSize: '0.9rem' }}>
                📅 Event
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Divider />

          {/* View Status Filter */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              View Status
            </Typography>
            <ToggleButtonGroup
              value={viewStatus}
              exclusive
              onChange={handleViewStatusChange}
              fullWidth
            >
              <ToggleButton value="all" sx={{ fontSize: '0.9rem' }}>
                All
              </ToggleButton>
              <ToggleButton value="unread" sx={{ fontSize: '0.9rem' }}>
                🔔 Unread
              </ToggleButton>
              <ToggleButton value="read" sx={{ fontSize: '0.9rem' }}>
                ✓ Read
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Divider />

          {/* API Token Setup */}
          <Button
            variant="outlined"
            size="small"
            onClick={() => setOpenDialog(true)}
            sx={{ textTransform: 'none' }}
          >
            🔐 Configure API Token
          </Button>
          <Button
            variant={mockEnabled ? 'contained' : 'text'}
            color={mockEnabled ? 'secondary' : 'inherit'}
            size="small"
            onClick={toggleMock}
            sx={{ textTransform: 'none' }}
          >
            {mockEnabled ? 'Using Mock Data' : 'Use Mock Data'}
          </Button>
        </Stack>
      </CardContent>

      {/* Token Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Configure API Token</DialogTitle>
        <DialogContent sx={{ minWidth: 400, pt: 2 }}>
          <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 2 }}>
            Enter your API token for the notification service. This is required to fetch notifications.
          </Typography>
          <TextField
            fullWidth
            label="API Token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Bearer token..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTokenSubmit();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleTokenSubmit}>
            Save Token
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
