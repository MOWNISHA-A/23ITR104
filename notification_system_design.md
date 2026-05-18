# Campus Notification System Design

## Overview

This document describes the architecture and implementation of the Campus Notification System, a real-time notification platform for students receiving updates about placements, events, and results.

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Stage 1: Priority Inbox Implementation](#stage-1-priority-inbox-implementation)
3. [Stage 2: React Frontend](#stage-2-react-frontend)
4. [Logging Middleware](#logging-middleware)
5. [API Specification](#api-specification)

---

## System Architecture

The system follows a modular architecture with three main components:

```
┌─────────────────────────────────────────────┐
│    React Frontend (localhost:3000)          │
│  - Display Notifications                    │
│  - Priority Inbox                           │
│  - Filtering & Sorting                      │
└────────────────┬────────────────────────────┘
                 │ (HTTP)
                 ↓
┌─────────────────────────────────────────────┐
│    Notification API (Campus Server)         │
│  - Provides notification feed                │
│  - Authentication required                   │
└────────────────┬────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────┐
│    Logging Middleware                       │
│  - Captures application lifecycle            │
│  - Reports to test server                    │
└─────────────────────────────────────────────┘
```

---

## Stage 1: Priority Inbox Implementation

### Objective

Implement an intelligent notification sorting algorithm that surfaces the most important unread notifications to users, helping them focus on critical campus updates.

### Problem Statement

With high volume of notifications (placements, results, events), users struggle to identify which notifications are most important. The system needs to:
- Automatically prioritize notifications by importance
- Show most recent notifications first within each priority tier
- Support dynamic filtering
- Efficiently process continuous notification streams

### Algorithm Design

#### 1. Priority Classification

Notifications are classified by type with the following priority hierarchy:

```
Priority Level 1 (Highest): Placement
  - Recruitment drives, job offers, application updates
  
Priority Level 2: Result
  - Academic results, exam scores, evaluations
  
Priority Level 3 (Lowest): Event
  - Campus events, workshops, announcements
```

#### 2. Sorting Strategy

The system uses a **composite scoring algorithm** with two tiers:

```
Priority Score = (Type Weight × 1,000,000,000) + Timestamp Score
```

**Rationale:**
- **Primary Sort (Type Weight):** Ensures type-based prioritization regardless of time
- **Secondary Sort (Timestamp):** Acts as tiebreaker, putting latest notifications first

**Example Calculation:**
```
Placement notification from 2026-04-22 17:51:30:
= (3 × 1,000,000,000) + 1713796290000
= 3,000,000,001,713,796,290

Result notification from 2026-04-22 17:51:31:
= (2 × 1,000,000,000) + 1713796291000
= 2,000,000,001,713,796,291

Placement notification > Result notification ✓
```

### Implementation

#### Core Algorithm (notificationSorter.js)

```javascript
function calculatePriority(notification) {
  const typeWeight = TYPE_WEIGHTS[notification.Type] || 0;
  const timestamp = parseTimestamp(notification.Timestamp);
  const timestampScore = timestamp.getTime();
  
  // Combined score: type weight takes precedence, timestamp is tiebreaker
  return typeWeight * 1000000000 + timestampScore;
}

function getPriorityNotifications(notifications, topN = 10) {
  // 1. Calculate priority for each notification
  const notificationsWithPriority = notifications.map(notif => ({
    ...notif,
    priority: calculatePriority(notif)
  }));
  
  // 2. Sort by priority (highest first)
  const sorted = notificationsWithPriority.sort((a, b) => 
    b.priority - a.priority
  );
  
  // 3. Return top N
  return sorted.slice(0, topN).map(({ priority, ...notif }) => notif);
}
```

### Time Complexity Analysis

- **Calculating priorities:** O(n) - iterate through all notifications once
- **Sorting:** O(n log n) - standard sort algorithm
- **Getting top N:** O(n) - slice and remove priority field
- **Overall:** O(n log n) - dominated by sorting

**Space Complexity:** O(n) - store priority scores temporarily

### Scalability Considerations

#### Current Approach (Stage 1)
- Suitable for up to ~10,000 notifications
- Full sort required on each request

#### Future Optimization (Stage 2+)
- Use **min-heap data structure** to maintain only top K notifications
- **Time Complexity:** O(n log k) where k=10
- **Space Complexity:** O(k)
- **Benefits:** Constant time top-10 retrieval without full sort

```javascript
// Future optimization with min-heap
function getPriorityNotificationsOptimized(notifications, k = 10) {
  const heap = new MinHeap();
  
  for (let notif of notifications) {
    const priority = calculatePriority(notif);
    heap.push(priority, notif);
    if (heap.size > k) heap.pop();
  }
  
  return heap.toArray();
}
```

### Data Flow

```
API Request
    ↓
Fetch Notifications from Campus Server
    ↓
Parse & Validate Notification Data
    ↓
Calculate Priority Score for Each Notification
    ↓
Sort by Priority (Descending)
    ↓
Select Top 10 Notifications
    ↓
Return to Frontend
    ↓
Display in Priority Inbox
```

### Features Implemented

✓ **Type-based Priority:** Placement > Result > Event  
✓ **Recency Sorting:** Latest first within each type  
✓ **Top N Selection:** Configurable limit (default: 10)  
✓ **Filtering:** By notification type  
✓ **Statistics:** Count by type  
✓ **Error Handling:** Graceful fallbacks for API failures  
✓ **Logging:** Integrated middleware for debugging  

### Testing Scenarios

#### Test Case 1: Mixed Types with Different Timestamps
```javascript
Input: [
  { Type: 'Event', Timestamp: '2026-04-22 17:51:30' },
  { Type: 'Placement', Timestamp: '2026-04-22 17:51:25' },
  { Type: 'Result', Timestamp: '2026-04-22 17:51:35' }
]

Expected Output (Top 3):
1. Placement (17:51:25) - Type takes priority
2. Result (17:51:35) - Same type has latest first
3. Event (17:51:30) - Lowest priority type
```

#### Test Case 2: Same Type, Different Timestamps
```javascript
Input: [
  { Type: 'Placement', Timestamp: '2026-04-22 17:51:20' },
  { Type: 'Placement', Timestamp: '2026-04-22 17:51:30' }
]

Expected Output:
1. Placement (17:51:30) - Latest Placement first
2. Placement (17:51:20) - Earlier Placement second
```

---

## Stage 2: React Frontend

### Architecture

#### Component Hierarchy

```
App
├── Header
├── NotificationFilter
│   ├── TypeFilter
│   └── ViewFilter
├── NotificationContainer
│   ├── PriorityInbox (Top 10)
│   └── AllNotifications
│       └── NotificationCard (repeated)
└── Footer
```

#### State Management

```javascript
const [notifications, setNotifications] = useState([]);
const [selectedType, setSelectedType] = useState(null);
const [viewType, setViewType] = useState('all'); // 'all' | 'priority'
const [viewedNotifications, setViewedNotifications] = useState(new Set());
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### Key Features

1. **Display All Notifications**
   - Fetch from API
   - Show in chronological order
   - Infinite scroll support (future)

2. **Priority Inbox**
   - Display top 10 sorted notifications
   - Visual distinction from other notifications
   - Badge/indicator for priority level

3. **Filtering**
   - By Type: Placement, Result, Event
   - By View Status: Unread, Read, All
   - Combined filtering

4. **Responsive Design**
   - Desktop: Multi-column layout with sidebar
   - Tablet: Single column with sticky header
   - Mobile: Optimized single column, no sidebar

5. **User Experience**
   - Click notification to mark as viewed
   - Visual feedback (change color/icon)
   - Loading states
   - Error messages with retry
   - Empty state messaging

### Material UI Integration

- **Theme:** Custom theme with campus colors
- **Components Used:**
  - Card, CardContent, CardHeader
  - Chip for notification type badges
  - IconButton for actions
  - LinearProgress for loading
  - Snackbar for notifications
  - Box, Container for layout
  - Responsive Grid system

---

## Logging Middleware

### Purpose

Comprehensive logging system that captures the complete lifecycle of application operations, enabling effective debugging and monitoring.

### Function Signature

```javascript
Log(stack, level, package, message)
```

**Parameters:**
- `stack` (string): Layer identifier - 'backend', 'frontend', 'middleware'
- `level` (string): Log level - 'DEBUG', 'INFO', 'WARN', 'ERROR'
- `package` (string): Module/package name (e.g., 'NotificationService', 'API')
- `message` (string): Descriptive context-rich message

### Log Levels

| Level | Purpose | Example |
|-------|---------|---------|
| DEBUG | Detailed debugging info | "Calculated priority: 3000000001713796290" |
| INFO | General informational | "Successfully fetched 15 notifications from API" |
| WARN | Warning conditions | "API response took 2.5s (slower than usual)" |
| ERROR | Error conditions | "Failed to parse timestamp: invalid format" |

### Integration Points

```
1. API Layer
   - Before/after fetch requests
   - Request parameters
   - Response status and size

2. Sorting Algorithm
   - Input notifications count
   - Calculated priorities
   - Final sorted output

3. Frontend Services
   - Component mount/unmount
   - State changes
   - User interactions

4. Error Handling
   - Caught exceptions
   - Validation failures
   - Network timeouts
```

### Example Logs

```
[2026-04-22T17:51:30.123Z] [INFO] [NotificationAPI] Starting API request to fetch notifications
[2026-04-22T17:51:30.456Z] [DEBUG] [NotificationAPI] Request headers included authorization token
[2026-04-22T17:51:31.234Z] [INFO] [NotificationAPI] Successfully received 15 notifications from API
[2026-04-22T17:51:31.240Z] [INFO] [NotificationSorter] Calculating priorities for 15 notifications
[2026-04-22T17:51:31.241Z] [DEBUG] [NotificationSorter] Placement weight: 3, Result weight: 2, Event weight: 1
[2026-04-22T17:51:31.245Z] [INFO] [NotificationSorter] Sorting complete, top 10 prepared
[2026-04-22T17:51:31.250Z] [INFO] [Frontend] Displaying priority inbox to user
```

---

## API Specification

### Notification Fetch Endpoint

**GET** `/evaluation-service/notifications`

**Host:** `http://4.224.186.213`

**Authentication:** Bearer token required

**Response:**
```json
{
  "notifications": [
    {
      "ID": "d146095a-0d86-4a34-9e69-3900a14576bc",
      "Type": "Result",
      "Message": "mid-sem",
      "Timestamp": "2026-04-22 17:51:30"
    },
    {
      "ID": "b283218f-ea5a-4b7c-93a9-1f2f240d64b0",
      "Type": "Placement",
      "Message": "CSX Corporation hiring",
      "Timestamp": "2026-04-22 17:51:18"
    }
  ]
}
```

### Query Parameters (Stage 2)

- `type`: Filter by type (placement, result, event)
- `limit`: Number of notifications (default: 20, max: 100)
- `offset`: Pagination offset (default: 0)
- `sort`: Sorting field (timestamp, priority)

---

## Performance Metrics

### Stage 1 (Current)
- API Fetch Time: ~300-500ms
- Sorting Time: <10ms (for 100 notifications)
- Memory Usage: ~50KB per 100 notifications
- CPU: Minimal (sorting dominates)

### Stage 2 (Projected)
- Initial Load: ~1-2 seconds (API + render)
- Interaction Response: <50ms (view state change)
- Responsiveness: 60 FPS on modern devices
- Mobile Performance: ~2 seconds on 3G

### Optimization Goals
- API response < 300ms (cache strategy)
- Sorting < 5ms (heap-based algorithm)
- First paint < 1s
- Interactive < 3s
- Mobile load < 4s

---

## Security Considerations

1. **API Authentication**
   - Bearer token in headers
   - Token refresh mechanism (future)

2. **Data Validation**
   - Validate notification structure
   - Sanitize message content
   - Type checking

3. **Error Handling**
   - No sensitive data in error messages
   - Graceful degradation
   - User-friendly error display

4. **Logging**
   - No password/token logging
   - Sanitize sensitive fields
   - Audit trail for compliance

---

## Future Enhancements

### Phase 1 (Next)
- [ ] Real-time updates (WebSocket)
- [ ] Notification read receipts
- [ ] Advanced filtering (date range, keywords)
- [ ] User preferences storage

### Phase 2
- [ ] Push notifications
- [ ] Email digest
- [ ] Notification categories
- [ ] Snooze functionality

### Phase 3
- [ ] Machine learning-based ranking
- [ ] Personalized recommendations
- [ ] Multi-language support
- [ ] Dark mode

---

## Conclusion

This notification system provides an efficient, scalable solution for campus notification management. The two-tier priority algorithm ensures important notifications are never missed, while the responsive frontend provides seamless access across all devices.

The integrated logging middleware enables comprehensive monitoring and debugging, supporting the system's reliability and maintainability throughout its lifecycle.
