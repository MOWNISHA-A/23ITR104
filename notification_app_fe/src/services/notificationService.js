import axios from 'axios';
import { LogInfo, LogError, LogDebug } from '../utils/logger';
import MOCK_NOTIFICATIONS from '../utils/mockNotifications';

const API_BASE_URL = 'http://4.224.186.213/evaluation-service';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function fetchNotifications(filters = {}, options = { useMock: false }) {
  if (options.useMock) {
    LogInfo('frontend', 'NotificationService', 'Returning mock notifications (useMock=true)');
    // simulate async
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_NOTIFICATIONS), 250));
  }

  try {
    LogInfo('frontend', 'NotificationService', 'Starting API request to fetch notifications');

    const response = await apiClient.get('/notifications', { params: filters });

    const notifications = response.data?.notifications || [];
    LogInfo(
      'frontend',
      'NotificationService',
      `Successfully fetched ${notifications.length} notifications from API`
    );

    return notifications;
  } catch (error) {
    LogError(
      'frontend',
      'NotificationService',
      `Failed to fetch notifications: ${error.message}`
    );
    throw error;
  }
}

export function setAuthToken(token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  LogDebug('frontend', 'NotificationService', 'API token configured');
}

export default {
  fetchNotifications,
  setAuthToken
};
