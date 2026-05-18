/**
 * Frontend Logging Wrapper
 * Safely handles logging with console fallback
 */

import axios from 'axios';

const TEST_SERVER_URL = import.meta.env.VITE_LOG_SERVER_URL || 'http://localhost:3001/api/logs';

/**
 * Send log to server
 */
async function sendLogToServer(logEntry) {
  try {
    await axios.post(TEST_SERVER_URL, logEntry, {
      timeout: 3000,
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {
      // Server unavailable, fallback to console
      console.log(`[${logEntry.level}] [${logEntry.stack}] [${logEntry.package}] ${logEntry.message}`);
    });
  } catch (error) {
    // Prevent logging from breaking the application
    console.error('[LogError]', error.message);
  }
}

/**
 * Unified logging function for frontend
 * @param {string} stack - 'frontend', 'backend', 'middleware'
 * @param {string} level - 'DEBUG', 'INFO', 'WARN', 'ERROR'
 * @param {string} packageName - Component/module name
 * @param {string} message - Log message
 */
export function Log(stack, level, packageName, message) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    stack,
    level,
    package: packageName,
    message
  };

  // Send to server asynchronously (fire and forget)
  sendLogToServer(logEntry);

  // Also log to console in development
  if (import.meta.env.DEV) {
    const prefix = `[${level}] [${stack}] [${packageName}]`;
    console.log(prefix, message);
  }
}

// Helper functions
export const LogDebug = (stack, pkg, msg) => Log(stack, 'DEBUG', pkg, msg);
export const LogInfo = (stack, pkg, msg) => Log(stack, 'INFO', pkg, msg);
export const LogWarn = (stack, pkg, msg) => Log(stack, 'WARN', pkg, msg);
export const LogError = (stack, pkg, msg) => Log(stack, 'ERROR', pkg, msg);

export default { Log, LogDebug, LogInfo, LogWarn, LogError };
