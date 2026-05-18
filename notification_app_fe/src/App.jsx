import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Snackbar,
  Alert,
  Button,
  CircularProgress,
  ThemeProvider,
  createTheme
} from '@mui/material';
import './App.css';
import PriorityInbox from './components/PriorityInbox';
import NotificationList from './components/NotificationList';
import NotificationFilter from './components/NotificationFilter';
import { fetchNotifications, setAuthToken } from './services/notificationService';
import { LogInfo, LogError, LogDebug } from './utils/logger';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2'
    },
    secondary: {
      main: '#dc004e'
    },
    background: {
      default: '#f5f5f5'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    }
  }
});

function App() {
  const [notifications, setNotifications] = useState([]);
  const [viewedNotifications, setViewedNotifications] = useState(new Set());
  const [selectedType, setSelectedType] = useState(null);
  const [viewStatus, setViewStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      LogInfo('frontend', 'App', 'Starting notification fetch...');

      const data = await fetchNotifications();
      setNotifications(data);

      LogInfo('frontend', 'App', `Successfully loaded ${data.length} notifications`);
      showSnackbar(`Loaded ${data.length} notifications`, 'success');
    } catch (err) {
      LogError('frontend', 'App', `Failed to load notifications: ${err.message}`);
      setError(err.message);
      showSnackbar('Failed to load notifications. Check your API token.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewNotification = (notificationId) => {
    LogDebug('frontend', 'App', `Marking notification ${notificationId} as viewed`);
    setViewedNotifications(prev => new Set([...prev, notificationId]));
  };

  const handleTypeChange = (newType) => {
    setSelectedType(newType);
  };

  const handleViewStatusChange = (newStatus) => {
    setViewStatus(newStatus);
  };

  const handleAuthTokenSubmit = (token) => {
    setAuthToken(token);
    LogInfo('frontend', 'App', 'API token configured, reloading notifications...');
    loadNotifications();
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRefresh = () => {
    LogInfo('frontend', 'App', 'User clicked refresh');
    loadNotifications();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {/* App Bar */}
        <AppBar position="sticky" sx={{ mb: 3 }}>
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              📬 Campus Notifications
            </Typography>
            <Button
              color="inherit"
              onClick={handleRefresh}
              disabled={isLoading}
              sx={{ mr: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : '🔄 Refresh'}
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {/* Sidebar - Filters */}
            <Grid item xs={12} md={3}>
              <Box sx={{ position: { md: 'sticky' }, top: { md: 100 } }}>
                <NotificationFilter
                  selectedType={selectedType}
                  onTypeChange={handleTypeChange}
                  viewStatus={viewStatus}
                  onViewStatusChange={handleViewStatusChange}
                  onAuthTokenSubmit={handleAuthTokenSubmit}
                />
              </Box>
            </Grid>

            {/* Main Content Area */}
            <Grid item xs={12} md={9}>
              {/* Error Alert */}
              {error && !isLoading && (
                <Alert
                  severity="error"
                  onClose={() => setError(null)}
                  sx={{ mb: 2 }}
                >
                  <strong>Error:</strong> {error}
                </Alert>
              )}

              {/* Priority Inbox */}
              {!isLoading && notifications.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <PriorityInbox
                    notifications={notifications}
                    viewedNotifications={viewedNotifications}
                    onViewNotification={handleViewNotification}
                  />
                </Box>
              )}

              {/* All Notifications */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  📋 All Notifications
                </Typography>
                <NotificationList
                  notifications={notifications}
                  viewedNotifications={viewedNotifications}
                  onViewNotification={handleViewNotification}
                  filters={{
                    type: selectedType,
                    viewStatus: viewStatus
                  }}
                  isLoading={isLoading}
                  error={error}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Snackbar Notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
