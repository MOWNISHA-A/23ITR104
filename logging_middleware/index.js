/**
 * Reusable Logging Middleware for Notification System
 * 
 * Function signature: Log(stack, level, package, message)
 * Makes an API call to the test server for each log entry
 * 
 * Levels: DEBUG, INFO, WARN, ERROR
 * Stack: backend, frontend, middleware, etc.
 */

import axios from 'axios';

// Configuration for test server
const TEST_SERVER_URL = process.env.LOG_SERVER_URL || 'http://localhost:3001/api/logs';

/**
 * Log function to be used throughout the application
 * @param {string} stack - The layer where log originated (e.g., 'backend', 'frontend', 'middleware')
 * @param {string} level - Log level: DEBUG, INFO, WARN, ERROR
 * @param {string} packageName - The package/module name generating the log
 * @param {string} message - Descriptive log message with context
 * @returns {Promise<void>}
 */
export async function Log(stack, level, packageName, message) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    stack,
    level,
    package: packageName,
    message
  };

  try {
    // Send log to test server
    await axios.post(TEST_SERVER_URL, logEntry, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(err => {
      // Fallback: log to console if server unavailable
      console.log(`[${level}] [${stack}] [${packageName}] ${message}`);
    });
  } catch (error) {
    // Silent fail - prevent logging from breaking application
    console.error('Logging middleware error:', error.message);
  }
}

/**
 * Helper functions for common log levels
 */
export const LogDebug = (stack, pkg, msg) => Log(stack, 'DEBUG', pkg, msg);
export const LogInfo = (stack, pkg, msg) => Log(stack, 'INFO', pkg, msg);
export const LogWarn = (stack, pkg, msg) => Log(stack, 'WARN', pkg, msg);
export const LogError = (stack, pkg, msg) => Log(stack, 'ERROR', pkg, msg);

export default { Log, LogDebug, LogInfo, LogWarn, LogError };
