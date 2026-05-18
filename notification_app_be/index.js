/**
 * Stage 1: Notification Priority System
 * 
 * Main entry point for testing and demonstrating the notification sorting algorithm
 */

import axios from 'axios';
import { getPriorityNotifications, getNotificationStats, filterByType } from './notificationSorter.js';

// Use your API token here - this is a protected endpoint
const API_URL = 'http://4.224.186.213/evaluation-service/notifications';
const API_TOKEN = process.env.NOTIFICATION_API_TOKEN || 'your-api-token-here';

/**
 * Fetch notifications from the campus notification API
 */
async function fetchNotifications() {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✓ Successfully fetched notifications from API');
    return response.data.notifications || [];
  } catch (error) {
    console.error('✗ Failed to fetch notifications:', error.message);
    if (error.response?.status === 401) {
      console.error('Authentication failed - check your API token');
    }
    throw error;
  }
}

/**
 * Main function to demonstrate Stage 1 functionality
 */
async function main() {
  console.log('═══════════════════════════════════════════════');
  console.log('  Campus Notification System - Stage 1');
  console.log('  Priority Inbox Implementation');
  console.log('═══════════════════════════════════════════════\n');

  try {
    // Step 1: Fetch notifications
    console.log('Step 1: Fetching notifications from API...');
    const allNotifications = await fetchNotifications();
    console.log(`Total notifications received: ${allNotifications.length}\n`);

    if (allNotifications.length === 0) {
      console.log('No notifications available.');
      return;
    }

    // Step 2: Show statistics
    console.log('Step 2: Notification Statistics');
    const stats = getNotificationStats(allNotifications);
    console.log(`Total: ${stats.total}`);
    console.log(`Placement: ${stats.byType['Placement'] || 0}`);
    console.log(`Result: ${stats.byType['Result'] || 0}`);
    console.log(`Event: ${stats.byType['Event'] || 0}\n`);

    // Step 3: Get top 10 priority notifications
    console.log('Step 3: Top 10 Priority Notifications');
    console.log('(Sorted by Type Priority: Placement > Result > Event, then by Recency)\n');
    
    const topNotifications = getPriorityNotifications(allNotifications, 10);

    topNotifications.forEach((notif, index) => {
      console.log(`${index + 1}. [${notif.Type}] ${notif.Message}`);
      console.log(`   ID: ${notif.ID}`);
      console.log(`   Time: ${notif.Timestamp}`);
      console.log('');
    });

    // Step 4: Demonstrate filtering
    console.log('Step 4: Filtering Example - Top 5 Placement Notifications\n');
    const placements = filterByType(allNotifications, 'Placement');
    const topPlacements = getPriorityNotifications(placements, 5);

    topPlacements.forEach((notif, index) => {
      console.log(`${index + 1}. ${notif.Message}`);
      console.log(`   Time: ${notif.Timestamp}`);
      console.log('');
    });

    console.log('═══════════════════════════════════════════════');
    console.log('  Stage 1 execution completed successfully');
    console.log('═══════════════════════════════════════════════');

  } catch (error) {
    console.error('Error during execution:', error.message);
    process.exit(1);
  }
}

// Run the main function
main();
