# Campus Notification Backend - Stage 1

## Running the Priority Notification Sorter

### Prerequisites
- Node.js (v18 or higher)
- API Token for the notification service

### Setup

1. Install dependencies:
```bash
npm install
```

2. Set your API token (required for protected API):
```bash
export NOTIFICATION_API_TOKEN="your-api-token-here"
```

Or on Windows:
```cmd
set NOTIFICATION_API_TOKEN=your-api-token-here
```

### Running

Start the notification sorter:
```bash
npm start
```

Or watch mode for development:
```bash
npm run dev
```

## Implementation Details

### Priority Algorithm

The system sorts notifications using a two-tier priority system:

1. **Type Weight** (Primary)
   - Placement: Weight 3
   - Result: Weight 2
   - Event: Weight 1

2. **Recency** (Secondary)
   - Within the same type, latest notifications appear first

### Example Output

```
Step 1: Fetching notifications from API...
✓ Successfully fetched notifications from API
Total notifications received: 15

Step 2: Notification Statistics
Total: 15
Placement: 5
Result: 7
Event: 3

Step 3: Top 10 Priority Notifications
1. [Placement] CSX Corporation hiring
   ID: b283218f-ea5a-4b7c-93a9-1f2f240d64b0
   Time: 2026-04-22 17:51:18

2. [Placement] Google Summer Internship
   ID: a1b2c3d4-e5f6-7890-1234-567890abcdef
   Time: 2026-04-22 17:50:00
...
```

## Files

- `notificationSorter.js` - Core sorting algorithm
- `index.js` - Main entry point that demonstrates Stage 1 functionality
