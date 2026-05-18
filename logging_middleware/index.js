import axios from 'axios';

const TEST_SERVER_URL = process.env.LOG_SERVER_URL || 'http://localhost:3001/api/logs';

export async function Log(stack, level, packageName, message) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    stack,
    level,
    package: packageName,
    message
  };

  try {
    await axios.post(TEST_SERVER_URL, logEntry, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(err => {
      console.log(`[${level}] [${stack}] [${packageName}] ${message}`);
    });
  } catch (error) {
    console.error('Logging middleware error:', error.message);
  }
}

export const LogDebug = (stack, pkg, msg) => Log(stack, 'DEBUG', pkg, msg);
export const LogInfo = (stack, pkg, msg) => Log(stack, 'INFO', pkg, msg);
export const LogWarn = (stack, pkg, msg) => Log(stack, 'WARN', pkg, msg);
export const LogError = (stack, pkg, msg) => Log(stack, 'ERROR', pkg, msg);

export default { Log, LogDebug, LogInfo, LogWarn, LogError };
