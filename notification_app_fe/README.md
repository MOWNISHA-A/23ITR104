# Campus Notification System - Frontend

A modern React application for displaying and managing campus notifications with intelligent priority inbox functionality.

## Features

✨ **Priority Inbox** - Top 10 notifications sorted by importance and recency  
📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile  
🎯 **Smart Filtering** - Filter by notification type and view status  
✅ **Read/Unread Tracking** - Visual distinction between viewed and unviewed notifications  
🎨 **Material UI Design** - Clean, modern user interface  
🔄 **Real-time Updates** - Refresh notifications on demand  
🛡️ **Error Handling** - Graceful error messages and retry mechanisms  

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure API Token:
   - Click "🔐 Configure API Token" button in the app
   - Enter your notification service API token
   - Token will be saved in the current session

### Running the Application

**Development Mode (with hot reload):**
```bash
npm run dev
```

The application will start at `http://localhost:3000`

**Production Build:**
```bash
npm run build
```

**Preview Production Build:**
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── NotificationCard.jsx      # Individual notification display
│   ├── NotificationList.jsx       # All notifications list
│   ├── NotificationFilter.jsx     # Filter controls
│   └── PriorityInbox.jsx          # Top 10 priority inbox
├── services/
│   └── notificationService.js     # API communication
├── utils/
│   └── notificationUtils.js       # Helper functions
├── App.jsx                        # Main application component
├── App.css                        # Application styles
├── index.css                      # Global styles
└── main.jsx                       # Entry point
```

## Core Components

### NotificationCard
Displays a single notification with type badge, timestamp, and view status indicator.

### NotificationList
Shows all notifications with filtering and statistics.

### PriorityInbox
Displays top 10 priority notifications sorted by type and recency.

### NotificationFilter
Provides filtering options and API token configuration.

## Notification Types

| Type | Weight | Icon | Color |
|------|--------|------|-------|
| Placement | 3 | 💼 | Blue |
| Result | 2 | 📊 | Red |
| Event | 1 | 📅 | Green |

## Styling

Uses Material UI with custom theme:
- Primary color: `#1976d2` (Blue)
- Secondary color: `#dc004e` (Pink)
- Background: `#f5f5f5` (Light Gray)

## Responsive Design

- **Mobile:** < 600px
- **Tablet:** 600px - 960px
- **Desktop:** > 960px

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Campus Hiring Evaluation - Frontend Track  
Confidential - Afford Medical Technologies Private Limited

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
