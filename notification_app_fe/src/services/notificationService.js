/**
 * Notification Service
 * Handles all API communication with the notification backend
 */

import axios from 'axios';
import { LogInfo, LogError, LogDebug } from '../utils/logger';

const API_BASE_URL = 'http://4.224.186.213/evaluation-service';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Fetch all notifications from API
 */
export async function fetchNotifications(filters = {}) {
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

/**
 * Set API token for authenticated requests
 */
export function setAuthToken(token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  LogDebug('frontend', 'NotificationService', 'API token configured');
}

export default {
  fetchNotifications,
  setAuthToken
};
