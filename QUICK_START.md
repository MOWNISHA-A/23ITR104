# Campus Notification System - Quick Start Guide

## ✅ What's Ready

Your complete notification system is now ready for testing. All code has been implemented and committed to GitHub.

### What's Included:

```
✅ Logging Middleware      - Reusable Log(stack, level, package, message)
✅ Stage 1 Backend         - Notification sorting algorithm (O(n log n))
✅ Stage 2 Frontend        - React app with Material UI
✅ Documentation           - Comprehensive design document
✅ Git Commits             - Regular commits to GitHub
```

---

## 🚀 Quick Start - Frontend Testing

### Step 1: Navigate to Frontend
```bash
cd c:\Users\mowni\23ITR104\notification_app_fe
```

### Step 2: Install Dependencies (First Time Only)
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

Expected output:
```
  VITE v8.0.12  ready in 245 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 4: Open in Browser
Navigate to: **http://localhost:5173/** (or 3000 if configured)

---

## 🎯 Testing the Application

### Setup & First Run

1. **App loads with:**
   - AppBar with "Campus Notifications" title
   - Left sidebar with filter controls
   - Right sidebar with notifications

2. **Configure API Token:**
   - Click "🔐 Configure API Token" button in sidebar
   - Enter your API bearer token
   - Click "Save Token"
   - App will automatically fetch notifications

3. **View Notifications:**
   - **Priority Inbox:** Top 10 notifications (sorted by type, then recency)
   - **All Notifications:** Complete list with statistics
   - **Filter by Type:** Placement, Result, Event
   - **Filter by Status:** All, Unread, Read

### Features to Test

#### 1. Priority Inbox
- [ ] Click on a notification to mark as "viewed"
- [ ] Check that Placement notifications appear first
- [ ] Within same type, verify latest timestamp is highest
- [ ] Unread indicator (pulsing dot) disappears after viewing

#### 2. Filtering
- [ ] Click "💼 Placement" - shows only placement notifications
- [ ] Click "📊 Result" - shows only result notifications
- [ ] Click "📅 Event" - shows only event notifications
- [ ] Click "All Types" - shows all notifications
- [ ] Click "Unread" - shows only unread notifications
- [ ] Click "Read" - shows only read notifications
- [ ] Combine filters (e.g., Placement + Unread)

#### 3. User Experience
- [ ] Notifications show correct type badges (color-coded)
- [ ] Timestamps show relative time (e.g., "2h ago")
- [ ] Cards have hover animations
- [ ] Statistics update when filters change
- [ ] Loading spinner shows during API calls
- [ ] Error messages appear if API fails

#### 4. Responsive Design
Test on different screen sizes:
- [ ] **Desktop (> 960px):** Sidebar on left, main content on right
- [ ] **Tablet (600-960px):** Single column, responsive layout
- [ ] **Mobile (< 600px):** Full-width, optimized typography

Use browser DevTools:
```
F12 → Device Toolbar (Ctrl+Shift+M) → Select "iPhone 12" or similar
```

#### 5. Refresh & Performance
- [ ] Click "🔄 Refresh" button
- [ ] Verify notifications reload
- [ ] Check Network tab (F12) for API calls
- [ ] Performance should be < 2 seconds for load

---

## 📱 Testing on Mobile Devices

### Using Browser DevTools (Easiest)
1. Open DevTools: `F12`
2. Click Device Toolbar: `Ctrl+Shift+M`
3. Select device (iPhone, iPad, Android)
4. Test all features

### Using Actual Mobile Device
1. Find your PC's IP address:
   ```bash
   ipconfig
   # Look for "IPv4 Address"
   ```

2. On mobile, navigate to:
   ```
   http://<YOUR_PC_IP>:5173/
   ```

3. Test all features on mobile screen

---

## 🎥 Recording Video (For Submission)

### What to Record

Record a screen video showing:

1. **Application Load** (10 seconds)
   - Show the initial page load
   - Display the AppBar and layout

2. **API Setup** (15 seconds)
   - Click "🔐 Configure API Token"
   - Enter token
   - Show notifications loading
   - Snackbar notification: "Loaded X notifications"

3. **Priority Inbox** (20 seconds)
   - Scroll through priority inbox
   - Point out top 10 notifications
   - Show type badges (Placement, Result, Event)
   - Click a notification to mark as viewed
   - Unread indicator disappears

4. **Type Filtering** (30 seconds)
   - Select "💼 Placement" filter
   - Show only placement notifications
   - Switch to "📊 Result"
   - Show only result notifications
   - Return to "All Types"

5. **Status Filtering** (20 seconds)
   - Click "Unread" to show unread only
   - Click "Read" to show read only
   - Click "All" to show all

6. **Statistics** (10 seconds)
   - Point out statistics bar
   - Show total count and breakdown by type

7. **Responsive Design Demo** (30 seconds)
   - Open DevTools (F12)
   - Enable Device Toolbar (Ctrl+Shift+M)
   - Show iPhone view
   - Scroll and interact with notifications
   - Show iPad view
   - Show that layout adapts properly

8. **Error Handling** (Optional, 10 seconds)
   - Clear the token
   - Try to refresh
   - Show error message
   - Reconfigure token

### Recording Tools

**Windows:**
- Built-in: Windows + G (Game Bar)
- Free: OBS Studio (obs-project.com)
- Easy: ScreenFlow or Camtasia

**Mac:**
- Built-in: Command + Shift + 5
- Free: OBS Studio

**Linux:**
- OBS Studio
- SimpleScreenRecorder

### Recording Tips
- Duration: 2-3 minutes
- Clear narration explaining each feature
- Smooth, slow interactions
- Show all required functionality
- Include responsive design demo
- Good lighting and clear audio

---

## 🔍 Troubleshooting

### Issue: "Cannot find localhost:5173"
**Solution:**
- Check terminal shows "VITE ready"
- Clear browser cache (Ctrl+Shift+Delete)
- Try `npm run dev` again
- Try different port: `npm run dev -- --port 3000`

### Issue: "API Token Error"
**Solution:**
- Verify token format: Should start with "Bearer" or just the token
- Check token is valid for the API endpoint
- Verify network connection
- Check browser console (F12 → Console) for details

### Issue: "Notifications not loading"
**Solution:**
- Ensure API token is set
- Check network tab (F12 → Network)
- Verify API endpoint is accessible
- Look for CORS errors in console

### Issue: "Page looks broken / styles missing"
**Solution:**
- Clear cache: Ctrl+Shift+Delete
- Hard refresh: Ctrl+Shift+R
- Close DevTools and reopen
- Restart `npm run dev`

### Issue: "Mobile view not responsive"
**Solution:**
- Close DevTools, reopen (DevTools can interfere)
- Try different device in Device Toolbar
- Zoom out browser to see full page
- Check that CSS loaded properly (F12 → Sources)

---

## 📋 Final Checklist Before Submission

- [ ] Frontend runs without errors: `npm run dev`
- [ ] API token can be configured
- [ ] Notifications load from API
- [ ] Priority inbox shows top 10
- [ ] Type filtering works (Placement, Result, Event)
- [ ] Status filtering works (All, Unread, Read)
- [ ] Clicking notification marks as viewed
- [ ] Statistics update correctly
- [ ] Mobile view is responsive
- [ ] Error handling works
- [ ] No console errors (F12 → Console)
- [ ] Video recorded (2-3 minutes)
- [ ] Git commits are present

---

## 📚 Documentation References

| File | Purpose |
|------|---------|
| `notification_system_design.md` | Complete system architecture & algorithm |
| `IMPLEMENTATION_SUMMARY.md` | What was built and how |
| `notification_app_fe/README.md` | Frontend setup & components |
| `notification_app_be/README.md` | Backend setup & testing |

---

## 🎓 Key Points to Mention in Video

1. **Priority Algorithm:**
   - Two-tier sorting: Type (3-2-1) then Recency
   - O(n log n) complexity, <10ms for 100 notifications

2. **Responsive Design:**
   - Desktop: 3-9 column grid layout
   - Mobile: Single column optimized view
   - Material UI breakpoints at 600px, 960px

3. **User Experience:**
   - Integrated logging for debugging
   - Error messages with context
   - Loading states during API calls
   - Visual feedback on interactions

4. **Code Quality:**
   - Component composition (NotificationCard, NotificationList, etc.)
   - Utility functions for reusability
   - Proper state management
   - Accessible Material UI components

---

## 💬 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review `notification_system_design.md` for algorithm details
3. Check browser console for error messages (F12)
4. Verify network requests (F12 → Network tab)
5. Check all git commits are present

---

## 🎉 You're Ready!

Your notification system is complete and ready for demonstration. Follow the testing checklist, record your video, and submit!

**Good luck with your evaluation! 🚀**
